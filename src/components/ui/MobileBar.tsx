import type { ReactNode } from 'react';
import styles from './MobileBar.module.css';

export const MobileBar = ({ label, children }: { label: ReactNode; children: ReactNode }) => (
  <div className={styles.bar}>
    <p className={styles.label}>{label}</p>
    {children}
  </div>
);
