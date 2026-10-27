import React, { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { HomePage } from './pages/HomePage';
import { ExploreTablesPage } from './pages/ExploreTablesPage';
import { MenuPage } from './pages/MenuPage';
import { OffersPage } from './pages/OffersPage';
import { MyBookingsPage } from './pages/MyBookingsPage';
import { OwnerDashboard } from './pages/OwnerDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { ContactPage } from './pages/ContactPage';
import { TableBookingModal } from './components/modals/TableBookingModal';
import { AuthModal } from './components/modals/AuthModal';

export const App = () => {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const location = useLocation();

  // Scroll to top on route change
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-stone-900 text-stone-100 font-sans selection:bg-amber-500 selection:text-stone-950">
      
      {/* Universal Navbar */}
      <Navbar
        onOpenBookingModal={() => setIsBookingModalOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage onOpenBookingModal={() => setIsBookingModalOpen(true)} />} />
          <Route path="/tables" element={<ExploreTablesPage onOpenBookingModal={() => setIsBookingModalOpen(true)} />} />
          <Route path="/menu" element={<MenuPage onOpenBookingModal={() => setIsBookingModalOpen(true)} />} />
          <Route path="/offers" element={<OffersPage onOpenBookingModal={() => setIsBookingModalOpen(true)} />} />
          <Route path="/my-bookings" element={<MyBookingsPage onOpenBookingModal={() => setIsBookingModalOpen(true)} />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/owner/dashboard" element={<OwnerDashboard />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="*" element={
            <div className="py-24 text-center space-y-4">
              <h2 className="font-serif text-3xl font-bold text-white">404 - Page Not Found</h2>
              <p className="text-xs text-stone-400">The dining pavilion you are looking for does not exist.</p>
              <a href="/" className="inline-block px-4 py-2 bg-amber-500 text-stone-950 font-bold text-xs rounded-xl">
                Return to Sanctuary Home
              </a>
            </div>
          } />
        </Routes>
      </main>

      {/* Universal Footer */}
      <Footer />

      {/* Global Interactive Modals */}
      <TableBookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

    </div>
  );
};
