import dynamic from 'next/dynamic'
import Hero from '../components/sectors/Hero/index'
import Tours from '@/components/sectors/Tours/Tours'
import OurServices from '@/components/sectors/OurServices'
import Footer from '@/components/sectors/Footer'

export default function Home() {
  const Video = dynamic(() => import('../components/Video'), {
    ssr: false,
  })
  const loading = false

  if (loading) {
    return (
      <main className={'main'}>
        <h2>Discover Berat is coming soon . . .</h2>
        <div className={'video'}>
          <Video />
        </div>
      </main>
    )
  }

  return (
    <main className={'main'}>
      <Hero />
      <OurServices />
      <Tours />
    </main>
  )
  }
  