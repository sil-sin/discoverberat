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
export default function Page({ params }: { params: { tour: string } }) {
  console.log(tours[0].link, params.tour)

  const tour = tours.filter((tour: Tour) => tour.link === params.tour)[0]

  if (!tour) {
    return (
      <div>
        <h1>tour not found</h1>
      </div>
    )
  }
  return (
    <div>
      <h1> {tour?.title}</h1>
      <p>{tour?.description}</p>
      <Image width={200} height={200} alt='image' src={tour?.image} />
    </div>
  )
}

export function generateStaticParams() {
  const staticParams = tours.map((tour: Tour) => {
    console.log(tour.link)
    return {
      tour: tour.link,
    }
  })

  return staticParams
}
