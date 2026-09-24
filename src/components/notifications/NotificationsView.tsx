import React from 'react';
import { User } from '../../types/erp';
import {
  getAllNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  isUserTargetForRoles,
  normalizeRole,
} from '../../services/store';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Info,
  Check,
  Clock,
  Shield,
} from 'lucide-react';

interface NotificationsViewProps {
  currentUser: User;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({ currentUser }) => {
  const notifications = getAllNotifications();
  const relevant = notifications.filter((n) => isUserTargetForRoles(currentUser.role, n.targetRoles));
  const unreadCount = relevant.filter((n) => !n.readBy.includes(currentUser.id)).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-xs">
              <Bell className="h-5 w-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-900">
              Cross-Module Notifications &amp; System Dispatch
            </h1>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Real-time workflow alerts delivered directly to your assigned role ({currentUser.role}).
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={() => markAllNotificationsAsRead()}
            className="flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2 text-xs font-bold text-indigo-700 hover:bg-indigo-100 transition-colors"
          >
            <Check className="h-4 w-4" />
            <span>Mark All as Read ({unreadCount})</span>
          </button>
        )}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="divide-y divide-slate-100">
          {relevant.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-600">
              No notifications dispatched to your role yet.
            </div>
          ) : (
            relevant.map((notif) => {
              const isUnread = !notif.readBy.includes(currentUser.id);

              return (
                <div
                  key={notif.id}
                  onClick={() => markNotificationAsRead(notif.id)}
                  className={`p-4 transition-colors cursor-pointer hover:bg-slate-50 flex items-start gap-4 ${
                    isUnread ? 'bg-indigo-50/30' : ''
                  }`}
                >
                  <div className="mt-1 shrink-0">
                    {notif.type === 'ALERT' || notif.type === 'WARNING' ? (
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                        <AlertTriangle className="h-5 w-5" />
                      </div>
                    ) : notif.type === 'SUCCESS' ? (
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                        <CheckCircle2 className="h-5 w-5" />
                      </div>
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                        <Info className="h-5 w-5" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h4
                          className={`text-sm ${
                            isUnread
                              ? 'font-bold text-slate-900'
                              : 'font-medium text-slate-700'
                          }`}
                        >
                          {notif.title}
                        </h4>
                        {isUnread && (
                          <span className="rounded-full bg-indigo-600 px-2 py-0.5 text-[10px] font-bold text-white">
                            New
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-600 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(notif.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    <p className="mt-1 text-xs text-slate-600">{notif.message}</p>

                    <div className="mt-2 flex items-center gap-2 text-[10px] text-slate-600 font-mono">
                      <span>Targets: {notif.targetRoles.join(', ')}</span>
                      {notif.linkTo && (
                        <span>• Ref: {notif.linkTo}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
