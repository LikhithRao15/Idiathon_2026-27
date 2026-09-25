'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';

export default function RegisterPage() {
  const { registerParticipant } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await registerParticipant(formData);
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: '480px', margin: '60px auto', padding: '0 20px' }}>
      <div className="light-card" style={{ padding: '36px 32px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>🌱</div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', fontWeight: 800 }}>
            Register as Team Leader
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '4px' }}>
            Only one team leader creates the account and submits the pitch
          </p>
        </div>

        <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46', padding: '10px 14px', borderRadius: 'var(--radius-sm)', fontSize: '12px', marginBottom: '20px', lineHeight: 1.4 }}>
          💡 <strong>Participant Leader Rule:</strong> Only the designated team leader registers an account. You will add your teammates during team creation. Emails listed as team members cannot register separate leader accounts.
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Leader Full Name *</label>
            <input
              type="text"
              placeholder="e.g. Maya Shankar"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Email Address *</label>
            <input
              type="email"
              placeholder="maya@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Phone Number *</label>
            <input
              type="tel"
              placeholder="+919876500000"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Account Password *</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-full mt-2" disabled={loading}>
            {loading ? 'Creating Account...' : 'Register & Start Idea Pitch →'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: 'var(--text-muted)' }}>
          Already registered?{' '}
          <Link href="/login" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}>
            Sign In to Existing Team
          </Link>
        </div>
      </div>
    </div>
  );
}
