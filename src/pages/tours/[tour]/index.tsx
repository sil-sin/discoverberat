import { getContentEntries } from '@/contentful/contentful'
import { GetServerSideProps } from 'next'
import Image from 'next/image'
import styles from './tour.module.css'
import Button from '@/components/simple/Button'

type Tour = {
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
    const paragraph = item?.content[0]?.value
    const markType = item?.content[0]?.marks

    return item.nodeType === 'paragraph' ? (
      <p key={index} className={styles.paragraph}>
        {markType[0]?.type === 'bold' && <b>{paragraph}</b>}
        {markType[0]?.type === 'italic' && <i>{paragraph}</i>}
        {!markType?.length && paragraph}
      </p>
    ) : (
      item?.content.map((item: any) => (
        <li key={index} className={styles.includedList}>
          {item.content[0].content[0].value}
        </li>
      ))
    )
  })

  return (
    <div
      onContextMenu={(event: React.MouseEvent) => {
        event.preventDefault()
      }}
      className={styles.container}
    >
      <h1>{title}</h1>
      <article className={styles.tourContainer}>
        <Image width={200} height={200} alt='image' src={`https:${imgUrl}`} />
        <>{paragraphs}</>
        <p>
          Price: {price} {currency} per person
        </p>
        <Button className={styles.button} variant='primary'>
          Book Tour
        </Button>
      </article>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const entries = await getContentEntries('tourPage')
  const tour = entries.find((e: any) => e?.fields?.url === params?.tour) || null

  return {
    props: { tour },
  }
}
