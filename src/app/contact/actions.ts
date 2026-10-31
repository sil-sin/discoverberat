'use server';

import { createHash } from 'crypto';
import { headers } from 'next/headers';
import { adminSDK } from '@/lib/firebase/admin';
import { sendMail } from '@/lib/mail';
import { MAX_TEXT_LENGTH } from '@/lib/booking';
import { EMAIL_PATTERN, MAX_MESSAGE_LENGTH } from '@/lib/forms';

const HOURLY_LIMIT = 5;
const HOUR_MS = 60 * 60 * 1000;

async function isUnderLimit() {
  const ip = (await headers()).get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown';
  const db = adminSDK.firestore();
  const ref = db.collection('contactLimits').doc(createHash('sha256').update(ip).digest('hex'));
  return db.runTransaction(async (tx) => {
    const data = (await tx.get(ref)).data();
    const isNewWindow = !data || Date.now() - data.since >= HOUR_MS;
    if (!isNewWindow && data.count >= HOURLY_LIMIT) return false;
    tx.set(ref, isNewWindow ? { since: Date.now(), count: 1 } : { since: data.since, count: data.count + 1 });
    return true;
  });
}

export async function sendContactMessage(
  name: string,
  email: string,
  message: string,
  website = '',
) {
  const cleanName = String(name ?? '').replace(/\s+/g, ' ').trim();
  const cleanMessage = String(message ?? '').trim();
  if (
    !cleanName ||
    cleanName.length > MAX_TEXT_LENGTH ||
    !cleanMessage ||
    cleanMessage.length > MAX_MESSAGE_LENGTH ||
    String(email).length > MAX_TEXT_LENGTH ||
    !EMAIL_PATTERN.test(email)
  ) {
    throw new Error('Invalid contact message');
  }
  // Bots fill the hidden field. Answer as if sent so they don't retry.
  if (website) return;
  if (!(await isUnderLimit())) {
    return { error: 'You sent several messages already. Please try again in an hour, or message us on WhatsApp.' };
  }

  await sendMail(
    process.env.ADMIN_EMAIL,
    `New message from ${cleanName} (${email})`,
    cleanMessage,
  );
}
