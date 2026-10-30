import styles from '@/app/user/profile/[user]/_components/Dashboard.module.css';
import userStyles from './user.module.css';

const bar = (width: string, height = '1em') => (
  <span className="skeleton" style={{ width, height }} />
);

export default function Loading() {
  return (
    <div aria-busy="true" aria-label="Loading your profile">
      <header className={userStyles.userInfo}>
        <span
          className="skeleton"
          style={{ width: 64, height: 64, borderRadius: '50%' }}
        />
        <div style={{ display: 'grid', gap: 8, flex: 1 }}>
          {bar('40%', '2rem')}
          {bar('30%')}
        </div>
      </header>
      <div className={styles.dashboard}>
        <section>
          <h2 className={styles.heading}>Your next tour</h2>
          <div className={styles.ticket}>
            <div className={styles.ticketMain} style={{ display: 'grid', gap: 16 }}>
              {bar('70%', '1.75rem')}
              {bar('90%')}
              {bar('35%', '2.5rem')}
            </div>
            <div className={styles.ticketStub}>
              {bar('80%', '1.25rem')}
              {bar('50%')}
            </div>
          </div>
        </section>
        <section>
          <h2 className={styles.heading}>Later bookings</h2>
          <ul className={styles.list}>
            {[0, 1, 2].map((row) => (
              <li key={row} className={styles.row}>
                {bar('100%')}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
