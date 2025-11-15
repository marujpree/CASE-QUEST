import React from 'react';

function Logo({ size = 40 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 280 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block' }}
    >
      {/* Graduation Cap */}
      <path
        d="M87 142L140 105L193 142H87Z"
        fill="#0F172A"
      />
      
      {/* Graduation Cap Band */}
      <rect
        x="85"
        y="140"
        width="110"
        height="12"
        fill="#0F172A"
        rx="2"
      />
      
      {/* Tassel */}
      <line
        x1="140"
        y1="152"
        x2="140"
        y2="195"
        stroke="#0F172A"
        strokeWidth="6"
        strokeLinecap="round"
      />
      
      {/* Tassel Ball */}
      <circle
        cx="140"
        cy="200"
        r="8"
        fill="#0F172A"
      />
      
      {/* Document Box */}
      <rect
        x="88"
        y="160"
        width="104"
        height="92"
        rx="8"
        fill="#0F172A"
      />
      
      {/* Document Lines */}
      <line
        x1="110"
        y1="182"
        x2="170"
        y2="182"
        stroke="white"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <line
        x1="110"
        y1="205"
        x2="170"
        y2="205"
        stroke="white"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <line
        x1="110"
        y1="228"
        x2="145"
        y2="228"
        stroke="white"
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default Logo;
