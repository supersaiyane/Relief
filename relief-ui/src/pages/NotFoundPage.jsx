// src/pages/NotFoundPage.jsx
import React from 'react';
import '../styles/NotFoundPage.css';  // ← fixed path

export default function NotFoundPage() {
  return (
    <div className="notfound-page">
      <div className="console">
        <p className="line">ERROR 404: RESOURCE NOT FOUND</p>
        <p className="line">ATTEMPTING TO LOCATE RESOURCE...</p>
        <p className="line blink">_</p>
      </div>
      <div className="centerpiece">
        <div className="spinner-shape"></div>
      </div>
      <a href="/" className="return-btn">▶ RETURN HOME</a>
    </div>
  );
}
