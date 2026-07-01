import { useState } from 'react';
import { Building2, Edit3, Save, CheckCircle2, Code } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export default function CompanyProfile() {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    companyName: user?.companyName || '',
    companyRegNo: user?.companyRegNo || '',
    phone: user?.phone || '',
    city: user?.city || '',
  });

  const set = (f: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [f]: e.target.value }));

  const handleSave = () => {
    updateUser(form);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-2xl font-bold text-slate-800">Company Profile</h1>
        {!editing && <Button variant="outline" icon={<Edit3 size={14} />} onClick={() => setEditing(true)}>Edit</Button>}
      </div>

      {saved && (
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3 text-sm text-emerald-700">
          <CheckCircle2 size={16} /> Company profile updated.
        </div>
      )}

      <Card>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-purple-700 rounded-xl flex items-center justify-center text-white">
            <Building2 size={28} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">{user?.companyName || 'Your Company'}</h2>
            <p className="text-sm text-slate-500">Business Account · {user?.email}</p>
            <span className="mt-1 inline-block text-xs bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded-full">Business Portal</span>
          </div>
        </div>

        {editing ? (
          <div className="space-y-4">
            <Input label="Company Name" value={form.companyName} onChange={set('companyName')} required />
            <Input label="Registration Number" value={form.companyRegNo} onChange={set('companyRegNo')} />
            <Input label="Contact Phone" value={form.phone} onChange={set('phone')} />
            <Input label="City" value={form.city} onChange={set('city')} />
            <div className="flex gap-3 pt-2">
              <Button variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
              <Button icon={<Save size={14} />} onClick={handleSave}>Save Changes</Button>
            </div>
          </div>
        ) : (
          <dl className="space-y-3">
            {[
              { label: 'Company Name', value: user?.companyName || '—' },
              { label: 'Registration #', value: user?.companyRegNo || '—' },
              { label: 'Contact Phone', value: user?.phone },
              { label: 'City', value: user?.city },
              { label: 'Account Owner', value: `${user?.firstName} ${user?.lastName}` },
              { label: 'Email', value: user?.email },
            ].map(d => (
              <div key={d.label} className="flex gap-4 py-2 border-b border-slate-100 last:border-0">
                <dt className="text-sm text-slate-400 w-36 shrink-0">{d.label}</dt>
                <dd className="text-sm text-slate-700 font-medium">{d.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </Card>

      {/* API Access */}
      <Card>
        <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2"><Code size={16} /> API Access</h3>
        <p className="text-sm text-slate-500 mb-4">Integrate Kurd Post directly into your logistics software with our REST API.</p>
        <div className="bg-slate-900 rounded-xl p-4 font-mono text-xs text-emerald-400 mb-4 overflow-x-auto">
          <p className="text-slate-400"># Example: Create a shipment via API</p>
          <p className="mt-1">POST https://api.kurdpost.krd/v1/shipments</p>
          <p>Authorization: Bearer YOUR_API_KEY</p>
          <p className="text-slate-400 mt-2"># Contact enterprise@kurdpost.krd for API access</p>
        </div>
        <Button variant="outline">Request API Access</Button>
      </Card>
    </div>
  );
}
