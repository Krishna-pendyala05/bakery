'use client';

import React from 'react';
import styles from './FilterBar.module.css';

interface FilterBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedTag: string;
  setSelectedTag: (tag: string) => void;
  availableTags: string[];
}

/**
 * Filter and search bar component for the cake catalog page.
 * Includes a text search field and a collection of filter tags.
 * 
 * @param props - Component props
 * @param props.searchQuery - The active text search query
 * @param props.setSearchQuery - Callback to update the search query
 * @param props.selectedTag - The currently selected filter tag (empty string for "All")
 * @param props.setSelectedTag - Callback to update the selected tag
 * @param props.availableTags - Array of unique tags present in the catalog
 */
export default function FilterBar({
  searchQuery,
  setSearchQuery,
  selectedTag,
  setSelectedTag,
  availableTags,
}: FilterBarProps) {
  return (
    <div className={styles.wrapper}>
      {/* Search Input */}
      <div className={styles.searchContainer}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className={styles.searchIcon}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.602 10.602Z"
          />
        </svg>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search for chocolate, velvet, pineapple..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Filter Tags */}
      <div className={styles.tagsContainer}>
        <button
          type="button"
          className={`${styles.tagBtn} ${selectedTag === '' ? styles.tagActive : ''}`}
          onClick={() => setSelectedTag('')}
        >
          All Flavours
        </button>
        {availableTags.map((tag) => (
          <button
            key={tag}
            type="button"
            className={`${styles.tagBtn} ${selectedTag === tag ? styles.tagActive : ''}`}
            onClick={() => setSelectedTag(tag)}
          >
            {tag.charAt(0).toUpperCase() + tag.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}
