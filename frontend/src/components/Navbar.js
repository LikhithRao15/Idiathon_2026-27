'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { Leaf, Menu, X, ArrowUpRight } from 'lucide-react';

const navTranslations = {
  en: {
    about: 'About',
    challenges: 'Challenges',
    timeline: 'Timeline',
    faq: 'Rules & FAQ',
    pitch: '🌱 My Pitch Workspace',
    judge: '⚖️ Judge Portal',
    admin: '👑 Admin Console',
    register: 'Register Team',
    signIn: 'Sign In',
    signOut: 'Sign Out',
  },
  kn: {
    about: 'ವಿವರಣೆ',
    challenges: 'ಸವಾಲುಗಳು',
    timeline: 'ಕಾಲಪಟ್ಟಿ',
    faq: 'ನಿಯಮಗಳು',
    pitch: '🌱 ಆಲೋಚನಾ ವೇದಿಕೆ',
    judge: '⚖️ ಮೌಲ್ಯಮಾಪನ',
    admin: '👑 ಆಡಳಿತ ಮಂಡಳಿ',
    register: 'ತಂಡ ನೋಂದಣಿ',
    signIn: 'ಪ್ರವೇಶಿಸಿ',
    signOut: 'ನಿರ್ಗಮಿಸಿ',
  },
};

export default function Navbar() {
  const { user, logout, lang = 'en', setLang } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const t = navTranslations[lang] || navTranslations.en;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (sectionId) => {
    setMenuOpen(false);
    if (pathname === '/') {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      router.push(`/#${sectionId}`);
    }
  };

  return (
    <header className={`nav-wrap ${isScrolled ? 'scrolled' : ''}`}>
      <nav className="nav container">
        <Link href="/" className="brand" onClick={() => setMenuOpen(false)}>
          <span className="brand-mark">
            <Leaf size={22} fill="currentColor" />
          </span>
          <span className="brand-name">
            ಹಸಿರು ಸಂವಾದ<span className="brand-dot">.</span>
          </span>
        </Link>

        {/* DESKTOP & MOBILE LINKS */}
        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <button
            type="button"
            className="nav-link-btn"
            onClick={() => handleNavClick('about')}
          >
            {t.about}
          </button>
          <button
            type="button"
            className="nav-link-btn"
            onClick={() => handleNavClick('challenges')}
          >
            {t.challenges}
          </button>
          <button
            type="button"
            className="nav-link-btn"
            onClick={() => handleNavClick('timeline')}
          >
            {t.timeline}
          </button>
          <button
            type="button"
            className="nav-link-btn"
            onClick={() => handleNavClick('faq')}
          >
            {t.faq}
          </button>

          {/* KANNADA / ENGLISH LANGUAGE SWITCH */}
          <div className="language-switch" style={{ margin: '0 4px' }}>
            <button
              type="button"
              className={lang === 'en' ? 'active' : ''}
              onClick={() => {
                if (setLang) setLang('en');
                setMenuOpen(false);
              }}
              title="Switch to English"
            >
              EN
            </button>
            <button
              type="button"
              className={lang === 'kn' ? 'active' : ''}
              onClick={() => {
                if (setLang) setLang('kn');
                setMenuOpen(false);
              }}
              title="ಕನ್ನಡಕ್ಕೆ ಬದಲಾಯಿಸಿ"
            >
              ಕ
            </button>
          </div>

          {/* USER ACTIONS & ROLE PORTALS */}
          {user ? (
            <>
              {user.role === 'participant' && (
                <button
                  type="button"
                  className="nav-cta"
                  onClick={() => handleNavClick('pitch')}
                  style={{ background: 'var(--green2)', color: '#ffffff' }}
                >
                  {t.pitch}
                </button>
              )}
              {user.role === 'panelist' && (
                <Link
                  href="/panelist"
                  className="nav-cta"
                  onClick={() => setMenuOpen(false)}
                  style={{ background: 'var(--ocean)', color: '#ffffff' }}
                >
                  {t.judge}
                </Link>
              )}
              {user.role === 'admin' && (
                <Link
                  href="/admin"
                  className="nav-cta"
                  onClick={() => setMenuOpen(false)}
                  style={{ background: '#7e3f12', color: '#ffffff' }}
                >
                  {t.admin}
                </Link>
              )}

              <button
                type="button"
                className="nav-cta"
                onClick={() => { logout(); setMenuOpen(false); }}
                style={{
                  background: 'rgba(12, 91, 53, 0.08)',
                  color: 'var(--ink)',
                  border: '1px solid rgba(12, 91, 53, 0.2)',
                  marginLeft: '4px',
                }}
              >
                {t.signOut} ({user.name ? user.name.split(' ')[0] : 'User'})
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className="nav-cta"
                onClick={() => handleNavClick('register')}
              >
                {t.register} <ArrowUpRight size={18} />
              </button>
              <Link
                href="/login"
                className="nav-cta"
                onClick={() => setMenuOpen(false)}
                style={{
                  background: 'var(--green-deep)',
                  color: '#ffffff',
                  marginLeft: '4px',
                  border: '1px solid rgba(183, 223, 57, 0.4)',
                }}
              >
                {t.signIn}
              </Link>
            </>
          )}
        </div>

        {/* MOBILE MENU TOGGLE BUTTON */}
        <button
          className="menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
        >
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </nav>
    </header>
  );
}
