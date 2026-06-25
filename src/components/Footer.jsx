import { Link } from 'react-router-dom'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Logo & Tagline */}
          <div className={styles.brandCol}>
            <Link to="/" className={styles.logo}>
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                <defs>
                  <linearGradient id="footerGrad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#059669"/>
                    <stop offset="100%" stopColor="#2563EB"/>
                  </linearGradient>
                </defs>
                <rect width="32" height="32" rx="8" fill="url(#footerGrad)" />
                <path
                  d="M9 16.5L14 21.5L23 11.5"
                  stroke="#fff"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className={styles.logoText}>
                <span className={styles.logoAccent}>Quick</span>Service
              </span>
            </Link>
            <p className={styles.tagline}>
              Connecting skilled professionals with clients across Cameroon.
            </p>
          </div>

          {/* Platform Links */}
          <div className={styles.column}>
            <h4 className={styles.columnTitle}>Platform</h4>
            <nav className={styles.columnLinks}>
              <Link to="/" className={styles.link}>Home</Link>
              <Link to="/" className={styles.link}>Browse Services</Link>
              <Link to="/register" className={styles.link}>Become a Provider</Link>
              <Link to="/support" className={styles.link}>Support & Help</Link>
            </nav>
          </div>

          {/* Categories */}
          <div className={styles.column}>
            <h4 className={styles.columnTitle}>Categories</h4>
            <nav className={styles.columnLinks}>
              <Link to="/" className={styles.link}>Hairdressers</Link>
              <Link to="/" className={styles.link}>Electricians</Link>
              <Link to="/" className={styles.link}>Plumbers</Link>
              <Link to="/" className={styles.link}>Mechanics</Link>
            </nav>
          </div>

          {/* Contact */}
          <div className={styles.column}>
            <h4 className={styles.columnTitle}>Contact</h4>
            <div className={styles.columnLinks}>
              <a href="mailto:hello@quickservice.cm" className={styles.link}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="M22 4L12 13L2 4" />
                </svg>
                hello@quickservice.cm
              </a>
              <a href="tel:+237650136835" className={styles.link}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                </svg>
                +237 650 136 835
              </a>
              <a href="https://wa.me/237650136835" target="_blank" rel="noopener noreferrer" className={styles.link}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
                </svg>
                WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={styles.bottomBar}>
          <span>&copy; 2026 QuickService. All rights reserved.</span>
        </div>
      </div>
    </footer>
  )
}
