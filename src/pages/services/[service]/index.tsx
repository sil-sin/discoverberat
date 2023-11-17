import { GetStaticPaths, GetStaticProps } from 'next'
import { useEffect, useState } from 'react'

type Service = {
  title: string
  link: string
}

const services: Service[] = [
  {
    title: 'Service Packages',
    link: 'tour-packages',
  },
  {
    title: 'Transport and Transfers',
    link: 'transport',
  },
  {
    title: 'Accommodation Booking',
    link: 'accommodation',
  },
  {
    title: 'Guided services and Activities',
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
  const admin = true // Set your admin status here or fetch it from wherever you store this information.

  return {
    props: { service: selectedService, admin },
  }
}

export default Page
