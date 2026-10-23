'use server';

import { adminSDK } from '@/utils/firebase/adminConfig';

export async function sendContactMessage(
  name: string,
  email: string,
  message: string,
) {
  if (!name?.trim() || !message?.trim() || !/^\S+@\S+$/i.test(email)) {
    throw new Error('Invalid contact message');
  }

  await adminSDK
    .firestore()
    .collection('mail')
    .add({
      to: process.env.NEXT_PUBLIC_ADMIN,
      message: {
        subject: `New message from ${name} (${email})`,
        html: message,
      },
    });
}
