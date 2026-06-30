import { Link } from 'react-router-dom';
import { Phone, Hospital, Pill, Droplets, MapPin, AlertTriangle, ShieldCheck, HeartPulse } from 'lucide-react';
import { HELPLINES } from '../constants';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-emergency-50 border-b border-emergency-100 relative overflow-hidden">
        {/* Abstract background shapes */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emergency-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse"></div>
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-safe-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>

        <div className="page-container py-16 md:py-24 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emergency-100 text-emergency-700 text-sm font-semibold mb-6">
              <span className="w-2 h-2 rounded-full bg-emergency-600 animate-ping"></span>
              24/7 Emergency Assistance Platform
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-ink leading-tight mb-6 tracking-tight">
              Rapid Help When <br />
              <span className="text-emergency-600">Every Second Counts.</span>
            </h1>
            <p className="text-lg md:text-xl text-subtle mb-10 max-w-2xl leading-relaxed text-balance">
              RAHAT connects you instantly to nearby hospitals, pharmacies, blood donors, and your emergency contacts during a crisis in India.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/sos" className="no-underline">
                <Button variant="danger" size="xl" icon={AlertTriangle} className="w-full sm:w-auto shadow-lg shadow-emergency-200 animate-pulse-red">
                  Activate SOS
                </Button>
              </Link>
              <Link to="/hospitals" className="no-underline">
                <Button variant="secondary" size="xl" icon={Hospital} className="w-full sm:w-auto font-semibold">
                  Find Hospitals
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Helplines Strip */}
      <section className="bg-ink text-white py-6">
        <div className="page-container">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h3 className="font-bold text-slate-300 flex items-center gap-2 shrink-0">
              <Phone size={18} /> Direct Emergency Lines:
            </h3>
            <div className="flex flex-wrap gap-x-8 gap-y-2 flex-grow">
              {HELPLINES.slice(0, 4).map((h) => (
                <a key={h.number} href={`tel:${h.number}`} className="flex items-center gap-2 group no-underline">
                  <span className="text-xl font-black text-emergency-500 group-hover:text-emergency-400 transition-colors">{h.number}</span>
                  <span className="text-sm font-medium text-slate-400 group-hover:text-white transition-colors">{h.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Quick Services */}
      <section className="py-16 md:py-24 bg-white">
        <div className="page-container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">Essential Services</h2>
            <p className="text-subtle text-lg">Access critical healthcare resources quickly. Built specifically for Indian infrastructure and addresses.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ServiceCard 
              to="/hospitals" 
              icon={Hospital} 
              color="text-blue-600" 
              bg="bg-blue-50"
              title="Nearby Hospitals" 
              desc="Locate government and private hospitals near you with directions." 
            />
            <ServiceCard 
              to="/pharmacies" 
              icon={Pill} 
              color="text-safe-600" 
              bg="bg-safe-50"
              title="24/7 Pharmacies" 
              desc="Find medical stores that are open right now in your area." 
            />
            <ServiceCard 
              to="/blood" 
              icon={Droplets} 
              color="text-emergency-600" 
              bg="bg-emergency-50"
              title="Blood Donors" 
              desc="Search for specific blood groups or register yourself as a donor." 
            />
            <ServiceCard 
              to="/medical-profile" 
              icon={HeartPulse} 
              color="text-purple-600" 
              bg="bg-purple-50"
              title="Medical Profile" 
              desc="Store your allergies, conditions, and emergency medical data securely." 
            />
          </div>
        </div>
      </section>

      {/* SOS Feature Highlight */}
      <section className="py-16 md:py-24 bg-slate-50 border-y border-border">
        <div className="page-container">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
            <div className="flex-1 order-2 lg:order-1">
              <div className="relative w-full max-w-md mx-auto aspect-square bg-white rounded-3xl shadow-2xl border 8 flex items-center justify-center p-8 border-slate-100">
                {/* Decorative pulse rings */}
                <div className="absolute inset-0 rounded-3xl border-2 border-emergency-100 animate-ping opacity-20"></div>
                <div className="absolute inset-4 rounded-3xl border-2 border-emergency-200 animate-ping opacity-40 animation-delay-500"></div>
                
                <button className="w-48 h-48 bg-emergency-600 rounded-full shadow-2xl flex flex-col items-center justify-center text-white transform hover:scale-105 transition-transform duration-300 z-10 cursor-default">
                  <AlertTriangle size={48} className="mb-2" />
                  <span className="text-2xl font-black tracking-widest">SOS</span>
                </button>
              </div>
            </div>
            
            <div className="flex-1 order-1 lg:order-2">
              <h2 className="text-3xl font-bold mb-6">How the SOS System Works</h2>
              <div className="space-y-6">
                <FeatureRow icon={MapPin} title="Live Location Sharing" desc="Instantly captures your precise GPS coordinates and generates a map link." />
                <FeatureRow icon={ShieldCheck} title="Alert Emergency Contacts" desc="Automatically emails your pre-saved emergency contacts with your location and details." />
                <FeatureRow icon={Hospital} title="Find Nearest Help" desc="Immediately displays the 5 closest hospitals with routing information." />
              </div>
              <div className="mt-8 pt-8 border-t border-border">
                <Link to="/signup" className="no-underline">
                  <Button variant="primary" size="lg">Create Your Free Account Now</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ServiceCard({ to, icon: Icon, color, bg, title, desc }) {
  return (
    <Link to={to} className="block no-underline group h-full">
      <Card hover className="h-full border-t-4 border-t-transparent group-hover:border-t-emergency-500 transition-all duration-300">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${bg} ${color}`}>
          <Icon size={24} />
        </div>
        <h3 className="text-xl font-bold text-ink mb-2 group-hover:text-emergency-600 transition-colors">{title}</h3>
        <p className="text-subtle text-sm leading-relaxed">{desc}</p>
      </Card>
    </Link>
  );
}

function FeatureRow({ icon: Icon, title, desc }) {
  return (
    <div className="flex gap-4">
      <div className="shrink-0 mt-1">
        <div className="w-10 h-10 rounded-full bg-emergency-100 text-emergency-600 flex items-center justify-center">
          <Icon size={20} />
        </div>
      </div>
      <div>
        <h4 className="text-lg font-bold text-ink mb-1">{title}</h4>
        <p className="text-subtle">{desc}</p>
      </div>
    </div>
  );
}
