import nodemailer from 'nodemailer';

export const sendMail = async (
  to: string | undefined,
  subject: string,
  body: string | { text: string; html: string },
) => {
  try {
    await nodemailer
      .createTransport(process.env.SMTP_CONNECTION_URI)
      .sendMail({
        from: process.env.DEFAULT_FROM,
        to,
        subject,
        ...(typeof body === 'string' ? { text: body } : body),
      });
  } catch (error) {
    console.error('sendMail failed:', error);
    throw new Error('Email could not be sent');
  }
};
