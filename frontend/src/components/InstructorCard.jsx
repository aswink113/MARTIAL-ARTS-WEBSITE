import React from 'react';
import { Award, Star, CheckCircle } from 'lucide-react';

const InstructorCard = ({ instructor }) => {
  const photoUrl = instructor.image_display || instructor.image_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80';

  return (
    <div
      className="light-card"
      style={{
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        position: 'relative',
        borderTop: instructor.is_head_coach ? '3px solid #DC2626' : '1px solid var(--light-border)',
      }}
    >
      {/* Instructor Image */}
      <div style={{ position: 'relative', height: '280px', overflow: 'hidden' }}>
        <img
          src={photoUrl}
          alt={instructor.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
        {instructor.is_head_coach && (
          <div
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              backgroundColor: '#DC2626',
              color: '#FFFFFF',
              padding: '4px 10px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.75rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              letterSpacing: '0.05em',
            }}
          >
            <Star size={14} fill="white" />
            HEAD COACH
          </div>
        )}
        <div
          style={{
            position: 'absolute',
            bottom: '12px',
            left: '12px',
            backgroundColor: 'rgba(15, 17, 23, 0.85)',
            color: '#FFFFFF',
            padding: '3px 10px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.75rem',
            fontWeight: 700,
          }}
        >
          {instructor.experience || '10+ Years Exp.'}
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <h3 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
          {instructor.name}
        </h3>
        <div style={{ color: '#DC2626', fontWeight: 700, fontSize: '0.85rem', marginBottom: '1rem', textTransform: 'uppercase' }}>
          {instructor.designation}
        </div>

        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: '1.6', marginBottom: '1rem', flexGrow: 1 }}>
          {instructor.biography}
        </p>

        {/* Qualifications */}
        {instructor.qualifications && (
          <div
            style={{
              backgroundColor: '#F8FAFC',
              padding: '0.75rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--light-border)',
              fontSize: '0.8rem',
              color: 'var(--text-secondary)',
              display: 'flex',
              gap: '0.5rem',
              alignItems: 'flex-start',
            }}
          >
            <Award size={16} color="#DC2626" style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>{instructor.qualifications}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructorCard;
