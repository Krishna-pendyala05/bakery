'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { cartCount, setIsCartOpen } = useCart();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  return (
    <header className={styles.header}>
      <div className={`${styles.container} container`}>
        {/* Brand Logo */}
        <Link href="/" className={styles.logo}>
          The Sweet Spot
          <span className={styles.subtitle}>Boutique Bakery</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className={styles.desktopNav}>
          <Link href="/" className={`${styles.navLink} ${isActive('/') ? styles.activeLink : ''}`}>
            Home
          </Link>
          <Link href="/cakes" className={`${styles.navLink} ${isActive('/cakes') ? styles.activeLink : ''}`}>
            Cakes
          </Link>
          <Link href="/admin" className={`${styles.navLink} ${isActive('/admin') ? styles.activeLink : ''}`}>
            Admin Panel
          </Link>
        </nav>

        {/* Right Action Icons */}
        <div className={styles.actions}>
          <button
            className={styles.cartButton}
            onClick={() => setIsCartOpen(true)}
            aria-label="Open shopping cart"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={styles.cartIcon}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
              />
            </svg>
            {cartCount > 0 && <span className={styles.cartBadge}>{cartCount}</span>}
          </button>

          {/* Hamburger Mobile Toggle */}
          <button
            className={styles.hamburger}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            <span className={`${styles.bar} ${isMobileMenuOpen ? styles.barOpen : ''}`} />
            <span className={`${styles.bar} ${isMobileMenuOpen ? styles.barOpen : ''}`} />
            <span className={`${styles.bar} ${isMobileMenuOpen ? styles.barOpen : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      <div className={`${styles.mobileDrawer} ${isMobileMenuOpen ? styles.drawerOpen : ''}`}>
        <nav className={styles.mobileNav}>
          <Link
            href="/"
            className={`${styles.mobileNavLink} ${isActive('/') ? styles.activeMobileLink : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/cakes"
            className={`${styles.mobileNavLink} ${isActive('/cakes') ? styles.activeMobileLink : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Cakes
          </Link>
          <Link
            href="/admin"
            className={`${styles.mobileNavLink} ${isActive('/admin') ? styles.activeMobileLink : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Admin Panel
          </Link>
        </nav>
      </div>
    </header>
  );
}
