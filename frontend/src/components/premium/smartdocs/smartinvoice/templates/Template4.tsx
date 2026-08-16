import React from 'react';

export interface Item {
  itemName: string;
  rate: number;
  quantity: number;
  taxPercentage: number;
  finalPrice: number;
}

export interface InvoiceTemplateProps {
  invoiceData: {
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
    discount?: number;
    grandTotal: number;
    invoiceNumber?: string;
    invoiceDate?: string;
    dueDate?: string;
    currencySymbol?: string;
  };
}

const Template4: React.FC<InvoiceTemplateProps> = ({ invoiceData }) => {
  const symbol = invoiceData.currencySymbol || '₹';
  const invNumber = invoiceData.invoiceNumber || 'INV-2026-004';
  const invDate = invoiceData.invoiceDate || new Date().toLocaleDateString();
  const dueDate = invoiceData.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString();
  const discountVal = invoiceData.discount || 0;

  return (
    <div className="p-6 md:p-8 bg-slate-50 border border-slate-200 rounded-2xl shadow-xl font-sans text-slate-800 w-full relative overflow-hidden">
      {/* Top Background Gradient Glow */}
      <div className="absolute top-0 right-0 w-96 h-48 bg-gradient-to-bl from-indigo-500/10 via-purple-500/10 to-transparent rounded-bl-full pointer-events-none" />

      {/* Header Section */}
      <div className="flex justify-between items-start mb-8 relative z-10">
        <div>
          {invoiceData.businessLogo ? (
            <img src={invoiceData.businessLogo} alt="Logo" className="h-16 object-contain mb-3" />
          ) : (
            <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center font-extrabold text-xl shadow-lg shadow-indigo-500/20 mb-3">
              {(invoiceData.businessName || 'N').charAt(0).toUpperCase()}
            </div>
          )}
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">{invoiceData.businessName || 'Business Name'}</h1>
          <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">{invoiceData.businessAddress}</p>
          <div className="mt-2 text-xs text-slate-600 space-y-0.5">
            {invoiceData.businessEmail && <p>Email: <span className="text-slate-900 font-medium">{invoiceData.businessEmail}</span></p>}
            {invoiceData.businessPhoneNumber && <p>Tel: <span className="text-slate-900 font-medium">{invoiceData.businessPhoneNumber}</span></p>}
          </div>
        </div>

        <div className="text-right">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold uppercase tracking-wide mb-3">
            <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
            <span>Official Invoice</span>
          </div>
          <h2 className="text-2xl font-mono font-bold text-slate-900">{invNumber}</h2>
          <div className="mt-2 text-xs text-slate-500 space-y-1">
            <p>Invoice Date: <span className="font-semibold text-slate-800">{invDate}</span></p>
            <p>Payment Due: <span className="font-semibold text-indigo-600">{dueDate}</span></p>
          </div>
        </div>
      </div>

      {/* Recipient Details Banner */}
      <div className="mb-8 p-6 bg-white rounded-xl shadow-sm border border-slate-200/80 grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
        <div>
          <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block mb-1">Prepared For</span>
          <p className="text-lg font-bold text-slate-900">{invoiceData.clientName || 'Client Name'}</p>
          <p className="text-xs text-slate-600 mt-1">{invoiceData.clientAddress}</p>
          {invoiceData.clientEmail && <p className="text-xs text-slate-500 mt-1">Email: {invoiceData.clientEmail}</p>}
          {invoiceData.clientPhoneNumber && <p className="text-xs text-slate-500">Phone: {invoiceData.clientPhoneNumber}</p>}
        </div>
        <div className="md:text-right flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider block mb-1">Currency & Terms</span>
            <p className="text-sm font-semibold text-slate-900">Standard Billing ({symbol})</p>
          </div>
          <div className="text-xs text-slate-500 mt-4 md:mt-0">
            <span className="inline-block px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md font-mono text-[11px]">
              Net 30 Payment Terms
            </span>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-8 relative z-10">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-700 text-xs font-semibold uppercase tracking-wider">
              <th className="py-3.5 px-4 text-center w-12">#</th>
              <th className="py-3.5 px-4">Item & Description</th>
              <th className="py-3.5 px-4 text-center">Qty</th>
              <th className="py-3.5 px-4 text-right">Rate</th>
              <th className="py-3.5 px-4 text-right">Tax Rate</th>
              <th className="py-3.5 px-4 text-right">Line Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {invoiceData.items.map((item, idx) => (
              <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-4 px-4 text-center text-xs font-mono text-slate-400">{idx + 1}</td>
                <td className="py-4 px-4 font-semibold text-slate-900">{item.itemName || 'Item Description'}</td>
                <td className="py-4 px-4 text-center font-mono text-slate-700">{item.quantity}</td>
                <td className="py-4 px-4 text-right font-mono text-slate-700">{symbol}{(item.rate || 0).toFixed(2)}</td>
                <td className="py-4 px-4 text-right font-mono text-slate-500">{item.taxPercentage}%</td>
                <td className="py-4 px-4 text-right font-mono font-bold text-slate-900">{symbol}{(item.finalPrice || 0).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Financial Summary */}
      <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-6 relative z-10">
        <div className="text-xs text-slate-500 max-w-sm">
          <p className="font-semibold text-slate-800 mb-1">Thank you for your business!</p>
          <p className="leading-relaxed">If you have any questions regarding this invoice, please contact <span className="text-indigo-600">{invoiceData.businessEmail || 'support'}</span>.</p>
        </div>

        <div className="w-full md:w-80 bg-white p-5 rounded-xl shadow-sm border border-slate-200 space-y-2.5 text-sm">
          <div className="flex justify-between text-slate-600">
            <span>Subtotal</span>
            <span className="font-mono font-semibold text-slate-900">{symbol}{(invoiceData.subtotal || 0).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Calculated Tax</span>
            <span className="font-mono font-semibold text-slate-900">{symbol}{(invoiceData.taxAmount || 0).toFixed(2)}</span>
          </div>
          {discountVal > 0 && (
            <div className="flex justify-between text-purple-600">
              <span>Applied Discount</span>
              <span className="font-mono font-semibold">-{symbol}{discountVal.toFixed(2)}</span>
            </div>
          )}
          <div className="pt-3 border-t border-slate-200 flex justify-between items-center text-lg font-extrabold text-slate-900">
            <span>Total Due:</span>
            <span className="font-mono text-indigo-600 text-xl">{symbol}{(invoiceData.grandTotal || 0).toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Template4;
