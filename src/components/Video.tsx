import { FC } from 'react'
const Video: FC<{}> = () => {
  return (
    <video autoPlay loop muted playsInline>
      <source src='/loadingplane.webm' type='video/webm' />
    </video>
  )
}
export default Video
