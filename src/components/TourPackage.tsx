import { FC } from 'react'

type TourPackageProps = {
  name: string
  destination: string
  duration: string
  price: number
}

const TourPackage: FC<TourPackageProps> = ({
  name,
  destination,
  duration,
  price,
}) => {
  return (
    <div className='tour-package'>
      <h2>{name}</h2>
      <p>Destination: {destination}</p>
      <p>Duration: {duration}</p>
      <p>Price: ${price}</p>
    </div>
  )
}

export default TourPackage
