/* eslint-disable react/no-danger-with-children */
'use client'
import { useEffect, useState } from 'react'
import { GiCornerFlag } from 'react-icons/gi'
import {
  MdTravelExplore,
  MdEmojiTransportation,
  MdOutlineLocalHotel,
} from 'react-icons/md'

type Service = {
  title: string
  icon: React.ReactNode
  link: string
}

const services = [
  {
    title: 'service Packages',
    icon: <MdTravelExplore size={50} />,
    link: 'tour-packages',
  },
  {
    title: 'Transport and Transfers',
    icon: <MdEmojiTransportation size={50} />,
    link: 'transport',
  },
  {
    title: 'Accommodation Booking',
    icon: <MdOutlineLocalHotel size={50} />,
    link: 'accommodation',
  },
  {
    title: 'Guided services and Activities',
    icon: <GiCornerFlag size={50} />,
    link: 'tours',
  },
]
export default function Page({
  params,
}: {
  params: { service: string }
  props: { services: Service[] }
}) {
  const [service, setService] = useState<Service>()

  const [content, setContent] = useState('')

  useEffect(() => {
    setService(services.filter((service) => service.link === params.service)[0])
  }, [params.service])

  useEffect(() => {
    localStorage.setItem('services', JSON.stringify([...services]))
    setContent(
      JSON.parse(localStorage.getItem('services') ?? '[{"title":"Not found"}]')
        .title
    )
  }, [])

  useEffect(() => {
    
  },[content])
  const handleContentChange = (event: React.FocusEvent<any>) => {
    setService({
      ...service,
      title: content,
      icon: service?.icon,
      link: params.service,
    })
    const newServices = (services.filter(
      (service) => service.link === params.service
    )[0].title = event.target.innerHTML)

    console.log(newServices)

    localStorage.setItem('services', JSON.stringify([...services, service]))
  }
  const admin = true

  if (!service) {
    return (
      <div>
        <h1>service not found</h1>
      </div>
    )
  }

  return (
    <div>
      <h1
        id={'title'}
        contentEditable={!!admin}
        onBlur={handleContentChange}
        dangerouslySetInnerHTML={{ __html: service?.title }}
      ></h1>
    </div>
  )
}

export function generateStaticParams() {
  const staticParams = JSON.parse(localStorage.getItem('service') ?? '[]').map(
    (service: { link: string }) => {
      console.log(service.link)
      return {
        service: service.link,
      }
    }
  )

  return staticParams
}
