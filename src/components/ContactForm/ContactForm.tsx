import React, { FC, useEffect, useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import styles from './ContactForm.module.css'
import Button from '../simple/Button'
import { getFirestore, addDoc, collection } from 'firebase/firestore'
import app from '@/utils/firebase/firebaseConfig'
import { useRouter } from 'next/router'
import Toast from '../simple/Toast'
interface FormData {
  name: string
  email: string
  message: string
}

const ContactForm: FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>()
  const router = useRouter()
  const onSubmit: SubmitHandler<FormData> = (data) => {
    const { name, email, message } = data
    const handleSendEmail = async () => {
      try {
        const db = getFirestore(app)

        await addDoc(collection(db, 'mail'), {
          to: process.env.NEXT_PUBLIC_ADMIN,
          message: {
            subject: `New message from ${name} (${email})`,
            html: message,
          },
        })
        setIsSubmitted(true)
        router.push('#success')
        setTimeout(() => {
          setIsSubmitted(false)
        }, 3000)
      } catch (error) {
        setIsSubmitted(true)
        console.error('Error sending email:', error)
      }
    }
    handleSendEmail()
  }

  useEffect(() => {
    if (errors.email || errors.name || errors.message) {
      setIsSubmitted(true)
    }
  }, [errors.email, errors.message, errors.name])

  return (
    <div className={styles.container} id='contact'>
      <h2 className={styles.title}>Contact us</h2>
      <form
        data-testid='contact-form'
        className={styles.form}
        onSubmit={handleSubmit(onSubmit)}
      >
        <label htmlFor='name'>Name:</label>
        <input
          placeholder='eg. John Doe'
          type='text'
          id='name'
          {...register('name', { required: 'Name is required' })}
        />
        {isSubmitted && errors.name && (
          <Toast
            isTextOnly
            isError
            onClose={() => {
              setIsSubmitted(false)
            }}
            message={errors.name.message ?? 'Something went wrong!'}
          />
        )}
        <label htmlFor='email'>Email:</label>
        <input
          placeholder='eg. johndoe@example.com'
          type='email'
          id='form-email'
          {...register('email', {
            required: 'Email is required',
            pattern: /^\S+@\S+$/i,
          })}
        />
        {isSubmitted && errors.email && (
          <Toast
            isTextOnly
            isError
            onClose={() => {
              setIsSubmitted(false)
            }}
            message={errors.email.message ?? 'Something went wrong!'}
          />
        )}
        <label htmlFor='message'>Message:</label>
        <textarea
          placeholder='Type your message here...'
          rows={5}
          id='message'
          {...register('message', { required: 'Message is required' })}
        ></textarea>
        {isSubmitted && errors.message && (
          <Toast
            isTextOnly
            isError
            onClose={() => {
              setIsSubmitted(false)
            }}
            message={errors.message.message ?? 'Something went wrong!'}
          />
        )}

        <Button variant='primary' type='submit'>
          Send
        </Button>
        {isSubmitted && Object.keys(errors).length === 0 && (
          <Toast
            isSuccess
            onClose={() => {
              setIsSubmitted(false)
            }}
            message='Message sent successfully!'
          />
        )}
      </form>
    </div>
  )
}

export default ContactForm
