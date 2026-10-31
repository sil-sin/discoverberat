'use client';

import React, { FC } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import styles from './ContactForm.module.css';
import { Button } from '@/components/ui/Button';
import { EMAIL_PATTERN, MAX_MESSAGE_LENGTH, REQUIRED } from '@/lib/forms';
import { MAX_TEXT_LENGTH } from '@/lib/booking';
import { sendContactMessage } from '@/app/contact/actions';
import { toast } from '@/components/ui/Toast';
import { Input, TextArea } from '@/components/ui/Input';
interface FormData {
  name: string;
  email: string;
  message: string;
  website: string;
}

export const ContactForm: FC<{ message?: string }> = ({ message }) => {
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
    website,
  }) => {
    try {
      const result = await sendContactMessage(name, email, message, website);
      if (result?.error) return toast.error(result.error);
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
        maxLength={MAX_TEXT_LENGTH}
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
        maxLength={MAX_TEXT_LENGTH}
        isRequired
        error={errors.email?.message}
        {...register('email', {
          required: REQUIRED,
          pattern: { value: EMAIL_PATTERN, message: 'Enter a valid email' },
        })}
      />
      <TextArea
        label="Message"
        placeholder="Tour, date, group size, questions…"
        id="message"
        maxLength={MAX_MESSAGE_LENGTH}
        isRequired
        error={errors.message?.message}
        {...register('message', { required: REQUIRED })}
      />
      <input
        className={styles.honeypot}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        {...register('website')}
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

