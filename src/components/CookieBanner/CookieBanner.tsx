'use client';

import React, { useEffect, useState } from 'react';
import styles from './CookieBanner.module.css'; // Import CSS module
import Link from 'next/link';
import { parseCookies, setCookie } from 'nookies';
import Button from '../simple/Button';

const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(() => {
    if (typeof window === 'undefined') return false;
    const cookies = parseCookies();
    const hasVisitedBefore = cookies.visitedBefore === 'true';
    const lastHideTimestamp = cookies.lastHideTimestamp;
    const hideUntil = new Date(
      Number(lastHideTimestamp) + 90 * 24 * 60 * 60 * 1000,
    ); // 90 days
    return !hasVisitedBefore || !lastHideTimestamp || new Date() >= hideUntil;
  });

  useEffect(() => {
    const cookies = parseCookies();
    if (cookies.visitedBefore !== 'true') {
      setCookie(null, 'visitedBefore', 'true', { path: '/' });
    }
  }, []);

  const hideBanner = () => {
    setCookie(null, 'lastHideTimestamp', String(Date.now()), {
      path: '/',
      maxAge: 90 * 24 * 60 * 60,
    });
    setIsVisible(false);
  };

  return (
    <>
      {isVisible && (
        <div data-testid="cookie-banner" className={styles.cookieBanner}>
          <div>
            <span className={styles.cookieText}>
              This website uses cookies.
            </span>
            <span className={styles.cookieText}>
              {' '}
              Why we use cookies? Click to learn more
              <Button
                variant="link"
                href="/cookie-policy"
                className={styles.cookieLink}
              >
                Cookie Policy
              </Button>
            </span>
          </div>
          <Button
            data-testid="cookie-banner-hide-button"
            variant="tertiary"
            className={styles.hideButton}
            onClick={hideBanner}
          >
            Okay
          </Button>
        </div>
      )}
    </>
  );
};

export default CookieBanner;
