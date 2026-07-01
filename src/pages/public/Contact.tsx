import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from 'lucide-react';
import Button from '../../components/ui/Button';
import { Input, Textarea } from '../../components/ui/Input';

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setSent(true);
    setLoading(false);
  };

  return (
    <div>
      <section className="bg-gradient-to-r from-blue-800 to-blue-700 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-3">Contact Us</h1>
          <p className="text-blue-200 text-lg">We're here to assist. Reach our team by phone, email, or visit any branch.</p>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Form */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-8">
            <h2 className="text-xl font-bold text-slate-800 mb-6">Send a Message</h2>
            {sent ? (
              <div className="text-center py-8">
                <CheckCircle2 size={48} className="text-emerald-500 mx-auto mb-4" />
                <h3 className="font-semibold text-slate-800 mb-2">Message Sent!</h3>
                <p className="text-slate-500 text-sm">Thank you for contacting Kurd Post. Our team will respond within 1–2 business days.</p>
                <button onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
                  className="mt-4 text-blue-600 text-sm hover:underline">Send another message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input label="Full Name" placeholder="Your full name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
                <Input label="Email Address" type="email" placeholder="your@email.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
                <Input label="Subject" placeholder="How can we help?" value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} required />
                <Textarea label="Message" placeholder="Describe your inquiry..." rows={5} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} required />
                <Button type="submit" fullWidth loading={loading} icon={<Send size={16} />}>Send Message</Button>
              </form>
            )}
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-4">Get in Touch</h2>
              {[
                { icon: <Phone size={18} />, label: 'Main Line', value: '+964 66 123 4567' },
                { icon: <Mail size={18} />, label: 'Email', value: 'info@kurdpost.krd' },
                { icon: <MapPin size={18} />, label: 'Head Office', value: 'Rizgary Quarter 412, Building 64, Sulaymaniyah, Iraq' },
                { icon: <Clock size={18} />, label: 'Working Hours', value: 'Sunday–Thursday, 08:00–17:00' },
              ].map(c => (
                <div key={c.label} className="flex items-start gap-4 py-3 border-b border-slate-100 last:border-0">
                  <div className="w-9 h-9 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center shrink-0">{c.icon}</div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium">{c.label}</p>
                    <p className="text-slate-700 text-sm mt-0.5">{c.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
              <h3 className="font-semibold text-amber-800 mb-2">For Urgent Shipment Issues</h3>
              <p className="text-amber-700 text-sm leading-relaxed">
                If you have an urgent issue with an active shipment, please call our 24/7 hotline at <strong>+964 66 123 9999</strong> or visit your nearest branch directly.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
              <h3 className="font-semibold text-blue-800 mb-2">Government & Business Inquiries</h3>
              <p className="text-blue-700 text-sm leading-relaxed">
                For institutional accounts, API access, or government agreements, please email <strong>enterprise@kurdpost.krd</strong>.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
