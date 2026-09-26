'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { Leaf, Phone, Mail, HelpCircle, ShieldCheck } from 'lucide-react';

const footerTranslations = {
  en: {
    tagline: 'A state-level sustainability & waste management ideathon turning bold ideas into scalable, real-world circular solutions.',
    badge: 'National Green Innovation Initiative · 2026–27',
    helpTitle: 'Helpdesk & Helplines',
    helpSub: 'For registration, rules, or submission support:',
    h1Title: 'Helpdesk 1 · General & Registration',
    h2Title: 'Helpdesk 2 · Technical & Pitch Support',
    h3Title: 'Helpdesk 3 · Mentorship & Rounds Desk',
    emailTitle: 'Official Inquiries & Help Email',
    quickLinks: 'Quick Links',
    portals: 'Portals',
    about: '01. About & The Why',
    challenges: '02. Challenge Streams',
    timeline: '03. Milestone Timeline',
    faq: '04. Rubric & FAQs',
    register: '05. Register Team',
    leaderSignIn: 'Team Leader Sign In',
    participantWorkspace: 'Participant Workspace',
    judgeEval: 'Panelist Evaluation',
    adminConsole: 'Admin Console',
    copyright: '© 2026 ಹಸಿರು ಸಂವಾದ · Reimagine Waste Management Ideathon. All rights reserved.',
    slogan: 'CLEAN COMMUNITIES · HEALTHY PLANET · BRIGHTER FUTURE',
  },
  kn: {
    tagline: 'ಧೈರ್ಯಶಾಲಿ ಆಲೋಚನೆಗಳನ್ನು ಪ್ರಾಯೋಗಿಕ, ಸುಸ್ಥಿರ ತ್ಯಾಜ್ಯ ನಿರ್ವಹಣಾ ಪರಿಹಾರಗಳನ್ನಾಗಿ ಪರಿವರ್ತಿಸುವ ರಾಜ್ಯ ಮಟ್ಟದ ಐಡಿಯಾಥಾನ್.',
    badge: 'ರಾಷ್ಟ್ರೀಯ ಹಸಿರು ನಾವೀನ್ಯತಾ ಉಪಕ್ರಮ · ೨೦೨೬–೨೭',
    helpTitle: 'ಸಹಾಯವಾಣಿ ಮತ್ತು ಮಾಹಿತಿ',
    helpSub: 'ನೋಂದಣಿ, ನಿಯಮಗಳು ಅಥವಾ ಆಲೋಚನೆ ಸಲ್ಲಿಕೆ ಸಹಾಯಕ್ಕಾಗಿ:',
    h1Title: 'ಸಹಾಯವಾಣಿ ೧ · ಸಾಮಾನ್ಯ & ನೋಂದಣಿ ಮಾಹಿತಿ',
    h2Title: 'ಸಹಾಯವಾಣಿ ೨ · ತಾಂತ್ರಿಕ & ಸಲ್ಲಿಕೆ ಸಹಾಯ',
    h3Title: 'ಸಹಾಯವಾಣಿ ೩ · ಮಾರ್ಗದರ್ಶನ & ಹಂತಗಳ ಡೆಸ್ಕ್',
    emailTitle: 'ಅಧಿಕೃತ ವಿಚಾರಣೆ & ಸಹಾಯ ಇಮೇಲ್',
    quickLinks: 'ಮುಖ್ಯ ಲಿಂಕ್‌ಗಳು',
    portals: 'ಪೋರ್ಟಲ್‌ಗಳು',
    about: '೦೧. ವಿವರಣೆ & ಉದ್ದೇಶ',
    challenges: '೦೨. ಸವಾಲುಗಳ ಕ್ಷೇತ್ರ',
    timeline: '೦೩. ಪ್ರಮುಖ ದಿನಾಂಕಗಳು',
    faq: '೦೪. ನಿಯಮಾವಳಿ & ಪ್ರಶ್ನೋತ್ತರ',
    register: '೦೫. ತಂಡ ನೋಂದಣಿ',
    leaderSignIn: 'ತಂಡದ ಮುಖ್ಯಸ್ಥರ ಪ್ರವೇಶ',
    participantWorkspace: 'ಸ್ಪರ್ಧಾರ್ಥಿಗಳ ವೇದಿಕೆ',
    judgeEval: 'ತೀರ್ಪುಗಾರರ ಮೌಲ್ಯಮಾಪನ',
    adminConsole: 'ಆಡಳಿತ ಮಂಡಳಿ ಕನ್ಸೋಲ್',
    copyright: '© ೨೦೨೬ ಹಸಿರು ಸಂವಾದ · Reimagine Waste Management Ideathon. ಸರ್ವ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ.',
    slogan: 'ಸ್ವಚ್ಛ ಸಮುದಾಯ · ಆರೋಗ್ಯಕರ ಭೂಮಿ · ಉಜ್ವಲ ಭವಿಷ್ಯ',
  },
};

export default function Footer() {
  const { lang = 'en' } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const t = footerTranslations[lang] || footerTranslations.en;

  const handleNavClick = (sectionId) => {
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
    <footer className="site-footer">
      <div className="container footer-content-grid">
        {/* BRAND & MISSION */}
        <div className="footer-col brand-col">
          <Link href="/" className="brand footer-brand">
            <span className="brand-mark">
              <Leaf size={20} fill="currentColor" />
            </span>
            <span className="brand-name">
              ಹಸಿರು ಸಂವಾದ<span className="brand-dot">.</span>
            </span>
          </Link>
          <p className="footer-tagline">{t.tagline}</p>
          <div className="footer-meta-pill">
            <ShieldCheck size={16} /> {t.badge}
          </div>
        </div>

        {/* 3 SAMPLE HELPLINES / CONTACT NUMBERS */}
        <div className="footer-col helpline-col">
          <h4 className="footer-heading">
            <HelpCircle size={16} /> {t.helpTitle}
          </h4>
          <p className="helpline-subtext">{t.helpSub}</p>

          <div className="helpline-list">
            <a href="tel:+919880012345" className="helpline-card">
              <div className="helpline-icon">
                <Phone size={15} />
              </div>
              <div className="helpline-info">
                <span className="helpline-title">{t.h1Title}</span>
                <span className="helpline-num">+91 98800 12345</span>
              </div>
            </a>

            <a href="tel:+919880023456" className="helpline-card">
              <div className="helpline-icon">
                <Phone size={15} />
              </div>
              <div className="helpline-info">
                <span className="helpline-title">{t.h2Title}</span>
                <span className="helpline-num">+91 98800 23456</span>
              </div>
            </a>

            <a href="tel:+919880034567" className="helpline-card">
              <div className="helpline-icon">
                <Phone size={15} />
              </div>
              <div className="helpline-info">
                <span className="helpline-title">{t.h3Title}</span>
                <span className="helpline-num">+91 98800 34567</span>
              </div>
            </a>

            <a href="mailto:hasirusamvada@reimagine.org" className="helpline-card email-card">
              <div className="helpline-icon">
                <Mail size={15} />
              </div>
              <div className="helpline-info">
                <span className="helpline-title">{t.emailTitle}</span>
                <span className="helpline-num">hasirusamvada@reimagine.org</span>
              </div>
            </a>
          </div>
        </div>

        {/* QUICK NAVIGATION */}
        <div className="footer-col links-col">
          <h4 className="footer-heading">{t.quickLinks}</h4>
          <ul className="footer-nav-list">
            <li>
              <button type="button" onClick={() => handleNavClick('about')}>
                {t.about}
              </button>
            </li>
            <li>
              <button type="button" onClick={() => handleNavClick('challenges')}>
                {t.challenges}
              </button>
            </li>
            <li>
              <button type="button" onClick={() => handleNavClick('timeline')}>
                {t.timeline}
              </button>
            </li>
            <li>
              <button type="button" onClick={() => handleNavClick('faq')}>
                {t.faq}
              </button>
            </li>
            <li>
              <button type="button" onClick={() => handleNavClick('register')}>
                {t.register}
              </button>
            </li>
          </ul>

          <h4 className="footer-heading" style={{ marginTop: '20px' }}>
            {t.portals}
          </h4>
          <ul className="footer-nav-list">
            <li>
              <Link href="/login">{t.leaderSignIn}</Link>
            </li>
            <li>
              <Link href="/participant">{t.participantWorkspace}</Link>
            </li>
            <li>
              <Link href="/panelist">{t.judgeEval}</Link>
            </li>
            <li>
              <Link href="/admin">{t.adminConsole}</Link>
            </li>
          </ul>
        </div>
      </div>

      {/* FOOTER BOTTOM BAR */}
      <div className="footer-bottom-bar">
        <div className="container footer-bottom-flex">
          <span>{t.copyright}</span>
          <span className="slogan-badge">{t.slogan}</span>
        </div>
      </div>
    </footer>
  );
}
