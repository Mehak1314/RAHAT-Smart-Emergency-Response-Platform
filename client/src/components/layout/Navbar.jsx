import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';
import {
  Home, Hospital, Pill, Droplets, User, Phone, AlertTriangle,
  LogOut, Menu, X, ChevronDown, LayoutDashboard, ShieldCheck,
} from 'lucide-react';

const navLinks = [
  { to: '/hospitals', label: 'Hospitals', icon: Hospital },
  { to: '/pharmacies', label: 'Pharmacies', icon: Pill },
  { to: '/blood', label: 'Blood Donation', icon: Droplets },
];

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
    setProfileOpen(false);
  };

  return (
    <nav className="sticky top-0 z-40 bg-white border-b border-border shadow-card">
      <div className="page-container">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 no-underline text-ink hover:text-ink">
            <div className="w-8 h-8 bg-emergency-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            <div>
              <span className="font-bold text-base text-ink">RAHAT</span>
              <span className="hidden sm:inline text-xs text-muted ml-1">Emergency Platform</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md transition-colors ${
                  isActive ? 'bg-emergency-50 text-emergency-700 font-medium' : 'text-subtle hover:text-ink hover:bg-slate-50'
                }`
              }
            >
              <Home size={15} />
              Home
            </NavLink>
            {navLinks.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md transition-colors ${
                    isActive ? 'bg-emergency-50 text-emergency-700 font-medium' : 'text-subtle hover:text-ink hover:bg-slate-50'
                  }`
                }
              >
                <Icon size={15} />
                {label}
              </NavLink>
            ))}
          </div>

          {/* Right section */}
          <div className="flex items-center gap-2">
            {/* Emergency 112 badge */}
            <a
              href="tel:112"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-emergency-600 text-white text-xs font-bold rounded-md hover:bg-emergency-700 transition-colors no-underline"
            >
              <Phone size={13} />
              112
            </a>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  id="navbar-profile-btn"
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-slate-50 transition-colors"
                >
                  <div className="avatar-sm bg-emergency-100 text-emergency-700 font-semibold">
                    {user?.profilePhoto ? (
                      <img src={user.profilePhoto} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      user?.name?.charAt(0).toUpperCase()
                    )}
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-ink max-w-[100px] truncate">
                    {user?.name?.split(' ')[0]}
                  </span>
                  <ChevronDown size={14} className="text-muted" />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-1 w-52 bg-white border border-border rounded-lg shadow-card-md py-1 z-50 animate-slide-up">
                    <div className="px-3 py-2 border-b border-border">
                      <p className="text-sm font-medium text-ink truncate">{user?.name}</p>
                      <p className="text-xs text-muted truncate">{user?.email}</p>
                    </div>

                    <NavMenuItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" onClick={() => setProfileOpen(false)} />
                    <NavMenuItem to="/profile" icon={User} label="My Profile" onClick={() => setProfileOpen(false)} />
                    <NavMenuItem to="/emergency-contacts" icon={Phone} label="Emergency Contacts" onClick={() => setProfileOpen(false)} />
                    <NavMenuItem to="/sos" icon={AlertTriangle} label="SOS" onClick={() => setProfileOpen(false)} />
                    {user?.role === 'admin' && (
                      <NavMenuItem to="/admin" icon={ShieldCheck} label="Admin Panel" onClick={() => setProfileOpen(false)} />
                    )}
                    <div className="border-t border-border mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-emergency-600 hover:bg-emergency-50 transition-colors"
                      >
                        <LogOut size={15} />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-ghost btn-sm no-underline text-ink">Login</Link>
                <Link to="/signup" className="btn-primary btn-sm no-underline text-white">Sign Up</Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-1.5 rounded-md hover:bg-slate-50 text-ink"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border py-2 animate-slide-up">
            <MobileNavLink to="/" label="Home" icon={Home} onClick={() => setMobileOpen(false)} />
            {navLinks.map(({ to, label, icon }) => (
              <MobileNavLink key={to} to={to} label={label} icon={icon} onClick={() => setMobileOpen(false)} />
            ))}
            {isAuthenticated && (
              <>
                <MobileNavLink to="/dashboard" label="Dashboard" icon={LayoutDashboard} onClick={() => setMobileOpen(false)} />
                <MobileNavLink to="/emergency-contacts" label="Emergency Contacts" icon={Phone} onClick={() => setMobileOpen(false)} />
                <MobileNavLink to="/sos" label="SOS Emergency" icon={AlertTriangle} onClick={() => setMobileOpen(false)} />
              </>
            )}
            <div className="pt-2 mt-2 border-t border-border">
              <a href="tel:112" className="flex items-center gap-2 px-4 py-2 text-emergency-600 font-bold text-sm">
                <Phone size={15} /> Call 112 — Emergency
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

function NavMenuItem({ to, icon: Icon, label, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-2 text-sm text-ink hover:bg-slate-50 transition-colors no-underline"
    >
      <Icon size={15} className="text-muted" />
      {label}
    </NavLink>
  );
}

function MobileNavLink({ to, label, icon: Icon, onClick }) {
  return (
    <NavLink
      to={to}
      end={to === '/'}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-2 px-4 py-2.5 text-sm transition-colors no-underline ${
          isActive ? 'text-emergency-700 bg-emergency-50 font-medium' : 'text-ink hover:bg-slate-50'
        }`
      }
    >
      <Icon size={16} />
      {label}
    </NavLink>
  );
}
