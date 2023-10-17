import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabase';
import send_gmail from '@/lib/email/send';
import { templatePaid } from '@/lib/email/template';

const addPaymentDate = async (uuid: string): Promise<boolean> => {
  const { data: updatedData } = await supabase
    .from('reservations')
    .update({
      status: 'paid',
      paid_at: new Date(),
    })
    .match({ uuid })
    .select();
  if (!updatedData) {
    console.error('Database error: payment done, but update failed');
    return false;
  } else {
    console.log(updatedData);
    return true;
  }
};

const sendEmailTemplate = async (uuid: string, status: string) => {
  if (status === 'paid') {
    const { data: reservationData } = await supabase.from('reservations').select().match({ uuid }).single();
    if (!reservationData) console.error('Database error: reservation not found');
    const to = reservationData.email;
    const subject = '劇団XXX『公演YYY』ご予約確定のお知らせ';
    const body = templatePaid(reservationData);
    await send_gmail(to, subject, body);
  }
};

const expireReservation = async (uuid: string): Promise<boolean> => {
  const { data: updatedData } = await supabase
    .from('reservations')
    .update({
      status: 'payment_expired',
    })
    .match({ uuid })
    .select();
  if (!updatedData) {
    console.error('Database error: payment expired, but update failed');
    return false;
  } else {
    return true;
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'POST') {
      if (req.body.type === 'checkout.session.completed') {
        const uuid = req.body.data.object.client_reference_id;
        console.debug('Payment completed:', uuid);

        const isUpdated = await addPaymentDate(uuid);
        if (!isUpdated) return res.status(500).send('Internal server error');

        await sendEmailTemplate(uuid, 'paid');

        return res.status(200).send('OK');
      } else if (req.body.type === 'checkout.session.expired') {
        const uuid = req.body.data.object.client_reference_id;
        console.debug('Payment expired:', uuid);

        const isUpdated = await expireReservation(uuid);
        if (!isUpdated) return res.status(500).send('Internal server error');
        return res.status(200).send('OK');
      } else {
        // Other than POST
        return res.status(405).send('Method not allowed');
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send('Internal server error');
  }
}
