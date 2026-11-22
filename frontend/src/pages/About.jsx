import React, { useState, useEffect } from 'react';
import { Shield, Award, Target, Flame, CheckCircle, Users, Trophy } from 'lucide-react';
import { getSettings, getInstructors, getAchievements } from '../services/api';
import InstructorCard from '../components/InstructorCard';

const About = () => {
  const [settings, setSettings] = useState(null);
  const [instructors, setInstructors] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getSettings().catch(() => null),
      getInstructors().catch(() => []),
      getAchievements().catch(() => []),
    ]).then(([settingsData, instData, achData]) => {
      setSettings(settingsData);
      setInstructors(instData);
      setAchievements(achData);
      setLoading(false);
    });
  }, []);

  const headCoach = instructors.find((i) => i.is_head_coach) || instructors[0];

  return (
    <div className="about-page">
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
          <span className="section-subtitle">OUR DOJO HERITAGE</span>
          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: '#FFFFFF', marginBottom: '0.75rem' }}>
            ABOUT WARRIOR MARTIAL ARTS
          </h1>
          <p style={{ color: '#94A3B8', maxWidth: '640px', margin: '0 auto', fontSize: '1.05rem' }}>
            Dedicated to the cultivation of mind, body, and warrior spirit.
            Building stronger, healthier, and more resilient champions for life.
          </p>
        </div>
      </div>

      {/* History & Introduction */}
      <section className="section-padding" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '4rem',
              alignItems: 'center',
            }}
          >
            <div>
              <span className="section-subtitle" style={{ justifyContent: 'flex-start' }}>OUR STORY</span>
              <h2 className="section-title" style={{ textAlign: 'left', marginBottom: '1.25rem' }}>
                TRADITION MEETS MODERN EXCELLENCE
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: '1.8', marginBottom: '1.25rem' }}>
                Founded over a decade ago under the mentorship of Master Kenji Tanaka, Warrior Martial Arts Academy
                was established with a singular vision: to create a dojo where the timeless virtues of martial arts—respect,
                humility, discipline, and indomitable courage—could be passed to men, women, and children of all backgrounds.
              </p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: '1.8', marginBottom: '2rem' }}>
                Today, our academy blends traditional martial discipline with contemporary sport biomechanics,
                providing elite-level training in Karate, Brazilian Jiu-Jitsu, Muay Thai, Kickboxing, and practical street self-defense.
              </p>

              {/* Pillars / Values */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                {[
                  { title: 'HONOR & RESPECT', desc: 'Bowing to tradition and valuing every student and teammate.' },
                  { title: 'MENTAL TOUGHNESS', desc: 'Developing the fortitude to persevere through adversity.' },
                  { title: 'SAFETY FIRST', desc: 'State-of-the-art matted dojo and certified coaching techniques.' },
                  { title: 'COMMUNITY & FAMILY', desc: 'An inclusive dojo where students encourage and uplift each other.' },
                ].map((v, i) => (
                  <div key={i} style={{ borderLeft: '3px solid #DC2626', paddingLeft: '0.75rem' }}>
                    <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{v.title}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{v.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Image Graphic */}
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-xl)',
                  height: '460px',
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1000&q=80"
                  alt="Martial Arts Dojo Training"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div
                style={{
                  position: 'absolute',
                  bottom: '-20px',
                  right: '20px',
                  backgroundColor: '#DC2626',
                  color: '#FFFFFF',
                  padding: '1.25rem 2rem',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: '0 10px 25px rgba(220, 38, 38, 0.4)',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', lineHeight: 1 }}>
                  100%
                </div>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>
                  BLACK BELT DEDICATION
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="section-padding" style={{ backgroundColor: 'var(--light-bg)' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '2.5rem',
            }}
          >
            <div className="light-card" style={{ padding: '2.5rem', backgroundColor: '#FFFFFF' }}>
              <div
                style={{
                  width: '50px',
                  height: '50px',
                  backgroundColor: '#FEE2E2',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#DC2626',
                  marginBottom: '1.25rem',
                }}
              >
                <Target size={26} />
              </div>
              <h3 style={{ fontSize: '1.8rem', color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
                OUR MISSION
              </h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', fontSize: '0.95rem' }}>
                To empower men, women, and children through rigorous, safe, and inspiring martial arts instruction.
                We cultivate disciplined bodies, focused minds, and unbreakable characters ready to conquer life’s obstacles.
              </p>
            </div>

            <div className="light-card" style={{ padding: '2.5rem', backgroundColor: '#FFFFFF' }}>
              <div
                style={{
                  width: '50px',
                  height: '50px',
                  backgroundColor: '#FEE2E2',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#DC2626',
                  marginBottom: '1.25rem',
                }}
              >
                <Flame size={26} />
              </div>
              <h3 style={{ fontSize: '1.8rem', color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
                OUR VISION
              </h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', fontSize: '0.95rem' }}>
                To stand as the standard of excellence in the martial arts community, fostering an empowering ecosystem
                where aspiring champions, fitness enthusiasts, and everyday warriors thrive with pride and mutual respect.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Instructors & Coaches Profiles */}
      <section className="section-padding" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">OUR INSTRUCTORS</span>
            <h2 className="section-title">MEET OUR SENSEIS & COACHES</h2>
            <p className="section-desc">
              Every instructor is an internationally accredited black belt, vetted for character, coaching empathy, and technical brilliance.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '2rem',
            }}
          >
            {instructors.map((inst) => (
              <InstructorCard key={inst.id} instructor={inst} />
            ))}
          </div>
        </div>
      </section>

      {/* Academy Achievements & Awards */}
      <section className="section-padding" style={{ backgroundColor: 'var(--light-bg)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">PROUD MILESTONES</span>
            <h2 className="section-title">ACADEMY ACHIEVEMENTS</h2>
            <p className="section-desc">
              A track record of competitive triumph and community excellence across regional and national tournaments.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '2rem',
            }}
          >
            {achievements.map((ach) => (
              <div
                key={ach.id}
                className="light-card"
                style={{ padding: '2rem', backgroundColor: '#FFFFFF', display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}
              >
                <div
                  style={{
                    width: '54px',
                    height: '54px',
                    backgroundColor: '#FEF3C7',
                    color: '#D97706',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Trophy size={28} />
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#DC2626', fontWeight: 800 }}>
                    {ach.achievement_date}
                  </div>
                  <h4 style={{ fontSize: '1.4rem', color: 'var(--text-primary)', margin: '0.25rem 0 0.5rem' }}>
                    {ach.title}
                  </h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                    {ach.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
