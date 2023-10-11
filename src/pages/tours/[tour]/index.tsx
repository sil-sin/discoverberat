import { GetStaticProps } from 'next'
import Image from 'next/image'

type Tour = {
  title: string
  description: string
  image: string
  price: string
  link: string
}

const tours: Tour[] = [
  {
    title: 'Osumi Canyon & Bogova Waterfall',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent et felis eget elit ornare luctus. In hac habitasse platea dictumst.',
    image: 'next.svg',
    price: '50 EUR',
    link: 'osumi-canyon-and-bogova-waterfall',
  },
  {
    title: 'Tomori Mountain',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent et felis eget elit ornare luctus. In hac habitasse platea dictumst.',
    image: 'next.svg',
    price: '50 EUR',
    link: 'tomori-mountain',
  },
  {
    title: 'Berat City Tour',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent et felis eget elit ornare luctus. In hac habitasse platea dictumst.',
    image: 'next.svg',
    price: '50 EUR',
    link: 'berat-city-tour',
  },
]

export default function Page({ tour }: { tour: Tour }) {
  if (!tour) {
    return (
      <div>
        <h1>tour not found</h1>
      </div>
    )
  }
  return (
    <div>
      <h1>{tour?.title}</h1>
      <p>{tour?.description}</p>
      <Image width={200} height={200} alt='image' src={`/${tour?.image}`} />
    </div>
  )
}

export const getStaticPaths = async () => {
  const staticPaths = tours.map((tour: Tour) => {
    return {
      params: {
        tour: tour.link,
      },
    }
  })

  return {
    paths: staticPaths,
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const tour = tours.find((t: Tour) => t.link === params?.tour) || null

  return {
    props: { tour },
  }
}
