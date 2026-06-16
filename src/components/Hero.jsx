import { motion } from 'framer-motion';
import AnimatedBackground from './AnimatedBackground';
import styles from './Hero.module.css';

const Hero = ({ onSearch, onCategoryChange, categories = [] }) => {
  return (
    <section className={styles.hero}>
      <AnimatedBackground />

      <div className={styles.content}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <span className={styles.badge}>
            <span className={styles.badgeDot} />
            Trusted by 500+ professionals in Cameroon
          </span>
        </motion.div>

        <motion.h1
          className={styles.heading}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          Find Trusted{' '}
          <span className={styles.headingAccent}>Services</span>
          <br />
          in Douala
        </motion.h1>

        <motion.p
          className={styles.subtitle}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          Connect with verified skilled professionals in your neighborhood.
          From hairdressers to electricians — quality service is just a tap away.
        </motion.p>

        <motion.div
          className={styles.searchContainer}
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className={styles.searchInputWrapper}>
            <svg className={styles.searchIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search for a service..."
              onChange={(e) => onSearch?.(e.target.value)}
            />
          </div>
          <select
            className={styles.categorySelect}
            onChange={(e) => onCategoryChange?.(e.target.value)}
            defaultValue=""
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </motion.div>

        <motion.div
          className={styles.stats}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className={styles.statItem}>
            <span className={styles.statNumber}>500+</span>
            <span className={styles.statLabel}>Providers</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statItem}>
            <span className={styles.statNumber}>10,000+</span>
            <span className={styles.statLabel}>Connections</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statItem}>
            <span className={styles.statNumber}>4.8★</span>
            <span className={styles.statLabel}>Avg Rating</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
