/**
 * MELCHO THE DESSERTS - BACKEND INVOICING & MAIL SYSTEM TEMPLATE
 * 
 * This file contains implementation templates for:
 * 1. Generating a professional PDF invoice using PDFKit.
 * 2. Sending that generated PDF as an email attachment using Nodemailer.
 * 
 * Packages required: npm install pdfkit nodemailer @types/nodemailer @types/pdfkit
 */

import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';
import nodemailer from 'nodemailer';
import { IOrder, IUser } from './order-db';

// ====================================================
// 1. PDF RECEIPT GENERATION FUNCTION (PDFKit)
// ====================================================

/**
 * Compiles order data and constructs a beautiful branded PDF receipt.
 * @param order Order object details
 * @param user Customer profile details
 * @param outputPath Local path where PDF file should be saved temporarily
 */
export async function generateInvoicePDF(
  order: Partial<IOrder>, 
  user: Partial<IUser>, 
  outputPath: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: 'A4' });

    // Stream document buffer to a local file
    const writeStream = fs.createWriteStream(outputPath);
    doc.pipe(writeStream);

    // Styling Palette
    const primaryDark = '#120907';
    const accentGold = '#b8860b';
    const mutedGray = '#666666';

    // -----------------------------------
    // A. HEADER: Logo and Invoice details
    // -----------------------------------
    doc
      .fillColor(primaryDark)
      .fontSize(26)
      .font('Helvetica-Bold')
      .text('Melcho', 50, 50);
    
    doc
      .fontSize(8)
      .fillColor(accentGold)
      .font('Helvetica')
      .text('THE DESSERTS BOUTIQUE', 50, 78, { characterSpacing: 2 });

    doc
      .fontSize(9)
      .fillColor(mutedGray)
      .text('Rams VSR Apartments, Moghalrajpuram\nVijayawada, AP - 520010\nGSTIN: 37AAAAAM1026D1Z5', 50, 95);

    // Top Right Invoice Info
    doc
      .fillColor(primaryDark)
      .fontSize(16)
      .font('Helvetica-Bold')
      .text('TAX INVOICE', 350, 50, { align: 'right' });
    
    doc
      .fontSize(9)
      .font('Helvetica')
      .fillColor(mutedGray)
      .text(`Invoice No: #INV-${order.orderNumber?.replace('MLC-', '')}\nDate: ${new Date(order.createdAt || '').toLocaleDateString()}\nStatus: PAID`, 350, 75, { align: 'right' });

    doc.moveDown(4);
    doc.strokeColor('#dddddd').lineWidth(1).moveTo(50, 150).lineTo(550, 150).stroke();

    // -----------------------------------
    // B. BILL TO / DETAILS
    // -----------------------------------
    const yCustomerDetails = 170;
    doc
      .fontSize(10)
      .font('Helvetica-Bold')
      .fillColor(accentGold)
      .text('CUSTOMER INFO', 50, yCustomerDetails);
    
    doc
      .fontSize(9)
      .font('Helvetica')
      .fillColor(primaryDark)
      .text(`${user.fullName}\nEmail: ${user.email}\nPhone: ${user.phone}`, 50, yCustomerDetails + 18);

    doc
      .fontSize(10)
      .font('Helvetica-Bold')
      .fillColor(accentGold)
      .text('ORDER INFO', 350, yCustomerDetails);
    
    doc
      .fontSize(9)
      .font('Helvetica')
      .fillColor(primaryDark)
      .text(`Order ID: ${order.orderNumber}\nPayment: ${order.paymentMethod}\nDeliver Address: ${order.deliveryAddress}`, 350, yCustomerDetails + 18);

    doc.moveDown(6);

    // -----------------------------------
    // C. BILLING ITEMS TABLE
    // -----------------------------------
    let yTable = 270;
    
    // Headers
    doc
      .rect(50, yTable, 500, 20)
      .fill('#f8f8f8');
    
    doc
      .fillColor(primaryDark)
      .font('Helvetica-Bold')
      .fontSize(8)
      .text('Item Description', 60, yTable + 6)
      .text('Qty', 320, yTable + 6, { width: 30, align: 'center' })
      .text('Price', 380, yTable + 6, { width: 70, align: 'right' })
      .text('Total', 470, yTable + 6, { width: 70, align: 'right' });

    yTable += 20;

    // Table rows
    doc.font('Helvetica').fontSize(9);
    (order.items || []).forEach(item => {
      doc
        .fillColor(primaryDark)
        .text(item.name, 60, yTable + 10)
        .text(item.quantity.toString(), 320, yTable + 10, { width: 30, align: 'center' })
        .text(`Rs. ${item.price.toFixed(2)}`, 380, yTable + 10, { width: 70, align: 'right' })
        .text(`Rs. ${(item.price * item.quantity).toFixed(2)}`, 470, yTable + 10, { width: 70, align: 'right' });

      yTable += 25;
      doc.strokeColor('#eeeeee').lineWidth(0.5).moveTo(50, yTable).lineTo(550, yTable).stroke();
    });

    // -----------------------------------
    // D. TOTALS BOX
    // -----------------------------------
    yTable += 10;
    
    const subtotal = order.totalAmount! - order.gst! - order.deliveryCharge! + order.discount!;
    
    doc.fontSize(9);
    doc.text('Subtotal:', 350, yTable, { width: 100, align: 'right' });
    doc.text(`Rs. ${subtotal.toFixed(2)}`, 470, yTable, { width: 70, align: 'right' });

    yTable += 15;
    doc.text('GST (18% incl.):', 350, yTable, { width: 100, align: 'right' });
    doc.text(`Rs. ${order.gst?.toFixed(2)}`, 470, yTable, { width: 70, align: 'right' });

    yTable += 15;
    doc.text('Delivery Fee:', 350, yTable, { width: 100, align: 'right' });
    doc.text(`Rs. ${order.deliveryCharge?.toFixed(2)}`, 470, yTable, { width: 70, align: 'right' });

    if (order.discount && order.discount > 0) {
      yTable += 15;
      doc.fillColor('#22c55e').text('Promo Discount:', 350, yTable, { width: 100, align: 'right' });
      doc.text(`-Rs. ${order.discount?.toFixed(2)}`, 470, yTable, { width: 70, align: 'right' });
      doc.fillColor(primaryDark);
    }

    yTable += 20;
    doc.strokeColor('#dddddd').lineWidth(1).moveTo(350, yTable).lineTo(550, yTable).stroke();

    yTable += 8;
    doc.font('Helvetica-Bold').fontSize(11);
    doc.text('Total Amount Paid:', 320, yTable, { width: 130, align: 'right' });
    doc.text(`Rs. ${order.totalAmount?.toFixed(2)}`, 470, yTable, { width: 70, align: 'right' });

    // Footer note
    doc
      .font('Helvetica-Oblique')
      .fontSize(8)
      .fillColor(mutedGray)
      .text('This is a system generated digital invoice. Thank you for ordering at Melcho The Desserts!', 50, 750, { align: 'center' });

    doc.end();

    writeStream.on('finish', () => {
      resolve(outputPath);
    });

    writeStream.on('error', (err) => {
      reject(err);
    });
  });
}

// ====================================================
// 2. EMAIL SYSTEM (Nodemailer automation)
// ====================================================

/**
 * Sends order confirmation email to the user with the invoice PDF attached.
 */
export async function sendInvoiceEmail(
  userEmail: string,
  userName: string,
  orderNumber: string,
  pdfAttachmentPath: string
) {
  // 1. Setup email transporter (using SMTP Gmail / Resend example)
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.MAIL_PORT || '587'),
    secure: process.env.MAIL_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.MAIL_USER, // Your email address
      pass: process.env.MAIL_PASSWORD, // Your app-specific password
    },
  });

  // 2. Draft email details
  const mailOptions = {
    from: '"Melcho The Desserts" <no-reply@melchodesserts.in>',
    to: userEmail,
    subject: `🧁 Melcho Order Confirmation - Invoice ${orderNumber}`,
    html: `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5c07b; border-radius: 12px; background-color: #faf5ef; color: #120907;">
        <h1 style="color: #120907; font-family: Georgia, serif; text-align: center; border-bottom: 2px solid #e5c07b; padding-bottom: 15px;">Your Sweet Cravings Are Cooking!</h1>
        <p>Dear ${userName},</p>
        <p>Thank you for placing your order at <strong>Melcho The Desserts</strong>! We've received your order, and our pastry chefs are already crafting your sweet masterpiece.</p>
        <p>You can find the details of your transaction below. We've attached your official Tax Invoice PDF receipt to this email.</p>
        
        <div style="background-color: rgba(28, 14, 10, 0.05); padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #b8860b;">
          <h3 style="margin-top: 0; color: #b8860b;">Order Summary</h3>
          <p style="margin: 5px 0;"><strong>Order Reference:</strong> ${orderNumber}</p>
          <p style="margin: 5px 0;"><strong>Estimated Delivery:</strong> 30 - 45 Minutes via Rapido</p>
        </div>

        <p>If you'd like to track your order in real-time, please log in to your <a href="https://melchodesserts.in/profile" style="color: #b8860b; font-weight: bold; text-decoration: none;">Melcho Lounge Dashboard</a>.</p>
        <p style="margin-top: 30px; text-align: center; color: #666666; font-size: 11px;">
          Ground Floor, Rams VSR Apartments, Moghalrajpuram, Vijayawada<br/>
          Open daily from 5:30 PM until Midnight
        </p>
      </div>
    `,
    attachments: [
      {
        filename: `Melcho_Invoice_${orderNumber}.pdf`,
        path: pdfAttachmentPath, // Local absolute path of generated PDF
      },
    ],
  };

  // 3. Send email
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Invoice email dispatched successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error dispatching invoice email:', error);
    throw error;
  }
}
