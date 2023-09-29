import Card from '@/components/simple/Card'
import { FC } from 'react'
import styles from './OurServices.module.css'
export const OurServices: FC = () => {
  const services = [
    {
      title: 'Tour Packages',
      image: 'next.svg',
    },
    {
      title: 'Transport and Transfers',
    },
    {
      title: 'Accommodation Booking',
    },
    {
      title: 'Guided Tours and Activities',
    },
  ]
  return (
    <div className={styles.servicesContainer}>
      <h2>Our Services</h2>
      <div className={styles.cardsContainer}>
        {services.map((service) => (
          <Card
            className={styles.card}
            key={service.title}
            title={service.title}
          />
        ))}
      </div>
    </div>
  )
}
