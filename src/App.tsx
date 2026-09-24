import React, { useState, useEffect, useSyncExternalStore } from 'react';
import {
  getCurrentUser,
  subscribeStore,
  setCurrentUser,
  logoutUser,
  normalizeRole,
  getRoleDashboardPath,
  getRoleFromDashboardPath,
} from './services/store';
import { User, UserRole } from './types/erp';
import { ShieldAlert } from 'lucide-react';

// Layout Components
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { LoginPage } from './components/auth/LoginPage';
import { WorkflowVisualizerModal } from './components/workflow/WorkflowVisualizerModal';

// Admin Components
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminHistoryView } from './components/admin/AdminHistoryView';
import { AdminUsersView } from './components/admin/AdminUsersView';
import { AdminProductsView } from './components/admin/AdminProductsView';
import { AdminTransactionsView } from './components/admin/AdminTransactionsView';

// Sales Components
import { SalesDashboard } from './components/sales/SalesDashboard';
import { SalesOrdersView } from './components/sales/SalesOrdersView';
import { CustomersView } from './components/sales/CustomersView';

// Manager Components
import { ManagerDashboard } from './components/manager/ManagerDashboard';
import { ManagerApprovalsView } from './components/manager/ManagerApprovalsView';

// Purchase Components
import { PurchaseDashboard } from './components/purchase/PurchaseDashboard';
import { PurchaseOrdersView } from './components/purchase/PurchaseOrdersView';
import { SuppliersView } from './components/purchase/SuppliersView';

// Shared Components
import { NotificationsView } from './components/notifications/NotificationsView';
import { SettingsView } from './components/settings/SettingsView';

export default function App() {
  // Reactive store hook - triggers re-render whenever localStorage / state changes
  const storeVersion = useSyncExternalStore(
    subscribeStore,
    () => localStorage.getItem('SME_ERP_VERSION') || '0',
    () => '0'
  );

  const currentUser = getCurrentUser();
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isWorkflowModalOpen, setIsWorkflowModalOpen] = useState(false);

  // Path synchronization for role-based URLs
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname || '/';
    }
    return '/';
  });

  const userRole = normalizeRole(currentUser?.role);
  const assignedDashboard = getRoleDashboardPath(userRole) || '/admin-dashboard';

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path: string) => {
    if (typeof window !== 'undefined') {
      if (window.location.pathname !== path) {
        window.history.pushState({}, '', path);
      }
      setCurrentPath(path);
    }
  };

  // Role-Based URL Protection & Access Control (RBAC) - Must be before early returns
  useEffect(() => {
    if (!currentUser) {
      if (typeof window !== 'undefined' && currentPath !== '/login' && currentPath !== '/') {
        window.history.replaceState({}, '', '/login');
      }
      return;
    }

    if (!userRole || currentUser.isActive === false || currentUser.status === 'inactive') {
      return;
    }

    const pathRole = getRoleFromDashboardPath(currentPath);

    if (currentPath === '/' || currentPath === '/login') {
      navigateTo(assignedDashboard);
    } else if (pathRole && pathRole !== userRole) {
      console.warn(
        `[RBAC] Access denied: Unauthorized access attempt to ${currentPath} by user ${currentUser.id} with role '${userRole}'. Redirecting to ${assignedDashboard}.`
      );
      navigateTo(assignedDashboard);
    } else if (!pathRole && currentPath !== assignedDashboard) {
      // Default route synchronization
      navigateTo(assignedDashboard);
    }
  }, [currentPath, userRole, currentUser, assignedDashboard]);

  const handleSelectTab = (tab: string) => {
    setActiveTab(tab);
  };

  // 1. Unauthenticated state
  if (!currentUser) {
    return (
      <LoginPage
        onLoginSuccess={(user: User, redirectUrl: string) => {
          setCurrentUser(user);
          setActiveTab('dashboard');
          navigateTo(redirectUrl);
        }}
      />
    );
  }

  // 2. Inactive account verification
  if (currentUser.isActive === false || currentUser.status === 'inactive') {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-slate-100">
          <div className="mx-auto w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 mb-4">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Account Inactive</h2>
          <p className="text-sm text-slate-600 mb-6">
            Your account is inactive. Please contact the administrator.
          </p>
          <button
            onClick={() => {
              logoutUser();
              navigateTo('/login');
            }}
            className="w-full py-2.5 px-4 rounded-lg bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-700 transition-colors cursor-pointer"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  // 3. User role verification from trusted document
  if (!userRole) {
    console.error(`[RBAC] User role not configured for user: ${currentUser.id}`);
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-slate-100">
          <div className="mx-auto w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mb-4">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Role Not Configured</h2>
          <p className="text-sm text-slate-600 mb-6">
            User role is not configured. Please contact the administrator.
          </p>
          <button
            onClick={() => {
              logoutUser();
              navigateTo('/login');
            }}
            className="w-full py-2.5 px-4 rounded-lg bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-700 transition-colors cursor-pointer"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  // 5. Render role-specific main content
  const renderMainContent = () => {
    switch (userRole) {
      case 'admin':
        switch (activeTab) {
          case 'dashboard':
            return (
              <AdminDashboard
                onNavigateTab={handleSelectTab}
                onOpenWorkflow={() => setIsWorkflowModalOpen(true)}
              />
            );
          case 'users':
            return <AdminUsersView />;
          case 'products':
            return <AdminProductsView />;
          case 'transactions':
            return <AdminTransactionsView />;
          case 'history':
            return <AdminHistoryView />;
          case 'notifications':
            return <NotificationsView currentUser={currentUser} />;
          case 'settings':
            return <SettingsView />;
          default:
            return (
              <AdminDashboard
                onNavigateTab={handleSelectTab}
                onOpenWorkflow={() => setIsWorkflowModalOpen(true)}
              />
            );
        }

      case 'manager':
        switch (activeTab) {
          case 'dashboard':
            return (
              <ManagerDashboard
                onNavigateTab={handleSelectTab}
                onOpenWorkflow={() => setIsWorkflowModalOpen(true)}
              />
            );
          case 'purchase-requests':
            return <ManagerApprovalsView initialStatusFilter="ALL" />;
          case 'approved-requests':
            return <ManagerApprovalsView initialStatusFilter="APPROVED" />;
          case 'rejected-requests':
            return <ManagerApprovalsView initialStatusFilter="REJECTED" />;
          case 'purchase-orders':
            return <PurchaseOrdersView />;
          case 'sales-overview':
            return <SalesOrdersView />;
          case 'stock-alerts':
            return <AdminProductsView />;
          case 'reports':
            return <AdminHistoryView />;
          case 'notifications':
            return <NotificationsView currentUser={currentUser} />;
          default:
            return (
              <ManagerDashboard
                onNavigateTab={handleSelectTab}
                onOpenWorkflow={() => setIsWorkflowModalOpen(true)}
              />
            );
        }

      case 'sales':
        switch (activeTab) {
          case 'dashboard':
          case 'create-order':
            return (
              <SalesDashboard
                onNavigateTab={handleSelectTab}
                onOpenWorkflow={() => setIsWorkflowModalOpen(true)}
              />
            );
          case 'customers':
            return <CustomersView />;
          case 'products':
          case 'stock':
            return <AdminProductsView />;
          case 'orders':
          case 'order-status':
            return <SalesOrdersView />;
          case 'notifications':
            return <NotificationsView currentUser={currentUser} />;
          default:
            return (
              <SalesDashboard
                onNavigateTab={handleSelectTab}
                onOpenWorkflow={() => setIsWorkflowModalOpen(true)}
              />
            );
        }

      case 'purchase':
        switch (activeTab) {
          case 'dashboard':
          case 'pending-requests':
            return (
              <PurchaseDashboard
                onNavigateTab={handleSelectTab}
                onOpenWorkflow={() => setIsWorkflowModalOpen(true)}
              />
            );
          case 'stock-alerts':
            return <AdminProductsView />;
          case 'suppliers':
            return <SuppliersView />;
          case 'purchase-orders':
          case 'create-po':
          case 'po-history':
          case 'tracking':
            return <PurchaseOrdersView />;
          case 'notifications':
            return <NotificationsView currentUser={currentUser} />;
          default:
            return (
              <PurchaseDashboard
                onNavigateTab={handleSelectTab}
                onOpenWorkflow={() => setIsWorkflowModalOpen(true)}
              />
            );
        }

      default:
        return (
          <AdminDashboard
            onNavigateTab={handleSelectTab}
            onOpenWorkflow={() => setIsWorkflowModalOpen(true)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col antialiased text-slate-900 font-sans">
      {/* Top Universal Navbar */}
      <Navbar
        currentUser={currentUser}
        onOpenWorkflowModal={() => setIsWorkflowModalOpen(true)}
        onNavigateToNotifications={() => handleSelectTab('notifications')}
      />

      {/* Main Body with Sidebar + Content */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          role={userRole}
          activeTab={activeTab}
          onSelectTab={handleSelectTab}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            {renderMainContent()}
          </div>
        </main>
      </div>

      {/* Cross-Module Workflow Interactive Modal */}
      <WorkflowVisualizerModal
        isOpen={isWorkflowModalOpen}
        onClose={() => setIsWorkflowModalOpen(false)}
      />
    </div>
  );
}
