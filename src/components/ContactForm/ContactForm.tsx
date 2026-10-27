'use client';

import React, { FC } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import styles from './ContactForm.module.css';
import Button from '../simple/Button';
import { sendContactMessage } from './actions';
import Toast, { toast } from '../simple/Toast';
interface FormData {
  name: string;
  email: string;
  message: string;
}

const ContactForm: FC = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();
  const onSubmit: SubmitHandler<FormData> = async ({
    name,
    email,
    message,
  }) => {
    try {
      await sendContactMessage(name, email, message);
      reset();
      toast.success('Message sent. We reply by email.');
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('Your message could not be sent. Please try again.');
    }
  };

  return (
    <form
      data-testid="contact-form"
      className={styles.form}
      onSubmit={handleSubmit(onSubmit)}
    >
      <label htmlFor="name">Name</label>
      <input
        placeholder="eg. John Doe"
        type="text"
        id="name"
        autoComplete="name"
        {...register('name', { required: 'Name is required' })}
      />
      {errors.name && (
        <Toast
          isTextOnly
          isError
          message={errors.name.message ?? 'Something went wrong!'}
        />
      )}
      <label htmlFor="email">Email</label>
      <input
        placeholder="eg. johndoe@example.com"
        type="email"
        id="email"
        autoComplete="email"
        {...register('email', {
          required: 'Email is required',
          pattern: { value: /^\S+@\S+$/i, message: 'Enter a valid email' },
        })}
      />
      {errors.email && (
        <Toast
          isTextOnly
          isError
          message={errors.email.message ?? 'Something went wrong!'}
        />
      )}
      <label htmlFor="message">Message</label>
      <textarea
        placeholder="Tour, date, group size, questions…"
        rows={5}
        id="message"
        {...register('message', { required: 'Message is required' })}
      ></textarea>
      {errors.message && (
        <Toast
          isTextOnly
          isError
          message={errors.message.message ?? 'Something went wrong!'}
        />
      )}

      <Button
        variant="primary"
        type="submit"
        className={styles.submit}
        isLoading={isSubmitting}
      >
        Send message
      </Button>
    </form>
  );
};

export default ContactForm;
