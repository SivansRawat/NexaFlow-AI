import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Button } from '../../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../ui/dialog';
import Template1 from './smartinvoice/templates/Template1';
import Template2 from './smartinvoice/templates/Template2';
import Template3 from './smartinvoice/templates/Template3';
import Template4 from './smartinvoice/templates/Template4';
import { Download, FileImage, Printer, Layout } from 'lucide-react';

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

interface InvoicePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoiceData: Invoice | null;
  selectedTemplate: string;
}

const InvoicePreviewModal: React.FC<InvoicePreviewModalProps> = ({
  isOpen,
  onClose,
  invoiceData,
  selectedTemplate: initialTemplate,
}) => {
  const invoicePreviewRef = useRef<HTMLDivElement>(null);
  const [activeTemplate, setActiveTemplate] = useState<string>(initialTemplate || 'Template1');
  const [isExporting, setIsExporting] = useState<boolean>(false);

  // Sync initial template when prop changes
  React.useEffect(() => {
    if (initialTemplate) setActiveTemplate(initialTemplate);
  }, [initialTemplate]);

  const handleExportPdf = async () => {
    if (!invoicePreviewRef.current) return;
    setIsExporting(true);

    try {
      const canvas = await html2canvas(invoicePreviewRef.current, { scale: 2, useCORS: true });
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

      pdf.save(`Invoice_${invoiceData?.clientName ? invoiceData.clientName.replace(/[^a-zA-Z0-9]/g, '_') : invoiceData?.id || 'doc'}.pdf`);
    } catch (err) {
      console.error('Failed to export PDF:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportImage = async () => {
    if (!invoicePreviewRef.current) return;
    setIsExporting(true);

    try {
      const canvas = await html2canvas(invoicePreviewRef.current, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `Invoice_${invoiceData?.clientName ? invoiceData.clientName.replace(/[^a-zA-Z0-9]/g, '_') : invoiceData?.id || 'doc'}.png`;
      link.href = imgData;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Failed to export Image:', err);
    } finally {
      setIsExporting(false);
    }
  };

  if (!invoiceData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[92vh] overflow-y-auto bg-[#0b0b0f] text-white border border-white/10 shadow-2xl p-6 rounded-2xl">
        <DialogHeader className="border-b border-white/10 pb-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
                <Printer className="w-5 h-5 text-indigo-400" />
                Invoice Preview
              </DialogTitle>
              <DialogDescription className="text-gray-400 text-xs mt-0.5">
                Review document formatting and download in high-resolution PDF or image format.
              </DialogDescription>
            </div>

            {/* Template Selection Pills in Modal */}
            <div className="flex items-center gap-1.5 bg-[#111118] p-1.5 rounded-xl border border-white/10">
              <span className="text-[11px] text-gray-400 px-2 flex items-center gap-1">
                <Layout className="w-3.5 h-3.5" />
                Style:
              </span>
              {[
                { id: 'Template1', label: 'Executive' },
                { id: 'Template2', label: 'Emerald' },
                { id: 'Template3', label: 'Minimal' },
                { id: 'Template4', label: 'Creative' },
              ].map((tmpl) => (
                <button
                  key={tmpl.id}
                  onClick={() => setActiveTemplate(tmpl.id)}
                  className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
                    activeTemplate === tmpl.id
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {tmpl.label}
                </button>
              ))}
            </div>
          </div>
        </DialogHeader>

        {/* Action Controls */}
        <div className="flex justify-end items-center gap-3 my-4">
          <Button
            onClick={handleExportImage}
            disabled={isExporting}
            variant="outline"
            className="bg-[#111118] hover:bg-[#1a1a24] text-gray-200 border-white/10 hover:border-white/20 text-xs flex items-center gap-2 rounded-xl"
          >
            <FileImage className="w-4 h-4 text-purple-400" />
            Download PNG
          </Button>
          <Button
            onClick={handleExportPdf}
            disabled={isExporting}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-indigo-500/20 text-xs flex items-center gap-2 rounded-xl"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </Button>
        </div>

        {/* Rendered Canvas Container */}
        <div className="p-6 bg-slate-900/60 rounded-2xl border border-white/5 flex justify-center items-center">
          <div ref={invoicePreviewRef} className="w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden text-gray-900">
            {activeTemplate === 'Template1' && <Template1 invoiceData={invoiceData} />}
            {activeTemplate === 'Template2' && <Template2 invoiceData={invoiceData} />}
            {activeTemplate === 'Template3' && <Template3 invoiceData={invoiceData} />}
            {activeTemplate === 'Template4' && <Template4 invoiceData={invoiceData} />}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InvoicePreviewModal;
