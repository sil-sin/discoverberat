import emailjs from '@emailjs/browser';

interface EmailParams {
    toEmail: string;
    from_name: string;
    message: string;
}

// Initialize EmailJS with your User ID
emailjs.init(process.env.EMAILJS_USER_ID ?? '');

export async function sendEmail(params: EmailParams): Promise<void> {
    const templateId = process.env.EMAILJS_TEMPLATE_ID;
    const serviceId = process.env.EMAILJS_SERVICE_ID;

    if (!templateId || !serviceId) {

        throw new Error('EmailJS credentials are not configured.');
    }

    const emailParams: Record<string, unknown> = {
        ...params,
    };

    try {
        await emailjs.send(serviceId, templateId, emailParams);
        console.log('Email sent successfully!');
    } catch (error) {
        console.error('Error sending email:', error);
    }
}
