import React, { useState, useEffect } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  Users, 
  MapPin, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Download, 
  Tag, 
  ShieldCheck, 
  AlertCircle,
  Utensils
} from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import { useAuth } from '../../context/AuthContext';
import { TIME_SLOTS } from '../../lib/mockData';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { RazorpayPaymentModal } from './RazorpayPaymentModal';
import { QRCodeSVG } from 'qrcode.react';

export const TableBookingModal = ({ isOpen, onClose, initialZoneId = null, initialTableId = null }) => {
  const { 
    restaurant, 
    zones, 
    checkTableAvailability, 
    applyPromoCode, 
    createBooking, 
    completeBookingPayment,
    downloadInvoice,
    preOrderCart
  } = useBooking();
  const { user } = useAuth();

  // Wizard Step (1: DateTimeGuests -> 2: TableSelect -> 3: GuestDetails -> 4: ReviewPay -> 5: Confirmed)
  const [step, setStep] = useState(1);

  // Form State
  const [bookingDate, setBookingDate] = useState(() => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    return today.toISOString().split('T')[0];
  });
  const [timeSlot, setTimeSlot] = useState('18:30');
  const [guestCount, setGuestCount] = useState(2);
  const [selectedZoneId, setSelectedZoneId] = useState(initialZoneId || '');
  const [selectedTable, setSelectedTable] = useState(null);

  // Guest Details
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '+91 ');
  const [occasion, setOccasion] = useState('Dining Experience');
  const [specialRequests, setSpecialRequests] = useState('');

  // Promo Code State
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [promoError, setPromoError] = useState('');

  // Booking result & payment modal state
  const [createdBooking, setCreatedBooking] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (user) {
      if (!customerName) setCustomerName(user.name);
      if (!customerEmail) setCustomerEmail(user.email);
      if (user.phone && (!customerPhone || customerPhone === '+91 ')) setCustomerPhone(user.phone);
    }
  }, [user]);

  if (!isOpen) return null;

  // Real-time table availability check
  const availableTables = checkTableAvailability(bookingDate, timeSlot, guestCount, selectedZoneId || null);

  // Pre-select table if provided
  if (initialTableId && !selectedTable) {
    const pre = availableTables.find(t => t.id === initialTableId);
    if (pre) setSelectedTable(pre);
  }

  // Today's date string for input min attribute
  const todayStr = new Date().toISOString().split('T')[0];

  // Pricing calculations
  const deposit = Number(restaurant.default_deposit_fee) || 500;
  const extraTableFee = selectedTable ? Number(selectedTable.extra_fee) || 0 : 0;
  const foodCartTotal = preOrderCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const subtotal = deposit + extraTableFee;
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const tax = Math.round(taxableAmount * (restaurant.tax_rate / 100));
  const grandTotal = taxableAmount + tax + foodCartTotal;

  // Apply Coupon Handler
  const handleApplyPromo = () => {
    setPromoError('');
    if (!promoInput.trim()) return;
    const res = applyPromoCode(promoInput, subtotal);
    if (res.success) {
      setAppliedPromo(res.promo);
      setDiscountAmount(res.discountAmount);
    } else {
      setPromoError(res.error);
    }
  };

  // Step 3 -> 4: Create booking hold & advance
  const handleProceedToReview = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (!selectedTable) {
      setErrorMessage('Please select an available table first.');
      return;
    }
    if (!customerName || !customerEmail || !customerPhone) {
      setErrorMessage('Please fill in your name, contact phone, and email address.');
      return;
    }

    try {
      const selectedSlotObj = TIME_SLOTS.find(s => s.id === timeSlot);
      const bookingData = {
        user_id: user?.id || 'guest',
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        guest_count: guestCount,
        table_id: selectedTable.id,
        table_number: selectedTable.table_number,
        zone_name: selectedTable.zone_name,
        booking_date: bookingDate,
        time_slot: timeSlot,
        time_label: selectedSlotObj ? selectedSlotObj.label : timeSlot,
        occasion,
        special_requests: specialRequests,
        extra_table_fee: extraTableFee,
        discount_amount: discountAmount
      };

      const booking = await createBooking(bookingData);
      setCreatedBooking(booking);
      setStep(4);
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  // Payment completed callback from Razorpay Modal
  const handlePaymentSuccess = (paymentDetails) => {
    if (createdBooking) {
      completeBookingPayment(createdBooking.id, paymentDetails);
      setIsPaymentModalOpen(false);
      setStep(5); // Confirmation screen
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#0b100e]/90 backdrop-blur-md animate-in fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#121915] border border-gold-500/40 rounded-3xl shadow-2xl overflow-hidden my-6">
        
        {/* Wizard Header - Royal Emerald & Gold */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#022c22] via-[#064e3b] to-[#022c22] border-b border-gold-500/30 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-royal text-base sm:text-lg font-bold text-white">Qaswa Hills Bijapur • Reservation</span>
              <span className="px-2 py-0.5 text-[9px] uppercase font-bold bg-gold-500/20 text-gold-300 border border-gold-500/40 rounded-full font-royal">
                Step {step} of 4
              </span>
            </div>
            <p className="text-xs text-gold-200/80 mt-0.5">
              {step === 1 && 'Select Date, Time Slot & Number of Guests (Opp. Gol Gumbaz)'}
              {step === 2 && 'Choose your Preferred Seating Area (Terrace, Majlis, or Hall)'}
              {step === 3 && 'Enter Guest Details & Dining Occasion'}
              {step === 4 && 'Review Reservation, Apply Promo & Pay Deposit'}
              {step === 5 && 'Table Confirmed! Download Invoice & Digital QR Pass'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-300 hover:text-white rounded-xl hover:bg-emerald-950 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wizard Progress Bar */}
        <div className="w-full bg-[#0b100e] h-1.5">
          <div 
            className="bg-gradient-to-r from-emerald-500 via-gold-400 to-gold-500 h-1.5 transition-all duration-300"
            style={{ width: `${(step / (step === 5 ? 5 : 4)) * 100}%` }}
          ></div>
        </div>

        {/* Wizard Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {errorMessage && (
            <div className="p-3 bg-red-950/60 border border-red-500/50 rounded-xl text-xs text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* ================= STEP 1: DATE, TIME, GUESTS & ZONE ================= */}
          {step === 1 && (
            <div className="space-y-5">
              
              {/* Date & Guests Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-amber-400" /> Select Reservation Date
                  </label>
                  <input
                    type="date"
                    min={todayStr}
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-sm text-stone-100 focus:outline-none focus:border-amber-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1.5 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-amber-400" /> Number of Guests
                  </label>
                  <select
                    value={guestCount}
                    onChange={(e) => setGuestCount(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-sm text-stone-100 focus:outline-none focus:border-amber-500 font-medium"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'Guest (Solo)' : num === 2 ? 'Guests (Couple)' : 'Guests'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Seating Zone Filter Tabs */}
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1.5 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-amber-400" /> Preferred Seating Zone
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedZoneId('')}
                    className={`py-2 px-3 text-xs rounded-xl font-medium border text-center transition-all ${
                      selectedZoneId === ''
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-semibold'
                        : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-white'
                    }`}
                  >
                    All Hill Zones
                  </button>
                  {zones.map((zone) => (
                    <button
                      key={zone.id}
                      type="button"
                      onClick={() => setSelectedZoneId(zone.id)}
                      className={`py-2 px-2.5 text-xs rounded-xl font-medium border text-center truncate transition-all ${
                        selectedZoneId === zone.id
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-semibold'
                          : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-white'
                      }`}
                      title={zone.name}
                    >
                      {zone.name.replace('Qaswa', '').trim()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Slots (Lunch & Dinner) */}
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1.5 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-400" /> Available Time Slot
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 max-h-48 overflow-y-auto p-1">
                  {TIME_SLOTS.map((slot) => (
                    <button
                      key={slot.id}
                      type="button"
                      onClick={() => setTimeSlot(slot.id)}
                      className={`py-2 px-2 text-xs rounded-xl border text-center transition-all ${
                        timeSlot === slot.id
                          ? 'bg-amber-500 text-stone-950 font-bold border-amber-500 shadow-md shadow-amber-900/40'
                          : 'bg-stone-950 border-stone-800 text-stone-300 hover:border-stone-700'
                      }`}
                    >
                      <p className="font-semibold">{slot.id}</p>
                      <span className="text-[9px] block text-stone-400 opacity-80">{slot.period}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Advance to Step 2 Button */}
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-sm rounded-xl flex items-center gap-2 shadow-lg shadow-amber-900/30 transition-all active:scale-95"
                >
                  <span>Find Available Tables</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          )}

          {/* ================= STEP 2: SELECT TABLE ================= */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-stone-950 p-3 rounded-xl border border-stone-800 text-xs">
                <div>
                  <span className="text-stone-400">Date & Slot: </span>
                  <span className="text-amber-300 font-semibold">{formatDate(bookingDate)} at {timeSlot}</span>
                </div>
                <div>
                  <span className="text-stone-400">Party Size: </span>
                  <span className="text-white font-semibold">{guestCount} Guests</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold text-stone-300">
                  Select an Available Table ({availableTables.length} tables ready)
                </h4>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-amber-400 hover:underline flex items-center gap-1"
                >
                  <ArrowLeft className="w-3 h-3" /> Change time or guests
                </button>
              </div>

              {availableTables.length === 0 ? (
                <div className="py-12 text-center bg-stone-950/60 rounded-2xl border border-stone-800/80 p-6 space-y-3">
                  <AlertCircle className="w-10 h-10 text-amber-500/80 mx-auto" />
                  <h5 className="text-sm font-semibold text-white">No Tables Available for this Slot</h5>
                  <p className="text-xs text-stone-400 max-w-md mx-auto">
                    All tables matching your party size of {guestCount} in the selected area are fully booked for this time. Please try another time slot (e.g. 19:30 or 21:00) or choose "All Hill Zones".
                  </p>
                  <button
                    onClick={() => setStep(1)}
                    className="px-4 py-2 text-xs font-semibold bg-stone-800 text-amber-300 rounded-xl hover:bg-stone-700"
                  >
                    Adjust Slot & Try Again
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto p-1">
                  {availableTables.map((table) => {
                    const isSelected = selectedTable?.id === table.id;
                    return (
                      <div
                        key={table.id}
                        onClick={() => setSelectedTable(table)}
                        className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'bg-amber-500/10 border-amber-500 ring-2 ring-amber-500/30'
                            : 'bg-stone-950 hover:bg-stone-850 border-stone-800'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <img
                            src={table.image}
                            alt={table.table_number}
                            className="w-16 h-16 rounded-xl object-cover shrink-0 border border-stone-800"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h5 className="font-semibold text-xs text-white truncate">{table.table_number}</h5>
                              {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />}
                            </div>
                            <p className="text-[11px] text-amber-400/90 font-medium">{table.zone_name}</p>
                            <div className="flex items-center gap-2 mt-1 text-[11px] text-stone-400">
                              <span className="flex items-center gap-1">
                                <Users className="w-3 h-3 text-amber-400" /> Up to {table.capacity} guests
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-2.5 pt-2 border-t border-stone-850 flex items-center justify-between text-[11px]">
                          <span className="text-stone-400">{table.category}</span>
                          {table.extra_fee > 0 ? (
                            <span className="text-amber-400 font-semibold">+{formatCurrency(table.extra_fee)} Area Fee</span>
                          ) : (
                            <span className="text-emerald-400 font-medium">Standard Fee</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Navigation */}
              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 text-xs font-semibold text-stone-400 hover:text-white"
                >
                  Back
                </button>
                <button
                  type="button"
                  disabled={!selectedTable}
                  onClick={() => setStep(3)}
                  className={`px-5 py-2.5 font-bold text-sm rounded-xl flex items-center gap-2 transition-all ${
                    selectedTable
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 shadow-lg shadow-amber-900/30'
                      : 'bg-stone-800 text-stone-500 cursor-not-allowed'
                  }`}
                >
                  <span>Continue to Guest Details</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          )}

          {/* ================= STEP 3: GUEST DETAILS & REQUESTS ================= */}
          {step === 3 && (
            <form onSubmit={handleProceedToReview} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Guest Name"
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-sm text-stone-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">Contact Phone</label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-sm text-stone-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-sm text-stone-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">Dining Occasion</label>
                  <select
                    value={occasion}
                    onChange={(e) => setOccasion(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-sm text-stone-100 focus:outline-none focus:border-amber-500"
                  >
                    <option value="Casual Dining">Casual Dining / Evening Out</option>
                    <option value="Anniversary Celebration">Anniversary Celebration</option>
                    <option value="Birthday Party">Birthday Party</option>
                    <option value="Romantic Candlelight Date">Romantic Candlelight Date</option>
                    <option value="Corporate / Business Dinner">Corporate / Business Dinner</option>
                    <option value="Family Reunion">Family Reunion</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">Table Allocated</label>
                  <div className="px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs text-amber-400 font-semibold flex items-center justify-between">
                    <span>{selectedTable?.table_number}</span>
                    <span className="text-stone-400">({selectedTable?.zone_name})</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">Special Dining Requests (Optional)</label>
                <textarea
                  rows={2}
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="e.g. Window edge view preferred, dietary allergies, high chair for child, rose petal decoration..."
                  className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-sm text-stone-100 focus:outline-none focus:border-amber-500 resize-none"
                ></textarea>
              </div>

              {/* Navigation */}
              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2 text-xs font-semibold text-stone-400 hover:text-white"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-sm rounded-xl flex items-center gap-2 shadow-lg shadow-amber-900/30 transition-all active:scale-95"
                >
                  <span>Review & Summary</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </form>
          )}

          {/* ================= STEP 4: REVIEW & PROCEED TO PAYMENT ================= */}
          {step === 4 && (
            <div className="space-y-4">
              
              {/* Summary Card */}
              <div className="bg-stone-950 rounded-2xl p-4 border border-stone-800 space-y-3">
                <div className="flex items-center justify-between border-b border-stone-850 pb-2">
                  <h4 className="font-serif text-sm font-bold text-white">Booking Summary</h4>
                  <span className="text-xs text-amber-400 font-mono">Ref: {createdBooking?.booking_reference}</span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-stone-400 block">Restaurant:</span>
                    <span className="font-semibold text-white">{restaurant.name}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block">Seating Area:</span>
                    <span className="font-semibold text-white">{selectedTable?.table_number} ({selectedTable?.zone_name})</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block">Date & Time:</span>
                    <span className="font-semibold text-amber-300">{formatDate(bookingDate)} at {timeSlot}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block">Guest Details:</span>
                    <span className="font-semibold text-white">{customerName} ({guestCount} Guests)</span>
                  </div>
                </div>

                {preOrderCart.length > 0 && (
                  <div className="pt-2 border-t border-stone-850">
                    <span className="text-xs text-amber-400 font-semibold flex items-center gap-1 mb-1">
                      <Utensils className="w-3.5 h-3.5" /> Pre-Ordered Dishes ({preOrderCart.length} items):
                    </span>
                    <div className="text-[11px] text-stone-400 space-y-0.5">
                      {preOrderCart.map(item => (
                        <div key={item.id} className="flex justify-between">
                          <span>{item.name} × {item.quantity}</span>
                          <span>{formatCurrency(item.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Coupon Code Section */}
              <div className="bg-stone-950 p-3.5 rounded-2xl border border-stone-800 space-y-2">
                <label className="block text-xs font-semibold text-stone-300 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-amber-400" /> Have a Promo Code?
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                    placeholder="e.g. HILLVIEW20 or QASWA10"
                    className="flex-1 px-3 py-2 bg-stone-900 border border-stone-700 rounded-xl text-xs text-stone-100 uppercase focus:outline-none focus:border-amber-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-xl"
                  >
                    Apply
                  </button>
                </div>
                {promoError && <p className="text-[11px] text-red-400">{promoError}</p>}
                {appliedPromo && (
                  <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Coupon '{appliedPromo.code}' applied! Saved {formatCurrency(discountAmount)}.
                  </p>
                )}
              </div>

              {/* Price Calculation Box */}
              <div className="bg-stone-950/90 rounded-2xl p-4 border border-stone-800 space-y-2 text-xs">
                <div className="flex justify-between text-stone-300">
                  <span>Advance Table Reservation Deposit (Adjustable against food bill):</span>
                  <span>{formatCurrency(deposit)}</span>
                </div>

                {extraTableFee > 0 && (
                  <div className="flex justify-between text-stone-300">
                    <span>Premium Zone Surcharge ({selectedTable?.zone_name}):</span>
                    <span>{formatCurrency(extraTableFee)}</span>
                  </div>
                )}

                {foodCartTotal > 0 && (
                  <div className="flex justify-between text-stone-300">
                    <span>Gourmet Pre-Order Subtotal:</span>
                    <span>{formatCurrency(foodCartTotal)}</span>
                  </div>
                )}

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-medium">
                    <span>Promotional Discount:</span>
                    <span>-{formatCurrency(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-stone-400">
                  <span>GST & Service Charges (5%):</span>
                  <span>{formatCurrency(tax)}</span>
                </div>

                <div className="pt-2 border-t border-stone-800 flex justify-between items-center text-sm font-bold text-white">
                  <span>Total Payable Now:</span>
                  <span className="text-base text-amber-400">{formatCurrency(grandTotal)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-4 py-2 text-xs font-semibold text-stone-400 hover:text-white"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setIsPaymentModalOpen(true)}
                  className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-sm rounded-xl flex items-center gap-2 shadow-lg shadow-amber-900/40 transition-all active:scale-95"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Pay {formatCurrency(grandTotal)} via Razorpay</span>
                </button>
              </div>

            </div>
          )}

          {/* ================= STEP 5: CONFIRMATION & INVOICE DOWNLOAD ================= */}
          {step === 5 && createdBooking && (
            <div className="text-center py-4 space-y-5">
              
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                  🎉 Reservation Successfully Confirmed
                </span>
                <h3 className="font-serif text-2xl font-bold text-white mt-1">
                  We look forward to hosting you!
                </h3>
                <p className="text-xs text-stone-400 mt-1">
                  Your table at Qaswa Hills is locked with verified digital payment.
                </p>
              </div>

              {/* Digital Pass Presentation */}
              <div className="p-4 bg-white rounded-2xl inline-block shadow-2xl mx-auto">
                <QRCodeSVG
                  value={createdBooking.qr_code_token || `VERIFY:${createdBooking.booking_reference}:VALID:QASWAHILLS`}
                  size={160}
                  level="H"
                />
                <p className="text-[10px] text-stone-900 font-mono mt-2 font-bold">
                  {createdBooking.booking_reference}
                </p>
              </div>

              <div className="max-w-md mx-auto bg-stone-950 p-3.5 rounded-xl border border-stone-800 text-xs text-left space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-stone-400">Date & Slot:</span>
                  <span className="text-amber-300 font-semibold">{formatDate(bookingDate)} at {timeSlot}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Table & Zone:</span>
                  <span className="text-white font-semibold">{selectedTable?.table_number} ({selectedTable?.zone_name})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Amount Paid:</span>
                  <span className="text-emerald-400 font-semibold">{formatCurrency(grandTotal)} (Paid)</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => downloadInvoice({ ...createdBooking, total_amount: grandTotal, status: 'confirmed' })}
                  className="w-full sm:w-auto px-5 py-2.5 bg-stone-800 hover:bg-stone-700 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
                >
                  <Download className="w-4 h-4" /> Download Official PDF Invoice
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 rounded-xl text-xs font-bold transition-all"
                >
                  View My Bookings & Done
                </button>
              </div>

            </div>
          )}

        </div>
      </div>

      {/* Razorpay Online Payment Checkout Modal */}
      {isPaymentModalOpen && createdBooking && (
        <RazorpayPaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          booking={{ ...createdBooking, total_amount: grandTotal }}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}

    </div>
  );
};
