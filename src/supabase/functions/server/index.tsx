import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Security: Rate limiting map (in-memory, simple implementation)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

// Security: Rate limiting middleware
const rateLimit = (maxRequests: number, windowMs: number) => {
  return async (c: any, next: any) => {
    const ip = c.req.header('x-forwarded-for') || c.req.header('x-real-ip') || 'unknown';
    const now = Date.now();
    const key = `${ip}:${c.req.path}`;
    
    const record = rateLimitMap.get(key);
    
    if (record && now < record.resetTime) {
      if (record.count >= maxRequests) {
        console.log(`Rate limit exceeded for ${ip} on ${c.req.path}`);
        return c.json({ error: 'Too many requests. Please try again later.' }, 429);
      }
      record.count++;
    } else {
      rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
    }
    
    // Clean up old entries
    if (rateLimitMap.size > 10000) {
      for (const [k, v] of rateLimitMap.entries()) {
        if (now > v.resetTime) rateLimitMap.delete(k);
      }
    }
    
    await next();
  };
};

// Security: Add security headers middleware
app.use('*', async (c, next) => {
  await next();
  
  // Security headers
  c.header('X-Content-Type-Options', 'nosniff');
  c.header('X-Frame-Options', 'DENY');
  c.header('X-XSS-Protection', '1; mode=block');
  c.header('Referrer-Policy', 'strict-origin-when-cross-origin');
  c.header('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  
  // Strict-Transport-Security (HSTS) - Force HTTPS for 1 year
  c.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  
  // Content Security Policy (CSP)
  c.header(
    'Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://*.supabase.co https://www.google.com https://www.gstatic.com; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data: https: blob:; " +
    "font-src 'self' data:; " +
    "connect-src 'self' https://*.stripe.com https://*.supabase.co https://www.google.com; " +
    "frame-src https://js.stripe.com https://hooks.stripe.com https://www.google.com; " +
    "base-uri 'self'; " +
    "form-action 'self' https://checkout.stripe.com;"
  );
});

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-feacf0d8/health", (c) => {
  return c.json({ status: "ok" });
});

// Audit log endpoint - Store security audit logs
app.post("/make-server-feacf0d8/audit-log", async (c) => {
  try {
    const body = await c.req.json();
    const { timestamp, eventType, userId, email, ip, userAgent, details, severity, endpoint, statusCode } = body;

    // Store audit log in key-value store
    const logId = `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    await kv.set(logId, {
      timestamp,
      eventType,
      userId,
      email,
      ip,
      userAgent,
      details,
      severity,
      endpoint,
      statusCode,
      created_at: new Date().toISOString()
    });

    // Log critical events to console immediately
    if (severity === 'critical' || severity === 'high') {
      console.warn(`🚨 [${severity.toUpperCase()}] ${eventType}:`, {
        timestamp,
        userId,
        email,
        details
      });
    }

    return c.json({ status: 'success', logId });
  } catch (error) {
    console.error("Error storing audit log:", error);
    return c.json({ error: "Failed to store audit log" }, 500);
  }
});

// Security alert endpoint - Handle critical security events
app.post("/make-server-feacf0d8/security-alert", async (c) => {
  try {
    const body = await c.req.json();
    const { alert, log } = body;

    console.error(`🚨🚨🚨 CRITICAL SECURITY ALERT: ${alert}`, {
      eventType: log.eventType,
      timestamp: log.timestamp,
      ip: log.ip,
      details: log.details
    });

    // Store alert
    const alertId = `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    await kv.set(alertId, {
      alert,
      log,
      created_at: new Date().toISOString(),
      status: 'new'
    });

    // In production, you would:
    // 1. Send email to security team
    // 2. Send SMS/push notification
    // 3. Create incident ticket
    // 4. Trigger automated response

    return c.json({ status: 'alert_received', alertId });
  } catch (error) {
    console.error("Error handling security alert:", error);
    return c.json({ error: "Failed to process security alert" }, 500);
  }
});

// Export audit logs endpoint (admin only - add auth in production)
app.get("/make-server-feacf0d8/audit-logs/export", async (c) => {
  try {
    const startDate = c.req.query('startDate');
    const endDate = c.req.query('endDate');
    const eventTypes = c.req.query('eventTypes')?.split(',');

    // Get all audit logs
    const logs = await kv.getByPrefix('audit_');
    
    // Filter by date range and event types
    const filtered = logs.filter((log: any) => {
      const logDate = new Date(log.timestamp);
      const inRange = (!startDate || logDate >= new Date(startDate)) &&
                      (!endDate || logDate <= new Date(endDate));
      const matchesType = !eventTypes || eventTypes.includes(log.eventType);
      return inRange && matchesType;
    });

    console.log(`Exporting ${filtered.length} audit logs`);

    return c.json({
      logs: filtered,
      exportDate: new Date().toISOString(),
      count: filtered.length
    });
  } catch (error) {
    console.error("Error exporting audit logs:", error);
    return c.json({ error: "Failed to export audit logs" }, 500);
  }
});

// Create booking for services
app.post("/make-server-feacf0d8/create-booking", async (c) => {
  try {
    const body = await c.req.json();
    const { service, customer_info, booking_details, amount, currency = 'cad' } = body;

    const bookingId = `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    await kv.set(bookingId, {
      service,
      customer_info,
      booking_details,
      amount,
      currency,
      status: 'pending',
      created_at: new Date().toISOString()
    });

    console.log(`Created booking: ${bookingId}`);

    return c.json({
      bookingId,
      status: 'success',
      message: 'Booking created successfully'
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    return c.json({ error: "Failed to create booking: " + error.message }, 500);
  }
});

// Create equipment rental
app.post("/make-server-feacf0d8/create-rental", async (c) => {
  try {
    const body = await c.req.json();
    const { equipment, customer_info, rental_details, amount, currency = 'cad' } = body;

    const rentalId = `rental_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    await kv.set(rentalId, {
      equipment,
      customer_info,
      rental_details,
      amount,
      currency,
      status: 'pending',
      created_at: new Date().toISOString()
    });

    console.log(`Created rental: ${rentalId}`);

    return c.json({
      rentalId,
      status: 'success',
      message: 'Rental created successfully'
    });
  } catch (error) {
    console.error("Error creating rental:", error);
    return c.json({ error: "Failed to create rental: " + error.message }, 500);
  }
});

// Create event ticket purchase
app.post("/make-server-feacf0d8/create-ticket", async (c) => {
  try {
    const body = await c.req.json();
    const { event_id, customer_info, ticket_details, amount, currency = 'cad' } = body;

    const ticketId = `ticket_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    await kv.set(ticketId, {
      event_id,
      customer_info,
      ticket_details,
      amount,
      currency,
      status: 'pending',
      created_at: new Date().toISOString()
    });

    console.log(`Created ticket: ${ticketId}`);

    return c.json({
      ticketId,
      status: 'success',
      message: 'Ticket purchased successfully'
    });
  } catch (error) {
    console.error("Error creating ticket:", error);
    return c.json({ error: "Failed to create ticket: " + error.message }, 500);
  }
});

// Create Payment Intent endpoint
app.post("/make-server-feacf0d8/create-payment-intent", rateLimit(10, 60000), async (c) => {
  try {
    const body = await c.req.json();
    const { amount, currency, customer_info, items } = body;

    // Get Stripe secret key from environment
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    
    if (!stripeSecretKey) {
      console.error("STRIPE_SECRET_KEY not found in environment variables");
      return c.json({ error: "Payment configuration error" }, 500);
    }

    // Create payment intent with Stripe
    const response = await fetch("https://api.stripe.com/v1/payment_intents", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${stripeSecretKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        amount: amount.toString(),
        currency: currency,
        "automatic_payment_methods[enabled]": "true",
        "metadata[customer_name]": customer_info.name,
        "metadata[customer_email]": customer_info.email,
        "metadata[order_items]": JSON.stringify(items),
      }),
    });

    const paymentIntent = await response.json();

    if (!response.ok) {
      console.error("Stripe API error:", paymentIntent);
      return c.json({ error: "Failed to create payment intent" }, 500);
    }

    // Store order in key-value store
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    await kv.set(orderId, {
      payment_intent_id: paymentIntent.id,
      amount,
      currency,
      customer_info,
      items,
      status: 'pending',
      created_at: new Date().toISOString()
    });

    console.log(`Created payment intent: ${paymentIntent.id} for order: ${orderId}`);

    return c.json({
      clientSecret: paymentIntent.client_secret,
      orderId: orderId
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    return c.json({ error: "Internal server error: " + error.message }, 500);
  }
});

// Webhook endpoint for Stripe events (optional but recommended)
app.post("/make-server-feacf0d8/stripe-webhook", async (c) => {
  try {
    const signature = c.req.header("stripe-signature");
    const body = await c.req.text();
    
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    
    if (!webhookSecret) {
      console.error("STRIPE_WEBHOOK_SECRET not configured");
      return c.json({ error: "Webhook not configured" }, 500);
    }

    // Verify webhook signature
    // Note: In production, you should verify the signature using Stripe's library
    // For now, we'll just parse the event
    const event = JSON.parse(body);

    console.log("Received Stripe webhook:", event.type);

    // Handle different event types
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object;
        console.log(`Payment succeeded: ${paymentIntent.id}`);
        
        // Update order status
        const orders = await kv.getByPrefix("order_");
        for (const order of orders) {
          if (order.payment_intent_id === paymentIntent.id) {
            await kv.set(order.key, {
              ...order,
              status: 'completed',
              completed_at: new Date().toISOString()
            });
            console.log(`Updated order ${order.key} to completed`);
          }
        }
        break;

      case "payment_intent.payment_failed":
        const failedPayment = event.data.object;
        console.log(`Payment failed: ${failedPayment.id}`);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return c.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return c.json({ error: "Webhook processing error" }, 400);
  }
});

// Email notification signup (for product launches, memberships, etc.)
app.post("/make-server-feacf0d8/notify-me", async (c) => {
  try {
    const body = await c.req.json();
    const { email, type, item_id } = body; // type: 'membership', 'product', 'event', etc.

    if (!email || !type) {
      return c.json({ error: "Email and type are required" }, 400);
    }

    const notificationId = `notification_${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    await kv.set(notificationId, {
      email,
      type,
      item_id,
      status: 'subscribed',
      created_at: new Date().toISOString()
    });

    console.log(`Email notification signup: ${email} for ${type}`);

    return c.json({
      status: 'success',
      message: 'Successfully subscribed to notifications'
    });
  } catch (error) {
    console.error("Error saving notification signup:", error);
    return c.json({ error: "Failed to subscribe: " + error.message }, 500);
  }
});

// Create pre-order
app.post("/make-server-feacf0d8/create-preorder", async (c) => {
  try {
    const body = await c.req.json();
    const { product_id, customer_info, quantity, total_amount } = body;

    const preorderId = `preorder_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    await kv.set(preorderId, {
      product_id,
      customer_info,
      quantity,
      total_amount,
      status: 'pending_payment',
      created_at: new Date().toISOString()
    });

    console.log(`Created pre-order: ${preorderId}`);

    return c.json({
      preorderId,
      status: 'success',
      message: 'Pre-order created successfully'
    });
  } catch (error) {
    console.error("Error creating pre-order:", error);
    return c.json({ error: "Failed to create pre-order: " + error.message }, 500);
  }
});

// Purchase digital product
app.post("/make-server-feacf0d8/purchase-digital-product", async (c) => {
  try {
    const body = await c.req.json();
    const { product_id, customer_info, amount, payment_intent_id } = body;

    const purchaseId = `digital_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    await kv.set(purchaseId, {
      product_id,
      customer_info,
      amount,
      payment_intent_id,
      status: 'completed',
      download_token: `token_${Math.random().toString(36).substr(2, 16)}`,
      created_at: new Date().toISOString()
    });

    console.log(`Digital product purchased: ${purchaseId}`);

    return c.json({
      purchaseId,
      download_token: `token_${Math.random().toString(36).substr(2, 16)}`,
      status: 'success',
      message: 'Digital product purchased successfully'
    });
  } catch (error) {
    console.error("Error purchasing digital product:", error);
    return c.json({ error: "Failed to purchase digital product: " + error.message }, 500);
  }
});

// Subscribe to lead magnet
app.post("/make-server-feacf0d8/subscribe-lead-magnet", rateLimit(3, 60000), async (c) => {
  try {
    const body = await c.req.json();
    const { email, name, leadMagnetId, leadMagnetTitle, subscribedAt } = body;

    if (!email || !name || !leadMagnetId) {
      return c.json({ error: "Email, name, and lead magnet ID are required" }, 400);
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return c.json({ error: "Invalid email format" }, 400);
    }

    const subscriptionId = `lead_magnet_${leadMagnetId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    await kv.set(subscriptionId, {
      email,
      name,
      leadMagnetId,
      leadMagnetTitle,
      subscribedAt: subscribedAt || new Date().toISOString(),
      status: 'subscribed'
    });

    console.log(`Lead magnet subscription: ${email} for ${leadMagnetTitle}`);

    // TODO: Send email with download link using your email service
    // Example: await sendLeadMagnetEmail(email, name, leadMagnetTitle);

    return c.json({
      status: 'success',
      message: 'Successfully subscribed! Check your email for the download link.',
      subscriptionId
    });
  } catch (error) {
    console.error("Error subscribing to lead magnet:", error);
    return c.json({ error: "Failed to subscribe: " + error.message }, 500);
  }
});

// Purchase event ticket with payment
app.post("/make-server-feacf0d8/purchase-event-ticket", async (c) => {
  try {
    const body = await c.req.json();
    const { event_id, customer_info, quantity, total_amount, payment_intent_id } = body;

    const ticketId = `ticket_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    await kv.set(ticketId, {
      event_id,
      customer_info,
      quantity,
      total_amount,
      payment_intent_id,
      status: 'confirmed',
      ticket_code: `CREOVA-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
      created_at: new Date().toISOString()
    });

    console.log(`Event ticket purchased: ${ticketId}`);

    return c.json({
      ticketId,
      ticket_code: `CREOVA-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
      status: 'success',
      message: 'Event ticket purchased successfully'
    });
  } catch (error) {
    console.error("Error purchasing event ticket:", error);
    return c.json({ error: "Failed to purchase event ticket: " + error.message }, 500);
  }
});

// Create membership subscription
app.post("/make-server-feacf0d8/create-membership", async (c) => {
  try {
    const body = await c.req.json();
    const { membership_type, customer_info, payment_intent_id } = body; // 'creator' or 'legacy'

    const membershipId = `membership_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    await kv.set(membershipId, {
      membership_type,
      customer_info,
      payment_intent_id,
      status: 'active',
      member_number: `CM-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      created_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() // 1 year
    });

    console.log(`Membership created: ${membershipId}`);

    return c.json({
      membershipId,
      member_number: `CM-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      status: 'success',
      message: 'Membership created successfully'
    });
  } catch (error) {
    console.error("Error creating membership:", error);
    return c.json({ error: "Failed to create membership: " + error.message }, 500);
  }
});

// Create Stripe Subscription Checkout Session for Memberships
app.post("/make-server-feacf0d8/create-subscription-checkout", rateLimit(5, 60000), async (c) => {
  try {
    const body = await c.req.json();
    const { membership_type, customer_email, customer_name } = body; // 'creator' or 'legacy'

    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    
    if (!stripeSecretKey) {
      console.error("STRIPE_SECRET_KEY not found in environment variables");
      return c.json({ error: "Payment configuration error" }, 500);
    }

    // Define pricing for each membership tier
    const membershipPricing = {
      creator: {
        price: 19900, // $199 CAD in cents
        name: "CREOVA Creator Membership"
      },
      legacy: {
        price: 49900, // $499 CAD in cents
        name: "CREOVA Legacy Membership"
      }
    };

    const membership = membershipPricing[membership_type];
    
    if (!membership) {
      return c.json({ error: "Invalid membership type" }, 400);
    }

    // Create Stripe Checkout Session
    const params = new URLSearchParams({
      'payment_method_types[0]': 'card',
      'mode': 'subscription',
      'customer_email': customer_email,
      'success_url': `${c.req.header('origin')}/payment-success?session_id={CHECKOUT_SESSION_ID}&membership=${membership_type}`,
      'cancel_url': `${c.req.header('origin')}/memberships`,
      'line_items[0][price_data][currency]': 'cad',
      'line_items[0][price_data][product_data][name]': membership.name,
      'line_items[0][price_data][product_data][description]': `Annual ${membership_type === 'creator' ? 'Creator' : 'Legacy'} membership with exclusive benefits`,
      'line_items[0][price_data][unit_amount]': membership.price.toString(),
      'line_items[0][price_data][recurring][interval]': 'year',
      'line_items[0][quantity]': '1',
      'metadata[membership_type]': membership_type,
      'metadata[customer_name]': customer_name,
      'subscription_data[metadata][membership_type]': membership_type,
      'subscription_data[metadata][customer_name]': customer_name
    });

    const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${stripeSecretKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString()
    });

    const session = await response.json();

    if (!response.ok) {
      console.error("Stripe API error:", session);
      return c.json({ error: "Failed to create checkout session", details: session }, 500);
    }

    // Store pending membership signup
    const signupId = `membership_signup_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    await kv.set(signupId, {
      membership_type,
      customer_email,
      customer_name,
      session_id: session.id,
      status: 'pending',
      created_at: new Date().toISOString()
    });

    console.log(`Created subscription checkout session: ${session.id} for ${membership_type} membership`);

    return c.json({
      sessionId: session.id,
      url: session.url,
      status: 'success'
    });
  } catch (error) {
    console.error("Error creating subscription checkout:", error);
    return c.json({ error: "Internal server error: " + error.message }, 500);
  }
});

// Submit contact form
app.post("/make-server-feacf0d8/submit-contact", async (c) => {
  try {
    const body = await c.req.json();
    const { name, email, phone, service, message, budget, timeline, captchaToken } = body;

    if (!name || !email || !message) {
      return c.json({ error: "Name, email, and message are required" }, 400);
    }

    // Server-side Cloudflare Turnstile verification
    const turnstileSecretKey = Deno.env.get("TURNSTILE_SECRET_KEY");
    if (turnstileSecretKey) {
      if (!captchaToken) {
        return c.json({ error: "Security verification required" }, 400);
      }
      const verifyResponse = await fetch(
        'https://challenges.cloudflare.com/turnstile/v0/siteverify',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            secret: turnstileSecretKey,
            response: captchaToken,
          }),
        }
      );
      const verifyData = await verifyResponse.json();
      if (!verifyData.success) {
        console.log('Turnstile verification failed for contact form:', verifyData);
        return c.json({ error: "Security verification failed. Please try again." }, 400);
      }
    }

    const contactId = `contact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    await kv.set(contactId, {
      name,
      email,
      phone,
      service,
      message,
      budget,
      timeline,
      status: 'new',
      type: 'contact',
      created_at: new Date().toISOString()
    });

    console.log(`Contact form submitted: ${contactId} from ${email}`);

    // Fire-and-forget confirmation emails
    const emailApiKey = Deno.env.get('EMAIL_SERVICE_API_KEY');
    if (emailApiKey) {
      const contactEmailData: ContactEmailData = { name, email, phone, service, message, budget, timeline };
      (async () => {
        try {
          await Promise.all([
            fetch('https://api.resend.com/emails', {
              method: 'POST',
              headers: { 'Authorization': `Bearer ${emailApiKey}`, 'Content-Type': 'application/json' },
              body: JSON.stringify({
                from: 'CREOVA <support@creova.ca>',
                to: [email],
                subject: "We've received your message — CREOVA",
                html: `<div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#121212"><h2 style="color:#A68F59">Thanks for reaching out, ${name}!</h2><p>We've received your message and will get back to you within 1–2 business days.</p><p style="color:#7A6F66;font-size:14px">In the meantime, follow us on Instagram <a href="https://www.instagram.com/creova.ca" style="color:#A68F59">@creova.ca</a></p><p>— The CREOVA Team</p></div>`
              })
            }),
            fetch('https://api.resend.com/emails', {
              method: 'POST',
              headers: { 'Authorization': `Bearer ${emailApiKey}`, 'Content-Type': 'application/json' },
              body: JSON.stringify({
                from: 'CREOVA <support@creova.one>',
                to: ['support@creova.one'],
                subject: `📧 New Contact: ${service || 'General Inquiry'} — ${name}`,
                html: adminContactNotification(contactEmailData),
                reply_to: email
              })
            })
          ]);
        } catch (e) {
          console.error('Failed to send contact emails:', e);
        }
      })();
    }

    return c.json({
      contactId,
      status: 'success',
      message: 'Contact form submitted successfully'
    });
  } catch (error) {
    console.error("Error submitting contact form:", error);
    return c.json({ error: "Failed to submit contact form: " + error.message }, 500);
  }
});

// Submit collaboration form
app.post("/make-server-feacf0d8/submit-collaboration", async (c) => {
  try {
    const body = await c.req.json();
    const { name, email, organization, collaborationType, projectDescription, timeline, budget } = body;

    if (!name || !email || !projectDescription) {
      return c.json({ error: "Name, email, and project description are required" }, 400);
    }

    const collaborationId = `collaboration_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    await kv.set(collaborationId, {
      name,
      email,
      organization,
      collaborationType,
      projectDescription,
      timeline,
      budget,
      status: 'new',
      type: 'collaboration',
      created_at: new Date().toISOString()
    });

    console.log(`Collaboration form submitted: ${collaborationId} from ${email}`);

    return c.json({
      collaborationId,
      status: 'success',
      message: 'Collaboration request submitted successfully'
    });
  } catch (error) {
    console.error("Error submitting collaboration form:", error);
    return c.json({ error: "Failed to submit collaboration form: " + error.message }, 500);
  }
});

// Submit booking form
app.post("/make-server-feacf0d8/submit-booking", async (c) => {
  try {
    const body = await c.req.json();
    const { 
      service, 
      package: packageName, 
      name, 
      email, 
      phone, 
      preferredDate, 
      preferredTime, 
      location,
      numberOfPeople,
      specialRequests,
      budget,
      hearAboutUs,
      submittedAt,
      captchaToken
    } = body;

    if (!service || !name || !email || !phone) {
      return c.json({ error: "Service, name, email, and phone are required" }, 400);
    }

    // Verify Cloudflare Turnstile token
    if (captchaToken) {
      const turnstileSecretKey = Deno.env.get("TURNSTILE_SECRET_KEY");

      if (turnstileSecretKey) {
        const verifyResponse = await fetch(
          'https://challenges.cloudflare.com/turnstile/v0/siteverify',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
              secret: turnstileSecretKey,
              response: captchaToken,
            }),
          }
        );
        const verifyData = await verifyResponse.json();
        if (!verifyData.success) {
          console.log('Turnstile verification failed:', verifyData);
          return c.json({ error: "Security verification failed. Please try again." }, 400);
        }
        console.log('Turnstile verification successful');
      } else {
        console.warn('TURNSTILE_SECRET_KEY not configured - skipping verification');
      }
    }

    const bookingId = `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    await kv.set(bookingId, {
      service,
      package: packageName,
      name,
      email,
      phone,
      preferredDate,
      preferredTime,
      location,
      numberOfPeople,
      specialRequests,
      budget,
      hearAboutUs,
      status: 'pending',
      submitted_at: submittedAt || new Date().toISOString(),
      created_at: new Date().toISOString()
    });

    console.log(`Booking submitted: ${bookingId} by ${name} (${email}) for ${service}`);

    // Fire-and-forget confirmation emails
    const emailApiKey = Deno.env.get('EMAIL_SERVICE_API_KEY');
    if (emailApiKey) {
      const emailData: BookingEmailData = {
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
        service,
        package: packageName || 'Standard',
        preferredDate: preferredDate || '',
        preferredTime: preferredTime || '',
        location: location || '',
        numberOfPeople,
        specialRequests,
        amount: 0
      };
      (async () => {
        try {
          await Promise.all([
            fetch('https://api.resend.com/emails', {
              method: 'POST',
              headers: { 'Authorization': `Bearer ${emailApiKey}`, 'Content-Type': 'application/json' },
              body: JSON.stringify({
                from: 'CREOVA Bookings <bookings@creova.ca>',
                to: [email],
                subject: 'Booking Request Received — CREOVA',
                html: getBookingConfirmationTemplate('en', emailData)
              })
            }),
            fetch('https://api.resend.com/emails', {
              method: 'POST',
              headers: { 'Authorization': `Bearer ${emailApiKey}`, 'Content-Type': 'application/json' },
              body: JSON.stringify({
                from: 'CREOVA <support@creova.one>',
                to: ['support@creova.one'],
                subject: `🎬 New Booking: ${service} — ${name}`,
                html: adminBookingNotification(emailData),
                reply_to: email
              })
            })
          ]);
        } catch (e) {
          console.error('Failed to send booking emails:', e);
        }
      })();
    }

    return c.json({
      bookingId,
      status: 'success',
      message: 'Booking request submitted successfully'
    });
  } catch (error) {
    console.error("Error submitting booking:", error);
    return c.json({ error: "Failed to submit booking: " + error.message }, 500);
  }
});

// Submit rental form
app.post("/make-server-feacf0d8/submit-rental", async (c) => {
  try {
    const body = await c.req.json();
    const { 
      equipment,
      name, 
      email, 
      phone, 
      startDate,
      endDate,
      rentalDays,
      dailyRate,
      totalCost,
      depositAmount,
      pickupLocation,
      purpose,
      specialRequests,
      hasInsurance,
      submittedAt
    } = body;

    if (!equipment || equipment.length === 0 || !name || !email || !phone || !startDate || !endDate) {
      return c.json({ error: "Equipment, name, email, phone, and rental dates are required" }, 400);
    }

    const rentalId = `rental_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    await kv.set(rentalId, {
      equipment,
      name,
      email,
      phone,
      startDate,
      endDate,
      rentalDays,
      dailyRate,
      totalCost,
      depositAmount,
      pickupLocation,
      purpose,
      specialRequests,
      hasInsurance,
      status: 'pending',
      submitted_at: submittedAt || new Date().toISOString(),
      created_at: new Date().toISOString()
    });

    console.log(`Rental submitted: ${rentalId} by ${name} (${email}) for equipment: ${equipment.join(', ')}`);

    return c.json({
      rentalId,
      status: 'success',
      message: 'Rental request submitted successfully'
    });
  } catch (error) {
    console.error("Error submitting rental:", error);
    return c.json({ error: "Failed to submit rental: " + error.message }, 500);
  }
});

// Get all contact and collaboration submissions (admin endpoint)
app.get("/make-server-feacf0d8/submissions", async (c) => {
  try {
    const contacts = await kv.getByPrefix("contact_");
    const collaborations = await kv.getByPrefix("collaboration_");

    // Combine and sort by date (newest first)
    const allSubmissions = [...contacts, ...collaborations].sort((a, b) => {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    console.log(`Retrieved ${allSubmissions.length} submissions`);

    return c.json({
      status: 'success',
      count: allSubmissions.length,
      submissions: allSubmissions
    });
  } catch (error) {
    console.error("Error retrieving submissions:", error);
    return c.json({ error: "Failed to retrieve submissions: " + error.message }, 500);
  }
});

// Update submission status (admin endpoint)
app.post("/make-server-feacf0d8/update-submission-status", async (c) => {
  try {
    const body = await c.req.json();
    const { submissionId, status } = body;

    if (!submissionId || !status) {
      return c.json({ error: "Submission ID and status are required" }, 400);
    }

    const submission = await kv.get(submissionId);
    
    if (!submission) {
      return c.json({ error: "Submission not found" }, 404);
    }

    await kv.set(submissionId, {
      ...submission,
      status,
      updated_at: new Date().toISOString()
    });

    console.log(`Updated submission ${submissionId} to status: ${status}`);

    return c.json({
      status: 'success',
      message: 'Submission status updated successfully'
    });
  } catch (error) {
    console.error("Error updating submission status:", error);
    return c.json({ error: "Failed to update submission status: " + error.message }, 500);
  }
});

// Track page view
app.post("/make-server-feacf0d8/track-pageview", async (c) => {
  try {
    const body = await c.req.json();
    const { 
      visitorId, 
      sessionId, 
      page, 
      referrer, 
      userAgent, 
      screenWidth, 
      screenHeight,
      language,
      timezone,
      utmSource,
      utmMedium,
      utmCampaign
    } = body;

    const pageviewId = `pageview_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    await kv.set(pageviewId, {
      visitorId,
      sessionId,
      page,
      referrer,
      userAgent,
      screenWidth,
      screenHeight,
      language,
      timezone,
      utmSource,
      utmMedium,
      utmCampaign,
      timestamp: new Date().toISOString()
    });

    // Update session with latest activity
    const sessionKey = `session_${sessionId}`;
    const existingSession = await kv.get(sessionKey);
    
    if (existingSession) {
      await kv.set(sessionKey, {
        ...existingSession,
        lastActivity: new Date().toISOString(),
        pageCount: (existingSession.pageCount || 1) + 1
      });
    } else {
      await kv.set(sessionKey, {
        visitorId,
        sessionId,
        startTime: new Date().toISOString(),
        lastActivity: new Date().toISOString(),
        pageCount: 1,
        referrer,
        userAgent,
        language,
        timezone
      });
    }

    // Track unique visitor
    const visitorKey = `visitor_${visitorId}`;
    const existingVisitor = await kv.get(visitorKey);
    
    if (existingVisitor) {
      await kv.set(visitorKey, {
        ...existingVisitor,
        lastVisit: new Date().toISOString(),
        visitCount: (existingVisitor.visitCount || 1) + 1
      });
    } else {
      await kv.set(visitorKey, {
        visitorId,
        firstVisit: new Date().toISOString(),
        lastVisit: new Date().toISOString(),
        visitCount: 1,
        userAgent,
        language,
        timezone
      });
    }

    return c.json({ status: 'success' });
  } catch (error) {
    console.error("Error tracking pageview:", error);
    return c.json({ error: "Failed to track pageview: " + error.message }, 500);
  }
});

// Track event (button clicks, form submissions, etc.)
app.post("/make-server-feacf0d8/track-event", async (c) => {
  try {
    const body = await c.req.json();
    const { visitorId, sessionId, eventName, eventData, page } = body;

    const eventId = `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    await kv.set(eventId, {
      visitorId,
      sessionId,
      eventName,
      eventData,
      page,
      timestamp: new Date().toISOString()
    });

    console.log(`Event tracked: ${eventName} on ${page}`);

    return c.json({ status: 'success' });
  } catch (error) {
    console.error("Error tracking event:", error);
    return c.json({ error: "Failed to track event: " + error.message }, 500);
  }
});

// Get analytics data (admin endpoint)
app.get("/make-server-feacf0d8/analytics", async (c) => {
  try {
    const { searchParams } = new URL(c.req.url);
    const days = parseInt(searchParams.get('days') || '30');
    
    // Calculate date range
    const now = new Date();
    const startDate = new Date(now.getTime() - (days * 24 * 60 * 60 * 1000));

    // Fetch all data
    const [pageviews, sessions, visitors, events] = await Promise.all([
      kv.getByPrefix("pageview_"),
      kv.getByPrefix("session_"),
      kv.getByPrefix("visitor_"),
      kv.getByPrefix("event_")
    ]);

    // Filter by date range
    const filteredPageviews = pageviews.filter(pv => 
      new Date(pv.timestamp) >= startDate
    );

    const filteredSessions = sessions.filter(s => 
      new Date(s.startTime) >= startDate
    );

    const filteredEvents = events.filter(e => 
      new Date(e.timestamp) >= startDate
    );

    // Calculate statistics
    const uniqueVisitors = new Set(filteredPageviews.map(pv => pv.visitorId)).size;
    const totalPageviews = filteredPageviews.length;
    const totalSessions = filteredSessions.length;
    const avgPageviewsPerSession = totalSessions > 0 ? (totalPageviews / totalSessions).toFixed(2) : 0;

    // Page popularity
    const pageCount = {};
    filteredPageviews.forEach(pv => {
      pageCount[pv.page] = (pageCount[pv.page] || 0) + 1;
    });
    const topPages = Object.entries(pageCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([page, count]) => ({ page, count }));

    // Referrer sources
    const referrerCount = {};
    filteredPageviews.forEach(pv => {
      if (pv.referrer && pv.referrer !== '') {
        const referrerDomain = new URL(pv.referrer).hostname || 'direct';
        referrerCount[referrerDomain] = (referrerCount[referrerDomain] || 0) + 1;
      } else {
        referrerCount['direct'] = (referrerCount['direct'] || 0) + 1;
      }
    });
    const topReferrers = Object.entries(referrerCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([referrer, count]) => ({ referrer, count }));

    // Device types (based on user agent)
    const deviceCount = { mobile: 0, tablet: 0, desktop: 0 };
    filteredPageviews.forEach(pv => {
      const ua = (pv.userAgent || '').toLowerCase();
      if (/mobile|android|iphone/.test(ua)) {
        deviceCount.mobile++;
      } else if (/tablet|ipad/.test(ua)) {
        deviceCount.tablet++;
      } else {
        deviceCount.desktop++;
      }
    });

    // Browser distribution
    const browserCount = {};
    filteredPageviews.forEach(pv => {
      const ua = (pv.userAgent || '').toLowerCase();
      let browser = 'Other';
      if (ua.includes('chrome') && !ua.includes('edg')) browser = 'Chrome';
      else if (ua.includes('safari') && !ua.includes('chrome')) browser = 'Safari';
      else if (ua.includes('firefox')) browser = 'Firefox';
      else if (ua.includes('edg')) browser = 'Edge';
      browserCount[browser] = (browserCount[browser] || 0) + 1;
    });

    // Daily pageviews for chart
    const dailyViews = {};
    filteredPageviews.forEach(pv => {
      const date = new Date(pv.timestamp).toISOString().split('T')[0];
      dailyViews[date] = (dailyViews[date] || 0) + 1;
    });
    const dailyViewsArray = Object.entries(dailyViews)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, count]) => ({ date, views: count }));

    // Event statistics
    const eventStats = {};
    filteredEvents.forEach(e => {
      eventStats[e.eventName] = (eventStats[e.eventName] || 0) + 1;
    });
    const topEvents = Object.entries(eventStats)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([event, count]) => ({ event, count }));

    console.log(`Analytics retrieved: ${totalPageviews} pageviews, ${uniqueVisitors} unique visitors`);

    return c.json({
      status: 'success',
      period: {
        days,
        startDate: startDate.toISOString(),
        endDate: now.toISOString()
      },
      summary: {
        totalPageviews,
        uniqueVisitors,
        totalSessions,
        avgPageviewsPerSession,
        totalEvents: filteredEvents.length
      },
      topPages,
      topReferrers,
      devices: Object.entries(deviceCount).map(([device, count]) => ({ device, count })),
      browsers: Object.entries(browserCount).map(([browser, count]) => ({ browser, count })),
      dailyViews: dailyViewsArray,
      topEvents,
      recentPageviews: filteredPageviews.slice(0, 50).map(pv => ({
        page: pv.page,
        referrer: pv.referrer,
        timestamp: pv.timestamp,
        userAgent: pv.userAgent
      }))
    });
  } catch (error) {
    console.error("Error retrieving analytics:", error);
    return c.json({ error: "Failed to retrieve analytics: " + error.message }, 500);
  }
});

// Get all payments for refund management
app.get("/make-server-feacf0d8/payments", async (c) => {
  try {
    const payments = await kv.getByPrefix("payment_");
    
    // Sort by date (newest first)
    const sortedPayments = payments.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    console.log(`Retrieved ${payments.length} payments`);

    return c.json({
      status: 'success',
      payments: sortedPayments
    });
  } catch (error) {
    console.error("Error retrieving payments:", error);
    return c.json({ error: "Failed to retrieve payments: " + error.message }, 500);
  }
});

// Create refund
app.post("/make-server-feacf0d8/create-refund", async (c) => {
  try {
    const body = await c.req.json();
    const { paymentIntentId, amount, reason } = body;

    if (!paymentIntentId) {
      return c.json({ error: "Payment Intent ID is required" }, 400);
    }

    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeSecretKey) {
      console.error("STRIPE_SECRET_KEY not found");
      return c.json({ error: "Stripe not configured" }, 500);
    }

    // Create refund with Stripe
    const refundData: any = {
      payment_intent: paymentIntentId,
      reason: reason || 'requested_by_customer'
    };

    // If partial refund, add amount
    if (amount) {
      refundData.amount = Math.round(amount * 100); // Convert to cents
    }

    const refundResponse = await fetch('https://api.stripe.com/v1/refunds', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeSecretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(refundData).toString()
    });

    const refund = await refundResponse.json();

    if (!refundResponse.ok) {
      console.error("Stripe refund error:", refund);
      return c.json({ 
        error: refund.error?.message || "Failed to create refund",
        details: refund 
      }, 400);
    }

    // Store refund record
    const refundId = `refund_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    await kv.set(refundId, {
      refundId,
      stripeRefundId: refund.id,
      paymentIntentId,
      amount: refund.amount / 100, // Convert from cents
      currency: refund.currency,
      reason: reason || 'requested_by_customer',
      status: refund.status,
      created_at: new Date().toISOString(),
      stripe_data: refund
    });

    // Update payment record with refund status
    const payments = await kv.getByPrefix("payment_");
    const payment = payments.find(p => p.stripe_payment_intent_id === paymentIntentId);
    
    if (payment) {
      await kv.set(payment.paymentId, {
        ...payment,
        refund_status: refund.status,
        refund_id: refund.id,
        refund_amount: refund.amount / 100,
        refunded_at: new Date().toISOString()
      });
    }

    console.log(`Refund created: ${refund.id} for payment ${paymentIntentId}`);

    return c.json({
      status: 'success',
      message: 'Refund created successfully',
      refund: {
        id: refund.id,
        amount: refund.amount / 100,
        currency: refund.currency,
        status: refund.status
      }
    });
  } catch (error) {
    console.error("Error creating refund:", error);
    return c.json({ error: "Failed to create refund: " + error.message }, 500);
  }
});

// Get refund history
app.get("/make-server-feacf0d8/refunds", async (c) => {
  try {
    const refunds = await kv.getByPrefix("refund_");
    
    // Sort by date (newest first)
    const sortedRefunds = refunds.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    console.log(`Retrieved ${refunds.length} refunds`);

    return c.json({
      status: 'success',
      refunds: sortedRefunds
    });
  } catch (error) {
    console.error("Error retrieving refunds:", error);
    return c.json({ error: "Failed to retrieve refunds: " + error.message }, 500);
  }
});

// ============================================================================
// EMAIL SENDING ENDPOINTS
// ============================================================================

import {
  getBookingConfirmationTemplate,
  adminBookingNotification,
  adminContactNotification,
  adminCollaborationNotification,
  type BookingEmailData,
  type ContactEmailData,
  type CollaborationEmailData
} from "./email-templates.tsx";

// Send booking confirmation email
app.post("/make-server-feacf0d8/send-booking-confirmation", async (c) => {
  try {
    const body = await c.req.json();
    const { to, bookingDetails, amount, language, checkoutUrl } = body;

    // Check if email service is configured
    const emailServiceApiKey = Deno.env.get('EMAIL_SERVICE_API_KEY');
    
    if (!emailServiceApiKey) {
      console.warn('EMAIL_SERVICE_API_KEY not configured - skipping email send');
      return c.json({ 
        status: 'warning', 
        message: 'Email service not configured. Booking saved but confirmation not sent.' 
      }, 200);
    }

    const emailData: BookingEmailData = {
      customerName: bookingDetails.name,
      customerEmail: to,
      customerPhone: bookingDetails.phone,
      service: bookingDetails.service,
      package: bookingDetails.package || bookingDetails.packageName || 'Standard',
      preferredDate: bookingDetails.preferredDate || bookingDetails.date,
      preferredTime: bookingDetails.preferredTime || bookingDetails.time,
      location: bookingDetails.location,
      numberOfPeople: bookingDetails.numberOfPeople,
      specialRequests: bookingDetails.specialRequests,
      amount: amount,
      checkoutUrl: checkoutUrl
    };

    // Get customer email template in correct language
    const customerEmailHtml = getBookingConfirmationTemplate(language || 'en', emailData);
    const customerSubject = language === 'fr' 
      ? 'Confirmation de Réservation - CREOVA'
      : 'Booking Confirmation - CREOVA';

    // Send confirmation to customer
    const customerEmailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${emailServiceApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'CREOVA Bookings <bookings@creova.ca>',
        to: [to],
        subject: customerSubject,
        html: customerEmailHtml
      })
    });

    if (!customerEmailResponse.ok) {
      const errorText = await customerEmailResponse.text();
      console.error('Failed to send customer confirmation email:', errorText);
      throw new Error('Customer email failed');
    }

    const customerResult = await customerEmailResponse.json();
    console.log(`Booking confirmation sent to ${to}: ${customerResult.id}`);

    // Send notification to admin
    const adminEmailHtml = adminBookingNotification(emailData);
    
    const adminEmailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${emailServiceApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'CREOVA <support@creova.one>',
        to: ['support@creova.one'],
        subject: `🎬 New Booking: ${bookingDetails.service} - ${bookingDetails.name}`,
        html: adminEmailHtml,
        reply_to: to
      })
    });

    if (!adminEmailResponse.ok) {
      const errorText = await adminEmailResponse.text();
      console.error('Failed to send admin notification email:', errorText);
      // Don't throw - customer email succeeded
    } else {
      const adminResult = await adminEmailResponse.json();
      console.log(`Admin notification sent: ${adminResult.id}`);
    }

    return c.json({ 
      status: 'success', 
      message: 'Booking confirmation emails sent successfully',
      customerEmailId: customerResult.id
    });

  } catch (error) {
    console.error('Error sending booking confirmation emails:', error);
    return c.json({ 
      error: 'Failed to send confirmation email',
      details: error.message 
    }, 500);
  }
});

// Send contact form notification email (admin only)
app.post("/make-server-feacf0d8/send-contact-notification", async (c) => {
  try {
    const body = await c.req.json();
    const contactData: ContactEmailData = body;

    const emailServiceApiKey = Deno.env.get('EMAIL_SERVICE_API_KEY');
    
    if (!emailServiceApiKey) {
      console.warn('EMAIL_SERVICE_API_KEY not configured - skipping admin notification');
      return c.json({ status: 'warning', message: 'Email service not configured' }, 200);
    }

    const adminEmailHtml = adminContactNotification(contactData);
    
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${emailServiceApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'CREOVA <support@creova.one>',
        to: ['support@creova.one'],
        subject: `📧 New Contact: ${contactData.service || 'General Inquiry'} - ${contactData.name}`,
        html: adminEmailHtml,
        reply_to: contactData.email
      })
    });

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      console.error('Failed to send contact notification:', errorText);
      throw new Error('Email send failed');
    }

    const result = await emailResponse.json();
    console.log(`Contact form notification sent: ${result.id}`);

    return c.json({ 
      status: 'success', 
      message: 'Admin notification sent',
      emailId: result.id
    });

  } catch (error) {
    console.error('Error sending contact notification:', error);
    return c.json({ 
      error: 'Failed to send notification',
      details: error.message 
    }, 500);
  }
});

// Send collaboration form notification email (admin only)
app.post("/make-server-feacf0d8/send-collaboration-notification", async (c) => {
  try {
    const body = await c.req.json();
    const collaborationData: CollaborationEmailData = body;

    const emailServiceApiKey = Deno.env.get('EMAIL_SERVICE_API_KEY');
    
    if (!emailServiceApiKey) {
      console.warn('EMAIL_SERVICE_API_KEY not configured - skipping admin notification');
      return c.json({ status: 'warning', message: 'Email service not configured' }, 200);
    }

    const adminEmailHtml = adminCollaborationNotification(collaborationData);
    
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${emailServiceApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'CREOVA <support@creova.one>',
        to: ['support@creova.one'],
        subject: `🤝 New Collaboration Request: ${collaborationData.organization || collaborationData.name}`,
        html: adminEmailHtml,
        reply_to: collaborationData.email
      })
    });

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      console.error('Failed to send collaboration notification:', errorText);
      throw new Error('Email send failed');
    }

    const result = await emailResponse.json();
    console.log(`Collaboration notification sent: ${result.id}`);

    return c.json({ 
      status: 'success', 
      message: 'Admin notification sent',
      emailId: result.id
    });

  } catch (error) {
    console.error('Error sending collaboration notification:', error);
    return c.json({ 
      error: 'Failed to send notification',
      details: error.message 
    }, 500);
  }
});

// ============================================================================

Deno.serve(app.fetch);