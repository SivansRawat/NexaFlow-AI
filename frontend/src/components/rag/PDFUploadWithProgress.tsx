// frontend/src/components/rag/PDFUploadWithProgress.tsx
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useRAGStore } from '../../store/ragStore';
import { Upload, File, X, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const PDFUploadWithProgress: React.FC = () => {
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const { ingestDocument, isIngesting, progress, error, clearError } = useRAGStore();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    if (!selectedFile || !user) return;
    
    // Validate file type
    if (selectedFile.type !== 'application/pdf') {
      alert('Please upload a PDF file');
      return;
    }
    
    // Validate file size (20MB max)
    if (selectedFile.size > 20 * 1024 * 1024) {
      alert('File size must be less than 20MB');
      return;
    }
    
    setFile(selectedFile);
    clearError();
    
    try {
      await ingestDocument(selectedFile, user.id);
    } catch (err) {
      // Error handled by store
    }
  }, [user, ingestDocument, clearError]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    disabled: isIngesting
  });

  const handleRemoveFile = () => {
    setFile(null);
    clearError();
  };

  return (
    <div className="w-full">
      {/* Dropzone Area */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
          transition-colors duration-200
          ${isDragActive ? 'border-blue-500 bg-blue-900/20' : 'border-gray-600 hover:border-gray-500'}
          ${isIngesting ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-2">
          <Upload className="w-12 h-12 text-gray-400" />
          <p className="text-gray-300">
            {isDragActive ? 'Drop your PDF here...' : 'Drag & drop a PDF here, or click to select'}
          </p>
          <p className="text-sm text-gray-500">Maximum file size: 20MB</p>
        </div>
      </div>

      {/* File Display */}
      {file && (
        <div className="mt-4 p-4 bg-gray-800 rounded-lg border border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <File className="w-5 h-5 text-blue-400" />
              <div>
                <p className="text-white font-medium">{file.name}</p>
                <p className="text-sm text-gray-400">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button
              onClick={handleRemoveFile}
              className="p-1 hover:bg-gray-700 rounded-lg transition-colors"
              disabled={isIngesting}
            >
              <X className="w-5 h-5 text-gray-400 hover:text-white" />
            </button>
          </div>

          {/* Progress Bar */}
          {isIngesting && (
            <div className="mt-3">
              <div className="flex justify-between text-sm text-gray-400 mb-1">
                <span>Processing...</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-blue-600 h-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Success/Error Status */}
          {!isIngesting && progress === 100 && (
            <div className="mt-3 flex items-center gap-2 text-green-400">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm">Document processed successfully!</span>
            </div>
          )}

          {error && (
            <div className="mt-3 flex items-center gap-2 text-red-400">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};