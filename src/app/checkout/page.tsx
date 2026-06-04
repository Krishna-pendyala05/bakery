'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import styles from './checkout.module.css';

type CheckoutStep = 'CART' | 'DETAILS' | 'DELIVERY' | 'CONFIRM';

/**
 * Checkout Wizard Component.
 * Implements a 4-step wizard:
 * 1. Cart Review: Summarizes items and subtotal.
 * 2. Customer Details: Validates name, phone, email, and mocks OTP verification.
 * 3. Delivery Options: Selects pickup vs delivery, date, time slots, and address.
 * 4. Place Order: Submits details to /api/orders and redirects to the confirmation page.
 */
export default function CheckoutPage() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('CART');

  // Customer Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  // Delivery Form State
  const [deliveryMode, setDeliveryMode] = useState<'PICKUP' | 'DELIVERY'>('PICKUP');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('10:00 AM - 01:00 PM');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  if (cartItems.length === 0 && currentStep === 'CART') {
    return (
      <div className={`${styles.emptyCart} container`}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className={styles.emptyIcon}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
          />
        </svg>
        <h2>Your Shopping Cart is Empty</h2>
        <p>Before you checkout, browse our 9 premium bakery flavours and add them to your cart!</p>
        <Button onClick={() => router.push('/cakes')}>Go to Catalog</Button>
      </div>
    );
  }

  // Step 2 Validations & OTP Simulation
  const handleSendOtp = () => {
    const errors: { [key: string]: string } = {};
    if (!name.trim()) errors.name = 'Name is required.';
    if (!phone.trim() || phone.length !== 10 || !/^\d+$/.test(phone)) {
      errors.phone = 'Please enter a valid 10-digit mobile number.';
    }
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Please enter a valid email address.';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setIsOtpSent(true);
    // Display simulated verification code
    alert('Mock OTP sent! Use verification code: 123456');
  };

  const handleVerifyOtp = () => {
    if (otp === '123456') {
      setIsOtpVerified(true);
      setFormErrors({});
    } else {
      setFormErrors({ otp: 'Invalid OTP code. Please enter 123456.' });
    }
  };

  const handleGoToDelivery = () => {
    if (!isOtpVerified) {
      setFormErrors({ general: 'Please verify your phone number using OTP first.' });
      return;
    }
    setCurrentStep('DELIVERY');
  };

  // Step 3 Validation
  const handleGoToConfirm = () => {
    const errors: { [key: string]: string } = {};
    if (!deliveryDate) errors.deliveryDate = 'Delivery date is required.';
    
    // Check if delivery date is not in the past
    if (deliveryDate) {
      const selected = new Date(deliveryDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selected < today) {
        errors.deliveryDate = 'Delivery date cannot be in the past.';
      }
    }

    if (deliveryMode === 'DELIVERY' && !address.trim()) {
      errors.address = 'Delivery address is required for home delivery.';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setCurrentStep('CONFIRM');
  };

  // Step 4: Final Order Placement
  const handlePlaceOrder = async () => {
    setIsSubmitting(true);
    setSubmitError('');

    try {
      const response = await fetch('/api/checkout/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: name,
          customerEmail: email,
          customerPhone: phone,
          deliveryDate,
          notes,
          items: cartItems.map((item) => ({ id: item.id, quantity: item.quantity })),
          deliveryMode,
          deliveryAddress: deliveryMode === 'DELIVERY' ? address : '',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to place your order.');
      }

      // Success: Clear shopping cart and redirect to order status
      clearCart();
      router.push(`/orders/${data.orderId}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while submitting your order.';
      setSubmitError(errorMessage);
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`${styles.checkoutContainer} container`}>
      {/* Step Tracker UI */}
      <div className={styles.stepsIndicator}>
        <div className={`${styles.step} ${currentStep === 'CART' ? styles.stepActive : ''}`}>
          <div className={styles.stepNum}>1</div>
          <span className={styles.stepLabel}>Review Cart</span>
        </div>
        <div className={styles.stepConnector} />
        <div className={`${styles.step} ${currentStep === 'DETAILS' ? styles.stepActive : ''}`}>
          <div className={styles.stepNum}>2</div>
          <span className={styles.stepLabel}>Your Details</span>
        </div>
        <div className={styles.stepConnector} />
        <div className={`${styles.step} ${currentStep === 'DELIVERY' ? styles.stepActive : ''}`}>
          <div className={styles.stepNum}>3</div>
          <span className={styles.stepLabel}>Delivery Options</span>
        </div>
        <div className={styles.stepConnector} />
        <div className={`${styles.step} ${currentStep === 'CONFIRM' ? styles.stepActive : ''}`}>
          <div className={styles.stepNum}>4</div>
          <span className={styles.stepLabel}>Confirmation</span>
        </div>
      </div>

      <div className={styles.layout}>
        {/* Main Step Details Form */}
        <div className={styles.mainForm}>
          {currentStep === 'CART' && (
            <Card className={styles.stepCard}>
              <h2 className={styles.stepTitle}>Review Your Items</h2>
              <div className={styles.cartList}>
                {cartItems.map((item) => (
                  <div key={item.id} className={styles.cartItem}>
                    <div className={styles.itemMeta}>
                      <span className={styles.itemName}>{item.name}</span>
                      <span className={styles.itemQty}>Qty: {item.quantity}</span>
                    </div>
                    <span className={styles.itemPrice}>₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className={styles.nextRow}>
                <Button onClick={() => setCurrentStep('DETAILS')}>Proceed to Details</Button>
              </div>
            </Card>
          )}

          {currentStep === 'DETAILS' && (
            <Card className={styles.stepCard}>
              <h2 className={styles.stepTitle}>Enter Contact Details</h2>
              <p className={styles.stepDescription}>
                We will send status updates to your mobile number and email.
              </p>

              <div className={styles.inputGroup}>
                <Input
                  label="Full Name"
                  id="name"
                  placeholder="E.g. Krishna Kumar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  error={formErrors.name}
                  disabled={isOtpVerified}
                />
              </div>

              <div className={styles.inputGroup}>
                <Input
                  label="Mobile Number (10-digits)"
                  id="phone"
                  placeholder="E.g. 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  error={formErrors.phone}
                  disabled={isOtpVerified}
                />
              </div>

              <div className={styles.inputGroup}>
                <Input
                  label="Email Address"
                  id="email"
                  placeholder="E.g. krishna@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={formErrors.email}
                  disabled={isOtpVerified}
                />
              </div>

              {/* OTP Validation Section */}
              {!isOtpVerified ? (
                <div className={styles.otpSection}>
                  {!isOtpSent ? (
                    <Button type="button" variant="secondary" onClick={handleSendOtp}>
                      Verify Number with OTP
                    </Button>
                  ) : (
                    <div className={styles.otpInputRow}>
                      <Input
                        label="Enter 6-Digit OTP"
                        id="otp"
                        placeholder="123456"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        error={formErrors.otp}
                      />
                      <Button type="button" onClick={handleVerifyOtp} className={styles.otpBtn}>
                        Verify Code
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className={styles.verifiedAlert}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                    stroke="currentColor"
                    className={styles.verifiedIcon}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  <span>Mobile number verified successfully.</span>
                </div>
              )}

              {formErrors.general && <p className={styles.errorAlert}>{formErrors.general}</p>}

              <div className={styles.navRow}>
                <Button variant="outline" onClick={() => setCurrentStep('CART')}>
                  Back
                </Button>
                <Button onClick={handleGoToDelivery} disabled={!isOtpVerified}>
                  Continue to Delivery
                </Button>
              </div>
            </Card>
          )}

          {currentStep === 'DELIVERY' && (
            <Card className={styles.stepCard}>
              <h2 className={styles.stepTitle}>Select Delivery Details</h2>

              {/* Delivery Mode Toggle */}
              <div className={styles.controlGroup}>
                <span className={styles.controlLabel}>Fulfillment Method:</span>
                <div className={styles.modeToggle}>
                  <button
                    type="button"
                    className={`${styles.modeBtn} ${deliveryMode === 'PICKUP' ? styles.modeActive : ''}`}
                    onClick={() => setDeliveryMode('PICKUP')}
                  >
                    Store Pickup (Free)
                  </button>
                  <button
                    type="button"
                    className={`${styles.modeBtn} ${deliveryMode === 'DELIVERY' ? styles.modeActive : ''}`}
                    onClick={() => setDeliveryMode('DELIVERY')}
                  >
                    Home Delivery
                  </button>
                </div>
              </div>

              {/* Date & Time Slot Picker */}
              <div className={styles.pickerRow}>
                <div className={styles.pickerCol}>
                  <label htmlFor="deliveryDate" className={styles.controlLabel}>
                    Select Date:
                  </label>
                  <input
                    type="date"
                    id="deliveryDate"
                    className={styles.datePicker}
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                  />
                  {formErrors.deliveryDate && <p className={styles.fieldError}>{formErrors.deliveryDate}</p>}
                </div>

                <div className={styles.pickerCol}>
                  <label htmlFor="timeSlot" className={styles.controlLabel}>
                    Preferred Time Slot:
                  </label>
                  <select
                    id="timeSlot"
                    className={styles.selectPicker}
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                  >
                    <option value="10:00 AM - 01:00 PM">Morning (10:00 AM - 01:00 PM)</option>
                    <option value="01:00 PM - 04:00 PM">Afternoon (01:00 PM - 04:00 PM)</option>
                    <option value="04:00 PM - 07:00 PM">Evening (04:00 PM - 07:00 PM)</option>
                    <option value="07:00 PM - 10:00 PM">Night (07:00 PM - 10:00 PM)</option>
                  </select>
                </div>
              </div>

              {/* Address Form (Delivery Mode Only) */}
              {deliveryMode === 'DELIVERY' && (
                <div className={styles.inputGroup}>
                  <label htmlFor="address" className={styles.controlLabel}>
                    Full Delivery Address:
                  </label>
                  <textarea
                    id="address"
                    rows={3}
                    placeholder="Enter house number, building, street, and pin code..."
                    className={styles.textArea}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                  {formErrors.address && <p className={styles.fieldError}>{formErrors.address}</p>}
                </div>
              )}

              {/* Special Instructions Notes */}
              <div className={styles.inputGroup}>
                <label htmlFor="notes" className={styles.controlLabel}>
                  Special Notes / Custom Message on Cake:
                </label>
                <textarea
                  id="notes"
                  rows={2}
                  placeholder="E.g. Write 'Happy Birthday Krishna' on the cake..."
                  className={styles.textArea}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <div className={styles.navRow}>
                <Button variant="outline" onClick={() => setCurrentStep('DETAILS')}>
                  Back
                </Button>
                <Button onClick={handleGoToConfirm}>Confirm Order Details</Button>
              </div>
            </Card>
          )}

          {currentStep === 'CONFIRM' && (
            <Card className={styles.stepCard}>
              <h2 className={styles.stepTitle}>Final Order Summary</h2>
              <p className={styles.stepDescription}>
                Review details before completing mock payment and order submission.
              </p>

              <div className={styles.summaryBlock}>
                <h4 className={styles.blockTitle}>Customer Profile</h4>
                <p><strong>Name:</strong> {name}</p>
                <p><strong>Phone:</strong> {phone}</p>
                <p><strong>Email:</strong> {email}</p>
              </div>

              <div className={styles.summaryBlock}>
                <h4 className={styles.blockTitle}>Fulfillment Details</h4>
                <p><strong>Method:</strong> {deliveryMode === 'PICKUP' ? 'Self Pickup at Store' : 'Home Delivery'}</p>
                <p><strong>Date:</strong> {deliveryDate}</p>
                <p><strong>Time Slot:</strong> {timeSlot}</p>
                {deliveryMode === 'DELIVERY' && <p><strong>Address:</strong> {address}</p>}
                {notes && <p><strong>Special Notes:</strong> {notes}</p>}
              </div>

              {submitError && <p className={styles.errorAlert}>{submitError}</p>}

              <div className={styles.navRow}>
                <Button variant="outline" onClick={() => setCurrentStep('DELIVERY')} disabled={isSubmitting}>
                  Back
                </Button>
                <Button onClick={handlePlaceOrder} disabled={isSubmitting}>
                  {isSubmitting ? 'Processing Order...' : 'Place Order (Mock Payment)'}
                </Button>
              </div>
            </Card>
          )}
        </div>

        {/* Floating Side Order Total Summary Card */}
        <div className={styles.sideSummary}>
          <Card className={styles.summaryCard}>
            <h3 className={styles.summaryTitle}>Bill Details</h3>
            <div className={styles.summaryLine}>
              <span>Subtotal</span>
              <span>₹{cartTotal.toFixed(2)}</span>
            </div>
            <div className={styles.summaryLine}>
              <span>Delivery Charges</span>
              <span>{deliveryMode === 'DELIVERY' ? '₹50.00' : 'Free'}</span>
            </div>
            <div className={styles.summaryDivider} />
            <div className={`${styles.summaryLine} ${styles.totalLine}`}>
              <span>Total Payable</span>
              <span>₹{(cartTotal + (deliveryMode === 'DELIVERY' ? 50 : 0)).toFixed(2)}</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
