'use client';

import {
  FileText,
  ExternalLink,
  Download,
  Leaf,
  Recycle,
  ShieldAlert,
  Flame,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export default function SolidWasteManagement({ lang = 'en' }) {
  const pdfUrl = '/solid-waste-management-rules-2026.pdf';

  const categories = [
    {
      id: 'wet',
      badgeEn: 'GREEN BIN',
      badgeKn: 'ಹಸಿರು ಡಬ್ಬಿ',
      color: '#10b981',
      glow: 'rgba(16, 185, 129, 0.4)',
      bgLight: 'rgba(16, 185, 129, 0.08)',
      icon: <Leaf size={16} />,
      titleEn: 'Wet Waste',
      titleKn: 'ಹಸಿ ತ್ಯಾಜ್ಯ',
      subEn: 'Biodegradable & Organic',
      subKn: 'ಜೈವಿಕ ವಿಘಟನೀಯ',
      image: '/swm/wet-waste.jpg',
      examplesEn: [
        'Fruit & vegetable peels',
        'Leftover cooked food & tea grounds',
        'Garden trimmings & fallen leaves',
        'Egg shells & food waste',
      ],
      examplesKn: [
        'ತರಕಾರಿ ಹಾಗೂ ಹಣ್ಣಿನ ಸಿಪ್ಪೆಗಳು',
        'ಉಳಿದ ಆಹಾರ, ಅನ್ನ ಹಾಗೂ ಟೀ ಪುಡಿ',
        'ತೋಟದ ಎಲೆಗಳು ಹಾಗೂ ಹೂವುಗಳು',
        'ಮೊಟ್ಟೆಯ ಸಿಪ್ಪೆ ಹಾಗೂ ಹಸಿ ಕಸ',
      ],
      disposalEn: 'Biomethanation & Composting',
      disposalKn: 'ಕಾಂಪೋಸ್ಟಿಂಗ್ & ಬಯೋಗ್ಯಾಸ್',
    },
    {
      id: 'dry',
      badgeEn: 'BLUE BIN',
      badgeKn: 'ನೀಲಿ ಡಬ್ಬಿ',
      color: '#3b82f6',
      glow: 'rgba(59, 130, 246, 0.4)',
      bgLight: 'rgba(59, 130, 246, 0.08)',
      icon: <Recycle size={16} />,
      titleEn: 'Dry Waste',
      titleKn: 'ಒಣ ತ್ಯಾಜ್ಯ',
      subEn: 'Recyclables & Packaging',
      subKn: 'ಮರುಬಳಕೆ ಯೋಗ್ಯ',
      image: '/swm/dry-waste.jpg',
      examplesEn: [
        'PET plastic bottles & containers',
        'Cardboard boxes & clean paper',
        'Aluminium beverage cans & foil',
        'Glass bottles & jars',
      ],
      examplesKn: [
        'ಪ್ಲಾಸ್ಟಿಕ್ ಬಾಟಲಿಗಳು ಮತ್ತು ಡಬ್ಬಿಗಳು',
        'ರಟ್ಟಿನ ಪೆಟ್ಟಿಗೆಗಳು ಮತ್ತು ಕಾಗದ',
        'ಅಲ್ಯೂಮಿನಿಯಂ ಕ್ಯಾನ್ ಮತ್ತು ಲೋಹ',
        'ಗಾಜಿನ ಬಾಟಲಿಗಳು ಮತ್ತು ಜಾರ್‌ಗಳು',
      ],
      disposalEn: 'Material Recovery Facility (MRF)',
      disposalKn: 'ಮರುಬಳಕೆ ಕೇಂದ್ರಗಳಿಗೆ (MRF)',
    },
    {
      id: 'sanitary',
      badgeEn: 'RED BIN / POUCH',
      badgeKn: 'ಕೆಂಪು ಪೊಟ್ಟಣ',
      color: '#ef4444',
      glow: 'rgba(239, 68, 68, 0.4)',
      bgLight: 'rgba(239, 68, 68, 0.08)',
      icon: <Flame size={16} />,
      titleEn: 'Sanitary Waste',
      titleKn: 'ಸ್ಯಾನಿಟರಿ ತ್ಯಾಜ್ಯ',
      subEn: 'Personal Hygiene & Bio-Waste',
      subKn: 'ವೈಯಕ್ತಿಕ ನೈರ್ಮಲ್ಯ',
      image: '/swm/sanitary-waste.jpg',
      examplesEn: [
        'Used baby diapers & wipes',
        'Sanitary napkins & pads',
        'Cotton swabs & bandages',
        'Disinfectant wipes & tissues',
      ],
      examplesKn: [
        'ಬಳಸಿದ ಡೈಪರ್‌ಗಳು',
        'ಸ್ಯಾನಿಟರಿ ಪ್ಯಾಡ್‌ಗಳು ಮತ್ತು ನ್ಯಾಪ್ಕಿನ್',
        'ಬ್ಯಾಂಡೇಜ್ ಮತ್ತು ಹತ್ತಿ ತುಂಡುಗಳು',
        'ಟಿಶ್ಯೂ ಪೇಪರ್‌ಗಳು',
      ],
      disposalEn: 'Secure Wrap · Thermal Incineration',
      disposalKn: 'ಕಾಗದದಲ್ಲಿ ಸುತ್ತಿ ಭಸ್ಮೀಕರಣ',
    },
    {
      id: 'hazardous',
      badgeEn: 'BLACK / HAZARD',
      badgeKn: 'ಅಪಾಯಕಾರಿ ಡಬ್ಬಿ',
      color: '#f59e0b',
      glow: 'rgba(245, 158, 11, 0.4)',
      bgLight: 'rgba(245, 158, 11, 0.08)',
      icon: <ShieldAlert size={16} />,
      titleEn: 'Domestic Hazardous',
      titleKn: 'ಗೃಹ ಅಪಾಯಕಾರಿ ತ್ಯಾಜ್ಯ',
      subEn: 'Special Care & Chemical Items',
      subKn: 'ವಿಶೇಷ ಕಾಳಜಿಯ ವಸ್ತುಗಳು',
      image: '/swm/hazardous-waste.jpg',
      examplesEn: [
        'Spent batteries & button cells',
        'CFL bulbs & fluorescent tubes',
        'Paint cans, thinners & solvents',
        'Expired medicines & syringes',
      ],
      examplesKn: [
        'ಬಳಸಿದ ಬ್ಯಾಟರಿಗಳು',
        'ಸಿಎಫ್‌ಎಲ್ ಬಲ್ಬ್‌ಗಳು ಮತ್ತು ಟ್ಯೂಬ್‌ಲೈಟ್',
        'ಬಣ್ಣದ ಡಬ್ಬಿಗಳು ಮತ್ತು ಕೀಟನಾಶಕ',
        'ಅವಧಿ ಮೀರಿದ ಔಷಧಿಗಳು ಮತ್ತು ಸಿರಿಂಜ್',
      ],
      disposalEn: 'Designated Deposition Centres',
      disposalKn: 'ವಿಶೇಷ ಠೇವಣಿ ಕೇಂದ್ರಗಳಿಗೆ',
    },
  ];

  const content = {
    en: {
      badge: 'GOVERNMENT OF INDIA NOTIFICATION · SOLID WASTE MANAGEMENT RULES',
      title: 'Solid Waste Management',
      titleHighlight: 'Regulatory Framework',
      subtitle:
        'Official statutory guidelines notified by the Ministry of Environment, Forest and Climate Change under the Environment (Protection) Act, 1986.',
      pdfCard: {
        tag: 'OFFICIAL GAZETTE',
        title: 'The Gazette of India: Extraordinary',
        sub: 'Notification S.O. 388(E) · New Delhi',
        desc: 'Comprehensive statutory gazette establishing nationwide guidelines and rules for waste segregation, bulk waste accountability, decentralized processing, and landfill remediation.',
        openBtn: 'Open Official Gazette (PDF)',
        downloadBtn: 'Download PDF',
      },
      categoriesHeader: {
        badge: 'MUNICIPAL SOLID WASTE (MSW) RULES',
        title: '4 Essential Categories of Solid Waste',
        subtitle: 'Official source-segregation streams with real-world examples and scientific disposal workflows',
        pauseHint: 'Hover over any card to pause animation and inspect details',
      },
    },
    kn: {
      badge: 'ಭಾರತ ಸರ್ಕಾರದ ಅಧಿಸೂಚನೆ · ಘನತ್ಯಾಜ್ಯ ನಿರ್ವಹಣೆ ನಿಯಮಾವಳಿ',
      title: 'ಘನತ್ಯಾಜ್ಯ ನಿರ್ವಹಣೆ',
      titleHighlight: 'ಶಾಸನಬದ್ಧ ಚೌಕಟ್ಟು',
      subtitle:
        'ಪರಿಸರ (ಸಂರಕ್ಷಣೆ) ಕಾಯ್ದೆ, 1986ರ ಅಡಿಯಲ್ಲಿ ಭಾರತ ಸರ್ಕಾರದ ಪರಿಸರ, ಅರಣ್ಯ ಮತ್ತು ಹವಾಮಾನ ಬದಲಾವಣೆ ಸಚಿವಾಲಯ ಹೊರಡಿಸಿದ ಅಧಿಕೃತ ನಿಯಮಾವಳಿಗಳು.',
      pdfCard: {
        tag: 'ಅಧಿಕೃತ ಗೆಜೆಟ್',
        title: 'ಭಾರತದ ಗೆಜೆಟ್: ಅಸಾಧಾರಣ ಅಧಿಸೂಚನೆ',
        sub: 'ಅಧಿಸೂಚನೆ ಸಂಖ್ಯೆ: ಕಾ.ಆ. 388(ಅ) · ಹೊಸ ದೆಹಲಿ',
        desc: 'ಮೂಲದಲ್ಲೇ ತ್ಯಾಜ್ಯ ವಿಂಗಡಣೆ, ಬೃಹತ್ ತ್ಯಾಜ್ಯ ಉತ್ಪಾದಕರ ಹೊಣೆಗಾರಿಕೆ, ವಿಕೇಂದ್ರೀಕೃತ ಸಂಸ್ಕರಣೆ ಮತ್ತು ವೈಜ್ಞಾನಿಕ ಲ್ಯಾಂಡ್‌ಫಿಲ್‌ಗಳ ಕುರಿತ ಸಂಪೂರ್ಣ ಶಾಸನಬದ್ಧ ಗೆಜೆಟ್ ದಾಖಲೆ.',
        openBtn: 'ಅಧಿಕೃತ ಗೆಜೆಟ್ ವೀಕ್ಷಿಸಿ (PDF)',
        downloadBtn: 'PDF ಡೌನ್‌ಲೋಡ್',
      },
      categoriesHeader: {
        badge: 'ಎಂಎಸ್‌ಡಬ್ಲ್ಯೂ ನಿಯಮಾವಳಿಗಳು',
        title: 'ಘನತ್ಯಾಜ್ಯದ ೪ ಪ್ರಮುಖ ವಿಭಾಗಗಳು',
        subtitle: 'ಮೂಲದಲ್ಲೇ ತ್ಯಾಜ್ಯ ವಿಂಗಡಣೆ, ಉದಾಹರಣೆಗಳು ಮತ್ತು ವೈಜ್ಞಾನಿಕ ವಿಲೇವಾರಿ ವಿಧಾನಗಳು',
        pauseHint: 'ವಿವರಗಳನ್ನು ವೀಕ್ಷಿಸಲು ಕಾರ್ಡ್ ಮೇಲೆ ಕರ್ಸರ್ ಇರಿಸಿ',
      },
    },
  };

  const t = content[lang] || content.en;

  // Duplicate categories to create a seamless infinite marquee loop
  const marqueeItems = [...categories, ...categories];

  return (
    <section
      className="swm-section snap-section"
      id="solid-waste-management"
      aria-label="Solid Waste Management Framework"
    >
      <div className="container">
        {/* SECTION HEADER */}
        <div className="swm-header">
          <div className="swm-badge-pill">
            <span className="swm-badge-dot" />
            <span>{t.badge}</span>
          </div>

          <h2 className="swm-title">
            {t.title} <span className="swm-title-highlight">{t.titleHighlight}</span>
          </h2>

          <p className="swm-subtitle">{t.subtitle}</p>
        </div>

        {/* HERO DOCUMENT SPOTLIGHT CARD */}
        <div className="swm-spotlight-card">
          <div className="swm-spotlight-left">
            <div className="swm-spotlight-tag">{t.pdfCard.tag}</div>
            <h3 className="swm-spotlight-heading">{t.pdfCard.title}</h3>
            <p className="swm-spotlight-sub">{t.pdfCard.sub}</p>
            <p className="swm-spotlight-desc">{t.pdfCard.desc}</p>

            <div className="swm-action-group">
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="swm-btn-primary"
                id="open-swm-pdf-btn"
              >
                <FileText size={18} />
                <span>{t.pdfCard.openBtn}</span>
                <ExternalLink size={16} className="btn-icon-end" />
              </a>

              <a
                href={pdfUrl}
                download="Solid_Waste_Management_Rules_2026.pdf"
                className="swm-btn-ghost"
                id="download-swm-pdf-btn"
                title="Download PDF"
              >
                <Download size={18} />
                <span>{t.pdfCard.downloadBtn}</span>
              </a>
            </div>
          </div>

          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="swm-spotlight-right"
            aria-label="Open Official Gazette PDF"
          >
            <div className="swm-pdf-thumb-wrapper">
              <img
                src="/solid-waste-gazette-cover.png"
                alt="The Gazette of India: Solid Waste Management Rules"
                className="swm-pdf-thumb-img"
              />
              <div className="swm-pdf-overlay">
                <div className="swm-pdf-overlay-content">
                  <ExternalLink size={26} />
                  <span>Open Official PDF</span>
                </div>
              </div>
            </div>
            <div className="swm-thumb-caption">
              <span>Gazette of India · S.O. 388(E)</span>
              <small>Click to open PDF</small>
            </div>
          </a>
        </div>

        {/* 4 CATEGORIES SECTION HEADER */}
        <div className="swm-categories-intro">
          <div className="swm-sub-badge">
            <Sparkles size={14} />
            <span>{t.categoriesHeader.badge}</span>
          </div>
          <h3 className="swm-categories-title">{t.categoriesHeader.title}</h3>
          <p className="swm-categories-subtitle">{t.categoriesHeader.subtitle}</p>
          <span className="swm-pause-hint">{t.categoriesHeader.pauseHint}</span>
        </div>
      </div>

      {/* 4 IN A ROW MOVING ANIMATION CAROUSEL / MARQUEE */}
      <div className="swm-marquee-viewport" tabIndex={0} aria-label="Animated 4 Solid Waste Categories Carousel">
        <div className="swm-marquee-track">
          {marqueeItems.map((cat, idx) => (
            <article
              key={`${cat.id}-${idx}`}
              className="swm-category-card"
              style={{
                '--cat-color': cat.color,
                '--cat-glow': cat.glow,
                '--cat-bg-light': cat.bgLight,
              }}
            >
              {/* PHOTOGRAPH */}
              <div className="swm-card-image-wrap">
                <img
                  src={cat.image}
                  alt={lang === 'kn' ? cat.titleKn : cat.titleEn}
                  className="swm-card-img"
                  loading="lazy"
                />
                <div className="swm-card-badge">
                  <span className="swm-card-badge-dot" />
                  <span>{lang === 'kn' ? cat.badgeKn : cat.badgeEn}</span>
                </div>
              </div>

              {/* CARD BODY */}
              <div className="swm-card-body">
                <div className="swm-card-title-row">
                  <div className="swm-card-icon-bubble">{cat.icon}</div>
                  <div>
                    <h4 className="swm-card-title">{lang === 'kn' ? cat.titleKn : cat.titleEn}</h4>
                    <span className="swm-card-subtitle">{lang === 'kn' ? cat.subKn : cat.subEn}</span>
                  </div>
                </div>

                {/* EXAMPLES LIST */}
                <div className="swm-examples-box">
                  <span className="swm-examples-label">
                    {lang === 'kn' ? 'ಉದಾಹರಣೆಗಳು:' : 'Common Examples:'}
                  </span>
                  <ul className="swm-examples-list">
                    {(lang === 'kn' ? cat.examplesKn : cat.examplesEn).map((ex, i) => (
                      <li key={i}>
                        <CheckCircle2 size={13} className="swm-check-bullet" />
                        <span>{ex}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* DISPOSAL METHOD */}
                <div className="swm-disposal-footer">
                  <span className="swm-disposal-tag">
                    {lang === 'kn' ? 'ವಿಲೇವಾರಿ ವಿಧಾನ:' : 'Scientific Disposal:'}
                  </span>
                  <span className="swm-disposal-value">
                    {lang === 'kn' ? cat.disposalKn : cat.disposalEn}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
