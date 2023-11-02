import { getEntry } from '@/utils/contentful/contentful'
import { GetServerSideProps } from 'next'
import Image from 'next/image'
import styles from './tour.module.css'
import Button from '@/components/simple/Button'
import { marked } from 'marked'

type Tour = {
  title: string
  description: string
  price: number
  currency: string
  imgUrl?: string
  url: string
}

export default function Page({ tour }: { tour: any; props: any }) {
  if (!tour) {
    return (
      <div>
        <h1>entry not found</h1>
      </div>
    )
  }
  console.log(tour)

  const { price, title, description, currency, image } = tour?.fields
  const imgUrl = image?.fields?.file?.url as string
  const htmlTextField = marked(description ?? '')

  return (
    <div
      onContextMenu={(event: React.MouseEvent) => {
        event.preventDefault()
      }}
      className={styles.container}
    >
      <h1>{title}</h1>
      <article className={styles.tourContainer}>
        <Image
          loading='lazy'
          width={1000}
          height={1000}
          alt='image'
          src={`https:${imgUrl}`}
        />
        <div dangerouslySetInnerHTML={{ __html: htmlTextField }} />
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
  const entries = await getEntry('tourPage')
  const tour: any =
    entries?.find((e: any) => e?.fields?.url === params?.tour) || null

  return {
    props: { tour },
  }
}
