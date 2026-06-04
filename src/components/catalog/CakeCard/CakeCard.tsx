'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import styles from './CakeCard.module.css';

export interface CakeVariant {
  id: string;
  name: string;
  size: 'HALF_KG' | 'ONE_KG';
  price: number;
}

export interface CakeProduct {
  flavour: string;
  description: string;
  imagePath: string;
  tags: string[]; // e.g. ["eggless", "seasonal"]
  variants: CakeVariant[];
}

interface CakeCardProps {
  cake: CakeProduct;
  onViewDetails: (cake: CakeProduct) => void;
}

/**
 * Reusable card component displaying a single cake flavour group.
 * Allows the user to select between Half Kg and 1 Kg sizes, updates prices
 * dynamically, and add the chosen variant to the cart. Clicking the card
 * opens a detailed popup modal.
 * 
 * @param props - Component props
 * @param props.cake - The cake flavour group object containing description, image, tags, and variants
 * @param props.onViewDetails - Callback triggered when clicking on the card body to view detailed popups
 */
export default function CakeCard({ cake, onViewDetails }: CakeCardProps) {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState<'HALF_KG' | 'ONE_KG'>('HALF_KG');

  // Find the variant corresponding to the selected size
  const activeVariant = cake.variants.find((v) => v.size === selectedSize) || cake.variants[0];

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid triggering card click (view details)
    if (activeVariant) {
      addToCart({
        id: activeVariant.id,
        name: activeVariant.name,
        price: activeVariant.price,
        imagePath: cake.imagePath,
      });
    }
  };

  const handleCardClick = () => {
    onViewDetails(cake);
  };

  return (
    <Card className={styles.card} onClick={handleCardClick}>
      {/* Cake Image */}
      <div className={styles.imageContainer}>
        <Image
          src={cake.imagePath}
          alt={cake.flavour}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={styles.image}
        />
        {/* Tags overlay */}
        {cake.tags.length > 0 && (
          <div className={styles.tagsContainer}>
            {cake.tags.map((tag) => (
              <span key={tag} className={`${styles.tag} ${tag.includes('seasonal') ? styles.tagSeasonal : ''}`}>
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Details */}
      <div className={styles.details}>
        <h3 className={styles.title}>{cake.flavour}</h3>
        <p className={styles.description}>{cake.description}</p>

        {/* Size Selection */}
        <div className={styles.sizeSection} onClick={(e) => e.stopPropagation()}>
          <span className={styles.sizeLabel}>Size:</span>
          <div className={styles.sizeOptions}>
            {cake.variants.map((variant) => (
              <button
                key={variant.id}
                type="button"
                className={`${styles.sizeBtn} ${selectedSize === variant.size ? styles.sizeActive : ''}`}
                onClick={() => setSelectedSize(variant.size)}
              >
                {variant.size === 'HALF_KG' ? '½ Kg' : '1 Kg'}
              </button>
            ))}
          </div>
        </div>

        {/* Purchase Row */}
        <div className={styles.purchaseRow}>
          <div className={styles.priceContainer}>
            <span className={styles.currency}>₹</span>
            <span className={styles.price}>{activeVariant?.price.toFixed(2)}</span>
          </div>
          <Button
            size="sm"
            onClick={handleAddToCart}
            className={styles.addBtn}
            aria-label={`Add ${activeVariant?.name} to cart`}
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </Card>
  );
}
