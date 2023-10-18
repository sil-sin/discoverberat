import { getAllEntries, type Entry } from '@/contentful/contentful'
import { GetStaticProps } from 'next'
import Image from 'next/image'

type Tour = Entry & {
  title: string
  description: string
  price: number
  currency: string
  imgUrl?: string
  url: string
}

const tours: Tour[] = [
  {
    title: 'Osumi Canyon & Bogova Waterfall',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent et felis eget elit ornare luctus. In hac habitasse platea dictumst.',
    imgUrl: 'next.svg',
    price: 50,
    currency: '€',
    url: 'osumi-canyon-and-bogova-waterfall',
  },
  {
    title: 'Tomori Mountain',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent et felis eget elit ornare luctus. In hac habitasse platea dictumst.',
    imgUrl: 'next.svg',
    price: 50,
    currency: '€',

    url: 'tomori-mountain',
  },
  {
    title: 'Berat City Tour',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent et felis eget elit ornare luctus. In hac habitasse platea dictumst.',
    imgUrl: 'next.svg',
    currency: '€',
    price: 50,
    url: 'berat-city-tour',
  },
]

export default function Page({ tour }: { tour: any }) {
  if (!tour) {
    return (
      <div>
        <h1>entry not found</h1>
      </div>
    )
  }

  const { price, title, description, currency, image } = tour?.fields
  const imgUrl = image?.fields?.file?.url as string
  const paragraphs = description?.content?.map((item: any, index: number) => {
    return item.nodeType === 'paragraph' ? (
      <p> {item?.content[0]?.value} </p>
    ) : (
      item?.content.map((item: any) => (
        <li key={index}> {item.content[0].content[0].value} </li>
      ))
    )
  })

  return (
    <div>
      <h1>{title}</h1>
      <p>
        {price} {currency}
      </p>
      <>{paragraphs}</>
      <Image width={200} height={200} alt='image' src={`https:${imgUrl}`} />
    </div>
  )
}

export const getStaticPaths = async () => {
  const entries = await getAllEntries()
  const staticPaths = entries.map((entry: any) => {
    return {
      params: {
        tour: entry?.fields?.url,
      },
    }
  })

  return {
    paths: staticPaths,
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const entries = await getAllEntries()

  const tour = entries.find((e: any) => e?.fields?.url === params?.tour) || null

  // @ts-ignore
  const imgUrl = tour?.fields?.image?.fields?.file?.url
  console.log('here', imgUrl)

  return {
    props: { tour, imgUrl },
  }
}
