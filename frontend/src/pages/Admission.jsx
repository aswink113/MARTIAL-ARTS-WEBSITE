import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Calendar, 
  HelpCircle, 
  CheckCircle, 
  DollarSign, 
  Clock, 
  ShieldCheck,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { getSchedules, getFees } from '../services/api';
import Timetable from '../components/Timetable';
import AdmissionForm from '../components/AdmissionForm';

const Admission = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialCourse = searchParams.get('course') || '';
  const initialBatch = searchParams.get('batch') || '';

  const [schedules, setSchedules] = useState([]);
  const [fees, setFees] = useState([]);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    Promise.all([
      getSchedules().catch(() => []),
      getFees().catch(() => []),
    ]).then(([schedData, feeData]) => {
      setSchedules(schedData);
      setFees(feeData);
    });
  }, []);

  const faqs = [
    {
      q: 'Do I need prior experience or athletic fitness before joining?',
      a: 'Not at all! 90% of our new students start with zero martial arts experience. Our instructors break down every fundamental step-by-step in a supportive and encouraging setting.'
    },
    {
      q: 'What should I wear for my first free trial class?',
      a: 'Comfortable athletic workout attire (t-shirt and sweatpants/shorts) is perfect. We train barefoot on sanitized Olympic-grade mats. A water bottle is recommended.'
    },
    {
      q: 'What age can children begin training at Warrior Martial Arts?',
      a: 'Our Little Ninjas program accepts children from age 4 and up. We emphasize listening skills, motor coordination, respect, and confidence building.'
    },
    {
      q: 'Are uniforms (Gi) and protective gear provided?',
      a: 'Upon formal enrollment, an official academy uniform (Gi or rashguard) and your beginner white belt are included with your registration package.'
    },
    {
      q: 'Can parents watch the children train during class?',
      a: 'Yes, absolutely! We have a comfortable, air-conditioned viewing lounge with complimentary Wi-Fi for parents and guardians.'
    }
  ];

  return (
    <div className="admission-page">
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
          <span className="section-subtitle">JOIN THE WARRIOR FAMILY</span>
          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: '#FFFFFF', marginBottom: '0.75rem' }}>
            CLASS TIMETABLE & ADMISSIONS
          </h1>
          <p style={{ color: '#94A3B8', maxWidth: '640px', margin: '0 auto', fontSize: '1.05rem' }}>
            Explore available training batches, review tuition fees, and submit your admission enquiry for a free trial lesson.
          </p>
        </div>
      </div>

      {/* 4-Step Process Strip */}
      <section style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid var(--light-border)', padding: '3rem 0' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '2rem',
              textAlign: 'center',
            }}
          >
            {[
              { step: '01', title: 'Submit Enquiry', desc: 'Fill out the form below with your preferred style and batch.' },
              { step: '02', title: 'Free Trial Class', desc: 'Meet our sensei and experience a free hands-on lesson on the mats.' },
              { step: '03', title: 'Uniform & Belt Fitting', desc: 'Receive your traditional Gi, rank belt, and academy handbook.' },
              { step: '04', title: 'Start Training', desc: 'Begin your transformative journey to black belt excellence.' },
            ].map((p, idx) => (
              <div key={idx} style={{ position: 'relative' }}>
                <div
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '2.5rem',
                    color: '#DC2626',
                    lineHeight: 1,
                    marginBottom: '0.5rem',
                  }}
                >
                  {p.step}
                </div>
                <h4 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                  {p.title}
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timetable Section */}
      <section className="section-padding" style={{ backgroundColor: 'var(--light-bg)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">DOJO TIMETABLE</span>
            <h2 className="section-title">WEEKLY TRAINING SCHEDULE</h2>
            <p className="section-desc">
              Select your preferred day to filter batches. Click "Select Batch" to pre-fill your admission form.
            </p>
          </div>

          <Timetable schedules={schedules} />
        </div>
      </section>

      {/* Admission Form Section */}
      <section className="section-padding" style={{ backgroundColor: '#FFFFFF', borderTop: '1px solid var(--light-border)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">ENROL NOW</span>
            <h2 className="section-title">ONLINE ADMISSION ENQUIRY</h2>
            <p className="section-desc">
              Submit your enquiry to secure your spot and claim your complimentary 1-day free trial pass.
            </p>
          </div>

          <AdmissionForm initialCourseId={initialCourse} initialBatch={initialBatch} />
        </div>
      </section>

      {/* Tuition & Membership Fees Table */}
      <section className="section-padding" style={{ backgroundColor: 'var(--light-bg)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">TRANSPARENT TUITION</span>
            <h2 className="section-title">COURSE FEES & PLANS</h2>
            <p className="section-desc">
              Simple, affordable monthly and annual pricing with family discounts and no hidden lock-in contracts.
            </p>
          </div>

          <div className="table-responsive">
            <table className="custom-table" style={{ maxWidth: '880px', margin: '0 auto' }}>
              <thead>
                <tr>
                  <th>DISCIPLINE / PROGRAM</th>
                  <th>AGE CATEGORY</th>
                  <th>TUITION FEE</th>
                  <th>BILLING FREQUENCY</th>
                  <th>NOTES</th>
                </tr>
              </thead>
              <tbody>
                {fees.map((fee) => (
                  <tr key={fee.id}>
                    <td style={{ fontWeight: 800, color: 'var(--text-primary)' }}>
                      {fee.course_title}
                    </td>
                    <td>{fee.age_category}</td>
                    <td style={{ fontWeight: 800, color: '#DC2626', fontSize: '1.1rem' }}>
                      ${parseFloat(fee.fee_amount).toFixed(0)}
                    </td>
                    <td>
                      <span className="badge badge-red-soft">{fee.fee_period}</span>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {fee.additional_notes || 'All access included'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div className="section-header">
            <span className="section-subtitle">COMMON QUESTIONS</span>
            <h2 className="section-title">FREQUENTLY ASKED QUESTIONS</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {faqs.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <div
                  key={i}
                  style={{
                    border: '1px solid var(--light-border)',
                    borderRadius: 'var(--radius-sm)',
                    overflow: 'hidden',
                    backgroundColor: '#FFFFFF',
                  }}
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    style={{
                      width: '100%',
                      padding: '1.25rem 1.5rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      textAlign: 'left',
                      fontWeight: 700,
                      color: isOpen ? '#DC2626' : 'var(--text-primary)',
                      fontSize: '1.05rem',
                      cursor: 'pointer',
                      backgroundColor: isOpen ? '#F8FAFC' : '#FFFFFF',
                    }}
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp size={20} color="#DC2626" /> : <ChevronDown size={20} />}
                  </button>
                  {isOpen && (
                    <div
                      style={{
                        padding: '1.25rem 1.5rem',
                        color: 'var(--text-secondary)',
                        fontSize: '0.95rem',
                        lineHeight: '1.7',
                        borderTop: '1px solid var(--light-border)',
                        backgroundColor: '#FFFFFF',
                      }}
                    >
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Admission;
