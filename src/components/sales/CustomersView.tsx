import React, { useState } from 'react';
import { getAllCustomers } from '../../services/store';
import { Customer } from '../../types/erp';
import { Store, Plus, Search, Mail, Phone, MapPin, Building2, X } from 'lucide-react';

export const CustomersView: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>(getAllCustomers());
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Customer Form
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !company || !email) return;

    const newCust: Customer = {
      id: `CUST-${String(customers.length + 1).padStart(3, '0')}`,
      name,
      company,
      email,
      phone: phone || '+1 (555) 000-0000',
      address: address || 'Corporate Headquarters',
      ordersCount: 0,
    };

    const updated = [...customers, newCust];
    setCustomers(updated);
    localStorage.setItem('SME_ERP_CUSTOMERS', JSON.stringify(updated));

    setName('');
    setCompany('');
    setEmail('');
    setPhone('');
    setAddress('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-xs">
              <Store className="h-5 w-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-900">
              Customer Accounts Directory
            </h1>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Registered commercial clients and their order fulfillment histories.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-indigo-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Customer</span>
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by customer name, company, or email..."
          className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.map((c) => (
          <div
            key={c.id}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-indigo-300 transition-all"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="rounded-md bg-emerald-50 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-700 border border-emerald-200">
                  {c.id}
                </span>
                <h3 className="mt-2 text-base font-bold text-slate-900">{c.name}</h3>
                <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600 mt-0.5">
                  <Building2 className="h-3.5 w-3.5 text-slate-400" />
                  <span>{c.company}</span>
                </div>
              </div>
              <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700">
                {c.ordersCount} Orders
              </span>
            </div>

            <div className="mt-4 space-y-2 border-t border-slate-100 pt-3 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{c.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <span>{c.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{c.address}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Add Customer</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddCustomer} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700">Contact Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="e.g. Ronald Baker"
                  className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-slate-900"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700">Company Name *</label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  required
                  placeholder="e.g. Vertex Systems Inc."
                  className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-slate-900"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700">Email Address *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="r.baker@vertex.com"
                  className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-slate-900"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700">Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-slate-900"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700">Delivery Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="123 Corporate Blvd"
                  className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-slate-900"
                />
              </div>
              <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-lg border px-4 py-2 font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-indigo-600 px-4 py-2 font-bold text-white hover:bg-indigo-700"
                >
                  Save Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
