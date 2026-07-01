import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, CheckCircle2, XCircle, Plus, Edit3 } from 'lucide-react';
import { mockBranches } from '../../data/mockData';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { Input, Select } from '../../components/ui/Input';

export default function ManageBranches() {
  const [addModal, setAddModal] = useState(false);
  const branches = mockBranches;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Manage Branches</h1>
          <p className="text-slate-500 text-sm">{branches.filter(b => b.isActive).length} active · {branches.filter(b => !b.isActive).length} inactive</p>
        </div>
        <Button icon={<Plus size={14} />} onClick={() => setAddModal(true)}>Add Branch</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {branches.map(branch => (
          <div key={branch.id} className={`bg-white rounded-xl border shadow-card overflow-hidden ${branch.isActive ? 'border-slate-200' : 'border-slate-200 opacity-70'}`}>
            <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-800 text-sm">{branch.name}</h3>
                <p className="text-xs text-slate-400">{branch.city} · Manager: {branch.manager}</p>
              </div>
              <div className="flex items-center gap-2">
                {branch.isActive
                  ? <span className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full"><CheckCircle2 size={11} /> Active</span>
                  : <span className="flex items-center gap-1 text-xs text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full"><XCircle size={11} /> Inactive</span>
                }
                <Button size="sm" variant="ghost" icon={<Edit3 size={12} />} className="text-xs">Edit</Button>
              </div>
            </div>
            <div className="px-5 py-4 space-y-2">
              <div className="flex items-center gap-2 text-xs text-slate-600"><MapPin size={12} className="text-blue-500 shrink-0" />{branch.address}</div>
              <div className="flex items-center gap-2 text-xs text-slate-600"><Phone size={12} className="text-blue-500" />{branch.phone}</div>
              <div className="flex items-center gap-2 text-xs text-slate-600"><Mail size={12} className="text-blue-500" />{branch.email}</div>
              <div className="flex items-center gap-2 text-xs text-slate-600"><Clock size={12} className="text-blue-500" />{branch.workingHours}</div>
              <div className="pt-2 flex flex-wrap gap-1">
                {branch.services.map(s => (
                  <span key={s} className="text-xs bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-full">{s}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal open={addModal} onClose={() => setAddModal(false)} title="Add New Branch">
        <div className="space-y-4">
          <Input label="Branch Name" placeholder="e.g. Ranya Branch" required />
          <Input label="Kurdish Name" placeholder="لقی..." />
          <div className="grid grid-cols-2 gap-3">
            <Select label="City" options={[{ value: '', label: 'Select' }, ...['Sulaymaniyah', 'Duhok', 'Halabja', 'Zakho', 'Ranya', 'Koya', 'Other'].map(c => ({ value: c, label: c }))]} />
            <Input label="District" placeholder="Area / district" />
          </div>
          <Input label="Full Address" placeholder="Street, area, city" required />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Phone" placeholder="+964..." required />
            <Input label="Email" type="email" placeholder="branch@kurdpost.krd" required />
          </div>
          <Input label="Branch Manager" placeholder="Manager full name" required />
          <Input label="Working Hours" placeholder="Sun–Thu 08:00–17:00" required />
          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={() => setAddModal(false)} className="flex-1">Cancel</Button>
            <Button className="flex-1">Add Branch</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
