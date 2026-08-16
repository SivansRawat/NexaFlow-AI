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

const Template2: React.FC<InvoiceTemplateProps> = ({ invoiceData }) => {
  const symbol = invoiceData.currencySymbol || '₹';
  const invNumber = invoiceData.invoiceNumber || 'INV-2026-002';
  const invDate = invoiceData.invoiceDate || new Date().toLocaleDateString();
  const dueDate = invoiceData.dueDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString();
  const discountVal = invoiceData.discount || 0;

  return (
    <div className="p-6 md:p-8 bg-white border border-gray-200 rounded-xl shadow-xl font-sans text-gray-800 w-full overflow-hidden">
      {/* Header Accent Bar */}
      <div className="h-2 w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-t-xl -mt-8 -mx-8 mb-6 px-8" />

      {/* Top Banner */}
      <div className="flex justify-between items-start mb-8 pb-6 border-b border-gray-200">
        <div>
          {invoiceData.businessLogo ? (
            <img src={invoiceData.businessLogo} alt="Logo" className="h-14 object-contain mb-3" />
          ) : (
            <div className="h-12 w-12 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xl mb-3">
              {(invoiceData.businessName || 'B').charAt(0).toUpperCase()}
            </div>
          )}
          <h1 className="text-2xl font-bold text-gray-900">{invoiceData.businessName || 'Business Name'}</h1>
          <p className="text-sm text-gray-600 max-w-xs leading-relaxed mt-1">{invoiceData.businessAddress}</p>
          {invoiceData.businessEmail && <p className="text-xs text-gray-500 mt-1">Email: {invoiceData.businessEmail}</p>}
          {invoiceData.businessPhoneNumber && <p className="text-xs text-gray-500">Tel: {invoiceData.businessPhoneNumber}</p>}
        </div>

        <div className="text-right">
          <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold uppercase tracking-wider rounded-full mb-2 border border-emerald-200">
            Invoice
          </span>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">{invNumber}</h2>
          <div className="mt-2 text-xs text-gray-500 space-y-0.5">
            <p><span className="font-medium text-gray-700">Issued:</span> {invDate}</p>
            <p><span className="font-medium text-gray-700">Due Date:</span> {dueDate}</p>
          </div>
        </div>
      </div>

      {/* Client Billing Card */}
      <div className="grid grid-cols-2 gap-6 mb-8 p-5 bg-gray-50 rounded-lg border border-gray-100">
        <div>
          <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2">Billed To</p>
          <p className="text-base font-semibold text-gray-900">{invoiceData.clientName || 'Client Name'}</p>
          <p className="text-sm text-gray-600 mt-1 whitespace-pre-line">{invoiceData.clientAddress || 'Client Address'}</p>
          {invoiceData.clientEmail && <p className="text-xs text-gray-500 mt-1">Email: {invoiceData.clientEmail}</p>}
          {invoiceData.clientPhoneNumber && <p className="text-xs text-gray-500">Phone: {invoiceData.clientPhoneNumber}</p>}
        </div>
        <div className="text-right flex flex-col justify-end">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Payment Status</p>
          <p className="text-sm font-semibold text-emerald-600">Pending / Net 14</p>
        </div>
      </div>

      {/* Line Items Table */}
      <div className="overflow-hidden rounded-lg border border-gray-200 mb-8">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-900 text-white text-xs uppercase tracking-wider font-semibold">
              <th className="py-3 px-4">#</th>
              <th className="py-3 px-4">Item Description</th>
              <th className="py-3 px-4 text-center">Qty</th>
              <th className="py-3 px-4 text-right">Unit Price</th>
              <th className="py-3 px-4 text-right">Tax</th>
              <th className="py-3 px-4 text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-sm">
            {invoiceData.items.map((item, idx) => (
              <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                <td className="py-3.5 px-4 text-xs font-mono text-gray-400">{idx + 1}</td>
                <td className="py-3.5 px-4 font-medium text-gray-900">{item.itemName || '—'}</td>
                <td className="py-3.5 px-4 text-center font-mono text-gray-700">{item.quantity}</td>
                <td className="py-3.5 px-4 text-right font-mono text-gray-700">{symbol}{(item.rate || 0).toFixed(2)}</td>
                <td className="py-3.5 px-4 text-right font-mono text-gray-500">{item.taxPercentage}%</td>
                <td className="py-3.5 px-4 text-right font-mono font-semibold text-gray-900">{symbol}{(item.finalPrice || 0).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Financial Summary */}
      <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-6">
        <div className="max-w-xs text-xs text-gray-500 leading-relaxed bg-emerald-50/50 p-4 rounded-lg border border-emerald-100">
          <p className="font-semibold text-emerald-800 mb-1">Notes & Terms:</p>
          <p>Please make payment within 14 days. Include invoice number <span className="font-semibold">{invNumber}</span> in wire transfers.</p>
        </div>

        <div className="w-full md:w-72 space-y-2 text-sm">
          <div className="flex justify-between text-gray-600 py-1 border-b border-gray-100">
            <span>Subtotal</span>
            <span className="font-mono font-medium text-gray-900">{symbol}{(invoiceData.subtotal || 0).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-600 py-1 border-b border-gray-100">
            <span>Total Tax</span>
            <span className="font-mono font-medium text-gray-900">{symbol}{(invoiceData.taxAmount || 0).toFixed(2)}</span>
          </div>
          {discountVal > 0 && (
            <div className="flex justify-between text-emerald-600 py-1 border-b border-gray-100">
              <span>Discount</span>
              <span className="font-mono font-medium">-{symbol}{discountVal.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t-2 border-emerald-500">
            <span>Grand Total</span>
            <span className="font-mono text-emerald-700">{symbol}{(invoiceData.grandTotal || 0).toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-6 border-t border-gray-200 text-center text-xs text-gray-400">
        <p>Thank you for doing business with {invoiceData.businessName || 'us'}.</p>
      </div>
    </div>
  );
};

export default Template2;
