import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_RESTAURANT,
  INITIAL_ZONES,
  INITIAL_TABLES,
  INITIAL_MENU_ITEMS,
  INITIAL_PROMOTIONS,
  INITIAL_BOOKINGS,
  INITIAL_REVIEWS,
  getStoredData,
  setStoredData
} from '../lib/mockData';
import { generateBookingRef, generateInvoiceNumber } from '../utils/formatters';
import { generateInvoicePDF } from '../utils/pdfGenerator';
import confetti from 'canvas-confetti';

const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  // Database States
  const [restaurant, setRestaurant] = useState(() => getStoredData('restaurant', INITIAL_RESTAURANT));
  const [zones] = useState(() => getStoredData('zones', INITIAL_ZONES));
  const [tables, setTables] = useState(() => getStoredData('tables', INITIAL_TABLES));
  const [menuItems, setMenuItems] = useState(() => getStoredData('menu', INITIAL_MENU_ITEMS));
  const [promotions, setPromotions] = useState(() => getStoredData('promotions', INITIAL_PROMOTIONS));
  const [bookings, setBookings] = useState(() => getStoredData('bookings', INITIAL_BOOKINGS));
  const [reviews, setReviews] = useState(() => getStoredData('reviews', INITIAL_REVIEWS));
  const [preOrderCart, setPreOrderCart] = useState([]);
  const [notifications, setNotifications] = useState(() => getStoredData('notifications', [
    {
      id: 'notif-1',
      title: 'Welcome to Qaswa Hills',
      message: 'Explore our cliffside terrace and reserve your royal dining table today!',
      type: 'info',
      time: 'Just now',
      is_read: false
    }
  ]));

  // Sync to local storage
  useEffect(() => setStoredData('restaurant', restaurant), [restaurant]);
  useEffect(() => setStoredData('tables', tables), [tables]);
  useEffect(() => setStoredData('menu', menuItems), [menuItems]);
  useEffect(() => setStoredData('promotions', promotions), [promotions]);
  useEffect(() => setStoredData('bookings', bookings), [bookings]);
  useEffect(() => setStoredData('reviews', reviews), [reviews]);
  useEffect(() => setStoredData('notifications', notifications), [notifications]);

  // Add Notification Helper
  const addNotification = (title, message, type = 'info') => {
    const newNotif = {
      id: `notif-${Date.now()}`,
      title,
      message,
      type,
      time: 'Just now',
      is_read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
  };

  // 1. Table Availability Engine (Concurrency & Capacity Validated)
  const checkTableAvailability = (bookingDate, timeSlot, guestCount, zoneId = null) => {
    if (!bookingDate || !timeSlot) {
      return tables.filter(t => t.is_active && (!zoneId || t.zone_id === zoneId));
    }

    // Find all confirmed/active bookings on that date and time slot
    const bookedTableIds = new Set(
      bookings
        .filter(b => 
          b.booking_date === bookingDate &&
          b.time_slot === timeSlot &&
          ['confirmed', 'checked_in', 'pending_payment'].includes(b.status)
        )
        .map(b => b.table_id)
    );

    return tables.filter(table => {
      if (!table.is_active) return false;
      if (zoneId && table.zone_id !== zoneId) return false;
      if (guestCount && table.capacity < Number(guestCount)) return false;
      // Concurrency check: must not be in active booked table IDs
      return !bookedTableIds.has(table.id);
    });
  };

  // 2. Validate and Apply Promo Code
  const applyPromoCode = (code, subtotal) => {
    const promo = promotions.find(p => p.code.toUpperCase() === code.trim().toUpperCase() && p.is_active !== false);
    if (!promo) {
      return { success: false, error: 'Invalid coupon code.' };
    }
    if (promo.min_spend && subtotal < promo.min_spend) {
      return { success: false, error: `Minimum booking spend of ₹${promo.min_spend} required for this coupon.` };
    }

    let discount = 0;
    if (promo.discount_type === 'percentage') {
      discount = Math.round((subtotal * promo.discount_value) / 100);
      if (promo.max_discount && discount > promo.max_discount) {
        discount = promo.max_discount;
      }
    } else {
      discount = promo.discount_value;
    }

    return {
      success: true,
      promo,
      discountAmount: discount
    };
  };

  // 3. Create New Table Reservation
  const createBooking = async (bookingData) => {
    // Final concurrency safety validation
    const isAlreadyBooked = bookings.some(b => 
      b.table_id === bookingData.table_id &&
      b.booking_date === bookingData.booking_date &&
      b.time_slot === bookingData.time_slot &&
      ['confirmed', 'checked_in', 'pending_payment'].includes(b.status)
    );

    if (isAlreadyBooked) {
      throw new Error('Sorry! This table was just booked by another guest for this exact time slot. Please choose another table or time.');
    }

    const bookingRef = generateBookingRef();
    const invoiceNum = generateInvoiceNumber();
    const deposit = Number(restaurant.default_deposit_fee) || 500;
    const extraFee = Number(bookingData.extra_table_fee) || 0;
    const discount = Number(bookingData.discount_amount) || 0;
    const foodOrderAmount = preOrderCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const subtotal = deposit + extraFee;
    const tax = Math.round((subtotal - discount) * (restaurant.tax_rate / 100));
    const grandTotal = Math.max(0, subtotal - discount + tax + foodOrderAmount);

    const newBooking = {
      id: `bkg-${Date.now()}`,
      booking_reference: bookingRef,
      invoice_number: invoiceNum,
      user_id: bookingData.user_id || 'guest',
      customer_name: bookingData.customer_name,
      customer_email: bookingData.customer_email,
      customer_phone: bookingData.customer_phone,
      guest_count: Number(bookingData.guest_count),
      table_id: bookingData.table_id,
      table_number: bookingData.table_number,
      zone_name: bookingData.zone_name,
      booking_date: bookingData.booking_date,
      time_slot: bookingData.time_slot,
      time_label: bookingData.time_label || bookingData.time_slot,
      occasion: bookingData.occasion || 'Dining Experience',
      special_requests: bookingData.special_requests || '',
      deposit_amount: deposit,
      extra_table_fee: extraFee,
      discount_amount: discount,
      tax_amount: tax,
      food_order_amount: foodOrderAmount,
      pre_ordered_items: [...preOrderCart],
      total_amount: grandTotal,
      status: 'pending_payment',
      payment_status: 'pending',
      payment_method: null,
      transaction_id: null,
      qr_code_token: `VERIFY:${bookingRef}:VALID:QASWAHILLS`,
      created_at: new Date().toISOString()
    };

    setBookings(prev => [newBooking, ...prev]);
    return newBooking;
  };

  // 4. Verify Payment & Confirm Reservation
  const completeBookingPayment = (bookingId, paymentDetails) => {
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId || b.booking_reference === bookingId) {
        return {
          ...b,
          status: 'confirmed',
          payment_status: 'successful',
          payment_method: paymentDetails.method || 'Razorpay UPI / Card',
          transaction_id: paymentDetails.transaction_id || `pay_rzp_${Date.now()}`
        };
      }
      return b;
    }));

    // Trigger celebratory confetti
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // ignore
    }

    addNotification(
      'Reservation Confirmed!',
      `Your table reservation at Qaswa Hills is confirmed with instant QR code.`,
      'success'
    );

    // Clear pre-order cart
    setPreOrderCart([]);
  };

  // 5. Cancel Reservation
  const cancelBooking = (bookingId, reason = 'Customer request') => {
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        return {
          ...b,
          status: 'cancelled',
          cancellation_reason: reason,
          cancelled_at: new Date().toISOString()
        };
      }
      return b;
    }));

    addNotification('Reservation Cancelled', `Reservation has been cancelled and table released.`, 'warning');
  };

  // 6. Check In Guest via QR Scanner or Manual Reference
  const checkInGuest = (bookingReference) => {
    const booking = bookings.find(b => 
      b.booking_reference.trim().toUpperCase() === bookingReference.trim().toUpperCase() ||
      b.qr_code_token?.includes(bookingReference.trim().toUpperCase())
    );

    if (!booking) {
      return { success: false, message: 'No reservation found matching this reference.' };
    }

    if (booking.status === 'checked_in') {
      return { success: false, message: `Guest is already checked in at ${new Date(booking.checked_in_at).toLocaleTimeString()}.`, booking };
    }

    if (booking.status === 'cancelled') {
      return { success: false, message: 'Cannot check in: this reservation was previously cancelled.', booking };
    }

    if (booking.status !== 'confirmed') {
      return { success: false, message: `Reservation is not in confirmed state (Current: ${booking.status}).`, booking };
    }

    const checkInTime = new Date().toISOString();
    setBookings(prev => prev.map(b => {
      if (b.id === booking.id) {
        return {
          ...b,
          status: 'checked_in',
          checked_in_at: checkInTime
        };
      }
      return b;
    }));

    addNotification('Guest Checked In', `${booking.customer_name} checked in at ${booking.table_number}.`, 'success');

    return {
      success: true,
      message: `Verification Successful! Welcome ${booking.customer_name} to ${booking.table_number}.`,
      booking: { ...booking, status: 'checked_in', checked_in_at: checkInTime }
    };
  };

  // 7. Complete Dining Session
  const markBookingCompleted = (bookingId) => {
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        return {
          ...b,
          status: 'completed'
        };
      }
      return b;
    }));
  };

  // 8. Table Management (Owner/Admin)
  const addTable = (newTable) => {
    const tableObj = {
      ...newTable,
      id: `tbl-${Date.now()}`,
      is_active: true
    };
    setTables(prev => [...prev, tableObj]);
    addNotification('Table Added', `Table ${newTable.table_number} added to inventory.`);
  };

  const updateTable = (tableId, updatedFields) => {
    setTables(prev => prev.map(t => t.id === tableId ? { ...t, ...updatedFields } : t));
    addNotification('Table Updated', `Table details updated.`);
  };

  const toggleTableStatus = (tableId) => {
    setTables(prev => prev.map(t => t.id === tableId ? { ...t, is_active: !t.is_active } : t));
  };

  // 9. Menu Management (Owner/Admin)
  const addMenuItem = (item) => {
    const newItem = {
      ...item,
      id: `menu-${Date.now()}`,
      is_available: true
    };
    setMenuItems(prev => [...prev, newItem]);
    addNotification('Menu Item Added', `${item.name} added to menu.`);
  };

  const updateMenuItem = (itemId, updatedFields) => {
    setMenuItems(prev => prev.map(m => m.id === itemId ? { ...m, ...updatedFields } : m));
  };

  const toggleMenuItemAvailability = (itemId) => {
    setMenuItems(prev => prev.map(m => m.id === itemId ? { ...m, is_available: !m.is_available } : m));
  };

  // 10. Reviews
  const addReview = (reviewData) => {
    const newRev = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      is_verified: true
    };
    setReviews(prev => [newRev, ...prev]);
    addNotification('Review Submitted', 'Thank you for your rating & feedback!');
  };

  // 11. Promotions (Admin)
  const addPromotion = (promo) => {
    setPromotions(prev => [...prev, { ...promo, is_active: true }]);
    addNotification('Coupon Created', `Promo code ${promo.code} is now live.`);
  };

  // 12. Pre-Order Cart
  const addToCart = (item) => {
    setPreOrderCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId) => {
    setPreOrderCart(prev => prev.filter(i => i.id !== itemId));
  };

  const updateCartQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
    } else {
      setPreOrderCart(prev => prev.map(i => i.id === itemId ? { ...i, quantity } : i));
    }
  };

  const clearCart = () => setPreOrderCart([]);

  // Download PDF Invoice helper
  const downloadInvoice = (booking) => {
    generateInvoicePDF(booking, restaurant);
  };

  return (
    <BookingContext.Provider
      value={{
        restaurant,
        setRestaurant,
        zones,
        tables,
        menuItems,
        promotions,
        bookings,
        reviews,
        notifications,
        preOrderCart,
        checkTableAvailability,
        applyPromoCode,
        createBooking,
        completeBookingPayment,
        cancelBooking,
        checkInGuest,
        markBookingCompleted,
        addTable,
        updateTable,
        toggleTableStatus,
        addMenuItem,
        updateMenuItem,
        toggleMenuItemAvailability,
        addReview,
        addPromotion,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        downloadInvoice,
        markAllNotificationsAsRead
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => useContext(BookingContext);
