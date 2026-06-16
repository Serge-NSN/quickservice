import { useState, useMemo, useEffect } from 'react'
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore'
import { db } from '../firebase/config'
import Hero from '../components/Hero'
import CategoryPills from '../components/CategoryPills'
import ServiceGrid from '../components/ServiceGrid'
import Footer from '../components/Footer'
import { CATEGORIES } from '../data/providers'
import styles from './Home.module.css'

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('')
  const [providers, setProviders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(collection(db, 'providers'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const providersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProviders(providersData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching providers: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [])

  const filteredProviders = useMemo(() => {
    const categoryNameMap = Object.fromEntries(
      CATEGORIES.map(c => [c.id, c.name])
    )
    return providers.filter(p => {
      const matchesSearch = !searchQuery || 
        p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchQuery.toLowerCase())
      
      // If a category ID is active, match it. But Firestore holds category ID directly? 
      // Wait, in Register.jsx we saved `formData.category` which is the ID.
      // Let's match directly against the activeCategory (which is an ID).
      const matchesCategory = !activeCategory || p.category === activeCategory

      return matchesSearch && matchesCategory
    })
  }, [searchQuery, activeCategory, providers])

  return (
    <main className={styles.main}>
      <Hero 
        onSearch={setSearchQuery} 
        onCategoryChange={setActiveCategory}
        categories={CATEGORIES}
      />
      <CategoryPills 
        categories={CATEGORIES}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />
      <ServiceGrid providers={filteredProviders} loading={loading} />
      <Footer />
    </main>
  )
}
