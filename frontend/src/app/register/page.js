'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';

const translations = {
  en: {
    title: 'Register as Team Leader',
    subtitle: 'Only one team leader creates the account and submits the pitch',

    ruleTitle: 'Participant Leader Rule:',
    ruleText:
      'Only the designated team leader registers an account. You will add your teammates during team creation. Emails listed as team members cannot register separate leader accounts.',

    leaderName: 'Leader Full Name *',
    leaderNamePlaceholder: 'e.g. Maya Shankar',

    email: 'Email Address *',
    emailPlaceholder: 'maya@example.com',

    phone: 'Phone Number *',
    phonePlaceholder: '+919876500000',

    city: 'City *',
    cityPlaceholder: 'e.g. Mangalore',

    password: 'Account Password *',

    creatingAccount: 'Creating Account...',
    register: 'Register & Start Idea Pitch →',

    alreadyRegistered: 'Already registered?',
    signIn: 'Sign In to Existing Team',
  },

  kn: {
    title: 'ತಂಡದ ನಾಯಕನಾಗಿ ನೋಂದಾಯಿಸಿ',
    subtitle: 'ಒಬ್ಬ ತಂಡದ ನಾಯಕ ಮಾತ್ರ ಖಾತೆಯನ್ನು ರಚಿಸಿ ಪಿಚ್ ಸಲ್ಲಿಸಬೇಕು',

    ruleTitle: 'ಭಾಗವಹಿಸುವ ತಂಡದ ನಾಯಕನ ನಿಯಮ:',
    ruleText:
      'ನಿಗದಿತ ತಂಡದ ನಾಯಕ ಮಾತ್ರ ಖಾತೆಯನ್ನು ನೋಂದಾಯಿಸಬೇಕು. ತಂಡ ರಚಿಸುವಾಗ ನಿಮ್ಮ ತಂಡದ ಸದಸ್ಯರನ್ನು ಸೇರಿಸಬಹುದು. ತಂಡದ ಸದಸ್ಯರಾಗಿ ನಮೂದಿಸಿರುವ ಇಮೇಲ್ಗಳು ಪ್ರತ್ಯೇಕ ನಾಯಕ ಖಾತೆಯನ್ನು ನೋಂದಾಯಿಸಲು ಸಾಧ್ಯವಿಲ್ಲ.',

    leaderName: 'ತಂಡದ ನಾಯಕನ ಪೂರ್ಣ ಹೆಸರು *',
    leaderNamePlaceholder: 'ಉದಾ. ಮಾಯಾ ಶಂಕರ್',

    email: 'ಇಮೇಲ್ ವಿಳಾಸ *',
    emailPlaceholder: 'maya@example.com',

    phone: 'ದೂರವಾಣಿ ಸಂಖ್ಯೆ *',
    phonePlaceholder: '+919876500000',

    city: 'ನಗರ *',
    cityPlaceholder: 'ಉದಾ. ಮಂಗಳೂರು',

    password: 'ಖಾತೆಯ ಪಾಸ್ವರ್ಡ್ *',

    creatingAccount: 'ಖಾತೆಯನ್ನು ರಚಿಸಲಾಗುತ್ತಿದೆ...',
    register: 'ನೋಂದಾಯಿಸಿ ಮತ್ತು ಐಡಿಯಾ ಪಿಚ್ ಪ್ರಾರಂಭಿಸಿ →',

    alreadyRegistered: 'ಈಗಾಗಲೇ ನೋಂದಾಯಿಸಿದ್ದೀರಾ?',
    signIn: 'ಅಸ್ತಿತ್ವದಲ್ಲಿರುವ ತಂಡಕ್ಕೆ ಸೈನ್ ಇನ್ ಮಾಡಿ',
  },
};

export default function RegisterPage() {
  const { registerParticipant, lang } = useAuth();
  const t = translations[lang] || translations.en;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
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
            {t.title}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '4px' }}>
            {t.subtitle}
          </p>
        </div>

        <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46', padding: '10px 14px', borderRadius: 'var(--radius-sm)', fontSize: '12px', marginBottom: '20px', lineHeight: 1.4 }}>
          💡 <strong>{t.ruleTitle}</strong> {t.ruleText}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{t.leaderName}</label>
            <input
              type="text"
              placeholder={t.leaderNamePlaceholder}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>{t.email}</label>
            <input
              type="email"
              placeholder={t.emailPlaceholder}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>{t.phone}</label>
            <input
              type="tel"
              placeholder={t.phonePlaceholder}
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>{t.city}</label>
            <input
              type="text"
              placeholder={t.cityPlaceholder}
              value={formData.city}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  city: e.target.value,
                })
              }
              required
            />
          </div>

          <div className="form-group">
            <label>{t.password}</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-full mt-2" disabled={loading}>
            {loading ? t.creatingAccount : t.register}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: 'var(--text-muted)' }}>
          {t.alreadyRegistered}{' '}
          <Link href="/login" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}>
            {t.signIn}
          </Link>
        </div>
      </div>
    </div>
  );
}
