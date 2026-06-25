import { useState } from 'react'
import { Link } from 'react-router-dom'
import { collection, addDoc } from 'firebase/firestore'
import { db } from '../firebase/config'
import { motion, AnimatePresence } from 'framer-motion'
import Footer from '../components/Footer'
import styles from './Support.module.css'

const FAQS = [
  {
    q: 'How do I find a service provider in my area?',
    a: 'Use the search bar on the homepage to look up services by name or description. You can also filter by category using the category pills, or select your area from the dropdown. All results show providers currently active in Douala.',
  },
  {
    q: 'How do I contact a provider?',
    a: 'Every listing has a "Chat on WhatsApp" button and a "Call Now" button. You can also click "View Profile" on a card to open their full profile page with all contact details.',
  },
  {
    q: 'How do I register as a service provider?',
    a: 'Click "Join as Provider" in the navigation bar. Fill in the 4-step registration form with your personal info, service details, and pricing. Once submitted, your profile goes live on the platform.',
  },
  {
    q: 'Are providers on QuickService verified?',
    a: 'Providers can be manually verified by our team after review. Verified providers display a green checkmark badge on their listing. We continuously curate the directory to ensure quality.',
  },
  {
    q: 'What does "Price Negotiable" mean?',
    a: 'Some providers prefer to discuss pricing based on the specific scope of work. This means there is no fixed rate — contact the provider directly to discuss and agree on a price.',
  },
  {
    q: 'Can I edit or remove my provider listing?',
    a: 'Currently, to edit or remove your listing, please contact us through the support form below or reach us via WhatsApp/email. We are building a self-serve provider dashboard soon.',
  },
  {
    q: 'How long does it take for my listing to appear?',
    a: 'Your listing appears on the platform immediately after you complete the registration form. There is no waiting period for the initial listing.',
  },
  {
    q: 'Is QuickService free to use?',
    a: 'Yes! QuickService is free for both service seekers and providers. We believe in making it easy to connect skilled professionals with the people who need them.',
  },
]

function FaqItem({ faq, index }) {
  const [open, setOpen] = useState(false)
  return (
    <motion.div
      className={styles.faqItem}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
    >
      <button className={styles.faqQuestion} onClick={() => setOpen(o => !o)}>
        <span>{faq.q}</span>
        <motion.span
          className={styles.faqChevron}
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25 }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            className={styles.faqAnswer}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          >
            <p>{faq.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function Support() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const update = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => { const n = { ...prev }; delete n[field]; return n })
  }

  const validate = () => {
    const e = {}
    if (!formData.name.trim()) e.name = 'Name is required'
    if (!formData.email.trim()) e.email = 'Email is required'
    if (!formData.subject.trim()) e.subject = 'Subject is required'
    if (!formData.message.trim()) e.message = 'Message is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    setSubmitError('')
    try {
      await addDoc(collection(db, 'tickets'), {
        ...formData,
        status: 'open',
        createdAt: new Date().toISOString(),
      })
      setSubmitted(true)
    } catch (err) {
      console.error(err)
      setSubmitError('Failed to send your message. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className={styles.page}>
      {/* Hero */}
      <div className={styles.hero}>
        <motion.div
          className={styles.heroContent}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className={styles.badge}>
            <span className={styles.badgeDot} />
            Support Center
          </div>
          <h1 className={styles.heroTitle}>How can we <span className={styles.accent}>help you?</span></h1>
          <p className={styles.heroSubtitle}>Browse the FAQs below or send us a message and we'll get back to you.</p>
        </motion.div>
      </div>

      <div className={styles.container}>
        {/* FAQ Section */}
        <div className={styles.faqSection}>
          <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
          <div className={styles.faqList}>
            {FAQS.map((faq, i) => <FaqItem key={i} faq={faq} index={i} />)}
          </div>
        </div>

        {/* Ticket Form */}
        <div className={styles.formSection}>
          <div className={styles.formCardWrapper}>
            <div className={styles.formCard}>
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success"
                    className={styles.successState}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                  >
                    <div className={styles.successIcon}>
                      <svg viewBox="0 0 52 52" className={styles.checkSvg}>
                        <circle className={styles.checkCircle} cx="26" cy="26" r="25" fill="none" />
                        <path className={styles.checkPath} fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                      </svg>
                    </div>
                    <h3 className={styles.successTitle}>Message Received!</h3>
                    <p className={styles.successText}>Your support ticket has been submitted. We typically respond within 24 hours.</p>
                    <div className={styles.ticketId}>Ticket #{Date.now().toString(36).toUpperCase()}</div>
                    <Link to="/" className={styles.backHome}>Return to Home</Link>
                  </motion.div>
                ) : (
                  <motion.div key="form">
                    <h2 className={styles.formTitle}>Send a Message</h2>
                    <p className={styles.formSubtitle}>Can't find what you're looking for? We're here to help.</p>

                    <form onSubmit={handleSubmit}>
                      <div className={styles.row2}>
                        <div className={styles.formGroup}>
                          <input
                            className={`${styles.floatingInput} ${errors.name ? styles.inputError : ''}`}
                            placeholder=" " value={formData.name}
                            onChange={e => update('name', e.target.value)}
                          />
                          <label className={styles.floatingLabel}>Full Name</label>
                          {errors.name && <span className={styles.error}>{errors.name}</span>}
                        </div>
                        <div className={styles.formGroup}>
                          <input
                            type="email"
                            className={`${styles.floatingInput} ${errors.email ? styles.inputError : ''}`}
                            placeholder=" " value={formData.email}
                            onChange={e => update('email', e.target.value)}
                          />
                          <label className={styles.floatingLabel}>Email Address</label>
                          {errors.email && <span className={styles.error}>{errors.email}</span>}
                        </div>
                      </div>

                      <div className={styles.formGroup}>
                        <input
                          className={`${styles.floatingInput} ${errors.subject ? styles.inputError : ''}`}
                          placeholder=" " value={formData.subject}
                          onChange={e => update('subject', e.target.value)}
                        />
                        <label className={styles.floatingLabel}>Subject</label>
                        {errors.subject && <span className={styles.error}>{errors.subject}</span>}
                      </div>

                      <div className={styles.formGroup}>
                        <textarea
                          rows={5}
                          className={`${styles.floatingInput} ${styles.textarea} ${errors.message ? styles.inputError : ''}`}
                          placeholder=" " value={formData.message}
                          onChange={e => update('message', e.target.value)}
                        />
                        <label className={styles.floatingLabel}>Your Message</label>
                        {errors.message && <span className={styles.error}>{errors.message}</span>}
                      </div>

                      {submitError && <p className={styles.submitError}>{submitError}</p>}

                      <button type="submit" className={styles.submitBtn} disabled={submitting}>
                        {submitting ? 'Sending…' : 'Submit Ticket'}
                      </button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
