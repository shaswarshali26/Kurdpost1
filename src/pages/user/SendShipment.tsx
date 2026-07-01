import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, CheckCircle2, Package } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { mockShipments, mockBranches } from '../../data/mockData';
import { Input, Select, Textarea } from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { generateTrackingNumber, validatePhone } from '../../utils';
import type { Shipment } from '../../types';

type Step = 1 | 2 | 3 | 4;

export default function SendShipment() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState<string | null>(null);

  const [form, setForm] = useState({
    senderName: `${user?.firstName} ${user?.lastName}`,
    senderPhone: user?.phone || '',
    senderCity: user?.city || '',
    receiverName: '', receiverPhone: '', receiverCity: '', receiverCountry: 'Iraq',
    type: 'standard', scope: 'national', weight: '', description: '',
    branchId: 'b1', isOfficial: false, insurance: false, value: '',
    notes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const val = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setForm(f => ({ ...f, [field]: val }));
    setErrors(er => ({ ...er, [field]: '' }));
  };

  const validate1 = () => {
    const e: Record<string, string> = {};
    if (!form.senderName.trim()) e.senderName = 'Required';
    if (!validatePhone(form.senderPhone)) e.senderPhone = 'Invalid phone';
    if (!form.senderCity.trim()) e.senderCity = 'Required';
    setErrors(e); return Object.keys(e).length === 0;
  };
  const validate2 = () => {
    const e: Record<string, string> = {};
    if (!form.receiverName.trim()) e.receiverName = 'Required';
    if (!validatePhone(form.receiverPhone)) e.receiverPhone = 'Invalid phone';
    if (!form.receiverCity.trim()) e.receiverCity = 'Required';
    setErrors(e); return Object.keys(e).length === 0;
  };
  const validate3 = () => {
    const e: Record<string, string> = {};
    if (!form.weight || isNaN(Number(form.weight)) || Number(form.weight) <= 0) e.weight = 'Enter valid weight';
    if (!form.description.trim()) e.description = 'Required';
    setErrors(e); return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validate1()) setStep(2);
    else if (step === 2 && validate2()) setStep(3);
    else if (step === 3 && validate3()) setStep(4);
  };

  const handleSubmit = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    const tn = generateTrackingNumber();
    const newShipment: Shipment = {
      id: `s${Date.now()}`, trackingNumber: tn,
      type: form.type as any, scope: form.scope as any,
      status: 'accepted', userId: user!.id,
      sender: { name: form.senderName, phone: form.senderPhone, city: form.senderCity, country: 'Iraq' },
      receiver: { name: form.receiverName, phone: form.receiverPhone, city: form.receiverCity, country: form.receiverCountry },
      weight: Number(form.weight), description: form.description,
      isOfficial: form.isOfficial, requiresVerification: form.isOfficial,
      branchId: form.branchId, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
      insurance: form.insurance, value: form.value ? Number(form.value) : undefined, notes: form.notes || undefined,
      statusHistory: [{ status: 'accepted', timestamp: new Date().toISOString(), location: mockBranches.find(b => b.id === form.branchId)?.name || 'Branch', operator: 'Kurd Post Staff' }],
    };
    mockShipments.push(newShipment);
    setCreated(tn);
    setLoading(false);
  };

  if (created) {
    return (
      <div className="max-w-lg mx-auto text-center py-12">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-10">
          <CheckCircle2 size={56} className="text-emerald-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Shipment Created!</h2>
          <p className="text-slate-500 mb-6">Your shipment has been successfully registered with Kurd Post.</p>
          <div className="bg-blue-50 border border-blue-200 rounded-xl px-6 py-4 mb-6">
            <p className="text-xs text-slate-400 mb-1">Tracking Number</p>
            <p className="font-mono font-bold text-2xl text-blue-700">{created}</p>
          </div>
          <p className="text-sm text-slate-500 mb-6">Please bring your parcel to the selected branch. Keep your tracking number safe.</p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => navigate('/portal/track?q=' + created)}>Track Shipment</Button>
            <Button onClick={() => { setCreated(null); setStep(1); }}>Send Another</Button>
          </div>
        </div>
      </div>
    );
  }

  const stepTitles = ['Sender Details', 'Receiver Details', 'Shipment Details', 'Review & Confirm'];
  const cities = ['Sulaymaniyah', 'Duhok', 'Halabja', 'Zakho', 'Koya', 'Ranya', 'Soran', 'Other'].map(c => ({ value: c, label: c }));

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2"><Send size={22} /> Send Shipment</h1>
        <p className="text-slate-500 text-sm mt-1">Step {step} of 4 — {stepTitles[step - 1]}</p>
      </div>

      {/* Progress bar */}
      <div className="flex gap-1.5">
        {[1, 2, 3, 4].map(n => (
          <div key={n} className={`h-1.5 flex-1 rounded-full transition-colors ${n <= step ? 'bg-blue-700' : 'bg-slate-200'}`} />
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-8 space-y-4">
        {step === 1 && (
          <>
            <Input label="Sender Full Name" value={form.senderName} onChange={set('senderName')} error={errors.senderName} required />
            <Input label="Sender Phone" value={form.senderPhone} onChange={set('senderPhone')} error={errors.senderPhone} placeholder="+964 750..." required />
            <Select label="Sender City" value={form.senderCity} onChange={set('senderCity') as any} error={errors.senderCity}
              options={[{ value: '', label: 'Select city' }, ...cities]} required />
            <Input label="Sender Street / District" value={form.notes} onChange={set('notes')} placeholder="Optional" />
          </>
        )}
        {step === 2 && (
          <>
            <Input label="Receiver Full Name" value={form.receiverName} onChange={set('receiverName')} error={errors.receiverName} required />
            <Input label="Receiver Phone" value={form.receiverPhone} onChange={set('receiverPhone')} error={errors.receiverPhone} placeholder="+964 750..." required />
            <Select label="Delivery Scope" value={form.scope} onChange={set('scope') as any}
              options={[{ value: 'local', label: 'Local (within city)' }, { value: 'national', label: 'National (within Iraq)' }, { value: 'international', label: 'International' }]} />
            {form.scope === 'international' ? (
              <Input label="Receiver Country" value={form.receiverCountry} onChange={set('receiverCountry')} required />
            ) : (
              <Select label="Receiver City" value={form.receiverCity} onChange={set('receiverCity') as any} error={errors.receiverCity}
                options={[{ value: '', label: 'Select city' }, ...cities]} required />
            )}
            <Input label="Receiver Address / District" value={form.receiverCity} onChange={set('receiverCity')} placeholder="Street, district..." />
          </>
        )}
        {step === 3 && (
          <>
            <Select label="Service Type" value={form.type} onChange={set('type') as any}
              options={[
                { value: 'standard', label: 'Standard Delivery (IQD 3,500+)' },
                { value: 'express', label: 'Express Delivery (IQD 7,000+)' },
                { value: 'document', label: 'Document Service (IQD 2,500+)' },
                { value: 'fragile', label: 'Fragile Handling (IQD 9,000+)' },
                { value: 'bulk', label: 'Bulk / Business (IQD 12,000+)' },
              ]} />
            <Input label="Weight (kg)" type="number" step="0.1" min="0.1" value={form.weight} onChange={set('weight')} error={errors.weight} required />
            <Textarea label="Contents Description" value={form.description} onChange={set('description')} error={errors.description} rows={3}
              placeholder="Brief description of parcel contents" required />
            <Input label="Declared Value (IQD)" type="number" value={form.value} onChange={set('value')} placeholder="Optional — for insurance" />
            <Select label="Drop-off Branch" value={form.branchId} onChange={set('branchId') as any}
              options={mockBranches.filter(b => b.isActive).map(b => ({ value: b.id, label: `${b.name} — ${b.city}` }))} />
            <div className="flex flex-col gap-2 pt-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={form.insurance} onChange={set('insurance')} className="w-4 h-4 accent-blue-700" />
                <span className="text-sm text-slate-700">Add shipment insurance</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={form.isOfficial} onChange={set('isOfficial')} className="w-4 h-4 accent-blue-700" />
                <span className="text-sm text-slate-700">This is an official / government document shipment</span>
              </label>
            </div>
          </>
        )}
        {step === 4 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-700">Review Your Shipment</h3>
            {[
              { label: 'From', value: `${form.senderName} · ${form.senderCity}` },
              { label: 'To', value: `${form.receiverName} · ${form.receiverCity}, ${form.receiverCountry}` },
              { label: 'Service', value: form.type.charAt(0).toUpperCase() + form.type.slice(1) },
              { label: 'Scope', value: form.scope.charAt(0).toUpperCase() + form.scope.slice(1) },
              { label: 'Weight', value: `${form.weight} kg` },
              { label: 'Contents', value: form.description },
              { label: 'Drop-off Branch', value: mockBranches.find(b => b.id === form.branchId)?.name },
              { label: 'Insurance', value: form.insurance ? 'Yes' : 'No' },
              { label: 'Official Document', value: form.isOfficial ? 'Yes — requires verification' : 'No' },
            ].map(r => (
              <div key={r.label} className="flex items-start gap-3 py-2 border-b border-slate-100 last:border-0">
                <span className="text-xs text-slate-400 w-36 shrink-0 pt-0.5">{r.label}</span>
                <span className="text-sm text-slate-700 font-medium">{r.value}</span>
              </div>
            ))}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-2">
              <p className="text-sm text-blue-700">By confirming, you agree that the information above is accurate. Kurd Post will issue a tracking number upon confirmation.</p>
            </div>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          {step > 1 && <Button variant="outline" onClick={() => setStep(s => (s - 1) as Step)} className="flex-1">Back</Button>}
          {step < 4
            ? <Button onClick={handleNext} className="flex-1">Continue</Button>
            : <Button onClick={handleSubmit} loading={loading} icon={<Package size={16} />} className="flex-1">Confirm & Create Shipment</Button>
          }
        </div>
      </div>
    </div>
  );
}
