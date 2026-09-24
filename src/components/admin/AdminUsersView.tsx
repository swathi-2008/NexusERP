import React, { useState } from 'react';
import {
  getAllUsers,
  createNewUser,
  toggleUserStatus,
} from '../../services/store';
import { User, UserRole } from '../../types/erp';
import {
  Users,
  UserPlus,
  Shield,
  CheckCircle,
  XCircle,
  Mail,
  Building,
  KeyRound,
  X,
  AlertCircle,
  Search,
} from 'lucide-react';

export const AdminUsersView: React.FC = () => {
  const users = getAllUsers();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('SALES');
  const [department, setDepartment] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole =
      roleFilter === 'ALL' ||
      (u.role && u.role.toLowerCase() === roleFilter.toLowerCase());
    return matchesSearch && matchesRole;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    if (!name.trim() || !email.trim() || !department.trim()) {
      setFormError('Please fill in all required fields.');
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      setFormError('Please enter a valid email address.');
      return;
    }

    const result = createNewUser({
      name: name.trim(),
      email: email.trim(),
      role,
      department: department.trim(),
      password: password.trim() || (role.toLowerCase() + '123'),
    });

    if (!result.success) {
      setFormError(result.error || 'Failed to create user account.');
    } else {
      setFormSuccess(
        `Employee account created successfully! Assigned User ID: ${result.user?.id}`
      );
      // Reset form
      setName('');
      setEmail('');
      setDepartment('');
      setPassword('');
      setTimeout(() => {
        setShowCreateModal(false);
        setFormSuccess(null);
      }, 1500);
    }
  };

  const getRoleBadge = (userRole?: UserRole | string | null) => {
    const normalized = (userRole || '').toUpperCase();
    switch (normalized) {
      case 'ADMIN':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'MANAGER':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'SALES':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'PURCHASE':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-600 text-white shadow-xs">
              <Users className="h-5 w-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-900">
              Staff &amp; Role Management
            </h1>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Provision employee credentials, assign designated roles, and manage active system permissions.
          </p>
        </div>

        <button
          onClick={() => {
            setShowCreateModal(true);
            setFormError(null);
            setFormSuccess(null);
          }}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-indigo-700 transition-colors"
        >
          <UserPlus className="h-4 w-4" />
          <span>Provision New Employee</span>
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
            placeholder="Search by User ID (e.g. ADM001), Name, or Email..."
            className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Filter Role:</span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-hidden"
          >
            <option value="ALL">All Roles ({users.length})</option>
            <option value="ADMIN">Admin Only</option>
            <option value="MANAGER">Manager Only</option>
            <option value="SALES">Sales Staff Only</option>
            <option value="PURCHASE">Purchase Staff Only</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-xs">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left font-bold text-slate-700 uppercase tracking-wider">
                  User ID
                </th>
                <th className="px-4 py-3 text-left font-bold text-slate-700 uppercase tracking-wider">
                  Employee Details
                </th>
                <th className="px-4 py-3 text-left font-bold text-slate-700 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-4 py-3 text-left font-bold text-slate-700 uppercase tracking-wider">
                  Assigned Role
                </th>
                <th className="px-4 py-3 text-center font-bold text-slate-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left font-bold text-slate-700 uppercase tracking-wider">
                  Last Login
                </th>
                <th className="px-4 py-3 text-right font-bold text-slate-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-indigo-700">
                    {u.id}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-bold text-slate-900">{u.name}</div>
                    <div className="text-[11px] text-slate-600 flex items-center gap-1 mt-0.5">
                      <Mail className="h-3 w-3 text-slate-400" />
                      <span>{u.email}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {u.department}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-md border px-2 py-0.5 text-[10px] font-bold ${getRoleBadge(
                        u.role
                      )}`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        u.isActive
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          u.isActive ? 'bg-emerald-600' : 'bg-red-600'
                        }`}
                      />
                      <span>{u.isActive ? 'Active' : 'Disabled'}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600 text-[11px]">
                    {u.lastLogin ? new Date(u.lastLogin).toLocaleString() : 'Never logged in'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {u.id === 'ADM001' ? (
                      <span className="text-[10px] text-slate-600 font-semibold">
                        Primary Root
                      </span>
                    ) : (
                      <button
                        onClick={() => toggleUserStatus(u.id)}
                        className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                          u.isActive
                            ? 'border border-red-200 text-red-700 hover:bg-red-50'
                            : 'border border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                        }`}
                      >
                        {u.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE EMPLOYEE MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Provision New Employee Account
                </h3>
                <p className="text-xs text-slate-500">
                  Assign user details and operational role. User ID will be auto-generated.
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {formError && (
              <div className="mt-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-800">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
                <span>{formError}</span>
              </div>
            )}

            {formSuccess && (
              <div className="mt-4 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-800">
                <CheckCircle className="h-4 w-4 shrink-0 text-emerald-600" />
                <span>{formSuccess}</span>
              </div>
            )}

            <form onSubmit={handleCreateSubmit} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Jessica Taylor"
                  required
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700">
                  Company Email Address *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jessica.taylor@enterprise-erp.com"
                  required
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700">
                    Assigned Role *
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-semibold"
                  >
                    <option value="SALES">SALES STAFF</option>
                    <option value="PURCHASE">PURCHASE STAFF</option>
                    <option value="MANAGER">MANAGER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                  <p className="mt-1 text-[10px] text-slate-600">
                    ID Prefix: {role === 'ADMIN' ? 'ADM' : role === 'MANAGER' ? 'MGR' : role === 'SALES' ? 'SAL' : 'PUR'}
                  </p>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700">
                    Department *
                  </label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="e.g. Regional Sales"
                    required
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700">
                  Temporary Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={`Leave blank for default: ${role.toLowerCase()}123`}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
                <p className="mt-1 text-[10px] text-slate-600">
                  Default will be set to '{role.toLowerCase()}123' if omitted.
                </p>
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2 font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-indigo-600 px-4 py-2 font-bold text-white hover:bg-indigo-700"
                >
                  Create Employee Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
