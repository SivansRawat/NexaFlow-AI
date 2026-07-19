import os
import redis

# Safe import for redis.asyncio across different Python versions and IDE interpreters
try:
    import redis.asyncio as aioredis
except AttributeError:
    from redis import asyncio as aioredis

REDIS_HOST = os.getenv("REDIS_HOST", "localhost")
REDIS_PORT = int(os.getenv("REDIS_PORT", 6379))
REDIS_PASSWORD = os.getenv("REDIS_PASSWORD", None)

# Initialize asynchronous Redis client
redis_client = aioredis.Redis(
    host=REDIS_HOST,
    port=REDIS_PORT,
    password=REDIS_PASSWORD if REDIS_PASSWORD else None,
    decode_responses=True
)

async def get_cache(key: str):
    """Retrieve a value from Redis cache"""
    try:
        return await redis_client.get(key)
    except Exception as e:
        print(f"⚠️ Redis get error: {e}")
        return None

async def set_cache(key: str, value: str, ttl: int = 3600):
    """Set a value in Redis cache with expiration in seconds"""
    try:
        await redis_client.set(key, value, ex=ttl)
    except Exception as e:
        print(f"⚠️ Redis set error: {e}")
