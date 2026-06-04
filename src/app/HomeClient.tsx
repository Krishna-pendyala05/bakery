'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import CakeCard, { CakeProduct } from '@/components/catalog/CakeCard';
import CakeModal from '@/components/catalog/CakeModal';
import styles from './page.module.css';

interface HomeClientProps {
  featuredCakes: CakeProduct[];
}

/**
 * Client component for the bakery homepage.
 * Renders the hero video section with calligraphic text,
 * the featured cake grid, About Us, and manages detail modal state.
 * 
 * @param props - Component props
 * @param props.featuredCakes - Array of the 3 featured CakeProduct objects fetched from the database
 */
export default function HomeClient({ featuredCakes }: HomeClientProps) {
  const [selectedCake, setSelectedCake] = useState<CakeProduct | null>(null);
  const [isCustomOrderOpen, setIsCustomOrderOpen] = useState(false);

  return (
    <div className={styles.homeContainer}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <video
          autoPlay
          loop
          muted
          playsInline
          className={styles.heroVideo}
          src="/videos/hero-bg-video.mp4"
        />
        <div className={styles.heroOverlay} />
        <div className={`${styles.heroContent} container`}>
          <h1 className={styles.heroTitle}>
            Every <span className={styles.gradientText}>Slice</span> Tells A Story
          </h1>
          <p className={styles.heroTagline}>
            Made with Fresh Ingredients. No Added Preservatives.
          </p>
          <div className={styles.heroCtas}>
            <Link href="/cakes">
              <Button size="lg" className={styles.exploreBtn}>
                Explore Cakes
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className={styles.customBtn}
              onClick={() => setIsCustomOrderOpen(true)}
            >
              Custom Order
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Cakes Section */}
      <section className={`${styles.featured} container`}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionSubtitle}>Chef&apos;s Special</span>
          <h2 className={styles.sectionTitle}>Signature Collections</h2>
          <div className={styles.headerLine} />
        </div>

        <div className={styles.cakeGrid}>
          {featuredCakes.map((cake) => (
            <CakeCard
              key={cake.flavour}
              cake={cake}
              onViewDetails={(c) => setSelectedCake(c)}
            />
          ))}
        </div>

        <div className={styles.viewAllContainer}>
          <Link href="/cakes">
            <Button variant="secondary" size="md">
              View All 9 Flavours
            </Button>
          </Link>
        </div>
      </section>

      {/* About Us Section */}
      <section className={styles.about}>
        <div className={`${styles.aboutContainer} container`}>
          <div className={styles.aboutContent}>
            <span className={styles.sectionSubtitle}>Our Story</span>
            <h2 className={styles.aboutTitle}>Baking with Love & Passion</h2>
            <div className={styles.aboutLine} />
            <p className={styles.aboutText}>
              Hello, we are <strong>The Sweet Spot</strong>. We bake fresh artisanal cakes daily using pure, high-quality, locally sourced organic ingredients. We believe in crafting memorable experiences for your celebrations.
            </p>
            <p className={styles.aboutText}>
              From rich chocolate fudge to delicate fruit-loaded mango sponginess, our 9 signature flavours are tailored to satisfy sweet cravings without being over-sweet or using artificial preservatives.
            </p>
          </div>
          <div className={styles.aboutImages}>
            <div className={styles.imageFrame1}>
              <Image
                src="/images/cake-image1.png"
                alt="Baking fresh cake"
                fill
                sizes="(max-width: 768px) 100vw, 30vw"
                className={styles.aboutImg}
              />
            </div>
            <div className={styles.imageFrame2}>
              <Image
                src="/images/cake-image2.png"
                alt="Cake decorating"
                fill
                sizes="(max-width: 768px) 100vw, 30vw"
                className={styles.aboutImg}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Details Modal */}
      {selectedCake && (
        <CakeModal
          key={selectedCake.flavour}
          cake={selectedCake}
          onClose={() => setSelectedCake(null)}
        />
      )}

      {/* Mock Custom Order Modal */}
      {isCustomOrderOpen && (
        <div className={styles.dialogOverlay} onClick={() => setIsCustomOrderOpen(false)}>
          <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.dialogTitle}>Custom Order Inquiry</h3>
            <p className={styles.dialogText}>
              Looking for a custom design, sugar-free, or specific theme cake? Please reach out to our team directly:
            </p>
            <div className={styles.contactDetails}>
              <p><strong>Call/WhatsApp:</strong> +91 98765 43210</p>
              <p><strong>Email:</strong> custom@sweetspotbakery.in</p>
            </div>
            <Button onClick={() => setIsCustomOrderOpen(false)} fullWidth>
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
