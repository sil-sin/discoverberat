import { getEntriesByType } from '@/utils/contentful/contentful';
import TransfersCard from '@/components/simple/TransferCards';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export const revalidate = 43200; // 12 hours

type Props = {
  params: Promise<{ transfer: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { transfer: transferSlug } = await params;
  const entries = await getEntriesByType('transfers');
  const transfer: any = entries?.find(
    (e: any) =>
      (e?.fields?.from + '-' + e?.fields?.to).toLowerCase() === transferSlug,
  );

  return {
    title: transfer
      ? `${transfer.fields.from} to ${transfer.fields.to} - Discover Berat`
      : 'Transfer - Discover Berat',
  };
}

export default async function TransferPage({ params }: Props) {
  const { transfer: transferSlug } = await params;
  const entries = await getEntriesByType('transfers');
  const transfer: any = entries?.find(
    (e: any) =>
      (e?.fields?.from + '-' + e?.fields?.to).toLowerCase() === transferSlug,
  );

  if (!transfer) {
    notFound();
  }

  return <TransfersCard transfer={transfer.fields} />;
}
