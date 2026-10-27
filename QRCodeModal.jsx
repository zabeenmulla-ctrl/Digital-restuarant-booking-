import React from 'react';
import { X, QrCode, Download, Calendar, Users, MapPin, CheckCircle2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { formatDate, formatCurrency } from '../../utils/formatters';
import { useBooking } from '../../context/BookingContext';

export const QRCodeModal = ({ isOpen, onClose, booking }) => {
  const { downloadInvoice } = useBooking();

  if (!isOpen || !booking) return null;

  const qrValue = booking.qr_code_token || `VERIFY:${booking.booking_reference}:VALID:QASWAHILLS`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/85 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-sm bg-stone-900 border border-stone-800 rounded-3xl shadow-2xl overflow-hidden text-center">
        
        {/* Top Header */}
        <div className="p-5 bg-gradient-to-b from-stone-800 to-stone-900 border-b border-stone-800 flex items-center justify-between">
          <div className="text-left">
            <h3 className="font-serif text-base font-bold text-white">Digital Pass & QR Code</h3>
            <p className="text-[11px] text-amber-400 font-mono">Ref: {booking.booking_reference}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          
          {/* Status Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span className="capitalize">{booking.status.replace('_', ' ')} Reservation</span>
          </div>

          {/* QR Code Presentation */}
          <div className="p-4 bg-white rounded-2xl inline-block shadow-inner mx-auto">
            <QRCodeSVG
              value={qrValue}
              size={180}
              level="H"
              includeMargin={false}
              fgColor="#1c1917"
            />
          </div>

          {/* Key Reservation Info */}
          <div className="bg-stone-950/80 p-3.5 rounded-xl border border-stone-800 text-left space-y-2 text-xs">
            <div className="flex justify-between border-b border-stone-800/80 pb-1.5">
              <span className="text-stone-400">Guest Name:</span>
              <span className="font-semibold text-white">{booking.customer_name}</span>
            </div>
            <div className="flex justify-between border-b border-stone-800/80 pb-1.5">
              <span className="text-stone-400">Date & Time:</span>
              <span className="font-semibold text-amber-300">{formatDate(booking.booking_date)} at {booking.time_label || booking.time_slot}</span>
            </div>
            <div className="flex justify-between border-b border-stone-800/80 pb-1.5">
              <span className="text-stone-400">Table & Zone:</span>
              <span className="font-semibold text-white">{booking.table_number} ({booking.zone_name})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-400">Party Size:</span>
              <span className="font-semibold text-white">{booking.guest_count} Guests</span>
            </div>
          </div>

          <p className="text-[11px] text-stone-400">
            Please present this digital pass on your smartphone at the Qaswa Hills host desk (Opp. Gol Gumbaz, Bijapur) for instant 1-second check-in.
          </p>

          {/* Action to Download PDF Invoice */}
          <button
            onClick={() => downloadInvoice(booking)}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-stone-800 hover:bg-stone-700 text-amber-300 border border-amber-500/30 flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
          >
            <Download className="w-4 h-4" /> Download Official PDF Invoice
          </button>

        </div>
      </div>
    </div>
  );
};
