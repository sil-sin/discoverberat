import Card from '@/components/simple/Card'
import { FC } from 'react'
import styles from './OurServices.module.css'
import {
  MdEmojiTransportation,
  MdOutlineLocalHotel,
  MdTravelExplore,
} from 'react-icons/md'
import { GiCornerFlag } from 'react-icons/gi'

export const OurServices: FC = () => {
  const services = [
    {
      title: 'Guided Tours and Activities',
      icon: <GiCornerFlag size={50} />,
      link: '/tours',
    },
    {
      title: 'Transport and Transfers',
      icon: <MdEmojiTransportation size={50} />,
      link: 'services/transport',
    },
    {
      title: 'Accommodation Booking',
      icon: <MdOutlineLocalHotel size={50} />,
      link: 'services/accommodation',
    },
  ]

  return (
    <div className={styles.servicesContainer}>
      <h2 className={styles.servicesTitle}>Our Services</h2>
      <div className={styles.cardsContainer}>
        {services.map((service) => (
          <a
            className={styles.cardLink}
            key={service.title}
            href={service.link}
          >
            <Card
              iconCard={true}
              cardIcon={service.icon}
              className={styles.card}
              title={service.title}
            />
          </a>
        ))}
      </div>
    </div>
  )
}
