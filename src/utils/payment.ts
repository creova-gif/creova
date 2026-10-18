import { loadStripe } from '@stripe/stripe-js';
import { apiUrl } from './api';

const stripePublishableKey = (import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '').trim();
const stripePromise = stripePublishableKey ? loadStripe(stripePublishableKey) : null;

async function postCommerce(path: string, body: unknown, fallback: string) {
  const url = apiUrl(path);
  if (!url) throw new Error('API is not configured');
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || fallback);
  }

  return await response.json();
}

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
  return postCommerce('/create-booking', {
    service,
    customer_info: customerInfo,
    booking_details: bookingDetails,
    amount: Math.round(amount * 100),
    currency: 'cad'
  }, 'Failed to create booking');
}

export async function createRental(
  equipment: string[],
  customerInfo: CustomerInfo,
  rentalDetails: RentalDetails,
  amount: number
) {
  return postCommerce('/create-rental', {
    equipment,
    customer_info: customerInfo,
    rental_details: rentalDetails,
    amount: Math.round(amount * 100),
    currency: 'cad'
  }, 'Failed to create rental');
}

export async function createTicket(
  eventId: string,
  customerInfo: CustomerInfo,
  ticketDetails: TicketDetails,
  amount: number
) {
  return postCommerce('/create-ticket', {
    event_id: eventId,
    customer_info: customerInfo,
    ticket_details: ticketDetails,
    amount: Math.round(amount * 100),
    currency: 'cad'
  }, 'Failed to purchase ticket');
}

export async function createPaymentIntent(
  amount: number,
  customerInfo: CustomerInfo,
  items: PaymentItem[]
) {
  return postCommerce('/create-payment-intent', {
    amount: Math.round(amount * 100),
    currency: 'cad',
    customer_info: customerInfo,
    items
  }, 'Failed to create payment');
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
