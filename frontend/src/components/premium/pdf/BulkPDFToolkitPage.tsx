import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, Merge, Split, Download, Trash2, AlertCircle } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import { saveAs } from 'file-saver';

type ToolMode = 'merge' | 'split';

const BulkPDFToolkitPage: React.FC = () => {
  const [mode, setMode] = useState<ToolMode>('merge');
  const [files, setFiles] = useState<File[]>([]);
  const [splitPageRanges, setSplitPageRanges] = useState<string>(''); // e.g., "1-3,4-6,7"
  const [processing, setProcessing] = useState(false);

  // Dropzone for merge mode (multiple files)
  const onDropMerge = useCallback((acceptedFiles: File[]) => {
    setFiles(prev => [...prev, ...acceptedFiles]);
  }, []);

  // Dropzone for split mode (single file)
  const onDropSplit = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFiles([acceptedFiles[0]]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: mode === 'merge' ? onDropMerge : onDropSplit,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: mode === 'merge',
  });

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Merge PDFs
  const handleMerge = async () => {
    if (files.length < 2) {
      alert('Please select at least 2 PDF files to merge.');
      return;
    }
    setProcessing(true);
    try {
      const mergedPdf = await PDFDocument.create();
      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        pages.forEach(page => mergedPdf.addPage(page));
      }
      const pdfBytes = await mergedPdf.save();
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
      saveAs(blob, 'merged.pdf');
    } catch (error) {
      console.error('Merge failed:', error);
      alert('Failed to merge PDFs. Please check the files and try again.');
    }
    setProcessing(false);
  };

  // Split PDF by page ranges
  const handleSplit = async () => {
    if (files.length !== 1) {
      alert('Please select exactly one PDF file to split.');
      return;
    }
    if (!splitPageRanges.trim()) {
      alert('Please enter page ranges (e.g., 1-3,4-6,7).');
      return;
    }

    setProcessing(true);
    try {
      const arrayBuffer = await files[0].arrayBuffer();
      const sourcePdf = await PDFDocument.load(arrayBuffer);
      const totalPages = sourcePdf.getPageCount();

      // Parse ranges: "1-3,4-6,7" -> [[1,3],[4,6],[7,7]]
      const ranges = splitPageRanges.split(',').map(part => {
        const trimmed = part.trim();
        if (trimmed.includes('-')) {
          const [start, end] = trimmed.split('-').map(Number);
          return { start, end: end || start };
        } else {
          const page = Number(trimmed);
          return { start: page, end: page };
        }
      });

      for (let i = 0; i < ranges.length; i++) {
        const { start, end } = ranges[i];
        if (isNaN(start) || isNaN(end) || start < 1 || end > totalPages || start > end) {
          alert(`Invalid range: ${ranges[i].start}-${ranges[i].end}. Pages 1-${totalPages}`);
          return;
        }
        const newPdf = await PDFDocument.create();
        const pageIndices = Array.from({ length: end - start + 1 }, (_, idx) => start - 1 + idx);
        const pages = await newPdf.copyPages(sourcePdf, pageIndices);
        pages.forEach(page => newPdf.addPage(page));
        const pdfBytes = await newPdf.save();
        const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
        saveAs(blob, `split_${start}-${end}.pdf`);
      }
      alert('Split completed!');
    } catch (error) {
      console.error('Split failed:', error);
      alert('Failed to split PDF. Check the page ranges.');
    }
    setProcessing(false);
  };

  const handleCompress = () => {
    alert('Compression requires server-side processing. This feature will be available soon.');
  };

  const clearFiles = () => setFiles([]);

  return (
    <div className="w-full max-w-6xl mx-auto bg-[#181c2a] rounded-2xl shadow-2xl p-8 mt-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white">Bulk PDF Toolkit</h1>
        <p className="text-blue-300 mt-2">Merge, split, and compress multiple PDFs</p>
      </div>

      {/* Mode Tabs */}
      <div className="flex gap-4 mb-8 border-b border-blue-900 pb-2">
        <button
          onClick={() => { setMode('merge'); clearFiles(); }}
          className={`px-6 py-2 rounded-t-lg font-semibold transition ${mode === 'merge' ? 'bg-blue-600 text-white' : 'text-blue-300 hover:text-white'}`}
        >
          <Merge className="inline w-4 h-4 mr-2" /> Merge PDFs
        </button>
        <button
          onClick={() => { setMode('split'); clearFiles(); setSplitPageRanges(''); }}
          className={`px-6 py-2 rounded-t-lg font-semibold transition ${mode === 'split' ? 'bg-blue-600 text-white' : 'text-blue-300 hover:text-white'}`}
        >
          <Split className="inline w-4 h-4 mr-2" /> Split PDF
        </button>
        <button
          onClick={handleCompress}
          className="px-6 py-2 rounded-t-lg font-semibold text-blue-300 hover:text-white"
        >
          <Download className="inline w-4 h-4 mr-2" /> Compress
        </button>
      </div>

      {/* Dropzone Area */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-10 cursor-pointer transition text-center ${
          isDragActive ? 'border-blue-400 bg-blue-950' : 'border-blue-900 hover:border-blue-400'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="w-12 h-12 mx-auto mb-4 text-blue-400" />
        {mode === 'merge' ? (
          <p className="text-blue-200">Drop PDF files here or click to browse (multiple files)</p>
        ) : (
          <p className="text-blue-200">Drop a single PDF file here to split</p>
        )}
        <p className="text-blue-400 text-sm mt-2">Max 20MB per file</p>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-white mb-3">
            {mode === 'merge' ? `${files.length} file(s) selected` : 'Selected file:'}
          </h3>
          <div className="space-y-2">
            {files.map((file, idx) => (
              <div key={idx} className="flex items-center justify-between bg-[#23263a] p-3 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-blue-400" />
                  <span className="text-blue-100">{file.name}</span>
                  <span className="text-xs text-blue-400">({(file.size / 1024).toFixed(0)} KB)</span>
                </div>
                <button onClick={() => removeFile(idx)} className="text-red-400 hover:text-red-300">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Split Options */}
      {mode === 'split' && files.length === 1 && (
        <div className="mt-6">
          <label className="block text-blue-200 mb-2">Page ranges (comma separated)</label>
          <input
            type="text"
            value={splitPageRanges}
            onChange={e => setSplitPageRanges(e.target.value)}
            placeholder="e.g., 1-3,4-6,7"
            className="w-full px-4 py-2 rounded-lg bg-[#23263a] border border-blue-900 text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <p className="text-xs text-blue-400 mt-1">Example: "1-3,4-6,7" creates three PDFs: pages 1-3, 4-6, and page 7.</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-8 flex gap-4 justify-end">
        <button
          onClick={clearFiles}
          className="px-6 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition"
        >
          Clear
        </button>
        {mode === 'merge' && (
          <button
            onClick={handleMerge}
            disabled={files.length < 2 || processing}
            className="px-8 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold disabled:opacity-50 transition"
          >
            {processing ? 'Merging...' : 'Merge PDFs'}
          </button>
        )}
        {mode === 'split' && (
          <button
            onClick={handleSplit}
            disabled={files.length !== 1 || !splitPageRanges.trim() || processing}
            className="px-8 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold disabled:opacity-50 transition"
          >
            {processing ? 'Splitting...' : 'Split PDF'}
          </button>
        )}
      </div>

      <div className="mt-6 text-center text-blue-400 text-sm">
        <AlertCircle className="inline w-4 h-4 mr-1" />
        All processing is done in your browser – your files are never uploaded.
      </div>
    </div>
  );
};

export default BulkPDFToolkitPage;