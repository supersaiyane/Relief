import React from 'react';

export default function TabPanel({ children, isActive }) {
  return (
    <div className={`tab-panel ${isActive ? 'show' : 'hide'}`}>
      {isActive && children}
    </div>
  );
}
