import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CATEGORIES } from '../data/providers';
import styles from './ServiceCard.module.css';

const AVATAR_COLORS = [
  '#059669', '#2563EB', '#7C3AED', '#DB2777',
  '#EA580C', '#0891B2', '#4F46E5', '#B45309',
];

function getCategoryColor(category) {
  let hash = 0;
  for (let i = 0; i < category.length; i++) {
    hash = category.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function formatPrice(amount) {
  return amount.toLocaleString('en-US');
}

function ServiceCard({ provider }) {
  const {
    name,
    category,
    description,
    pricing,
    location,
    contact,
    rating,
    reviewCount,
    verified,
  } = provider;

  const avatarLetter = name.charAt(0).toUpperCase();
  const avatarBg = getCategoryColor(category);
  const whatsappNumber = contact ? (contact.whatsapp || contact.phone).replace(/\+/g, '') : (provider.whatsapp || provider.phone).replace(/\+/g, '');
  const phoneNumber = contact ? contact.phone : provider.phone;
  
  const categoryLabel = CATEGORIES.find(c => c.id === category)?.name || category;

  return (
    <motion.div
      whileHover={{ y: -6, transition: { duration: 0.25 } }}
      className={`${styles.card} service-card`}
    >
      {/* Gradient Strip */}
      <div className={styles.gradientStrip} />

      <div className={styles.cardInner}>
        {/* Header */}
        <div className={styles.header}>
          <div
            className={styles.avatar}
            style={{ backgroundColor: avatarBg }}
          >
            {avatarLetter}
          </div>
          <div className={styles.headerInfo}>
            <div className={styles.nameRow}>
              <span className={styles.name}>{name}</span>
              {verified && (
                <span className={styles.verifiedBadge} title="Verified">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M20 6L9 17L4 12"
                      stroke="white"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              )}
            </div>
            <span className={styles.categoryPill}>{categoryLabel}</span>
          </div>
        </div>

        {/* Location */}
        <div className={styles.location}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span>{location.quarter}, {location.city}</span>
        </div>

        {/* Description */}
        <p className={styles.description}>{description}</p>

        {/* Pricing */}
        {pricing.type === 'fixed' ? (
          <div className={styles.priceBadgeFixed}>
            <span className={styles.priceAmount}>
              {formatPrice(pricing.amount)} {pricing.currency || 'FCFA'}
            </span>
            {pricing.unit && (
              <span className={styles.priceUnit}> / {pricing.unit}</span>
            )}
          </div>
        ) : (
          <div className={styles.priceBadgeNegotiable}>
            💬 Price Negotiable
          </div>
        )}

        {/* Rating */}
        <div className={styles.rating}>
          <span className={styles.starIcon}>★</span>
          <span className={styles.ratingValue}>{rating}</span>
          <span className={styles.reviewCount}>({reviewCount} reviews)</span>
        </div>

        {/* CTA Buttons */}
        <div className={styles.ctaButtons}>
          <a
            href={`https://wa.me/${whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.whatsappButton}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            WhatsApp
          </a>
          <a
            href={`tel:${phoneNumber}`}
            className={styles.callButton}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            Call
          </a>
        </div>
        <Link to={`/provider/${provider.id}`} className={styles.profileLink}>
          View Full Profile →
        </Link>
      </div>
    </motion.div>
  );
}

export default ServiceCard;
