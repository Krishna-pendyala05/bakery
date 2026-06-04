import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import styles from './order-detail.module.css';

export const dynamic = 'force-dynamic';

interface OrderDetailPageProps {
  params: Promise<{ id: string }> | { id: string };
}

interface FormattedOrderItem {
  id: string;
  name: string;
  flavour: string;
  size: string;
  price: number;
  quantity: number;
}

/**
 * Order Tracking and Summary Server Component.
 * Fetches order details directly from the SQLite database by ID,
 * displays order fulfillment slots, status, and the crucial delivery OTP
 * for verification at pickup/delivery.
 */
export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  // Fetch the order from the DB
  const order = await prisma.order.findUnique({
    where: { id },
  });

  if (!order) {
    notFound();
  }

  // Parse items from stored JSON
  let parsedItems: FormattedOrderItem[] = [];
  try {
    parsedItems = JSON.parse(order.items);
  } catch (error) {
    console.error('Error parsing order items JSON:', error);
  }

  // Parse fulfillment notes (Format: "Mode: PICKUP | Address: ... | Notes: ...")
  const notesString = order.notes || '';
  const modeMatch = notesString.match(/Mode:\s*([A-Z]+)/);
  const addressMatch = notesString.match(/Address:\s*([^|]+)/);
  const userNotesMatch = notesString.match(/Notes:\s*(.+)$/);

  const deliveryMode = modeMatch ? modeMatch[1] : 'PICKUP';
  const deliveryAddress = addressMatch ? addressMatch[1].trim() : '';
  const specialNotes = userNotesMatch ? userNotesMatch[1].trim() : '';

  const formattedDate = new Date(order.deliveryDate).toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className={`${styles.detailContainer} container`}>
      <header className={styles.header}>
        <div className={styles.successBadge}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className={styles.checkIcon}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
        </div>
        <h1 className={styles.title}>Order Placed Successfully!</h1>
        <p className={styles.orderIdText}>Order ID: #{order.id}</p>
        <div className={styles.divider} />
      </header>

      <div className={styles.layout}>
        {/* Left Side: Order summary details */}
        <div className={styles.mainDetails}>
          {/* OTP Verification Block */}
          <Card className={`${styles.infoCard} ${styles.otpCard}`}>
            <h2 className={styles.cardTitle}>Delivery Verification OTP</h2>
            <div className={styles.otpValueContainer}>
              <span className={styles.otpValue}>{order.deliveryOtp}</span>
            </div>
            <p className={styles.otpDescription}>
              Please present this <strong>6-digit OTP</strong> to the store agent upon pickup or to our delivery executive at your doorstep to verify and complete your order. Do not share this OTP beforehand.
            </p>
          </Card>

          {/* Fulfillment details */}
          <Card className={styles.infoCard}>
            <h2 className={styles.cardTitle}>Fulfillment Information</h2>
            <div className={styles.infoGrid}>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Method:</span>
                <span className={styles.infoVal}>
                  {deliveryMode === 'PICKUP' ? 'Self Pickup at Store' : 'Home Delivery'}
                </span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Date:</span>
                <span className={styles.infoVal}>{formattedDate}</span>
              </div>
              {deliveryAddress && (
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Address:</span>
                  <span className={styles.infoVal}>{deliveryAddress}</span>
                </div>
              )}
              {specialNotes && (
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Special Notes:</span>
                  <span className={styles.infoVal}>{specialNotes}</span>
                </div>
              )}
            </div>
          </Card>

          {/* Contact profile info */}
          <Card className={styles.infoCard}>
            <h2 className={styles.cardTitle}>Customer Profile</h2>
            <div className={styles.infoGrid}>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Name:</span>
                <span className={styles.infoVal}>{order.customerName}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Phone:</span>
                <span className={styles.infoVal}>{order.customerPhone}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Email:</span>
                <span className={styles.infoVal}>{order.customerEmail}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Side: Bill Breakdown */}
        <div className={styles.billBreakdown}>
          <Card className={styles.billCard}>
            <h3 className={styles.billTitle}>Order Summary</h3>
            
            <div className={styles.itemList}>
              {parsedItems.map((item) => (
                <div key={item.id} className={styles.billItem}>
                  <div className={styles.itemMeta}>
                    <span className={styles.itemName}>{item.name}</span>
                    <span className={styles.itemQty}>Qty: {item.quantity}</span>
                  </div>
                  <span className={styles.itemPrice}>₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className={styles.summaryLine}>
              <span>Subtotal</span>
              <span>₹{order.totalAmount.toFixed(2)}</span>
            </div>
            <div className={styles.summaryLine}>
              <span>Delivery Fee</span>
              <span>{deliveryMode === 'DELIVERY' ? '₹50.00' : 'Free'}</span>
            </div>
            <div className={styles.summaryDivider} />
            <div className={`${styles.summaryLine} ${styles.totalLine}`}>
              <span>Amount Paid</span>
              <span>₹{(order.totalAmount + (deliveryMode === 'DELIVERY' ? 50 : 0)).toFixed(2)}</span>
            </div>

            <div className={styles.statusBlock}>
              <span className={styles.statusLabel}>Order Status:</span>
              <span className={`${styles.statusVal} ${styles.statusPending}`}>
                {order.status}
              </span>
            </div>

            <div className={styles.actions}>
              <Link href="/cakes">
                <Button fullWidth>Order More Cakes</Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
