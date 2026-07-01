import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { mockBranches } from '../../data/mockData';

export default function Branches() {
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const filtered = mockBranches.filter(b =>
    filter === 'all' ? true : filter === 'active' ? b.isActive : !b.isActive
  );

  return (
    <div>
      <section className="bg-gradient-to-r from-blue-800 to-blue-700 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-3">Our Branches</h1>
          <p className="text-blue-200 text-lg">Find your nearest Kurd Post branch across the Kurdistan Region</p>
        </div>
      </section>

      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Filter */}
        <div className="flex items-center gap-2 mb-8">
          {(['all', 'active', 'inactive'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                filter === f ? 'bg-blue-700 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-blue-300'
              }`}>
              {f === 'all' ? 'All Branches' : f === 'active' ? 'Active' : 'Inactive'} {f === 'all' ? `(${mockBranches.length})` : f === 'active' ? `(${mockBranches.filter(b=>b.isActive).length})` : `(${mockBranches.filter(b=>!b.isActive).length})`}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(branch => (
            <div key={branch.id} className={`bg-white rounded-2xl border shadow-card overflow-hidden transition-shadow hover:shadow-panel ${branch.isActive ? 'border-slate-200' : 'border-slate-200 opacity-75'}`}>
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold text-slate-800">{branch.name}</h3>
                  {branch.nameKu && <p className="text-xs text-slate-400 mt-0.5 font-arabic">{branch.nameKu}</p>}
                </div>
                {branch.isActive ? (
                  <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-200 shrink-0">
                    <CheckCircle2 size={12} /> Active
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-full border border-slate-200 shrink-0">
                    <XCircle size={12} /> Inactive
                  </span>
                )}
              </div>
              <div className="px-6 py-4 space-y-3">
                <div className="flex items-start gap-2 text-sm text-slate-600">
                  <MapPin size={14} className="text-blue-500 mt-0.5 shrink-0" />
                  <span>{branch.address}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Phone size={14} className="text-blue-500 shrink-0" />
                  <span>{branch.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Mail size={14} className="text-blue-500 shrink-0" />
                  <span>{branch.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Clock size={14} className="text-blue-500 shrink-0" />
                  <span>{branch.workingHours}</span>
                </div>
                <div className="pt-2 border-t border-slate-100">
                  <p className="text-xs text-slate-400 mb-2">Services Available</p>
                  <div className="flex flex-wrap gap-1.5">
                    {branch.services.map(s => (
                      <span key={s} className="text-xs bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-full">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-400">Manager: {branch.manager}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
