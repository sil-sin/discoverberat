import { FC } from 'react'
import Image from 'next/image'

type Props = {}
export const Navigation: FC<{}> = () => {
  return (
    <nav>
      <a href='/'>
        <Image src='/vercel.svg' width={100} height={100} alt='Explore Berat' />
      </a>

      <ul>
        <li>About</li>
        <li>Contact</li>
        <li>Blog</li>
        <li>Tours</li>
      </ul>
    </nav>
  )
}
