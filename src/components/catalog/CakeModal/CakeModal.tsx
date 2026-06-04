'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import Button from '@/components/ui/Button';
import styles from './CakeModal.module.css';
import { CakeProduct } from '../CakeCard';

interface CakeModalProps {
  cake: CakeProduct | null;
  onClose: () => void;
}

/**
 * Detailed information popup modal for cakes.
 * Features a blurred background, animated fade-in, size selection, quantity picking,
 * and integration with the shopping cart state.
 * 
 * @param props - Component props
 * @param props.cake - The selected CakeProduct to display, or null to hide
 * @param props.onClose - Callback triggered to close the modal
 */
export default function CakeModal({ cake, onClose }: CakeModalProps) {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState<'HALF_KG' | 'ONE_KG'>('HALF_KG');
  const [quantity, setQuantity] = useState(1);
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle closing on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden'; // Lock background scrolling
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  if (!cake) return null;

  const activeVariant = cake.variants.find((v) => v.size === selectedSize) || cake.variants[0];

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleIncreaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleAddToCart = () => {
    if (activeVariant) {
      addToCart({
        id: activeVariant.id,
        name: activeVariant.name,
        price: activeVariant.price,
        imagePath: cake.imagePath,
      }, quantity);
      onClose(); // Close modal after adding to cart
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose} aria-modal="true" role="dialog">
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()} // Stop propagation from closing
        ref={modalRef}
      >
        {/* Close Button */}
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close modal">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className={styles.closeIcon}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Modal Layout */}
        <div className={styles.container}>
          {/* Left Column: Image */}
          <div className={styles.imageColumn}>
            <Image
              src={cake.imagePath}
              alt={cake.flavour}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className={styles.image}
              priority
            />
          </div>

          {/* Right Column: Content */}
          <div className={styles.contentColumn}>
            <div className={styles.tagsRow}>
              {cake.tags.map((tag) => (
                <span key={tag} className={`${styles.tag} ${tag.includes('seasonal') ? styles.tagSeasonal : ''}`}>
                  {tag}
                </span>
              ))}
            </div>

            <h2 className={styles.title}>{cake.flavour} Cake</h2>
            <p className={styles.description}>{cake.description}</p>

            <div className={styles.metaDivider} />

            {/* Size Options */}
            <div className={styles.controlGroup}>
              <span className={styles.controlLabel}>Select Size:</span>
              <div className={styles.sizeOptions}>
                {cake.variants.map((variant) => (
                  <button
                    key={variant.id}
                    type="button"
                    className={`${styles.sizeBtn} ${selectedSize === variant.size ? styles.sizeActive : ''}`}
                    onClick={() => setSelectedSize(variant.size)}
                  >
                    {variant.size === 'HALF_KG' ? '½ Kg (Half Kilogram)' : '1 Kg (One Kilogram)'}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Options */}
            <div className={styles.controlGroup}>
              <span className={styles.controlLabel}>Quantity:</span>
              <div className={styles.qtyContainer}>
                <button
                  type="button"
                  className={styles.qtyBtn}
                  onClick={handleDecreaseQuantity}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className={styles.qtyVal}>{quantity}</span>
                <button
                  type="button"
                  className={styles.qtyBtn}
                  onClick={handleIncreaseQuantity}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Row */}
            <div className={styles.actionRow}>
              <div className={styles.priceSection}>
                <span className={styles.priceLabel}>Price:</span>
                <span className={styles.priceVal}>
                  ₹{(activeVariant ? activeVariant.price * quantity : 0).toFixed(2)}
                </span>
              </div>
              <Button onClick={handleAddToCart} className={styles.addBtn}>
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
