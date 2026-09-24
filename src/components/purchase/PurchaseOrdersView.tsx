import React, { useState } from 'react';
import {
  getAllPurchaseOrders,
  getAllProducts,
  getAllSuppliers,
  receivePurchaseOrderGoods,
  createPurchaseOrderManual,
} from '../../services/store';
import {
  Truck,
  PlusCircle,
  Search,
  Filter,
  PackageCheck,
  CheckCircle,
  Clock,
  ArrowRight,
  X,
  Building,
} from 'lucide-react';

export const PurchaseOrdersView: React.FC = () => {
  const purchaseOrders = getAllPurchaseOrders();
  const products = getAllProducts();
  const suppliers = getAllSuppliers();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Manual PO Form state
  const [supplierId, setSupplierId] = useState(suppliers[0]?.id || '');
  const [productId, setProductId] = useState(products[0]?.id || '');
  const [quantity, setQuantity] = useState(25);
  const [deliveryDays, setDeliveryDays] = useState(3);

  const filteredOrders = purchaseOrders.filter((po) => {
    const matchesSearch =
      po.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      po.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      po.productName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || po.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleReceive = (poId: string) => {
    const res = receivePurchaseOrderGoods(poId);
    if (res.success) {
      setFeedback(res.message);
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  const handleManualPOCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const res = createPurchaseOrderManual({
      supplierId,
      productId,
      quantity: Number(quantity),
      expectedDeliveryDays: Number(deliveryDays),
    });

    if (res.success) {
      setFeedback(res.message);
      setShowCreateModal(false);
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-600 text-white shadow-xs">
              <Truck className="h-5 w-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-900">
              Purchase Orders &amp; Inbound Tracking
            </h1>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Track vendor purchase orders across the 4-stage lifecycle: Requested &rarr; Approved &rarr; Ordered &rarr; Received.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 rounded-xl bg-amber-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-amber-700 transition-colors"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Issue Direct Purchase Order</span>
        </button>
      </div>

      {feedback && (
        <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-xs font-bold text-emerald-900 flex items-center gap-2 shadow-xs">
          <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by PO #, Supplier, or Product..."
            className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-hidden"
          >
            <option value="ALL">All POs ({purchaseOrders.length})</option>
            <option value="ORDERED">In Transit / Ordered</option>
            <option value="RECEIVED">Received &amp; Stock Added</option>
          </select>
        </div>
      </div>

      {/* Orders Table with 4-Step Lifecycle */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-xs">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left font-bold text-slate-700 uppercase tracking-wider">
                  PO Number
                </th>
                <th className="px-4 py-3 text-left font-bold text-slate-700 uppercase tracking-wider">
                  Supplier
                </th>
                <th className="px-4 py-3 text-left font-bold text-slate-700 uppercase tracking-wider">
                  Product &amp; SKU
                </th>
                <th className="px-4 py-3 text-right font-bold text-slate-700 uppercase tracking-wider">
                  Qty
                </th>
                <th className="px-4 py-3 text-right font-bold text-slate-700 uppercase tracking-wider">
                  Total Cost
                </th>
                <th className="px-4 py-3 text-center font-bold text-slate-700 uppercase tracking-wider">
                  Workflow Timeline
                </th>
                <th className="px-4 py-3 text-right font-bold text-slate-700 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredOrders.map((po) => {
                const isReceived = po.status === 'RECEIVED';

                return (
                  <tr key={po.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-indigo-700">
                      {po.poNumber}
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-900">
                      {po.supplierName}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-bold text-slate-900">{po.productName}</div>
                      <div className="text-[10px] text-slate-600 font-mono">SKU: {po.productSku}</div>
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-slate-900">
                      {po.quantity}
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-slate-900">
                      ${po.totalCost.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      {/* 4-Step Visual Timeline */}
                      <div className="flex items-center justify-center gap-1 text-[10px]">
                        <span className="rounded-md bg-emerald-100 px-1.5 py-0.5 font-bold text-emerald-800">
                          1. Requested
                        </span>
                        <span className="text-slate-300">&rarr;</span>
                        <span className="rounded-md bg-emerald-100 px-1.5 py-0.5 font-bold text-emerald-800">
                          2. Approved
                        </span>
                        <span className="text-slate-300">&rarr;</span>
                        <span className="rounded-md bg-emerald-100 px-1.5 py-0.5 font-bold text-emerald-800">
                          3. Ordered
                        </span>
                        <span className="text-slate-300">&rarr;</span>
                        <span
                          className={`rounded-md px-1.5 py-0.5 font-bold ${
                            isReceived
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800 animate-pulse'
                          }`}
                        >
                          4. {isReceived ? 'Received' : 'Pending'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {!isReceived ? (
                        <button
                          onClick={() => handleReceive(po.id)}
                          className="rounded-lg bg-emerald-600 px-3 py-1.5 font-bold text-white shadow-xs hover:bg-emerald-700 transition-colors flex items-center gap-1.5 ml-auto"
                        >
                          <PackageCheck className="h-3.5 w-3.5" />
                          <span>Receive Goods</span>
                        </button>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-xs">
                          <CheckCircle className="h-3.5 w-3.5" />
                          <span>Stock Updated</span>
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual PO Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Direct Purchase Order Placement
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleManualPOCreate} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Select Supplier *
                </label>
                <select
                  value={supplierId}
                  onChange={(e) => setSupplierId(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-2.5 text-slate-900 font-medium"
                  required
                >
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} — {s.rating} ★ (Lead Time: {s.leadTimeDays} days)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Select Product *
                </label>
                <select
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-2.5 text-slate-900 font-medium"
                  required
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (SKU: {p.sku}) — Cost: ${p.costPrice} (Current: {p.currentStock})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Order Quantity *
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                    className="w-full rounded-lg border border-slate-300 p-2 font-mono font-bold text-slate-900"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Expected Delivery Days
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={deliveryDays}
                    onChange={(e) => setDeliveryDays(Math.max(1, Number(e.target.value)))}
                    className="w-full rounded-lg border border-slate-300 p-2 font-mono text-slate-900"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="rounded-lg border px-4 py-2 font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-amber-600 px-4 py-2 font-bold text-white hover:bg-amber-700"
                >
                  Dispatch Purchase Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
