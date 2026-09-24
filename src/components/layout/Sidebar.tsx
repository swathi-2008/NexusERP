import React from 'react';
import { UserRole } from '../../types/erp';
import {
  getAllPurchaseRequests,
  getAllProducts,
  getAllSalesOrders,
  getAllPurchaseOrders,
} from '../../services/store';
import {
  LayoutDashboard,
  Users,
  Package,
  History,
  FileText,
  Bell,
  Settings,
  ShoppingCart,
  PlusCircle,
  Truck,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ClipboardList,
  Store,
  BadgeAlert,
  Clock,
  Send,
  Boxes,
} from 'lucide-react';

interface SidebarProps {
  role: UserRole;
  activeTab: string;
  onSelectTab: (tabId: string) => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number | string;
  badgeColor?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ role, activeTab, onSelectTab }) => {
  const purchaseRequests = getAllPurchaseRequests();
  const products = getAllProducts();
  const salesOrders = getAllSalesOrders();
  const purchaseOrders = getAllPurchaseOrders();

  const pendingApprovalsCount = purchaseRequests.filter(
    (pr) => pr.status === 'PENDING_APPROVAL'
  ).length;

  const approvedPRCount = purchaseRequests.filter(
    (pr) => pr.status === 'APPROVED'
  ).length;

  const lowStockCount = products.filter(
    (p) => p.currentStock <= p.minThreshold
  ).length;

  const pendingSalesCount = salesOrders.filter(
    (so) => so.status === 'PENDING_STOCK'
  ).length;

  const activePOCount = purchaseOrders.filter(
    (po) => po.status === 'ORDERED'
  ).length;

  const getNavItems = (): { sectionTitle: string; items: NavItem[] }[] => {
    const normalizedRole = (role || '').toUpperCase();
    switch (normalizedRole) {
      case 'ADMIN':
        return [
          {
            sectionTitle: 'System Admin',
            items: [
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'users', label: 'Users', icon: Users },
              { id: 'products', label: 'Products', icon: Package },
              { id: 'transactions', label: 'Transactions', icon: FileText },
              {
                id: 'history',
                label: 'History & P&L',
                icon: History,
                badge: '12 Mo',
                badgeColor: 'bg-emerald-100 text-emerald-800',
              },
              { id: 'notifications', label: 'Notifications', icon: Bell },
              { id: 'settings', label: 'Settings', icon: Settings },
            ],
          },
        ];

      case 'MANAGER':
        return [
          {
            sectionTitle: 'Approvals & Oversight',
            items: [
              {
                id: 'dashboard',
                label: 'Dashboard & Approvals',
                icon: LayoutDashboard,
                badge: pendingApprovalsCount > 0 ? pendingApprovalsCount : undefined,
                badgeColor: 'bg-amber-100 text-amber-800 animate-pulse',
              },
              {
                id: 'purchase-requests',
                label: 'Purchase Requests',
                icon: ClipboardList,
                badge: pendingApprovalsCount > 0 ? `${pendingApprovalsCount} new` : undefined,
                badgeColor: 'bg-amber-100 text-amber-800',
              },
              {
                id: 'approved-requests',
                label: 'Approved Requests',
                icon: CheckCircle,
              },
              {
                id: 'rejected-requests',
                label: 'Rejected Requests',
                icon: XCircle,
              },
              {
                id: 'purchase-orders',
                label: 'Purchase Orders',
                icon: Truck,
              },
              {
                id: 'sales-overview',
                label: 'Sales Overview',
                icon: ShoppingCart,
              },
              {
                id: 'stock-alerts',
                label: 'Stock Alerts',
                icon: AlertTriangle,
                badge: lowStockCount > 0 ? lowStockCount : undefined,
                badgeColor: 'bg-red-100 text-red-800',
              },
              {
                id: 'reports',
                label: 'Reports',
                icon: FileText,
              },
              {
                id: 'notifications',
                label: 'Notifications',
                icon: Bell,
              },
            ],
          },
        ];

      case 'SALES':
        return [
          {
            sectionTitle: 'Sales Department',
            items: [
              { id: 'dashboard', label: 'Sales Dashboard', icon: LayoutDashboard },
              {
                id: 'create-order',
                label: 'Create Sales Order',
                icon: PlusCircle,
                badge: 'Workflow',
                badgeColor: 'bg-indigo-100 text-indigo-700',
              },
              { id: 'customers', label: 'Customers', icon: Store },
              { id: 'products', label: 'Products', icon: Package },
              {
                id: 'stock',
                label: 'Available Stock',
                icon: Boxes,
              },
              {
                id: 'orders',
                label: 'Order History',
                icon: ShoppingCart,
              },
              {
                id: 'order-status',
                label: 'Order Status',
                icon: Clock,
                badge: pendingSalesCount > 0 ? `${pendingSalesCount} awaiting` : undefined,
                badgeColor: 'bg-amber-100 text-amber-800',
              },
              { id: 'notifications', label: 'Notifications', icon: Bell },
            ],
          },
        ];

      case 'PURCHASE':
        return [
          {
            sectionTitle: 'Procurement & Supply',
            items: [
              { id: 'dashboard', label: 'Purchase Dashboard', icon: LayoutDashboard },
              {
                id: 'pending-requests',
                label: 'Pending PR Requests',
                icon: ClipboardList,
                badge: approvedPRCount > 0 ? `${approvedPRCount} ready` : undefined,
                badgeColor: 'bg-emerald-100 text-emerald-800',
              },
              {
                id: 'stock-alerts',
                label: 'Low Stock Alerts',
                icon: BadgeAlert,
                badge: lowStockCount > 0 ? lowStockCount : undefined,
                badgeColor: 'bg-red-100 text-red-800',
              },
              { id: 'suppliers', label: 'Supplier List', icon: Store },
              {
                id: 'purchase-orders',
                label: 'Recent POs',
                icon: Truck,
                badge: activePOCount > 0 ? `${activePOCount} active` : undefined,
                badgeColor: 'bg-blue-100 text-blue-800',
              },
              {
                id: 'create-po',
                label: 'Create Purchase Order',
                icon: Send,
              },
              {
                id: 'po-history',
                label: 'Purchase History',
                icon: History,
              },
              {
                id: 'tracking',
                label: 'Order Tracking & Receive',
                icon: Clock,
              },
              { id: 'notifications', label: 'Notifications', icon: Bell },
            ],
          },
        ];
      default:
        return [];
    }
  };

  const sections = getNavItems() || [];

  return (
    <aside className="w-64 shrink-0 border-r border-slate-200 bg-white">
      <div className="flex h-full flex-col justify-between p-3">
        <div className="space-y-6">
          {sections.map((section, idx) => (
            <div key={idx}>
              <div className="px-3 text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                {section.sectionTitle}
              </div>
              <nav className="mt-2 space-y-1">
                {(section.items || []).filter(Boolean).map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onSelectTab(item.id)}
                      className={`group flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-indigo-600 text-white shadow-xs shadow-indigo-200'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon
                          className={`h-4 w-4 shrink-0 transition-colors ${
                            isActive
                              ? 'text-white'
                              : 'text-slate-700 group-hover:text-slate-600'
                          }`}
                        />
                        <span>{item?.label || ''}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${
                            isActive
                              ? 'bg-white/20 text-white'
                              : item.badgeColor || 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>

        {/* Bottom Role Status Card */}
        <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3 text-xs">
          <div className="flex items-center justify-between text-slate-700">
            <span className="font-semibold text-slate-900">Current Role</span>
            <span className="rounded-md bg-white border border-slate-200 px-1.5 py-0.5 font-mono text-[10px] text-slate-600">
              {role}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-700">
            Permissions strictly restricted to {role.toLowerCase()} operations.
          </p>
        </div>
      </div>
    </aside>
  );
};
