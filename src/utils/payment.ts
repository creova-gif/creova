import { loadStripe } from '@stripe/stripe-js';
import { projectId, publicAnonKey } from './supabase/info';

const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '';
const stripePromise = loadStripe(stripePublishableKey);

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-feacf0d8`;

export interface CustomerInfo {
  name: string;
  email: string;
  phone?: string;
}

export interface BookingDetails {
  service: string;
  date?: string;
  time?: string;
  location?: string;
  notes?: string;
  package?: string;
}

export interface RentalDetails {
  equipment: string[];
  start_date: string;
  end_date: string;
  pickup_location?: string;
  notes?: string;
}

export interface TicketDetails {
  event_id: string;
  event_name: string;
  quantity: number;
  attendee_names?: string[];
}

export interface PaymentItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category?: string;
}

export async function createBooking(
  service: string,
  customerInfo: CustomerInfo,
  bookingDetails: BookingDetails,
  amount: number
) {
  const response = await fetch(`${API_URL}/create-booking`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${publicAnonKey}`
    },
    body: JSON.stringify({
      service,
      customer_info: customerInfo,
      booking_details: bookingDetails,
      amount: Math.round(amount * 100),
      currency: 'cad'
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create booking');
  }

  return await response.json();
}

export async function createRental(
  equipment: string[],
  customerInfo: CustomerInfo,
  rentalDetails: RentalDetails,
  amount: number
) {
  const response = await fetch(`${API_URL}/create-rental`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${publicAnonKey}`
    },
    body: JSON.stringify({
      equipment,
      customer_info: customerInfo,
      rental_details: rentalDetails,
      amount: Math.round(amount * 100),
      currency: 'cad'
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create rental');
  }

  return await response.json();
}

export async function createTicket(
  eventId: string,
  customerInfo: CustomerInfo,
  ticketDetails: TicketDetails,
  amount: number
) {
  const response = await fetch(`${API_URL}/create-ticket`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${publicAnonKey}`
    },
    body: JSON.stringify({
      event_id: eventId,
      customer_info: customerInfo,
      ticket_details: ticketDetails,
      amount: Math.round(amount * 100),
      currency: 'cad'
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to purchase ticket');
  }

  return await response.json();
}

export async function createPaymentIntent(
  amount: number,
  customerInfo: CustomerInfo,
  items: PaymentItem[]
) {
  const response = await fetch(`${API_URL}/create-payment-intent`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${publicAnonKey}`
    },
    body: JSON.stringify({
      amount: Math.round(amount * 100),
      currency: 'cad',
      customer_info: customerInfo,
      items
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create payment');
  }

  return await response.json();
}

export async function processPayment(
  _clientSecret: string,
  elements: any,
  stripe: any
) {
  const { error, paymentIntent } = await stripe.confirmPayment({
    elements,
    confirmParams: {
      return_url: `${window.location.origin}/payment-success`,
    },
    redirect: 'if_required'
  });

  if (error) {
    throw new Error(error.message);
  }

  return paymentIntent;
}

export { stripePromise };
