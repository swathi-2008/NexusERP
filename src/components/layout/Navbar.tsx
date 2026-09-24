import React, { useState } from 'react';
import {
  User,
  UserRole,
  NotificationItem,
} from '../../types/erp';
import {
  logoutUser,
  getAllNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  resetDemoData,
  setCurrentUser,
  getAllUsers,
  normalizeRole,
  getRoleDashboardPath,
  isUserTargetForRoles,
} from '../../services/store';
import {
  Bell,
  LogOut,
  Shield,
  Layers,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Info,
  ChevronDown,
  Building2,
  Workflow,
  Sparkles,
} from 'lucide-react';

interface NavbarProps {
  currentUser: User;
  onOpenWorkflowModal: () => void;
  onNavigateToNotifications?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onOpenWorkflowModal,
  onNavigateToNotifications,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);

  const notifications = getAllNotifications();
  // Filter notifications relevant to current user role
  const relevantNotifications = notifications.filter((n) =>
    isUserTargetForRoles(currentUser?.role, n.targetRoles)
  );
  const unreadCount = relevantNotifications.filter(
    (n) => !n.readBy?.includes(currentUser?.id || '')
  ).length;

  const allUsers = getAllUsers();

  const getRoleBadge = (role?: UserRole | string | null) => {
    const normalized = (role || '').toUpperCase();
    switch (normalized) {
      case 'ADMIN':
        return {
          label: 'Admin',
          bg: 'bg-purple-100 text-purple-800 border-purple-300',
          dot: 'bg-purple-600',
        };
      case 'MANAGER':
        return {
          label: 'Manager',
          bg: 'bg-blue-100 text-blue-800 border-blue-300',
          dot: 'bg-blue-600',
        };
      case 'SALES':
        return {
          label: 'Sales Staff',
          bg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          dot: 'bg-emerald-600',
        };
      case 'PURCHASE':
        return {
          label: 'Purchase Staff',
          bg: 'bg-amber-100 text-amber-800 border-amber-300',
          dot: 'bg-amber-600',
        };
      default:
        return {
          label: role || 'Staff',
          bg: 'bg-slate-100 text-slate-800 border-slate-300',
          dot: 'bg-slate-500',
        };
    }
  };

  const badge = getRoleBadge(currentUser?.role);

  const handleSwitchUser = (targetUser: User) => {
    setCurrentUser(targetUser);
    setShowRoleSwitcher(false);
    setShowUserMenu(false);
    const targetNormRole = normalizeRole(targetUser.role);
    const targetPath = getRoleDashboardPath(targetNormRole);
    if (targetPath && typeof window !== 'undefined') {
      window.history.pushState({}, '', targetPath);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white px-4 shadow-xs sm:px-6">
      {/* Brand & System Title */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br from-indigo-600 to-blue-700 text-white shadow-sm">
          <Building2 className="h-6 w-6" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-slate-900 tracking-tight">
              NexusERP
            </span>
            <span className="hidden rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700 sm:inline-block">
              SME Workflow System
            </span>
          </div>
          <p className="hidden text-xs text-slate-700 md:block">
            Connected Sales • Purchasing • Stock • Approvals
          </p>
        </div>
      </div>

      {/* Center Actions / Interactive Workflow Trigger */}
      <div className="hidden lg:flex items-center gap-2">
        <button
          onClick={onOpenWorkflowModal}
          className="flex items-center gap-2 rounded-lg border border-indigo-200 bg-indigo-50/70 px-3 py-1.5 text-xs font-medium text-indigo-800 transition-colors hover:bg-indigo-100"
          title="View live automated cross-module workflow diagram"
        >
          <Workflow className="h-4 w-4 text-indigo-600" />
          <span>Cross-Module Workflow Map</span>
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        </button>
      </div>

      {/* Right Controls: Role Switcher Demo Bar, Notifications, User Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Fast Role Switcher (Helper for testing all 4 roles effortlessly) */}
        <div className="relative">
          <button
            onClick={() => {
              setShowRoleSwitcher(!showRoleSwitcher);
              setShowNotifications(false);
              setShowUserMenu(false);
            }}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-all"
            title="Fast Switch between Roles for evaluation"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            <span className="hidden sm:inline">Role Switcher:</span>
            <span className="font-semibold">{badge?.label || 'Staff'}</span>
            <ChevronDown className="h-3 w-3 text-slate-700" />
          </button>

          {showRoleSwitcher && (
            <div className="absolute right-0 mt-2 w-64 rounded-xl border border-slate-200 bg-white p-2 shadow-xl z-50">
              <div className="px-2 py-1 text-xs font-bold text-slate-700 uppercase tracking-wider">
                Select Active Role (Evaluation)
              </div>
              <p className="px-2 pb-2 text-[11px] text-slate-700">
                Instantly switch persona to test role-based permissions & dashboards.
              </p>
              <div className="space-y-1">
                {allUsers.map((u) => {
                  const b = getRoleBadge(u.role);
                  const isSelected = u.id === currentUser?.id;
                  return (
                    <button
                      key={u.id}
                      onClick={() => handleSwitchUser(u)}
                      className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-xs transition-colors ${
                        isSelected
                          ? 'bg-indigo-50 text-indigo-900 font-semibold'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${b?.dot || 'bg-slate-400'}`} />
                        <div>
                          <div className="font-medium">{u.name}</div>
                          <div className="text-[10px] text-slate-700">
                            {u.id} • {b?.label || 'Staff'}
                          </div>
                        </div>
                      </div>
                      {isSelected && (
                        <CheckCircle2 className="h-4 w-4 text-indigo-600" />
                      )}
                    </button>
                  );
                })}
              </div>
              <div className="mt-2 border-t border-slate-100 pt-2">
                <button
                  onClick={() => {
                    if (confirm('Reset system data to initial state?')) {
                      resetDemoData();
                    }
                  }}
                  className="flex w-full items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 hover:bg-red-50 hover:text-red-700 transition-colors"
                >
                  <RotateCcw className="h-3.5 w-3.5 text-slate-700" />
                  <span>Reset Demo Database</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowRoleSwitcher(false);
              setShowUserMenu(false);
            }}
            className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
            aria-label="View notifications"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white shadow-xs">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-slate-200 bg-white shadow-2xl z-50">
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-slate-900">
                    Notifications
                  </span>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                    {unreadCount} unread
                  </span>
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={() => markAllNotificationsAsRead()}
                    className="text-xs font-medium text-indigo-600 hover:text-indigo-800"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {relevantNotifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-700">
                    No notifications for your role at this time.
                  </div>
                ) : (
                  relevantNotifications.slice(0, 8).map((notif) => {
                    const isUnread = !notif.readBy.includes(currentUser.id);
                    return (
                      <div
                        key={notif.id}
                        onClick={() => markNotificationAsRead(notif.id)}
                        className={`p-3 text-left transition-colors cursor-pointer hover:bg-slate-50 ${
                          isUnread ? 'bg-indigo-50/40' : ''
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <div className="mt-0.5 shrink-0">
                            {notif.type === 'ALERT' || notif.type === 'WARNING' ? (
                              <AlertTriangle className="h-4 w-4 text-amber-500" />
                            ) : notif.type === 'SUCCESS' ? (
                              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                            ) : (
                              <Info className="h-4 w-4 text-blue-500" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4
                                className={`text-xs ${
                                  isUnread
                                    ? 'font-bold text-slate-900'
                                    : 'font-medium text-slate-700'
                                }`}
                              >
                                {notif.title}
                              </h4>
                              {isUnread && (
                                <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
                              )}
                            </div>
                            <p className="mt-1 text-[11px] text-slate-600 line-clamp-2">
                              {notif.message}
                            </p>
                            <span className="mt-1 block text-[10px] text-slate-700">
                              {new Date(notif.createdAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {onNavigateToNotifications && (
                <div className="border-t border-slate-100 p-2 text-center">
                  <button
                    onClick={() => {
                      setShowNotifications(false);
                      onNavigateToNotifications();
                    }}
                    className="w-full rounded-md py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  >
                    View All Notifications
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* User Profile Badge & Logout */}
        <div className="relative">
          <button
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
              setShowRoleSwitcher(false);
            }}
            className="flex items-center gap-2 rounded-lg border border-slate-200 p-1.5 hover:bg-slate-50 transition-colors"
          >
            {currentUser.avatarUrl ? (
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="h-7 w-7 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                {currentUser.name.charAt(0)}
              </div>
            )}
            <div className="hidden text-left sm:block">
              <div className="text-xs font-bold text-slate-800 leading-tight">
                {currentUser?.name || 'User'}
              </div>
              <div className="text-[10px] text-slate-700">
                {currentUser?.id || 'ID'} • {badge?.label || 'Staff'}
              </div>
            </div>
            <ChevronDown className="h-3 w-3 text-slate-700" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-xl z-50">
              <div className="border-b border-slate-100 px-3 py-2">
                <div className="text-xs font-bold text-slate-900">
                  {currentUser?.name || 'User'}
                </div>
                <div className="text-[11px] text-slate-700">{currentUser?.email || ''}</div>
                <div className="mt-1 flex items-center gap-1.5">
                  <span
                    className={`inline-block rounded-md border px-1.5 py-0.5 text-[10px] font-semibold ${badge?.bg || 'bg-slate-100 text-slate-800 border-slate-300'}`}
                  >
                    {badge?.label || 'Staff'}
                  </span>
                  <span className="text-[10px] text-slate-700">
                    ID: {currentUser?.id || ''}
                  </span>
                </div>
              </div>

              <div className="mt-1 space-y-1">
                <button
                  onClick={onOpenWorkflowModal}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-slate-700 hover:bg-slate-50"
                >
                  <Workflow className="h-4 w-4 text-indigo-600" />
                  <span>Workflow Diagram</span>
                </button>
                <button
                  onClick={() => {
                    logoutUser();
                    if (typeof window !== 'undefined') {
                      window.history.pushState({}, '', '/login');
                      window.dispatchEvent(new PopStateEvent('popstate'));
                    }
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
