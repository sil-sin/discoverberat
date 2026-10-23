'use client';

import React, { FC, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import styles from './ContactForm.module.css';
import Button from '../simple/Button';
import { sendContactMessage } from './actions';
import { useRouter } from 'next/navigation';
import Toast from '../simple/Toast';
interface FormData {
  name: string;
  email: string;
  message: string;
}

const ContactForm: FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<FormData>();
  const router = useRouter();
  const onSubmit: SubmitHandler<FormData> = (data) => {
    const { name, email, message } = data;
    const handleSendEmail = async () => {
      try {
        await sendContactMessage(name, email, message);
        setIsSubmitted(true);
        router.push('#success');
        setTimeout(() => {
          setIsSubmitted(false);
        }, 3000);
      } catch (error) {
        setError('root', {
          message: 'Could not send your message. Please try again.',
        });
        console.error('Error sending email:', error);
      }
    };
    handleSendEmail();
  };

  return (
    <div className={styles.container} id="contact">
      <h2 className={styles.title}>Contact us</h2>
      <form
        data-testid="contact-form"
        className={styles.form}
        onSubmit={handleSubmit(onSubmit)}
      >
        <label htmlFor="name">Name:</label>
        <input
          placeholder="eg. John Doe"
          type="text"
          id="name"
          {...register('name', { required: 'Name is required' })}
        />
        {errors.name && (
          <Toast
            isTextOnly
            isError
            onClose={() => {
              setIsSubmitted(false);
            }}
            message={errors.name.message ?? 'Something went wrong!'}
          />
        )}
        <label htmlFor="email">Email:</label>
        <input
          placeholder="eg. johndoe@example.com"
          type="email"
          id="form-email"
          {...register('email', {
            required: 'Email is required',
            pattern: /^\S+@\S+$/i,
          })}
        />
        {errors.email && (
          <Toast
            isTextOnly
            isError
            onClose={() => {
              setIsSubmitted(false);
            }}
            message={errors.email.message ?? 'Something went wrong!'}
          />
        )}
        <label htmlFor="message">Message:</label>
        <textarea
          placeholder="Type your message here..."
          rows={5}
          id="message"
          {...register('message', { required: 'Message is required' })}
        ></textarea>
        {errors.message && (
          <Toast
            isTextOnly
            isError
            onClose={() => {
              setIsSubmitted(false);
            }}
            message={errors.message.message ?? 'Something went wrong!'}
          />
        )}

        <Button variant="primary" type="submit">
          Send
        </Button>
        {errors.root && (
          <Toast
            isTextOnly
            isError
            onClose={() => clearErrors('root')}
            message={errors.root.message ?? 'Something went wrong!'}
          />
        )}
        {isSubmitted && Object.keys(errors).length === 0 && (
          <Toast
            isSuccess
            onClose={() => {
              setIsSubmitted(false);
            }}
            message="Message sent successfully!"
          />
        )}
      </form>
    </div>
  );
};

export default ContactForm;
