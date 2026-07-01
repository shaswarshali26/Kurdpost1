import { useState } from 'react';
import { FileText, Shield, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { mockShipments, mockBranches } from '../../data/mockData';
import { Input, Select, Textarea } from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { generateTrackingNumber } from '../../utils';
import type { Shipment } from '../../types';

export default function DocumentShipment() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState<{ tn: string; verCode: string } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    receiverName: '', receiverPhone: '', receiverDept: '', receiverCity: '',
    documentType: 'civil', priority: 'standard', description: '', branchId: 'b1',
    requiresSignature: true, confidential: false,
  });

  const set = (f: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const val = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setForm(prev => ({ ...prev, [f]: val }));
    setErrors(er => ({ ...er, [f]: '' }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.receiverName.trim()) e.receiverName = 'Required';
    if (!form.receiverCity.trim()) e.receiverCity = 'Required';
    if (!form.description.trim()) e.description = 'Required';
    setErrors(e); return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    const tn = generateTrackingNumber();
    const verCode = `GOV-VER-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}`;
    const newShipment: Shipment = {
      id: `s${Date.now()}`, trackingNumber: tn, type: 'document', scope: 'national',
      status: 'accepted', userId: user!.id,
      sender: { name: user?.department || 'Government Dept', phone: user?.phone || '', city: user?.city || '', country: 'Iraq' },
      receiver: { name: form.receiverName, phone: form.receiverPhone, city: form.receiverCity, district: form.receiverDept, country: 'Iraq' },
      weight: 0.3, description: `[${form.documentType.toUpperCase()}] ${form.description}`,
      isOfficial: true, requiresVerification: true, verificationCode: verCode,
      branchId: form.branchId, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
      insurance: true, value: 0,
      statusHistory: [{ status: 'accepted', timestamp: new Date().toISOString(), location: mockBranches.find(b => b.id === form.branchId)?.name || 'Branch', note: 'Official document accepted — verification complete', operator: 'Kurd Post Staff' }],
    };
    mockShipments.push(newShipment);
    setCreated({ tn, verCode });
    setLoading(false);
  };

  if (created) {
    return (
      <div className="max-w-lg mx-auto text-center py-12">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-10">
          <CheckCircle2 size={56} className="text-emerald-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-800 mb-2">Document Shipment Registered</h2>
          <p className="text-slate-500 mb-6">The official document has been accepted into the Kurd Post secure pipeline.</p>
          <div className="space-y-3 mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-xl px-6 py-4">
              <p className="text-xs text-slate-400 mb-1">Tracking Number</p>
              <p className="font-mono font-bold text-xl text-blue-700">{created.tn}</p>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-6 py-4">
              <p className="text-xs text-slate-400 mb-1">Verification Code (for receiver)</p>
              <p className="font-mono font-bold text-sm text-amber-700">{created.verCode}</p>
              <p className="text-xs text-amber-600 mt-1">Share this code only with the authorized receiver.</p>
            </div>
          </div>
          <Button onClick={() => setCreated(null)}>Send Another Document</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2"><FileText size={22} /> Document Shipment</h1>
        <p className="text-slate-500 text-sm">Official government document delivery with verified chain of custody</p>
      </div>

      <div className="flex items-start gap-3 bg-emerald-50 border border-emerald-200 rounded-xl px-5 py-4">
        <Shield size={18} className="text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-emerald-800 text-sm">Government Secure Channel</p>
          <p className="text-emerald-700 text-xs">All document shipments are handled under government-grade protocols. A verification code will be issued for the receiver.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-card p-8 space-y-5">
        <div>
          <p className="text-sm font-semibold text-slate-600 mb-1">Sending From</p>
          <div className="bg-slate-50 rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700">
            {user?.department} · {user?.city}, Iraq
          </div>
        </div>

        <div className="border-t border-slate-100 pt-4">
          <p className="text-sm font-semibold text-slate-600 mb-3">Receiver Details</p>
          <div className="space-y-3">
            <Input label="Receiver Name / Institution" value={form.receiverName} onChange={set('receiverName')} error={errors.receiverName} required />
            <Input label="Department / Ministry" value={form.receiverDept} onChange={set('receiverDept')} placeholder="e.g. Ministry of Finance" />
            <Input label="Receiver Phone" type="tel" value={form.receiverPhone} onChange={set('receiverPhone')} placeholder="+964..." />
            <Select label="Receiver City" value={form.receiverCity} onChange={set('receiverCity') as any} error={errors.receiverCity}
              options={[{ value: '', label: 'Select city' }, ...['Sulaymaniyah', 'Duhok', 'Halabja', 'Zakho', 'Other'].map(c => ({ value: c, label: c }))]} required />
          </div>
        </div>

        <div className="border-t border-slate-100 pt-4">
          <p className="text-sm font-semibold text-slate-600 mb-3">Document Details</p>
          <div className="space-y-3">
            <Select label="Document Type" value={form.documentType} onChange={set('documentType') as any}
              options={[
                { value: 'civil', label: 'Civil Registry Document' },
                { value: 'legal', label: 'Legal / Judicial Document' },
                { value: 'financial', label: 'Financial / Budget Document' },
                { value: 'administrative', label: 'Administrative Directive' },
                { value: 'medical', label: 'Medical / Health Document' },
                { value: 'other', label: 'Other Official Document' },
              ]} />
            <Select label="Priority" value={form.priority} onChange={set('priority') as any}
              options={[{ value: 'standard', label: 'Standard (1–3 days)' }, { value: 'urgent', label: 'Urgent (Next Day)' }]} />
            <Textarea label="Document Description (brief, no sensitive content)" value={form.description} onChange={set('description')}
              error={errors.description} rows={3} placeholder="Describe the nature of the document..." required />
          </div>
        </div>

        <div className="border-t border-slate-100 pt-4">
          <Select label="Drop-off Branch" value={form.branchId} onChange={set('branchId') as any}
            options={mockBranches.filter(b => b.isActive).map(b => ({ value: b.id, label: `${b.name} — ${b.city}` }))} />
        </div>

        <div className="space-y-2 pt-1">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={form.requiresSignature} onChange={set('requiresSignature')} className="w-4 h-4 accent-blue-700" />
            <span className="text-sm text-slate-700">Require signature on delivery</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={form.confidential} onChange={set('confidential')} className="w-4 h-4 accent-blue-700" />
            <span className="text-sm text-slate-700">Mark as confidential</span>
          </label>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-start gap-2">
            <AlertTriangle size={14} className="text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700">By submitting, you confirm that you are authorized to send this document on behalf of your institution. A verification code will be generated for the receiver.</p>
          </div>
        </div>

        <Button type="submit" fullWidth loading={loading} icon={<Shield size={16} />} size="lg">
          Submit Official Document Shipment
        </Button>
      </form>
    </div>
  );
}
