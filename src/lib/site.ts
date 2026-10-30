export const SITE_URL = 'https://discoverberat.com';

export const isProduction = process.env.VERCEL_ENV === 'production';

// Plain-text summary of a markdown description, sized for meta descriptions.
export const summarize = (markdown = '', maxLength = 160) => {
  const text = markdown
    .replace(/^#+ .*$/gm, '')
    .replace(/[*_#>\\]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (text.length <= maxLength) return text;
  const sentences = text.slice(0, maxLength + 1).match(/^.{60,}[.!?](?=\s)/)?.[0];
  return sentences ?? `${text.slice(0, text.lastIndexOf(' ', maxLength - 1))}…`;
};

export const HEADER_LINKS = [
  { title: 'Tours', href: '/tours' },
  { title: 'Contact', href: '/contact' },
  { title: 'About', href: '/about' },
];

export const PHONE_NUMBER = '+355 69 292 1203';
export const WHATSAPP_URL = 'https://wa.me/355692921203';
export const EMAIL = 'discoverberat@gmail.com';
export const ADDRESS = 'Antipatrea Street, Berat 5001, Albania';
export const OPENING_HOURS = 'Open daily 09:00–20:00';
