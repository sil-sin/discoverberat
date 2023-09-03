'use client'
import Button from '@/components/simple/Button'
import styles from './page.module.css'
export default function Page() {
  return (
    <div className={styles.container}>
      Testing page
      <Button
        variant='primary'
        onClick={() => console.log('click')}
        text={'Primary'}
      />
      <Button
        variant='secondary'
        onClick={function (): void {
          console.log('click ')
        }}
        text={'Secondary'}
      />
      <Button
        variant='tertiary'
        onClick={function (): void {
          console.log('click')
        }}
        text={'Tertiary'}
      />
      <Button
        variant='link'
        onClick={function (): void {
          console.log('click')
        }}
        text={'Link'}
        href='/tours'
      />
    </div>
  )
}
