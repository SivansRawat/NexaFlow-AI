import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';
import { Label } from '../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import Template1 from './smartinvoice/templates/Template1';
import Template2 from './smartinvoice/templates/Template2';
import Template3 from './smartinvoice/templates/Template3';
import Template4 from './smartinvoice/templates/Template4';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import axios from 'axios';
import { useAuth } from '../../../../src/context/AuthContext';
import InvoicePreviewModal from './InvoicePreviewModal';
import { API_BASE } from '@/lib/api';
import SEO from '@/components/common/SEO';
import {
  FileText,
  Sparkles,
  Plus,
  Trash2,
  Download,
  Eye,
  Save,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  Building2,
  UserCheck,
  Receipt,
  Search,
  LayoutGrid,
  FileImage,
  X
} from 'lucide-react';

interface Item {
  itemName: string;
  rate: number;
  quantity: number;
  taxPercentage: number;
  finalPrice: number;
}

interface Invoice {
  id: number;
  businessName: string;
  businessLogo: string | null;
  businessAddress: string;
  businessEmail: string;
  businessPhoneNumber: string;
  clientName: string;
  clientEmail: string;
  clientAddress: string;
  clientPhoneNumber: string;
  items: Item[];
  subtotal: number;
  taxAmount: number;
  grandTotal: number;
  createdAt: string;
  invoiceNumber?: string;
  currencySymbol?: string;
}

const CURRENCIES = [
  { code: 'INR', symbol: '₹', label: 'INR (₹)' },
  { code: 'USD', symbol: '$', label: 'USD ($)' },
  { code: 'EUR', symbol: '€', label: 'EUR (€)' },
  { code: 'GBP', symbol: '£', label: 'GBP (£)' },
  { code: 'CAD', symbol: 'C$', label: 'CAD (C$)' },
  { code: 'AUD', symbol: 'A$', label: 'AUD (A$)' },
];

const TEMPLATES = [
  { id: 'Template1', name: 'Executive Indigo', badge: 'Popular', description: 'Clean corporate header with indigo accents' },
  { id: 'Template2', name: 'Corporate Emerald', badge: 'Agency', description: 'Tech agency styling with emerald badges' },
  { id: 'Template3', name: 'Sleek Minimalist', badge: 'Clean', description: 'Monospaced high-contrast typography' },
  { id: 'Template4', name: 'Creative Modern', badge: 'Vibrant', description: 'Soft background glows with dual-color accents' },
];

const SmartInvoiceGeneratorPage: React.FC = () => {
  // Form State
  const [businessName, setBusinessName] = useState<string>('NexaFlow Enterprise');
  const [businessLogo, setBusinessLogo] = useState<string | null>(null);
  const [businessAddress, setBusinessAddress] = useState<string>('100 Innovation Way, Tech Park, Suite 400');
  const [businessEmail, setBusinessEmail] = useState<string>('billing@nexaflow.ai');
  const [businessPhoneNumber, setBusinessPhoneNumber] = useState<string>('9876543210');

  const [clientName, setClientName] = useState<string>('Acme Global Inc');
  const [clientEmail, setClientEmail] = useState<string>('accounts@acme.com');
  const [clientAddress, setClientAddress] = useState<string>('450 Corporate Blvd, New York, NY 10001');
  const [clientPhoneNumber, setClientPhoneNumber] = useState<string>('9123456789');

  const [invoiceNumber, setInvoiceNumber] = useState<string>(`INV-${new Date().getFullYear()}-001`);
  const [invoiceDate, setInvoiceDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState<string>(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [currencySymbol, setCurrencySymbol] = useState<string>('₹');

  const [items, setItems] = useState<Item[]>([
    { itemName: 'AI Architecture & Workflow Design', rate: 1200, quantity: 2, taxPercentage: 18, finalPrice: 2832 },
    { itemName: 'Cloud Deployment & Monitoring Setup', rate: 800, quantity: 1, taxPercentage: 18, finalPrice: 944 },
  ]);
  const [discountAmount, setDiscountAmount] = useState<number>(0);

  const [selectedTemplate, setSelectedTemplate] = useState<string>('Template1');
  const [invoiceHistory, setInvoiceHistory] = useState<Invoice[]>([]);
  const [historySearch, setHistorySearch] = useState<string>('');
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

  // UI / Modal / Notification State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [deleteInvoiceId, setDeleteInvoiceId] = useState<number | null>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState<boolean>(false);

  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' | 'warning' } | null>(null);

  const invoicePreviewRef = useRef<HTMLDivElement>(null);
  const { token } = useAuth();

  const axiosInstance = axios.create({
    headers: {
      Authorization: `Bearer ${token}`,
    },
    baseURL: API_BASE,
  });

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  const phoneRegex = /^\d{10}$/;

  const showToast = (text: string, type: 'success' | 'error' | 'warning') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const fetchInvoiceHistory = async () => {
    try {
      const response = await axiosInstance.get('/smartdocs/smart-invoices');
      setInvoiceHistory(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching invoice history:', error);
    }
  };

  useEffect(() => {
    fetchInvoiceHistory();
  }, [axiosInstance]);

  const handleDeleteInvoice = (invoiceId: number) => {
    setDeleteInvoiceId(invoiceId);
    setConfirmDeleteOpen(true);
  };

  const confirmDeletion = async () => {
    setConfirmDeleteOpen(false);
    if (deleteInvoiceId === null) return;

    try {
      await axiosInstance.delete(`/smartdocs/smart-invoices/${deleteInvoiceId}`);
      showToast('Invoice deleted successfully.', 'success');
      fetchInvoiceHistory();
    } catch (error) {
      console.error('Error deleting invoice:', error);
      showToast('Failed to delete invoice.', 'error');
    } finally {
      setDeleteInvoiceId(null);
    }
  };

  const calculateTotals = () => {
    let subtotal = 0;
    let totalTaxAmount = 0;

    items.forEach((item) => {
      const lineSubtotal = (item.rate || 0) * (item.quantity || 0);
      const lineTax = lineSubtotal * ((item.taxPercentage || 0) / 100);
      subtotal += lineSubtotal;
      totalTaxAmount += lineTax;
    });

    const grandTotal = Math.max(0, subtotal + totalTaxAmount - (discountAmount || 0));

    return { subtotal, totalTaxAmount, grandTotal };
  };

  const { subtotal, totalTaxAmount, grandTotal } = calculateTotals();

  const handleAddItem = () => {
    setItems([
      ...items,
      { itemName: '', rate: 0, quantity: 1, taxPercentage: 0, finalPrice: 0 },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) {
      showToast('Invoice must contain at least one item.', 'warning');
      return;
    }
    const updated = items.filter((_, i) => i !== index);
    setItems(updated);
  };

  const handleItemChange = (index: number, field: keyof Item, value: string | number) => {
    const updated = [...items];
    // @ts-ignore
    updated[index][field] = value;

    const item = updated[index];
    const lineSubtotal = (item.rate || 0) * (item.quantity || 0);
    const lineTax = lineSubtotal * ((item.taxPercentage || 0) / 100);
    item.finalPrice = lineSubtotal + lineTax;

    setItems(updated);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 2 * 1024 * 1024) {
        showToast('Logo file size must be under 2MB.', 'warning');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setBusinessLogo(reader.result as string);
        showToast('Business logo uploaded.', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    if (!businessName.trim()) errors.businessName = 'Business name is required.';
    if (!businessAddress.trim()) errors.businessAddress = 'Business address is required.';
    if (!businessPhoneNumber.trim()) errors.businessPhoneNumber = 'Phone number is required.';
    else if (!phoneRegex.test(businessPhoneNumber)) errors.businessPhoneNumber = 'Phone must be 10 digits.';
    if (!businessEmail.trim()) errors.businessEmail = 'Business email is required.';
    else if (!emailRegex.test(businessEmail)) errors.businessEmail = 'Invalid business email.';

    if (!clientName.trim()) errors.clientName = 'Client name is required.';
    if (!clientAddress.trim()) errors.clientAddress = 'Client address is required.';
    if (!clientPhoneNumber.trim()) errors.clientPhoneNumber = 'Client phone is required.';
    else if (!phoneRegex.test(clientPhoneNumber)) errors.clientPhoneNumber = 'Client phone must be 10 digits.';
    if (!clientEmail.trim()) errors.clientEmail = 'Client email is required.';
    else if (!emailRegex.test(clientEmail)) errors.clientEmail = 'Invalid client email.';

    items.forEach((item, index) => {
      if (!item.itemName.trim()) errors[`itemName-${index}`] = 'Item name required.';
      if (item.rate <= 0 || isNaN(item.rate)) errors[`rate-${index}`] = 'Rate must be > 0.';
      if (item.quantity <= 0 || isNaN(item.quantity)) errors[`quantity-${index}`] = 'Qty must be > 0.';
      if (item.taxPercentage < 0 || isNaN(item.taxPercentage)) errors[`taxPercentage-${index}`] = 'Invalid Tax %.';
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveInvoice = async () => {
    if (!validateForm()) {
      showToast('Please fix the validation errors before saving.', 'warning');
      return;
    }

    try {
      const invoiceData = {
        businessName,
        clientName,
        clientEmail,
        businessLogo,
        businessAddress,
        businessEmail,
        businessPhoneNumber,
        clientAddress,
        clientPhoneNumber,
        items,
        subtotal,
        taxAmount: totalTaxAmount,
        grandTotal,
        invoiceNumber,
        currencySymbol,
      };

      await axiosInstance.post('/smartdocs/smart-invoices', invoiceData);
      showToast('Invoice saved successfully to history.', 'success');
      fetchInvoiceHistory();
    } catch (error) {
      console.error('Error saving invoice:', error);
      showToast('Failed to save invoice.', 'error');
    }
  };

  const handleExportPdf = async () => {
    if (!validateForm()) {
      showToast('Please fill in essential invoice details before exporting.', 'warning');
      return;
    }
    if (!invoicePreviewRef.current) return;
    setIsExporting(true);

    try {
      const canvas = await html2canvas(invoicePreviewRef.current, {
        scale: 2,
        useCORS: true,
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`Invoice_${clientName.replace(/[^a-zA-Z0-9]/g, '_')}_${invoiceNumber}.pdf`);
      showToast('PDF exported successfully!', 'success');
    } catch (err) {
      console.error('PDF export failed:', err);
      showToast('Export to PDF failed.', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportImage = async () => {
    if (!validateForm()) {
      showToast('Please fill in essential invoice details before exporting.', 'warning');
      return;
    }
    if (!invoicePreviewRef.current) return;
    setIsExporting(true);

    try {
      const canvas = await html2canvas(invoicePreviewRef.current, {
        scale: 2,
        useCORS: true,
      });
      const imgData = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `Invoice_${clientName.replace(/[^a-zA-Z0-9]/g, '_')}_${invoiceNumber}.png`;
      link.href = imgData;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('Image exported successfully!', 'success');
    } catch (err) {
      console.error('Image export failed:', err);
      showToast('Export to Image failed.', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  const handleLoadInvoiceToEditor = (inv: Invoice) => {
    setBusinessName(inv.businessName || '');
    setBusinessLogo(inv.businessLogo || null);
    setBusinessAddress(inv.businessAddress || '');
    setBusinessEmail(inv.businessEmail || '');
    setBusinessPhoneNumber(inv.businessPhoneNumber || '');

    setClientName(inv.clientName || '');
    setClientEmail(inv.clientEmail || '');
    setClientAddress(inv.clientAddress || '');
    setClientPhoneNumber(inv.clientPhoneNumber || '');

    setInvoiceNumber(inv.invoiceNumber || `INV-${inv.id}`);
    setCurrencySymbol(inv.currencySymbol || '₹');
    if (Array.isArray(inv.items) && inv.items.length > 0) {
      setItems(inv.items);
    }

    showToast(`Loaded invoice for ${inv.clientName} into editor.`, 'success');
  };

  const filteredHistory = invoiceHistory.filter((inv) =>
    inv.clientName.toLowerCase().includes(historySearch.toLowerCase()) ||
    inv.businessName.toLowerCase().includes(historySearch.toLowerCase())
  );

  return (
    <div className="w-full max-w-full text-gray-100 font-sans relative selection:bg-indigo-500/30 space-y-6 pb-12">
      <SEO
        title="Smart AI Invoice Suite & Generator | NexaFlow AI"
        description="Create professional, tax-compliant business invoices in seconds with multi-currency support, live studio preview, customizable templates, and PDF export."
        canonical="/premium/smartdocs/smartinvoice"
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
              Smart Invoice Studio
            </h1>
            <p className="text-gray-400 text-sm mt-1 max-w-xl">
              Design, calculate, and export high-precision financial invoices with real-time live preview and template switcher.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-[#0b0b0f] px-3.5 py-2 rounded-xl border border-white/10 text-center">
              <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Total Saved</p>
              <p className="text-lg font-bold text-indigo-400">{invoiceHistory.length}</p>
            </div>
            <div className="bg-[#0b0b0f] px-3.5 py-2 rounded-xl border border-white/10 text-center">
              <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Active Currency</p>
              <p className="text-lg font-bold text-emerald-400">{currencySymbol}</p>
            </div>
            <Button
              onClick={handleSaveInvoice}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-indigo-500/20 rounded-xl flex items-center gap-2 text-xs sm:text-sm px-4 py-2"
            >
              <Save className="w-4 h-4" />
              Save Invoice
            </Button>
          </div>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="w-full grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left Column: Form Controls (7 cols on xl) */}
        <div className="xl:col-span-7 space-y-6 w-full">
          {/* Card 1: Company & Logo Details */}
          <Card className="bg-[#0b0b0f] border-white/10 shadow-2xl rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-white/10 bg-white/[0.02]">
              <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-indigo-400" />
                Business & Sender Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {/* Logo Upload Dropzone */}
              <div>
                <Label className="text-xs text-gray-300 font-semibold mb-1.5 block">Business Logo</Label>
                <div className="flex items-center gap-4">
                  {businessLogo ? (
                    <div className="relative group">
                      <img src={businessLogo} alt="Logo" className="h-16 w-28 object-contain p-2 bg-white rounded-xl border border-white/10" />
                      <button
                        onClick={() => setBusinessLogo(null)}
                        className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 shadow hover:bg-red-500 transition"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex-1 flex items-center justify-center gap-3 p-4 rounded-xl border border-dashed border-white/20 bg-[#111118] hover:border-indigo-500/50 cursor-pointer transition-all">
                      <UploadCloud className="w-5 h-5 text-indigo-400" />
                      <span className="text-xs text-gray-400 font-medium">Click to upload company logo (PNG, JPG max 2MB)</span>
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="businessName" className="text-xs text-gray-300">Business Name</Label>
                  <Input
                    id="businessName"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Your Business Name"
                    className="bg-[#111118] text-white border-white/10 hover:border-indigo-500/40 focus:border-indigo-500 rounded-xl text-sm"
                  />
                  {validationErrors.businessName && <p className="text-red-400 text-xs mt-1">{validationErrors.businessName}</p>}
                </div>
                <div>
                  <Label htmlFor="businessEmail" className="text-xs text-gray-300">Business Email</Label>
                  <Input
                    id="businessEmail"
                    type="email"
                    value={businessEmail}
                    onChange={(e) => setBusinessEmail(e.target.value)}
                    placeholder="billing@company.com"
                    className="bg-[#111118] text-white border-white/10 hover:border-indigo-500/40 focus:border-indigo-500 rounded-xl text-sm"
                  />
                  {validationErrors.businessEmail && <p className="text-red-400 text-xs mt-1">{validationErrors.businessEmail}</p>}
                </div>
                <div>
                  <Label htmlFor="businessPhone" className="text-xs text-gray-300">Phone Number (10 Digits)</Label>
                  <Input
                    id="businessPhone"
                    type="tel"
                    value={businessPhoneNumber}
                    onChange={(e) => setBusinessPhoneNumber(e.target.value)}
                    placeholder="9876543210"
                    className="bg-[#111118] text-white border-white/10 hover:border-indigo-500/40 focus:border-indigo-500 rounded-xl text-sm"
                  />
                  {validationErrors.businessPhoneNumber && <p className="text-red-400 text-xs mt-1">{validationErrors.businessPhoneNumber}</p>}
                </div>
                <div>
                  <Label htmlFor="businessAddress" className="text-xs text-gray-300">Address / City</Label>
                  <Input
                    id="businessAddress"
                    value={businessAddress}
                    onChange={(e) => setBusinessAddress(e.target.value)}
                    placeholder="Street Address, City, Zip"
                    className="bg-[#111118] text-white border-white/10 hover:border-indigo-500/40 focus:border-indigo-500 rounded-xl text-sm"
                  />
                  {validationErrors.businessAddress && <p className="text-red-400 text-xs mt-1">{validationErrors.businessAddress}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Client & Invoice Metadata */}
          <Card className="bg-[#0b0b0f] border-white/10 shadow-2xl rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-white/10 bg-white/[0.02]">
              <CardTitle className="text-lg font-bold text-white flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-indigo-400" />
                  Client & Invoice Parameters
                </span>
                <span className="text-xs text-indigo-400 font-mono bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20">
                  {invoiceNumber}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="invNum" className="text-xs text-gray-300">Invoice #</Label>
                  <Input
                    id="invNum"
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                    className="bg-[#111118] text-white border-white/10 focus:border-indigo-500 rounded-xl text-sm font-mono"
                  />
                </div>
                <div>
                  <Label htmlFor="invCurrency" className="text-xs text-gray-300">Billing Currency</Label>
                  <Select
                    value={currencySymbol}
                    onValueChange={(val) => setCurrencySymbol(val)}
                  >
                    <SelectTrigger className="bg-[#111118] text-white border-white/10 focus:border-indigo-500 rounded-xl text-sm">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0b0b0f] text-white border-white/10">
                      {CURRENCIES.map((c) => (
                        <SelectItem key={c.code} value={c.symbol}>
                          {c.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="invDate" className="text-xs text-gray-300">Invoice Date</Label>
                  <Input
                    id="invDate"
                    type="date"
                    value={invoiceDate}
                    onChange={(e) => setInvoiceDate(e.target.value)}
                    className="bg-[#111118] text-white border-white/10 focus:border-indigo-500 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="dueDate" className="text-xs text-gray-300">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="bg-[#111118] text-white border-white/10 focus:border-indigo-500 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div>
                  <Label htmlFor="clientName" className="text-xs text-gray-300">Client Name / Company</Label>
                  <Input
                    id="clientName"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Client Company Name"
                    className="bg-[#111118] text-white border-white/10 hover:border-indigo-500/40 focus:border-indigo-500 rounded-xl text-sm"
                  />
                  {validationErrors.clientName && <p className="text-red-400 text-xs mt-1">{validationErrors.clientName}</p>}
                </div>
                <div>
                  <Label htmlFor="clientEmail" className="text-xs text-gray-300">Client Email</Label>
                  <Input
                    id="clientEmail"
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="accounts@client.com"
                    className="bg-[#111118] text-white border-white/10 hover:border-indigo-500/40 focus:border-indigo-500 rounded-xl text-sm"
                  />
                  {validationErrors.clientEmail && <p className="text-red-400 text-xs mt-1">{validationErrors.clientEmail}</p>}
                </div>
                <div>
                  <Label htmlFor="clientPhone" className="text-xs text-gray-300">Client Phone (10 Digits)</Label>
                  <Input
                    id="clientPhone"
                    type="tel"
                    value={clientPhoneNumber}
                    onChange={(e) => setClientPhoneNumber(e.target.value)}
                    placeholder="9123456789"
                    className="bg-[#111118] text-white border-white/10 hover:border-indigo-500/40 focus:border-indigo-500 rounded-xl text-sm"
                  />
                  {validationErrors.clientPhoneNumber && <p className="text-red-400 text-xs mt-1">{validationErrors.clientPhoneNumber}</p>}
                </div>
                <div>
                  <Label htmlFor="clientAddress" className="text-xs text-gray-300">Client Billing Address</Label>
                  <Input
                    id="clientAddress"
                    value={clientAddress}
                    onChange={(e) => setClientAddress(e.target.value)}
                    placeholder="Client Billing Address"
                    className="bg-[#111118] text-white border-white/10 hover:border-indigo-500/40 focus:border-indigo-500 rounded-xl text-sm"
                  />
                  {validationErrors.clientAddress && <p className="text-red-400 text-xs mt-1">{validationErrors.clientAddress}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 3: Line Items Editor */}
          <Card className="bg-[#0b0b0f] border-white/10 shadow-2xl rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-white/10 bg-white/[0.02] flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                <Receipt className="w-5 h-5 text-indigo-400" />
                Line Items Breakdown
              </CardTitle>
              <Button
                onClick={handleAddItem}
                size="sm"
                className="bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs rounded-xl flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Add Item
              </Button>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {items.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-[#111118] border border-white/10 space-y-3 relative group hover:border-indigo-500/30 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-semibold text-gray-400">Item #{idx + 1}</span>
                    <button
                      onClick={() => handleRemoveItem(idx)}
                      className="text-gray-500 hover:text-red-400 transition"
                      title="Remove Item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                    <div className="md:col-span-4">
                      <Label className="text-[11px] text-gray-400">Item Description</Label>
                      <Input
                        value={item.itemName}
                        onChange={(e) => handleItemChange(idx, 'itemName', e.target.value)}
                        placeholder="e.g. Design Consulting"
                        className="bg-[#0b0b0f] text-white border-white/10 text-xs rounded-lg mt-1"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label className="text-[11px] text-gray-400">Rate ({currencySymbol})</Label>
                      <Input
                        type="number"
                        value={item.rate === 0 ? '' : item.rate}
                        onChange={(e) => handleItemChange(idx, 'rate', parseFloat(e.target.value) || 0)}
                        placeholder="0.00"
                        className="bg-[#0b0b0f] text-white border-white/10 text-xs rounded-lg mt-1 font-mono"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label className="text-[11px] text-gray-400">Qty</Label>
                      <Input
                        type="number"
                        value={item.quantity === 0 ? '' : item.quantity}
                        onChange={(e) => handleItemChange(idx, 'quantity', parseInt(e.target.value) || 0)}
                        placeholder="1"
                        className="bg-[#0b0b0f] text-white border-white/10 text-xs rounded-lg mt-1 font-mono text-center"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label className="text-[11px] text-gray-400">Tax %</Label>
                      <Input
                        type="number"
                        value={item.taxPercentage === 0 ? '' : item.taxPercentage}
                        onChange={(e) => handleItemChange(idx, 'taxPercentage', parseFloat(e.target.value) || 0)}
                        placeholder="18"
                        className="bg-[#0b0b0f] text-white border-white/10 text-xs rounded-lg mt-1 font-mono text-center"
                      />
                    </div>
                    <div className="md:col-span-2 text-right">
                      <Label className="text-[11px] text-gray-400">Total Price</Label>
                      <p className="text-sm font-mono font-bold text-emerald-400 mt-2">
                        {currencySymbol}{(item.finalPrice || 0).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Financial Calculation Bar */}
              <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-indigo-950/30 to-purple-950/30 border border-indigo-500/20 space-y-2 text-sm">
                <div className="flex justify-between text-gray-300">
                  <span>Subtotal:</span>
                  <span className="font-mono font-semibold">{currencySymbol}{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Tax Amount:</span>
                  <span className="font-mono font-semibold">{currencySymbol}{totalTaxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-gray-300">
                  <span>Discount ({currencySymbol}):</span>
                  <input
                    type="number"
                    value={discountAmount === 0 ? '' : discountAmount}
                    onChange={(e) => setDiscountAmount(parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    className="w-24 px-2 py-0.5 text-right font-mono text-xs bg-[#111118] text-white border border-white/10 rounded-md focus:border-indigo-500"
                  />
                </div>
                <div className="pt-2 border-t border-white/10 flex justify-between items-center text-base font-extrabold text-white">
                  <span>Grand Total:</span>
                  <span className="font-mono text-emerald-400 text-xl">{currencySymbol}{grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 4: History Table / Cards */}
          <Card className="bg-[#0b0b0f] border-white/10 shadow-2xl rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-white/10 bg-white/[0.02] flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
              <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-400" />
                Saved Invoices History ({filteredHistory.length})
              </CardTitle>
              <div className="relative w-full md:w-60">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-500" />
                <input
                  type="text"
                  value={historySearch}
                  onChange={(e) => setHistorySearch(e.target.value)}
                  placeholder="Search client name..."
                  className="w-full pl-9 pr-3 py-1.5 bg-[#111118] border border-white/10 text-xs text-white rounded-xl focus:border-indigo-500"
                />
              </div>
            </CardHeader>
            <CardContent className="p-4">
              {filteredHistory.length === 0 ? (
                <div className="p-8 text-center text-gray-500 text-sm">
                  No invoices found in history. Click "Save Invoice" above to save drafts.
                </div>
              ) : (
                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                  {filteredHistory.map((inv) => (
                    <div
                      key={inv.id}
                      className="p-3.5 rounded-xl bg-[#111118] border border-white/10 flex items-center justify-between hover:border-indigo-500/40 transition-all group"
                    >
                      <div
                        onClick={() => handleLoadInvoiceToEditor(inv)}
                        className="cursor-pointer flex-1"
                      >
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-white group-hover:text-indigo-400 transition">
                            {inv.clientName || 'Unnamed Client'}
                          </p>
                          <span className="text-[10px] font-mono bg-indigo-500/10 text-indigo-300 px-2 py-0.5 rounded-md border border-indigo-500/20">
                            {inv.invoiceNumber || `#${inv.id}`}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {inv.currencySymbol || '₹'}{(inv.grandTotal || 0).toFixed(2)} • {new Date(inv.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setSelectedInvoice(inv);
                            setIsModalOpen(true);
                          }}
                          className="h-8 text-xs text-gray-300 hover:text-white hover:bg-white/10 rounded-lg flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" /> Preview
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteInvoice(inv.id)}
                          className="h-8 text-xs text-red-400 hover:bg-red-500/20 rounded-lg"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Studio Workbench Live Preview (5 cols on xl) */}
        <div className="xl:col-span-5 space-y-6 w-full overflow-hidden">
          <Card className="bg-[#0b0b0f] border-white/10 shadow-2xl rounded-2xl overflow-hidden sticky top-8">
            <CardHeader className="border-b border-white/10 bg-white/[0.02] space-y-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                  <LayoutGrid className="w-5 h-5 text-indigo-400" />
                  Live Document Workbench
                </CardTitle>
                <span className="text-xs text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  Live Preview
                </span>
              </div>

              {/* Template Picker Pills */}
              <div>
                <Label className="text-[11px] text-gray-400 font-semibold mb-1.5 block">Select Invoice Template Style:</Label>
                <div className="grid grid-cols-2 gap-2">
                  {TEMPLATES.map((tmpl) => (
                    <button
                      key={tmpl.id}
                      onClick={() => setSelectedTemplate(tmpl.id)}
                      className={`p-2 rounded-xl text-left border transition-all ${
                        selectedTemplate === tmpl.id
                          ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg shadow-indigo-500/10'
                          : 'bg-[#111118] border-white/10 text-gray-400 hover:text-white hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold">{tmpl.name}</span>
                        <span className="text-[9px] px-1 py-0.5 rounded bg-white/10 text-indigo-300 font-mono">
                          {tmpl.badge}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-400 mt-1 line-clamp-1">{tmpl.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-3 sm:p-4 space-y-4">
              {/* Paper Canvas Display Box */}
              <div className="bg-slate-950/80 p-2 sm:p-3 rounded-xl border border-white/5 shadow-inner overflow-x-auto overflow-y-auto max-h-[640px] w-full">
                <div className="w-full min-w-[480px]">
                  <div
                    ref={invoicePreviewRef}
                    className="bg-white rounded-lg shadow-2xl w-full transform origin-top transition-all"
                  >
                  {selectedTemplate === 'Template1' && (
                    <Template1
                      invoiceData={{
                        businessName,
                        businessLogo,
                        businessAddress,
                        businessEmail,
                        businessPhoneNumber,
                        clientName,
                        clientEmail,
                        clientAddress,
                        clientPhoneNumber,
                        items,
                        subtotal,
                        taxAmount: totalTaxAmount,
                        discount: discountAmount,
                        grandTotal,
                        invoiceNumber,
                        invoiceDate,
                        dueDate,
                        currencySymbol,
                      }}
                    />
                  )}

                  {selectedTemplate === 'Template2' && (
                    <Template2
                      invoiceData={{
                        businessName,
                        businessLogo,
                        businessAddress,
                        businessEmail,
                        businessPhoneNumber,
                        clientName,
                        clientEmail,
                        clientAddress,
                        clientPhoneNumber,
                        items,
                        subtotal,
                        taxAmount: totalTaxAmount,
                        discount: discountAmount,
                        grandTotal,
                        invoiceNumber,
                        invoiceDate,
                        dueDate,
                        currencySymbol,
                      }}
                    />
                  )}

                  {selectedTemplate === 'Template3' && (
                    <Template3
                      invoiceData={{
                        businessName,
                        businessLogo,
                        businessAddress,
                        businessEmail,
                        businessPhoneNumber,
                        clientName,
                        clientEmail,
                        clientAddress,
                        clientPhoneNumber,
                        items,
                        subtotal,
                        taxAmount: totalTaxAmount,
                        discount: discountAmount,
                        grandTotal,
                        invoiceNumber,
                        invoiceDate,
                        dueDate,
                        currencySymbol,
                      }}
                    />
                  )}

                  {selectedTemplate === 'Template4' && (
                    <Template4
                      invoiceData={{
                        businessName,
                        businessLogo,
                        businessAddress,
                        businessEmail,
                        businessPhoneNumber,
                        clientName,
                        clientEmail,
                        clientAddress,
                        clientPhoneNumber,
                        items,
                        subtotal,
                        taxAmount: totalTaxAmount,
                        discount: discountAmount,
                        grandTotal,
                        invoiceNumber,
                        invoiceDate,
                        dueDate,
                        currencySymbol,
                      }}
                    />
                  )}
                </div>
              </div>
            </div>

              {/* Action Export Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Button
                  onClick={handleExportImage}
                  disabled={isExporting}
                  variant="outline"
                  className="bg-[#111118] hover:bg-[#1a1a24] text-white border-white/10 rounded-xl text-xs flex items-center justify-center gap-2"
                >
                  <FileImage className="w-4 h-4 text-purple-400" /> Export Image
                </Button>

                <Button
                  onClick={handleExportPdf}
                  disabled={isExporting}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" /> Export PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {confirmDeleteOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b0b0f] border border-white/10 p-6 rounded-2xl max-w-sm w-full text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Delete Invoice?</h3>
            <p className="text-xs text-gray-400">
              Are you sure you want to delete this saved invoice? This action cannot be undone.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setConfirmDeleteOpen(false)}
                className="bg-[#111118] text-gray-300 border-white/10 hover:bg-white/10 text-xs rounded-xl"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmDeletion}
                className="bg-red-600 hover:bg-red-500 text-white text-xs rounded-xl shadow-lg shadow-red-600/30"
              >
                Confirm Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal Component */}
      <InvoicePreviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        invoiceData={selectedInvoice}
        selectedTemplate={selectedTemplate}
      />
    </div>
  );
};

export default SmartInvoiceGeneratorPage;
