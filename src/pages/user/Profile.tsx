import { useState } from 'react';
import { CheckCircle2, Edit3, Save, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { formatDate } from '../../utils';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    firstName: user?.firstName || '', lastName: user?.lastName || '',
    phone: user?.phone || '', city: user?.city || '', address: user?.address || '',
  });

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }));

  const handleSave = () => {
    updateUser(form);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (!user) return null;

  const roleLabels: Record<string, string> = {
    citizen: 'Citizen', business: 'Business Account', government: 'Government / Institution', admin: 'System Administrator',
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">My Profile</h1>
        {!editing && <Button variant="outline" icon={<Edit3 size={14} />} onClick={() => setEditing(true)}>Edit Profile</Button>}
      </div>

      {saved && (
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3 text-sm text-emerald-700">
          <CheckCircle2 size={16} /> Profile updated successfully.
        </div>
      )}

      {/* Avatar + account info */}
      <Card>
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 bg-blue-700 rounded-full flex items-center justify-center text-white text-xl font-bold shrink-0">
            {user.firstName[0]}{user.lastName[0]}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">{user.firstName} {user.lastName}</h2>
            <p className="text-sm text-slate-500">{roleLabels[user.role]}</p>
            <div className="flex items-center gap-2 mt-1.5">
              {user.isVerified ? (
                <span className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                  <CheckCircle2 size={11} /> Verified
                </span>
              ) : (
                <span className="text-xs text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">Unverified</span>
              )}
              <span className="text-xs text-slate-400">Member since {formatDate(user.createdAt)}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Details */}
      <Card>
        <h3 className="font-semibold text-slate-700 mb-5">Personal Information</h3>
        {editing ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Input label="First Name" value={form.firstName} onChange={set('firstName')} required />
              <Input label="Last Name" value={form.lastName} onChange={set('lastName')} required />
            </div>
            <Input label="Phone Number" value={form.phone} onChange={set('phone')} />
            <Input label="City" value={form.city} onChange={set('city')} />
            <Input label="Address" value={form.address} onChange={set('address')} />
            <div className="flex gap-3 pt-2">
              <Button variant="outline" icon={<X size={14} />} onClick={() => setEditing(false)}>Cancel</Button>
              <Button icon={<Save size={14} />} onClick={handleSave}>Save Changes</Button>
            </div>
          </div>
        ) : (
          <dl className="space-y-3">
            {[
              { label: 'Full Name', value: `${user.firstName} ${user.lastName}` },
              { label: 'Email', value: user.email },
              { label: 'Phone', value: user.phone },
              { label: 'City', value: user.city },
              { label: 'Role', value: roleLabels[user.role] },
              ...(user.companyName ? [{ label: 'Company', value: user.companyName }] : []),
              ...(user.department ? [{ label: 'Department', value: user.department }] : []),
              ...(user.nationalId ? [{ label: 'National ID', value: user.nationalId }] : []),
            ].map(d => (
              <div key={d.label} className="flex gap-4 py-2 border-b border-slate-100 last:border-0">
                <dt className="text-sm text-slate-400 w-32 shrink-0">{d.label}</dt>
                <dd className="text-sm text-slate-700 font-medium">{d.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </Card>

      {/* Security */}
      <Card>
        <h3 className="font-semibold text-slate-700 mb-4">Security</h3>
        <div className="flex items-center justify-between py-3 border-b border-slate-100">
          <div>
            <p className="text-sm font-medium text-slate-700">Password</p>
            <p className="text-xs text-slate-400">Last changed: Never</p>
          </div>
          <Button variant="outline" size="sm">Change Password</Button>
        </div>
        <div className="flex items-center justify-between py-3">
          <div>
            <p className="text-sm font-medium text-slate-700">Two-Factor Authentication</p>
            <p className="text-xs text-slate-400">Add extra security to your account</p>
          </div>
          <Button variant="outline" size="sm">Enable 2FA</Button>
        </div>
      </Card>
    </div>
  );
}
