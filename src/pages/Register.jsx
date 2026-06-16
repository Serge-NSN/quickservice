import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { CATEGORIES } from '../data/providers'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { collection, addDoc } from 'firebase/firestore'
import { auth, db } from '../firebase/config'
import styles from './Register.module.css'

const STEP_LABELS = ['Personal Info', 'Service Details', 'Pricing', 'Review']

const PRICING_UNITS = [
  { value: 'per hour', label: 'Per Hour' },
  { value: 'per session', label: 'Per Session' },
  { value: 'per day', label: 'Per Day' },
  { value: 'per project', label: 'Per Project' },
]

const stepTransition = {
  duration: 0.5,
  ease: [0.25, 0.46, 0.45, 0.94],
}

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
}

const successCardVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 40 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 260, damping: 22, delay: 0.1 },
  },
}

export default function Register() {
  const [currentStep, setCurrentStep] = useState(0)
  const [direction, setDirection] = useState(1)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errors, setErrors] = useState({})
  const [sameAsPhone, setSameAsPhone] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    whatsapp: '',
    category: '',
    customCategory: '',
    description: '',
    pricingType: 'fixed',
    amount: '',
    unit: 'per hour',
    quarter: '',
  })

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  const handleSameAsPhone = (checked) => {
    setSameAsPhone(checked)
    if (checked) {
      updateField('whatsapp', formData.phone)
    }
  }

  const validateStep = () => {
    const newErrors = {}

    if (currentStep === 0) {
      if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required'
      if (!formData.email.trim()) newErrors.email = 'Email is required'
      if (!formData.password || formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters'
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required'
      if (!sameAsPhone && !formData.whatsapp.trim()) newErrors.whatsapp = 'WhatsApp number is required'
      if (!formData.quarter.trim()) newErrors.quarter = 'Location is required'
    }

    if (currentStep === 1) {
      if (!formData.category) newErrors.category = 'Please select a category'
      if (formData.category === 'other' && !formData.customCategory.trim()) newErrors.customCategory = 'Please specify your category'
      if (!formData.description.trim()) newErrors.description = 'Service description is required'
    }

    if (currentStep === 2) {
      if (formData.pricingType === 'fixed') {
        if (!formData.amount || Number(formData.amount) <= 0) newErrors.amount = 'Please enter a valid amount'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleContinue = () => {
    if (!validateStep()) return
    if (currentStep < 3) {
      setDirection(1)
      setCurrentStep(prev => prev + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setDirection(-1)
      setCurrentStep(prev => prev - 1)
    }
  }

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setSubmitError('')
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password)
      const user = userCredential.user

      const providerData = {
        userId: user.uid,
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        whatsapp: sameAsPhone ? formData.phone : formData.whatsapp,
        category: formData.category === 'other' ? formData.customCategory : formData.category,
        description: formData.description,
        pricing: {
          type: formData.pricingType,
          amount: formData.pricingType === 'fixed' ? Number(formData.amount) : null,
          unit: formData.pricingType === 'fixed' ? formData.unit : null,
          currency: 'XAF'
        },
        location: {
          city: 'Douala',
          quarter: formData.quarter
        },
        rating: 0,
        reviewCount: 0,
        verified: false,
        createdAt: new Date().toISOString()
      }

      await addDoc(collection(db, 'providers'), providerData)
      setIsSubmitted(true)
    } catch (err) {
      console.error('Registration error:', err)
      setSubmitError(err.message || 'Failed to register. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const categoryLabel = formData.category === 'other' 
    ? formData.customCategory 
    : (CATEGORIES.find(c => c.id === formData.category)?.name || formData.category)

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <>
            <h2 className={styles.stepTitle}>Personal Info</h2>
            <p className={styles.stepSubtitle}>Let's get to know you.</p>

            <div className={styles.formGroup}>
              <input
                id="fullName"
                type="text"
                className={`${styles.floatingInput} ${errors.fullName ? styles.floatingInputError : ''}`}
                placeholder=" "
                value={formData.fullName}
                onChange={e => updateField('fullName', e.target.value)}
              />
              <label className={styles.floatingLabel} htmlFor="fullName">Full Name</label>
              {errors.fullName && <span className={styles.errorText}>{errors.fullName}</span>}
            </div>

            <div className={styles.formGroup}>
              <input
                id="email"
                type="email"
                className={`${styles.floatingInput} ${errors.email ? styles.floatingInputError : ''}`}
                placeholder=" "
                value={formData.email}
                onChange={e => updateField('email', e.target.value)}
              />
              <label className={styles.floatingLabel} htmlFor="email">Email Address</label>
              {errors.email && <span className={styles.errorText}>{errors.email}</span>}
            </div>

            <div className={styles.formGroup}>
              <input
                id="password"
                type="password"
                className={`${styles.floatingInput} ${errors.password ? styles.floatingInputError : ''}`}
                placeholder=" "
                value={formData.password}
                onChange={e => updateField('password', e.target.value)}
              />
              <label className={styles.floatingLabel} htmlFor="password">Password</label>
              {errors.password && <span className={styles.errorText}>{errors.password}</span>}
            </div>

            <div className={styles.formGroup}>
              <input
                id="phone"
                type="tel"
                className={`${styles.floatingInput} ${errors.phone ? styles.floatingInputError : ''}`}
                placeholder=" "
                value={formData.phone}
                onChange={e => {
                  updateField('phone', e.target.value)
                  if (sameAsPhone) updateField('whatsapp', e.target.value)
                }}
              />
              <label className={styles.floatingLabel} htmlFor="phone">Phone Number (+237...)</label>
              {errors.phone && <span className={styles.errorText}>{errors.phone}</span>}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.checkboxContainer}>
                <input
                  type="checkbox"
                  checked={sameAsPhone}
                  onChange={e => handleSameAsPhone(e.target.checked)}
                />
                <div className={styles.customCheckbox}>
                  <svg className={styles.checkboxIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <span className={styles.checkboxLabelText}>WhatsApp is same as phone</span>
              </label>
              <div style={{ position: 'relative', marginTop: '16px' }}>
                <input
                  id="whatsapp"
                  type="tel"
                  className={`${styles.floatingInput} ${errors.whatsapp ? styles.floatingInputError : ''}`}
                  placeholder=" "
                  value={sameAsPhone ? formData.phone : formData.whatsapp}
                  onChange={e => updateField('whatsapp', e.target.value)}
                  disabled={sameAsPhone}
                />
                <label className={styles.floatingLabel} htmlFor="whatsapp">WhatsApp Number</label>
              </div>
              {errors.whatsapp && <span className={styles.errorText}>{errors.whatsapp}</span>}
            </div>

            <div className={styles.formGroup}>
              <input
                id="quarter"
                type="text"
                className={`${styles.floatingInput} ${errors.quarter ? styles.floatingInputError : ''}`}
                placeholder=" "
                value={formData.quarter}
                onChange={e => updateField('quarter', e.target.value)}
              />
              <label className={styles.floatingLabel} htmlFor="quarter">Location (e.g. Akwa, Bonapriso)</label>
              {errors.quarter && <span className={styles.errorText}>{errors.quarter}</span>}
            </div>
          </>
        )

      case 1:
        return (
          <>
            <h2 className={styles.stepTitle}>Service Details</h2>
            <p className={styles.stepSubtitle}>Select your expertise and describe what you do.</p>

            <div className={styles.formGroup}>
              <div className={styles.chipGrid}>
                {CATEGORIES.filter(c => c.id !== 'all').map(cat => (
                  <div
                    key={cat.id}
                    className={`${styles.chip} ${formData.category === cat.id ? styles.chipActive : ''}`}
                    onClick={() => updateField('category', cat.id)}
                  >
                    <span className={styles.chipIcon}>{cat.icon}</span>
                    <span>{cat.name}</span>
                  </div>
                ))}
                <div
                  className={`${styles.chip} ${formData.category === 'other' ? styles.chipActive : ''}`}
                  onClick={() => updateField('category', 'other')}
                >
                  <span className={styles.chipIcon}>✨</span>
                  <span>Other</span>
                </div>
              </div>
              {errors.category && <span className={styles.errorText} style={{ marginTop: '12px' }}>{errors.category}</span>}
            </div>

            <AnimatePresence>
              {formData.category === 'other' && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginTop: 24 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  className={styles.formGroup}
                >
                  <input
                    id="customCategory"
                    type="text"
                    className={`${styles.floatingInput} ${errors.customCategory ? styles.floatingInputError : ''}`}
                    placeholder=" "
                    value={formData.customCategory}
                    onChange={e => updateField('customCategory', e.target.value)}
                  />
                  <label className={styles.floatingLabel} htmlFor="customCategory">Specify your service</label>
                  {errors.customCategory && <span className={styles.errorText}>{errors.customCategory}</span>}
                </motion.div>
              )}
            </AnimatePresence>

            <div className={styles.formGroup} style={{ marginTop: '32px' }}>
              <textarea
                id="description"
                className={`${styles.floatingInput} ${styles.textarea} ${errors.description ? styles.floatingInputError : ''}`}
                placeholder=" "
                maxLength={200}
                value={formData.description}
                onChange={e => updateField('description', e.target.value)}
              />
              <label className={styles.floatingLabel} htmlFor="description">Service Description</label>
              <div className={styles.charCounter}>{formData.description.length}/200</div>
              {errors.description && <span className={styles.errorText}>{errors.description}</span>}
            </div>
          </>
        )

      case 2:
        return (
          <>
            <h2 className={styles.stepTitle}>Pricing</h2>
            <p className={styles.stepSubtitle}>How do you charge for your service?</p>

            <div className={styles.pillToggle}>
              <div className={`${styles.pillSlider} ${formData.pricingType === 'fixed' ? styles.pillSliderLeft : styles.pillSliderRight}`} />
              <button
                type="button"
                className={`${styles.pillBtn} ${formData.pricingType === 'fixed' ? styles.pillBtnActive : ''}`}
                onClick={() => updateField('pricingType', 'fixed')}
              >
                Fixed Rate
              </button>
              <button
                type="button"
                className={`${styles.pillBtn} ${formData.pricingType === 'negotiable' ? styles.pillBtnActive : ''}`}
                onClick={() => updateField('pricingType', 'negotiable')}
              >
                Negotiable
              </button>
            </div>

            <AnimatePresence mode="wait">
              {formData.pricingType === 'fixed' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={styles.pricingRow}
                >
                  <div className={styles.formGroup}>
                    <input
                      id="amount"
                      type="number"
                      className={`${styles.floatingInput} ${errors.amount ? styles.floatingInputError : ''}`}
                      placeholder=" "
                      min="0"
                      value={formData.amount}
                      onChange={e => updateField('amount', e.target.value)}
                    />
                    <label className={styles.floatingLabel} htmlFor="amount">Amount (XAF)</label>
                    {errors.amount && <span className={styles.errorText}>{errors.amount}</span>}
                  </div>
                  <div className={styles.formGroup}>
                    <select
                      id="unit"
                      className={`${styles.floatingInput}`}
                      value={formData.unit}
                      onChange={e => updateField('unit', e.target.value)}
                      style={{ paddingBottom: '12px', paddingTop: '16px' }}
                    >
                      {PRICING_UNITS.map(u => (
                        <option key={u.value} value={u.value}>{u.label}</option>
                      ))}
                    </select>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )

      case 3:
        return (
          <>
            <h2 className={styles.stepTitle}>Review & Submit</h2>
            <p className={styles.stepSubtitle}>Check your details before joining QuickService.</p>

            <div className={styles.reviewCard}>
              <div className={styles.reviewRow}>
                <span className={styles.reviewLabel}>Full Name</span>
                <span className={styles.reviewValue}>{formData.fullName}</span>
              </div>
              <div className={styles.reviewRow}>
                <span className={styles.reviewLabel}>Email</span>
                <span className={styles.reviewValue}>{formData.email}</span>
              </div>
              <div className={styles.reviewRow}>
                <span className={styles.reviewLabel}>Phone</span>
                <span className={styles.reviewValue}>{formData.phone}</span>
              </div>
              <div className={styles.reviewRow}>
                <span className={styles.reviewLabel}>WhatsApp</span>
                <span className={styles.reviewValue}>{sameAsPhone ? formData.phone : formData.whatsapp}</span>
              </div>
              <div className={styles.reviewRow}>
                <span className={styles.reviewLabel}>Location</span>
                <span className={styles.reviewValue}>Douala, {formData.quarter}</span>
              </div>
              <div className={styles.reviewRow}>
                <span className={styles.reviewLabel}>Category</span>
                <span className={styles.reviewValue}>{categoryLabel}</span>
              </div>
              <div className={styles.reviewRow}>
                <span className={styles.reviewLabel}>Pricing</span>
                <span className={styles.reviewValue}>
                  {formData.pricingType === 'fixed'
                    ? `${Number(formData.amount).toLocaleString()} XAF ${formData.unit}`
                    : 'Negotiable'}
                </span>
              </div>
            </div>
          </>
        )

      default:
        return null
    }
  }

  return (
    <div className={styles.page}>
      <Link to="/" className={styles.backLink}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5" />
          <path d="M12 19l-7-7 7-7" />
        </svg>
        Back to Home
      </Link>

      <div className={styles.stepIndicator}>
        <div className={styles.stepsRow}>
          {STEP_LABELS.map((label, i) => (
            <div key={label} className={styles.stepItem}>
              {i > 0 && (
                <div className={`${styles.stepLine} ${i <= currentStep ? styles.stepLineActive : ''}`} />
              )}
              <motion.div
                className={`${styles.stepCircle} ${
                  i < currentStep ? styles.stepCompleted :
                  i === currentStep ? styles.stepActive : ''
                }`}
              >
                {i < currentStep ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12l5 5L20 7" />
                  </svg>
                ) : (
                  i + 1
                )}
              </motion.div>
              <span className={`${styles.stepLabel} ${i <= currentStep ? styles.stepLabelActive : ''}`}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.formCardWrapper}>
        <div className={styles.formCard}>
          <div className={styles.stepContent}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: direction > 0 ? 60 : -60, filter: 'blur(4px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, x: direction > 0 ? -60 : 60, filter: 'blur(4px)' }}
                transition={stepTransition}
              >
                {renderStepContent()}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className={styles.navRow}>
            {currentStep > 0 && currentStep < 4 && (
              <button type="button" className={styles.backBtn} onClick={handleBack}>
                Back
              </button>
            )}
            {currentStep === 0 && <div />}
            {currentStep < 3 ? (
              <button type="button" className={styles.continueBtn} onClick={handleContinue}>
                Continue
              </button>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', width: 'auto', marginLeft: 'auto' }}>
                {submitError && <span className={styles.errorText} style={{ marginBottom: '10px' }}>{submitError}</span>}
                <button type="button" className={styles.continueBtn} onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit Profile'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isSubmitted && (
          <motion.div
            className={styles.overlay}
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <motion.div
              className={styles.successCard}
              variants={successCardVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <div className={styles.checkmarkCircle}>
                <svg className={styles.checkmarkSvg} viewBox="0 0 52 52">
                  <circle className={styles.checkmarkBg} cx="26" cy="26" r="25" fill="none" />
                  <path className={styles.checkmarkPath} fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                </svg>
              </div>
              <h3 className={styles.successTitle}>Welcome Aboard!</h3>
              <p className={styles.successText}>
                Your premium profile has been created successfully. Clients in Douala can now discover your services.
              </p>
              <Link to="/" className={styles.goHomeBtn}>Return to Home</Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
