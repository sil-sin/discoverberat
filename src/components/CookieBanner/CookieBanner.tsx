import React, { useEffect, useState } from 'react'
import styles from './CookieBanner.module.css' // Import CSS module
import Link from 'next/link'
import { parseCookies, setCookie } from 'nookies'
import Button from '../simple/Button'

const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const cookies = parseCookies()
    const hasVisitedBefore = cookies.visitedBefore === 'true'
    const lastHideTimestamp = cookies.lastHideTimestamp
    const hideUntil = new Date(
      Number(lastHideTimestamp) + 90 * 24 * 60 * 60 * 1000
    ) // 90 days

    if (!hasVisitedBefore) {
      setIsVisible(true)
      setCookie(null, 'visitedBefore', 'true', { path: '/' })
    } else if (!lastHideTimestamp || new Date() >= hideUntil) {
      setIsVisible(true)
    }
  }, [])

  const hideBanner = () => {
    setCookie(null, 'lastHideTimestamp', String(Date.now()), {
      path: '/',
      maxAge: 90 * 24 * 60 * 60,
    })
    setIsVisible(false)
  }

  return (
    <>
      {isVisible && (
        <div className={styles.cookieBanner}>
          <div>
            <span className={styles.cookieText}>
              This website uses cookies.
            </span>
            <span className={styles.cookieText}>
              {' '}
              Why we use cookies? Click to learn more
              <Button
                variant='link'
                href='/cookie-policy'
                className={styles.cookieLink}
              >
                Cookie Policy
              </Button>
            </span>
          </div>
          <Button
            variant='tertiary'
            className={styles.hideButton}
            onClick={hideBanner}
          >
            Okay
          </Button>
        </div>
      )}
    </>
  )
}

export default CookieBanner
