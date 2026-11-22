import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Users, ArrowRight, DollarSign, Award } from 'lucide-react';

const CourseCard = ({ course }) => {
  const imageUrl = course.image_display || course.image_url || 'https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&w=800&q=80';

  return (
    <div
      className="light-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        height: '100%',
        position: 'relative',
      }}
    >
      {/* Course Image & Badge */}
      <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
        <img
          src={imageUrl}
          alt={course.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.06)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '12px',
            left: '12px',
            backgroundColor: '#DC2626',
            color: '#FFFFFF',
            padding: '4px 12px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.75rem',
            fontWeight: 800,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
          }}
        >
          {course.age_group || 'All Ages'}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <h3
          style={{
            fontSize: '1.6rem',
            color: 'var(--text-primary)',
            marginBottom: '0.5rem',
            lineHeight: '1.1',
          }}
        >
          {course.title}
        </h3>

        <p
          style={{
            color: 'var(--text-secondary)',
            fontSize: '0.9rem',
            lineHeight: '1.6',
            marginBottom: '1.25rem',
            flexGrow: 1,
          }}
        >
          {course.short_description}
        </p>

        {/* Quick Meta */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '0.75rem',
            borderTop: '1px solid var(--light-border)',
            marginBottom: '1.25rem',
            fontSize: '0.85rem',
            color: 'var(--text-secondary)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Clock size={15} color="#DC2626" />
            <span>{course.duration || 'Ongoing'}</span>
          </div>
          <div style={{ fontWeight: 700, color: '#DC2626', fontSize: '1.05rem' }}>
            ${parseFloat(course.monthly_fee || 99).toFixed(0)}
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400 }}>/mo</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <Link
            to={`/courses/${course.slug}`}
            className="btn btn-secondary btn-sm"
            style={{ width: '100%', fontSize: '0.8rem' }}
          >
            DETAILS
          </Link>
          <Link
            to={`/admission?course=${course.slug}`}
            className="btn btn-primary btn-sm"
            style={{ width: '100%', fontSize: '0.8rem' }}
          >
            JOIN NOW
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
