import Hero from '../components/sectors/Hero/index'
import OurServices from '@/components/sectors/OurServices'
import Tours from '@/components/sectors/Tours'
import Button from '@/components/simple/Button'
import { getEntriesByType } from '@/utils/contentful/contentful'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { TestimonialContainer } from '@/components/Testimonials/TestimonialsContainer'

function Home(props: any) {
  const { tours, transfers, reviews } = props
  const router = useRouter()

  if (!tours || !transfers) return

  const topTours = tours?.filter((tour: any) =>
    tour.fields?.category?.includes('top')
  )

  return (
    <>
      <Head>
        <title>Discover Berat</title>
        <meta charSet='UTF-8' />
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1.0'
        ></meta>

        <title>Discover Berat - Tour Operator</title>
        <meta name='title' content='Discover Berat - Tour Operator' />
        <meta
          name='description'
          content='Discover the charm, embrace the stories, and make memories that last a lifetime. Welcome to Discover Berat - Where Every Journey Tells a Tale.'
        />

        <meta property='og:type' content='website' />
        <meta property='og:url' content='https://discoverberat.com/' />
        <meta property='og:title' content='Discover Berat - Tour Operator' />
        <meta
          property='og:description'
          content='Discover the charm, embrace the stories, and make memories that last a lifetime. Welcome to Discover Berat - Where Every Journey Tells a Tale.'
        />
        <meta
          property='og:image'
          content='https://images.ctfassets.net/vzi02yirpwbf/5IgNZ5fK06tYapDIIs6bjO/6da1941f117f3cdafd4a0a5374023e23/favicon.ico'
        />

        <meta
          property='twitter:card'
          content='https://images.ctfassets.net/vzi02yirpwbf/5IgNZ5fK06tYapDIIs6bjO/6da1941f117f3cdafd4a0a5374023e23/favicon.ico'
        />
        <meta property='twitter:url' content='https://discoverberat.com/' />

        <meta
          property='twitter:title'
          content='Discover Berat - Tour Operator'
        />
        <meta
          property='twitter:description'
          content='Discover the charm, embrace the stories, and make memories that last a lifetime. Welcome to Discover Berat - Where Every Journey Tells a Tale.'
        />
        <meta
          property='twitter:image'
          content='https://images.ctfassets.net/vzi02yirpwbf/5IgNZ5fK06tYapDIIs6bjO/6da1941f117f3cdafd4a0a5374023e23/favicon.ico'
        />

        <link rel='preconnect' href='https://images.ctfassets.net' />
      </Head>
      <main className='main'>
        <Hero />
        <OurServices />
        <Tours tours={topTours} pageTitle={'Top Tours'} />

        <Button
          className='viewAll'
          variant='tertiary'
          onClick={() => {
            router.push('/tours')
          }}
        >
          View all tours
        </Button>
        <TestimonialContainer reviews={reviews} />
      </main>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const CACHE_TIME_SECONDS = 12 * 60 * 60 // 12 hours
  // Set caching headers for the response
  res.setHeader(
    'Cache-Control',
    `public, s-maxage=${CACHE_TIME_SECONDS}, stale-while-revalidate=59`
  )

  try {
    // Your data fetching logic here
    const tours = await getEntriesByType('tourPage')
    const transfers = await getEntriesByType('transfers')
    const services = await getEntriesByType('serviceCard')
    const reviews = fetch(
      'https://maps.googleapis.com/maps/api/place/details/json?place_id=ChIJQ1Y_cDuZWhMRu6CZ0pwtbwA&key=AIzaSyDLEwujzNxMGHIrC1i9ZGG_Lm3LkyKrLWE'
    )
      .then((res) => res.json())
      .then((data) => {
        return data.result?.reviews.map((item: any) => item)
      })

    return {
      props: { reviews: [...(await reviews)], tours, transfers, services },
    }
  } catch (error) {
    console.error('Error fetching data:', error)
    return {
      props: {
        tours: null,
        transfers: null,
        services: null,
      },
    }
  }
}

export default Home
