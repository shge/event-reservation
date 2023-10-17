export default async function send_gmail(to: string, subj: string, body: string) {
  if (!process.env.GMAIL_GAS_URL) {
    console.error('GMAIL_GAS_URL is not set');
    return;
  }
  console.log('Sending email to', to);
  const res = await fetch(process.env.GMAIL_GAS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ to, subj, body }),
  });
  const result = await res.json();
  if (res.ok && result.success === true) {
    console.log('Email successfully sent', to);
  } else {
    console.error('Email sending failed', to);
    console.error(res);
  }
  return result;
}
