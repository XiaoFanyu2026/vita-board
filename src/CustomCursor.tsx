import React from 'react';
import type { TLUser } from '@tldraw/core';

type CursorProps = Pick<TLUser, 'id' | 'color' | 'metadata'>;

export const CustomCursor: React.FC<CursorProps> = ({ id, color }) => {
  return (
    <div
      style={{
        position: 'relative',
        transform: 'translate(-50%, -50%)', // Center the circle on the exact coordinate
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Circle indicator */}
      <div
        style={{
          width: '16px',
          height: '16px',
          borderRadius: '50%',
          border: `2px solid ${color}`,
          backgroundColor: `${color}40`, // 25% opacity
          boxShadow: '0 0 4px rgba(0,0,0,0.1)',
        }}
      />
      
      {/* Name label */}
      <div
        style={{
          position: 'absolute',
          top: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          marginTop: '4px',
          padding: '2px 8px',
          backgroundColor: color,
          color: 'white',
          borderRadius: '12px',
          fontSize: '12px',
          fontWeight: 600,
          whiteSpace: 'nowrap',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {id}
      </div>
    </div>
  );
};
