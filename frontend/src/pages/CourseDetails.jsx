import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Clock, 
  Calendar, 
  Users, 
  DollarSign, 
  CheckCircle, 
  Shield, 
  ArrowLeft,
  Flame,
  Award
} from 'lucide-react';
import { getCourseBySlug, getSchedules, getFees } from '../services/api';
import AdmissionForm from '../components/AdmissionForm';

const CourseDetails = () => {
  const { slug } = useParams();
  const [course, setCourse] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getCourseBySlug(slug)
      .then((data) => {
        setCourse(data);
        return Promise.all([
          getSchedules({ course: slug }).catch(() => []),
          getFees({ course: slug }).catch(() => []),
        ]);
      })
      .then(([schedData, feeData]) => {
        setSchedules(schedData);
        setFees(feeData);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Course details error:', err);
        setError('Course not found or inactive.');
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="section-padding container" style={{ textAlign: 'center', minHeight: '50vh' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading course specifications...</p>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="section-padding container" style={{ textAlign: 'center', minHeight: '50vh' }}>
        <h2 style={{ color: '#DC2626', marginBottom: '1rem' }}>COURSE NOT FOUND</h2>
        <p style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
          {error || 'The requested training program does not exist.'}
        </p>
        <Link to="/courses" className="btn btn-primary">
          <ArrowLeft size={16} /> RETURN TO COURSES
        </Link>
      </div>
    );
  }

  const imageUrl = course.image_display || course.image_url || 'https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&w=1200&q=80';

  return (
    <div className="course-detail-page">
      {/* Course Hero Banner */}
      <div
        style={{
          position: 'relative',
          backgroundColor: '#0F1117',
          color: '#FFFFFF',
          padding: '4.5rem 0',
          backgroundImage: `
            linear-gradient(to right, rgba(15, 17, 23, 0.95) 45%, rgba(15, 17, 23, 0.75) 100%),
            url('${imageUrl}')
          `,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderBottom: '1px solid #1E293B',
        }}
      >
        <div className="container">
          <Link
            to="/courses"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: '#94A3B8',
              fontSize: '0.85rem',
              fontWeight: 700,
              marginBottom: '1.5rem',
              textTransform: 'uppercase',
            }}
          >
            <ArrowLeft size={16} /> ALL COURSES
          </Link>

          <div style={{ maxWidth: '750px' }}>
            <span
              style={{
                backgroundColor: '#DC2626',
                color: '#FFFFFF',
                padding: '4px 12px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.75rem',
                fontWeight: 800,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                display: 'inline-block',
                marginBottom: '1rem',
              }}
            >
              {course.age_group}
            </span>

            <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4.2rem)', color: '#FFFFFF', lineHeight: 1.05, marginBottom: '1rem' }}>
              {course.title}
            </h1>

            <p style={{ fontSize: '1.15rem', color: '#CBD5E1', lineHeight: '1.6', marginBottom: '2rem' }}>
              {course.short_description}
            </p>

            {/* Quick Metrics Bar */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', fontSize: '0.95rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock size={18} color="#DC2626" />
                <span><strong>Duration:</strong> {course.duration || 'Flexible / Term'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Users size={18} color="#DC2626" />
                <span><strong>Ages:</strong> {course.age_group}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <DollarSign size={18} color="#DC2626" />
                <span><strong>Standard Fee:</strong> ${parseFloat(course.monthly_fee || 99).toFixed(0)}/mo</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Course Content */}
      <div className="section-padding" style={{ backgroundColor: 'var(--light-bg)' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '3.5rem',
              alignItems: 'flex-start',
            }}
          >
            {/* Left Column: Detailed Description, Schedules & Fees */}
            <div>
              <div
                className="light-card"
                style={{
                  padding: '2.5rem',
                  marginBottom: '2.5rem',
                  backgroundColor: '#FFFFFF',
                }}
              >
                <h3 style={{ fontSize: '1.8rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>
                  PROGRAM OVERVIEW & CURRICULUM
                </h3>
                <p
                  style={{
                    color: 'var(--text-secondary)',
                    fontSize: '1rem',
                    lineHeight: '1.8',
                    whiteSpace: 'pre-line',
                    marginBottom: '2rem',
                  }}
                >
                  {course.description}
                </p>

                <h4 style={{ fontSize: '1.3rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>
                  KEY TRAINING BENEFITS
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  {[
                    'Technical mastery of traditional and modern martial arts',
                    'Cardiovascular conditioning and athletic endurance',
                    'Anti-bullying, de-escalation & self-defense awareness',
                    'Rank belt advancement and recognized certification',
                  ].map((b, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.9rem' }}>
                      <CheckCircle size={18} color="#DC2626" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span style={{ color: 'var(--text-secondary)' }}>{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Course Specific Timetable */}
              <div
                className="light-card"
                style={{
                  padding: '2.5rem',
                  marginBottom: '2.5rem',
                  backgroundColor: '#FFFFFF',
                }}
              >
                <h3 style={{ fontSize: '1.8rem', color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
                  AVAILABLE TRAINING BATCHES
                </h3>

                {schedules.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)' }}>
                    Batches are running daily. Please check the master timetable or contact the dojo.
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {schedules.map((s) => (
                      <div
                        key={s.id}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '1rem',
                          backgroundColor: '#F8FAFC',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--light-border)',
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{s.batch_name}</div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                            {s.training_day} • {s.age_category}
                          </div>
                        </div>
                        <div style={{ fontWeight: 700, color: '#DC2626' }}>
                          {s.formatted_start_time || s.start_time} - {s.formatted_end_time || s.end_time}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Fee Information Breakdown */}
              {fees.length > 0 && (
                <div
                  className="light-card"
                  style={{
                    padding: '2.5rem',
                    backgroundColor: '#FFFFFF',
                  }}
                >
                  <h3 style={{ fontSize: '1.8rem', color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
                    MEMBERSHIP & FEE PLANS
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    {fees.map((f) => (
                      <div
                        key={f.id}
                        style={{
                          padding: '1.25rem',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: '#F8FAFC',
                          border: '1px solid var(--light-border)',
                          textAlign: 'center',
                        }}
                      >
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                          {f.age_category}
                        </div>
                        <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', color: '#DC2626' }}>
                          ${parseFloat(f.fee_amount).toFixed(0)}
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>/{f.fee_period}</span>
                        </div>
                        {f.additional_notes && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                            {f.additional_notes}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Direct Admission Form Drawer */}
            <div>
              <div style={{ position: 'sticky', top: '100px' }}>
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                  <span className="section-subtitle">JOIN THIS DISCIPLINE</span>
                  <h3 style={{ fontSize: '2rem', color: 'var(--text-primary)' }}>
                    ENROL OR BOOK FREE TRIAL
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    Fill out the form below to register for {course.title}.
                  </p>
                </div>
                <AdmissionForm initialCourseId={course.id} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
