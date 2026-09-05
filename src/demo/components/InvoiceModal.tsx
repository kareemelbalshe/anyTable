import React from "react";
import { EnterpriseOrder } from "../enterpriseOrdersData";

export interface InvoiceModalProps {
  order: EnterpriseOrder | null;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ order, onClose }) => {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm any-table-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 rounded-3xl max-w-xl w-full p-6 shadow-2xl overflow-hidden flex flex-col gap-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-xl font-black">
              📄
            </div>
            <div>
              <h3 className="font-black text-lg text-gray-900 dark:text-white">
                Invoice {order.orderNumber}
              </h3>
              <p className="text-xs text-gray-500">
                Issued on {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-500 text-sm font-bold flex items-center justify-center transition-all"
          >
            ✕
          </button>
        </div>

        {/* Customer & Shipping Summary */}
        <div className="grid grid-cols-2 gap-4 bg-gray-50 dark:bg-slate-800/60 p-4 rounded-2xl text-xs border border-gray-100 dark:border-gray-800">
          <div>
            <div className="font-bold text-gray-400 uppercase text-[10px] tracking-wider mb-1">Customer</div>
            <div className="font-bold text-gray-900 dark:text-white">{order.customer.name}</div>
            <div className="text-gray-500">{order.customer.email}</div>
            <div className="text-gray-500">{order.customer.phone}</div>
          </div>
          <div>
            <div className="font-bold text-gray-400 uppercase text-[10px] tracking-wider mb-1">Delivery Destination</div>
            <div className="font-bold text-gray-900 dark:text-white">{order.shippingAddress.city}, {order.shippingAddress.governorate}</div>
            <div className="text-gray-500">{order.shippingAddress.street}</div>
            <div className="text-primary font-semibold mt-1">Carrier: {order.carrier}</div>
          </div>
        </div>

        {/* Items Table */}
        <div>
          <div className="font-bold text-xs text-gray-400 uppercase tracking-wider mb-2">Purchased Items</div>
          <div className="border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-100 dark:bg-slate-800 font-bold text-gray-600 dark:text-gray-300">
                <tr>
                  <th className="p-3">Item Description</th>
                  <th className="p-3 text-center">Qty</th>
                  <th className="p-3 text-right">Price</th>
                  <th className="p-3 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {order.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="p-3 font-medium text-gray-900 dark:text-white">{item.name}</td>
                    <td className="p-3 text-center">{item.quantity}</td>
                    <td className="p-3 text-right font-mono">{item.unitPrice.toLocaleString()} EGP</td>
                    <td className="p-3 text-right font-mono font-bold">{(item.quantity * item.unitPrice).toLocaleString()} EGP</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Total Breakdown */}
        <div className="flex flex-col gap-1.5 bg-gray-50 dark:bg-slate-800/40 p-4 rounded-2xl text-xs border border-gray-100 dark:border-gray-800">
          <div className="flex justify-between text-gray-500">
            <span>Subtotal:</span>
            <span className="font-mono font-bold">{order.subtotal.toLocaleString()} EGP</span>
          </div>
          <div className="flex justify-between text-gray-500">
            <span>VAT (14%):</span>
            <span className="font-mono font-bold">{order.tax.toLocaleString()} EGP</span>
          </div>
          <div className="flex justify-between text-gray-500">
            <span>Shipping Fee:</span>
            <span className="font-mono font-bold">{order.shippingFee === 0 ? "FREE" : `${order.shippingFee} EGP`}</span>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 my-1 pt-2 flex justify-between font-black text-sm text-gray-900 dark:text-white">
            <span>Total Amount:</span>
            <span className="text-primary font-mono text-base">{order.totalAmount.toLocaleString()} EGP</span>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-slate-800 text-xs font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-slate-700 transition-all"
          >
            🖨️ Print Receipt
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-soft shadow-md shadow-primary/20 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
