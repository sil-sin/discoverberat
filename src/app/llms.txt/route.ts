import { getEntriesByType } from '@/utils/contentful/contentful';
import { SITE_URL, summarize } from '@/utils/site';

export const revalidate = 43200; // 12 hours

export async function GET() {
  const tours = await getEntriesByType('tourPage');
  const tourLines = tours.map(
    ({ fields }: any) =>
      `- [${fields.title}](${SITE_URL}/tours/${fields.url}): ${fields.currency ?? '€'}${fields.price} per person. ${summarize(fields.description, 300)}`,
  );

  const body = `# Discover Berat

> Local tour operator in Berat, Albania. Guided city walks, wine tastings, and day trips to Osum Canyon, Bogova Waterfall, and more, with pickup in Berat.

- Book online at ${SITE_URL}/tours (minimum 2 guests). Pay online with PayPal or on the day.
- Free cancellation up to 24 hours before the tour. PayPal refunds exclude the PayPal fee: ${SITE_URL}/refund-policy
- Contact: discoverberat@gmail.com, WhatsApp +355 69 292 1203

## Tours

${tourLines.join('\n')}

## Policies

- [Terms and Conditions](${SITE_URL}/terms)
- [Refund Policy](${SITE_URL}/refund-policy)
- [Privacy Policy](${SITE_URL}/privacy-policy)
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
