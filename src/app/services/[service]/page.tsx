import { ServicePageClient } from './ServicePageClient';
import type { Metadata } from 'next';

type Service = {
  title: string;
  link: string;
  description?: string;
};

const services: Service[] = [
  {
    title: 'Service Packages',
    link: 'tour-packages',
  },
  {
    title: 'Coming soon',
    description: 'Please contact us for more details',
    link: 'accommodation',
  },
  {
    title: 'Guided Tours and Activities',
    link: 'tours',
  },
];

type Props = {
  params: Promise<{ service: string }>;
};

export async function generateStaticParams() {
  return services.map((service) => ({
    service: service.link,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { service: serviceSlug } = await params;
  const service = services.find((s) => s.link === serviceSlug);

  return {
    title: service?.title
      ? `${service.title} - Discover Berat`
      : 'Service - Discover Berat',
  };
}

export default async function ServicePage({ params }: Props) {
  const { service: serviceSlug } = await params;
  const service = services.find((s) => s.link === serviceSlug) || null;

  return <ServicePageClient service={service} />;
}
