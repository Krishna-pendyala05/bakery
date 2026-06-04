import React from 'react';
import styles from './Card.module.css';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass';
  hoverEffect?: boolean;
}

export default function Card({
  children,
  variant = 'default',
  hoverEffect = true,
  className = '',
  ...props
}: CardProps) {
  const cardClass = [
    styles.card,
    styles[variant],
    hoverEffect ? styles.hover : '',
    className,
  ].join(' ').trim();

  return (
    <div className={cardClass} {...props}>
      {children}
    </div>
  );
}
