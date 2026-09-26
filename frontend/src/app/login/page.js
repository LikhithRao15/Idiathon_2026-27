'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';

const loginTranslations = {
  en: {
    title: 'Team Leader Sign In',
    subtitle: 'Access your team workspace, pitch submissions, and round progress',
    emailLabel: 'Leader Email Address *',
    emailPh: 'e.g. leader@domain.com',
    passLabel: 'Password *',
    passPh: '••••••••',
    submitBtn: 'Sign In to Workspace →',
    submitting: 'Signing In...',
    noAccount: "Haven't registered your team yet?",
    regLink: 'Register as Team Leader',
  },
  kn: {
    title: 'ತಂಡದ ಮುಖ್ಯಸ್ಥರ ಲಾಗಿನ್',
    subtitle: 'ನಿಮ್ಮ ತಂಡದ ವೇದಿಕೆ, ಆಲೋಚನಾ ಸಲ್ಲಿಕೆ ಮತ್ತು ಹಂತಗಳ ಪ್ರಗತಿಯನ್ನು ಪ್ರವೇಶಿಸಿ',
    emailLabel: 'ಮುಖ್ಯಸ್ಥರ ಇಮೇಲ್ ವಿಳಾಸ *',
    emailPh: 'ಉದಾ: leader@domain.com',
    passLabel: 'ಪಾಸ್‌ವರ್ಡ್ *',
    passPh: '••••••••',
    submitBtn: 'ವೇದಿಕೆಗೆ ಪ್ರವೇಶಿಸಿ →',
    submitting: 'ಪ್ರವೇಶಿಸಲಾಗುತ್ತಿದೆ...',
    noAccount: 'ಇನ್ನೂ ನಿಮ್ಮ ತಂಡವನ್ನು ನೋಂದಾಯಿಸಿಲ್ಲವೇ?',
    regLink: 'ತಂಡದ ನಾಯಕರಾಗಿ ನೋಂದಾಯಿಸಿ',
  },
};

export default function LoginPage() {
  const { login, lang = 'en' } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const t = loginTranslations[lang] || loginTranslations.en;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await login(email, password);
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: '440px', margin: '60px auto', padding: '0 20px' }}>
      <div className="light-card" style={{ padding: '36px 32px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '36px', marginBottom: '8px' }}>🌱</div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', fontWeight: 800 }}>
            {t.title}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '4px' }}>
            {t.subtitle}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{t.emailLabel}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.emailPh}
              required
            />
          </div>

          <div className="form-group">
            <label>{t.passLabel}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t.passPh}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-full mt-2" disabled={loading}>
            {loading ? t.submitting : t.submitBtn}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-color)', fontSize: '13px', color: 'var(--text-muted)' }}>
          {t.noAccount}{' '}
          <Link href="/register" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}>
            {t.regLink}
          </Link>
        </div>
      </div>
    </div>
  );
}
