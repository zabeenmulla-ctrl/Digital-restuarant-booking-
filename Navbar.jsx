import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  UtensilsCrossed, 
  Calendar, 
  Percent, 
  User, 
  LogOut, 
  Shield, 
  Store, 
  Bell, 
  Menu as MenuIcon, 
  X, 
  Sparkles,
  PhoneCall,
  CheckCircle2,
  MapPin,
  Crown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useBooking } from '../../context/BookingContext';

export const Navbar = ({ onOpenBookingModal, onOpenAuthModal }) => {
  const { user, logout, switchDemoRole, isAdmin, isOwner } = useAuth();
  const { notifications, markAllNotificationsAsRead } = useBooking();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Dining Zones & Tables', path: '/tables' },
    { name: 'Arabic & Mughlai Menu', path: '/menu' },
    { name: 'Royal Offers', path: '/offers' },
    { name: 'My Bookings', path: '/my-bookings' },
    { name: 'Contact & Location', path: '/contact' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-[#0b100e]/95 backdrop-blur-md border-b border-emerald-900/60 shadow-2xl transition-all">
      {/* Top Heritage Announcement Bar - Deep Emerald & Royal Gold */}
      <div className="bg-gradient-to-r from-[#022c22] via-[#064e3b] to-[#022c22] text-[#f3d77e] text-xs py-1.5 px-4 text-center flex items-center justify-center gap-3 border-b border-gold-500/30">
        <span className="flex items-center gap-1.5 font-medium">
          <Crown className="w-3.5 h-3.5 text-gold-400 shrink-0" />
          <span>Opposite the Historic <strong>Gol Gumbaz, Bijapur</strong> • Famous for Authentic <strong>BBQ Mandi & Royal Mughlai</strong> • Code <strong>GOLGUMBAZ</strong> for 20% off!</span>
        </span>
        <span className="hidden md:inline-flex items-center gap-1 text-emerald-200 border-l border-gold-500/30 pl-3 text-[11px]">
          <PhoneCall className="w-3 h-3 text-gold-400" /> +91 98450 78600
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo & Name - Royal Arch Emblem */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-800 via-emerald-950 to-emerald-900 border border-gold-500/60 flex items-center justify-center shadow-lg shadow-emerald-950/80 group-hover:border-gold-400 group-hover:scale-105 transition-all">
              <UtensilsCrossed className="w-6 h-6 text-gold-400" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-crimson-600 rounded-full border border-gold-400"></div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-royal text-2xl font-bold tracking-wider text-white group-hover:text-gold-400 transition-colors">
                  QASWA HILLS
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[9px] uppercase tracking-widest font-bold bg-gold-500/15 text-gold-400 border border-gold-500/40 rounded-full">
                  Bijapur
                </span>
              </div>
              <p className="text-[10px] text-emerald-400/90 font-sans tracking-widest uppercase flex items-center gap-1">
                <MapPin className="w-2.5 h-2.5 text-crimson-500" /> Opp. Gol Gumbaz • Arabic & Mughlai
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                  isActive(link.path)
                    ? 'text-gold-300 bg-emerald-900/40 border border-gold-500/30 shadow-inner'
                    : 'text-stone-300 hover:text-gold-300 hover:bg-emerald-950/60'
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/* Manager / Admin Shortcuts */}
            {isOwner && (
              <Link
                to="/owner/dashboard"
                className="ml-2 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-900/60 text-emerald-300 border border-emerald-500/50 hover:bg-emerald-800/80 flex items-center gap-1.5 transition-all"
              >
                <Store className="w-3.5 h-3.5 text-gold-400" /> Host Desk
              </Link>
            )}

            {isAdmin && (
              <Link
                to="/admin/dashboard"
                className="ml-2 px-3 py-1.5 rounded-xl text-xs font-semibold bg-crimson-950/80 text-crimson-300 border border-crimson-500/50 hover:bg-crimson-900/80 flex items-center gap-1.5 transition-all"
              >
                <Shield className="w-3.5 h-3.5 text-gold-400" /> Admin Portal
              </Link>
            )}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Quick Demo Role Switcher (Essential for BCA Project Viva) */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                title="Switch role for demonstration"
                className="px-2.5 py-1.5 text-xs font-medium bg-[#131b17] hover:bg-emerald-950 text-stone-200 border border-emerald-800/80 rounded-xl flex items-center gap-1.5 transition-all"
              >
                <span className="w-2 h-2 rounded-full bg-gold-400 animate-pulse"></span>
                <span className="capitalize">{user ? user.role : 'Guest'}</span>
                <span className="text-[10px] text-gold-400 font-semibold font-royal">(Role)</span>
              </button>

              {roleDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-64 bg-[#111815] border border-gold-500/30 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2"
                  onClick={() => setRoleDropdownOpen(false)}
                >
                  <p className="text-[10px] font-bold text-gold-400 uppercase tracking-widest px-2 py-1 font-royal">
                    BCA Viva Role Switcher
                  </p>
                  <div className="space-y-1 mt-1">
                    <button
                      onClick={() => switchDemoRole('customer')}
                      className={`w-full text-left px-2.5 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                        user?.role === 'customer' ? 'bg-gold-500/20 text-gold-300 font-semibold' : 'text-stone-300 hover:bg-emerald-950'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gold-400" />
                        <div>
                          <p>Customer Role</p>
                          <span className="text-[10px] text-stone-400">Book table & download invoice</span>
                        </div>
                      </div>
                      {user?.role === 'customer' && <CheckCircle2 className="w-4 h-4 text-gold-400" />}
                    </button>

                    <button
                      onClick={() => switchDemoRole('owner')}
                      className={`w-full text-left px-2.5 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                        user?.role === 'owner' ? 'bg-emerald-500/20 text-emerald-300 font-semibold' : 'text-stone-300 hover:bg-emerald-950'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Store className="w-4 h-4 text-emerald-400" />
                        <div>
                          <p>Restaurant Manager</p>
                          <span className="text-[10px] text-stone-400">QR check-in & tables</span>
                        </div>
                      </div>
                      {user?.role === 'owner' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                    </button>

                    <button
                      onClick={() => switchDemoRole('admin')}
                      className={`w-full text-left px-2.5 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                        user?.role === 'admin' ? 'bg-crimson-500/20 text-crimson-300 font-semibold' : 'text-stone-300 hover:bg-emerald-950'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-crimson-400" />
                        <div>
                          <p>Administrator</p>
                          <span className="text-[10px] text-stone-400">Revenue analytics & coupons</span>
                        </div>
                      </div>
                      {user?.role === 'admin' && <CheckCircle2 className="w-4 h-4 text-crimson-400" />}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen);
                  if (!notificationsOpen && unreadCount > 0) {
                    markAllNotificationsAsRead();
                  }
                }}
                className="p-2 text-stone-300 hover:text-gold-300 hover:bg-emerald-950 rounded-xl relative transition-colors"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-crimson-500 ring-2 ring-[#0b100e] animate-pulse"></span>
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-[#111815] border border-gold-500/30 rounded-2xl shadow-2xl p-3 z-50">
                  <div className="flex items-center justify-between border-b border-emerald-900 pb-2 mb-2">
                    <h4 className="text-xs font-semibold text-gold-300">Dining Notifications</h4>
                    <span className="text-[10px] text-stone-400">{notifications.length} alerts</span>
                  </div>
                  <div className="max-h-60 overflow-y-auto space-y-2">
                    {notifications.map((n) => (
                      <div key={n.id} className="p-2.5 bg-[#0b100e] rounded-xl border border-emerald-900/60 text-xs">
                        <p className="font-semibold text-gold-300">{n.title}</p>
                        <p className="text-stone-400 text-[11px] mt-0.5">{n.message}</p>
                        <span className="text-[10px] text-stone-500 mt-1 block">{n.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Book a Table Primary CTA - Royal Gold Gradient */}
            <button
              onClick={onOpenBookingModal}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 text-[#0b100e] hover:brightness-110 shadow-lg shadow-gold-500/20 active:scale-95 transition-all"
            >
              <Calendar className="w-4 h-4" /> Book Table
            </button>

            {/* User Profile */}
            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/my-bookings"
                  className="flex items-center gap-2 p-1.5 bg-[#131b17] border border-emerald-800/80 hover:border-gold-500/40 rounded-xl text-xs text-stone-200 transition-all"
                >
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                    alt={user.name}
                    className="w-7 h-7 rounded-full object-cover border border-gold-500/50"
                  />
                  <span className="hidden md:inline font-medium max-w-[90px] truncate">{user.name}</span>
                </Link>
                <button
                  onClick={logout}
                  title="Logout"
                  className="p-2 text-stone-400 hover:text-crimson-400 hover:bg-emerald-950 rounded-xl transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-emerald-950 hover:bg-emerald-900 text-gold-300 border border-gold-500/40 transition-colors"
              >
                Sign In
              </button>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-stone-400 hover:text-white hover:bg-emerald-950 rounded-xl"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0b100e] border-b border-emerald-900 px-4 pt-3 pb-6 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold ${
                  isActive(link.path)
                    ? 'text-gold-300 bg-emerald-900/40 border border-gold-500/30'
                    : 'text-stone-300 hover:bg-emerald-950'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="pt-2 border-t border-emerald-900 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBookingModal();
              }}
              className="w-full py-2.5 text-center font-bold text-xs uppercase tracking-wider bg-gold-500 text-[#0b100e] rounded-xl"
            >
              Reserve Table Opposite Gol Gumbaz
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
