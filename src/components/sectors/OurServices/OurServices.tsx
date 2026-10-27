import { FC } from 'react'
import Link from 'next/link'
import styles from './OurServices.module.css'
import { MdEmojiTransportation, MdOutlineLocalHotel } from 'react-icons/md'
import { GiCornerFlag } from 'react-icons/gi'
import { FiArrowRight } from 'react-icons/fi'

const services = [
  {
    title: 'Guided tours',
    description: 'Old town walks, canyon trips and wine tastings.',
    Icon: GiCornerFlag,
    link: '/tours',
  },
  {
    title: 'Transfers',
    description: 'Rides to the airport, Tirana and the coast.',
    Icon: MdEmojiTransportation,
    link: '/services/transfers',
  },
  {
    title: 'Accommodation',
    description: 'Help finding a place to stay in Berat.',
    Icon: MdOutlineLocalHotel,
    link: '/services/accommodation',
  },
]

export const OurServices: FC = () => (
  <section className={styles.servicesContainer}>
    <h2 className={styles.servicesTitle}>What we do</h2>
    <ul className={styles.cardsContainer}>
      {services.map(({ title, description, Icon, link }) => (
        <li key={title}>
          <Link className={styles.card} href={link}>
            <Icon aria-hidden className={styles.icon} />
            <span className={styles.text}>
              <strong>{title}</strong>
              {description}
            </span>
            <FiArrowRight aria-hidden className={styles.arrow} />
          </Link>
        </li>
      ))}
    </ul>
  </section>
)
