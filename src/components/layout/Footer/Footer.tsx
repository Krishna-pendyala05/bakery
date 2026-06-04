import React from 'react';
import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`${styles.container} container`}>
        <div className={styles.grid}>
          {/* Column 1: Brand */}
          <div className={styles.column}>
            <h3 className={styles.logo}>The Sweet Spot</h3>
            <p className={styles.description}>
              Handcrafting premium artisanal cakes for celebrations that matter. We use only organic ingredients and bake fresh every morning.
            </p>
          </div>

          {/* Column 2: Hours & Delivery */}
          <div className={styles.column}>
            <h4 className={styles.heading}>Hours & Delivery</h4>
            <ul className={styles.list}>
              <li className={styles.item}>Boutique Store: 9 AM - 9 PM</li>
              <li className={styles.item}>Online Ordering: 24/7</li>
              <li className={styles.item}>
                <strong>Delivery Radius:</strong> Up to 15km from Bandra store (Mumbai).
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Us (Required for PG Approval) */}
          <div className={styles.column}>
            <h4 className={styles.heading}>Contact Us</h4>
            <ul className={styles.list}>
              <li className={styles.item}>
                <strong>Store:</strong> 12, Rose Villa Lane, Bandra West, Mumbai, MH - 400050
              </li>
              <li className={styles.item}>
                <strong>Phone:</strong> +91 98765 43210
              </li>
              <li className={styles.item}>
                <strong>Email:</strong> hello@sweetspotbakery.in
              </li>
            </ul>
          </div>

          {/* Column 4: Links (Required for PG Approval) */}
          <div className={styles.column}>
            <h4 className={styles.heading}>Customer Care</h4>
            <ul className={styles.list}>
              <li className={styles.item}>
                <Link href="/cakes" className={styles.link}>Order Cakes</Link>
              </li>
              <li className={styles.item}>
                <Link href="/about" className={styles.link}>Our Story</Link>
              </li>
              <li className={styles.item}>
                <Link href="/terms" className={styles.link}>Terms & Conditions</Link>
              </li>
              <li className={styles.item}>
                <Link href="/privacy" className={styles.link}>Privacy Policy</Link>
              </li>
              <li className={styles.item}>
                <Link href="/refund" className={styles.link}>Refund & Cancellation</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} The Sweet Spot Bakery. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
