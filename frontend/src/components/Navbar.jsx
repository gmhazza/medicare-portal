import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  X, 
  Calendar, 
  MessageSquare, 
  Phone, 
  User, 
  LayoutDashboard, 
  LogOut, 
  ChevronDown, 
  Info, 
  Home as HomeIcon,
  Bot,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

const Navbar = () => {
  const { user, role, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    setSidebarOpen(false);
    setDropdownOpen(false);
    window.dispatchEvent(new CustomEvent('page-transition', { detail: { to: '/' } }));
  };

  // Close menus on route change
  useEffect(() => {
    setSidebarOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  // Handle ESC key to close sidebar
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSidebarOpen(false);
        setDropdownOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Prevent background scroll when sidebar is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [sidebarOpen]);

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { name: 'Home', path: '/home', icon: HomeIcon },
    { name: 'About Us', path: '/about', icon: Info },
    { name: 'Book Appointment', path: '/book', icon: Calendar },
    { name: 'AI Health Assistant', path: '/chat', icon: Bot },
    { name: 'Contact Us', path: '/contact', icon: Phone },
  ];

  if (user && role === 'user') {
    navLinks.push({ name: 'Submit Feedback', path: '/feedback', icon: MessageSquare });
  }

  const getDashboardPath = () => {
    if (role === 'admin') return '/dashboard/admin';
    if (role === 'doctor') return '/dashboard/doctor';
    return '/dashboard/patient';
  };

  return (
    <>
      {/* SVG ClipPath Definition for the Curved Arch Navbar */}
      <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
        <defs>
          <clipPath id="navbarArchClip" clipPathUnits="objectBoundingBox">
            <path d="M 0,0 L 1,0 L 1,1 Q 0.5,0.45 0,1 Z" />
          </clipPath>
        </defs>
      </svg>

      {/* Sticky Curved Navbar with Arch Cutout matching reference */}
      <header className="sticky top-0 z-40 w-full select-none">
        <div className="relative w-full h-[90px] sm:h-[104px] md:h-[116px] transition-all duration-300">
          
          {/* Curved Arch Glassmorphism Background (Clipped exactly to Arch shape) */}
          <div 
            className={`absolute inset-0 transition-all duration-500 pointer-events-none drop-shadow-md ${
              scrolled 
                ? 'backdrop-blur-md bg-black/35 backdrop-saturate-150' 
                : 'bg-black'
            }`}
            style={{
              clipPath: 'url(#navbarArchClip)',
              WebkitClipPath: 'url(#navbarArchClip)',
            }}
          />

          {/* Nav Items Bar: Left, Center, Right spanning full screen width */}
          <div className="relative w-full h-full px-4 sm:px-8 md:px-12 flex items-center justify-between z-10">
            
            {/* Left: Minimalist 2-line Teal Burger Menu Button */}
            <div className="flex items-center justify-start shrink-0">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="group flex flex-col justify-center items-start gap-[5.5px] sm:gap-[7px] p-2 sm:p-2.5 rounded-xl hover:bg-white/10 transition-all duration-300 cursor-pointer focus:outline-none"
                aria-label="Open Navigation Menu"
              >
                <span className="w-8 sm:w-9 h-[3px] bg-[#00d2b4] group-hover:w-10 transition-all duration-300 rounded-full shadow-[0_0_8px_rgba(0,210,180,0.6)]"></span>
                <span className="w-6 sm:w-7 h-[3px] bg-[#00d2b4] group-hover:w-10 transition-all duration-300 rounded-full shadow-[0_0_8px_rgba(0,210,180,0.6)]"></span>
              </button>
            </div>

            {/* Center: Curved Upward Bold Nunito MEDICARE Typography (Enlarged) */}
            <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-[54%] flex items-center justify-center pointer-events-auto">
              <Link 
                to="/home" 
                className="group flex items-center justify-center select-none transition-transform duration-300 hover:scale-105"
              >
                <svg 
                  viewBox="0 0 420 58" 
                  className="w-56 sm:w-72 md:w-84 lg:w-96 h-10 sm:h-12 md:h-14 overflow-visible"
                >
                  <defs>
                    {/* Upward crest arch path matching the upward bottom curve */}
                    <path id="medicareUpwardArc" d="M 10 42 Q 210 20 410 42" />
                  </defs>
                  <text 
                    className="font-['Nunito'] font-black fill-white tracking-[0.32em] text-[26px] sm:text-[31px] md:text-[34px] drop-shadow-lg group-hover:fill-teal-300 transition-colors duration-300"
                    style={{ textAnchor: 'middle', fontWeight: 900 }}
                  >
                    <textPath href="#medicareUpwardArc" startOffset="50%">
                      MEDICARE
                    </textPath>
                  </text>
                </svg>
              </Link>
            </div>

            {/* Right: User Profile or Cyan Teal Sign In Button (Redirects to Welcome Page if guest) */}
            <div className="flex items-center justify-end shrink-0">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    onBlur={() => setTimeout(() => setDropdownOpen(false), 200)}
                    className="flex items-center gap-2 sm:gap-2.5 px-2 sm:px-3 py-1.5 rounded-full hover:bg-white/10 transition-all cursor-pointer focus:outline-none"
                  >
                    <img
                      src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=00d2b4&color=000000`}
                      alt={user.name}
                      className="w-8 h-8 md:w-9 md:h-9 rounded-full border-2 border-[#00d2b4] object-cover shadow-[0_0_10px_rgba(0,210,180,0.3)]"
                    />
                    <div className="text-left hidden md:block">
                      <p className="text-xs font-bold leading-tight text-white max-w-[100px] truncate">{user.name}</p>
                      <span className="text-[10px] text-[#00d2b4] capitalize font-medium">{role}</span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </button>

                  {/* Dropdown Menu */}
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-3 w-56 bg-[#0c141a] rounded-2xl shadow-2xl border border-white/10 py-2.5 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                      <div className="px-4 py-2.5 border-b border-white/10">
                        <p className="text-[11px] text-slate-400">Signed in as</p>
                        <p className="text-sm font-bold text-white truncate">{user.name}</p>
                        <span className="inline-block bg-teal-950/80 border border-teal-500/30 text-[10px] text-[#00d2b4] font-semibold px-2 py-0.5 rounded-full mt-1.5 capitalize">
                          {role}
                        </span>
                      </div>

                      <Link
                        to={getDashboardPath()}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-white/5 hover:text-[#00d2b4] transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-[#00d2b4]" />
                        My Dashboard
                      </Link>

                      {role === 'user' && (
                        <Link
                          to="/feedback"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-white/5 hover:text-[#00d2b4] transition-colors"
                        >
                          <MessageSquare className="w-4 h-4 text-[#00d2b4]" />
                          Submit Feedback
                        </Link>
                      )}

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-400 hover:bg-rose-500/10 transition-colors text-left cursor-pointer border-t border-white/5 mt-1"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/"
                  className="flex items-center justify-center px-5 sm:px-7 py-1.5 sm:py-2 bg-[#00d2b4] hover:bg-[#00baa0] text-[#080d11] font-['Nunito'] font-extrabold text-xs sm:text-sm rounded-full transition-all duration-300 shadow-[0_0_15px_rgba(0,210,180,0.4)] hover:shadow-[0_0_20px_rgba(0,210,180,0.6)] hover:scale-105 active:scale-95"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Left Full-Height Slide-Out Navigation Drawer */}
      <div 
        className={`fixed inset-0 z-50 transition-visibility duration-400 ${
          sidebarOpen ? 'visible' : 'invisible pointer-events-none'
        }`}
      >
        {/* Backdrop Overlay */}
        <div 
          onClick={() => setSidebarOpen(false)}
          className={`fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-400 ease-out ${
            sidebarOpen ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Sidebar Container */}
        <div 
          className={`fixed top-0 left-0 bottom-0 w-[310px] sm:w-[360px] bg-[#090f14] text-white flex flex-col justify-between shadow-2xl border-r border-white/10 transform transition-transform duration-400 cubic-bezier(0.16, 1, 0.3, 1) z-50 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Top Section: Drawer Header */}
          <div>
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-[#060b0e]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-[#00d2b4]/40 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-[#00d2b4]" />
                </div>
                <div>
                  <h2 className="font-['Nunito'] font-black tracking-wider text-lg text-white leading-none">
                    MEDICARE
                  </h2>
                  <p className="text-[11px] text-[#00d2b4] mt-1 font-medium">Healthcare Portal</p>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer focus:outline-none"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Links */}
            <div className="px-4 py-6 space-y-1.5 overflow-y-auto max-h-[calc(100vh-250px)]">
              <p className="px-3 text-[11px] uppercase tracking-widest text-slate-500 font-bold mb-3">Navigation</p>
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group ${
                      active
                        ? 'bg-[#00d2b4] text-[#080d11] shadow-[0_0_15px_rgba(0,210,180,0.3)]'
                        : 'text-slate-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      {Icon && (
                        <Icon className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${
                          active ? 'text-[#080d11]' : 'text-[#00d2b4]'
                        }`} />
                      )}
                      <span>{link.name}</span>
                    </div>
                    <ChevronRight className={`w-4 h-4 opacity-50 group-hover:translate-x-1 transition-all ${
                      active ? 'text-[#080d11] opacity-100' : ''
                    }`} />
                  </Link>
                );
              })}

              {/* Logged in Dashboard quick link inside navigation list */}
              {user && (
                <Link
                  to={getDashboardPath()}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group ${
                    isActive(getDashboardPath())
                      ? 'bg-[#00d2b4] text-[#080d11] shadow-[0_0_15px_rgba(0,210,180,0.3)]'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <LayoutDashboard className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${
                      isActive(getDashboardPath()) ? 'text-[#080d11]' : 'text-[#00d2b4]'
                    }`} />
                    <span>My Dashboard</span>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-50 group-hover:translate-x-1 transition-all" />
                </Link>
              )}
            </div>
          </div>

          {/* Bottom Section: Pinned User Profile (or Sign In button if guest) */}
          <div className="p-4 border-t border-white/10 bg-[#060b0e]">
            {user ? (
              <div className="space-y-3">
                {/* User card info */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="relative shrink-0">
                      <img
                        src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=00d2b4&color=000000`}
                        alt={user.name}
                        className="w-10 h-10 rounded-full border border-[#00d2b4] object-cover"
                      />
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[#060b0e]"></span>
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-sm font-bold text-white truncate">{user.name}</p>
                      <p className="text-[11px] text-slate-400 capitalize">{role} Account</p>
                    </div>
                  </div>
                </div>

                {/* Bottom Sign Out Button */}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-sm font-semibold transition-all duration-200 border border-rose-500/20 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Link
                  to="/"
                  onClick={() => setSidebarOpen(false)}
                  className="w-full py-3 bg-[#00d2b4] hover:bg-[#00baa0] text-[#080d11] rounded-xl font-['Nunito'] font-extrabold text-sm flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(0,210,180,0.3)] transition-all"
                >
                  <User className="w-4 h-4" />
                  Sign In / Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;


