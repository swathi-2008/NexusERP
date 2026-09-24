import React, { useState } from 'react';
import { getAllSuppliers } from '../../services/store';
import { Supplier } from '../../types/erp';
import { Store, Plus, Search, Mail, Phone, Clock, Star, X } from 'lucide-react';

export const SuppliersView: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>(getAllSuppliers());
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Supplier Form state
  const [name, setName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState('');
  const [leadTime, setLeadTime] = useState(3);

  const filtered = suppliers.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.category || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    const newSup: Supplier = {
      id: `SUP-${String(suppliers.length + 1).padStart(3, '0')}`,
      name,
      contactPerson: contactPerson || 'Accounts Rep',
      email,
      phone: phone || '+1 (555) 000-0000',
      address: 'Corporate Logistics Center',
      category: category || 'Electronics & Hardware',
      leadTimeDays: Number(leadTime),
      rating: 4.8,
      status: 'ACTIVE',
    };

    const updated = [...suppliers, newSup];
    setSuppliers(updated);
    localStorage.setItem('SME_ERP_SUPPLIERS', JSON.stringify(updated));

    setName('');
    setContactPerson('');
    setEmail('');
    setPhone('');
    setCategory('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-600 text-white shadow-xs">
              <Store className="h-5 w-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-900">
              Verified Suppliers Directory
            </h1>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Approved B2B manufacturers and distributors for inventory restock.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 rounded-xl bg-amber-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-amber-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Supplier</span>
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by supplier name, contact, or category..."
          className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((s) => (
          <div
            key={s.id}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-amber-300 transition-all"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="rounded-md bg-amber-50 px-2 py-0.5 font-mono text-[10px] font-bold text-amber-700 border border-amber-200">
                  {s.id}
                </span>
                <h3 className="mt-2 text-base font-bold text-slate-900">{s.name}</h3>
                <p className="text-xs text-slate-500">{s.category}</p>
              </div>
              <div className="flex items-center gap-1 rounded-lg bg-amber-50 px-2 py-1 text-xs font-bold text-amber-800">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span>{s.rating}</span>
              </div>
            </div>

            <div className="mt-4 space-y-2 border-t border-slate-100 pt-3 text-xs text-slate-600">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Contact:</span>
                <span className="font-semibold text-slate-800">{s.contactPerson}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Email:</span>
                <span className="font-mono text-slate-700 truncate max-w-[170px]">{s.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Phone:</span>
                <span>{s.phone}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Avg Lead Time:</span>
                <span className="font-semibold text-amber-700">{s.leadTimeDays} business days</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Add Verified Supplier</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddSupplier} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700">Company Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="e.g. Apex Global Components"
                  className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-slate-900"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700">Contact Person</label>
                <input
                  type="text"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  placeholder="e.g. Marcus Vance"
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
                  placeholder="orders@apexcomponents.com"
                  className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-slate-900"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700">Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 345-6789"
                  className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-slate-900"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700">Category</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Electronics"
                    className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700">Lead Time (Days)</label>
                  <input
                    type="number"
                    min={1}
                    value={leadTime}
                    onChange={(e) => setLeadTime(Number(e.target.value))}
                    className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-slate-900 font-mono"
                  />
                </div>
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
                  className="rounded-lg bg-amber-600 px-4 py-2 font-bold text-white hover:bg-amber-700"
                >
                  Save Supplier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
