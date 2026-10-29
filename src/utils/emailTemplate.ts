import { SITE_URL } from '@/utils/site';

const BRAND = '#2f7a4a';
const INK = '#1f2533';
const MUTED = '#5f6670';
const LINE = '#e2e5e3';

type EmailContent = {
  heading: string;
  intro: string;
  details?: [label: string, value: string][];
  sections?: { title: string; text: string }[];
  cta?: { label: string; href: string };
};

// Booking fields are customer input, so every value is escaped before it goes into HTML.
const escape = (value: unknown) =>
  String(value ?? '').replace(
    /[&<>"']/g,
    (char) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]!,
  );

export const formatTourDate = (date: Date) =>
  date.toLocaleString('en-GB', {
    timeZone: 'Europe/Tirane',
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

export function renderEmail({ heading, intro, details = [], sections = [], cta }: EmailContent) {
  const text = [
    heading,
    intro,
    details.map(([label, value]) => `${label}: ${value}`).join('\n'),
    ...sections.map(({ title, text }) => `${title}\n${text}`),
    cta && `${cta.label}: ${cta.href}`,
    `Discover Berat\nWhatsApp: +355 69 292 1203\n${SITE_URL}`,
  ]
    .filter(Boolean)
    .join('\n\n');

  const detailRows = details
    .map(
      ([label, value]) => `<tr>
        <td style="padding:8px 0;color:${MUTED};width:130px;vertical-align:top">${escape(label)}</td>
        <td style="padding:8px 0;color:${INK};font-weight:600">${escape(value)}</td>
      </tr>`,
    )
    .join('');

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;padding:0;background:#f5f8f6;font-family:Helvetica,Arial,sans-serif;color:${INK}">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f8f6;padding:24px 12px">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border:1px solid ${LINE};border-radius:14px;overflow:hidden">
        <tr><td style="background:${BRAND};padding:20px 28px">
          <a href="${SITE_URL}" style="color:#ffffff;text-decoration:none;font-size:20px;font-weight:700;letter-spacing:0.5px">Discover Berat</a>
          <div style="color:#d6eadd;font-size:13px;margin-top:2px">Tours from Berat, Albania</div>
        </td></tr>
        <tr><td style="padding:28px">
          <h1 style="margin:0 0 12px;font-size:22px;line-height:1.3;color:${INK}">${escape(heading)}</h1>
          <p style="margin:0 0 20px;font-size:16px;line-height:1.5;color:${INK}">${escape(intro)}</p>
          ${detailRows ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid ${LINE};border-bottom:1px solid ${LINE};margin-bottom:20px;font-size:15px">${detailRows}</table>` : ''}
          ${sections
            .map(
              ({ title, text }) => `<h2 style="margin:0 0 6px;font-size:16px;color:${INK}">${escape(title)}</h2>
          <p style="margin:0 0 18px;font-size:15px;line-height:1.5;color:${MUTED}">${escape(text)}</p>`,
            )
            .join('')}
          ${cta ? `<a href="${escape(cta.href)}" style="display:inline-block;margin-top:4px;padding:12px 22px;background:${BRAND};color:#ffffff;text-decoration:none;border-radius:10px;font-weight:600;font-size:15px">${escape(cta.label)}</a>` : ''}
        </td></tr>
        <tr><td style="padding:18px 28px;border-top:1px solid ${LINE};font-size:13px;line-height:1.6;color:${MUTED}">
          Discover Berat · Berat, Albania<br>
          WhatsApp <a href="https://wa.me/355692921203" style="color:${BRAND}">+355 69 292 1203</a> · <a href="${SITE_URL}" style="color:${BRAND}">discoverberat.com</a>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  return { text, html };
}
