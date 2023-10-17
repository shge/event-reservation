import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabase';
import Stripe from 'stripe';
if (!process.env.STRIPE_SECRET_KEY) throw new Error('Missing env.STRIPE_SECRET_KEY');
if (!process.env.STRIPE_PRICE_ID) throw new Error('Missing env.PRICE_ID');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2022-11-15' });
import sendEmailTemplate from './stripe_webhook';
import { templatePaid } from '@/lib/email/template';
import send_gmail from '@/lib/email/send';

const isPaymentRequired = false;

const getIP = (req: NextApiRequest) => {
  if (req.headers['x-forwarded-for']) return req.headers['x-forwarded-for'].toString();
  if (req.socket && req.socket.remoteAddress) return req.socket.remoteAddress;
  return '0.0.0.0';
};

const isSeatsAvailable = async (date: string, ticketsCount: number): Promise<boolean> => {
  const { data: seatsData } = await supabase.from('seats').select('seats').match({ date }).single();
  if (seatsData === null) {
    console.error('Database error: date not found in seats');
    return false;
  }
  const seats: number = seatsData.seats;

  const { data: reservations } = await supabase
    .from('reservations')
    .select('tickets_count')
    .eq('date', date)
    .eq('status', 'paid');
  if (!reservations) {
    console.error('Database error: date not found in reservations');
    return false;
  }
  const currentReservationsCount = reservations.reduce((acc: number, cur: any) => acc + cur.tickets_count, 0);

  const isAvailable = currentReservationsCount + ticketsCount <= seats;
  console.debug(
    currentReservationsCount,
    'occupied of',
    seats,
    'seats.',
    ticketsCount,
    'tickets requested:',
    isAvailable ? 'Available' : 'Not available'
  );
  return isAvailable;
};

const createReservation = async (data: any, status: string, ip: string): Promise<string | null> => {
  if (data.tickets_count > 1) {
    data.companions = data.companions.filter((companion: string) => companion !== '');
    if (data.companions.length > 0) {
      data.companions = data.companions.join(',');
    } else {
      data.companions = '';
    }
  } else {
    data.companions = '';
  }
  const { data: insertedData } = await supabase
    .from('reservations')
    .insert([{ ...data, status, ip }])
    .select()
    .single();
  if (!insertedData) {
    console.error('Database error: insert failed');
    return null;
  } else {
    console.log(insertedData);
    return insertedData.uuid;
  }
};

const createPaymentUrl = async (count: number, email: string, uuid: string): Promise<string | null> => {
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [
      {
        price: process.env.STRIPE_PRICE_ID,
        quantity: count,
      },
    ],
    customer_email: email,
    client_reference_id: uuid,
    metadata: { uuid: uuid },
    expires_at: Math.floor(Date.now() / 1000) + 40 * 60, // 40 min
    success_url: 'https://example.com/reserve/thanks',
  });
  return session.url;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'POST') {
      console.debug(req.body);
      const { date } = req.body;

      const isAvailable = await isSeatsAvailable(date, Number(req.body.tickets_count));

      if (isAvailable && isPaymentRequired) {
        const uuid = await createReservation(req.body, 'payment_pending', getIP(req));
        console.debug(uuid);
        if (uuid) {
          const paymentUrl = await createPaymentUrl(req.body.tickets_count, req.body.email, uuid);
          return res.status(201).json({ status: 'proceed', paymentUrl });
        }
      } else if (isAvailable && !isPaymentRequired) {
        const uuid = await createReservation(req.body, 'paid', getIP(req));
        console.debug(uuid);
        if (uuid) {
          const { data: reservationData } = await supabase.from('reservations').select().match({ uuid }).single();
          if (!reservationData) console.error('Database error: reservation not found');
          const to = reservationData.email;
          const subject = '劇団XXX『公演YYY』ご予約確定のお知らせ';
          const body = templatePaid(reservationData);
          await send_gmail(to, subject, body);
          return res.status(201).json({ status: 'success', uuid });
        }
      } else {
        return res.status(200).json({ status: 'sold_out' });
      }
    } else {
      // Other than POST
      return res.status(405).send('Method not allowed');
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send('Internal server error');
  }
}
