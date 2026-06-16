import React, { useEffect, useRef, useCallback, useState } from 'react';
import ServiceCard from './ServiceCard';
import styles from './ServiceGrid.module.css';

function ServiceGrid({ providers = [], loading = false }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const gridRef = useRef(null);

  useEffect(() => {
    setCurrentPage(1);
  }, [providers]);

  const totalPages = Math.ceil(providers.length / itemsPerPage);
  const currentProviders = providers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    if (gridRef.current) {
      gridRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const cardRefs = useRef([]);

  const setCardRef = useCallback((el, index) => {
    cardRefs.current[index] = el;
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.visible);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    const currentRefs = cardRefs.current;
    currentRefs.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      currentRefs.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, [currentProviders]);

  if (loading) {
    return (
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.title}>Available Services</h2>
            <p className={styles.subtitle}>Loading trusted professionals near you…</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.section} ref={gridRef}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.title}>Available Services</h2>
          <p className={styles.subtitle}>Browse trusted professionals near you</p>
          <p className={styles.count}>
            Showing {currentProviders.length} of {providers.length} provider{providers.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className={styles.grid}>
          {currentProviders.map((provider, index) => {
            const columnIndex = index % 3;
            const delay = columnIndex * 0.1;

            return (
              <div
                key={provider.id}
                ref={(el) => setCardRef(el, index)}
                className={styles.cardWrapper}
                style={{ transitionDelay: `${delay}s` }}
              >
                <ServiceCard provider={provider} />
              </div>
            );
          })}
        </div>

        {totalPages > 1 && (
          <div className={styles.pagination}>
            <button 
              className={styles.pageBtn} 
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              Previous
            </button>
            <div className={styles.pageNumbers}>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  className={`${styles.pageNumberBtn} ${currentPage === page ? styles.activePage : ''}`}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </button>
              ))}
            </div>
            <button 
              className={styles.pageBtn} 
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default ServiceGrid;
