'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';

const translations = {
  en: {
    title: 'Team Leader Sign In',
    subtitle: 'Access your team workspace, pitch submissions, and round progress',

    phone: 'Phone Number *',
    phonePlaceholder: 'e.g. 9876543210 (or email / admin ID)',

    password: 'Password *',
    passwordPlaceholder: '••••••••',

    signingIn: 'Signing In...',
    signIn: 'Sign In to Workspace →',

    notRegistered: "Haven't registered your team yet?",
    register: 'Register as Team Leader',
  },

  kn: {
    title: 'ತಂಡದ ನಾಯಕನಾಗಿ ಸೈನ್ ಇನ್ ಮಾಡಿ',
    subtitle: 'ನಿಮ್ಮ ತಂಡದ ಕಾರ್ಯಕ್ಷೇತ್ರ, ಪಿಚ್ ಸಲ್ಲಿಕೆಗಳು ಮತ್ತು ಸುತ್ತಿನ ಪ್ರಗತಿಯನ್ನು ಪ್ರವೇಶಿಸಿ',

    phone: 'ದೂರವಾಣಿ ಸಂಖ್ಯೆ *',
    phonePlaceholder: 'ಉದಾ. 9876543210 (ಅಥವಾ ಇಮೇಲ್/ಅಡ್ಮಿನ್ ಐಡಿ)',

    password: 'ಪಾಸ್ವರ್ಡ್ *',
    passwordPlaceholder: '••••••••',

    signingIn: 'ಸೈನ್ ಇನ್ ಮಾಡಲಾಗುತ್ತಿದೆ...',
    signIn: 'ಕಾರ್ಯಕ್ಷೇತ್ರಕ್ಕೆ ಸೈನ್ ಇನ್ ಮಾಡಿ →',

    notRegistered: 'ಇನ್ನೂ ನಿಮ್ಮ ತಂಡವನ್ನು ನೋಂದಾಯಿಸಿಲ್ಲವೇ?',
    register: 'ತಂಡದ ನಾಯಕನಾಗಿ ನೋಂದಾಯಿಸಿ',
  },
};

export default function LoginPage() {
  const { login, lang } = useAuth();
  const t = translations[lang] || translations.en;

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await login(phone, password);
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
            <label>{t.phone}</label>
            <input
              type="text"
              autoCapitalize="none"
              autoCorrect="off"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={t.phonePlaceholder}
              required
            />
          </div>

          <div className="form-group">
            <label>{t.password}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t.passwordPlaceholder}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-full mt-2" disabled={loading}>
            {loading ? t.signingIn : t.signIn}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-color)', fontSize: '13px', color: 'var(--text-muted)' }}>
          {t.notRegistered}{' '}
          <Link href="/register" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}>
            {t.register}
          </Link>
        </div>
      </div>
    </div>
  );
}
