export const SITE_URL = 'https://discoverberat.com';

export const isProduction = process.env.VERCEL_ENV === 'production';

// Plain-text summary of a markdown description, sized for meta descriptions.
export const summarize = (markdown = '', maxLength = 160) => {
  const text = markdown
    .replace(/^#+ .*$/gm, '')
    .replace(/[*_#>\\]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return text.length > maxLength
    ? `${text.slice(0, text.lastIndexOf(' ', maxLength - 1))}…`
    : text;
};
