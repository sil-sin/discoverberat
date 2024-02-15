import { GetStaticPaths, GetStaticProps } from 'next'
import { useEffect, useState } from 'react'

type Service = {
  title: string
  link: string
  description?: string
}

const services: Service[] = [
  {
    title: 'Service Packages',
    link: 'tour-packages',
  },
  {
    title: 'Transport and Transfers',
    description: 'Please contact us for more details',
    link: 'transport',
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
]

function Page({ service, admin }: { service: Service | null; admin: boolean }) {
  const [content, setContent] = useState('')

  const handleContentChange = (event: React.FocusEvent<any>) => {
    if (service) {
      service.title = event.target.innerHTML
      const updatedServices = services.map((s) =>
        s.link === service.link ? service : s
      )

      localStorage.setItem('services', JSON.stringify(updatedServices))
    }
  }

  if (!service) {
    return (
      <div>
        <h1>Service not found</h1>
      </div>
    )
  }

  return (
    <div>
      <h1
        id='title'
        contentEditable={admin}
        onBlur={handleContentChange}
        dangerouslySetInnerHTML={{ __html: service.title || '' }}
      ></h1>

      <div
        id='description'
        contentEditable={admin}
        onBlur={handleContentChange}
        dangerouslySetInnerHTML={{ __html: service.description || '' }}
      ></div>

    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = services.map((service) => ({
    params: { service: service.link },
  }))
  return { paths, fallback: false }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const selectedService =
    services.find((s) => s.link === params?.service) || null

  return {
    props: { service: selectedService },
  }
}

export default Page
