import { User } from 'firebase/auth'
import { FC } from 'react'

type UserProfileProps = {
  user: User | null
}

const UserProfile: FC<UserProfileProps> = ({ user }) => {
  if (!user) {
    return null
  }

  const { displayName, email, phoneNumber, uid } = user
  return (
    <div id={uid} className='tour-package'>
      <h2>{displayName}</h2>
      <p>Email: {email}</p>
      <p>Mobile: {phoneNumber}</p>
    </div>
  )
}

export default UserProfile
