import { Shield, Globe, Users, Award } from 'lucide-react';

export default function About() {
  return (
    <div>
      <section className="bg-gradient-to-r from-blue-800 to-blue-700 text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">About Kurd Post</h1>
          <p className="text-blue-200 text-lg leading-relaxed">
            The official postal authority of the Kurdistan Region of Iraq — delivering trust, one parcel at a time.
          </p>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Our Mission</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Kurd Post was established to serve the citizens, businesses, and government institutions of the Kurdistan Region with a reliable,
              secure, and modern postal infrastructure. We believe that every person in Kurdistan deserves access to trustworthy delivery services.
            </p>
            <p className="text-slate-600 leading-relaxed">
              From official government documents to personal parcels and business shipments, every delivery we make is handled with the same
              standard of care, accountability, and transparency.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: <Shield size={24} />, title: 'Secure', desc: 'Every shipment is tracked and audited end-to-end.' },
              { icon: <Globe size={24} />, title: 'Connected', desc: 'Local, national, and international coverage.' },
              { icon: <Users size={24} />, title: 'Inclusive', desc: 'Serving citizens, businesses, and government equally.' },
              { icon: <Award size={24} />, title: 'Official', desc: 'Government-approved postal institution.' },
            ].map(v => (
              <div key={v.title} className="bg-white rounded-xl border border-slate-200 p-4 shadow-card">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-3">{v.icon}</div>
                <h3 className="font-semibold text-slate-800 text-sm mb-1">{v.title}</h3>
                <p className="text-xs text-slate-500">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Our History</h2>
          <div className="space-y-4">
            {[
              { year: '2012', event: 'Kurd Post established as a regional postal authority under the Kurdistan Regional Government.' },
              { year: '2015', event: 'Expansion to 4 major cities: Sulaymaniyah, Duhok, Halabja, and Zakho.' },
              { year: '2018', event: 'Launch of international shipment services through the Zakho border hub.' },
              { year: '2021', event: 'Digital transformation — online tracking portal and business API launched.' },
              { year: '2024', event: 'Launch of the Kurd Post Web System: fully integrated citizen, business, and government portals.' },
            ].map(h => (
              <div key={h.year} className="flex gap-4 items-start">
                <span className="bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg shrink-0">{h.year}</span>
                <p className="text-slate-600 text-sm leading-relaxed">{h.event}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Leadership Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { name: 'Shaswar Shali', title: 'Director General', desc: 'Leading Kurd Post since 2019 with a focus on digital modernization.' },
              { name: 'Heman Yones', title: 'Head of Operations', desc: 'Overseeing 6 branches and a fleet of 120+ delivery personnel.' },
              { name: 'Xapa Gyan', title: 'Chief Technology Officer', desc: 'Driving the digital transformation of Kurdistan\'s postal infrastructure.' },
            ].map(p => (
              <div key={p.name} className="text-center bg-white rounded-xl border border-slate-200 p-6 shadow-card">
                <div className="w-16 h-16 bg-blue-700 rounded-full flex items-center justify-center mx-auto mb-3 text-white font-bold text-xl">
                  {p.name.split(' ').map(n => n[0]).join('')}
                </div>
                <h3 className="font-semibold text-slate-800">{p.name}</h3>
                <p className="text-blue-600 text-sm">{p.title}</p>
                <p className="text-slate-400 text-xs mt-2 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
