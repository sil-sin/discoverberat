import { GiCornerFlag } from 'react-icons/gi'
import {
  MdTravelExplore,
  MdEmojiTransportation,
  MdOutlineLocalHotel,
} from 'react-icons/md'

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

export default function Page({ params }: { params: { service: string } }) {
  console.log(services[0].link, params.service)

  const service = services.filter(
    (service) => service.link === params.service
  )[0]

  if (!service) {
    return (
      <div>
        <h1>service not found</h1>
      </div>
    )
  }
  return (
    <div>
      <h1> {service?.title}</h1>
      <p>Something</p>
    </div>
  )
}

export function generateStaticParams() {
  const staticParams = services.map((service: { link: string }) => {
    console.log(service.link)
    return {
      service: service.link,
    }
  })

  return staticParams
}
