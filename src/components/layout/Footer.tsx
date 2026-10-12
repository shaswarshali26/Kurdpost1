import { Link } from 'react-router-dom';
import { Package, MapPin, Mail, Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-blue-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center">
                <Package size={20} className="text-white" />
              </div>
              <div>
                <span className="font-bold text-white text-lg">Kurd Post</span>
                <span className="block text-[10px] text-blue-300 tracking-widest uppercase">Kurdistan Region</span>
              </div>
            </div>
            <p className="text-blue-200 text-sm leading-relaxed">
              The official postal and delivery service of the Kurdistan Region of Iraq.
              Reliable, secure, and accountable.
            </p>
            <div className="mt-4 flex items-center gap-2 text-sm text-blue-300">
              <Globe size={14} />
              <span>kurdpost.krd</span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { to: '/tracking', label: 'Track Shipment' },
                { to: '/services', label: 'Our Services' },
                { to: '/branches', label: 'Find a Branch' },
                { to: '/explorer', label: 'Iraq Map Explorer' },
                { to: '/faq', label: 'FAQ' },
                { to: '/contact', label: 'Contact Us' },
              ].map(l => (
                <li key={l.to}>
                  <Link to={l.to} className="text-blue-300 hover:text-white text-sm transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Portals */}
          <div>
            <h4 className="font-semibold text-white mb-4">Portals</h4>
            <ul className="space-y-2">
              {[
                { to: '/portal', label: 'Citizen Portal' },
                { to: '/business', label: 'Business Portal' },
                { to: '/government', label: 'Government Portal' },
                { to: '/admin', label: 'Admin Panel' },
                { to: '/register', label: 'Create Account' },
              ].map(l => (
                <li key={l.to}>
                  <Link to={l.to} className="text-blue-300 hover:text-white text-sm transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-blue-200">
                <MapPin size={14} className="mt-0.5 shrink-0 text-gold-400" />
                Rizgary Quarter 412, Building 64, Sulaymaniyah, Kurdistan Region
              </li>
              <li className="flex items-center gap-2 text-sm text-blue-200">
                <Mail size={14} className="text-gold-400" />
                info@iq.email
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-blue-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-blue-400 text-sm">
            © {new Date().getFullYear()} Kurd Post — Kurdistan Region Postal Authority. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm text-blue-400">
            <Link to="/about" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/about" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
