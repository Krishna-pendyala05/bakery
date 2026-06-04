import React from 'react';
import styles from './Input.module.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, className = '', id, ...props },
  ref
) {
  const inputId = id || `input-${props.name}`;
  
  return (
    <div className={styles.wrapper}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        className={[
          styles.input,
          error ? styles.inputError : '',
          className,
        ].join(' ').trim()}
        {...props}
      />
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
});
