import ResetPassword from '@/components/Authentication/ResetPassword'
import { getAuth, sendPasswordResetEmail } from 'firebase/auth'
import { useRef } from 'react'

export default function ForgotPassword() {
  //get email from onChange store it to ref
  const emailRef = useRef('')
  const auth = getAuth()

  const handleResetPassword = () => {
    sendPasswordResetEmail(auth, emailRef.current)
  }

  return (
    <div className='formContainer'>
      <ResetPassword
        onChange={(e: any) => (emailRef.current = e?.target.value)}
        onSubmit={handleResetPassword}
      />
    </div>
  )
}
