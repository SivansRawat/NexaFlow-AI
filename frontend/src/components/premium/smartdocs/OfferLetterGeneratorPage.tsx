import React, { useEffect, useRef, useState } from 'react';
import { OfferLetterAPI } from '@/lib/api';
import { Clock, ZoomIn, ZoomOut, Download, Save, UploadCloud, FileText, CheckCircle2, AlertTriangle, X, Sparkles, Building, User } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import SEO from '@/components/common/SEO';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';

type EmploymentType = 'Internship' | 'Contract' | 'Full-time' | 'Part-time' | 'Other';

interface OfferFormState {
  dateOfOffer: string;
  employeeName: string;
  jobProfile: string;
  reportingManagerName: string;
  joiningDate: string;
  employmentType: EmploymentType;
  workSchedule: string;
  jobLocation: string;
  annualSalary: string;
  probationPeriodDays?: string;
  companyName: string;
  companyEmail: string;
  companyAddress: string;
  representativeName: string;
}

const defaultState: OfferFormState = {
  dateOfOffer: new Date().toISOString().split('T')[0],
  employeeName: 'Jane Smith',
  jobProfile: 'Senior Software Engineer',
  reportingManagerName: 'Alex Johnson (VP of Engineering)',
  joiningDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  employmentType: 'Full-time',
  workSchedule: '9:00 AM – 6:00 PM, Mon – Fri',
  jobLocation: 'San Francisco, CA (Hybrid)',
  annualSalary: '140000',
  probationPeriodDays: '90',
  companyName: 'NexaFlow Enterprise AI',
  companyEmail: 'hr@nexaflow.ai',
  companyAddress: '100 Innovation Way, Suite 400, Tech Park',
  representativeName: 'Sarah Jenkins',
};

function formatDateForDisplay(dStr?: string) {
  if (!dStr) return '';
  const d = new Date(dStr);
  if (isNaN(d.getTime())) return dStr;
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function formatINR(val?: string) {
  if (!val) return '₹0';
  const num = parseFloat(val);
  if (isNaN(num)) return val;
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(num);
}

const OfferLetterGeneratorPage: React.FC = () => {
  const [form, setForm] = useState<OfferFormState>(defaultState);
  const [logoDataUrl, setLogoDataUrl] = useState<string | null>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyItems, setHistoryItems] = useState<Array<{ id: number; title: string; createdAt: string }>>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [saving, setSaving] = useState(false);
  const [zoom, setZoom] = useState(0.75);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' | 'warning' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' | 'warning') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  useEffect(() => {
    try {
      const cached = localStorage.getItem('offerLetter.form');
      if (cached) setForm({ ...defaultState, ...JSON.parse(cached) });
      const logo = localStorage.getItem('offerLetter.logo');
      if (logo) setLogoDataUrl(logo);
    } catch {}
  }, []);

  useEffect(() => {
    const id = setTimeout(() => {
      try { localStorage.setItem('offerLetter.form', JSON.stringify(form)); } catch {}
    }, 300);
    return () => clearTimeout(id);
  }, [form]);

  useEffect(() => {
    if (logoDataUrl) {
      try { localStorage.setItem('offerLetter.logo', logoDataUrl); } catch {}
    }
  }, [logoDataUrl]);

  const onChange = (field: keyof OfferFormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
  };

  function onLogoSelected(file: File | null) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const src = reader.result as string;
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const targetHeight = 50;
        const scale = Math.min(1, targetHeight / img.height);
        const canvas = document.createElement('canvas');
        canvas.height = Math.max(1, Math.floor(img.height * scale));
        canvas.width = Math.max(1, Math.floor(img.width * scale));
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
          setLogoDataUrl(dataUrl);
          showToast('Company logo uploaded.', 'success');
        } else {
          setLogoDataUrl(src);
        }
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  }

  async function downloadPdf() {
    if (!pageRef.current) return;
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const canvas = await html2canvas(pageRef.current, { backgroundColor: '#ffffff', scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/jpeg', 0.9);
      pdf.addImage(imgData, 'JPEG', 0, 0, pageWidth, pageHeight);
      pdf.save(`Offer_Letter_${(form.employeeName || 'Candidate').replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
      showToast('Offer letter PDF downloaded successfully!', 'success');
    } catch (e) {
      console.error(e);
      showToast('Failed to generate PDF.', 'error');
    }
  }

  async function handleSave() {
    try {
      setSaving(true);
      let smallLogo: string | undefined = logoDataUrl || undefined;
      if (smallLogo && smallLogo.length > 120000) {
        smallLogo = undefined;
      }
      const payload = { title: `Offer - ${form.employeeName || 'Untitled'}`, data: form, logo: smallLogo };
      await OfferLetterAPI.create(payload);
      showToast('Offer letter saved to history!', 'success');
    } catch (e) {
      console.error(e);
      showToast('Failed to save offer letter.', 'error');
    } finally {
      setSaving(false);
    }
  }

  async function loadHistory() {
    try {
      setLoadingHistory(true);
      setHistoryOpen(true);
      const items = await OfferLetterAPI.list();
      setHistoryItems(items);
    } catch (e) {
      console.error(e);
      showToast('Failed to load history.', 'error');
    } finally {
      setLoadingHistory(false);
    }
  }

  return (
    <div className="w-full max-w-full text-gray-100 font-sans relative selection:bg-indigo-500/30 space-y-6 pb-12">
      <SEO 
        title="AI Smart Offer Letter Composer | NexaFlow AI"
        description="Generate professional, customizable employment offer letters instantly with live PDF preview, digital signing fields, and corporate branding."
        canonical="/premium/smartdocs/offerletter"
      />

      {/* Floating Notification Toast */}
      {toastMessage && (
        <div
          className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl backdrop-blur-xl border transition-all animate-fade-in ${
            toastMessage.type === 'success'
              ? 'bg-emerald-950/80 border-emerald-500/30 text-emerald-200'
              : toastMessage.type === 'error'
              ? 'bg-red-950/80 border-red-500/30 text-red-200'
              : 'bg-amber-950/80 border-amber-500/30 text-amber-200'
          }`}
        >
          {toastMessage.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
          {toastMessage.type === 'error' && <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />}
          {toastMessage.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />}
          <span className="text-sm font-medium">{toastMessage.text}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 hover:opacity-75">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Page Header */}
      <div className="w-full mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              SmartDocs AI Suite
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
              Offer Letter Composer
            </h1>
            <p className="text-gray-400 text-sm mt-1 max-w-xl">
              Compose legal, high-craft employment offer letters with digital signature fields and live PDF preview.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              onClick={loadHistory}
              variant="outline"
              className="bg-[#111118] hover:bg-[#1a1a24] text-gray-200 border-white/10 text-xs rounded-xl flex items-center gap-2"
            >
              <Clock className="w-4 h-4 text-indigo-400" /> History
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-indigo-600/30 hover:bg-indigo-600/40 text-indigo-200 border border-indigo-500/30 text-xs rounded-xl flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Draft'}
            </Button>
            <Button
              onClick={downloadPdf}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-indigo-500/20 text-xs sm:text-sm rounded-xl flex items-center gap-2 px-4 py-2"
            >
              <Download className="w-4 h-4" /> Export PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="w-full grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left Column: Input Form (7 cols on xl) */}
        <div className="xl:col-span-7 space-y-6 w-full">
          {/* Section 1: Offer & Candidate Details */}
          <Card className="bg-[#0b0b0f] border-white/10 shadow-2xl rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-white/10 bg-white/[0.02]">
              <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                <User className="w-5 h-5 text-indigo-400" />
                Candidate & Position Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-gray-300">Candidate Full Name*</Label>
                  <Input
                    value={form.employeeName}
                    onChange={onChange('employeeName')}
                    placeholder="e.g. Jane Smith"
                    className="bg-[#111118] text-white border-white/10 focus:border-indigo-500 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-300">Job Title / Profile*</Label>
                  <Input
                    value={form.jobProfile}
                    onChange={onChange('jobProfile')}
                    placeholder="e.g. Lead Full-Stack Engineer"
                    className="bg-[#111118] text-white border-white/10 focus:border-indigo-500 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-300">Date of Offer*</Label>
                  <Input
                    type="date"
                    value={form.dateOfOffer}
                    onChange={onChange('dateOfOffer')}
                    className="bg-[#111118] text-white border-white/10 focus:border-indigo-500 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-300">Joining Date*</Label>
                  <Input
                    type="date"
                    value={form.joiningDate}
                    onChange={onChange('joiningDate')}
                    className="bg-[#111118] text-white border-white/10 focus:border-indigo-500 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div>
                  <Label className="text-xs text-gray-300">Reporting Manager Name & Title*</Label>
                  <Input
                    value={form.reportingManagerName}
                    onChange={onChange('reportingManagerName')}
                    placeholder="e.g. Alex Johnson (Engineering VP)"
                    className="bg-[#111118] text-white border-white/10 focus:border-indigo-500 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-300">Job Location*</Label>
                  <Input
                    value={form.jobLocation}
                    onChange={onChange('jobLocation')}
                    placeholder="Remote / Hybrid / HQ"
                    className="bg-[#111118] text-white border-white/10 focus:border-indigo-500 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs text-gray-300 mb-2 block">Employment Type*</Label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {(['Full-time', 'Part-time', 'Contract', 'Internship', 'Other'] as EmploymentType[]).map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setForm(prev => ({ ...prev, employmentType: opt }))}
                      className={`px-3 py-2 text-xs rounded-xl border font-medium transition-all ${
                        form.employmentType === opt
                          ? 'bg-indigo-600/30 border-indigo-500 text-white shadow-md'
                          : 'bg-[#111118] border-white/10 text-gray-400 hover:text-white'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 2: Compensation & Terms */}
          <Card className="bg-[#0b0b0f] border-white/10 shadow-2xl rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-white/10 bg-white/[0.02]">
              <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                <Building className="w-5 h-5 text-indigo-400" />
                Compensation & Company Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-gray-300">Annual Salary Package (INR/USD)*</Label>
                  <Input
                    type="number"
                    value={form.annualSalary}
                    onChange={onChange('annualSalary')}
                    placeholder="1200000"
                    className="bg-[#111118] text-white border-white/10 focus:border-indigo-500 rounded-xl text-sm font-mono"
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-300">Probation Period (Days)</Label>
                  <Input
                    type="number"
                    value={form.probationPeriodDays || ''}
                    onChange={onChange('probationPeriodDays')}
                    placeholder="90"
                    className="bg-[#111118] text-white border-white/10 focus:border-indigo-500 rounded-xl text-sm font-mono"
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-300">Work Schedule*</Label>
                  <Input
                    value={form.workSchedule}
                    onChange={onChange('workSchedule')}
                    placeholder="9:00 AM – 6:00 PM, Mon – Fri"
                    className="bg-[#111118] text-white border-white/10 focus:border-indigo-500 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-300">Authorized Representative Name*</Label>
                  <Input
                    value={form.representativeName}
                    onChange={onChange('representativeName')}
                    placeholder="e.g. Sarah Jenkins (HR Director)"
                    className="bg-[#111118] text-white border-white/10 focus:border-indigo-500 rounded-xl text-sm"
                  />
                </div>
              </div>

              {/* Logo Upload Box */}
              <div className="pt-2">
                <Label className="text-xs text-gray-300 mb-1.5 block">Company Logo</Label>
                <div className="flex items-center gap-4">
                  {logoDataUrl ? (
                    <div className="relative group">
                      <img src={logoDataUrl} alt="Company Logo" className="h-14 w-28 object-contain p-2 bg-white rounded-xl border border-white/10" />
                      <button
                        onClick={() => setLogoDataUrl(null)}
                        className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 shadow hover:bg-red-500 transition"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex-1 flex items-center justify-center gap-3 p-4 rounded-xl border border-dashed border-white/20 bg-[#111118] hover:border-indigo-500/50 cursor-pointer transition-all">
                      <UploadCloud className="w-5 h-5 text-indigo-400" />
                      <span className="text-xs text-gray-400 font-medium">Click to upload company logo (PNG, JPG)</span>
                      <input type="file" accept="image/*" onChange={(e) => onLogoSelected(e.target.files?.[0] || null)} className="hidden" />
                    </label>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-gray-300">Company Name*</Label>
                  <Input
                    value={form.companyName}
                    onChange={onChange('companyName')}
                    placeholder="NexaFlow AI Inc."
                    className="bg-[#111118] text-white border-white/10 focus:border-indigo-500 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-300">Company Email*</Label>
                  <Input
                    type="email"
                    value={form.companyEmail}
                    onChange={onChange('companyEmail')}
                    placeholder="hr@nexaflow.ai"
                    className="bg-[#111118] text-white border-white/10 focus:border-indigo-500 rounded-xl text-sm"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label className="text-xs text-gray-300">Registered Office Address*</Label>
                  <Input
                    value={form.companyAddress}
                    onChange={onChange('companyAddress')}
                    placeholder="100 Innovation Way, Suite 400, Tech Park"
                    className="bg-[#111118] text-white border-white/10 focus:border-indigo-500 rounded-xl text-sm"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Live Document Preview (5 cols on xl) */}
        <div className="xl:col-span-5 space-y-6 w-full overflow-hidden">
          <Card className="bg-[#0b0b0f] border-white/10 shadow-2xl rounded-2xl overflow-hidden sticky top-8">
            <CardHeader className="border-b border-white/10 bg-white/[0.02] flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-400" />
                Live Document Preview
              </CardTitle>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setZoom(z => Math.max(0.55, z - 0.05))}
                  className="p-1.5 rounded-lg bg-[#111118] text-gray-300 hover:text-white border border-white/10"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-xs font-mono text-gray-300">{Math.round(zoom * 100)}%</span>
                <button
                  onClick={() => setZoom(z => Math.min(1.2, z + 0.05))}
                  className="p-1.5 rounded-lg bg-[#111118] text-gray-300 hover:text-white border border-white/10"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>
            </CardHeader>

            <CardContent className="p-3 sm:p-4 space-y-4">
              <div className="bg-slate-950/90 p-3 rounded-xl border border-white/5 shadow-inner overflow-x-auto overflow-y-auto max-h-[660px] w-full flex justify-center">
                <div style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }} className="transition-transform duration-200">
                  <div
                    ref={pageRef}
                    className="w-[794px] min-h-[1123px] bg-white text-gray-900 shadow-2xl rounded-lg p-12 border border-gray-200 text-left font-serif leading-relaxed"
                  >
                    {/* Header */}
                    <div className="flex justify-between items-start mb-6 border-b pb-4 border-gray-200">
                      <div>
                        {logoDataUrl && <img src={logoDataUrl} alt="Logo" className="h-12 object-contain mb-2" />}
                        <h1 className="text-xl font-bold font-sans text-gray-900">{form.companyName || 'Company Name'}</h1>
                        <p className="text-xs text-gray-600 font-sans">{form.companyEmail}</p>
                        <p className="text-xs text-gray-600 font-sans">{form.companyAddress}</p>
                      </div>
                      <div className="text-right font-sans">
                        <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold uppercase rounded-md border border-indigo-200 mb-2">
                          Employment Offer
                        </span>
                        <p className="text-xs text-gray-500">Date: <span className="font-semibold text-gray-800">{formatDateForDisplay(form.dateOfOffer)}</span></p>
                      </div>
                    </div>

                    {/* Title */}
                    <h2 className="text-2xl font-bold font-sans text-center text-gray-900 my-6 tracking-tight">
                      LETTER OF EMPLOYMENT OFFER
                    </h2>

                    {/* Body Content */}
                    <div className="space-y-4 text-sm text-gray-800 leading-relaxed font-serif">
                      <p>
                        Dear <span className="font-bold text-gray-900 font-sans">{form.employeeName || 'Candidate Name'}</span>,
                      </p>

                      <p>
                        On behalf of <span className="font-semibold font-sans">{form.companyName || 'our company'}</span>, we are delighted to offer you the position of <span className="font-bold font-sans">{form.jobProfile || 'Position'}</span>. We were thoroughly impressed by your credentials and believe your background will make a significant contribution to our organization.
                      </p>

                      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 font-sans space-y-2 text-xs my-4">
                        <h3 className="font-bold text-gray-900 uppercase tracking-wider text-[11px] border-b pb-1 border-gray-200">Position & Terms Overview</h3>
                        <div className="grid grid-cols-2 gap-2 text-gray-700 pt-1">
                          <p><span className="font-semibold text-gray-900">Job Title:</span> {form.jobProfile}</p>
                          <p><span className="font-semibold text-gray-900">Employment Type:</span> {form.employmentType}</p>
                          <p><span className="font-semibold text-gray-900">Reporting Manager:</span> {form.reportingManagerName}</p>
                          <p><span className="font-semibold text-gray-900">Start Date:</span> {formatDateForDisplay(form.joiningDate)}</p>
                          <p><span className="font-semibold text-gray-900">Work Schedule:</span> {form.workSchedule}</p>
                          <p><span className="font-semibold text-gray-900">Job Location:</span> {form.jobLocation}</p>
                        </div>
                      </div>

                      <h3 className="font-bold font-sans text-gray-900 text-base mt-4">Compensation & Benefits</h3>
                      <p>
                        Your annual compensation package will be <span className="font-bold text-indigo-950 font-mono text-base">{formatINR(form.annualSalary)}</span>, payable in accordance with the company standard payroll schedule. Additional performance incentives and benefits will apply per company policy.
                      </p>

                      {form.probationPeriodDays && (
                        <p className="text-xs text-gray-700 italic">
                          * A standard probation period of {form.probationPeriodDays} days will apply starting from your effective joining date.
                        </p>
                      )}

                      <h3 className="font-bold font-sans text-gray-900 text-base mt-4">Terms & Conditions</h3>
                      <ul className="list-disc pl-5 space-y-1.5 text-xs text-gray-700">
                        <li>This offer is contingent upon successful completion of background checks and verification of documents.</li>
                        <li>Employment is at-will and subject to standard company policies and confidentiality non-disclosure agreements.</li>
                      </ul>

                      {/* Signatures */}
                      <div className="pt-8 border-t border-gray-200 mt-8 grid grid-cols-2 gap-8 font-sans">
                        <div>
                          <p className="text-xs text-gray-500 mb-6">Sincerely,</p>
                          <div className="border-b-2 border-gray-400 w-56 h-10 mb-2 flex items-end italic text-xs text-gray-400">
                            {form.representativeName || 'Authorized Signatory'}
                          </div>
                          <p className="text-xs font-bold text-gray-900">{form.representativeName || 'Representative Name'}</p>
                          <p className="text-[11px] text-gray-500">{form.companyName}</p>
                        </div>

                        <div>
                          <p className="text-xs text-gray-500 mb-6">Accepted & Agreed:</p>
                          <div className="border-b-2 border-gray-400 w-56 h-10 mb-2 flex items-end italic text-xs text-gray-400">
                            {form.employeeName || 'Candidate Signature'}
                          </div>
                          <p className="text-xs font-bold text-gray-900">{form.employeeName || 'Employee Name'}</p>
                          <p className="text-[11px] text-gray-500">Date: ____ / ____ / ________</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* History Modal */}
      {historyOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b0b0f] border border-white/10 p-6 rounded-2xl max-w-lg w-full text-left space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-400" /> Saved Offer Letters
              </h3>
              <button onClick={() => setHistoryOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
              {loadingHistory ? (
                <p className="text-xs text-gray-400 text-center py-4">Loading history...</p>
              ) : historyItems.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-4">No offer letter records found.</p>
              ) : (
                historyItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={async () => {
                      try {
                        const full = await OfferLetterAPI.get(item.id);
                        setForm(full.data || defaultState);
                        setLogoDataUrl(full.logo || null);
                        setHistoryOpen(false);
                        showToast(`Loaded ${item.title}`, 'success');
                      } catch (e) {
                        console.error(e);
                        showToast('Failed to load offer letter.', 'error');
                      }
                    }}
                    className="p-3 rounded-xl bg-[#111118] border border-white/10 hover:border-indigo-500/40 cursor-pointer transition"
                  >
                    <p className="text-sm font-bold text-white">{item.title || `Offer #${item.id}`}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{new Date(item.createdAt).toLocaleString()}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfferLetterGeneratorPage;
