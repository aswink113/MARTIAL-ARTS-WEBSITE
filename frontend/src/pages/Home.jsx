import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  Flame, 
  Target, 
  Dumbbell, 
  Brain, 
  CheckCircle, 
  ArrowRight, 
  Play, 
  Calendar, 
  Award, 
  ChevronRight,
  Clock,
  Sparkles
} from 'lucide-react';
import { getSettings, getCourses, getInstructors, getSchedules, getAchievements, getGallery } from '../services/api';
import CourseCard from '../components/CourseCard';
import InstructorCard from '../components/InstructorCard';
import GalleryGrid from '../components/GalleryGrid';
import Timetable from '../components/Timetable';

const Home = () => {
  const [settings, setSettings] = useState(null);
  const [courses, setCourses] = useState([]);
  const [headCoach, setHeadCoach] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getSettings().catch(() => null),
      getCourses().catch(() => []),
      getInstructors(true).catch(() => []),
      getSchedules().catch(() => []),
      getAchievements().catch(() => []),
      getGallery('Training Photos').catch(() => []),
    ]).then(([settingsData, coursesData, instructorsData, schedulesData, achievementsData, galleryData]) => {
      setSettings(settingsData);
      setCourses(coursesData);
      setHeadCoach(instructorsData[0] || null);
      setSchedules(schedulesData);
      setAchievements(achievementsData);
      setGallery(galleryData);
      setLoading(false);
    });
  }, []);

  const yearsExp = settings?.years_experience || '10+';
  const happyStudents = settings?.happy_students || '500+';
  const expertInstructors = settings?.expert_instructors || '15+';
  const disciplineFocus = settings?.discipline_focus || '100%';

  return (
    <div className="home-page">
      {/* =========================================================================
          HERO SECTION (High-contrast charcoal & crimson theme from reference image)
          ========================================================================= */}
      <section
        style={{
          position: 'relative',
          backgroundColor: '#0A0C11',
          color: '#FFFFFF',
          minHeight: '85vh',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          backgroundImage: `
            radial-gradient(circle at 75% 45%, rgba(220, 38, 38, 0.15) 0%, transparent 60%),
            linear-gradient(to right, rgba(10, 12, 17, 0.98) 35%, rgba(10, 12, 17, 0.7) 100%)
          `,
        }}
      >
        {/* Background Visual Graphic / Martial Artist Artwork */}
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            width: '60%',
            backgroundImage: `url('https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&w=1600&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 20%',
            opacity: 0.38,
            zIndex: 1,
            maskImage: 'linear-gradient(to left, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)',
            WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)',
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 2, padding: '4rem 1.25rem' }}>
          <div style={{ maxWidth: '680px' }}>
            {/* Small Top Badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: 'rgba(220, 38, 38, 0.15)',
                border: '1px solid rgba(220, 38, 38, 0.4)',
                padding: '0.4rem 1rem',
                borderRadius: 'var(--radius-full)',
                color: '#EF4444',
                fontSize: '0.8rem',
                fontWeight: 800,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                marginBottom: '1.5rem',
              }}
            >
              <Flame size={16} />
              PREMIER MARTIAL ARTS ACADEMY
            </div>

            {/* Main Headline (DISCIPLINE. FOCUS. STRENGTH.) */}
            <h1
              style={{
                fontSize: 'clamp(3.2rem, 7vw, 5.5rem)',
                fontWeight: 700,
                color: '#FFFFFF',
                lineHeight: '0.98',
                marginBottom: '1.25rem',
                letterSpacing: '0.02em',
              }}
            >
              DISCIPLINE.<br />
              FOCUS.<br />
              <span style={{ color: '#DC2626' }}>STRENGTH.</span>
            </h1>

            {/* Subtitle */}
            <p
              style={{
                fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                color: '#CBD5E1',
                lineHeight: '1.6',
                marginBottom: '2.25rem',
                maxWidth: '540px',
              }}
            >
              Martial arts builds a stronger body, a sharper mind, and an unbreakable spirit.
              Train with world-class instructors in a family-oriented dojo.
            </p>

            {/* CTA Buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
              <Link to="/admission" className="btn btn-primary" style={{ padding: '0.85rem 2.2rem', fontSize: '1rem' }}>
                START FREE TRIAL
              </Link>
              <Link to="/courses" className="btn btn-outline" style={{ padding: '0.85rem 2rem', fontSize: '1rem' }}>
                <Play size={18} />
                EXPLORE CLASSES
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4 FEATURE HIGHLIGHTS STRIP (Light cards with red icons from reference image)
          ========================================================================= */}
      <section style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid var(--light-border)', padding: '2.5rem 0' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '1.75rem',
            }}
          >
            {[
              {
                icon: <Brain size={28} />,
                title: 'BUILD CONFIDENCE',
                desc: 'Develop self-confidence, mental resilience, and belief in your personal abilities.',
              },
              {
                icon: <Shield size={28} />,
                title: 'LEARN SELF DEFENSE',
                desc: 'Practical, instinctual techniques to protect yourself and your loved ones in any situation.',
              },
              {
                icon: <Dumbbell size={28} />,
                title: 'GET FIT & STRONG',
                desc: 'Full-body conditioning that improves muscular strength, explosive agility, and stamina.',
              },
              {
                icon: <Target size={28} />,
                title: 'IMPROVE FOCUS',
                desc: 'Sharpen concentration, mental clarity, and mindfulness under physical pressure.',
              },
            ].map((f, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '1.25rem',
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-md)',
                  transition: 'transform 0.2s ease',
                }}
              >
                <div
                  style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: '50%',
                    backgroundColor: '#FEE2E2',
                    color: '#DC2626',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    boxShadow: '0 4px 10px rgba(220, 38, 38, 0.15)',
                  }}
                >
                  {f.icon}
                </div>
                <div>
                  <h4 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                    {f.title}
                  </h4>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          OUR CLASSES / CHOOSE YOUR STYLE (Section from reference image)
          ========================================================================= */}
      <section className="section-padding" style={{ backgroundColor: 'var(--light-bg)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">OUR CLASSES</span>
            <h2 className="section-title">CHOOSE YOUR STYLE</h2>
            <p className="section-desc">
              From traditional karate katas to modern Brazilian Jiu-Jitsu and high-octane Muay Thai,
              explore programs engineered for every age and ambition.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '2rem',
              marginBottom: '3rem',
            }}
          >
            {courses.slice(0, 6).map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>

          <div style={{ textAlign: 'center' }}>
            <Link to="/courses" className="btn btn-outline-dark" style={{ padding: '0.85rem 2.5rem' }}>
              VIEW ALL CLASSES & SYLLABUS
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          ABOUT US & WHY CHOOSE US (High-contrast clean light section from reference image)
          ========================================================================= */}
      <section className="section-padding" style={{ backgroundColor: '#FFFFFF', borderTop: '1px solid var(--light-border)' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
              gap: '4rem',
              alignItems: 'center',
            }}
          >
            {/* Left: About us info */}
            <div>
              <span className="section-subtitle" style={{ justifyContent: 'flex-start' }}>ABOUT US</span>
              <h2 className="section-title" style={{ textAlign: 'left', marginBottom: '1.25rem' }}>
                WE BUILD WARRIORS
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.7', marginBottom: '1.75rem' }}>
                At Warrior Martial Arts, we are more than just a dojo. We are a family.
                Our mission is to empower every student to overcome fear, build authentic inner strength,
                and discover the best version of themselves through martial arts discipline.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '2.25rem' }}>
                {[
                  'Experienced & Certified Black Belt Instructors',
                  'Clean, Safe, Air-Conditioned & Positive Dojo Environment',
                  'Specialized Curriculum for All Ages & Skill Levels',
                  'Life Skills: Integrity, Respect, Perseverance & Confidence',
                ].map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div
                      style={{
                        width: '22px',
                        height: '22px',
                        borderRadius: '50%',
                        backgroundColor: '#FEE2E2',
                        color: '#DC2626',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <CheckCircle size={15} />
                    </div>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              <Link to="/about" className="btn btn-primary">
                LEARN MORE ABOUT US
              </Link>
            </div>

            {/* Right: Why Choose Us & Dojo Stats Grid */}
            <div
              style={{
                backgroundColor: '#F8FAFC',
                border: '1px solid var(--light-border)',
                borderRadius: 'var(--radius-lg)',
                padding: '3rem 2.5rem',
              }}
            >
              <span className="section-subtitle" style={{ justifyContent: 'flex-start' }}>WHY CHOOSE US</span>
              <h3 style={{ fontSize: '2rem', color: 'var(--text-primary)', marginBottom: '2rem' }}>
                BEST TRAINING. STRONG COMMUNITY.
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: '3.2rem', color: '#DC2626', lineHeight: 1 }}>
                    {yearsExp}
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-primary)' }}>
                    YEARS OF EXPERIENCE
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Established lineage of excellence</div>
                </div>

                <div>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: '3.2rem', color: '#DC2626', lineHeight: 1 }}>
                    {happyStudents}
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-primary)' }}>
                    HAPPY STUDENTS
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Active martial artists trained</div>
                </div>

                <div>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: '3.2rem', color: '#DC2626', lineHeight: 1 }}>
                    {expertInstructors}
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-primary)' }}>
                    EXPERT INSTRUCTORS
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>National & World Champions</div>
                </div>

                <div>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: '3.2rem', color: '#DC2626', lineHeight: 1 }}>
                    {disciplineFocus}
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-primary)' }}>
                    FOCUS ON DISCIPLINE
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Character & physical excellence</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          HEAD COACH SPOTLIGHT
          ========================================================================= */}
      {headCoach && (
        <section className="section-padding" style={{ backgroundColor: 'var(--light-bg)' }}>
          <div className="container">
            <div className="section-header">
              <span className="section-subtitle">MEET OUR LEADER</span>
              <h2 className="section-title">HEAD COACH SPOTLIGHT</h2>
            </div>

            <div
              className="light-card"
              style={{
                maxWidth: '960px',
                margin: '0 auto',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                overflow: 'hidden',
              }}
            >
              <div style={{ minHeight: '340px' }}>
                <img
                  src={headCoach.image_display || headCoach.image_url}
                  alt={headCoach.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <span
                  style={{
                    backgroundColor: '#DC2626',
                    color: '#FFFFFF',
                    padding: '3px 10px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    width: 'fit-content',
                    marginBottom: '0.75rem',
                  }}
                >
                  6TH DAN BLACK BELT
                </span>
                <h3 style={{ fontSize: '2.2rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                  {headCoach.name}
                </h3>
                <div style={{ color: '#DC2626', fontWeight: 700, fontSize: '0.9rem', marginBottom: '1.25rem' }}>
                  {headCoach.designation}
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.7', marginBottom: '1.5rem' }}>
                  {headCoach.biography}
                </p>
                <div
                  style={{
                    backgroundColor: '#F8FAFC',
                    padding: '0.85rem 1.25rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--light-border)',
                    fontSize: '0.85rem',
                    color: 'var(--text-secondary)',
                    marginBottom: '1.5rem',
                  }}
                >
                  <strong>Qualifications:</strong> {headCoach.qualifications}
                </div>
                <Link to="/about" className="btn btn-secondary btn-sm" style={{ width: 'fit-content' }}>
                  MEET ALL SENSEIS & INSTRUCTORS
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          CLASS TIMETABLE PREVIEW
          ========================================================================= */}
      <section className="section-padding" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">DOJO TIMETABLE</span>
            <h2 className="section-title">WEEKLY CLASS SCHEDULE</h2>
            <p className="section-desc">
              Classes are organized to suit children, working professionals, and weekend warriors alike.
            </p>
          </div>

          <Timetable schedules={schedules.slice(0, 6)} />

          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link to="/admission" className="btn btn-primary" style={{ padding: '0.85rem 2rem' }}>
              VIEW COMPLETE TIMETABLE & ENROL
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          GALLERY & ACHIEVEMENTS PREVIEW
          ========================================================================= */}
      <section className="section-padding" style={{ backgroundColor: 'var(--light-bg)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">MEDIA & ACHIEVEMENTS</span>
            <h2 className="section-title">DOJO LIFE & MEDALS</h2>
            <p className="section-desc">
              Experience the energy, the sweat, and the championship podium moments of Warrior Academy.
            </p>
          </div>

          <GalleryGrid items={gallery.slice(0, 4)} />

          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link to="/gallery" className="btn btn-outline-dark">
              OPEN FULL GALLERY & VIDEO VAULT
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          CTA BANNER (From reference image: "READY TO START YOUR JOURNEY?")
          ========================================================================= */}
      <section
        style={{
          backgroundColor: '#0F1117',
          color: '#FFFFFF',
          padding: '4.5rem 0',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          borderTop: '3px solid #DC2626',
        }}
      >
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <h2
            style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              color: '#FFFFFF',
              marginBottom: '0.75rem',
            }}
          >
            READY TO START YOUR JOURNEY?
          </h2>
          <p
            style={{
              fontSize: '1.2rem',
              color: '#94A3B8',
              maxWidth: '600px',
              margin: '0 auto 2.25rem',
            }}
          >
            Join us today and get your first martial arts class completely free!
            No experience or equipment required.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link
              to="/admission"
              className="btn btn-primary"
              style={{ padding: '0.9rem 2.5rem', fontSize: '1rem' }}
            >
              BOOK YOUR FREE TRIAL
            </Link>
            <a
              href="tel:+11234567890"
              className="btn btn-outline"
              style={{ padding: '0.9rem 2.5rem', fontSize: '1rem' }}
            >
              CALL US DIRECTLY
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
