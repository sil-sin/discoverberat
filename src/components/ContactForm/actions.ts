'use server';

import { sendMail } from '@/utils/mail';

export async function sendContactMessage(
  name: string,
  email: string,
  message: string,
) {
  if (!name?.trim() || !message?.trim() || !/^\S+@\S+$/i.test(email)) {
    throw new Error('Invalid contact message');
  }

  await sendMail(
    process.env.NEXT_PUBLIC_ADMIN,
    `New message from ${name} (${email})`,
    message,
  );
}
