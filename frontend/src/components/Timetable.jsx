import React, { useState } from 'react';
import { Clock, Calendar, Shield, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Timetable = ({ schedules = [] }) => {
  const [selectedDay, setSelectedDay] = useState('All');

  const days = ['All', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const filteredSchedules = selectedDay === 'All'
    ? schedules
    : schedules.filter((s) => s.training_day.toLowerCase().includes(selectedDay.toLowerCase()));

  return (
    <div>
      {/* Day Filter Pills */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.5rem',
          justifyContent: 'center',
          marginBottom: '2.5rem',
        }}
      >
        {days.map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            style={{
              padding: '0.45rem 1.25rem',
              fontSize: '0.85rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              borderRadius: 'var(--radius-full)',
              backgroundColor: selectedDay === day ? '#DC2626' : '#FFFFFF',
              color: selectedDay === day ? '#FFFFFF' : 'var(--text-secondary)',
              border: selectedDay === day ? '1px solid #DC2626' : '1px solid var(--light-border)',
              boxShadow: selectedDay === day ? '0 4px 10px rgba(220, 38, 38, 0.3)' : 'var(--shadow-sm)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Timetable Grid Cards & Table */}
      <div className="table-responsive">
        <table className="custom-table">
          <thead>
            <tr>
              <th>PROGRAM / DISCIPLINE</th>
              <th>BATCH NAME</th>
              <th>AGE CATEGORY</th>
              <th>TRAINING DAYS</th>
              <th>TIMINGS</th>
              <th style={{ textAlign: 'right' }}>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {filteredSchedules.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                  No training batches scheduled for this day.
                </td>
              </tr>
            ) : (
              filteredSchedules.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '1rem' }}>
                      {item.course_title || 'Martial Arts'}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: '#DC2626' }}>
                      {item.batch_name}
                    </div>
                  </td>
                  <td>
                    <span
                      style={{
                        backgroundColor: '#F1F5F9',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        color: 'var(--text-secondary)',
                      }}
                    >
                      {item.age_category}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-secondary)' }}>
                      <Calendar size={14} color="#DC2626" />
                      <span>{item.training_day}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      <Clock size={14} color="#DC2626" />
                      <span>
                        {item.formatted_start_time || item.start_time} – {item.formatted_end_time || item.end_time}
                      </span>
                    </div>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <Link
                      to={`/admission?course=${item.course}&batch=${encodeURIComponent(item.batch_name)}`}
                      className="btn btn-primary btn-sm"
                      style={{ padding: '0.35rem 0.85rem', fontSize: '0.75rem' }}
                    >
                      SELECT BATCH
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Timetable;
