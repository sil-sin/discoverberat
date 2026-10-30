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
