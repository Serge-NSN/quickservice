import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  collection, onSnapshot, doc, getDoc,
  addDoc, updateDoc, deleteDoc, query, orderBy
} from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import { auth, db } from '../firebase/config'
import { motion, AnimatePresence } from 'framer-motion'
import { CATEGORIES } from '../data/providers'
import styles from './AdminDashboard.module.css'

// ─── Helpers ────────────────────────────────────────────────────────────────
const PRICING_UNITS = ['per hour', 'per session', 'per day', 'per project']

function emptyProvider() {
  return {
    name: '', email: '', phone: '', whatsapp: '', category: '',
    description: '', location: { city: 'Douala', quarter: '' },
    pricing: { type: 'fixed', amount: '', unit: 'per hour', currency: 'XAF' },
    rating: 0, reviewCount: 0, verified: false,
  }
}

// ─── Provider Modal ──────────────────────────────────────────────────────────
function ProviderModal({ provider, onClose, onSave }) {
  const [form, setForm] = useState(provider || emptyProvider())
  const [saving, setSaving] = useState(false)

  const set = (path, val) => {
    setForm(prev => {
      const copy = { ...prev }
      if (path.includes('.')) {
        const [a, b] = path.split('.')
        copy[a] = { ...copy[a], [b]: val }
      } else {
        copy[path] = val
      }
      return copy
    })
  }

  const handleSave = async () => {
    setSaving(true)
    await onSave(form)
    setSaving(false)
  }

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <motion.div
        className={styles.modal}
        onClick={e => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{provider?.id ? 'Edit Provider' : 'Add Provider'}</h2>
          <button className={styles.modalClose} onClick={onClose}>✕</button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.mRow2}>
            <div className={styles.mGroup}>
              <label className={styles.mLabel}>Full Name</label>
              <input className={styles.mInput} value={form.name} onChange={e => set('name', e.target.value)} placeholder="Provider name" />
            </div>
            <div className={styles.mGroup}>
              <label className={styles.mLabel}>Email</label>
              <input className={styles.mInput} type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="email@example.com" />
            </div>
          </div>
          <div className={styles.mRow2}>
            <div className={styles.mGroup}>
              <label className={styles.mLabel}>Phone</label>
              <input className={styles.mInput} value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+237 6XX XXX XXX" />
            </div>
            <div className={styles.mGroup}>
              <label className={styles.mLabel}>WhatsApp</label>
              <input className={styles.mInput} value={form.whatsapp} onChange={e => set('whatsapp', e.target.value)} placeholder="+237 6XX XXX XXX" />
            </div>
          </div>
          <div className={styles.mRow2}>
            <div className={styles.mGroup}>
              <label className={styles.mLabel}>Category</label>
              <select className={styles.mInput} value={form.category} onChange={e => set('category', e.target.value)}>
                <option value="">Select category</option>
                {CATEGORIES.filter(c => c.id !== 'all').map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className={styles.mGroup}>
              <label className={styles.mLabel}>Location (Quarter)</label>
              <input className={styles.mInput} value={form.location?.quarter} onChange={e => set('location.quarter', e.target.value)} placeholder="e.g. Akwa" />
            </div>
          </div>
          <div className={styles.mGroup}>
            <label className={styles.mLabel}>Description</label>
            <textarea className={`${styles.mInput} ${styles.mTextarea}`} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Service description…" rows={3} />
          </div>
          <div className={styles.mRow2}>
            <div className={styles.mGroup}>
              <label className={styles.mLabel}>Pricing Type</label>
              <select className={styles.mInput} value={form.pricing?.type} onChange={e => set('pricing.type', e.target.value)}>
                <option value="fixed">Fixed Rate</option>
                <option value="negotiable">Negotiable</option>
              </select>
            </div>
            {form.pricing?.type === 'fixed' && (
              <>
                <div className={styles.mGroup}>
                  <label className={styles.mLabel}>Amount (XAF)</label>
                  <input className={styles.mInput} type="number" value={form.pricing?.amount} onChange={e => set('pricing.amount', e.target.value)} placeholder="e.g. 5000" />
                </div>
                <div className={styles.mGroup}>
                  <label className={styles.mLabel}>Unit</label>
                  <select className={styles.mInput} value={form.pricing?.unit} onChange={e => set('pricing.unit', e.target.value)}>
                    {PRICING_UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
              </>
            )}
          </div>
          <div className={styles.mCheckRow}>
            <label className={styles.mCheckLabel}>
              <input type="checkbox" checked={form.verified} onChange={e => set('verified', e.target.checked)} />
              <span className={styles.mCheck} />
              Mark as Verified
            </label>
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button className={styles.saveBtn} onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : 'Save Provider'}
          </button>
        </div>
      </motion.div>
    </div>
  )
}

// ─── Ticket Detail Modal ─────────────────────────────────────────────────────
function TicketModal({ ticket, onClose, onResolve }) {
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <motion.div
        className={styles.modal}
        onClick={e => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ duration: 0.3 }}
      >
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Support Ticket</h2>
          <button className={styles.modalClose} onClick={onClose}>✕</button>
        </div>
        <div className={styles.modalBody}>
          <div className={styles.ticketMeta}>
            <div><span className={styles.tmLabel}>From</span><span className={styles.tmVal}>{ticket.name}</span></div>
            <div><span className={styles.tmLabel}>Email</span><span className={styles.tmVal}>{ticket.email}</span></div>
            <div><span className={styles.tmLabel}>Date</span><span className={styles.tmVal}>{new Date(ticket.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span></div>
            <div>
              <span className={styles.tmLabel}>Status</span>
              <span className={ticket.status === 'resolved' ? styles.statusResolved : styles.statusOpen}>
                {ticket.status === 'resolved' ? '✓ Resolved' : '● Open'}
              </span>
            </div>
          </div>
          <div className={styles.mGroup}>
            <label className={styles.mLabel}>Subject</label>
            <p className={styles.ticketSubject}>{ticket.subject}</p>
          </div>
          <div className={styles.mGroup}>
            <label className={styles.mLabel}>Message</label>
            <p className={styles.ticketMessage}>{ticket.message}</p>
          </div>
        </div>
        <div className={styles.modalFooter}>
          <button className={styles.cancelBtn} onClick={onClose}>Close</button>
          {ticket.status === 'open' && (
            <button className={styles.resolveBtn} onClick={() => onResolve(ticket.id)}>
              Mark as Resolved
            </button>
          )}
        </div>
      </motion.div>
    </div>
  )
}

// ─── Main Dashboard ──────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const navigate = useNavigate()
  const [authChecked, setAuthChecked] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [activeTab, setActiveTab] = useState('providers')
  const [providers, setProviders] = useState([])
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  // Modal state
  const [editingProvider, setEditingProvider] = useState(null)  // null | provider obj | 'new'
  const [viewingTicket, setViewingTicket] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)  // provider id

  // Auth + admin check
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) { navigate('/login'); return }
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid))
        if (userDoc.exists() && userDoc.data().role === 'admin') {
          setIsAdmin(true)
        } else {
          navigate('/')
        }
      } catch {
        navigate('/')
      }
      setAuthChecked(true)
    })
    return unsub
  }, [navigate])

  // Fetch providers
  useEffect(() => {
    if (!isAdmin) return
    const q = query(collection(db, 'providers'), orderBy('createdAt', 'desc'))
    const unsub = onSnapshot(q, snap => {
      setProviders(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      setLoading(false)
    })
    return unsub
  }, [isAdmin])

  // Fetch tickets
  useEffect(() => {
    if (!isAdmin) return
    const q = query(collection(db, 'tickets'), orderBy('createdAt', 'desc'))
    const unsub = onSnapshot(q, snap => {
      setTickets(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    })
    return unsub
  }, [isAdmin])

  const handleSaveProvider = async (form) => {
    const data = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      whatsapp: form.whatsapp || form.phone,
      category: form.category,
      description: form.description,
      location: { city: form.location?.city || 'Douala', quarter: form.location?.quarter || '' },
      pricing: {
        type: form.pricing?.type,
        amount: form.pricing?.type === 'fixed' ? Number(form.pricing?.amount) : null,
        unit: form.pricing?.type === 'fixed' ? form.pricing?.unit : null,
        currency: 'XAF',
      },
      verified: !!form.verified,
      rating: Number(form.rating) || 0,
      reviewCount: Number(form.reviewCount) || 0,
    }
    if (form.id) {
      await updateDoc(doc(db, 'providers', form.id), data)
    } else {
      await addDoc(collection(db, 'providers'), { ...data, createdAt: new Date().toISOString() })
    }
    setEditingProvider(null)
  }

  const handleDeleteProvider = async (id) => {
    await deleteDoc(doc(db, 'providers', id))
    setDeleteConfirm(null)
  }

  const handleResolveTicket = async (id) => {
    await updateDoc(doc(db, 'tickets', id), { status: 'resolved' })
    setViewingTicket(prev => prev ? { ...prev, status: 'resolved' } : null)
  }

  const filteredProviders = providers.filter(p =>
    !search || p.name?.toLowerCase().includes(search.toLowerCase()) || p.category?.toLowerCase().includes(search.toLowerCase())
  )
  const openTickets = tickets.filter(t => t.status === 'open').length

  if (!authChecked) {
    return (
      <div className={styles.loadingPage}>
        <div className={styles.spinner} />
        <p>Verifying admin access…</p>
      </div>
    )
  }

  if (!isAdmin) return null

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div>
            <h1 className={styles.headerTitle}>Admin Dashboard</h1>
            <p className={styles.headerSub}>Manage providers and support tickets</p>
          </div>
          <div className={styles.headerStats}>
            <div className={styles.statPill}>
              <span className={styles.statNum}>{providers.length}</span>
              <span className={styles.statLbl}>Providers</span>
            </div>
            <div className={styles.statPill}>
              <span className={styles.statNum}>{openTickets}</span>
              <span className={styles.statLbl}>Open Tickets</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabBar}>
        <div className={styles.tabInner}>
          <button className={`${styles.tab} ${activeTab === 'providers' ? styles.tabActive : ''}`} onClick={() => setActiveTab('providers')}>
            🏠 Providers ({providers.length})
          </button>
          <button className={`${styles.tab} ${activeTab === 'tickets' ? styles.tabActive : ''}`} onClick={() => setActiveTab('tickets')}>
            🎫 Support Tickets
            {openTickets > 0 && <span className={styles.ticketBadge}>{openTickets}</span>}
          </button>
        </div>
      </div>

      {/* Body */}
      <div className={styles.body}>
        <AnimatePresence mode="wait">
          {/* Providers Tab */}
          {activeTab === 'providers' && (
            <motion.div key="providers" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3 }}>
              <div className={styles.toolRow}>
                <input
                  className={styles.searchInput}
                  placeholder="Search providers…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
                <button className={styles.addBtn} onClick={() => setEditingProvider(emptyProvider())}>
                  + Add Provider
                </button>
              </div>

              {loading ? (
                <div className={styles.tableLoading}><div className={styles.spinner} /></div>
              ) : (
                <div className={styles.tableWrap}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Provider</th>
                        <th>Category</th>
                        <th>Location</th>
                        <th>Pricing</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProviders.map(p => (
                        <tr key={p.id} className={styles.tableRow}>
                          <td>
                            <div className={styles.providerCell}>
                              <div className={styles.miniAvatar}>{p.name?.charAt(0)}</div>
                              <div>
                                <div className={styles.providerName}>{p.name}</div>
                                <div className={styles.providerEmail}>{p.email}</div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className={styles.categoryTag}>
                              {CATEGORIES.find(c => c.id === p.category)?.icon} {CATEGORIES.find(c => c.id === p.category)?.name || p.category}
                            </span>
                          </td>
                          <td className={styles.cellMuted}>{p.location?.quarter}, {p.location?.city}</td>
                          <td>
                            {p.pricing?.type === 'fixed'
                              ? <span className={styles.priceFixed}>{Number(p.pricing?.amount || 0).toLocaleString()} XAF</span>
                              : <span className={styles.priceNeg}>Negotiable</span>
                            }
                          </td>
                          <td>
                            {p.verified
                              ? <span className={styles.verifiedTag}>✓ Verified</span>
                              : <span className={styles.unverifiedTag}>Unverified</span>
                            }
                          </td>
                          <td>
                            <div className={styles.actionBtns}>
                              <button className={styles.editBtn} onClick={() => setEditingProvider(p)}>Edit</button>
                              <button className={styles.deleteBtn} onClick={() => setDeleteConfirm(p.id)}>Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filteredProviders.length === 0 && (
                        <tr><td colSpan={6} className={styles.emptyRow}>No providers found.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          )}

          {/* Tickets Tab */}
          {activeTab === 'tickets' && (
            <motion.div key="tickets" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3 }}>
              <div className={styles.ticketGrid}>
                {tickets.map(ticket => (
                  <div key={ticket.id} className={`${styles.ticketCard} ${ticket.status === 'resolved' ? styles.ticketResolved : ''}`} onClick={() => setViewingTicket(ticket)}>
                    <div className={styles.ticketCardTop}>
                      <span className={ticket.status === 'resolved' ? styles.statusResolved : styles.statusOpen}>
                        {ticket.status === 'resolved' ? '✓ Resolved' : '● Open'}
                      </span>
                      <span className={styles.ticketDate}>{new Date(ticket.createdAt).toLocaleDateString('en-GB')}</span>
                    </div>
                    <h4 className={styles.ticketSubjectCard}>{ticket.subject}</h4>
                    <p className={styles.ticketFrom}>{ticket.name} · {ticket.email}</p>
                    <p className={styles.ticketPreview}>{ticket.message?.substring(0, 100)}…</p>
                    <button className={styles.viewTicketBtn}>View Details →</button>
                  </div>
                ))}
                {tickets.length === 0 && (
                  <div className={styles.emptyTickets}>
                    <span>🎉</span>
                    <p>No support tickets yet!</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {editingProvider && (
          <ProviderModal
            provider={editingProvider.id ? editingProvider : null}
            onClose={() => setEditingProvider(null)}
            onSave={handleSaveProvider}
          />
        )}
        {viewingTicket && (
          <TicketModal
            ticket={viewingTicket}
            onClose={() => setViewingTicket(null)}
            onResolve={handleResolveTicket}
          />
        )}
        {deleteConfirm && (
          <div className={styles.modalOverlay} onClick={() => setDeleteConfirm(null)}>
            <motion.div className={styles.confirmModal} onClick={e => e.stopPropagation()} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
              <h3 className={styles.confirmTitle}>Delete Provider?</h3>
              <p className={styles.confirmText}>This action is permanent and cannot be undone.</p>
              <div className={styles.confirmBtns}>
                <button className={styles.cancelBtn} onClick={() => setDeleteConfirm(null)}>Cancel</button>
                <button className={styles.deleteConfirmBtn} onClick={() => handleDeleteProvider(deleteConfirm)}>Yes, Delete</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
