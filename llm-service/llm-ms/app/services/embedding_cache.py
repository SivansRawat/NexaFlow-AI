# llm-service/llm-ms/app/services/embedding_cache.py
import hashlib
import json
import os
from typing import List, Optional, Dict
import redis
import logging

logger = logging.getLogger(__name__)

class EmbeddingCache:
    """Redis-based cache for embeddings to reduce API calls"""
    
    def __init__(self):
        self.redis_host = os.getenv('REDIS_HOST', 'localhost')
        self.redis_port = int(os.getenv('REDIS_PORT', 6379))
        self.redis_password = os.getenv('REDIS_PASSWORD', None)
        self.default_ttl = int(os.getenv('EMBEDDING_CACHE_TTL', 86400))  # 24 hours
        self._client = None
        
    @property
    def client(self) -> redis.Redis:
        """Lazy initialize Redis client"""
        if self._client is None:
            try:
                self._client = redis.Redis(
                    host=self.redis_host,
                    port=self.redis_port,
                    password=self.redis_password,
                    decode_responses=True,
                    socket_connect_timeout=2,
                    socket_timeout=5,
                )
                # Test connection
                self._client.ping()
                logger.info(f"✅ Connected to Redis at {self.redis_host}:{self.redis_port}")
            except Exception as e:
                logger.warning(f"⚠️ Redis connection failed: {e}. Running without cache.")
                self._client = None
        return self._client
    
    def is_available(self) -> bool:
        """Check if Redis is available"""
        return self.client is not None
    
    def get_cache_key(self, text: str, model: str) -> str:
        """Generate deterministic cache key from text and model"""
        text_hash = hashlib.md5(text.encode('utf-8')).hexdigest()
        model_slug = model.replace(':', '_').replace('/', '_')
        return f"embedding:{model_slug}:{text_hash}"
    
    async def get(self, text: str, model: str) -> Optional[List[float]]:
        """Get cached embedding"""
        if not self.is_available():
            return None
            
        try:
            key = self.get_cache_key(text, model)
            cached = self.client.get(key)
            
            if cached:
                logger.debug(f"✅ Cache hit for key: {key[:20]}...")
                return json.loads(cached)
            
            logger.debug(f"❌ Cache miss for key: {key[:20]}...")
            return None
            
        except Exception as e:
            logger.warning(f"Cache get error: {e}")
            return None
    
    async def set(
        self, 
        text: str, 
        model: str, 
        embedding: List[float], 
        ttl: Optional[int] = None
    ) -> bool:
        """Cache embedding with TTL"""
        if not self.is_available():
            return False
            
        try:
            key = self.get_cache_key(text, model)
            ttl = ttl or self.default_ttl
            
            self.client.setex(
                key, 
                ttl, 
                json.dumps(embedding, ensure_ascii=False)
            )
            
            logger.debug(f"✅ Cached embedding for key: {key[:20]}...")
            return True
            
        except Exception as e:
            logger.warning(f"Cache set error: {e}")
            return False
    
    async def get_batch(
        self, 
        texts: List[str], 
        model: str
    ) -> Dict[str, Optional[List[float]]]:
        """Get cached embeddings for multiple texts"""
        if not self.is_available():
            return {text: None for text in texts}
            
        result = {}
        for text in texts:
            result[text] = await self.get(text, model)
        return result
    
    async def set_batch(
        self, 
        embeddings: Dict[str, List[float]], 
        model: str,
        ttl: Optional[int] = None
    ) -> Dict[str, bool]:
        """Cache multiple embeddings"""
        if not self.is_available():
            return {text: False for text in embeddings}
            
        result = {}
        for text, embedding in embeddings.items():
            result[text] = await self.set(text, model, embedding, ttl)
        return result
    
    async def delete(self, text: str, model: str) -> bool:
        """Delete cached embedding"""
        if not self.is_available():
            return False
            
        try:
            key = self.get_cache_key(text, model)
            self.client.delete(key)
            return True
        except Exception as e:
            logger.warning(f"Cache delete error: {e}")
            return False
    
    async def delete_pattern(self, pattern: str) -> int:
        """Delete all keys matching pattern"""
        if not self.is_available():
            return 0
            
        try:
            keys = self.client.keys(pattern)
            if keys:
                return self.client.delete(*keys)
            return 0
        except Exception as e:
            logger.warning(f"Cache delete pattern error: {e}")
            return 0
    
    async def clear(self) -> bool:
        """Clear all cached embeddings"""
        if not self.is_available():
            return False
            
        try:
            keys = self.client.keys("embedding:*")
            if keys:
                self.client.delete(*keys)
            return True
        except Exception as e:
            logger.warning(f"Cache clear error: {e}")
            return False

# Singleton instance
embedding_cache = EmbeddingCache()