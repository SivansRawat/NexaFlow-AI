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

const Template1: React.FC<InvoiceTemplateProps> = ({ invoiceData }) => {
  const symbol = invoiceData.currencySymbol || '₹';
  const invNumber = invoiceData.invoiceNumber || 'INV-2026-001';
  const invDate = invoiceData.invoiceDate || new Date().toLocaleDateString();
  const dueDate = invoiceData.dueDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString();
  const discountVal = invoiceData.discount || 0;

  return (
    <div className="p-6 md:p-8 bg-white border border-gray-200 rounded-xl shadow-xl font-sans text-gray-800 w-full">
      {/* Header Banner */}
      <div className="flex justify-between items-start mb-8 pb-6 border-b-2 border-indigo-600">
        <div>
          {invoiceData.businessLogo ? (
            <img src={invoiceData.businessLogo} alt="Business Logo" className="h-14 object-contain mb-3" />
          ) : (
            <div className="h-12 w-12 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xl mb-3 shadow-md">
              {(invoiceData.businessName || 'I').charAt(0).toUpperCase()}
            </div>
          )}
          <h1 className="text-2xl font-extrabold text-gray-900">{invoiceData.businessName || 'Business Name'}</h1>
          <p className="text-sm text-gray-600 mt-1 max-w-xs">{invoiceData.businessAddress}</p>
          {invoiceData.businessEmail && <p className="text-xs text-gray-500 mt-1">Email: {invoiceData.businessEmail}</p>}
          {invoiceData.businessPhoneNumber && <p className="text-xs text-gray-500">Phone: {invoiceData.businessPhoneNumber}</p>}
        </div>

        <div className="text-right">
          <h2 className="text-3xl font-black text-indigo-900 tracking-tight">INVOICE</h2>
          <p className="text-sm font-mono font-semibold text-gray-700 mt-1">{invNumber}</p>
          <div className="mt-3 text-xs text-gray-500 space-y-0.5">
            <p><span className="font-semibold text-gray-700">Date:</span> {invDate}</p>
            <p><span className="font-semibold text-gray-700">Due Date:</span> {dueDate}</p>
          </div>
        </div>
      </div>

      {/* Bill To Block */}
      <div className="mb-8 p-4 bg-indigo-50/50 rounded-lg border border-indigo-100">
        <h3 className="text-xs font-bold text-indigo-700 uppercase tracking-wider mb-2">Billed To:</h3>
        <p className="text-lg font-bold text-gray-900">{invoiceData.clientName || 'Client Name'}</p>
        <p className="text-sm text-gray-600 mt-0.5 whitespace-pre-line">{invoiceData.clientAddress}</p>
        {invoiceData.clientEmail && <p className="text-xs text-gray-500 mt-1">Email: {invoiceData.clientEmail}</p>}
        {invoiceData.clientPhoneNumber && <p className="text-xs text-gray-500">Phone: {invoiceData.clientPhoneNumber}</p>}
      </div>

      {/* Items Table */}
      <div className="overflow-hidden rounded-lg border border-gray-200 mb-8">
        <table className="min-w-full bg-white text-left border-collapse">
          <thead>
            <tr className="bg-indigo-900 text-white uppercase text-xs font-semibold tracking-wider">
              <th className="py-3 px-4">Item Name</th>
              <th className="py-3 px-4 text-center">Rate</th>
              <th className="py-3 px-4 text-center">Qty</th>
              <th className="py-3 px-4 text-center">Tax %</th>
              <th className="py-3 px-4 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-sm">
            {invoiceData.items.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50/80 transition-colors">
                <td className="py-3.5 px-4 font-medium text-gray-900">{item.itemName || '—'}</td>
                <td className="py-3.5 px-4 text-center font-mono text-gray-700">{symbol}{(item.rate || 0).toFixed(2)}</td>
                <td className="py-3.5 px-4 text-center font-mono text-gray-700">{item.quantity}</td>
                <td className="py-3.5 px-4 text-center font-mono text-gray-500">{item.taxPercentage}%</td>
                <td className="py-3.5 px-4 text-right font-mono font-semibold text-gray-900">{symbol}{(item.finalPrice || 0).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Calculations & Totals */}
      <div className="flex justify-end mb-8">
        <div className="w-full md:w-80 space-y-2 text-sm">
          <div className="flex justify-between py-1.5 border-b border-gray-200 text-gray-600">
            <span>Subtotal:</span>
            <span className="font-mono font-semibold text-gray-900">{symbol}{(invoiceData.subtotal || 0).toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-gray-200 text-gray-600">
            <span>Tax Amount:</span>
            <span className="font-mono font-semibold text-gray-900">{symbol}{(invoiceData.taxAmount || 0).toFixed(2)}</span>
          </div>
          {discountVal > 0 && (
            <div className="flex justify-between py-1.5 border-b border-gray-200 text-indigo-600">
              <span>Discount:</span>
              <span className="font-mono font-semibold">-{symbol}{discountVal.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between py-2 pt-3 text-lg font-bold text-indigo-900 border-t-2 border-indigo-600">
            <span>Grand Total:</span>
            <span className="font-mono">{symbol}{(invoiceData.grandTotal || 0).toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-6 border-t border-gray-200 text-center text-xs text-gray-500">
        <p className="font-medium text-gray-700">Thank you for your business!</p>
        <p className="mt-1">For any queries regarding this invoice, please reach out to {invoiceData.businessEmail || 'our team'}.</p>
      </div>
    </div>
  );
};

export default Template1;
