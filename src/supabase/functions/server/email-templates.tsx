// Email Template Utilities for CREOVA
// Bilingual (EN/FR) email templates for booking confirmations, contact forms, etc.

import { escapeHtml, escapeHtmlAttr, escapeHtmlMultiline, safeCreovaUrl } from "./guards.ts";

export interface BookingEmailData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  service: string;
  package: string;
  preferredDate: string;
  preferredTime: string;
  location: string;
  numberOfPeople?: string;
  specialRequests?: string;
  amount: number;
  checkoutUrl?: string;
}

export interface ContactEmailData {
  name: string;
  email: string;
  phone?: string;
  service?: string;
  message: string;
  budget?: string;
  timeline?: string;
}

export interface CollaborationEmailData {
  name: string;
  email: string;
  organization?: string;
  collaborationType?: string;
  projectDescription: string;
  timeline?: string;
  budget?: string;
}

// Booking Confirmation Email - Customer (English)
export const bookingConfirmationEN = (data: BookingEmailData): string => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
      line-height: 1.6;
      color: #121212;
      margin: 0;
      padding: 0;
      background-color: #F8F9FA;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    .header {
      background-color: #121212;
      color: #F8F9FA;
      padding: 40px 30px;
      text-align: center;
    }
    .header h1 {
      margin: 0 0 10px 0;
      font-size: 32px;
      font-weight: 700;
      letter-spacing: 2px;
    }
    .header p {
      margin: 0;
      font-size: 16px;
      color: #D4A843;
    }
    .content {
      padding: 40px 30px;
    }
    .content h2 {
      color: #121212;
      font-size: 24px;
      margin: 0 0 20px 0;
    }
    .content p {
      color: #4A4A4A;
      margin: 0 0 20px 0;
    }
    .details-box {
      background-color: #F8F9FA;
      border-left: 4px solid #D4A843;
      padding: 20px;
      margin: 30px 0;
    }
    .details-box h3 {
      color: #121212;
      font-size: 18px;
      margin: 0 0 15px 0;
    }
    .details-box ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    .details-box li {
      padding: 8px 0;
      border-bottom: 1px solid #E0E0E0;
      color: #4A4A4A;
    }
    .details-box li:last-child {
      border-bottom: none;
    }
    .details-box strong {
      color: #121212;
      font-weight: 600;
    }
    .next-steps {
      background-color: #F8F9FA;
      padding: 20px;
      margin: 30px 0;
      border-radius: 4px;
    }
    .next-steps h3 {
      color: #121212;
      font-size: 18px;
      margin: 0 0 15px 0;
    }
    .next-steps ol {
      color: #4A4A4A;
      margin: 0;
      padding-left: 20px;
    }
    .next-steps li {
      margin-bottom: 10px;
    }
    .button {
      display: inline-block;
      background-color: #D4A843;
      color: #F8F9FA !important;
      padding: 14px 32px;
      text-decoration: none;
      border-radius: 4px;
      font-weight: 600;
      margin: 20px 0;
      text-align: center;
    }
    .footer {
      background-color: #121212;
      color: #E0E0E0;
      padding: 30px;
      text-align: center;
      font-size: 14px;
    }
    .footer a {
      color: #D4A843;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>CREOVA</h1>
      <p>Your Booking is Confirmed</p>
    </div>
    
    <div class="content">
      <h2>Thank you for choosing CREOVA! 🎬</h2>
      <p>We've received your booking request and are excited to work with you. Our team will review your details and contact you within 24 hours to confirm the final arrangements.</p>
      
      <div class="details-box">
        <h3>📋 Booking Details</h3>
        <ul>
          <li><strong>Service:</strong> ${escapeHtml(data.service)}</li>
          <li><strong>Package:</strong> ${escapeHtml(data.package)}</li>
          <li><strong>Preferred Date:</strong> ${escapeHtml(data.preferredDate)}</li>
          <li><strong>Preferred Time:</strong> ${escapeHtml(data.preferredTime)}</li>
          <li><strong>Location:</strong> ${escapeHtml(data.location)}</li>
          ${data.numberOfPeople ? `<li><strong>Number of People:</strong> ${escapeHtml(data.numberOfPeople)}</li>` : ''}
          ${Number(data.amount) > 0 ? `<li><strong>Deposit Amount:</strong> $${escapeHtml(data.amount)} CAD</li>` : ''}
        </ul>
      </div>
      
      ${data.specialRequests ? `
      <div class="details-box">
        <h3>💬 Special Requests</h3>
        <p style="margin: 0;">${escapeHtmlMultiline(data.specialRequests)}</p>
      </div>
      ` : ''}
      
      <div class="next-steps">
        <h3>✅ Next Steps</h3>
        <ol>
          <li>Complete your 50% deposit payment to secure your booking</li>
          <li>Our team will contact you within 24 hours to confirm details</li>
          <li>We'll send you a preparation guide before your session</li>
          <li>Get ready for an amazing creative experience!</li>
        </ol>
      </div>
      
      ${safeCreovaUrl(data.checkoutUrl) ? `
      <div style="text-align: center;">
        <a href="${safeCreovaUrl(data.checkoutUrl)}" class="button">Complete Payment</a>
      </div>
      ` : ''}
      
      <p><strong>Questions?</strong> Reply to this email or call us at <a href="tel:+14372608925" style="color: #D4A843;">+1 (437) 260-8925</a></p>
      
      <p style="margin-top: 30px;">Best regards,<br><strong>The CREOVA Team</strong><br>Ontario, Canada</p>
    </div>
    
    <div class="footer">
      <p><strong>CREOVA</strong> | Black-Led Creative Studio</p>
      <p>Ontario, Canada | <a href="mailto:support@creova.one">support@creova.one</a></p>
      <p style="margin-top: 15px; font-size: 12px; color: #777777;">
        © ${new Date().getFullYear()} CREOVA. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
};

// Booking Confirmation Email - Customer (French)
export const bookingConfirmationFR = (data: BookingEmailData): string => {
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
      line-height: 1.6;
      color: #121212;
      margin: 0;
      padding: 0;
      background-color: #F8F9FA;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    .header {
      background-color: #121212;
      color: #F8F9FA;
      padding: 40px 30px;
      text-align: center;
    }
    .header h1 {
      margin: 0 0 10px 0;
      font-size: 32px;
      font-weight: 700;
      letter-spacing: 2px;
    }
    .header p {
      margin: 0;
      font-size: 16px;
      color: #D4A843;
    }
    .content {
      padding: 40px 30px;
    }
    .content h2 {
      color: #121212;
      font-size: 24px;
      margin: 0 0 20px 0;
    }
    .content p {
      color: #4A4A4A;
      margin: 0 0 20px 0;
    }
    .details-box {
      background-color: #F8F9FA;
      border-left: 4px solid #D4A843;
      padding: 20px;
      margin: 30px 0;
    }
    .details-box h3 {
      color: #121212;
      font-size: 18px;
      margin: 0 0 15px 0;
    }
    .details-box ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    .details-box li {
      padding: 8px 0;
      border-bottom: 1px solid #E0E0E0;
      color: #4A4A4A;
    }
    .details-box li:last-child {
      border-bottom: none;
    }
    .details-box strong {
      color: #121212;
      font-weight: 600;
    }
    .next-steps {
      background-color: #F8F9FA;
      padding: 20px;
      margin: 30px 0;
      border-radius: 4px;
    }
    .next-steps h3 {
      color: #121212;
      font-size: 18px;
      margin: 0 0 15px 0;
    }
    .next-steps ol {
      color: #4A4A4A;
      margin: 0;
      padding-left: 20px;
    }
    .next-steps li {
      margin-bottom: 10px;
    }
    .button {
      display: inline-block;
      background-color: #D4A843;
      color: #F8F9FA !important;
      padding: 14px 32px;
      text-decoration: none;
      border-radius: 4px;
      font-weight: 600;
      margin: 20px 0;
      text-align: center;
    }
    .footer {
      background-color: #121212;
      color: #E0E0E0;
      padding: 30px;
      text-align: center;
      font-size: 14px;
    }
    .footer a {
      color: #D4A843;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>CREOVA</h1>
      <p>Votre Réservation est Confirmée</p>
    </div>
    
    <div class="content">
      <h2>Merci d'avoir choisi CREOVA! 🎬</h2>
      <p>Nous avons reçu votre demande de réservation et sommes ravis de travailler avec vous. Notre équipe examinera vos détails et vous contactera dans les 24 heures pour confirmer les arrangements finaux.</p>
      
      <div class="details-box">
        <h3>📋 Détails de la Réservation</h3>
        <ul>
          <li><strong>Service:</strong> ${escapeHtml(data.service)}</li>
          <li><strong>Forfait:</strong> ${escapeHtml(data.package)}</li>
          <li><strong>Date Préférée:</strong> ${escapeHtml(data.preferredDate)}</li>
          <li><strong>Heure Préférée:</strong> ${escapeHtml(data.preferredTime)}</li>
          <li><strong>Lieu:</strong> ${escapeHtml(data.location)}</li>
          ${data.numberOfPeople ? `<li><strong>Nombre de Personnes:</strong> ${escapeHtml(data.numberOfPeople)}</li>` : ''}
          ${Number(data.amount) > 0 ? `<li><strong>Montant du Dépôt:</strong> ${escapeHtml(data.amount)} $ CAD</li>` : ''}
        </ul>
      </div>
      
      ${data.specialRequests ? `
      <div class="details-box">
        <h3>💬 Demandes Spéciales</h3>
        <p style="margin: 0;">${escapeHtmlMultiline(data.specialRequests)}</p>
      </div>
      ` : ''}
      
      <div class="next-steps">
        <h3>✅ Prochaines Étapes</h3>
        <ol>
          <li>Complétez votre paiement de dépôt de 50% pour sécuriser votre réservation</li>
          <li>Notre équipe vous contactera dans les 24 heures pour confirmer les détails</li>
          <li>Nous vous enverrons un guide de préparation avant votre session</li>
          <li>Préparez-vous pour une expérience créative incroyable!</li>
        </ol>
      </div>
      
      ${safeCreovaUrl(data.checkoutUrl) ? `
      <div style="text-align: center;">
        <a href="${safeCreovaUrl(data.checkoutUrl)}" class="button">Compléter le Paiement</a>
      </div>
      ` : ''}
      
      <p><strong>Des questions?</strong> Répondez à cet email ou appelez-nous au <a href="tel:+14372608925" style="color: #D4A843;">+1 (437) 260-8925</a></p>
      
      <p style="margin-top: 30px;">Cordialement,<br><strong>L'Équipe CREOVA</strong><br>Ontario, Canada</p>
    </div>
    
    <div class="footer">
      <p><strong>CREOVA</strong> | Studio Créatif Dirigé par des Noirs</p>
      <p>Ontario, Canada | <a href="mailto:support@creova.one">support@creova.one</a></p>
      <p style="margin-top: 15px; font-size: 12px; color: #777777;">
        © ${new Date().getFullYear()} CREOVA. Tous droits réservés.
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
};

// Admin Booking Notification Email
export const adminBookingNotification = (data: BookingEmailData): string => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
      line-height: 1.6;
      color: #121212;
      background-color: #F8F9FA;
      padding: 20px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .header {
      background: linear-gradient(135deg, #121212 0%, #2A2A2A 100%);
      color: #F8F9FA;
      padding: 30px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
    }
    .content {
      padding: 30px;
    }
    .alert-box {
      background-color: #FFF4E6;
      border-left: 4px solid #D4A843;
      padding: 15px;
      margin: 20px 0;
    }
    .info-grid {
      display: grid;
      grid-template-columns: 140px 1fr;
      gap: 12px;
      margin: 20px 0;
    }
    .info-label {
      font-weight: 600;
      color: #121212;
    }
    .info-value {
      color: #4A4A4A;
    }
    .action-box {
      background-color: #E8F5E9;
      border-radius: 4px;
      padding: 20px;
      margin: 20px 0;
    }
    .action-box h3 {
      margin: 0 0 10px 0;
      color: #2E7D32;
    }
    .action-box ul {
      margin: 0;
      padding-left: 20px;
      color: #4A4A4A;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎬 New Booking Received</h1>
    </div>
    
    <div class="content">
      <div class="alert-box">
        <strong>⏰ Action Required:</strong> Contact customer within 24 hours to confirm booking details and availability.
      </div>
      
      <h2>Customer Information</h2>
      <div class="info-grid">
        <div class="info-label">Name:</div>
        <div class="info-value">${escapeHtml(data.customerName)}</div>
        
        <div class="info-label">Email:</div>
        <div class="info-value"><a href="mailto:${escapeHtmlAttr(data.customerEmail)}">${escapeHtml(data.customerEmail)}</a></div>
        
        <div class="info-label">Phone:</div>
        <div class="info-value"><a href="tel:${escapeHtmlAttr(data.customerPhone)}">${escapeHtml(data.customerPhone)}</a></div>
      </div>
      
      <h2>Booking Details</h2>
      <div class="info-grid">
        <div class="info-label">Service:</div>
        <div class="info-value"><strong>${escapeHtml(data.service)}</strong></div>
        
        <div class="info-label">Package:</div>
        <div class="info-value">${escapeHtml(data.package)}</div>
        
        <div class="info-label">Preferred Date:</div>
        <div class="info-value"><strong>${escapeHtml(data.preferredDate)}</strong></div>
        
        <div class="info-label">Preferred Time:</div>
        <div class="info-value"><strong>${escapeHtml(data.preferredTime)}</strong></div>
        
        <div class="info-label">Location:</div>
        <div class="info-value">${escapeHtml(data.location)}</div>
        
        ${data.numberOfPeople ? `
        <div class="info-label">Number of People:</div>
        <div class="info-value">${escapeHtml(data.numberOfPeople)}</div>
        ` : ''}
        
        ${Number(data.amount) > 0 ? `
        <div class="info-label">Deposit Amount:</div>
        <div class="info-value"><strong style="color: #2E7D32; font-size: 18px;">$${escapeHtml(data.amount)} CAD</strong></div>
        ` : ''}
      </div>
      
      ${data.specialRequests ? `
      <h2>Special Requests</h2>
      <div style="background-color: #F8F9FA; padding: 15px; border-radius: 4px;">
        ${escapeHtmlMultiline(data.specialRequests)}
      </div>
      ` : ''}
      
      <div class="action-box">
        <h3>✅ Action Checklist</h3>
        <ul>
          <li>Contact customer within 24 hours</li>
          <li>Verify date/time availability in calendar</li>
          <li>Send Google Calendar invite</li>
          <li>Confirm deposit payment received</li>
          <li>Send preparation guide to customer</li>
          <li>Add to booking management system</li>
        </ul>
      </div>
      
      <p style="text-align: center; margin-top: 30px;">
        <a href="https://creova.one/admin/bookings" style="display: inline-block; background-color: #121212; color: #F8F9FA; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: 600;">View in Admin Dashboard</a>
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
};

// Contact Form - Admin Notification
export const adminContactNotification = (data: ContactEmailData): string => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
      line-height: 1.6;
      color: #121212;
      background-color: #F8F9FA;
      padding: 20px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
    }
    .header {
      background-color: #121212;
      color: #F8F9FA;
      padding: 30px;
      text-align: center;
    }
    .content {
      padding: 30px;
    }
    .info-grid {
      display: grid;
      grid-template-columns: 120px 1fr;
      gap: 12px;
      margin: 20px 0;
    }
    .info-label {
      font-weight: 600;
      color: #121212;
    }
    .message-box {
      background-color: #F8F9FA;
      padding: 20px;
      border-radius: 4px;
      margin: 20px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📧 New Contact Form Submission</h1>
    </div>
    
    <div class="content">
      <h2>Contact Information</h2>
      <div class="info-grid">
        <div class="info-label">Name:</div>
        <div>${escapeHtml(data.name)}</div>
        
        <div class="info-label">Email:</div>
        <div><a href="mailto:${escapeHtmlAttr(data.email)}">${escapeHtml(data.email)}</a></div>
        
        ${data.phone ? `
        <div class="info-label">Phone:</div>
        <div><a href="tel:${escapeHtmlAttr(data.phone)}">${escapeHtml(data.phone)}</a></div>
        ` : ''}
        
        ${data.service ? `
        <div class="info-label">Service:</div>
        <div><strong>${escapeHtml(data.service)}</strong></div>
        ` : ''}
        
        ${data.budget ? `
        <div class="info-label">Budget:</div>
        <div>${escapeHtml(data.budget)}</div>
        ` : ''}
        
        ${data.timeline ? `
        <div class="info-label">Timeline:</div>
        <div>${escapeHtml(data.timeline)}</div>
        ` : ''}
      </div>
      
      <h2>Message</h2>
      <div class="message-box">
        ${escapeHtmlMultiline(data.message)}
      </div>
      
      <p style="margin-top: 30px;"><strong>⏰ Action Required:</strong> Respond within 24 hours</p>
    </div>
  </div>
</body>
</html>
  `.trim();
};

// Collaboration Form - Admin Notification
export const adminCollaborationNotification = (data: CollaborationEmailData): string => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
      line-height: 1.6;
      color: #121212;
      background-color: #F8F9FA;
      padding: 20px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #D4A843 0%, #B1643B 100%);
      color: #F8F9FA;
      padding: 30px;
      text-align: center;
    }
    .content {
      padding: 30px;
    }
    .info-grid {
      display: grid;
      grid-template-columns: 160px 1fr;
      gap: 12px;
      margin: 20px 0;
    }
    .info-label {
      font-weight: 600;
      color: #121212;
    }
    .message-box {
      background-color: #F8F9FA;
      padding: 20px;
      border-radius: 4px;
      margin: 20px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🤝 New Collaboration Request</h1>
    </div>
    
    <div class="content">
      <h2>Partner Information</h2>
      <div class="info-grid">
        <div class="info-label">Name:</div>
        <div>${escapeHtml(data.name)}</div>
        
        <div class="info-label">Email:</div>
        <div><a href="mailto:${escapeHtmlAttr(data.email)}">${escapeHtml(data.email)}</a></div>
        
        ${data.organization ? `
        <div class="info-label">Organization:</div>
        <div><strong>${escapeHtml(data.organization)}</strong></div>
        ` : ''}
        
        ${data.collaborationType ? `
        <div class="info-label">Collaboration Type:</div>
        <div>${escapeHtml(data.collaborationType)}</div>
        ` : ''}
        
        ${data.timeline ? `
        <div class="info-label">Timeline:</div>
        <div>${escapeHtml(data.timeline)}</div>
        ` : ''}
        
        ${data.budget ? `
        <div class="info-label">Budget:</div>
        <div>${escapeHtml(data.budget)}</div>
        ` : ''}
      </div>
      
      <h2>Project Description</h2>
      <div class="message-box">
        ${escapeHtmlMultiline(data.projectDescription)}
      </div>
      
      <p style="margin-top: 30px;"><strong>⏰ Priority:</strong> Review and respond within 48 hours</p>
    </div>
  </div>
</body>
</html>
  `.trim();
};

// Helper function to get the right template based on language
export const getBookingConfirmationTemplate = (language: string, data: BookingEmailData): string => {
  return language === 'fr' ? bookingConfirmationFR(data) : bookingConfirmationEN(data);
};
