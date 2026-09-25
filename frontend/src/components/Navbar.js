'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { Leaf, Menu, X, ArrowUpRight } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

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
            About
          </button>
          <button
            type="button"
            className="nav-link-btn"
            onClick={() => handleNavClick('challenges')}
          >
            Challenges
          </button>
          <button
            type="button"
            className="nav-link-btn"
            onClick={() => handleNavClick('timeline')}
          >
            Timeline
          </button>
          <button
            type="button"
            className="nav-link-btn"
            onClick={() => handleNavClick('faq')}
          >
            Rules & FAQ
          </button>

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
                  🌱 My Pitch Workspace
                </button>
              )}
              {user.role === 'panelist' && (
                <Link
                  href="/panelist"
                  className="nav-cta"
                  onClick={() => setMenuOpen(false)}
                  style={{ background: 'var(--ocean)', color: '#ffffff' }}
                >
                  ⚖️ Judge Portal
                </Link>
              )}
              {user.role === 'admin' && (
                <Link
                  href="/admin"
                  className="nav-cta"
                  onClick={() => setMenuOpen(false)}
                  style={{ background: '#7e3f12', color: '#ffffff' }}
                >
                  👑 Admin Console
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
                Sign Out ({user.name ? user.name.split(' ')[0] : 'User'})
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className="nav-cta"
                onClick={() => handleNavClick('register')}
              >
                Register Team <ArrowUpRight size={18} />
              </button>
              <Link
                href="/login"
                className="nav-cta"
                onClick={() => setMenuOpen(false)}
                style={{
                  background: 'var(--green-deep)',
                  color: '#ffffff',
                  marginLeft: '8px',
                  border: '1px solid rgba(183, 223, 57, 0.4)',
                }}
              >
                Sign In
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
