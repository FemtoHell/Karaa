import React from 'react';

const Logo = ({ size = 'medium', className = '' }) => {
  const sizes = {
    small: { width: 80, height: 80, fontSize: 24 },
    medium: { width: 120, height: 120, fontSize: 32 },
    large: { width: 200, height: 200, fontSize: 48 },
    xlarge: { width: 300, height: 300, fontSize: 64 }
  };

  const currentSize = sizes[size] || sizes.medium;

  return (
    <div
      className={`resume-builder-logo ${className}`}
      style={{
        width: currentSize.width,
        height: currentSize.height,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#FFFFFF',
        borderRadius: '16px',
        border: '3px solid #4F46E5',
        boxShadow: '0 10px 40px rgba(79, 70, 229, 0.2)',
        padding: '20px',
        position: 'relative'
      }}
    >
      {/* Document Icon */}
      <svg
        width={currentSize.width * 0.6}
        height={currentSize.height * 0.6}
        viewBox="0 0 100 120"
        fill="none"
      >
        {/* Paper */}
        <path
          d="M20 0 L80 0 L100 20 L100 120 L20 120 L20 0 Z"
          fill="#4F46E5"
          opacity="0.1"
        />
        <path
          d="M20 0 L80 0 L100 20 L100 120 L20 120 L20 0 Z"
          stroke="#4F46E5"
          strokeWidth="4"
          fill="none"
        />
        {/* Folded Corner */}
        <path
          d="M80 0 L80 20 L100 20 Z"
          fill="#4F46E5"
          opacity="0.3"
        />
        {/* Lines representing text */}
        <line x1="30" y1="35" x2="70" y2="35" stroke="#4F46E5" strokeWidth="4" strokeLinecap="round"/>
        <line x1="30" y1="45" x2="85" y2="45" stroke="#7C3AED" strokeWidth="3" strokeLinecap="round"/>
        <line x1="30" y1="52" x2="82" y2="52" stroke="#7C3AED" strokeWidth="3" strokeLinecap="round"/>

        <line x1="30" y1="65" x2="60" y2="65" stroke="#4F46E5" strokeWidth="4" strokeLinecap="round"/>
        <line x1="30" y1="75" x2="85" y2="75" stroke="#7C3AED" strokeWidth="3" strokeLinecap="round"/>
        <line x1="30" y1="82" x2="75" y2="82" stroke="#7C3AED" strokeWidth="3" strokeLinecap="round"/>

        <line x1="30" y1="95" x2="55" y2="95" stroke="#4F46E5" strokeWidth="4" strokeLinecap="round"/>
        <line x1="30" y1="105" x2="80" y2="105" stroke="#7C3AED" strokeWidth="3" strokeLinecap="round"/>
      </svg>
    </div>
  );
};

export default Logo;
