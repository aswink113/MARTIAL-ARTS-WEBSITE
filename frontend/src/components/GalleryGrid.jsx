import React, { useState } from 'react';
import { Play, Eye, X, Award, ExternalLink } from 'lucide-react';

const GalleryGrid = ({ items = [] }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeMedia, setActiveMedia] = useState(null);

  const categories = [
    'All',
    'Training Photos',
    'Training Videos',
    'Competition Photos',
    'Awards',
    'Certificates',
    'Academy Events',
  ];

  const filteredItems = selectedCategory === 'All'
    ? items
    : items.filter((item) => item.category?.toLowerCase() === selectedCategory.toLowerCase());

  // Helper to extract embeddable YouTube URL
  const getEmbedUrl = (url) => {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=1` : url;
  };

  return (
    <div>
      {/* Category Pills */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.5rem',
          justifyContent: 'center',
          marginBottom: '2.5rem',
        }}
      >
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: '0.5rem 1.25rem',
              fontSize: '0.85rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              borderRadius: 'var(--radius-full)',
              backgroundColor: selectedCategory === cat ? '#DC2626' : '#FFFFFF',
              color: selectedCategory === cat ? '#FFFFFF' : 'var(--text-secondary)',
              border: selectedCategory === cat ? '1px solid #DC2626' : '1px solid var(--light-border)',
              boxShadow: selectedCategory === cat ? '0 4px 10px rgba(220, 38, 38, 0.3)' : 'var(--shadow-sm)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filteredItems.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          No media items found in this category.
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {filteredItems.map((item) => {
            const img = item.image_display || item.image_url || 'https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&w=800&q=80';
            const isVideo = Boolean(item.video_url || item.category === 'Training Videos');

            return (
              <div
                key={item.id}
                onClick={() => setActiveMedia(item)}
                style={{
                  position: 'relative',
                  height: '240px',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-md)',
                }}
                className="gallery-item-card"
              >
                <img
                  src={img}
                  alt={item.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.4s ease',
                  }}
                />

                {/* Hover Overlay */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: 'rgba(15, 17, 23, 0.75)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    padding: '1.25rem',
                    opacity: 0,
                    transition: 'opacity 0.3s ease',
                  }}
                  className="gallery-overlay"
                >
                  <div
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '48px',
                      height: '48px',
                      backgroundColor: '#DC2626',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                    }}
                  >
                    {isVideo ? <Play size={22} fill="white" /> : <Eye size={22} />}
                  </div>

                  <span
                    style={{
                      color: '#DC2626',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      marginBottom: '0.25rem',
                    }}
                  >
                    {item.category}
                  </span>
                  <h4 style={{ color: '#FFFFFF', fontSize: '1.1rem', lineHeight: '1.2' }}>
                    {item.title}
                  </h4>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Lightbox Modal */}
      {activeMedia && (
        <div
          onClick={() => setActiveMedia(null)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 2000,
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              maxWidth: '850px',
              width: '100%',
              backgroundColor: '#1E293B',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
            }}
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveMedia(null)}
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                zIndex: 10,
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                color: 'white',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <X size={20} />
            </button>

            {/* Content view */}
            {activeMedia.video_url ? (
              <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
                <iframe
                  src={getEmbedUrl(activeMedia.video_url)}
                  title={activeMedia.title}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    border: 'none',
                  }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <div style={{ maxHeight: '70vh', overflow: 'hidden', display: 'flex', justifyContent: 'center', background: '#000' }}>
                <img
                  src={activeMedia.image_display || activeMedia.image_url}
                  alt={activeMedia.title}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '70vh',
                    objectFit: 'contain',
                  }}
                />
              </div>
            )}

            <div style={{ padding: '1.25rem 1.5rem', color: '#FFFFFF' }}>
              <div style={{ color: '#DC2626', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase' }}>
                {activeMedia.category}
              </div>
              <h3 style={{ fontSize: '1.4rem', margin: '0.35rem 0' }}>{activeMedia.title}</h3>
              {activeMedia.description && (
                <p style={{ color: '#94A3B8', fontSize: '0.9rem', lineHeight: '1.5' }}>
                  {activeMedia.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Inline hover styling for grid cards */}
      <style>{`
        .gallery-item-card:hover .gallery-overlay {
          opacity: 1 !important;
        }
        .gallery-item-card:hover img {
          transform: scale(1.08) !important;
        }
      `}</style>
    </div>
  );
};

export default GalleryGrid;
