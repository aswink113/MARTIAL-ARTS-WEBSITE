import React, { useState, useEffect } from 'react';
import { getGallery } from '../services/api';
import GalleryGrid from '../components/GalleryGrid';

const Gallery = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getGallery()
      .then((data) => {
        setItems(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Gallery loading error:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="gallery-page">
      {/* Header */}
      <div
        style={{
          backgroundColor: '#0F1117',
          color: '#FFFFFF',
          padding: '4.5rem 0 3.5rem',
          textAlign: 'center',
          borderBottom: '1px solid #1E293B',
        }}
      >
        <div className="container">
          <span className="section-subtitle">VISUAL VAULT</span>
          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: '#FFFFFF', marginBottom: '0.75rem' }}>
            PHOTO & VIDEO GALLERY
          </h1>
          <p style={{ color: '#94A3B8', maxWidth: '640px', margin: '0 auto', fontSize: '1.05rem' }}>
            Step inside our dojo through training snapshots, competition podiums, belt ceremonies, and video drills.
          </p>
        </div>
      </div>

      <div className="section-padding" style={{ backgroundColor: 'var(--light-bg)' }}>
        <div className="container">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
              Loading media gallery...
            </div>
          ) : (
            <GalleryGrid items={items} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Gallery;
