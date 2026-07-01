import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

const faqs = [
  { q: 'How do I track my shipment?', a: 'Visit our Tracking page and enter your tracking number (format: KP-YYYY-XXXXXX). You can also sign in to your portal to see all your shipments.' },
  { q: 'What are the supported shipment types?', a: 'We offer Standard, Express, Document, Fragile, Bulk, and International shipping. Each service has its own pricing and estimated delivery timeframe.' },
  { q: 'How long does delivery take?', a: 'Standard delivery takes 2–4 business days nationally. Express is next-day. Local (within city) is same-day for express. International varies from 5–14 days.' },
  { q: 'Can I send official government documents?', a: 'Yes. Kurd Post has a dedicated government/document workflow. Official shipments require sender and receiver verification and include a full audit trail.' },
  { q: 'What happens if my shipment is delayed?', a: 'You will receive a status update marked "Delayed" with a reason. Our team will proactively contact you. You can also open a support ticket via your portal.' },
  { q: 'Can businesses create bulk shipment uploads?', a: 'Yes. Business accounts have access to a Bulk Upload feature in the Business Portal, allowing you to upload multiple shipments at once via CSV.' },
  { q: 'Is insurance available for shipments?', a: 'Yes. You can add insurance during shipment creation in the portal. Insurance covers declared value up to IQD 1,000,000 per parcel.' },
  { q: 'How do I open a business account?', a: 'Register an account and select "Business" as your account type. You will need to provide your company name and registration number.' },
  { q: 'What cities do you currently serve?', a: 'We currently serve Sulaymaniyah, Duhok, Halabja, Zakho, Koya, Ranya, Soran, Chamchamal, and more. International routes include Turkey, Germany, and UAE.' },
  { q: 'Can I integrate Kurd Post with my software system?', a: 'Yes. We offer an API for business customers. Contact enterprise@kurdpost.krd for API access and documentation.' },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <button onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-5 py-4 text-left bg-white hover:bg-slate-50 transition-colors">
        <span className="font-medium text-slate-800 text-sm pr-4">{q}</span>
        <ChevronDown size={18} className={`text-slate-400 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="px-5 py-4 bg-slate-50 border-t border-slate-200">
          <p className="text-sm text-slate-600 leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

export default function FAQ() {
  return (
    <div>
      <section className="bg-gradient-to-r from-blue-800 to-blue-700 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-3">Frequently Asked Questions</h1>
          <p className="text-blue-200 text-lg">Everything you need to know about Kurd Post services</p>
        </div>
      </section>
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
        <div className="space-y-3">
          {faqs.map(f => <FAQItem key={f.q} q={f.q} a={f.a} />)}
        </div>
        <div className="mt-10 text-center bg-blue-50 border border-blue-200 rounded-2xl p-8">
          <h3 className="font-semibold text-slate-800 mb-2">Still have questions?</h3>
          <p className="text-slate-500 text-sm mb-4">Our support team is available Sunday–Thursday, 08:00–17:00.</p>
          <Link to="/contact" className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors">
            Contact Support
          </Link>
        </div>
      </section>
    </div>
  );
}
