import React, { useState } from 'react';
import { X, ShieldCheck, CreditCard, Smartphone, Building, CheckCircle2, Lock, AlertCircle } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const RazorpayPaymentModal = ({ isOpen, onClose, booking, onPaymentSuccess }) => {
  const [activeTab, setActiveTab] = useState('upi');
  const [upiId, setUpiId] = useState('customer@okaxis');
  const [cardData, setCardData] = useState({
    number: '4312 •••• •••• 9821',
    expiry: '12/28',
    cvv: '•••',
    name: booking?.customer_name || 'Rahul Sharma'
  });
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [processing, setProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);

  if (!isOpen || !booking) return null;

  const totalPayable = booking.total_amount || 500;

  const handlePay = () => {
    setProcessing(true);
    // Simulate payment gateway authorization delay
    setTimeout(() => {
      setProcessing(false);
      setPaymentComplete(true);

      const paymentDetails = {
        method: activeTab === 'upi' ? `UPI (${upiId})` : activeTab === 'card' ? 'Visa Debit Card' : `NetBanking (${selectedBank})`,
        transaction_id: `pay_rzp_${Date.now()}`,
        amount: totalPayable,
        status: 'successful'
      };

      setTimeout(() => {
        onPaymentSuccess(paymentDetails);
      }, 1000);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/85 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Razorpay Branded Top Header */}
        <div className="bg-[#0c2340] px-6 py-4 flex items-center justify-between border-b border-blue-900/60 text-white">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center border border-blue-400/40">
              <ShieldCheck className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-wide">Razorpay</span>
                <span className="px-1.5 py-0.2 text-[9px] font-semibold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded">
                  Test Gateway
                </span>
              </div>
              <p className="text-[11px] text-blue-200">Merchant: Qaswa Hills Restaurant, Bijapur (Opp. Gol Gumbaz)</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-blue-300 uppercase tracking-wider">Payable Amount</p>
            <p className="text-lg font-bold text-white">{formatCurrency(totalPayable)}</p>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          
          {processing ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-4 text-center">
              <div className="w-12 h-12 border-3 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
              <div>
                <h4 className="text-base font-semibold text-white">Authorizing Transaction</h4>
                <p className="text-xs text-stone-400 mt-1">Connecting to bank payment gateway server...</p>
                <p className="text-[11px] text-amber-400 mt-2 font-mono">Ref: {booking.booking_reference}</p>
              </div>
            </div>
          ) : paymentComplete ? (
            <div className="py-10 flex flex-col items-center justify-center space-y-3 text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-white">Payment Verified & Successful!</h4>
              <p className="text-xs text-stone-300">
                Amount of {formatCurrency(totalPayable)} received. Generating confirmation invoice...
              </p>
            </div>
          ) : (
            <>
              {/* Payment Methods Tabs */}
              <div className="grid grid-cols-3 gap-2 p-1 bg-stone-950 rounded-xl border border-stone-800">
                <button
                  type="button"
                  onClick={() => setActiveTab('upi')}
                  className={`py-2 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                    activeTab === 'upi' ? 'bg-amber-500 text-stone-950 font-bold' : 'text-stone-400 hover:text-white'
                  }`}
                >
                  <Smartphone className="w-4 h-4" /> UPI Apps
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('card')}
                  className={`py-2 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                    activeTab === 'card' ? 'bg-amber-500 text-stone-950 font-bold' : 'text-stone-400 hover:text-white'
                  }`}
                >
                  <CreditCard className="w-4 h-4" /> Cards
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('netbanking')}
                  className={`py-2 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                    activeTab === 'netbanking' ? 'bg-amber-500 text-stone-950 font-bold' : 'text-stone-400 hover:text-white'
                  }`}
                >
                  <Building className="w-4 h-4" /> NetBanking
                </button>
              </div>

              {/* Tab 1: UPI */}
              {activeTab === 'upi' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-2">
                    {['Google Pay', 'PhonePe', 'Paytm'].map((app) => (
                      <div
                        key={app}
                        onClick={() => setUpiId(`${app.toLowerCase().replace(' ', '')}@okaxis`)}
                        className="p-2.5 bg-stone-950 hover:bg-stone-800/80 border border-stone-800 hover:border-amber-500/40 rounded-xl text-center cursor-pointer transition-colors"
                      >
                        <p className="text-xs font-semibold text-stone-200">{app}</p>
                        <span className="text-[10px] text-emerald-400">Instant UPI</span>
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-400 mb-1">Enter UPI ID / VPA</label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="username@bank"
                      className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-sm text-stone-200 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              )}

              {/* Tab 2: Cards */}
              {activeTab === 'card' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-stone-400 mb-1">Card Number</label>
                    <input
                      type="text"
                      value={cardData.number}
                      onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                      className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-sm text-stone-200 focus:outline-none focus:border-amber-500 font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-stone-400 mb-1">Expiry Date</label>
                      <input
                        type="text"
                        value={cardData.expiry}
                        onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                        className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-sm text-stone-200 focus:outline-none focus:border-amber-500 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-stone-400 mb-1">CVV</label>
                      <input
                        type="password"
                        maxLength={3}
                        value={cardData.cvv}
                        onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                        className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-sm text-stone-200 focus:outline-none focus:border-amber-500 font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: NetBanking */}
              {activeTab === 'netbanking' && (
                <div className="space-y-3">
                  <label className="block text-xs font-medium text-stone-400 mb-1">Select Bank</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank'].map((bank) => (
                      <button
                        key={bank}
                        type="button"
                        onClick={() => setSelectedBank(bank)}
                        className={`p-2.5 rounded-xl border text-xs text-left transition-colors ${
                          selectedBank === bank
                            ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-semibold'
                            : 'bg-stone-950 border-stone-800 text-stone-300 hover:bg-stone-800'
                        }`}
                      >
                        {bank}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Security Note */}
              <div className="flex items-center justify-between text-[11px] text-stone-400 bg-stone-950 p-2.5 rounded-lg border border-stone-800/80">
                <span className="flex items-center gap-1.5 text-stone-300">
                  <Lock className="w-3.5 h-3.5 text-amber-400" /> 256-bit SSL Encrypted Payment
                </span>
                <span className="text-emerald-400 font-medium">Safe Test Simulation</span>
              </div>

              {/* Pay Now Button */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 text-xs font-semibold text-stone-400 hover:text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handlePay}
                  className="flex-1 py-2.5 text-sm font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 rounded-xl shadow-lg shadow-amber-900/30 flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  Pay {formatCurrency(totalPayable)} Securely
                </button>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
};
