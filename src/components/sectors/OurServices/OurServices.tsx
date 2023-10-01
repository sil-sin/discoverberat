import Card from '@/components/simple/Card'
import { FC } from 'react'
import styles from './OurServices.module.css'
import { LuPackageOpen } from 'react-icons/lu'
import {
  MdEmojiTransportation,
  MdOutlineLocalHotel,
  MdTravelExplore,
} from 'react-icons/md'
import { GiCornerFlag } from 'react-icons/gi'

export const OurServices: FC = () => {
  const services = [
    {
      title: 'Tour Packages',
      icon: <MdTravelExplore size={50} />,
    },
    {
      title: 'Transport and Transfers',
      icon: <MdEmojiTransportation size={50} />,
    },
    {
      title: 'Accommodation Booking',
      icon: <MdOutlineLocalHotel size={50} />,
    },
    {
      title: 'Guided Tours and Activities',
      icon: <GiCornerFlag size={50} />,
    },
  ]
  return (
    <div className={styles.servicesContainer}>
      <h2 className={styles.servicesTitle}>Our Services</h2>
      <div className={styles.cardsContainer}>
        {services.map((service) => (
          <Card
            iconCard={true}
            cardIcon={service.icon}
            className={styles.card}
            key={service.title}
            title={service.title}
          />
        ))}
      </div>
    </div>
  )
}
