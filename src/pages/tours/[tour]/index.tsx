import { getEntriesByType } from '@/utils/contentful/contentful'
import { GetServerSideProps } from 'next'

import Tour from '@/components/Tour'

type Tour = {
  title: string
  description: string
  price: number
  currency: string
  imgUrl?: string
  url: string
}

export default function Page({ tour }: { tour: any }) {
  if (!tour) {
    return (
      <div>
        <h1>Tour not found</h1>
      </div>
    )
  }

  return (
    <Tour
      tour={{ ...tour.fields, imgUrl: tour.fields.image.fields.file.url }}
    />
  )
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const entries = await getEntriesByType('tourPage')
  const tour: any =
    entries?.find((e: any) => e?.fields?.url === params?.tour) || null

  return {
    props: { tour },
  }
}
