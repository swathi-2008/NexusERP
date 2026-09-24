import React, { useState } from 'react';
import { getAllProducts, addProduct } from '../../services/store';
import { Product } from '../../types/erp';
import {
  Package,
  PlusCircle,
  AlertTriangle,
  Boxes,
  ArrowUpRight,
  TrendingDown,
  Search,
  X,
  CheckCircle,
  DollarSign,
} from 'lucide-react';

export const AdminProductsView: React.FC = () => {
  const products = getAllProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Product Form
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState('Computers & Hardware');
  const [currentStock, setCurrentStock] = useState<number>(20);
  const [minThreshold, setMinThreshold] = useState<number>(10);
  const [maxStock, setMaxStock] = useState<number>(100);
  const [unitPrice, setUnitPrice] = useState<number>(100);
  const [costPrice, setCostPrice] = useState<number>(60);
  const [unit, setUnit] = useState('Units');
  const [error, setError] = useState<string | null>(null);

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !sku.trim()) {
      setError('Please provide product name and SKU.');
      return;
    }

    if (unitPrice <= 0 || costPrice <= 0) {
      setError('Price and cost must be positive numbers.');
      return;
    }

    addProduct({
      name: name.trim(),
      sku: sku.trim().toUpperCase(),
      category,
      currentStock: Number(currentStock),
      minThreshold: Number(minThreshold),
      maxStock: Number(maxStock),
      unitPrice: Number(unitPrice),
      costPrice: Number(costPrice),
      unit,
    });

    setName('');
    setSku('');
    setShowAddModal(false);
  };

  const getStockStatusBadge = (status?: Product['status'] | string | null) => {
    const normalized = (status || '').toUpperCase();
    switch (normalized) {
      case 'IN_STOCK':
        return {
          label: 'In Stock',
          className: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        };
      case 'LOW_STOCK':
        return {
          label: 'Low Stock Alert',
          className: 'bg-amber-100 text-amber-800 border-amber-300 animate-pulse',
        };
      case 'OUT_OF_STOCK':
        return {
          label: 'Out of Stock',
          className: 'bg-red-100 text-red-800 border-red-300',
        };
      default:
        return {
          label: status ? String(status).replace(/_/g, ' ') : 'In Stock',
          className: 'bg-slate-100 text-slate-800 border-slate-200',
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-xs">
              <Package className="h-5 w-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-900">
              Product Catalog &amp; Stock Levels
            </h1>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Real-time stock tracking with automated threshold monitors and cross-module synchronization.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-indigo-700 transition-colors"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Product Name, SKU, Category..."
            className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Stock Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-hidden"
          >
            <option value="ALL">All Statuses ({products.length})</option>
            <option value="IN_STOCK">In Stock</option>
            <option value="LOW_STOCK">Low Stock Only</option>
            <option value="OUT_OF_STOCK">Out of Stock</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-xs">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left font-bold text-slate-700 uppercase tracking-wider">
                  Product &amp; SKU
                </th>
                <th className="px-4 py-3 text-left font-bold text-slate-700 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-4 py-3 text-center font-bold text-slate-700 uppercase tracking-wider">
                  Current Stock
                </th>
                <th className="px-4 py-3 text-center font-bold text-slate-700 uppercase tracking-wider">
                  Min Threshold
                </th>
                <th className="px-4 py-3 text-center font-bold text-slate-700 uppercase tracking-wider">
                  Max/Ref Stock
                </th>
                <th className="px-4 py-3 text-center font-bold text-slate-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-center font-bold text-slate-700 uppercase tracking-wider">
                  Incoming POs
                </th>
                <th className="px-4 py-3 text-right font-bold text-slate-700 uppercase tracking-wider">
                  Selling Price
                </th>
                <th className="px-4 py-3 text-right font-bold text-slate-700 uppercase tracking-wider">
                  Cost Margin
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredProducts.map((p) => {
                const badge = getStockStatusBadge(p.status);
                const marginPercent = Math.round(((p.unitPrice - p.costPrice) / p.unitPrice) * 100);
                const isUnderThreshold = p.currentStock <= p.minThreshold;

                return (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-bold text-slate-900">{p.name}</div>
                      <div className="font-mono text-[11px] text-slate-600 mt-0.5">
                        SKU: {p.sku} • ID: {p.id}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {p.category}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`font-mono text-sm font-extrabold ${
                          isUnderThreshold ? 'text-amber-600 font-black' : 'text-slate-900'
                        }`}
                      >
                        {p.currentStock}
                      </span>
                      <span className="text-[10px] text-slate-600 ml-1">{p.unit}</span>
                    </td>
                    <td className="px-4 py-3 text-center font-mono text-slate-600">
                      {p.minThreshold} {p.unit}
                    </td>
                    <td className="px-4 py-3 text-center font-mono text-slate-600">
                      {p.maxStock} {p.unit}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-block rounded-md border px-2 py-0.5 text-[10px] font-bold ${badge?.className || 'bg-slate-100 text-slate-800 border-slate-200'}`}
                      >
                        {badge?.label || 'In Stock'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {p.incomingStock > 0 ? (
                        <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700 border border-blue-200">
                          +{p.incomingStock} on order
                        </span>
                      ) : (
                        <span className="text-slate-600">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-slate-900">
                      ${p.unitPrice.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-emerald-600 font-semibold">
                      +{marginPercent}% (${p.unitPrice - p.costPrice})
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD PRODUCT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Register New Enterprise Product
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {error && (
              <div className="mt-3 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-2.5 text-xs text-red-700">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleAddSubmit} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700">Product Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ultra HD Web Camera 4K"
                  required
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700">SKU Code *</label>
                  <input
                    type="text"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="e.g. CAM-4K-01"
                    required
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-mono uppercase text-slate-900 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700">Category *</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g. Peripherals"
                    required
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700">Current Stock *</label>
                  <input
                    type="number"
                    min={0}
                    value={currentStock}
                    onChange={(e) => setCurrentStock(Number(e.target.value))}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-slate-900 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700">Min Threshold *</label>
                  <input
                    type="number"
                    min={1}
                    value={minThreshold}
                    onChange={(e) => setMinThreshold(Number(e.target.value))}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-slate-900 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700">Max/Ref Stock *</label>
                  <input
                    type="number"
                    min={1}
                    value={maxStock}
                    onChange={(e) => setMaxStock(Number(e.target.value))}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-slate-900 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700">Selling Price ($) *</label>
                  <input
                    type="number"
                    min={1}
                    value={unitPrice}
                    onChange={(e) => setUnitPrice(Number(e.target.value))}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-slate-900 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700">Purchase Cost ($) *</label>
                  <input
                    type="number"
                    min={1}
                    value={costPrice}
                    onChange={(e) => setCostPrice(Number(e.target.value))}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-slate-900 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2 font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-indigo-600 px-4 py-2 font-bold text-white hover:bg-indigo-700"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
