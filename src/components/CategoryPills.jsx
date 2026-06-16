import React from 'react';
import styles from './CategoryPills.module.css';

const CategoryPills = ({ categories = [], activeCategory = '', onCategoryChange }) => {
  const allPills = [
    { id: '', name: 'All', icon: '⊞' },
    ...categories,
  ];

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.scrollWrapper}>
          {allPills.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                className={`${styles.pill} ${isActive ? styles.active : ''}`}
                onClick={() => onCategoryChange?.(cat.id)}
                type="button"
              >
                <span className={styles.pillIcon}>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoryPills;
