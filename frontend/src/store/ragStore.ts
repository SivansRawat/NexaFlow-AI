import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../lib/api';

interface Document {
  id: string;
  fileName: string;
  fileSize: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  chunkCount: number;
  createdAt: string;
}

interface RAGState {
  documents: Document[];
  isIngesting: boolean;
  collections: string[];
  progress: number;
  error: string | null;

  // Actions
  addDocument: (doc: Document) => void;
  ingestDocument: (file: File, userId: number) => Promise<void>;
  queryDocument: (query: string, collectionName: string) => Promise<string>;
  getCollections: () => Promise<string[]>;
  clearError: () => void;
  reset: () => void;
}

// Helper: Chunk text with overlap
function chunkText(text: string, chunkSize: number, overlap: number): string[] {
  const chunks: string[] = [];
  let start = 0;

  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);
    chunks.push(text.slice(start, end));
    start += chunkSize - overlap;
  }

  return chunks;
}

export const useRAGStore = create<RAGState>()(
  persist(
    (set, get) => ({
      documents: [],
      isIngesting: false,
      collections: [],
      progress: 0,
      error: null,

      addDocument: (doc: Document) => {
        set((state: RAGState) => ({
          documents: [doc, ...state.documents]
        }));
      },

      ingestDocument: async (file: File, userId: number) => {
        set({ isIngesting: true, progress: 0, error: null });

        try {
          // Read file as text
          const text = await file.text();

          // Chunk the document
          const chunks = chunkText(text, 1000, 200);
          const totalChunks = chunks.length;

          // Process chunks in batches
          const batchSize = 10;
          let processedChunks = 0;

          for (let i = 0; i < chunks.length; i += batchSize) {
            const batch = chunks.slice(i, i + batchSize);

            // Ingest batch
            await api.post('/api/rag/ingest-batch', {
              document_id: `doc_${Date.now()}_${userId}`,
              chunks: batch,
              metadata: {
                fileName: file.name,
                fileSize: file.size,
                userId,
                uploadedAt: new Date().toISOString()
              },
              collection_name: `user_${userId}_documents`
            });

            processedChunks += batch.length;
            const progress = (processedChunks / totalChunks) * 100;
            set({ progress });
          }

          // Add to document list
          const doc: Document = {
            id: `doc_${Date.now()}`,
            fileName: file.name,
            fileSize: file.size,
            status: 'completed',
            chunkCount: totalChunks,
            createdAt: new Date().toISOString()
          };

          get().addDocument(doc);
          set({ isIngesting: false, progress: 100 });

        } catch (error) {
          set({
            isIngesting: false,
            error: error instanceof Error ? error.message : 'Failed to ingest document'
          });
          throw error;
        }
      },

      queryDocument: async (query: string, collectionName: string) => {
        try {
          const response = await api.post('/api/rag/query', {
            query,
            collection_name: collectionName,
            n_context_chunks: 5,
            temperature: 0.7,
            max_tokens: 512
          });

          return response.data.answer;
        } catch (error) {
          throw new Error('Failed to query documents');
        }
      },

      getCollections: async () => {
        try {
          const response = await api.get('/api/rag/collections');
          set({ collections: response.data.collections });
          return response.data.collections;
        } catch (error) {
          set({ error: 'Failed to fetch collections' });
          return [];
        }
      },

      clearError: () => set({ error: null }),
      reset: () => set({ documents: [], isIngesting: false, progress: 0, error: null })
    }),
    {
      name: 'rag-storage',
      partialize: (state: RAGState) => ({ documents: state.documents })
    }
  )
);