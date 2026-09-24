import React, { useState } from 'react';
import {
  getAllCustomers,
  getAllProducts,
  createSalesOrder,
} from '../../services/store';
import { Product, Customer } from '../../types/erp';
import {
  X,
  ShoppingCart,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  UserCheck,
  Package,
  Layers,
  Sparkles,
} from 'lucide-react';

interface CreateSalesOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderCreated?: () => void;
}

export const CreateSalesOrderModal: React.FC<CreateSalesOrderModalProps> = ({
  isOpen,
  onClose,
  onOrderCreated,
}) => {
  if (!isOpen) return null;

  const customers = getAllCustomers();
  const products = getAllProducts();

  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(customers[0]?.id || '');
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');
  const [quantity, setQuantity] = useState<number>(1);
  const [notes, setNotes] = useState<string>('');
  const [resultMessage, setResultMessage] = useState<{
    text: string;
    isError?: boolean;
    purchaseRequestCreated?: boolean;
  } | null>(null);

  const selectedProduct = products.find((p) => p.id === selectedProductId) || products[0];
  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId) || customers[0];

  const isStockSufficient = selectedProduct ? selectedProduct.currentStock >= quantity : false;
  const totalAmount = selectedProduct ? selectedProduct.unitPrice * quantity : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCustomerId || !selectedProductId || quantity <= 0) {
      setResultMessage({
        text: 'Please select a valid customer, product, and quantity greater than zero.',
        isError: true,
      });
      return;
    }

    const res = createSalesOrder({
      customerId: selectedCustomerId,
      productId: selectedProductId,
      quantity: Number(quantity),
      notes: notes.trim(),
    });

    if (res.success) {
      setResultMessage({
        text: res.message,
        isError: false,
        purchaseRequestCreated: res.purchaseRequestCreated,
      });
      if (onOrderCreated) onOrderCreated();

      setTimeout(() => {
        onClose();
      }, 2500);
    } else {
      setResultMessage({
        text: res.message,
        isError: true,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-xs">
              <ShoppingCart className="h-4 w-4" />
            </span>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Create New Sales Order
              </h3>
              <p className="text-xs text-slate-500">
                Includes automated real-time stock verification &amp; replenishment routing.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Feedback message banner */}
        {resultMessage && (
          <div
            className={`mt-4 rounded-xl p-3.5 text-xs flex items-start gap-2.5 border ${
              resultMessage.isError
                ? 'border-red-200 bg-red-50 text-red-800'
                : resultMessage.purchaseRequestCreated
                ? 'border-amber-300 bg-amber-50 text-amber-900'
                : 'border-emerald-200 bg-emerald-50 text-emerald-900'
            }`}
          >
            {resultMessage.isError ? (
              <AlertTriangle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
            ) : resultMessage.purchaseRequestCreated ? (
              <Sparkles className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            ) : (
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            )}
            <div>
              <div className="font-bold">
                {resultMessage.isError
                  ? 'Order Error'
                  : resultMessage.purchaseRequestCreated
                  ? 'Automated Workflow Triggered!'
                  : 'Order Processed & Fulfilled!'}
              </div>
              <p className="mt-0.5">{resultMessage.text}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          {/* STEP 1: Enter customer details */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                STEP 1: Select or Assign Customer *
              </label>
              <span className="text-[10px] text-slate-600 font-mono">B2B Directory</span>
            </div>
            <select
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white p-2.5 font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              required
            >
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} — {c.company} ({c.email})
                </option>
              ))}
            </select>
          </div>

          {/* STEP 2: Select product */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                STEP 2: Select Product *
              </label>
              <span className="text-[10px] text-slate-600 font-mono">Inventory Catalog</span>
            </div>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white p-2.5 font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              required
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (SKU: {p.sku}) — Available: {p.currentStock} {p.unit} — ${p.unitPrice}
                </option>
              ))}
            </select>
          </div>

          {/* STEP 3: Enter required quantity */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider text-[11px] mb-1">
                STEP 3: Required Quantity *
              </label>
              <input
                type="number"
                min={1}
                max={500}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full rounded-lg border border-slate-300 bg-white p-2.5 font-mono text-slate-900 font-bold focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider text-[11px] mb-1">
                Order Value
              </label>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-2.5 font-mono font-bold text-indigo-700 text-sm">
                ${totalAmount.toLocaleString()}
              </div>
            </div>
          </div>

          {/* STEP 4: AUTOMATIC STOCK CHECK GAUGE (Project requirement) */}
          <div className="rounded-xl border p-3.5 transition-all duration-300">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-bold uppercase tracking-wider text-[11px] text-slate-700">
                STEP 4: Real-Time Stock Check
              </span>
              <span
                className={`font-mono font-bold px-2 py-0.5 rounded-md ${
                  isStockSufficient
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800 animate-pulse'
                }`}
              >
                {isStockSufficient ? 'STOCK AVAILABLE' : 'STOCK INSUFFICIENT'}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-600 bg-slate-50 p-2 rounded-lg">
              <div>
                <span>Warehouse Balance: </span>
                <strong className="text-slate-900">{selectedProduct.currentStock} units</strong>
              </div>
              <div>
                <span>Requested: </span>
                <strong className="text-slate-900">{quantity} units</strong>
              </div>
              <div>
                <span>Balance After: </span>
                <strong
                  className={
                    selectedProduct.currentStock - quantity >= 0
                      ? 'text-emerald-700'
                      : 'text-red-700'
                  }
                >
                  {selectedProduct.currentStock - quantity}
                </strong>
              </div>
            </div>

            {/* Dynamic Workflow Behavior Callout */}
            <div className="mt-2.5 text-[11px]">
              {isStockSufficient ? (
                <div className="flex items-start gap-2 text-emerald-800 bg-emerald-50/70 p-2.5 rounded-lg border border-emerald-200">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
                  <div>
                    <span className="font-bold">Immediate Processing: </span>
                    Units will be instantly deducted from warehouse inventory. Sales revenue &amp; profit will be credited immediately.
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-2 text-amber-900 bg-amber-50/80 p-2.5 rounded-lg border border-amber-300">
                  <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
                  <div>
                    <span className="font-bold">Automated Cross-Department ERP Trigger: </span>
                    Since stock is insufficient (deficit of {quantity - selectedProduct.currentStock} units), the system will <strong>automatically create a Purchase Request</strong> and route it to the <strong>Manager for approval</strong>. No manual paper/email communication needed!
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Internal Order Notes (Optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Expedited client delivery required..."
              className="w-full rounded-lg border border-slate-300 p-2 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-between border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 px-4 py-2 font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2 font-bold text-white shadow-md hover:bg-indigo-700 transition-colors"
            >
              <span>Submit Sales Order</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
