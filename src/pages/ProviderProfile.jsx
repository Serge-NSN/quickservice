import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase/config'
import { motion } from 'framer-motion'
import { CATEGORIES } from '../data/providers'
import styles from './ProviderProfile.module.css'

const AVATAR_COLORS = [
  '#059669', '#2563EB', '#7C3AED', '#DB2777',
  '#EA580C', '#0891B2', '#4F46E5', '#B45309',
]

function getCategoryColor(category) {
  let hash = 0
  for (let i = 0; i < category.length; i++) {
    hash = category.charCodeAt(i) + ((hash << 5) - hash)
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

export default function ProviderProfile() {
  const { id } = useParams()
  const [provider, setProvider] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    const fetchProvider = async () => {
      try {
        const docRef = doc(db, 'providers', id)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          setProvider({ id: docSnap.id, ...docSnap.data() })
        } else {
          setNotFound(true)
        }
      } catch (err) {
        console.error(err)
        setNotFound(true)
      } finally {
        setLoading(false)
      }
    }
    fetchProvider()
  }, [id])

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.loadingWrap}>
          <div className={styles.spinner} />
          <p>Loading profile…</p>
        </div>
      </div>
    )
  }

  if (notFound) {
    return (
      <div className={styles.page}>
        <div className={styles.notFound}>
          <span className={styles.notFoundIcon}>😕</span>
          <h2>Provider Not Found</h2>
          <p>This listing may have been removed or doesn't exist.</p>
          <Link to="/" className={styles.backHomeBtn}>Back to Home</Link>
        </div>
      </div>
    )
  }

  const {
    name, category, description, pricing, location,
    phone, whatsapp, rating, reviewCount, verified, email, createdAt
  } = provider

  const avatarBg = getCategoryColor(category || '')
  const avatarLetter = name?.charAt(0).toUpperCase()
  const categoryLabel = CATEGORIES.find(c => c.id === category)?.name || category
  const categoryIcon = CATEGORIES.find(c => c.id === category)?.icon || '🔧'
  const whatsappNum = (whatsapp || phone || '').replace(/\+/g, '')
  const joinDate = createdAt ? new Date(createdAt).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }) : null

  const stars = Array.from({ length: 5 }, (_, i) => i < Math.round(rating || 0))

  return (
    <div className={styles.page}>
      <Link to="/" className={styles.backLink}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5" /><path d="M12 19l-7-7 7-7" />
        </svg>
        Back to listings
      </Link>

      <div className={styles.layout}>
        {/* Left: Main Card */}
        <motion.div
          className={styles.mainCard}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Hero Banner */}
          <div className={styles.heroBanner} style={{ background: `linear-gradient(135deg, ${avatarBg}22, ${avatarBg}44)` }}>
            <div className={styles.avatarWrapper}>
              <div className={styles.avatar} style={{ backgroundColor: avatarBg }}>
                {avatarLetter}
              </div>
              {verified && (
                <div className={styles.verifiedBadge} title="Verified Provider">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
            </div>
            <div className={styles.heroInfo}>
              <div className={styles.nameRow}>
                <h1 className={styles.name}>{name}</h1>
              </div>
              <div className={styles.categoryChip}>
                <span>{categoryIcon}</span>
                <span>{categoryLabel}</span>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className={styles.body}>
            {/* Rating */}
            <div className={styles.ratingRow}>
              <div className={styles.stars}>
                {stars.map((filled, i) => (
                  <span key={i} className={filled ? styles.starFilled : styles.starEmpty}>★</span>
                ))}
              </div>
              <span className={styles.ratingText}>{rating || 0} <span className={styles.reviewCount}>({reviewCount || 0} reviews)</span></span>
              {joinDate && <span className={styles.joinDate}>Member since {joinDate}</span>}
            </div>

            {/* Location */}
            <div className={styles.infoItem}>
              <div className={styles.infoIcon}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <div>
                <p className={styles.infoLabel}>Location</p>
                <p className={styles.infoValue}>{location?.quarter}, {location?.city}</p>
              </div>
            </div>

            {/* Description */}
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>About this Service</h3>
              <p className={styles.descriptionText}>{description}</p>
            </div>

            {/* Pricing */}
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Pricing</h3>
              {pricing?.type === 'fixed' ? (
                <div className={styles.pricingCard}>
                  <span className={styles.pricingAmount}>{pricing.amount?.toLocaleString()} {pricing.currency || 'XAF'}</span>
                  {pricing.unit && <span className={styles.pricingUnit}> / {pricing.unit}</span>}
                  <span className={styles.pricingTag}>Fixed Rate</span>
                </div>
              ) : (
                <div className={styles.pricingCardNegotiable}>
                  <span>💬</span>
                  <span>Price is negotiable — reach out to discuss</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Right: Contact Sidebar */}
        <motion.div
          className={styles.sidebar}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className={styles.sidebarCard}>
            <h3 className={styles.sidebarTitle}>Get in Touch</h3>
            <p className={styles.sidebarSubtitle}>Contact {name?.split(' ')[0]} directly</p>

            <div className={styles.contactBtns}>
              {whatsappNum && (
                <a
                  href={`https://wa.me/${whatsappNum}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.whatsappBtn}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Chat on WhatsApp
                </a>
              )}
              {phone && (
                <a href={`tel:${phone}`} className={styles.callBtn}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                  Call {phone}
                </a>
              )}
            </div>

            <div className={styles.divider} />

            <div className={styles.quickInfo}>
              <div className={styles.quickInfoItem}>
                <span className={styles.quickInfoLabel}>Category</span>
                <span className={styles.quickInfoValue}>{categoryLabel}</span>
              </div>
              <div className={styles.quickInfoItem}>
                <span className={styles.quickInfoLabel}>Rating</span>
                <span className={styles.quickInfoValue}>{rating || 0} / 5</span>
              </div>
              <div className={styles.quickInfoItem}>
                <span className={styles.quickInfoLabel}>Status</span>
                <span className={`${styles.quickInfoValue} ${styles.statusActive}`}>Active</span>
              </div>
            </div>
          </div>

          <Link to="/support" className={styles.reportLink}>
            Report an issue with this listing
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
