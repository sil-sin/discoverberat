'use client';

import React, { useEffect, useState, useSyncExternalStore } from 'react';
import styles from './CookieBanner.module.css'; // Import CSS module
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

const subscribe = () => () => {};

const parseCookies = () =>
  Object.fromEntries(document.cookie.split('; ').map((pair) => pair.split('=')));

const getShouldShow = () => {
  const cookies = parseCookies();
  const hasVisitedBefore = cookies.visitedBefore === 'true';
  const lastHideTimestamp = cookies.lastHideTimestamp;
  const hideUntil = new Date(
    Number(lastHideTimestamp) + 90 * 24 * 60 * 60 * 1000,
  ); // 90 days
  return !hasVisitedBefore || !lastHideTimestamp || new Date() >= hideUntil;
};

export const CookieBanner = () => {
  const shouldShow = useSyncExternalStore(subscribe, getShouldShow, () => false);
  const [isHidden, setIsHidden] = useState(false);
  const isVisible = shouldShow && !isHidden;

  useEffect(() => {
    const cookies = parseCookies();
    if (cookies.visitedBefore !== 'true') {
      document.cookie = 'visitedBefore=true; path=/';
    }
  }, []);

  const hideBanner = () => {
    document.cookie = `lastHideTimestamp=${Date.now()}; path=/; max-age=${90 * 24 * 60 * 60}`;
    setIsHidden(true);
  };

  return (
    <>
      {isVisible && (
        <div data-testid="cookie-banner" className={styles.cookieBanner}>
          <div>
            <span className={styles.cookieText}>
              We use only the cookies the site needs to work.
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

