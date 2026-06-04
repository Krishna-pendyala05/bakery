'use client';

import React, { useState } from 'react';
import FilterBar from '@/components/catalog/FilterBar';
import CakeCard, { CakeProduct } from '@/components/catalog/CakeCard';
import CakeModal from '@/components/catalog/CakeModal';
import styles from './cakes.module.css';

interface CakesPageClientProps {
  cakes: CakeProduct[];
  availableTags: string[];
}

/**
 * Client Component for the Cake Catalog.
 * Handles state for searching, filtering by tags, selecting size,
 * and displaying the detailed popup modal.
 * 
 * @param props - Component props
 * @param props.cakes - Grouped CakeProduct array fetched from the server
 * @param props.availableTags - Array of unique tags present across products
 */
export default function CakesPageClient({ cakes, availableTags }: CakesPageClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [selectedCake, setSelectedCake] = useState<CakeProduct | null>(null);

  // Filter cakes based on query and selected tag
  const filteredCakes = cakes.filter((cake) => {
    const matchesSearch =
      cake.flavour.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cake.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTag = selectedTag === '' || cake.tags.includes(selectedTag);

    return matchesSearch && matchesTag;
  });

  return (
    <div className={`${styles.pageWrapper} container`}>
      <header className={styles.header}>
        <span className={styles.subtitle}>Our Fresh Selection</span>
        <h1 className={styles.title}>Browse Our Cake Flavours</h1>
        <div className={styles.divider} />
        <p className={styles.description}>
          Every cake is hand-crafted with pure, fresh ingredients and organic flavours. Choose from our 9 signature combinations, available in half kg and one kg sizes.
        </p>
      </header>

      {/* Filter and Search Section */}
      <FilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedTag={selectedTag}
        setSelectedTag={setSelectedTag}
        availableTags={availableTags}
      />

      {/* Catalog Grid */}
      {filteredCakes.length > 0 ? (
        <div className={styles.grid}>
          {filteredCakes.map((cake) => (
            <CakeCard
              key={cake.flavour}
              cake={cake}
              onViewDetails={(c) => setSelectedCake(c)}
            />
          ))}
        </div>
      ) : (
        <div className={styles.noResults}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={styles.noResultsIcon}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
            />
          </svg>
          <h3>No cakes found</h3>
          <p>Try clearing your filters or search query to find other delicious flavours.</p>
        </div>
      )}

      {/* Details Popup Modal */}
      {selectedCake && (
        <CakeModal
          key={selectedCake.flavour}
          cake={selectedCake}
          onClose={() => setSelectedCake(null)}
        />
      )}
    </div>
  );
}
