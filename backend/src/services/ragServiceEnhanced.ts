// backend/src/services/ragServiceEnhanced.ts
import axios, { AxiosInstance } from 'axios';
import { cacheService } from './cacheService';
import { logger } from '../utils/logger';
import crypto from 'crypto';

interface IngestDocumentRequest {
  documentId: string;
  documentText: string;
  metadata?: Record<string, any>;
  collectionName?: string;
}

interface BatchIngestRequest {
  documentId: string;
  chunks: string[];
  metadata?: Record<string, any>;
  collectionName?: string;
}

interface RetrieveContextResponse {
  chunks: Array<{
    rankNumber: number;
    chunkId: string;
    documentId: string;
    chunkNumber: number;
    text: string;
    distance: number;
    similarity: number;
    metadata: Record<string, any>;
  }>;
  sourceCount: number;
}

interface RAGQueryRequest {
  query: string;
  collectionName?: string;
  nContextChunks?: number;
  temperature?: number;
  maxTokens?: number;
}

interface RAGQueryResponse {
  answer: string;
  context: Array<any>;
  sourceCount: number;
  model: string;
  cached?: boolean;
}

const RAG_SERVICE_URL = process.env.RAG_SERVICE_URL || process.env.LLM_SERVICE_URL || 'http://localhost:8001';

class RAGServiceEnhanced {
  private client: AxiosInstance;
  private cacheTTL = 3600; // 1 hour

  constructor() {
    this.client = axios.create({
      baseURL: RAG_SERVICE_URL,
      timeout: 60000,
    });
  }

  /**
   * Generate cache key for query
   */
  private getCacheKey(query: string, collectionName: string): string {
    const hash = crypto.createHash('md5').update(`${query}:${collectionName}`).digest('hex');
    return `rag:query:${hash}`;
  }

  /**
   * Ingest a document with caching
   */
  async ingestDocument(request: IngestDocumentRequest): Promise<any> {
    try {
      logger.info(`📥 Ingesting document: ${request.documentId}`);
      
      const response = await this.client.post('/api/rag/ingest', {
        document_id: request.documentId,
        document_text: request.documentText,
        metadata: request.metadata,
        collection_name: request.collectionName || 'documents',
      });

      // Clear cache for this collection
      await cacheService.deletePattern(`rag:query:*${request.collectionName}*`);

      logger.info(`✅ Document ingested: ${response.data.chunk_count} chunks`);
      return response.data;
    } catch (error: any) {
      logger.error('❌ Document ingestion failed:', error.message);
      throw new Error(`Failed to ingest document: ${error.message}`);
    }
  }

  /**
   * Batch ingest chunks
   */
  async ingestBatch(request: BatchIngestRequest): Promise<any> {
    try {
      logger.info(`📥 Batch ingesting ${request.chunks.length} chunks for: ${request.documentId}`);
      
      const response = await this.client.post('/api/rag/ingest-batch', {
        document_id: request.documentId,
        chunks: request.chunks,
        metadata: request.metadata,
        collection_name: request.collectionName || 'documents',
      });

      // Clear cache for this collection
      await cacheService.deletePattern(`rag:query:*${request.collectionName}*`);

      logger.info(`✅ Batch ingestion complete: ${response.data.chunk_count} chunks`);
      return response.data;
    } catch (error: any) {
      logger.error('❌ Batch ingestion failed:', error.message);
      throw new Error(`Failed to ingest batch: ${error.message}`);
    }
  }

  /**
   * Retrieve context with cache
   */
  async retrieveContext(
    query: string,
    collectionName: string = 'documents',
    nResults: number = 5
  ): Promise<RetrieveContextResponse> {
    try {
      // Check cache
      const cacheKey = this.getCacheKey(query, collectionName);
      const cached = await cacheService.get<RetrieveContextResponse>(cacheKey);
      
      if (cached) {
        logger.info(`✅ Cache hit for query: "${query}"`);
        return cached;
      }

      logger.info(`🔍 Retrieving context for: "${query}"`);
      
      const response = await this.client.post('/api/rag/retrieve', {
        query,
        collection_name: collectionName,
        n_results: nResults,
      });

      const result: RetrieveContextResponse = {
        chunks: response.data.chunks.map((chunk: any) => ({
          rankNumber: chunk.rank,
          chunkId: chunk.chunk_id,
          documentId: chunk.document_id,
          chunkNumber: chunk.chunk_number,
          text: chunk.text,
          distance: chunk.distance,
          similarity: chunk.similarity,
          metadata: chunk.metadata,
        })),
        sourceCount: response.data.source_count,
      };

      // Cache result
      await cacheService.set(cacheKey, result, this.cacheTTL);

      logger.info(`✅ Retrieved ${result.sourceCount} chunks`);
      return result;
    } catch (error: any) {
      logger.error('❌ Context retrieval failed:', error.message);
      throw new Error(`Failed to retrieve context: ${error.message}`);
    }
  }

  /**
   * Execute RAG query with cache
   */
  async ragQuery(request: RAGQueryRequest): Promise<RAGQueryResponse> {
    try {
      const collectionName = request.collectionName || 'documents';
      
      // Check cache
      const cacheKey = this.getCacheKey(request.query, collectionName);
      const cached = await cacheService.get<RAGQueryResponse>(cacheKey);
      
      if (cached) {
        logger.info(`✅ Cache hit for RAG query: "${request.query}"`);
        return { ...cached, cached: true };
      }

      logger.info(`🤖 RAG Query: "${request.query}"`);
      
      const response = await this.client.post('/api/rag/query', {
        query: request.query,
        collection_name: collectionName,
        n_context_chunks: request.nContextChunks || 5,
        temperature: request.temperature || 0.7,
        max_tokens: request.maxTokens || 512,
      });

      const result: RAGQueryResponse = {
        answer: response.data.answer,
        context: response.data.context,
        sourceCount: response.data.source_count,
        model: response.data.model,
        cached: false,
      };

      // Cache result
      await cacheService.set(cacheKey, result, this.cacheTTL);

      logger.info(`✅ Answer generated using ${result.sourceCount} sources`);
      return result;
    } catch (error: any) {
      logger.error('❌ RAG query failed:', error.message);
      throw new Error(`RAG query failed: ${error.message}`);
    }
  }

  /**
   * Get collection stats with caching
   */
  async getCollectionStats(collectionName: string): Promise<any> {
    try {
      const cacheKey = `rag:stats:${collectionName}`;
      const cached = await cacheService.get(cacheKey);
      
      if (cached) {
        return cached;
      }

      const response = await this.client.get(`/api/rag/collection/${collectionName}/stats`);
      
      await cacheService.set(cacheKey, response.data, 300); // 5 minutes
      
      return response.data;
    } catch (error: any) {
      logger.error('❌ Failed to get collection stats:', error.message);
      throw new Error(`Failed to get collection stats: ${error.message}`);
    }
  }

  /**
   * Check RAG health
   */
  async checkHealth(): Promise<any> {
    try {
      const response = await this.client.get('/api/rag/rag/health');
      return response.data;
    } catch (error: any) {
      logger.error('❌ RAG health check failed:', error.message);
      throw new Error(`RAG health check failed: ${error.message}`);
    }
  }
}

export default new RAGServiceEnhanced();