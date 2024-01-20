import React from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import styles from './ContactForm.module.css'
import Button from '../simple/Button'
import { sendEmail } from '@/helpers/emailjs'
interface FormData {
  name: string
  email: string
  message: string
}

const ContactForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>()

  const onSubmit: SubmitHandler<FormData> = (data) => {
    const { name, email, message } = data
    const handleSendEmail = async () => {
      try {
        console.log('Sending email...')
        await sendEmail({
          toEmail: email,
          from_name: name,
          message: message,
        })
      } catch (error) {
        console.error('Error sending email:', error)
      }
    }
    handleSendEmail()
    console.log('Form Data:', data)
  }

  return (
    <div className={styles.container} id='contact'>
      <h2 className={styles.title}>Contact Us</h2>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor='name'>Name:</label>
        <input
          type='text'
          id='name'
          {...register('name', { required: 'Name is required' })}
        />
        {errors.name && <p>{errors.name.message}</p>}

        <label htmlFor='email'>Email:</label>
        <input
          type='email'
          id='email'
          {...register('email', {
            required: 'Email is required',
            pattern: /^\S+@\S+$/i,
          })}
        />
        {errors.email && <p>{errors.email.message}</p>}

        <label htmlFor='message'>Message:</label>
        <textarea
          id='message'
          {...register('message', { required: 'Message is required' })}
        ></textarea>
        {errors.message && <p>{errors.message.message}</p>}

        <Button variant='primary' type='submit'>
          Send
        </Button>
      </form>
    </div>
  )
}

export default ContactForm
