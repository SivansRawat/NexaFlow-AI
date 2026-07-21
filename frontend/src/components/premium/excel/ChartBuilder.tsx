import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { ArrowLeft, Upload, FileSpreadsheet, BarChart3, PieChart, TrendingUp, Download, SlidersHorizontal, Trash2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, LineChart, Line, Legend, AreaChart, Area, ScatterChart, Scatter } from 'recharts';
import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import { CSVLink } from 'react-csv';
import { useUserLimit } from '../../../lib/useUserLimit';

interface ChartBuilderProps {
  isDarkMode?: boolean;
  onBack?: () => void;
  isFullPage?: boolean;
}

interface UploadedFile {
  name: string;
  size: number;
  type: string;
}

const LOCAL_STORAGE_KEY = 'chartbuilder_excel_data';

const COLORS = ['#38bdf8', '#818cf8', '#f472b6', '#34d399', '#fbbf24', '#a855f7', '#f97316'];

// Helper to robustly extract numeric values from strings, currency ($1,234.50), or percentages
const parseNumericValue = (val: any): number | null => {
  if (val === null || val === undefined || val === '') return null;
  if (typeof val === 'number') return isNaN(val) ? null : val;
  const str = String(val).trim();
  const cleaned = str.replace(/[^0-9.-]/g, '');
  if (!cleaned) return null;
  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
};

const ChartBuilder: React.FC<ChartBuilderProps> = ({ isDarkMode = false, onBack }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedChartType, setSelectedChartType] = useState<'bar' | 'pie' | 'line' | 'area' | 'scatter'>('bar');
  const [parsedData, setParsedData] = useState<any[]>([]);
  const [xAxis, setXAxis] = useState<string>('');
  const [yAxis, setYAxis] = useState<string>('');
  const [minValue, setMinValue] = useState<string>('');
  const [maxValue, setMaxValue] = useState<string>('');

  const { limitReached, checkLimit, Snackbar } = useUserLimit();

  // Helper to auto-select best X and Y axis columns from parsed JSON
  const autoDetectAxes = (jsonData: any[]) => {
    if (!jsonData || jsonData.length === 0 || typeof jsonData[0] !== 'object' || !jsonData[0]) return;
    const keys = Object.keys(jsonData[0]);
    if (keys.length === 0) return;

    // Find best numeric column for Y axis (column with highest count of parseable numbers)
    let bestYKey = keys[0];
    let maxNumericCount = -1;

    let bestXKey = keys[0];

    for (const key of keys) {
      let numCount = 0;
      for (const row of jsonData.slice(0, 50)) {
        if (parseNumericValue(row[key]) !== null) {
          numCount++;
        }
      }
      if (numCount > maxNumericCount) {
        maxNumericCount = numCount;
        bestYKey = key;
      }
    }

    // Best X key is the first non-Y column, or keys[0]
    const nonYKeys = keys.filter(k => k !== bestYKey);
    bestXKey = nonYKeys.length > 0 ? nonYKeys[0] : keys[0];

    setXAxis(bestXKey);
    setYAxis(bestYKey);
  };

  // Load from localStorage on mount
  React.useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      try {
        const { data, file } = JSON.parse(stored);
        if (Array.isArray(data) && data.length > 0) {
          setParsedData(data);
          setUploadedFile(file);
          autoDetectAxes(data);
          setCurrentStep(3); // Go directly to visualization if data exists
        }
      } catch (e) {
        // Ignore parse errors
      }
    }
  }, []);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    (async () => {
      if (await checkLimit(parsedData.length) || limitReached) return;
      const file = acceptedFiles[0];
      if (file) {
        setUploadedFile({
          name: file.name,
          size: file.size,
          type: file.type
        });
        setIsAnalyzing(true);
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = new Uint8Array(e.target?.result as ArrayBuffer);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
            
            if (!jsonData || jsonData.length === 0) {
              setIsAnalyzing(false);
              alert('Uploaded sheet contains no data. Please upload a sheet with valid rows.');
              return;
            }

            setParsedData(jsonData as any[]);
            autoDetectAxes(jsonData);

            // Save to localStorage
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({
              data: jsonData,
              file: {
                name: file.name,
                size: file.size,
                type: file.type
              }
            }));

            setTimeout(() => {
              setIsAnalyzing(false);
              setCurrentStep(2);
            }, 1200);
          } catch (err) {
            setIsAnalyzing(false);
            alert('Failed to parse Excel file. Please upload a valid .xlsx or .xls file.');
          }
        };
        reader.readAsArrayBuffer(file);
      }
    })();
  }, [checkLimit, parsedData.length, limitReached]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv']
    },
    maxSize: 10 * 1024 * 1024,
    multiple: false
  });

  const handleVisualize = () => setCurrentStep(3);

  const handleClearData = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setParsedData([]);
    setUploadedFile(null);
    setCurrentStep(1);
    setXAxis('');
    setYAxis('');
    setMinValue('');
    setMaxValue('');
  };

  // Download chart as PNG
  const handleDownload = async () => {
    const chartArea = document.getElementById('chart-area');
    if (chartArea) {
      const canvas = await html2canvas(chartArea, { backgroundColor: isDarkMode ? '#0f172a' : '#ffffff' });
      canvas.toBlob(blob => {
        if (blob) saveAs(blob, 'chart_report.png');
      });
    }
  };

  // Filter & Format Data for Recharts
  const getFilteredData = () => {
    if (!parsedData || parsedData.length === 0 || !xAxis || !yAxis) return [];
    
    const formatted = parsedData
      .map(row => {
        if (!row || typeof row !== 'object') return null;
        const rawX = row[xAxis];
        const rawY = row[yAxis];
        const numericY = parseNumericValue(rawY);

        if (rawX === undefined || rawX === null || rawX === '' || numericY === null) {
          return null;
        }

        return {
          ...row,
          [xAxis]: String(rawX),
          [yAxis]: numericY
        };
      })
      .filter((row): row is any => row !== null);

    return formatted.filter(row => {
      const yVal = row[yAxis];
      if (minValue !== '' && yVal < Number(minValue)) return false;
      if (maxValue !== '' && yVal > Number(maxValue)) return false;
      return true;
    });
  };

  const csvData = getFilteredData();

  // Loading overlay
  const renderLoadingOverlay = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm">
      <div className={`rounded-2xl shadow-2xl px-8 py-10 flex flex-col items-center border ${isDarkMode ? 'bg-gray-900 border-purple-500/30' : 'bg-white border-gray-200'}`}>
        <svg className="animate-spin h-12 w-12 text-cyan-400 mb-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
        </svg>
        <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Analyzing Excel Structure...</h2>
        <p className="text-gray-400 text-center max-w-xs text-sm">Detecting data headers, numeric ranges, and building custom charts.</p>
      </div>
    </div>
  );

  const renderStepIndicator = () => (
    <div className="flex items-center justify-end gap-2 mb-8">
      {[1, 2, 3].map((step, idx) => (
        <React.Fragment key={step}>
          <button
            onClick={() => {
              if (step === 1 || parsedData.length > 0) setCurrentStep(step);
            }}
            className={`w-9 h-9 flex items-center justify-center rounded-full font-bold text-sm border-2 transition-all duration-200 focus:outline-none
              ${currentStep === step ? 'bg-gradient-to-tr from-cyan-500 to-purple-600 text-white border-cyan-400 shadow-md shadow-cyan-500/30' :
                (isDarkMode ? 'bg-gray-800 text-gray-400 border-gray-700' : 'bg-gray-100 text-gray-500 border-gray-200')}`}
            aria-label={`Go to step ${step}`}
          >
            {step}
          </button>
          {idx < 2 && <div className={`w-8 h-1 rounded-full ${currentStep > step ? 'bg-cyan-500' : 'bg-gray-700'}`}></div>}
        </React.Fragment>
      ))}
    </div>
  );

  const renderUploadSection = () => (
    <div className="w-full flex flex-col items-center justify-center min-h-[calc(100vh-180px)]">
      <div className="w-full max-w-lg mx-auto text-center bg-transparent">
        <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto mb-4 text-cyan-400 shadow-lg shadow-cyan-950/40">
          <FileSpreadsheet className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-extrabold mb-2 text-white">Upload Your Excel File</h1>
        <p className="text-gray-400 text-sm mb-6 max-w-md mx-auto">Upload an Excel (.xlsx, .xls) or CSV sheet to automatically generate charts and analytics.</p>
        
        <div {...getRootProps()} className={`border-2 border-dashed rounded-2xl p-8 cursor-pointer transition-all duration-200 flex flex-col items-center justify-center
          ${isDragActive ? 'border-cyan-400 bg-cyan-950/30' : isDarkMode ? 'border-gray-700 bg-white/5 hover:border-cyan-400' : 'border-gray-300 bg-gray-50 hover:border-cyan-500'}`}
        >
          <input {...getInputProps()} />
          <Upload className="w-10 h-10 mb-3 text-cyan-400" />
          <span className="text-base font-semibold mb-1 text-white">Drop your Excel file here</span>
          <span className="text-gray-400 text-sm mb-2">or click to browse from device</span>
          <div className="text-xs text-gray-500">Supports .xlsx, .xls, .csv &bull; Max 10MB</div>
        </div>

        {uploadedFile && (
          <div className="mt-4 p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl flex items-center justify-between">
            <p className="text-emerald-400 text-sm font-medium">
              ✓ {uploadedFile.name} ({(uploadedFile.size / 1024).toFixed(1)} KB)
            </p>
            <button onClick={handleClearData} className="text-red-400 hover:text-red-300 text-xs font-semibold">Remove</button>
          </div>
        )}
      </div>
    </div>
  );

  const renderAnalysisSection = () => {
    const columnCount = parsedData.length > 0 ? Object.keys(parsedData[0] || {}).length : 0;
    const sampleHeaders = parsedData.length > 0 ? Object.keys(parsedData[0] || {}).slice(0, 4).join(', ') : '';

    return (
      <div className="w-full flex flex-col items-center justify-center min-h-[calc(100vh-180px)] px-4">
        <div className="w-full max-w-3xl mx-auto space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-extrabold text-white">Data Analysis Complete</h2>
            <p className="text-gray-400 text-sm">We've auto-detected your columns and structure below.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Detected Structure Card */}
            <div className={`rounded-2xl border shadow-xl p-6 ${isDarkMode ? 'bg-white/5 border-gray-800' : 'bg-white border-gray-200'}`}>
              <h3 className="text-lg font-bold mb-4 text-cyan-400 flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5" />
                Detected Structure
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between border-b border-gray-800/60 pb-2">
                  <span className="text-gray-400">Total Columns:</span>
                  <span className="font-bold text-white">{columnCount} columns</span>
                </div>
                <div className="flex justify-between border-b border-gray-800/60 pb-2">
                  <span className="text-gray-400">Total Rows:</span>
                  <span className="font-bold text-white">{parsedData.length.toLocaleString()} rows</span>
                </div>
                <div className="flex justify-between border-b border-gray-800/60 pb-2">
                  <span className="text-gray-400">Detected Headers:</span>
                  <span className="font-medium text-cyan-300 truncate max-w-[180px]">{sampleHeaders}...</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Default X / Y Axis:</span>
                  <span className="font-bold text-purple-400">{xAxis} vs {yAxis}</span>
                </div>
              </div>
            </div>

            {/* Recommended Visualizations Card */}
            <div className={`rounded-2xl border shadow-xl p-6 ${isDarkMode ? 'bg-white/5 border-gray-800' : 'bg-white border-gray-200'}`}>
              <h3 className="text-lg font-bold mb-4 text-purple-400 flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Recommended Charts
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3 p-2 rounded-lg bg-white/5">
                  <BarChart3 className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                  <span className="text-gray-200 font-medium">Bar Chart ({yAxis} by {xAxis})</span>
                </div>
                <div className="flex items-center gap-3 p-2 rounded-lg bg-white/5">
                  <PieChart className="w-5 h-5 text-pink-400 flex-shrink-0" />
                  <span className="text-gray-200 font-medium">Pie Chart (Percentage Distribution)</span>
                </div>
                <div className="flex items-center gap-3 p-2 rounded-lg bg-white/5">
                  <TrendingUp className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <span className="text-gray-200 font-medium">Line Chart (Trends over {xAxis})</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center pt-4">
            <button
              onClick={handleVisualize}
              className="bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-600 hover:from-cyan-400 hover:to-pink-500 text-white px-10 py-3.5 rounded-xl font-bold shadow-lg shadow-purple-950/40 transition-all duration-200 transform hover:-translate-y-0.5 text-base"
            >
              Visualize Data Now →
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Custom Pie label renderer to avoid overlap
  const renderPieLabel = (props: any) => {
    const RADIAN = Math.PI / 180;
    const { cx, cy, midAngle, outerRadius, percent, index } = props;
    const radius = outerRadius + 20;
    const xPos = cx + radius * Math.cos(-midAngle * RADIAN);
    const yPos = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text x={xPos} y={yPos} fill={COLORS[index % COLORS.length]} textAnchor={xPos > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={12} fontWeight="bold">
        {`${props.payload[xAxis]}: ${((percent ?? 0) * 100).toFixed(0)}%`}
      </text>
    );
  };

  const renderChart = () => {
    const chartData = getFilteredData();

    if (!chartData || chartData.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center px-4 py-12">
          <BarChart3 className="w-12 h-12 text-gray-500 mb-2 opacity-50" />
          <p className="text-gray-300 font-semibold mb-1">No Numeric Data Available for Selected Axes</p>
          <p className="text-xs text-gray-500 max-w-sm">Please select a numeric column for the Y Axis using the filters panel on the left.</p>
        </div>
      );
    }

    switch (selectedChartType) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#334155' : '#e5e7eb'} />
              <XAxis dataKey={xAxis} stroke={isDarkMode ? '#cbd5e1' : '#334155'} interval={0} angle={-30} textAnchor="end" height={60} fontSize={11} />
              <YAxis stroke={isDarkMode ? '#cbd5e1' : '#334155'} fontSize={11} />
              <Tooltip contentStyle={{ background: isDarkMode ? '#1e293b' : '#f1f5f9', borderRadius: 8, border: 'none', color: isDarkMode ? '#fff' : '#334155' }} />
              <Legend />
              <Bar dataKey={yAxis} fill="url(#barGradient)" radius={[6, 6, 0, 0]} />
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#818cf8" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        );
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <RechartsPieChart>
              <Pie
                data={chartData.slice(0, 15)} // Limit pie chart to top 15 items for clarity
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderPieLabel}
                outerRadius={85}
                fill="#38bdf8"
                dataKey={yAxis}
                nameKey={xAxis}
              >
                {chartData.slice(0, 15).map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: isDarkMode ? '#1e293b' : '#fff', borderRadius: 8, border: 'none', color: isDarkMode ? '#fff' : '#334155' }} />
              <Legend />
            </RechartsPieChart>
          </ResponsiveContainer>
        );
      case 'line':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#334155' : '#e5e7eb'} />
              <XAxis dataKey={xAxis} stroke={isDarkMode ? '#cbd5e1' : '#334155'} interval={0} angle={-30} textAnchor="end" height={60} fontSize={11} />
              <YAxis stroke={isDarkMode ? '#cbd5e1' : '#334155'} fontSize={11} />
              <Tooltip contentStyle={{ background: isDarkMode ? '#1e293b' : '#fff', borderRadius: 8, border: 'none', color: isDarkMode ? '#fff' : '#334155' }} />
              <Legend />
              <Line type="monotone" dataKey={yAxis} stroke="#38bdf8" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'area':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#334155' : '#e5e7eb'} />
              <XAxis dataKey={xAxis} stroke={isDarkMode ? '#cbd5e1' : '#334155'} interval={0} angle={-30} textAnchor="end" height={60} fontSize={11} />
              <YAxis stroke={isDarkMode ? '#cbd5e1' : '#334155'} fontSize={11} />
              <Tooltip contentStyle={{ background: isDarkMode ? '#1e293b' : '#f1f5f9', borderRadius: 8, border: 'none', color: isDarkMode ? '#fff' : '#334155' }} />
              <Legend />
              <Area type="monotone" dataKey={yAxis} stroke="#38bdf8" fill="#38bdf8" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        );
      case 'scatter':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 10, right: 20, left: 10, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#334155' : '#e5e7eb'} />
              <XAxis dataKey={xAxis} stroke={isDarkMode ? '#cbd5e1' : '#334155'} type="category" interval={0} angle={-30} textAnchor="end" height={60} fontSize={11} />
              <YAxis dataKey={yAxis} stroke={isDarkMode ? '#cbd5e1' : '#334155'} type="number" fontSize={11} />
              <Tooltip contentStyle={{ background: isDarkMode ? '#1e293b' : '#f1f5f9', borderRadius: 8, border: 'none', color: isDarkMode ? '#fff' : '#334155' }} />
              <Legend />
              <Scatter name={yAxis} data={chartData} fill="#38bdf8" />
            </ScatterChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

  const renderVisualizationSection = () => {
    const allKeys = parsedData.length > 0 ? Object.keys(parsedData[0] || {}) : [];

    return (
      <div className="w-full flex flex-col items-center justify-center min-h-[calc(100vh-180px)] px-4">
        <div className="w-full max-w-5xl mx-auto flex justify-between items-center mb-4">
          <button
            onClick={() => setCurrentStep(2)}
            className="text-gray-400 hover:text-white text-sm font-medium flex items-center gap-1.5"
          >
            ← Back to Structure
          </button>

          <button
            onClick={handleClearData}
            className="flex items-center gap-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 px-3.5 py-1.5 rounded-lg font-medium transition text-xs"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear Data
          </button>
        </div>

        <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Filters Panel */}
          <div className={`rounded-2xl shadow-xl p-6 flex flex-col gap-5 border ${isDarkMode ? 'bg-white/5 border-gray-800' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center gap-2 mb-1">
              <SlidersHorizontal className="w-5 h-5 text-cyan-400" />
              <h3 className="text-base font-bold text-white">Chart Controls</h3>
            </div>

            <div className="flex flex-col gap-4">
              {/* Chart Type Selector */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">Chart Style</label>
                <select
                  className="w-full p-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-cyan-400 transition bg-gray-900 text-white border-gray-700"
                  value={selectedChartType}
                  onChange={e => setSelectedChartType(e.target.value as any)}
                >
                  <option value="bar">Bar Chart</option>
                  <option value="pie">Pie Chart</option>
                  <option value="line">Line Chart</option>
                  <option value="area">Area Chart</option>
                  <option value="scatter">Scatter Chart</option>
                </select>
              </div>

              {/* X Axis Selector */}
              {allKeys.length > 0 && (
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">X Axis (Categories)</label>
                  <select
                    className="w-full p-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-cyan-400 transition bg-gray-900 text-white border-gray-700"
                    value={xAxis}
                    onChange={e => setXAxis(e.target.value)}
                  >
                    {allKeys.map(key => (
                      <option key={key} value={key}>{key}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Y Axis Selector */}
              {allKeys.length > 0 && (
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">Y Axis (Values)</label>
                  <select
                    className="w-full p-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-cyan-400 transition bg-gray-900 text-white border-gray-700"
                    value={yAxis}
                    onChange={e => setYAxis(e.target.value)}
                  >
                    {allKeys.map(key => (
                      <option key={key} value={key}>{key}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Range Filters */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">Value Filter Range</label>
                <div className="flex items-center gap-2 border border-gray-700 rounded-xl p-2 bg-gray-900">
                  <input
                    type="number"
                    placeholder="Min"
                    className="w-full bg-transparent text-sm text-white focus:outline-none px-1"
                    value={minValue}
                    onChange={e => setMinValue(e.target.value)}
                  />
                  <span className="text-gray-500">–</span>
                  <input
                    type="number"
                    placeholder="Max"
                    className="w-full bg-transparent text-sm text-white focus:outline-none px-1"
                    value={maxValue}
                    onChange={e => setMaxValue(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Charts Area */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className={`rounded-2xl shadow-xl p-6 flex flex-col gap-4 border ${isDarkMode ? 'bg-white/5 border-gray-800' : 'bg-white border-gray-200'}`}>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-2">
                <div>
                  <h3 className="text-xl font-bold text-white">{selectedChartType.toUpperCase()} Chart Visualization</h3>
                  <p className="text-gray-400 text-xs mt-0.5">Plotting <span className="text-cyan-400 font-semibold">{yAxis}</span> vs <span className="text-purple-400 font-semibold">{xAxis}</span></p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-1.5 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white px-4 py-2 rounded-xl font-semibold shadow text-xs transition"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Chart</span>
                  </button>

                  <CSVLink
                    data={csvData}
                    filename="chart-dataset.csv"
                    className="flex items-center gap-1.5 bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 px-4 py-2 rounded-xl font-semibold shadow text-xs transition"
                  >
                    <Download className="w-4 h-4" />
                    <span>CSV Data</span>
                  </CSVLink>
                </div>
              </div>

              {/* Chart Canvas Area */}
              <div className="w-full h-80 flex items-center justify-center p-2 rounded-xl bg-gray-950/60 border border-gray-800/80" id="chart-area">
                {renderChart()}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col px-4 w-full pt-4">
      {Snackbar}
      {/* Header */}
      <div className="w-full max-w-5xl mx-auto flex items-center justify-between mb-6 px-2">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className={`p-2 rounded-xl border transition-colors ${isDarkMode ? 'bg-white/5 border-gray-800 hover:bg-white/10 text-white' : 'bg-gray-100 border-gray-200 hover:bg-gray-200 text-gray-900'}`}
            aria-label="Go back"
            title="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white">Chart Builder Pro</h1>
            <p className="text-gray-400 text-xs">Transform Excel datasets into interactive visualizations</p>
          </div>
        </div>
        {renderStepIndicator()}
      </div>

      {/* Content */}
      <div className="w-full flex-1 flex flex-col items-center justify-center">
        {isAnalyzing && renderLoadingOverlay()}
        {currentStep === 1 && renderUploadSection()}
        {currentStep === 2 && renderAnalysisSection()}
        {currentStep === 3 && renderVisualizationSection()}
      </div>
    </div>
  );
};

export default ChartBuilder;