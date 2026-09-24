import React, { useState } from 'react';
import { authenticateUser } from '../../services/store';
import { User } from '../../types/erp';
import {
  Building2,
  Lock,
  UserCheck,
  AlertCircle,
  KeyRound,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: (user: User, redirectUrl: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!userId.trim() || !password.trim()) {
      setError('Please provide both User ID and Password.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const result = authenticateUser(userId, password);
      setLoading(false);

      if (result.success && result.user && result.redirectUrl) {
        onLoginSuccess(result.user, result.redirectUrl);
      } else {
        setError(result.error || 'Invalid User ID or Password');
      }
    }, 250);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Subtle Gradient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-linear-to-b from-indigo-500/10 via-transparent to-transparent pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-tr from-indigo-600 to-blue-500 text-white shadow-lg shadow-indigo-500/25 ring-4 ring-white/10">
            <Building2 className="h-8 w-8" />
          </div>
        </div>
        <h2 className="mt-4 text-center text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
          NexusERP Enterprise
        </h2>
        <p className="mt-1.5 text-center text-xs text-slate-400">
          Small &amp; Medium Business Workflow Management System
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <div className="bg-white py-8 px-6 shadow-2xl rounded-2xl sm:px-10 border border-slate-100">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-900">
              Sign in to your station
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Enter your assigned User ID and system password to access your role dashboard.
            </p>
          </div>

          {error && (
            <div className="mb-5 flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 p-3 text-red-800 animate-shake">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
              <div className="text-xs font-semibold">{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="userId"
                className="block text-xs font-semibold text-slate-700"
              >
                User ID
              </label>
              <div className="mt-1 relative rounded-md shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserCheck className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  id="userId"
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="e.g. ADM001, MGR001, SAL001, PUR001"
                  required
                  autoFocus
                  className="block w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono font-medium uppercase text-slate-900 bg-white"
                />
              </div>
              <p className="mt-1 text-[11px] text-slate-400">
                Assigned employee identification code
              </p>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-slate-700"
              >
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="block w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Authenticate &amp; Launch</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Strict Security Policy Notice */}
          <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-3 text-[11px] text-slate-600">
            <div className="flex items-center gap-1.5 font-semibold text-slate-800">
              <ShieldAlert className="h-3.5 w-3.5 text-indigo-600" />
              <span>Access Control Policy</span>
            </div>
            <p className="mt-1 text-slate-500">
              Self-registration is restricted. Employee accounts, IDs, and roles are provisioned exclusively by the Administrator.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
