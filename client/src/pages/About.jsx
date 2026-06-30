import { Link } from 'react-router-dom';
import { ShieldCheck, Heart, Users, Map, Clock } from 'lucide-react';
import Card from '../components/common/Card';

export default function About() {
  return (
    <div className="page-container py-12 max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-ink mb-4">About RAHAT</h1>
        <p className="text-xl text-subtle max-w-2xl mx-auto">
          Built for India. Designed for emergencies. RAHAT is a comprehensive platform connecting you to life-saving resources when every second counts.
        </p>
      </div>

      <div className="space-y-12">
        <section>
          <h2 className="text-2xl font-bold mb-6 text-center">Our Core Pillars</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FeatureCard 
              icon={Clock} 
              title="Speed & Reliability" 
              desc="In an emergency, delays are fatal. RAHAT is optimized for speed, ensuring SOS triggers and resource searches happen instantly, even on slower networks." 
            />
            <FeatureCard 
              icon={Map} 
              title="Hyper-Local" 
              desc="Using advanced geospatial indexing, we find the absolute closest hospitals, 24/7 pharmacies, and active blood donors to your exact GPS coordinates." 
            />
            <FeatureCard 
              icon={Users} 
              title="Community Driven" 
              desc="Our blood donation network relies on community members volunteering to help others in their city during times of critical need." 
            />
            <FeatureCard 
              icon={ShieldCheck} 
              title="Data Privacy" 
              desc="Your medical profile and emergency contacts are encrypted and securely stored. We only share this data when you explicitly trigger an SOS." 
            />
          </div>
        </section>

        <section className="bg-slate-50 p-8 rounded-2xl border border-slate-100 text-center">
          <Heart size={40} className="mx-auto text-emergency-500 mb-4" />
          <h2 className="text-2xl font-bold mb-3">Our Mission</h2>
          <p className="text-lg text-subtle leading-relaxed mb-6">
            To drastically reduce emergency response times in India by creating a centralized, accessible, and reliable digital infrastructure for critical care coordination.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/signup" className="btn btn-primary btn-lg no-underline text-white">Join the Network</Link>
          </div>
        </section>
      </div>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc }) {
  return (
    <Card className="flex gap-4 p-6 border-transparent hover:border-emergency-200 transition-colors">
      <div className="shrink-0 mt-1">
        <div className="w-12 h-12 rounded-full bg-emergency-50 text-emergency-600 flex items-center justify-center">
          <Icon size={24} />
        </div>
      </div>
      <div>
        <h3 className="text-xl font-bold text-ink mb-2">{title}</h3>
        <p className="text-subtle leading-relaxed">{desc}</p>
      </div>
    </Card>
  );
}
