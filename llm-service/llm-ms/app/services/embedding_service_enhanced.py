# llm-service/llm-ms/app/services/embedding_service_enhanced.py
import aiohttp
import os
from typing import List, Tuple, Optional
from dotenv import load_dotenv
import logging
from .embedding_cache import embedding_cache

load_dotenv()

logger = logging.getLogger(__name__)

OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL", "nomic-embed-text:latest")
CHUNK_SIZE = int(os.getenv("CHUNK_SIZE", "1000"))
CHUNK_OVERLAP = int(os.getenv("CHUNK_OVERLAP", "200"))
USE_CACHE = os.getenv("USE_EMBEDDING_CACHE", "true").lower() == "true"


class EmbeddingServiceEnhanced:
    """Enhanced embedding service with caching and batch processing"""
    
    EMBEDDING_MODEL = EMBEDDING_MODEL
    CHUNK_SIZE = CHUNK_SIZE
    CHUNK_OVERLAP = CHUNK_OVERLAP
    
    @staticmethod
    def chunk_text(
        text: str, 
        chunk_size: int = CHUNK_SIZE, 
        overlap: int = CHUNK_OVERLAP
    ) -> List[Tuple[str, int]]:
        """Split text into overlapping chunks with size limits"""
        if not text or not text.strip():
            return []
        
        chunks = []
        chunk_number = 0
        start = 0
        step = max(chunk_size - overlap, 1)
        
        # Handle very large text by truncating if needed
        max_chars = int(os.getenv("MAX_DOCUMENT_CHARS", "1000000"))
        if len(text) > max_chars:
            logger.warning(f"Text too long ({len(text)} chars), truncating to {max_chars}")
            text = text[:max_chars]
        
        while start < len(text):
            end = min(start + chunk_size, len(text))
            
            # Try to end at a sentence boundary for better chunks
            if end < len(text):
                # Look for sentence boundary within the last 100 chars
                search_start = max(start, end - 100)
                for i in range(end - 1, search_start - 1, -1):
                    if text[i] in '.!?' and (i + 1 == len(text) or text[i + 1] in ' \n'):
                        end = i + 1
                        break
            
            chunk = text[start:end]
            
            if chunk.strip():  # Only add non-empty chunks
                chunks.append((chunk, chunk_number))
                chunk_number += 1
            
            if end >= len(text):
                break
            start = end - overlap if end - overlap > start else end + 1
        
        logger.debug(f"Created {len(chunks)} chunks from text of length {len(text)}")
        return chunks
    
    @staticmethod
    async def generate_embedding(text: str, model: str = None) -> List[float]:
        """Generate embedding with cache support"""
        model_name = model or EMBEDDING_MODEL
        
        # Check cache first
        if USE_CACHE and embedding_cache.is_available():
            cached = await embedding_cache.get(text, model_name)
            if cached is not None:
                logger.debug(f"✅ Cache hit for embedding: {text[:50]}...")
                return cached
        
        # Generate embedding
        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    f"{OLLAMA_BASE_URL}/api/embeddings",
                    json={
                        "model": model_name,
                        "prompt": text
                    },
                    timeout=aiohttp.ClientTimeout(total=60)
                ) as response:
                    if response.status == 200:
                        data = await response.json()
                        embedding = data.get("embedding", [])
                        
                        # Cache the result
                        if USE_CACHE and embedding_cache.is_available() and embedding:
                            await embedding_cache.set(text, model_name, embedding)
                        
                        return embedding
                    else:
                        error_text = await response.text()
                        raise Exception(f"Embedding API error ({response.status}): {error_text}")
        except aiohttp.ClientError as e:
            raise Exception(f"Failed to connect to Ollama for embeddings: {str(e)}")
    
    @staticmethod
    async def generate_embeddings_batch(
        texts: List[str], 
        model: str = None
    ) -> List[List[float]]:
        """Generate embeddings for multiple texts with batch optimization"""
        if not texts:
            return []
        
        # Try to get from cache first
        cached_embeddings = {}
        if USE_CACHE and embedding_cache.is_available():
            cache_results = await embedding_cache.get_batch(texts, model or EMBEDDING_MODEL)
            cached_embeddings = {text: emb for text, emb in cache_results.items() if emb is not None}
        
        # Find texts not in cache
        uncached_texts = [t for t in texts if t not in cached_embeddings]
        
        if not uncached_texts:
            logger.debug(f"✅ All {len(texts)} embeddings from cache")
            return [cached_embeddings[t] for t in texts]
        
        logger.debug(f"Generating embeddings for {len(uncached_texts)} uncached texts")
        
        # Generate embeddings for uncached texts
        embeddings = []
        
        # Process in batches for efficiency
        batch_size = int(os.getenv("EMBEDDING_BATCH_SIZE", "10"))
        for i in range(0, len(uncached_texts), batch_size):
            batch = uncached_texts[i:i + batch_size]
            
            # Generate embeddings concurrently
            import asyncio
            tasks = [EmbeddingServiceEnhanced.generate_embedding(text, model) for text in batch]
            batch_embeddings = await asyncio.gather(*tasks, return_exceptions=True)
            
            # Process results
            for text, result in zip(batch, batch_embeddings):
                if isinstance(result, Exception):
                    logger.error(f"Failed to generate embedding: {result}")
                    embeddings.append([])  # Empty embedding as fallback
                else:
                    embeddings.append(result)
        
        # Map back to original order
        result_map = {}
        
        # Add cached embeddings
        for text, emb in cached_embeddings.items():
            result_map[text] = emb
        
        # Add newly generated embeddings
        for text, emb in zip(uncached_texts, embeddings):
            result_map[text] = emb
        
        return [result_map[t] for t in texts]
    
    @staticmethod
    async def check_embedding_model_available() -> bool:
        """Check if embedding model is available"""
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(
                    f"{OLLAMA_BASE_URL}/api/tags",
                    timeout=aiohttp.ClientTimeout(total=5)
                ) as response:
                    if response.status == 200:
                        data = await response.json()
                        models = data.get("models", [])
                        model_names = [m.get("name") for m in models]
                        available = any(EMBEDDING_MODEL in name for name in model_names)
                        if available:
                            logger.info(f"✅ Embedding model '{EMBEDDING_MODEL}' available")
                        else:
                            logger.warning(f"⚠️ Embedding model '{EMBEDDING_MODEL}' not found")
                        return available
                    return False
        except Exception as e:
            logger.error(f"❌ Failed to check embedding model: {e}")
            return False

# Singleton instance
embedding_service = EmbeddingServiceEnhanced()