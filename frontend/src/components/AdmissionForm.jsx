import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertCircle, Send, Loader2 } from 'lucide-react';
import { getCourses, submitAdmissionEnquiry } from '../services/api';

const AdmissionForm = ({ initialCourseId = '', initialBatch = '' }) => {
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    student_name: '',
    student_age: '',
    guardian_name: '',
    phone: '',
    email: '',
    course: initialCourseId || '',
    preferred_batch: initialBatch || '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [successResponse, setSuccessResponse] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    getCourses()
      .then((data) => {
        setCourses(data);
        if (initialCourseId && !formData.course) {
          // If a slug was passed, resolve it to course ID
          const match = data.find((c) => c.slug === initialCourseId || String(c.id) === String(initialCourseId));
          if (match) {
            setFormData((prev) => ({ ...prev, course: match.id }));
          }
        }
      })
      .catch((err) => console.log('Courses loading error:', err));
  }, [initialCourseId]);

  useEffect(() => {
    if (initialBatch) {
      setFormData((prev) => ({ ...prev, preferred_batch: initialBatch }));
    }
  }, [initialBatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear validation error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.student_name.trim()) errs.student_name = 'Student name is required.';
    if (!formData.student_age) {
      errs.student_age = 'Age is required.';
    } else if (Number(formData.student_age) < 4 || Number(formData.student_age) > 99) {
      errs.student_age = 'Age must be between 4 and 99.';
    }
    if (Number(formData.student_age) < 18 && !formData.guardian_name.trim()) {
      errs.guardian_name = 'Parent / Guardian name is required for minors.';
    }
    if (!formData.phone.trim()) {
      errs.phone = 'Contact number is required.';
    } else if (formData.phone.replace(/[^0-9]/g, '').length < 7) {
      errs.phone = 'Please enter a valid phone number.';
    }
    if (!formData.email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'Please enter a valid email address.';
    }
    if (!formData.course) {
      errs.course = 'Please select a training course / discipline.';
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setErrors({});
    try {
      const payload = {
        ...formData,
        student_age: parseInt(formData.student_age, 10),
        course: formData.course ? parseInt(formData.course, 10) : null,
      };
      const response = await submitAdmissionEnquiry(payload);
      setSuccessResponse(response);
      setFormData({
        student_name: '',
        student_age: '',
        guardian_name: '',
        phone: '',
        email: '',
        course: '',
        preferred_batch: '',
        message: '',
      });
    } catch (err) {
      console.error('Submission error:', err);
      if (err.response && err.response.data && err.response.data.errors) {
        setErrors(err.response.data.errors);
      } else {
        setErrors({ general: 'Failed to submit admission enquiry. Please verify your details or contact us directly.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="light-card"
      style={{
        padding: '2.5rem',
        maxWidth: '750px',
        margin: '0 auto',
        backgroundColor: '#FFFFFF',
      }}
    >
      {successResponse ? (
        <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              backgroundColor: '#DCFCE7',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem',
              color: '#16A34A',
            }}
          >
            <CheckCircle2 size={36} />
          </div>
          <h3 style={{ fontSize: '1.8rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            APPLICATION RECEIVED!
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: '1.6', maxWidth: '520px', margin: '0 auto 1.5rem' }}>
            {successResponse.message ||
              `Thank you, ${successResponse.student_name}! Your enquiry has been saved. Our sensei will reach out within 24 hours.`}
          </p>
          <button
            onClick={() => setSuccessResponse(null)}
            className="btn btn-primary"
          >
            SUBMIT ANOTHER APPLICATION
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {errors.general && (
            <div
              style={{
                backgroundColor: '#FEF2F2',
                border: '1px solid #FCA5A5',
                color: '#B91C1C',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-sm)',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.9rem',
              }}
            >
              <AlertCircle size={18} />
              <span>{errors.general}</span>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
            {/* Student Name */}
            <div className="form-group">
              <label className="form-label">
                Student Full Name <span style={{ color: '#DC2626' }}>*</span>
              </label>
              <input
                type="text"
                name="student_name"
                value={formData.student_name}
                onChange={handleChange}
                placeholder="e.g. John Doe"
                className="form-control"
                style={{ borderColor: errors.student_name ? '#DC2626' : undefined }}
              />
              {errors.student_name && (
                <span style={{ color: '#DC2626', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>
                  {errors.student_name}
                </span>
              )}
            </div>

            {/* Student Age */}
            <div className="form-group">
              <label className="form-label">
                Student Age <span style={{ color: '#DC2626' }}>*</span>
              </label>
              <input
                type="number"
                name="student_age"
                value={formData.student_age}
                onChange={handleChange}
                placeholder="e.g. 12"
                min="4"
                max="99"
                className="form-control"
                style={{ borderColor: errors.student_age ? '#DC2626' : undefined }}
              />
              {errors.student_age && (
                <span style={{ color: '#DC2626', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>
                  {errors.student_age}
                </span>
              )}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
            {/* Guardian Name */}
            <div className="form-group">
              <label className="form-label">
                Parent / Guardian Name {Number(formData.student_age) < 18 && <span style={{ color: '#DC2626' }}>*</span>}
              </label>
              <input
                type="text"
                name="guardian_name"
                value={formData.guardian_name}
                onChange={handleChange}
                placeholder="Required for students under 18"
                className="form-control"
                style={{ borderColor: errors.guardian_name ? '#DC2626' : undefined }}
              />
              {errors.guardian_name && (
                <span style={{ color: '#DC2626', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>
                  {errors.guardian_name}
                </span>
              )}
            </div>

            {/* Contact Number */}
            <div className="form-group">
              <label className="form-label">
                Phone / WhatsApp Number <span style={{ color: '#DC2626' }}>*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 000-0000"
                className="form-control"
                style={{ borderColor: errors.phone ? '#DC2626' : undefined }}
              />
              {errors.phone && (
                <span style={{ color: '#DC2626', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>
                  {errors.phone}
                </span>
              )}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
            {/* Email Address */}
            <div className="form-group">
              <label className="form-label">
                Email Address <span style={{ color: '#DC2626' }}>*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                className="form-control"
                style={{ borderColor: errors.email ? '#DC2626' : undefined }}
              />
              {errors.email && (
                <span style={{ color: '#DC2626', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>
                  {errors.email}
                </span>
              )}
            </div>

            {/* Interested Course */}
            <div className="form-group">
              <label className="form-label">
                Interested Discipline / Course <span style={{ color: '#DC2626' }}>*</span>
              </label>
              <select
                name="course"
                value={formData.course}
                onChange={handleChange}
                className="form-control"
                style={{ borderColor: errors.course ? '#DC2626' : undefined }}
              >
                <option value="">-- Choose a Training Program --</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title} ({c.age_group})
                  </option>
                ))}
              </select>
              {errors.course && (
                <span style={{ color: '#DC2626', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>
                  {errors.course}
                </span>
              )}
            </div>
          </div>

          {/* Preferred Batch */}
          <div className="form-group">
            <label className="form-label">Preferred Batch / Training Days</label>
            <input
              type="text"
              name="preferred_batch"
              value={formData.preferred_batch}
              onChange={handleChange}
              placeholder="e.g. Morning Warriors (6:30 AM) or Weekend Little Ninjas"
              className="form-control"
            />
          </div>

          {/* Additional Message */}
          <div className="form-group">
            <label className="form-label">Goals / Prior Experience / Questions</label>
            <textarea
              name="message"
              rows="3"
              value={formData.message}
              onChange={handleChange}
              placeholder="Tell us what you'd like to achieve (fitness, self defense, competition, confidence)..."
              className="form-control"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.95rem', fontSize: '1rem', marginTop: '0.5rem' }}
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <span>SUBMITTING ENQUIRY...</span>
              </>
            ) : (
              <>
                <Send size={18} />
                <span>SUBMIT ADMISSION APPLICATION</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
};

export default AdmissionForm;
