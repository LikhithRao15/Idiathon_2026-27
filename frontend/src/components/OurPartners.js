'use client';
import { useState, useEffect } from 'react';

/**
 * ═════════════════════════════════════════════════════════════════════
 * 🤝 OUR PARTNERS — OFFICIAL 5 PARTNERS
 * ═════════════════════════════════════════════════════════════════════
 */
export const PARTNERS_LIST = [
  {
    id: 'p1',
    name: 'STRECON',
    nameKn: 'ಸ್ಟ್ರೆಕಾನ್',
    color: '#0c5b35',
    accentGlow: 'rgba(12, 91, 53, 0.35)',
    logo: '/partners/strecon.png',
  },
  {
    id: 'p2',
    name: 'Stellium',
    nameKn: 'ಸ್ಟೆಲ್ಲಿಯಂ',
    color: '#0b5378',
    accentGlow: 'rgba(11, 83, 120, 0.35)',
    logo: '/partners/stellium.png',
  },
  {
    id: 'p3',
    name: 'TiE Global',
    nameKn: 'ಟಿಐಇ ಗ್ಲೋಬಲ್',
    color: '#c5221f',
    accentGlow: 'rgba(197, 34, 31, 0.35)',
    logo: '/partners/tie-global.png',
  },
  {
    id: 'p4',
    name: 'Aapaavani',
    nameKn: 'ಆಪಾವನಿ',
    color: '#1a1a1a',
    accentGlow: 'rgba(26, 26, 26, 0.3)',
    logo: '/partners/aapaavani.png',
  },
  {
    id: 'p5',
    name: 'Kakunje Software',
    nameKn: 'ಕಾಕುಂಜೆ ಸಾಫ್ಟ್‌ವೇರ್',
    color: '#c92a2a',
    accentGlow: 'rgba(201, 42, 42, 0.35)',
    logo: '/partners/kakunje.png',
  },
];

export default function OurPartners({ lang = 'en' }) {
  const [activePartnerId, setActivePartnerId] = useState('p1');
  const [isHovered, setIsHovered] = useState(false);

  // Split into Column 1 (3 items) and Column 2 (2 items) for honey bee nest interlocking grid
  const col1Partners = [PARTNERS_LIST[0], PARTNERS_LIST[2], PARTNERS_LIST[4]];
  const col2Partners = [PARTNERS_LIST[1], PARTNERS_LIST[3]];

  // Smooth automatic pulse through the honeycomb nest
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setActivePartnerId((prevId) => {
        const currentIdx = PARTNERS_LIST.findIndex((p) => p.id === prevId);
        const nextIdx = (currentIdx + 1) % PARTNERS_LIST.length;
        return PARTNERS_LIST[nextIdx].id;
      });
    }, 3200);
    return () => clearInterval(interval);
  }, [isHovered]);

  return (
    <section className="partners-honeycomb-section" id="partners" aria-label="Our Partners">
      {/* SVG DEFINITION FOR SMOOTH ROUNDED HONEYCOMB / HEXAGON NEST CELL */}
      <svg width="0" height="0" className="honeycomb-svg-defs" aria-hidden="true">
        <defs>
          <clipPath id="honeycomb-clip" clipPathUnits="objectBoundingBox">
            <path d="M 0.50 0.02 C 0.58 0.02, 0.92 0.22, 0.97 0.32 C 1.02 0.42, 0.92 0.82, 0.84 0.94 C 0.76 1.00, 0.24 1.00, 0.16 0.94 C 0.08 0.82, -0.02 0.42, 0.03 0.32 C 0.08 0.22, 0.42 0.02, 0.50 0.02 Z" />
          </clipPath>
        </defs>
      </svg>

      <div className="container partners-honeycomb-container">
        {/* LEFT SIDE: ONLY "Our partners" HEADING */}
        <div className="partners-honeycomb-left">
          <h2 className="partners-hero-title">
            {lang === 'en' ? 'Our partners' : 'ನಮ್ಮ ಪಾಲುದಾರರು'}
          </h2>
        </div>

        {/* RIGHT SIDE: 5-CELL HONEY BEE NEST / HONEYCOMB GRID */}
        <div 
          className="partners-honeycomb-right"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* COLUMN 1: 3 Cells (STRECON, TiE Global, Kakunje Software) */}
          <div className="honeycomb-col col-1">
            {col1Partners.map((partner) => {
              const isActive = activePartnerId === partner.id;

              return (
                <div
                  key={partner.id}
                  className={`honeycomb-cell-wrapper ${isActive ? 'is-active' : ''}`}
                  style={{
                    '--cell-color': partner.color,
                    '--cell-glow': partner.accentGlow,
                  }}
                  onMouseEnter={() => setActivePartnerId(partner.id)}
                >
                  <div className="honeycomb-cell">
                    {/* Background Radial Glow */}
                    <div className="cell-bg-glow" />
                    
                    {/* Logo Image */}
                    <div className="cell-content">
                      <div className="cell-logo-frame">
                        <img
                          src={partner.logo}
                          alt={partner.name}
                          className="cell-logo-png"
                          loading="lazy"
                        />
                      </div>
                    </div>

                    {/* Light Shimmer Effect */}
                    <div className="cell-shimmer" aria-hidden="true" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* COLUMN 2: 2 Cells (Stellium, Aapaavani - Interlocking in the vertical gaps) */}
          <div className="honeycomb-col col-2">
            {col2Partners.map((partner) => {
              const isActive = activePartnerId === partner.id;

              return (
                <div
                  key={partner.id}
                  className={`honeycomb-cell-wrapper ${isActive ? 'is-active' : ''}`}
                  style={{
                    '--cell-color': partner.color,
                    '--cell-glow': partner.accentGlow,
                  }}
                  onMouseEnter={() => setActivePartnerId(partner.id)}
                >
                  <div className="honeycomb-cell">
                    {/* Background Radial Glow */}
                    <div className="cell-bg-glow" />
                    
                    {/* Logo Image */}
                    <div className="cell-content">
                      <div className="cell-logo-frame">
                        <img
                          src={partner.logo}
                          alt={partner.name}
                          className="cell-logo-png"
                          loading="lazy"
                        />
                      </div>
                    </div>

                    {/* Light Shimmer Effect */}
                    <div className="cell-shimmer" aria-hidden="true" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
