import React, { useState } from 'react';
import { resetDemoData } from '../../services/store';
import {
  Settings,
  RotateCcw,
  ShieldCheck,
  Database,
  Lock,
  Download,
  AlertTriangle,
  Building2,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all SME ERP records to clean demo state?')) {
      resetDemoData();
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 3000);
    }
  };

  const handleExportJson = () => {
    const backup = {
      timestamp: new Date().toISOString(),
      users: JSON.parse(localStorage.getItem('SME_ERP_USERS') || '[]'),
      products: JSON.parse(localStorage.getItem('SME_ERP_PRODUCTS') || '[]'),
      salesOrders: JSON.parse(localStorage.getItem('SME_ERP_SALES_ORDERS') || '[]'),
      purchaseRequests: JSON.parse(localStorage.getItem('SME_ERP_PURCHASE_REQUESTS') || '[]'),
      purchaseOrders: JSON.parse(localStorage.getItem('SME_ERP_PURCHASE_ORDERS') || '[]'),
      transactions: JSON.parse(localStorage.getItem('SME_ERP_TRANSACTIONS') || '[]'),
      metrics: JSON.parse(localStorage.getItem('SME_ERP_MONTHLY_METRICS') || '[]'),
    };

    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sme-erp-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-2 border-b border-slate-200 pb-4">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-white shadow-xs">
          <Settings className="h-5 w-5" />
        </span>
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            System &amp; Database Administration
          </h1>
          <p className="mt-0.5 text-xs text-slate-500">
            Configure system parameters, audit policies, and local data persistence.
          </p>
        </div>
      </div>

      {resetSuccess && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-bold text-emerald-800 flex items-center gap-2">
          <span>Demo database restored to default seed records successfully!</span>
        </div>
      )}

      {/* Role-Based Access Enforcement Panel */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
        <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
          <ShieldCheck className="h-5 w-5 text-indigo-600" />
          <span>Access Control Policy Enforcement</span>
        </div>
        <p className="text-xs text-slate-600">
          The ERP system strictly enforces role boundaries:
        </p>
        <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
          <li><strong>ADMIN:</strong> Unrestricted visibility into P&amp;L, 12-month financial histories, user provisioning, and catalog maintenance.</li>
          <li><strong>MANAGER:</strong> Gatekeeper for Purchase Requests, low-stock threshold approvals, and cross-department oversight.</li>
          <li><strong>SALES STAFF:</strong> Order creation with automatic stock checks; cannot approve procurement or modify inventory balances directly.</li>
          <li><strong>PURCHASE STAFF:</strong> Order placement with verified suppliers and warehouse dock receipting.</li>
        </ul>
      </div>

      {/* Backup and Data Maintenance */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
          <Database className="h-5 w-5 text-indigo-600" />
          <span>Database Maintenance &amp; Backup</span>
        </div>
        <p className="text-xs text-slate-600">
          All records, stock journals, and transactions are synchronized in real time.
        </p>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleExportJson}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <Download className="h-4 w-4 text-slate-500" />
            <span>Export Database (JSON Backup)</span>
          </button>

          <button
            onClick={handleReset}
            className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50/60 px-4 py-2.5 text-xs font-bold text-red-700 hover:bg-red-100 transition-colors"
          >
            <RotateCcw className="h-4 w-4 text-red-600" />
            <span>Reset Demo Seed Records</span>
          </button>
        </div>
      </div>
    </div>
  );
};
