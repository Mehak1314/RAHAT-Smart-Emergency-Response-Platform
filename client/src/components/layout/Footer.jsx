import { Link } from 'react-router-dom';
import { Phone, Heart } from 'lucide-react';
import { HELPLINES } from '../../constants';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-border mt-auto">
      <div className="page-container py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-emergency-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-xs">R</span>
              </div>
              <span className="font-bold text-ink">RAHAT</span>
            </div>
            <p className="text-sm text-subtle leading-relaxed">
              Emergency assistance platform built for India. Available 24/7.
            </p>
            <p className="text-xs text-muted mt-3">
              In any emergency, call <a href="tel:112" className="text-emergency-600 font-bold">112</a>
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-sm font-semibold text-ink mb-3">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { to: '/hospitals', label: 'Find Hospitals' },
                { to: '/pharmacies', label: 'Find Pharmacies' },
                { to: '/blood', label: 'Blood Donation' },
                { to: '/sos', label: 'SOS Emergency' },
                { to: '/about', label: 'About RAHAT' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-sm text-subtle hover:text-emergency-600 no-underline transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Emergency numbers */}
          <div>
            <h3 className="text-sm font-semibold text-ink mb-3">Emergency Numbers</h3>
            <ul className="space-y-1.5">
              {HELPLINES.slice(0, 6).map((h) => (
                <li key={h.number}>
                  <a
                    href={`tel:${h.number}`}
                    className="flex items-center gap-2 text-sm no-underline group"
                  >
                    <span className="font-bold text-emergency-600 group-hover:text-emergency-700 w-24">
                      {h.number}
                    </span>
                    <span className="text-subtle group-hover:text-ink transition-colors">{h.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="text-sm font-semibold text-ink mb-3">Account</h3>
            <ul className="space-y-2">
              {[
                { to: '/login', label: 'Login' },
                { to: '/signup', label: 'Create Account' },
                { to: '/dashboard', label: 'Dashboard' },
                { to: '/medical-profile', label: 'Medical Profile' },
                { to: '/emergency-contacts', label: 'Emergency Contacts' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-sm text-subtle hover:text-emergency-600 no-underline transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-6 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} RAHAT. Built for India 🇮🇳
          </p>
          <p className="text-xs text-muted flex items-center gap-1">
            Made with <Heart size={11} className="text-emergency-500" /> for emergency response
          </p>
        </div>
      </div>
    </footer>
  );
}
