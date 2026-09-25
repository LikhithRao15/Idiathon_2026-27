'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Leaf, Phone, Mail, HelpCircle, ShieldCheck } from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();
  const router = useRouter();

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
          <p className="footer-tagline">
            A state-level sustainability & waste management ideathon turning bold ideas into scalable, real-world circular solutions.
          </p>
          <div className="footer-meta-pill">
            <ShieldCheck size={16} /> National Green Innovation Initiative · 2026–27
          </div>
        </div>

        {/* 3 SAMPLE HELPLINES / CONTACT NUMBERS */}
        <div className="footer-col helpline-col">
          <h4 className="footer-heading">
            <HelpCircle size={16} /> Helpdesk & Helplines
          </h4>
          <p className="helpline-subtext">For registration, rules, or submission support:</p>
          
          <div className="helpline-list">
            <a href="tel:+919880012345" className="helpline-card">
              <div className="helpline-icon">
                <Phone size={15} />
              </div>
              <div className="helpline-info">
                <span className="helpline-title">Helpdesk 1 · General & Registration</span>
                <span className="helpline-num">+91 98800 12345</span>
              </div>
            </a>

            <a href="tel:+919880023456" className="helpline-card">
              <div className="helpline-icon">
                <Phone size={15} />
              </div>
              <div className="helpline-info">
                <span className="helpline-title">Helpdesk 2 · Technical & Pitch Support</span>
                <span className="helpline-num">+91 98800 23456</span>
              </div>
            </a>

            <a href="tel:+919880034567" className="helpline-card">
              <div className="helpline-icon">
                <Phone size={15} />
              </div>
              <div className="helpline-info">
                <span className="helpline-title">Helpdesk 3 · Mentorship & Rounds Desk</span>
                <span className="helpline-num">+91 98800 34567</span>
              </div>
            </a>

            <a href="mailto:hasirusamvada@reimagine.org" className="helpline-card email-card">
              <div className="helpline-icon">
                <Mail size={15} />
              </div>
              <div className="helpline-info">
                <span className="helpline-title">Official Inquiries & Help Email</span>
                <span className="helpline-num">hasirusamvada@reimagine.org</span>
              </div>
            </a>
          </div>
        </div>

        {/* QUICK NAVIGATION */}
        <div className="footer-col links-col">
          <h4 className="footer-heading">Quick Links</h4>
          <ul className="footer-nav-list">
            <li>
              <button type="button" onClick={() => handleNavClick('about')}>
                01. About & The Why
              </button>
            </li>
            <li>
              <button type="button" onClick={() => handleNavClick('challenges')}>
                02. Challenge Streams
              </button>
            </li>
            <li>
              <button type="button" onClick={() => handleNavClick('timeline')}>
                03. Milestone Timeline
              </button>
            </li>
            <li>
              <button type="button" onClick={() => handleNavClick('faq')}>
                04. Rubric & FAQs
              </button>
            </li>
            <li>
              <button type="button" onClick={() => handleNavClick('register')}>
                05. Register Team
              </button>
            </li>
          </ul>

          <h4 className="footer-heading" style={{ marginTop: '20px' }}>Portals</h4>
          <ul className="footer-nav-list">
            <li>
              <Link href="/login">Team Leader Sign In</Link>
            </li>
            <li>
              <Link href="/participant">Participant Workspace</Link>
            </li>
            <li>
              <Link href="/panelist">Panelist Evaluation</Link>
            </li>
            <li>
              <Link href="/admin">Admin Console</Link>
            </li>
          </ul>
        </div>
      </div>

      {/* FOOTER BOTTOM BAR */}
      <div className="footer-bottom-bar">
        <div className="container footer-bottom-flex">
          <span>© 2026 ಹಸಿರು ಸಂವಾದ · Reimagine Waste Management Ideathon. All rights reserved.</span>
          <span className="slogan-badge">CLEAN COMMUNITIES · HEALTHY PLANET · BRIGHTER FUTURE</span>
        </div>
      </div>
    </footer>
  );
}
