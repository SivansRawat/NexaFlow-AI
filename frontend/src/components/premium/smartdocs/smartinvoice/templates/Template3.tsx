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

const Template3: React.FC<InvoiceTemplateProps> = ({ invoiceData }) => {
  const symbol = invoiceData.currencySymbol || '₹';
  const invNumber = invoiceData.invoiceNumber || 'INV-2026-003';
  const invDate = invoiceData.invoiceDate || new Date().toLocaleDateString();
  const dueDate = invoiceData.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString();
  const discountVal = invoiceData.discount || 0;

  return (
    <div className="p-6 md:p-8 bg-white border border-neutral-300 rounded-xl shadow-xl font-sans text-neutral-800 w-full">
      {/* Top Bar */}
      <div className="flex justify-between items-start mb-8 pb-6 border-b border-neutral-200">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900">INVOICE</h1>
          <p className="text-sm font-mono font-semibold text-neutral-500 mt-1">{invNumber}</p>
          <div className="mt-2 text-xs text-neutral-500 space-y-0.5">
            <p>Date: <span className="font-semibold text-neutral-800">{invDate}</span></p>
            <p>Due: <span className="font-semibold text-neutral-800">{dueDate}</span></p>
          </div>
        </div>

        <div className="text-right">
          {invoiceData.businessLogo && (
            <img src={invoiceData.businessLogo} alt="Business Logo" className="h-14 object-contain mb-2 ml-auto" />
          )}
          <p className="text-xl font-bold text-neutral-900">{invoiceData.businessName || 'Business Name'}</p>
          <p className="text-xs text-neutral-600 max-w-xs ml-auto mt-0.5">{invoiceData.businessAddress}</p>
          {invoiceData.businessEmail && <p className="text-xs text-neutral-500 mt-0.5">Email: {invoiceData.businessEmail}</p>}
          {invoiceData.businessPhoneNumber && <p className="text-xs text-neutral-500">Phone: {invoiceData.businessPhoneNumber}</p>}
        </div>
      </div>

      {/* Addresses */}
      <div className="grid grid-cols-2 gap-8 mb-8 p-4 bg-neutral-50 rounded-lg border border-neutral-200">
        <div>
          <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">Bill To</h3>
          <p className="text-base font-bold text-neutral-900">{invoiceData.clientName || 'Client Name'}</p>
          <p className="text-xs text-neutral-600 mt-0.5 whitespace-pre-line">{invoiceData.clientAddress}</p>
          {invoiceData.clientEmail && <p className="text-xs text-neutral-500 mt-1">Email: {invoiceData.clientEmail}</p>}
          {invoiceData.clientPhoneNumber && <p className="text-xs text-neutral-500">Phone: {invoiceData.clientPhoneNumber}</p>}
        </div>
        <div className="text-right flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">Billing Currency</h3>
            <p className="text-sm font-semibold text-neutral-900">{symbol} Standard</p>
          </div>
          <div className="text-xs text-neutral-500">
            <span>Terms: Net 30 Days</span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-neutral-200 mb-8">
        <table className="min-w-full bg-white text-left border-collapse">
          <thead>
            <tr className="bg-neutral-100 border-b border-neutral-200 text-neutral-700 uppercase text-xs font-semibold tracking-wider">
              <th className="py-3 px-4 w-10 text-center">#</th>
              <th className="py-3 px-4">Item Description</th>
              <th className="py-3 px-4 text-center">Qty</th>
              <th className="py-3 px-4 text-right">Unit Price</th>
              <th className="py-3 px-4 text-right">Tax (%)</th>
              <th className="py-3 px-4 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 text-sm">
            {invoiceData.items.map((item, index) => (
              <tr key={index} className="hover:bg-neutral-50">
                <td className="py-3 px-4 text-center text-xs font-mono text-neutral-400">{index + 1}</td>
                <td className="py-3 px-4 font-medium text-neutral-900">{item.itemName || '—'}</td>
                <td className="py-3 px-4 text-center font-mono text-neutral-700">{item.quantity}</td>
                <td className="py-3 px-4 text-right font-mono text-neutral-700">{symbol}{(item.rate || 0).toFixed(2)}</td>
                <td className="py-3 px-4 text-right font-mono text-neutral-500">{item.taxPercentage}%</td>
                <td className="py-3 px-4 text-right font-mono font-semibold text-neutral-900">{symbol}{(item.finalPrice || 0).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Financial Summary */}
      <div className="flex justify-end mb-8">
        <div className="w-full md:w-72 space-y-2 text-sm">
          <div className="flex justify-between py-1 border-b border-neutral-200 text-neutral-600">
            <span>Subtotal</span>
            <span className="font-mono font-medium text-neutral-900">{symbol}{(invoiceData.subtotal || 0).toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-neutral-200 text-neutral-600">
            <span>Total Tax</span>
            <span className="font-mono font-medium text-neutral-900">{symbol}{(invoiceData.taxAmount || 0).toFixed(2)}</span>
          </div>
          {discountVal > 0 && (
            <div className="flex justify-between py-1 border-b border-neutral-200 text-neutral-600">
              <span>Discount</span>
              <span className="font-mono font-medium text-neutral-900">-{symbol}{discountVal.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between py-2 text-base font-bold text-neutral-900 border-t-2 border-neutral-900">
            <span>Grand Total</span>
            <span className="font-mono">{symbol}{(invoiceData.grandTotal || 0).toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-neutral-500 mt-8 pt-4 border-t border-neutral-200">
        <p>Thank you for your business. We appreciate your prompt payment.</p>
      </div>
    </div>
  );
};

export default Template3;
