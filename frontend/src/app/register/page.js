'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';

const registerTranslations = {
  en: {
    title: 'Register as Team Leader',
    subtitle: 'Only one team leader creates the account and submits the pitch',
    ruleTitle: 'Participant Leader Rule:',
    ruleText: 'Only the designated team leader registers an account. You will add your teammates during team creation. Emails listed as team members cannot register separate leader accounts.',
    nameLabel: 'Leader Full Name *',
    namePh: 'e.g. Maya Shankar',
    emailLabel: 'Email Address *',
    emailPh: 'maya@example.com',
    phoneLabel: 'Phone Number *',
    phonePh: '+91 98765 00000',
    passLabel: 'Account Password *',
    passPh: '••••••••',
    submitBtn: 'Register & Start Idea Pitch →',
    submitting: 'Creating Account...',
    alreadyReg: 'Already registered?',
    signInLink: 'Sign In to Existing Team',
  },
  kn: {
    title: 'ತಂಡದ ನಾಯಕರಾಗಿ ನೋಂದಾಯಿಸಿ',
    subtitle: 'ತಂಡದ ಒಬ್ಬ ಮುಖ್ಯಸ್ಥರು ಮಾತ್ರ ಖಾತೆ ರಚಿಸಿ ಆಲೋಚನೆಯನ್ನು ಸಲ್ಲಿಸುತ್ತಾರೆ',
    ruleTitle: 'ಮುಖ್ಯಸ್ಥರ ನೋಂದಣಿ ನಿಯಮ:',
    ruleText: 'ತಂಡದ ಒಬ್ಬ ನಾಯಕರು ಮಾತ್ರ ನೋಂದಾಯಿಸಿಕೊಳ್ಳಬೇಕು. ತಂಡದ ಇತರ ಸದಸ್ಯರನ್ನು ನಂತರ ಸೇರಿಸಬಹುದು. ಸದಸ್ಯರಾಗಿರುವವರು ಪ್ರತ್ಯೇಕ ನಾಯಕರ ಖಾತೆ ರಚಿಸಲು ಸಾಧ್ಯವಿಲ್ಲ.',
    nameLabel: 'ನಾಯಕರ ಪೂರ್ಣ ಹೆಸರು *',
    namePh: 'ಉದಾ: ಮಾಯಾ ಶಂಕರ್',
    emailLabel: 'ಇಮೇಲ್ ವಿಳಾಸ *',
    emailPh: 'maya@example.com',
    phoneLabel: 'ಫೋನ್ ಸಂಖ್ಯೆ *',
    phonePh: '+91 98765 00000',
    passLabel: 'ಪಾಸ್‌ವರ್ಡ್ ರಚಿಸಿ *',
    passPh: '••••••••',
    submitBtn: 'ನೋಂದಾಯಿಸಿ & ಆಲೋಚನೆ ಆರಂಭಿಸಿ →',
    submitting: 'ಖಾತೆ ರಚಿಸಲಾಗುತ್ತಿದೆ...',
    alreadyReg: 'ಈಗಾಗಲೇ ನೋಂದಾಯಿಸಲಾಗಿದೆಯೇ?',
    signInLink: 'ಪ್ರಸ್ತುತ ತಂಡಕ್ಕೆ ಪ್ರವೇಶಿಸಿ',
  },
};

export default function RegisterPage() {
  const { registerParticipant, lang = 'en' } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const t = registerTranslations[lang] || registerTranslations.en;

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
            <label>{t.nameLabel}</label>
            <input
              type="text"
              placeholder={t.namePh}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>{t.emailLabel}</label>
            <input
              type="email"
              placeholder={t.emailPh}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>{t.phoneLabel}</label>
            <input
              type="tel"
              placeholder={t.phonePh}
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>{t.passLabel}</label>
            <input
              type="password"
              placeholder={t.passPh}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-full mt-2" disabled={loading}>
            {loading ? t.submitting : t.submitBtn}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: 'var(--text-muted)' }}>
          {t.alreadyReg}{' '}
          <Link href="/login" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}>
            {t.signInLink}
          </Link>
        </div>
      </div>
    </div>
  );
}
