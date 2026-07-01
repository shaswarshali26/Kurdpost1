import { Link } from 'react-router-dom';
import { Check, ArrowRight } from 'lucide-react';
import { SERVICES } from '../../data/mockData';
import Button from '../../components/ui/Button';

const details = [
  {
    id: 'standard',
    features: ['Door-to-door delivery', 'Real-time tracking', 'Delivery confirmation', 'Up to 30kg per parcel'],
    priceNote: 'Starting from IQD 3,500',
  },
  {
    id: 'express',
    features: ['Next-business-day delivery', 'Priority handling', 'Real-time tracking', 'Dedicated courier', 'Up to 20kg'],
    priceNote: 'Starting from IQD 7,000',
  },
  {
    id: 'document',
    features: ['Official document handling', 'Chain of custody record', 'Signature required', 'Audit trail', 'Government-grade security'],
    priceNote: 'Starting from IQD 2,500',
  },
  {
    id: 'fragile',
    features: ['Protective packaging', 'Handle with care labeling', 'Fragile stickers', 'Insurance included', 'Specialized vehicles'],
    priceNote: 'Starting from IQD 9,000',
  },
  {
    id: 'bulk',
    features: ['Volume-based pricing', 'Bulk manifest', 'Dedicated account manager', 'Monthly invoicing', 'API integration'],
    priceNote: 'Starting from IQD 12,000',
  },
  {
    id: 'international',
    features: ['Cross-border shipping', 'Customs clearance assistance', 'Zakho border hub', 'Insurance available', 'Multiple countries'],
    priceNote: 'Starting from IQD 25,000',
  },
];

export default function Services() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-800 to-blue-700 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-3">Postal Services</h1>
          <p className="text-blue-200 text-lg">Complete delivery solutions for citizens, businesses, and government institutions</p>
        </div>
      </section>

      {/* Services grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map(svc => {
            const det = details.find(d => d.id === svc.id)!;
            return (
              <div key={svc.id} className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden hover:shadow-panel transition-shadow">
                <div className="bg-blue-700 text-white px-6 py-5">
                  <div className="text-3xl mb-2">{svc.icon}</div>
                  <h2 className="text-lg font-bold">{svc.label}</h2>
                  <p className="text-blue-200 text-sm mt-0.5">Delivery: {svc.days} business day(s)</p>
                </div>
                <div className="p-6">
                  <p className="text-yellow-600 font-semibold text-sm mb-4">{det.priceNote}</p>
                  <ul className="space-y-2 mb-6">
                    {det.features.map(f => (
                      <li key={f} className="flex items-center gap-2 text-sm text-slate-600">
                        <Check size={14} className="text-emerald-500 shrink-0" /> {f}
                      </li>
                    ))}
                  </ul>
                  <Link to="/register">
                    <Button fullWidth variant="outline" icon={<ArrowRight size={14} />}>Get Started</Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-slate-100 px-4 text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-3">Need a custom solution?</h2>
        <p className="text-slate-500 mb-6 max-w-xl mx-auto">Contact our team for enterprise pricing, API access, or government-grade delivery agreements.</p>
        <Link to="/contact"><Button size="lg">Contact Our Team</Button></Link>
      </section>
    </div>
  );
}
