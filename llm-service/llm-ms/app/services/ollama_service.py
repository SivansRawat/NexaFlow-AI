"""
Ollama & Cloud LLM Service - Handles communication with local Ollama API
with automatic fallback to Groq / Cloud LLM when Ollama is offline or unavailable.
"""

import aiohttp
import os
from typing import List, Dict
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get configuration from .env
OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
MODEL_NAME = os.getenv("MODEL_NAME", "llama3.2:latest")

# Cloud fallback API configuration (Groq / xAI API)
GROQ_API_KEY = os.getenv("GROQ_API_KEY") or os.getenv("XAI_API_KEY") or ""
GROQ_API_URL = os.getenv("GROQ_API_URL", "https://api.groq.com/openai/v1/chat/completions")
GROQ_MODEL = os.getenv("GROQ_MODEL", "llama-3.1-8b-instant")

class OllamaService:
    """Service to interact with Ollama API with high-speed Cloud LLM fallback"""
    
    @staticmethod
    async def check_health() -> bool:
        """
        Check if Ollama or Cloud LLM is accessible.
        Returns: True if local Ollama OR Cloud API key is available.
        """
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(
                    f"{OLLAMA_BASE_URL}/api/tags",
                    timeout=aiohttp.ClientTimeout(total=2)
                ) as response:
                    if response.status == 200:
                        return True
        except Exception:
            pass

        # If local Ollama is offline, check if Cloud LLM API key is present
        return bool(GROQ_API_KEY)

    @staticmethod
    async def _call_groq_fallback(
        messages: List[Dict],
        temperature: float = 0.7,
        max_tokens: int = 800
    ) -> Dict:
        """
        Fallback call to Groq Cloud API when local Ollama is offline
        """
        if not GROQ_API_KEY:
            raise Exception("Ollama is offline and no GROQ_API_KEY/XAI_API_KEY is configured.")

        headers = {
            "Authorization": f"Bearer {GROQ_API_KEY}",
            "Content-Type": "application/json"
        }

        payload = {
            "model": GROQ_MODEL,
            "messages": messages,
            "temperature": temperature,
            "max_tokens": max_tokens
        }

        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    GROQ_API_URL,
                    json=payload,
                    headers=headers,
                    timeout=aiohttp.ClientTimeout(total=30)
                ) as response:
                    if response.status == 200:
                        data = await response.json()
                        choices = data.get("choices", [])
                        content = choices[0]["message"]["content"] if choices else ""
                        tokens_used = data.get("usage", {}).get("total_tokens", 0)
                        return {
                            "response": content,
                            "model": f"groq/{GROQ_MODEL}",
                            "tokens_used": tokens_used
                        }
                    else:
                        error_text = await response.text()
                        raise Exception(f"Groq API error ({response.status}): {error_text}")
        except Exception as e:
            print(f"❌ Groq API Fallback failed: {e}")
            raise Exception(f"Cloud LLM API fallback error: {str(e)}")

    @staticmethod
    async def generate(
        prompt: str, 
        temperature: float = 0.7, 
        max_tokens: int = 512, 
        model: str = None
    ) -> Dict:
        """
        Generate text using local Ollama, falling back to Groq Cloud API if Ollama is offline.
        """
        model_name = model or MODEL_NAME
        
        # Try local Ollama first
        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    f"{OLLAMA_BASE_URL}/api/generate",
                    json={
                        "model": model_name,
                        "prompt": prompt,
                        "stream": False,
                        "options": {
                            "temperature": temperature,
                            "num_predict": max_tokens,
                            "top_p": 0.9,
                        }
                    },
                    timeout=aiohttp.ClientTimeout(total=5)  # Fast timeout for local check
                ) as response:
                    if response.status == 200:
                        data = await response.json()
                        return {
                            "response": data.get("response", ""),
                            "model": data.get("model", model_name),
                            "tokens_used": data.get("eval_count", 0)
                        }
        except Exception as e:
            print(f"⚠️ Local Ollama generate failed ({e}). Attempting Cloud LLM Fallback...")

        # Fallback to Groq API
        messages = [{"role": "user", "content": prompt}]
        return await OllamaService._call_groq_fallback(messages, temperature, max_tokens)

    @staticmethod
    async def chat(
        messages: List[Dict], 
        temperature: float = 0.7, 
        max_tokens: int = 512, 
        model: str = None
    ) -> Dict:
        """
        Chat completion using local Ollama with fallback to Groq Cloud API.
        """
        model_name = model or MODEL_NAME

        # Convert chat messages to single prompt for local Ollama
        prompt_parts = []
        for msg in messages:
            role = msg.get('role', 'user')
            content = msg.get('content', '')
            if role == 'system':
                prompt_parts.append(f"System: {content}")
            elif role == 'user':
                prompt_parts.append(f"User: {content}")
            elif role == 'assistant':
                prompt_parts.append(f"Assistant: {content}")
        
        prompt_parts.append("Assistant:")
        prompt = "\n\n".join(prompt_parts)

        # Try local Ollama first
        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    f"{OLLAMA_BASE_URL}/api/generate",
                    json={
                        "model": model_name,
                        "prompt": prompt,
                        "stream": False,
                        "options": {
                            "temperature": temperature,
                            "num_predict": max_tokens,
                            "top_p": 0.9,
                        }
                    },
                    timeout=aiohttp.ClientTimeout(total=5)
                ) as response:
                    if response.status == 200:
                        data = await response.json()
                        return {
                            "response": data.get("response", ""),
                            "model": data.get("model", model_name),
                            "tokens_used": data.get("eval_count", 0)
                        }
        except Exception as e:
            print(f"⚠️ Local Ollama chat failed ({e}). Attempting Cloud LLM Fallback...")

        # Fallback to Groq API with structured messages
        return await OllamaService._call_groq_fallback(messages, temperature, max_tokens)

# Create a singleton instance
ollama_service = OllamaService()
