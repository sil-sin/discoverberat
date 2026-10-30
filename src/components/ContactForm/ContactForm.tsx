'use client';

import React, { FC } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import styles from './ContactForm.module.css';
import Button from '../simple/Button';
import { REQUIRED } from '@/helpers/forms';
import { sendContactMessage } from './actions';
import { toast } from '../simple/Toast';
import { Input, TextArea } from '../simple/Input';
interface FormData {
  name: string;
  email: string;
  message: string;
}

const ContactForm: FC<{ message?: string }> = ({ message }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ defaultValues: { message } });
  const onSubmit: SubmitHandler<FormData> = async ({
    name,
    email,
    message,
  }) => {
    try {
      await sendContactMessage(name, email, message);
      reset({ name: '', email: '', message: '' });
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
      <Input
        label="Name"
        placeholder="eg. John Doe"
        id="name"
        autoComplete="name"
        isRequired
        error={errors.name?.message}
        {...register('name', { required: REQUIRED })}
      />
      <Input
        label="Email"
        placeholder="eg. johndoe@example.com"
        type="email"
        id="email"
        autoComplete="email"
        isRequired
        error={errors.email?.message}
        {...register('email', {
          required: REQUIRED,
          pattern: { value: /^\S+@\S+$/i, message: 'Enter a valid email' },
        })}
      />
      <TextArea
        label="Message"
        placeholder="Tour, date, group size, questions…"
        id="message"
        isRequired
        error={errors.message?.message}
        {...register('message', { required: REQUIRED })}
      />

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
