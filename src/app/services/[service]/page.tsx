// src/app/services/[service]/page.tsx
'use client'
import { useEffect, useState } from 'react'
import { GiCornerFlag } from 'react-icons/gi'
import {
  MdTravelExplore,
  MdEmojiTransportation,
  MdOutlineLocalHotel,
} from 'react-icons/md'
import { useRouter } from 'next/router'

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

export default function ServicePage() {
  const router = useRouter()
  const { service } = router.query

  const [content, setContent] = useState('')

  useEffect(() => {
    localStorage.setItem('services', JSON.stringify(services))
    setContent(
      JSON.parse(
        localStorage.getItem('services') ?? '[{"title":"Not found"}]'
      )[0].title
    )
  }, [])

  const handleContentChange = (event: React.FocusEvent<any>) => {
    const newTitle = event.target.innerHTML
    const updatedServices = services.map((s) =>
      s.link === service ? { ...s, title: newTitle } : s
    )

    localStorage.setItem('services', JSON.stringify(updatedServices))
  }

  const admin = true

  const currentService = services.find((s) => s.link === service)

  if (!currentService) {
    return (
      <div>
        <h1>Service not found</h1>
      </div>
    )
  }

  return (
    <div>
      <h1
        id={'title'}
        contentEditable={admin}
        onBlur={handleContentChange}
        dangerouslySetInnerHTML={{ __html: currentService.title }}
      ></h1>
    </div>
  )
}
