import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatCurrency, formatDate } from './formatters';

export const generateInvoicePDF = (booking, restaurant) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Royal Arabic & Heritage Colors
  const emeraldColor = [6, 78, 59];    // Deep Emerald Green
  const goldColor = [212, 175, 55];    // Royal Gold
  const darkColor = [11, 16, 14];      // Charcoal Slate
  const grayColor = [100, 116, 139];   // Slate 500

  // 1. Header Banner - Deep Royal Emerald
  doc.setFillColor(...emeraldColor);
  doc.rect(0, 0, 210, 44, 'F');

  // Decorative Gold Border Line
  doc.setFillColor(...goldColor);
  doc.rect(0, 43, 210, 1.5, 'F');

  // Restaurant Brand & Bijapur Landmark
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text(restaurant?.name || 'Qaswa Hills Restaurant & Banquet', 15, 18);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(243, 215, 126); // Warm Gold
  doc.text('Royal Arabic & Mughlai Cuisine | Opposite Historic Gol Gumbaz', 15, 25);
  doc.setTextColor(226, 232, 240);
  doc.text('Station Road, Vijayapura (Bijapur), Karnataka 586101 | Tel: +91 98450 78600', 15, 32);

  // Official Receipt Badge on the right
  doc.setFillColor(...goldColor);
  doc.roundedRect(145, 12, 50, 20, 2, 2, 'F');
  doc.setTextColor(11, 16, 14);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('TAX INVOICE / RECEIPT', 148, 20);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('GST Verified Dining Pass', 148, 26);

  // 2. Metadata Columns
  doc.setFontSize(9);
  doc.setTextColor(...darkColor);

  // Left Column - Guest Details
  doc.setFont('helvetica', 'bold');
  doc.text('BILLED TO (PATRON):', 15, 54);
  doc.setFont('helvetica', 'normal');
  doc.text(`Guest Name: ${booking.customer_name}`, 15, 60);
  doc.text(`Contact: ${booking.customer_phone}`, 15, 65);
  doc.text(`Email: ${booking.customer_email}`, 15, 70);
  if (booking.occasion) {
    doc.text(`Occasion: ${booking.occasion}`, 15, 75);
  }

  // Right Column - Booking & Invoice References
  doc.setFont('helvetica', 'bold');
  doc.text('RESERVATION PARTICULARS:', 120, 54);
  doc.setFont('helvetica', 'normal');
  doc.text(`Invoice No: ${booking.invoice_number || 'INV-QSW-PENDING'}`, 120, 60);
  doc.text(`Booking Ref: ${booking.booking_reference}`, 120, 65);
  doc.text(`Date & Time: ${formatDate(booking.booking_date)} at ${booking.time_label || booking.time_slot}`, 120, 70);
  doc.text(`Party Size: ${booking.guest_count} Guests`, 120, 75);
  doc.text(`Table: ${booking.table_number} (${booking.zone_name})`, 120, 80);

  // 3. Line Items Table using autoTable
  const deposit = Number(booking.deposit_amount) || 500;
  const extraFee = Number(booking.extra_table_fee) || 0;
  const discount = Number(booking.discount_amount) || 0;
  const subtotal = deposit + extraFee;
  const tax = Number(booking.tax_amount) || Math.round((subtotal - discount) * 0.05);
  const total = Number(booking.total_amount) || (subtotal - discount + tax);

  const tableRows = [
    [
      'Advance Table Reservation Deposit',
      'Guarantees immediate table allocation; 100% adjustable against food bill at Qaswa Hills',
      '1',
      formatCurrency(deposit),
      formatCurrency(deposit)
    ]
  ];

  if (extraFee > 0) {
    tableRows.push([
      'Special Seating Area Surcharge',
      `Exclusive arrangement for ${booking.zone_name}`,
      '1',
      formatCurrency(extraFee),
      formatCurrency(extraFee)
    ]);
  }

  autoTable(doc, {
    startY: 88,
    head: [['Item Description', 'Details / Area', 'Qty', 'Unit Rate', 'Total Amount']],
    body: tableRows,
    theme: 'striped',
    headStyles: {
      fillColor: emeraldColor,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9
    },
    bodyStyles: {
      fontSize: 9,
      textColor: [30, 41, 59]
    },
    columnStyles: {
      0: { cellWidth: 55 },
      1: { cellWidth: 65 },
      2: { cellWidth: 15, halign: 'center' },
      3: { cellWidth: 25, halign: 'right' },
      4: { cellWidth: 30, halign: 'right' }
    }
  });

  // 4. Financial Breakdown Box
  const finalY = doc.lastAutoTable.finalY + 8;
  const summaryX = 120;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Subtotal:', summaryX, finalY);
  doc.text(formatCurrency(subtotal), 195, finalY, { align: 'right' });

  if (discount > 0) {
    doc.setTextColor(6, 95, 70); // Emerald Green
    doc.text(`Promotional Discount:`, summaryX, finalY + 6);
    doc.text(`-${formatCurrency(discount)}`, 195, finalY + 6, { align: 'right' });
    doc.setTextColor(...darkColor);
  }

  const taxY = discount > 0 ? finalY + 12 : finalY + 6;
  doc.text('GST & Service Charges (5%):', summaryX, taxY);
  doc.text(formatCurrency(tax), 195, taxY, { align: 'right' });

  // Total Box
  const totalY = taxY + 6;
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(summaryX - 5, totalY - 4, 80, 12, 1, 1, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...emeraldColor);
  doc.text('TOTAL AMOUNT PAID:', summaryX, totalY + 4);
  doc.text(formatCurrency(total), 195, totalY + 4, { align: 'right' });

  // Payment Verification Box on Left
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...darkColor);
  doc.text(`Payment Status: SUCCESSFUL (PAID)`, 15, finalY);
  doc.text(`Payment Mode: ${booking.payment_method || 'Razorpay Online UPI'}`, 15, finalY + 6);
  doc.text(`Transaction Ref: ${booking.transaction_id || 'RZP_CONFIRMED'}`, 15, finalY + 12);
  doc.text(`Verification Pass: ${booking.booking_reference}`, 15, finalY + 18);

  // 5. Terms & Policy Notes
  const termsY = totalY + 22;
  doc.setFontSize(8);
  doc.setTextColor(...grayColor);
  doc.setFont('helvetica', 'bold');
  doc.text('QASWA HILLS DINING & CANCELLATION POLICIES (BIJAPUR):', 15, termsY);
  doc.setFont('helvetica', 'normal');
  doc.text('1. Please present this official digital invoice or the QR code at our host reception desk on arrival.', 15, termsY + 5);
  doc.text('2. Your reserved table will be held for up to 20 minutes past your scheduled reservation time.', 15, termsY + 9);
  doc.text('3. 100% of this advance table reservation fee is adjusted against your final food and beverage bill.', 15, termsY + 13);
  doc.text('4. Free cancellations are honored up to 4 hours prior to your scheduled dining slot.', 15, termsY + 17);

  // 6. Footer Thank You
  doc.setFillColor(...emeraldColor);
  doc.rect(0, 275, 210, 22, 'F');
  doc.setTextColor(243, 215, 126);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('Thank you for dining at Qaswa Hills Restaurant, Bijapur!', 105, 283, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(226, 232, 240);
  doc.text('Opposite Gol Gumbaz, Station Road, Vijayapura | Phone: +91 98450 78600 | reservations@qaswahills.com', 105, 289, { align: 'center' });

  // Save the PDF
  const filename = `${booking.booking_reference}_QaswaHills_Receipt.pdf`;
  doc.save(filename);
};
