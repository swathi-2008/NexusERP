import React, { useState } from 'react';
import {
  getAllStockTransactions,
  getAllAuditLogs,
} from '../../services/store';
import {
  FileText,
  Search,
  Filter,
  ArrowDownRight,
  ArrowUpRight,
  Clock,
  User,
  Shield,
  Layers,
} from 'lucide-react';

export const AdminTransactionsView: React.FC = () => {
  const stockTransactions = getAllStockTransactions();
  const auditLogs = getAllAuditLogs();

  const [activeTab, setActiveTab] = useState<'STOCK' | 'AUDIT'>('STOCK');
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');

  const filteredStock = stockTransactions.filter((tx) => {
    const matchesSearch =
      tx.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.productSku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.createdByName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'ALL' || tx.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const filteredAudit = auditLogs.filter((log) => {
    return (
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.module.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-xs">
              <FileText className="h-5 w-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-900">
              Audit &amp; Transaction Tracking Center
            </h1>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Immutable log of all physical inventory changes and cross-department business actions.
          </p>
        </div>

        {/* View Switcher: Stock Transactions vs Full Audit Trail */}
        <div className="flex rounded-xl bg-slate-100 p-1">
          <button
            onClick={() => setActiveTab('STOCK')}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
              activeTab === 'STOCK'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Stock Movement Transactions ({stockTransactions.length})
          </button>
          <button
            onClick={() => setActiveTab('AUDIT')}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
              activeTab === 'AUDIT'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            System Action Audit Log ({auditLogs.length})
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={
              activeTab === 'STOCK'
                ? 'Search product, SKU, order ID, or staff...'
                : 'Search action, staff, module, or details...'
            }
            className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {activeTab === 'STOCK' && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Transaction Type:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-hidden"
            >
              <option value="ALL">All Movements</option>
              <option value="SALES_OUT">Sales Out (Deductions)</option>
              <option value="PURCHASE_IN">Purchase In (Receipts)</option>
              <option value="ADJUSTMENT">Adjustments</option>
            </select>
          </div>
        )}
      </div>

      {/* Main Table */}
      {activeTab === 'STOCK' ? (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-xs">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left font-bold text-slate-700 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th className="px-4 py-3 text-left font-bold text-slate-700 uppercase tracking-wider">
                    Product &amp; SKU
                  </th>
                  <th className="px-4 py-3 text-center font-bold text-slate-700 uppercase tracking-wider">
                    Movement Type
                  </th>
                  <th className="px-4 py-3 text-right font-bold text-slate-700 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-4 py-3 text-center font-bold text-slate-700 uppercase tracking-wider">
                    Stock Before &rarr; After
                  </th>
                  <th className="px-4 py-3 text-left font-bold text-slate-700 uppercase tracking-wider">
                    Source Document
                  </th>
                  <th className="px-4 py-3 text-left font-bold text-slate-700 uppercase tracking-wider">
                    Executed By
                  </th>
                  <th className="px-4 py-3 text-left font-bold text-slate-700 uppercase tracking-wider">
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredStock.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                      {new Date(tx.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-bold text-slate-900">{tx.productName}</div>
                      <div className="text-[10px] text-slate-600 font-mono">{tx.productSku}</div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-bold ${
                          tx.type === 'SALES_OUT'
                            ? 'bg-blue-100 text-blue-800'
                            : tx.type === 'PURCHASE_IN'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-800'
                        }`}
                      >
                        {tx.type}
                      </span>
                    </td>
                    <td
                      className={`px-4 py-3 text-right font-mono font-bold text-sm ${
                        tx.quantity < 0 ? 'text-blue-600' : 'text-emerald-600'
                      }`}
                    >
                      {tx.quantity > 0 ? `+${tx.quantity}` : tx.quantity}
                    </td>
                    <td className="px-4 py-3 text-center font-mono text-slate-600">
                      <span className="text-slate-500">{tx.previousStock}</span>
                      <span className="mx-1 text-slate-300">&rarr;</span>
                      <strong className="text-slate-900">{tx.newStock}</strong>
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-800 font-semibold">
                      {tx.referenceNumber}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      <div className="font-medium text-slate-900">{tx.createdByName}</div>
                      <div className="text-[10px] text-slate-600 font-mono">{tx.createdBy}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-600 text-[11px] max-w-xs truncate">
                      {tx.notes}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-xs">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left font-bold text-slate-700 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th className="px-4 py-3 text-left font-bold text-slate-700 uppercase tracking-wider">
                    User &amp; Role
                  </th>
                  <th className="px-4 py-3 text-left font-bold text-slate-700 uppercase tracking-wider">
                    Module
                  </th>
                  <th className="px-4 py-3 text-left font-bold text-slate-700 uppercase tracking-wider">
                    Action
                  </th>
                  <th className="px-4 py-3 text-left font-bold text-slate-700 uppercase tracking-wider">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredAudit.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-bold text-slate-900">{log.userName}</div>
                      <div className="text-[10px] text-slate-600">
                        {log.userId} • <span className="font-semibold">{log.userRole}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-700">
                      {log.module}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {log.details}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
