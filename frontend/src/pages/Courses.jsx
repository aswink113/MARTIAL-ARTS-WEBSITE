import React, { useState, useEffect } from 'react';
import { Search, Filter, Shield } from 'lucide-react';
import { getCourses } from '../services/api';
import CourseCard from '../components/CourseCard';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAge, setSelectedAge] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCourses()
      .then((data) => {
        setCourses(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Courses fetch error:', err);
        setLoading(false);
      });
  }, []);

  const ageFilters = ['All', 'Kids', 'Teens', 'Adults', 'All Ages'];

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.short_description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesAge =
      selectedAge === 'All' ||
      course.age_group.toLowerCase().includes(selectedAge.toLowerCase());

    return matchesSearch && matchesAge;
  });

  return (
    <div className="courses-page">
      {/* Page Header */}
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
          <span className="section-subtitle">OUR CURRICULUM</span>
          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: '#FFFFFF', marginBottom: '0.75rem' }}>
            TRAINING PROGRAMS & DISCIPLINES
          </h1>
          <p style={{ color: '#94A3B8', maxWidth: '640px', margin: '0 auto', fontSize: '1.05rem' }}>
            Discover world-class martial arts training tailored for children, teens, and adults.
            Choose your path from striking, grappling, physical fitness, and real-world self-defense.
          </p>
        </div>
      </div>

      <div className="section-padding" style={{ backgroundColor: 'var(--light-bg)' }}>
        <div className="container">
          {/* Search & Filter Controls */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1rem',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '3rem',
              backgroundColor: '#FFFFFF',
              padding: '1.25rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--light-border)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            {/* Search Input */}
            <div style={{ position: 'relative', flexGrow: 1, minWidth: '240px' }}>
              <Search
                size={18}
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                }}
              />
              <input
                type="text"
                placeholder="Search programs by title or discipline..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-control"
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>

            {/* Age Filter Tabs */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {ageFilters.map((age) => (
                <button
                  key={age}
                  onClick={() => setSelectedAge(age)}
                  style={{
                    padding: '0.45rem 1rem',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: selectedAge === age ? '#DC2626' : '#F1F5F9',
                    color: selectedAge === age ? '#FFFFFF' : 'var(--text-secondary)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {age}
                </button>
              ))}
            </div>
          </div>

          {/* Courses Grid */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
              Loading academy courses...
            </div>
          ) : filteredCourses.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem', backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-md)' }}>
              <Shield size={48} color="#DC2626" style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>No Courses Found</h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                Try adjusting your search criteria or filter to see available programs.
              </p>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '2rem',
              }}
            >
              {filteredCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Courses;
