'use client';

import { notFound } from 'next/navigation';

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

export function ServicePageClient({ service }: { service: Service | null }) {
  const handleContentChange = (event: React.FocusEvent<any>) => {
    if (service) {
      service.title = event.target.innerHTML;
      const updatedServices = services.map((s) =>
        s.link === service.link ? service : s,
      );
      localStorage.setItem('services', JSON.stringify(updatedServices));
    }
  };

  if (!service) {
    notFound();
  }

  return (
    <div>
      <h1
        id="title"
        onBlur={handleContentChange}
        dangerouslySetInnerHTML={{ __html: service.title || '' }}
      ></h1>

      <div
        id="description"
        onBlur={handleContentChange}
        dangerouslySetInnerHTML={{ __html: service.description || '' }}
      ></div>
    </div>
  );
}
