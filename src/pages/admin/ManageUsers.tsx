import { useState } from 'react';
import { Search, Filter, CheckCircle2, XCircle, UserX } from 'lucide-react';
import { mockUsers } from '../../data/mockData';
import type { UserRole } from '../../types';
import { formatDate } from '../../utils';
import Button from '../../components/ui/Button';

const roleColors: Record<UserRole, string> = {
  citizen: 'bg-blue-50 text-blue-700 border-blue-200',
  business: 'bg-purple-50 text-purple-700 border-purple-200',
  government: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  admin: 'bg-slate-100 text-slate-700 border-slate-300',
};

export default function ManageUsers() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');

  const filtered = mockUsers.filter(u => {
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    const q = search.toLowerCase();
    const matchSearch = !q || [u.firstName, u.lastName, u.email, u.city].join(' ').toLowerCase().includes(q);
    return matchRole && matchSearch;
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-2xl font-bold text-slate-800">Manage Users</h1>
        <span className="text-sm text-slate-500">{mockUsers.length} total registered users</span>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, email, or city..."
            className="w-full pl-9 pr-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:border-blue-500 outline-none bg-white" />
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          <Filter size={14} className="text-slate-400" />
          {(['all', 'citizen', 'business', 'government', 'admin'] as const).map(r => (
            <button key={r} onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                roleFilter === r ? 'bg-blue-700 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-blue-300'
              }`}>
              {r === 'all' ? 'All' : r}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {['User', 'Role', 'City', 'Joined', 'Verified', 'Active', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(u => (
                <tr key={u.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {u.firstName[0]}{u.lastName[0]}
                      </div>
                      <div>
                        <p className="font-medium text-slate-800 text-sm">{u.firstName} {u.lastName}</p>
                        <p className="text-xs text-slate-400">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full border capitalize ${roleColors[u.role]}`}>{u.role}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-xs">{u.city}</td>
                  <td className="px-4 py-3 text-slate-500 text-xs">{formatDate(u.createdAt)}</td>
                  <td className="px-4 py-3">
                    {u.isVerified ? <CheckCircle2 size={16} className="text-emerald-500" /> : <XCircle size={16} className="text-amber-400" />}
                  </td>
                  <td className="px-4 py-3">
                    {u.isActive ? <CheckCircle2 size={16} className="text-emerald-500" /> : <XCircle size={16} className="text-red-400" />}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" className="text-xs">View</Button>
                      <Button size="sm" variant="ghost" className="text-xs text-red-500 hover:text-red-600">
                        <UserX size={12} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="text-center py-12 text-slate-400 text-sm">No users found.</div>}
        </div>
      </div>
      <p className="text-xs text-slate-400 text-right">{filtered.length} user(s) shown</p>
    </div>
  );
}
