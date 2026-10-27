import React from 'react';
import { Link } from 'react-router-dom';
import { UtensilsCrossed, MapPin, Phone, Mail, Clock, Award, ShieldCheck, Crown } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-[#0b100e] border-t border-emerald-950 text-stone-300 relative overflow-hidden">
      {/* Subtle Islamic Motif Top Border Accent */}
      <div className="h-1 bg-gradient-to-r from-emerald-800 via-gold-500 to-crimson-800"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Col 1: Brand & Historic Bijapur Location */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-800 to-emerald-950 border border-gold-500/50 flex items-center justify-center">
                <Crown className="w-6 h-6 text-gold-400" />
              </div>
              <div>
                <span className="font-royal text-xl font-bold tracking-wider text-white">
                  QASWA HILLS
                </span>
                <p className="text-[10px] text-gold-400 font-sans tracking-widest uppercase">
                  Royal Arabic & Mughlai • Bijapur
                </p>
              </div>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              Vijayapura's premier culinary destination opposite the historic Gol Gumbaz. Celebrated for our underground wood-fired BBQ Mandi, royal Adil Shahi biryani, traditional Arabic Majlis cabins, and sunset dome terrace views.
            </p>
            <div className="flex items-center gap-2 text-xs text-gold-400 font-semibold">
              <Award className="w-4 h-4 text-gold-500" />
              <span>Rated 4.9/5 by 240+ Bijapur Fine Dining Patrons</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-gold-300 uppercase tracking-widest font-royal">
              Dining Pavilions
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="hover:text-gold-400 transition-colors">Home Experience</Link>
              </li>
              <li>
                <Link to="/tables" className="hover:text-gold-400 transition-colors">Gol Gumbaz View Terrace</Link>
              </li>
              <li>
                <Link to="/tables" className="hover:text-gold-400 transition-colors">Royal Arabic Majlis Cabins</Link>
              </li>
              <li>
                <Link to="/menu" className="hover:text-gold-400 transition-colors">BBQ Mandi & Tandoori Menu</Link>
              </li>
              <li>
                <Link to="/offers" className="hover:text-gold-400 transition-colors">Special Promos & Vouchers</Link>
              </li>
              <li>
                <Link to="/my-bookings" className="hover:text-gold-400 transition-colors">My Reservations & Invoices</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Timings */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-gold-300 uppercase tracking-widest font-royal">
              Dining Hours
            </h4>
            <div className="space-y-2.5 text-xs text-stone-400">
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-gold-400 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-stone-200">Lunch & Afternoon Mandi:</p>
                  <p>11:30 AM – 03:30 PM (All 7 Days)</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-gold-400 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-stone-200">Gol Gumbaz Night View & Dinner:</p>
                  <p>06:30 PM – 11:30 PM (Daily)</p>
                </div>
              </div>
              <div className="p-2.5 bg-[#121915] rounded-xl border border-emerald-900/60 text-[11px] text-stone-400">
                <span className="text-gold-400 font-semibold">Tip:</span> Pre-book Majlis cabins & Terrace tables between 7 PM - 9 PM during Gol Gumbaz monument illumination.
              </div>
            </div>
          </div>

          {/* Col 4: Bijapur Landmark Location */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-gold-300 uppercase tracking-widest font-royal">
              Bijapur Landmark
            </h4>
            <div className="space-y-2 text-xs text-stone-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-crimson-400 mt-0.5 shrink-0" />
                <p>Opposite Historic Gol Gumbaz, Station Road, Vijayapura (Bijapur), Karnataka 586101</p>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gold-400 shrink-0" />
                <p>+91 98450 78600 / +91 8352 250000</p>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gold-400 shrink-0" />
                <p>reservations@qaswahills.com</p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium pt-1">
                <ShieldCheck className="w-4 h-4" /> 100% Halal Certified Gourmet Dining
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Project Accreditation & Copyright */}
        <div className="mt-12 pt-8 border-t border-emerald-950 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div>
            <p>© {new Date().getFullYear()} Qaswa Hills Restaurant, Vijayapura (Bijapur). All Rights Reserved.</p>
            <p className="text-[11px] text-stone-400 mt-0.5">
              BCA Final Year Major Project: <span className="text-gold-400 font-medium">Hotel Table Booking, Digital Payment & Smart Restaurant Management System</span>
            </p>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-stone-400">
            <span>Bijapur, Karnataka</span>
            <span>•</span>
            <span>Opp. Gol Gumbaz</span>
            <span>•</span>
            <span>Arabic & Mughlai Cuisine</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
