"""
Services module - Core business logic
Service singletons are imported directly from their modules.

Keep this package initializer lightweight. Importing every service here makes
the basic LLM chat route depend on optional RAG infrastructure like ChromaDB.
"""
