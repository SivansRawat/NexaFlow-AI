// // frontend/src/components/rag/RAGQueryPanel.tsx
// import React, { useState, useCallback } from 'react';
// import { useRAGStore } from '../../store/ragStore';
// import { Send, Loader2, FileText, X } from 'lucide-react';

// interface RAGQueryPanelProps {
//   userId: number;
//   className?: string;
// }

// export const RAGQueryPanel: React.FC<RAGQueryPanelProps> = ({ userId, className = '' }) => {
//   const [query, setQuery] = useState('');
//   const [answer, setAnswer] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [selectedCollection, setSelectedCollection] = useState('');
//   const { collections, getCollections, queryDocument, error, clearError } = useRAGStore();

//   // Load collections on mount
//   React.useEffect(() => {
//     getCollections();
//   }, [getCollections]);

//   const handleSubmit = useCallback(async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!query.trim() || !selectedCollection) return;

//     setIsLoading(true);
//     setAnswer('');
//     clearError();

//     try {
//       const result = await queryDocument(query, selectedCollection);
//       setAnswer(result);
//     } catch (err) {
//       // Error handled by store
//     } finally {
//       setIsLoading(false);
//     }
//   }, [query, selectedCollection, queryDocument, clearError]);

//   return (
//     <div className={`bg-gray-900 rounded-xl p-6 border border-gray-700 ${className}`}>
//       <h3 className="text-xl font-semibold text-white mb-4">RAG Query</h3>
      
//       {/* Collection Selector */}
//       <div className="mb-4">
//         <label className="block text-sm font-medium text-gray-300 mb-2">
//           Select Collection
//         </label>
//         <select
//           value={selectedCollection}
//           onChange={(e) => setSelectedCollection(e.target.value)}
//           className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//         >
//           <option value="">Select a collection...</option>
//           {collections.map((collection) => (
//             <option key={collection} value={collection}>
//               {collection}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Query Input */}
//       <form onSubmit={handleSubmit} className="flex gap-2">
//         <input
//           type="text"
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//           placeholder="Ask a question about your documents..."
//           className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           disabled={isLoading}
//         />
//         <button
//           type="submit"
//           disabled={isLoading || !query.trim() || !selectedCollection}
//           className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
//         >
//           {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
//           Send
//         </button>
//       </form>

//       {/* Error Display */}
//       {error && (
//         <div className="mt-4 p-3 bg-red-900/50 border border-red-700 rounded-lg flex items-center justify-between">
//           <span className="text-red-300 text-sm">{error}</span>
//           <button onClick={clearError} className="text-red-400 hover:text-red-300">
//             <X className="w-4 h-4" />
//           </button>
//         </div>
//       )}

//       {/* Answer Display */}
//       {answer && (
//         <div className="mt-4 p-4 bg-gray-800 rounded-lg border border-gray-700">
//           <div className="flex items-start gap-3">
//             <FileText className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
//             <div className="text-gray-200 whitespace-pre-wrap">{answer}</div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };





// frontend/src/components/rag/RAGQueryPanel.tsx
import React, { useState, useCallback, useEffect } from 'react';
import { useRAGStore } from '../../store/ragStore';
import { Send, Loader2, FileText, X } from 'lucide-react';

interface RAGQueryPanelProps {
  userId: number;
  className?: string;
}

export const RAGQueryPanel: React.FC<RAGQueryPanelProps> = ({ userId, className = '' }) => {
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState('');
  const { collections, getCollections, queryDocument, error, clearError } = useRAGStore();

  // Load collections on mount
  useEffect(() => {
    getCollections();
  }, [getCollections]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || !selectedCollection) return;

    setIsLoading(true);
    setAnswer('');
    clearError();

    try {
      const result = await queryDocument(query, selectedCollection);
      setAnswer(result);
    } catch (err) {
      // Error handled by store
    } finally {
      setIsLoading(false);
    }
  }, [query, selectedCollection, queryDocument, clearError]);

  return (
    <div className={`bg-gray-900 rounded-xl p-6 border border-gray-700 ${className}`}>
      <h3 className="text-xl font-semibold text-white mb-4">RAG Query</h3>
      
      {/* Collection Selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Select Collection
        </label>
        <select
          value={selectedCollection}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedCollection(e.target.value)}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select a collection...</option>
          {collections.map((collection: string) => (
            <option key={collection} value={collection}>
              {collection}
            </option>
          ))}
        </select>
      </div>

      {/* Query Input */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
          placeholder="Ask a question about your documents..."
          className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !query.trim() || !selectedCollection}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          Send
        </button>
      </form>

      {/* Error Display */}
      {error && (
        <div className="mt-4 p-3 bg-red-900/50 border border-red-700 rounded-lg flex items-center justify-between">
          <span className="text-red-300 text-sm">{error}</span>
          <button onClick={clearError} className="text-red-400 hover:text-red-300">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Answer Display */}
      {answer && (
        <div className="mt-4 p-4 bg-gray-800 rounded-lg border border-gray-700">
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
            <div className="text-gray-200 whitespace-pre-wrap">{answer}</div>
          </div>
        </div>
      )}
    </div>
  );
};