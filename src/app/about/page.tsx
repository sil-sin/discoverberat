import styles from '@/styles/aboutUs.module.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us - Discover Berat',
  description: 'Learn about Discover Berat - Where Local Stories Come to Life!',
};

export default function About() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>About Us</h1>

      <p className={styles.description}>
        Welcome to <strong>Discover Berat</strong> - Where Local Stories Come to
        Life!
      </p>

      <p className={styles.description}>
        At Discover Berat, we believe that the heart of any journey lies in the
        stories it unfolds. We are a passionate team of seasoned tour guides,
        each with a rich tapestry of experiences from our previous roles as
        guides in various corners of the world. Our collective knowledge and
        love for exploration have now converged to create a unique travel
        experience centered around the enchanting city of Berat.
      </p>

      <h2 className={styles.subtitle}>Our Philosophy</h2>

      <ul className={styles.list}>
        <li>
          <strong>Rooted in Local Culture:</strong> Our itineraries are crafted
          to immerse you in the vibrant culture, history, and traditions of
          Berat. From the ancient cobblestone streets to the local markets
          bustling with life, we strive to showcase the authentic beauty of this
          region.
        </li>
        <li>
          <strong>Experienced Guides:</strong> Our tour guides bring a wealth of
          expertise gained from guiding travelers across diverse landscapes.
          Their passion for storytelling and deep-rooted knowledge will not only
          make your journey informative but also incredibly engaging.
        </li>
        <li>
          <strong>Small Group Experience:</strong> We believe in quality over
          quantity. Our small group tours ensure a more intimate and
          personalized experience, allowing you to connect with both the
          destination and fellow travelers on a deeper level.
        </li>
      </ul>

      <h2 className={styles.subtitle}>What Sets Us Apart</h2>

      <ul className={styles.list}>
        <li>
          <strong>Customized Itineraries:</strong> We understand that every
          traveler is unique. That&apos;s why we offer customizable itineraries,
          allowing you to tailor your journey based on your interests, pace, and
          preferences.
        </li>
        <li>
          <strong>Off the Beaten Path:</strong> While we appreciate the famous
          landmarks, we take pride in revealing hidden gems that often go
          unnoticed. Prepare to be captivated by the lesser-known wonders that
          make Berat truly special.
        </li>
        <li>
          <strong>Sustainable Tourism:</strong> We are committed to responsible
          travel. Our tours are designed to minimize environmental impact and
          support local communities, ensuring a positive and lasting
          contribution to the places we visit.
        </li>
      </ul>

      <h2 className={styles.subtitle}>Join Us on a Journey of Discovery</h2>

      <p className={styles.description}>
        Whether you are a history enthusiast, a food lover, or simply seeking an
        escape from the ordinary, Discover Berat invites you to embark on a
        journey that goes beyond sightseeing. Let us be your guides as we
        uncover the soul of Berat together.
      </p>

      <p className={styles.description}>
        Discover the charm, embrace the stories, and make memories that last a
        lifetime.
        <br /> Welcome to <strong>Discover Berat</strong> – Where Every Journey
        Tells a Tale.
      </p>
    </div>
  );
}
