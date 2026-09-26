'use client';
import { Fragment, useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import IdeaPitchSection from '../components/IdeaPitchSection';
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  FileText,
  Globe,
  HelpCircle,
  Layers,
  Leaf,
  Lightbulb,
  Mail,
  Menu,
  MessageCircle,
  Phone,
  QrCode,
  Recycle,
  Sparkles,
  Trophy,
  Users,
  X,
  Zap,
} from 'lucide-react';
import './globals.css';

const data = {
  en: {
    nav: ['About', 'Challenges', 'Timeline', 'FAQ', 'Register'],
    eye: 'IDEATHON 2026 · OPEN FOR IDEAS',
    end: 'Shape Tomorrow.',
    lead: 'A sustainability ideathon for bold minds ready to turn waste-management challenges into smart, practical interventions.',
    reg: 'Register your team',
    explore: 'Explore challenges',
    posterBtn: 'View Event Poster',
    stats: ['members / team', 'age limit', 'key milestones'],
    about: {
      kicker: '01 — THE WHY',
      title: (
        <>
          Small ideas.
          <br />
          <span>Big impact.</span>
        </>
      ),
      p1: 'Waste is not just something we throw away. It is a design problem, a systems problem and an opportunity to think differently.',
      p2: (
        <>
          <b>ಹಸಿರು ಸಂವಾದ (Hasiru Samvada)</b> brings together students, creators, problem-solvers and communities to develop smart interventions that make waste management cleaner, circular and more sustainable.
        </>
      ),
      mottoTitle: 'Make a change today — because a cleaner planet starts with you!',
      mottoSub: 'SMART INTERVENTION · INNOVATIONS FOR A SUSTAINABLE TOMORROW',
      pillars: [
        ['Systems Design', 'Rethink source reduction & material recovery'],
        ['Community Action', 'Behaviour change & citizen participation'],
        ['Smart Monitoring', 'Data, tracking & efficient collection workflows'],
        ['Circular Value', 'Turn discarded streams into reusable resources'],
      ],
      bento: [
        {
          badge: 'FROM LINEAR TO CIRCULAR',
          title: 'Move from Bin to Value',
          desc: 'Replace traditional collect-and-dump pipelines with decentralized sorting, upcycling, and resource recovery loops.',
          metric: '5R Framework',
        },
        {
          badge: '3 TRACKS · 13 STREAMS',
          title: 'Real-World Urban & Rural Streams',
          desc: 'Tackle overlooked waste streams from C&D debris and fast-fashion textiles to tourist zones and subsurface water.',
          metric: '100% Practical',
        },
        {
          badge: 'OPEN TO ALL MINDS',
          title: 'Inclusive & Multidisciplinary',
          desc: 'No age barrier. Bring engineers, designers, policy thinkers, students, or local changemakers in teams of 2–4.',
          metric: '2–4 Per Team',
        },
      ],
    },
    challenge: {
      kicker: '02 — IDEAS IN FOCUS',
      title: (
        <>
          Choose a problem.
          <br />
          <span>Challenge the ordinary.</span>
        </>
      ),
      sub: 'Three color-coded focus areas from the ideathon charter. Select a track and click any sub-topic to explore the intervention prompt.',
      promptLabel: 'SUB-TOPIC INTERVENTION PROMPT',
      cta: 'Build an idea in this space',
    },
    challenges: [
      {
        theme: 'emerald',
        title: 'Waste Management',
        desc: 'Rethink how sanitary, construction, cloth and plastic waste is reduced, sorted and recovered at the source.',
        icon: Recycle,
        subtopics: [
          {
            name: 'Sanitary Waste',
            prompt: 'Design safe, dignified, low-cost collection, sterilization, or biodegradable alternatives for household & institutional sanitary waste.',
          },
          {
            name: 'C&D Waste',
            prompt: 'Create models to crush, sort, and repurpose Construction & Demolition concrete, brick, and tile rubble into green building materials.',
          },
          {
            name: 'Cloth Waste',
            prompt: 'Build circular textile recovery loops—upcycling post-consumer garments, tailoring scraps, and fast-fashion waste into insulation, yarn, or utility products.',
          },
          {
            name: 'Plastic Waste',
            prompt: 'Target single-use, multi-layered, or micro-plastic packaging with smart collection incentives, material alternatives, or modular recycling.',
          },
        ],
      },
      {
        theme: 'ocean',
        title: 'Handling Waste',
        desc: 'Design smarter systems for segregation, collection, real-time monitoring and mixed-waste handling across neighbourhoods.',
        icon: Zap,
        subtopics: [
          {
            name: 'Segregation',
            prompt: 'Eliminate cross-contamination at household and commercial bins using intuitive design, low-cost sensors, or behavioural nudges.',
          },
          {
            name: 'Monitoring',
            prompt: 'Track bin fill-levels, illegal dumping hotspots, and collection vehicle routes with lightweight digital tools or community reporting.',
          },
          {
            name: 'Mixed Waste',
            prompt: 'Develop mechanical, biological, or decentralized sorting workflows to separate already-mixed wet, dry, and hazardous domestic waste.',
          },
          {
            name: 'Collection',
            prompt: 'Optimize last-mile collection ergonomics, Pourakarmika safety, and micro-routing for congested streets, markets, or apartment clusters.',
          },
          {
            name: '5R’s',
            prompt: 'Embed Refuse, Reduce, Reuse, Repurpose, and Recycle directly into campuses, markets, events, and residential communities.',
          },
        ],
      },
      {
        theme: 'amber',
        title: 'Waste Disposal',
        desc: 'Find safer, cleaner approaches for eco-sensitive tourist waste, water-body pollution and subsurface disposal.',
        icon: Leaf,
        subtopics: [
          {
            name: 'Tourist Waste',
            prompt: 'Protect hills, beaches, heritage sites, and trails with zero-litter deposit systems, portable compaction, and tourist-led carry-back models.',
          },
          {
            name: 'Subsurface Waste',
            prompt: 'Prevent leachate contamination, soil toxicity, and underground dumping through bio-remediation, liners, and safe landfill alternatives.',
          },
          {
            name: 'Waste in Water',
            prompt: 'Intercept floating plastics, chemical runoff, and sewage debris in lakes, storm drains, and rivers before they harm aquatic ecosystems.',
          },
          {
            name: 'Mixed Disposal',
            prompt: 'Transform legacy dump sites and non-recyclable reject streams via safe energy recovery, co-processing, or inert stabilization.',
          },
        ],
      },
    ],
    benefits: [
      ['Think beyond the bin', 'Turn an everyday waste problem into a practical, scalable intervention that works on the ground.'],
      ['Build with a team', 'Bring 2–4 people together and combine engineering, design, policy, and community perspectives.'],
      ['Pitch your solution', 'Present the problem root-cause, your smart intervention, and the path from concept to action.'],
      ['Create lasting impact', 'Focus on cleaner communities, healthier ecosystems, and a brighter circular future.'],
    ],
    rubricTitle: 'HOW IDEAS ARE EVALUATED',
    rubric: [
      ['Feasibility', 'Practical implementation in real communities'],
      ['Scalability', 'Potential to expand across wards, cities, or campuses'],
      ['Eco Impact', 'Measurable reduction in landfill or water pollution'],
      ['Innovation', 'Fresh thinking in technology, design, or behaviour'],
    ],
    timeline: [
      {
        date: '02 OCT – 01 NOV 2026',
        title: 'Round 1: Idea Pitching',
        copy: 'Submit your team registration, problem root-cause brief, and initial proposed technical solution.',
        color: 'green',
        items: ['Team of 1–4 members', 'Choose 1 of 3 focus tracks', 'Problem & solution submission'],
      },
      {
        date: '02 NOV – 01 DEC 2026',
        title: 'Round 2: Idea Elaboration',
        copy: 'Unlocked exclusively for teams selected in Round 1: Submit detailed concept, 90-day plan, budget, and circularity model.',
        color: 'blue',
        items: ['Feasibility & 90-day execution plan', 'Value proposition & resource needs', 'Jury intermediate screening'],
      },
      {
        date: '15 DEC 2026',
        title: 'Round 3: Grand Finale',
        copy: 'Top finalist teams present live before the Grand Jury with prototypes, hardware demos, and stage pitches.',
        color: 'purple',
        items: ['Live auditorium presentation', 'Working prototype / demo walkthrough', 'Grand jury Q&A and final cash awards'],
      },
    ],
    faqs: [
      [
        'Who can participate in the Reimagine Ideathon?',
        'Anyone! There is no age limit. Students, professionals, researchers, designers, startups, and community volunteers can form teams of 2 to 4 members.',
      ],
      [
        'Do we need a hardware prototype before registering?',
        'No. At registration (28 Sep 2026) you only need your team details and chosen track. You have until 28 Oct 2026 for Idea Submission and 28 Nov 2026 for the final Pitch.',
      ],
      [
        'Can our idea combine software, hardware, and community policy?',
        'Yes! "Smart Intervention" covers digital apps/IoT, low-cost mechanical tools, circular material upcycling, and community behaviour models.',
      ],
      [
        'Can we present our pitch in Kannada or English?',
        'Both English and Kannada (ಹಸಿರು ಸಂವಾದ) are welcomed for idea discussions and presentations.',
      ],
      [
        'Is there any registration fee?',
        'Registration is completely open and accessible to encourage grassroots innovation for cleaner communities.',
      ],
    ],
    form: {
      badge: 'DIRECT TEAM REGISTRATION',
      title: 'Reserve Your Team Slot',
      teamName: 'Team Name',
      teamNamePh: 'e.g., EcoVanguard / Hasiru Labs',
      leadName: 'Team Lead Full Name',
      leadNamePh: 'Enter team lead name',
      email: 'Email Address',
      emailPh: 'team@example.com',
      phone: 'Phone / WhatsApp Number',
      phonePh: '+91 98765 43210',
      size: 'Team Size',
      track: 'Focus Track',
      subtopic: 'Specific Waste Stream',
      idea: 'Brief Idea or Problem Focus',
      ideaPh: 'In 1–2 sentences, what waste challenge does your team want to reimagine?',
      submit: 'Complete Team Registration',
      successTitle: 'Team Slot Reserved!',
      successMsg: 'Your team has been registered for Reimagine — Waste Management Ideathon 2026. Keep building toward the 28 October Idea Submission!',
      reset: 'Register Another Team',
    },
    footer: 'Ideas for a cleaner, greener tomorrow.',
  },
  kn: {
    nav: ['ಪರಿಚಯ', 'ಸವಾಲುಗಳು', 'ಕಾಲಪಟ್ಟಿ', 'ಮಾಹಿತಿ', 'ನೋಂದಣಿ'],
    eye: 'ಐಡಿಯಾಥಾನ್ 2026 · ಆಲೋಚನೆಗಳಿಗೆ ಮುಕ್ತ ಆಹ್ವಾನ',
    end: 'ನಾಳೆಯನ್ನು ರೂಪಿಸಿ.',
    lead: 'ತ್ಯಾಜ್ಯ ನಿರ್ವಹಣೆಯ ಸವಾಲುಗಳನ್ನು ಚುರುಕಾದ, ಪ್ರಾಯೋಗಿಕ ಪರಿಹಾರಗಳಾಗಿ ರೂಪಿಸಲು ಸಿದ್ಧವಾಗಿರುವ ಧೈರ್ಯಶಾಲಿ ಮನಸ್ಸುಗಳಿಗಾಗಿ ಸುಸ್ಥಿರತೆಯ ಐಡಿಯಾಥಾನ್.',
    reg: 'ನಿಮ್ಮ ತಂಡವನ್ನು ನೋಂದಾಯಿಸಿ',
    explore: 'ಸವಾಲುಗಳನ್ನು ಅನ್ವೇಷಿಸಿ',
    posterBtn: 'ಪೋಸ್ಟರ್ ವೀಕ್ಷಿಸಿ',
    stats: ['ತಂಡದ ಸದಸ್ಯರು', 'ವಯಸ್ಸಿನ ಮಿತಿ ಇಲ್ಲ', 'ಪ್ರಮುಖ ಹಂತಗಳು'],
    about: {
      kicker: '01 — ಏಕೆ',
      title: (
        <>
          ಸಣ್ಣ ಆಲೋಚನೆಗಳು.
          <br />
          <span>ದೊಡ್ಡ ಪರಿಣಾಮ.</span>
        </>
      ),
      p1: 'ತ್ಯಾಜ್ಯವು ನಾವು ಎಸೆಯುವ ವಸ್ತುವಷ್ಟೇ ಅಲ್ಲ. ಅದು ವಿನ್ಯಾಸದ ಸಮಸ್ಯೆ, ವ್ಯವಸ್ಥೆಯ ಸಮಸ್ಯೆ ಮತ್ತು ವಿಭಿನ್ನವಾಗಿ ಯೋಚಿಸುವ ಅವಕಾಶವಾಗಿದೆ.',
      p2: (
        <>
          <b>ಹಸಿರು ಸಂವಾದ</b> ವಿದ್ಯಾರ್ಥಿಗಳು, ಸೃಷ್ಟಿಕರ್ತರು, ಸಮಸ್ಯೆ-ಪರಿಹಾರಕರು ಮತ್ತು ಸಮುದಾಯಗಳನ್ನು ಒಟ್ಟುಗೂಡಿಸಿ, ತ್ಯಾಜ್ಯ ನಿರ್ವಹಣೆಯನ್ನು ಹೆಚ್ಚು ಚುರುಕಾದ, ಸ್ವಚ್ಛ ಮತ್ತು ಸುಸ್ಥಿರಗೊಳಿಸುವ ಪರಿಹಾರಗಳನ್ನು ರೂಪಿಸುತ್ತದೆ.
        </>
      ),
      mottoTitle: 'ಇಂದೇ ಬದಲಾವಣೆ ಮಾಡಿ — ಏಕೆಂದರೆ ಸ್ವಚ್ಛ ಭೂಮಿ ನಿಮ್ಮಿಂದಲೇ ಪ್ರಾರಂಭವಾಗುತ್ತದೆ!',
      mottoSub: 'ಸ್ಮಾರ್ಟ್ ಇಂಟರ್ವೆನ್ಷನ್ · ಸುಸ್ಥಿರ ನಾಳೆಗಾಗಿ ನವೀನ ಆಲೋಚನೆಗಳು',
      pillars: [
        ['ವ್ಯವಸ್ಥಿತ ವಿನ್ಯಾಸ', 'ಮೂಲದಲ್ಲಿಯೇ ತ್ಯಾಜ್ಯ ಕಡಿತ ಮತ್ತು ಮರುಬಳಕೆ'],
        ['ಸಮುದಾಯದ ಸಹಭಾಗಿತ್ವ', 'ನಾಗರಿಕರ ಜಾಗೃತಿ ಮತ್ತು ಸಕ್ರಿಯ ಪಾಲ್ಗೊಳ್ಳುವಿಕೆ'],
        ['ಚುರುಕಾದ ಮೇಲ್ವಿಚಾರಣೆ', 'ಡೇಟಾ ಆಧಾರಿತ ಸಂಗ್ರಹಣೆ ಮತ್ತು ವಿಂಗಡಣೆ'],
        ['ಮರುಮೌಲ್ಯ ಸೃಷ್ಟಿ', 'ತ್ಯಾಜ್ಯವನ್ನು ಉಪಯುಕ್ತ ಸಂಪನ್ಮೂಲವಾಗಿ ಪರಿವರ್ತಿಸುವುದು'],
      ],
      bento: [
        {
          badge: 'ವೃತ್ತಾಕಾರದ ಆರ್ಥಿಕತೆ',
          title: 'ತ್ಯಾಜ್ಯದಿಂದ ಮೌಲ್ಯದ ಕಡೆಗೆ',
          desc: 'ಸಾಂಪ್ರದಾಯಿಕ ವಿಲೇವಾರಿ ಬದಲಿಗೆ ವಿಕೇಂದ್ರೀಕೃತ ವಿಂಗಡಣೆ ಮತ್ತು ಮರುಬಳಕೆ ವ್ಯವಸ್ಥೆಗಳನ್ನು ರೂಪಿಸಿ.',
          metric: '5R ತತ್ವಗಳು',
        },
        {
          badge: '3 ಕ್ಷೇತ್ರಗಳು · 13 ವಿಷಯಗಳು',
          title: 'ನೈಜ ನಗರ ಮತ್ತು ಗ್ರಾಮೀಣ ಸವಾಲುಗಳು',
          desc: 'ಸ್ಯಾನಿಟರಿ, ನಿರ್ಮಾಣ ತ್ಯಾಜ್ಯ, ಬಟ್ಟೆ, ಪ್ಲಾಸ್ಟಿಕ್, ಪ್ರವಾಸಿ ಹಾಗೂ ಜಲಮೂಲಗಳ ತ್ಯಾಜ್ಯಕ್ಕೆ ಪರಿಹಾರ ಕಂಡುಕೊಳ್ಳಿ.',
          metric: '100% ಪ್ರಾಯೋಗಿಕ',
        },
        {
          badge: 'ಎಲ್ಲರಿಗೂ ಮುಕ್ತ ಅವಕಾಶ',
          title: 'ವಯಸ್ಸಿನ ಮಿತಿ ಇಲ್ಲ',
          desc: 'ವಿದ್ಯಾರ್ಥಿಗಳು, ಇಂಜಿನಿಯರ್‌ಗಳು, ವಿನ್ಯಾಸಕರು ಮತ್ತು ನಾಗರಿಕರು 2–4 ಸದಸ್ಯರ ತಂಡವಾಗಿ ಭಾಗವಹಿಸಬಹುದು.',
          metric: '2–4 ಸದಸ್ಯರು',
        },
      ],
    },
    challenge: {
      kicker: '02 — ಗಮನದ ಕೇಂದ್ರ',
      title: (
        <>
          ಸಮಸ್ಯೆಯನ್ನು ಆರಿಸಿ.
          <br />
          <span>ಸಾಮಾನ್ಯತೆಯನ್ನು ಸವಾಲು ಮಾಡಿ.</span>
        </>
      ),
      sub: 'ಮೂರು ಪ್ರಮುಖ ಗಮನ ಕ್ಷೇತ್ರಗಳು. ಒಂದು ಸಾಮಾನ್ಯ ಗುರಿ: ತ್ಯಾಜ್ಯವನ್ನು ಮೌಲ್ಯವಾಗಿ ಪರಿವರ್ತಿಸುವುದು. ಹೆಚ್ಚಿನ ವಿವರಗಳಿಗಾಗಿ ಉಪ-ವಿಷಯವನ್ನು ಕ್ಲಿಕ್ ಮಾಡಿ.',
      promptLabel: 'ಉಪ-ವಿಷಯದ ಸವಾಲು ಮತ್ತು ಪರಿಹಾರದ ದಿಕ್ಕು',
      cta: 'ಈ ಕ್ಷೇತ್ರದಲ್ಲಿ ಆಲೋಚನೆಯನ್ನು ರೂಪಿಸಿ',
    },
    challenges: [
      {
        theme: 'emerald',
        title: 'ತ್ಯಾಜ್ಯ ನಿರ್ವಹಣೆ',
        desc: 'ಸ್ಯಾನಿಟರಿ, ನಿರ್ಮಾಣ, ಬಟ್ಟೆ ಮತ್ತು ಪ್ಲಾಸ್ಟಿಕ್ ತ್ಯಾಜ್ಯವನ್ನು ಹೇಗೆ ಕಡಿಮೆ, ವಿಂಗಡಣೆ ಮತ್ತು ಮರುಪಡೆಯಬಹುದು ಎಂಬುದನ್ನು ಮರುಚಿಂತಿಸಿ.',
        icon: Recycle,
        subtopics: [
          {
            name: 'ಸ್ಯಾನಿಟರಿ ತ್ಯಾಜ್ಯ',
            prompt: 'ಮನೆ ಮತ್ತು ಸಂಸ್ಥೆಗಳ ಸ್ಯಾನಿಟರಿ ತ್ಯಾಜ್ಯದ ಸುರಕ್ಷಿತ ಸಂಗ್ರಹಣೆ, ಸಂಸ್ಕರಣೆ ಅಥವಾ ಪರಿಸರ ಸ್ನೇಹಿ ಪರ್ಯಾಯಗಳನ್ನು ವಿನ್ಯಾಸಗೊಳಿಸಿ.',
          },
          {
            name: 'ನಿರ್ಮಾಣ (C&D) ತ್ಯಾಜ್ಯ',
            prompt: 'ಕಟ್ಟಡ ನಿರ್ಮಾಣ ಮತ್ತು ನೆಲಸಮ ತ್ಯಾಜ್ಯವನ್ನು ಮರುಬಳಕೆಯ ಇಟ್ಟಿಗೆ, ಟೈಲ್ಸ್ ಅಥವಾ ನಿರ್ಮಾಣ ಸಾಮಗ್ರಿಗಳಾಗಿ ಪರಿವರ್ತಿಸುವ ಮಾದರಿ ರೂಪಿಸಿ.',
          },
          {
            name: 'ಬಟ್ಟೆ ತ್ಯಾಜ್ಯ',
            prompt: 'ಹಳೆಯ ಬಟ್ಟೆಗಳು ಮತ್ತು ಟೈಲರಿಂಗ್ ತ್ಯಾಜ್ಯವನ್ನು ಮರುಬಳಕೆ ಮಾಡಿ ಉಪಯುಕ್ತ ಉತ್ಪನ್ನಗಳನ್ನಾಗಿ ಪರಿವರ್ತಿಸುವ ವೃತ್ತಾಕಾರದ ವ್ಯವಸ್ಥೆ ಕಟ್ಟಿರಿ.',
          },
          {
            name: 'ಪ್ಲಾಸ್ಟಿಕ್ ತ್ಯಾಜ್ಯ',
            prompt: 'ಏಕ-ಬಳಕೆಯ ಪ್ಲಾಸ್ಟಿಕ್ ಕಡಿಮೆ ಮಾಡಲು, ಸಂಗ್ರಹಿಸಲು ಮತ್ತು ಮರುಬಳಕೆ ಮಾಡಲು ಚುರುಕಾದ ಪರಿಹಾರಗಳನ್ನು ಸೂಚಿಸಿ.',
          },
        ],
      },
      {
        theme: 'ocean',
        title: 'ಚುರುಕಾದ ನಿರ್ವಹಣೆ',
        desc: 'ವಿಂಗಡಣೆ, ಸಂಗ್ರಹಣೆ, ಮೇಲ್ವಿಚಾರಣೆ ಮತ್ತು ಮಿಶ್ರ ತ್ಯಾಜ್ಯ ನಿರ್ವಹಣೆಗಾಗಿ ಚುರುಕಾದ ವ್ಯವಸ್ಥೆಗಳನ್ನು ವಿನ್ಯಾಸಗೊಳಿಸಿ.',
        icon: Zap,
        subtopics: [
          {
            name: 'ವಿಂಗಡಣೆ',
            prompt: 'ಮನೆ ಮತ್ತು ವಾಣಿಜ್ಯ ಕೇಂದ್ರಗಳಲ್ಲಿ ಮೂಲದಲ್ಲಿಯೇ ಹಸಿ, ಒಣ ಮತ್ತು ಅಪಾಯಕಾರಿ ತ್ಯಾಜ್ಯವನ್ನು ಸುಲಭವಾಗಿ ಬೇರ್ಪಡಿಸುವ ಸಾಧನ ಅಥವಾ ವ್ಯವಸ್ಥೆ.',
          },
          {
            name: 'ಮೇಲ್ವಿಚಾರಣೆ',
            prompt: 'ಕಸದ ತೊಟ್ಟಿಗಳ ಸ್ಥಿತಿಗತಿ, ಅನಧಿಕೃತ ಕಸ ಸುರಿಯುವ ಸ್ಥಳಗಳು ಮತ್ತು ವಿಲೇವಾರಿ ವಾಹನಗಳ ಟ್ರ್ಯಾಕಿಂಗ್‌ಗೆ ಸ್ಮಾರ್ಟ್ ವ್ಯವಸ್ಥೆ.',
          },
          {
            name: 'ಮಿಶ್ರ ತ್ಯಾಜ್ಯ',
            prompt: 'ಈಗಾಗಲೇ ಬೆರೆತಿರುವ ಮಿಶ್ರ ತ್ಯಾಜ್ಯವನ್ನು ಕಡಿಮೆ ವೆಚ್ಚದಲ್ಲಿ ಬೇರ್ಪಡಿಸಲು ಮತ್ತು ಸಂಸ್ಕರಿಸಲು ವಿಕೇಂದ್ರೀಕೃತ ತಂತ್ರಜ್ಞಾನ.',
          },
          {
            name: 'ಸಂಗ್ರಹಣೆ',
            prompt: 'ಪೌರಕಾರ್ಮಿಕರ ಸುರಕ್ಷತೆ ಮತ್ತು ಕಿರಿದಾದ ರಸ್ತೆಗಳು ಹಾಗೂ ಮಾರುಕಟ್ಟೆಗಳಲ್ಲಿ ಸುಗಮ ಕಸ ಸಂಗ್ರಹಣೆಗೆ ನವೀನ ವಿನ್ಯಾಸ.',
          },
          {
            name: '5Rಗಳು',
            prompt: 'Refuse, Reduce, Reuse, Repurpose ಮತ್ತು Recycle ತತ್ವಗಳನ್ನು ಶಾಲೆ-ಕಾಲೇಜು ಮತ್ತು ಬಡಾವಣೆಗಳಲ್ಲಿ ಜಾರಿಗೆ ತರುವ ಮಾದರಿ.',
          },
        ],
      },
      {
        theme: 'amber',
        title: 'ತ್ಯಾಜ್ಯ ವಿಲೇವಾರಿ',
        desc: 'ಪ್ರವಾಸಿ ತ್ಯಾಜ್ಯ, ನೀರಿನ ತ್ಯಾಜ್ಯ ಮತ್ತು ಭೂಗತ ವಿಲೇವಾರಿಗಾಗಿ ಹೆಚ್ಚು ಸುರಕ್ಷಿತ, ಸ್ವಚ್ಛ ಪರಿಹಾರಗಳನ್ನು ಕಂಡುಹಿಡಿಯಿರಿ.',
        icon: Leaf,
        subtopics: [
          {
            name: 'ಪ್ರವಾಸೋದ್ಯಮ ತ್ಯಾಜ್ಯ',
            prompt: 'ಗಿರಿಧಾಮ, ಕಡಲತೀರ ಮತ್ತು ಪಾರಂಪರಿಕ ತಾಣಗಳಲ್ಲಿ ಪ್ಲಾಸ್ಟಿಕ್ ಮತ್ತು ಕಸ ಮುಕ್ತ ಪ್ರವಾಸೋದ್ಯಮಕ್ಕಾಗಿ ಪ್ರಾಯೋಗಿಕ ವ್ಯವಸ್ಥೆ.',
          },
          {
            name: 'ಭೂಗತ ತ್ಯಾಜ್ಯ',
            prompt: 'ಮಣ್ಣಿನ ಸವಕಳಿ ಮತ್ತು ಅಂತರ್ಜಲ ಮಾಲಿನ್ಯ ತಡೆಯಲು ಸುರಕ್ಷಿತ ಭೂಗತ ವಿಲೇವಾರಿ ಮತ್ತು ಜೈವಿಕ ಸಂಸ್ಕರಣೆ.',
          },
          {
            name: 'ನೀರಿನಲ್ಲಿನ ತ್ಯಾಜ್ಯ',
            prompt: 'ಕೆರೆ, ನದಿ ಮತ್ತು ರಾಜಕಾಲುವೆಗಳಲ್ಲಿ ತೇಲುವ ಪ್ಲಾಸ್ಟಿಕ್ ಹಾಗೂ ತ್ಯಾಜ್ಯವನ್ನು ತಡೆಯಲು ಮತ್ತು ಸ್ವಚ್ಛಗೊಳಿಸಲು ಸಾಧನಗಳು.',
          },
          {
            name: 'ಮಿಶ್ರ ವಿಲೇವಾರಿ',
            prompt: 'ಮರುಬಳಕೆ ಮಾಡಲಾಗದ ತ್ಯಾಜ್ಯವನ್ನು ಪರಿಸರಕ್ಕೆ ಹಾನಿಯಾಗದಂತೆ ಶಕ್ತಿ ಅಥವಾ ಇತರ ಸುರಕ್ಷಿತ ರೂಪಕ್ಕೆ ಪರಿವರ್ತಿಸುವ ವಿಧಾನ.',
          },
        ],
      },
    ],
    benefits: [
      ['ಡಬ್ಬಿಯ ಆಚೆ ಯೋಚಿಸಿ', 'ದಿನನಿತ್ಯದ ತ್ಯಾಜ್ಯ ಸಮಸ್ಯೆಯನ್ನು ಪ್ರಾಯೋಗಿಕ, ವಿಸ್ತರಿಸಬಹುದಾದ ಆಲೋಚನೆಯಾಗಿ ರೂಪಿಸಿ.'],
      ['ತಂಡದೊಂದಿಗೆ ರೂಪಿಸಿ', '2–4 ಜನರನ್ನು ಒಟ್ಟುಗೂಡಿಸಿ ವಿಭಿನ್ನ ದೃಷ್ಟಿಕೋನಗಳನ್ನು ಸಂಯೋಜಿಸಿ.'],
      ['ನಿಮ್ಮ ಪರಿಹಾರವನ್ನು ಪ್ರಸ್ತುತಪಡಿಸಿ', 'ಆಲೋಚನೆ, ಪರಿಣಾಮ ಮತ್ತು ಕ್ರಿಯೆಯತ್ತ ಸಾಗುವ ಮಾರ್ಗವನ್ನು ವಿವರಿಸಿ.'],
      ['ಶಾಶ್ವತ ಪರಿಣಾಮ ಸೃಷ್ಟಿಸಿ', 'ಸ್ವಚ್ಛ ಸಮುದಾಯಗಳು, ಆರೋಗ್ಯಕರ ಸ್ಥಳಗಳು ಮತ್ತು ಉಜ್ವಲ ಭವಿಷ್ಯದ ಮೇಲೆ ಗಮನವಿರಿಸಿ.'],
    ],
    rubricTitle: 'ಮೌಲ್ಯಮಾಪನದ ಮಾನದಂಡಗಳು',
    rubric: [
      ['ಪ್ರಾಯೋಗಿಕತೆ', 'ನೈಜ ಸಮುದಾಯಗಳಲ್ಲಿ ಅನುಷ್ಠಾನಕ್ಕೆ ಯೋಗ್ಯವಾಗಿರುವುದು'],
      ['ವಿಸ್ತರಣೀಯತೆ', 'ವಾರ್ಡ್, ನಗರ ಅಥವಾ ಕ್ಯಾಂಪಸ್‌ಗಳಿಗೆ ವಿಸ್ತರಿಸುವ ಸಾಮರ್ಥ್ಯ'],
      ['ಪರಿಸರ ಪರಿಣಾಮ', 'ಮಾಲಿನ್ಯ ಮತ್ತು ಕಸದ ಪ್ರಮಾಣದಲ್ಲಿ ಸ್ಪಷ್ಟ ಇಳಿಕೆ'],
      ['ನವೀನತೆ', 'ತಂತ್ರಜ್ಞಾನ, ವಿನ್ಯಾಸ ಅಥವಾ ಜಾಗೃತಿಯಲ್ಲಿ ಹೊಸತನ'],
    ],
    timeline: [
      {
        date: '೦೨ ಅಕ್ಟೋಬರ್ – ೦೧ ನವೆಂಬರ್ ೨೦೨೬',
        title: 'ಹಂತ ೧: ಆಲೋಚನೆ ಸಲ್ಲಿಕೆ (Pitch)',
        copy: 'ನಿಮ್ಮ ತಂಡವನ್ನು ನೋಂದಾಯಿಸಿ, ಸಮಸ್ಯೆಯ ವಿವರಣೆ ಮತ್ತು ತಾಂತ್ರಿಕ ಪರಿಹಾರವನ್ನು ಸಲ್ಲಿಸಿ.',
        color: 'green',
        items: ['೧–೪ ಸದಸ್ಯರ ತಂಡ ನೋಂದಣಿ', '೩ ವಿಷಯಗಳಲ್ಲಿ ಒಂದರ ಆಯ್ಕೆ', 'ಸಮಸ್ಯೆ ಮತ್ತು ಪರಿಹಾರದ ಸಲ್ಲಿಕೆ'],
      },
      {
        date: '೦೨ ನವೆಂಬರ್ – ೦೧ ಡಿಸೆಂಬರ್ ೨೦೨೬',
        title: 'ಹಂತ ೨: ವಿವರವಾದ ಯೋಜನೆ (Elaboration)',
        copy: 'ಹಂತ ೧ ರಲ್ಲಿ ಆಯ್ಕೆಯಾದ ತಂಡಗಳಿಗೆ ಮಾತ್ರ: ವಿವರವಾದ ಪರಿಕಲ್ಪನೆ, ೯೦ ದಿನಗಳ ಯೋಜನೆ ಮತ್ತು ಬಜೆಟ್ ಸಲ್ಲಿಸಿ.',
        color: 'blue',
        items: ['ಪ್ರಾಯೋಗಿಕತೆ ಮತ್ತು ೯೦ ದಿನಗಳ ಯೋಜನೆ', 'ಮೌಲ್ಯ ಮತ್ತು ಸಂಪನ್ಮೂಲಗಳ ಅಗತ್ಯತೆ', 'ತೀರ್ಪುಗಾರರ ಮೌಲ್ಯಮಾಪನ'],
      },
      {
        date: '೧೫ ಡಿಸೆಂಬರ್ ೨೦೨೬',
        title: 'ಹಂತ ೩: ಗ್ರ್ಯಾಂಡ್ ಫಿನಾಲೆ (Grand Finale)',
        copy: 'ಅಂತಿಮ ಹಂತಕ್ಕೆ ಆಯ್ಕೆಯಾದ ತಂಡಗಳು ತೀರ್ಪುಗಾರರ ಎದುರು ವೇದಿಕೆಯಲ್ಲಿ ಲೈವ್ ಪ್ರಸ್ತುತಿ ಮತ್ತು ಪ್ರಾತ್ಯಕ್ಷಿಕೆ ನೀಡುತ್ತವೆ.',
        color: 'purple',
        items: ['ವೇದಿಕೆಯಲ್ಲಿ ಲೈವ್ ಪ್ರಸ್ತುತಿ', 'ಮಾದರಿ / ಪ್ರೊಟೊಟೈಪ್ ಡೆಮೊ', 'ತೀರ್ಪುಗಾರರ ಪ್ರಶ್ನೋತ್ತರ ಮತ್ತು ಪ್ರಶಸ್ತಿ ಪ್ರದಾನ'],
      },
    ],
    faqs: [
      [
        'ಈ ಐಡಿಯಾಥಾನ್‌ನಲ್ಲಿ ಯಾರು ಭಾಗವಹಿಸಬಹುದು?',
        'ಯಾರು ಬೇಕಾದರೂ ಭಾಗವಹಿಸಬಹುದು! ಯಾವುದೇ ವಯಸ್ಸಿನ ಮಿತಿ ಇಲ್ಲ. ವಿದ್ಯಾರ್ಥಿಗಳು, ವೃತ್ತಿಪರರು, ಸಂಶೋಧಕರು ಮತ್ತು ನಾಗರಿಕರು 2 ರಿಂದ 4 ಜನರ ತಂಡವಾಗಿ ಭಾಗವಹಿಸಬಹುದು.',
      ],
      [
        'ನೋಂದಣಿ ಸಮಯದಲ್ಲಿಯೇ ಪ್ರೊಟೊಟೈಪ್ (ಮಾದರಿ) ಸಿದ್ಧವಿರಬೇಕೇ?',
        'ಇಲ್ಲ. ಸೆಪ್ಟೆಂಬರ್ 28ರ ನೋಂದಣಿಗೆ ತಂಡದ ವಿವರ ಮತ್ತು ವಿಷಯದ ಆಯ್ಕೆ ಸಾಕು. ಅಕ್ಟೋಬರ್ 28ರೊಳಗೆ ಆಲೋಚನೆ ಸಲ್ಲಿಸಬಹುದು ಮತ್ತು ನವೆಂಬರ್ 28ರಂದು ಅಂತಿಮ ಪ್ರಸ್ತುತಿ ಇರುತ್ತದೆ.',
      ],
      [
        'ಯಾವ ರೀತಿಯ ಪರಿಹಾರಗಳನ್ನು ಸಲ್ಲಿಸಬಹುದು?',
        'ಡಿಜಿಟಲ್ ಆಪ್/IoT, ಕಡಿಮೆ ವೆಚ್ಚದ ಯಂತ್ರಗಳು, ಮರುಬಳಕೆ ವಿಧಾನಗಳು ಅಥವಾ ಸಮುದಾಯ ಆಧಾರಿತ ಜಾಗೃತಿ ಮಾದರಿಗಳನ್ನು ಸಲ್ಲಿಸಬಹುದು.',
      ],
      [
        'ಕನ್ನಡ ಅಥವಾ ಇಂಗ್ಲಿಷ್‌ನಲ್ಲಿ ಪ್ರಸ್ತುತಪಡಿಸಬಹುದೇ?',
        'ಹೌದು, ಕನ್ನಡ ಮತ್ತು ಇಂಗ್ಲಿಷ್ ಎರಡೂ ಭಾಷೆಗಳಲ್ಲಿ ನಿಮ್ಮ ಆಲೋಚನೆಗಳನ್ನು ಮಂಡಿಸಲು ಅವಕಾಶವಿದೆ.',
      ],
      [
        'ನೋಂದಣಿಗೆ ಯಾವುದೇ ಶುಲ್ಕವಿದೆಯೇ?',
        'ಇಲ್ಲ, ಸ್ವಚ್ಛ ಸಮುದಾಯಗಳಿಗಾಗಿ ಹೊಸ ಆಲೋಚನೆಗಳನ್ನು ಪ್ರೋತ್ಸಾಹಿಸಲು ನೋಂದಣಿ ಸಂಪೂರ್ಣವಾಗಿ ಮುಕ್ತವಾಗಿದೆ.',
      ],
    ],
    form: {
      badge: 'ನೇರ ತಂಡದ ನೋಂದಣಿ',
      title: 'ನಿಮ್ಮ ತಂಡದ ಸ್ಥಾನ ಕಾಯ್ದಿರಿಸಿ',
      teamName: 'ತಂಡದ ಹೆಸರು',
      teamNamePh: 'ಉದಾ: ಹಸಿರು ತಂಡ / EcoVanguard',
      leadName: 'ತಂಡದ ನಾಯಕರ ಹೆಸರು',
      leadNamePh: 'ಪೂರ್ಣ ಹೆಸರನ್ನು ನಮೂದಿಸಿ',
      email: 'ಇಮೇಲ್ ವಿಳಾಸ',
      emailPh: 'team@example.com',
      phone: 'ಫೋನ್ / ವಾಟ್ಸಾಪ್ ಸಂಖ್ಯೆ',
      phonePh: '+91 98765 43210',
      size: 'ತಂಡದ ಗಾತ್ರ',
      track: 'ಆಯ್ಕೆಯ ಕ್ಷೇತ್ರ',
      subtopic: 'ಉಪ-ವಿಷಯ',
      idea: 'ಆಲೋಚನೆಯ ಕಿರು ವಿವರಣೆ',
      ideaPh: 'ನಿಮ್ಮ ತಂಡವು ಯಾವ ತ್ಯಾಜ್ಯ ಸಮಸ್ಯೆಗೆ ಪರಿಹಾರ ರೂಪಿಸಲು ಬಯಸುತ್ತದೆ?',
      submit: 'ನೋಂದಣಿ ಪೂರ್ಣಗೊಳಿಸಿ',
      successTitle: 'ನಿಮ್ಮ ತಂಡದ ನೋಂದಣಿ ಯಶಸ್ವಿಯಾಗಿದೆ!',
      successMsg: 'ಹಸಿರು ಸಂವಾದ — Reimagine Ideathon 2026ಕ್ಕೆ ನಿಮ್ಮ ತಂಡ ನೋಂದಣಿಯಾಗಿದೆ. ಅಕ್ಟೋಬರ್ 28ರ ಆಲೋಚನೆ ಸಲ್ಲಿಕೆಗೆ ಸಿದ್ಧರಾಗಿ!',
      reset: 'ಮತ್ತೊಂದು ತಂಡವನ್ನು ನೋಂದಾಯಿಸಿ',
    },
    footer: 'ಸ್ವಚ್ಛ, ಹಸಿರು ನಾಳೆಗಾಗಿ ಆಲೋಚನೆಗಳು.',
  },
};

const sectionIds = ['top', 'about', 'challenges', 'why', 'timeline', 'faq', 'pitch', 'register'];

const Brand = () => (
  <>
    <span className="brand-mark">
      <Leaf size={22} fill="currentColor" />
    </span>
    <span className="brand-name">
      ಹಸಿರು ಸಂವಾದ<span className="brand-dot">.</span>
    </span>
  </>
);

function App() {
  const { user, logout, registerParticipant, showToast, lang, setLang } = useAuth();
  const [menu, setMenu] = useState(false);
  const [active, setActive] = useState(0);
  const [activeSubtopic, setActiveSubtopic] = useState(0);
  const [openFaq, setOpenFaq] = useState(0);
  const [showPoster, setShowPoster] = useState(false);
  const [time, setTime] = useState(['--', '--', '--', '--']);
  const [activeSection, setActiveSection] = useState('top');
  const [isScrolled, setIsScrolled] = useState(false);

  // Registration form state
  const [formState, setFormState] = useState({
    teamName: '',
    leadName: '',
    email: '',
    phone: '',
    password: '',
    size: '3 Members',
    trackIndex: 0,
    subtopicIndex: 0,
    idea: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const t = data[lang];

  const scroll = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    setMenu(false);
  };

  const selectTrackForRegistration = (trackIdx, subIdx) => {
    setFormState((prev) => ({
      ...prev,
      trackIndex: trackIdx,
      subtopicIndex: subIdx,
    }));
    scroll('register');
  };

  // Reset active subtopic when switching challenge track
  const handleChallengeChange = (idx) => {
    setActive(idx);
    setActiveSubtopic(0);
  };

  // Countdown timer
  useEffect(() => {
    const tick = () => {
      let d = Math.max(0, new Date('2026-11-01T23:59:59+05:30') - Date.now());
      setTime([d / 864e5, (d / 36e5) % 24, (d / 6e4) % 60, (d / 1e3) % 60].map((n) => String(Math.floor(n)).padStart(2, '0')));
    };
    tick();
    let id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Track active section and scroll state
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight * 0.35;
      setIsScrolled(window.scrollY > 40);

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(sectionIds[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [user]);

  // Support initial hash jump on load
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const id = window.location.hash.replace('#', '');
      const timer = setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [user]);

  const isNavActive = (id) => {
    if (id === 'about') return activeSection === 'about';
    if (id === 'challenges') return activeSection === 'challenges' || activeSection === 'why';
    if (id === 'timeline') return activeSection === 'timeline';
    if (id === 'faq') return activeSection === 'faq';
    if (id === 'register') return activeSection === 'register';
    return false;
  };

  const isDarkSection = activeSection === 'register' || activeSection === 'why';
  const currentChallenge = t.challenges[active];
  const Icon = currentChallenge.icon;
  const currentSub = currentChallenge.subtopics[activeSubtopic] || currentChallenge.subtopics[0];

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formState.email || !formState.leadName) {
      if (showToast) showToast('Please fill out all required fields.', true);
      return;
    }
    setIsSubmitting(true);
    const pwd = formState.password || 'Ideathon2026!';
    const res = await registerParticipant({
      name: formState.leadName,
      email: formState.email,
      phone: formState.phone,
      password: pwd,
    });
    setIsSubmitting(false);
    if (res?.success) {
      setSubmitted(true);
      scroll('pitch');
    }
  };

  return (
    <div className={`site-shell ${lang === 'kn' ? 'kannada' : ''} ${isDarkSection ? 'nav-on-dark' : ''}`}>
      <div className="noise" />

      {/* FLOATING SIDE TAB / VIEW NAVIGATOR */}
      <aside className="side-nav" aria-label="Section navigation">
        {sectionIds.map((id) => {
          const names = {
            top: lang === 'en' ? 'Top' : 'ಆರಂಭ',
            about: lang === 'en' ? '01 Why' : '೦೧ ಏಕೆ',
            challenges: lang === 'en' ? '02 Challenges' : '೦೨ ಸವಾಲುಗಳು',
            why: lang === 'en' ? '03 Experience' : '೦೩ ಅನುಭವ',
            timeline: lang === 'en' ? '04 Timeline' : '೦೪ ಕಾಲಪಟ್ಟಿ',
            faq: lang === 'en' ? '05 Rules & FAQ' : '೦೫ ನಿಯಮಗಳು',
            register: lang === 'en' ? '06 Register' : '೦೬ ನೋಂದಣಿ',
          };
          const label = names[id];
          const isActive = activeSection === id;
          return (
            <button
              key={id}
              className={`side-dot ${isActive ? 'active' : ''}`}
              onClick={() => scroll(id)}
              aria-label={label}
              title={label}
            >
              <span className="dot-pip" />
              <span className="dot-tooltip">{label}</span>
            </button>
          );
        })}
      </aside>

      {/* POSTER LIGHTBOX MODAL */}
      {showPoster && (
        <div className="poster-modal-backdrop" onClick={() => setShowPoster(false)}>
          <div className="poster-modal" onClick={(e) => e.stopPropagation()}>
            <button className="poster-modal-close" onClick={() => setShowPoster(false)} aria-label="Close poster">
              <X size={22} />
            </button>
            <img src="/event-reference.jpg" alt="Reimagine Waste Management Ideathon Official Poster" />
          </div>
        </div>
      )}

      {/* MAIN CONTENT */}
      <main>
        {/* VIEW 0: HERO SECTION */}
        <section className="hero snap-section" id="top">
          <div className="hero-bg-mesh" />
          <div className="leaf-float lf-one">✦</div>
          <div className="leaf-float lf-two">✦</div>

          <div className="hero-main">
            <div className="container hero-grid">
              <div className="hero-copy">
                <div className="eyebrow">
                  <span className="pulse" />
                  {t.eye}
                </div>
                <h1>
                  Reimagine
                  <br />
                  <em className="h1-accent">Waste.</em>
                  <br />
                  <strong>{t.end}</strong>
                </h1>
                <p className="hero-lead">{t.lead}</p>
                <div className="hero-actions">
                  {user ? (
                    <button
                      className="primary-btn"
                      onClick={() => scroll('pitch')}
                      style={{ background: 'linear-gradient(135deg, var(--green), var(--green-deep))' }}
                    >
                      🌱 Go to My Idea Pitch Workspace ↓
                    </button>
                  ) : (
                    <button className="primary-btn" onClick={() => scroll('register')}>
                      {t.reg} <ArrowRight size={21} />
                    </button>
                  )}
                  <button className="text-btn" onClick={() => scroll('challenges')}>
                    <span>{t.explore}</span> <ChevronDown className="explore-arrow" size={19} />
                  </button>
                  <button className="poster-pill-btn" onClick={() => setShowPoster(true)}>
                    <FileText size={16} /> {t.posterBtn}
                  </button>
                </div>

                <div className="hero-stats-row">
                  <div className="micro-stats">
                    <div>
                      <strong>2–4</strong>
                      <span>{t.stats[0]}</span>
                    </div>
                    <div>
                      <strong>∞</strong>
                      <span>{t.stats[1]}</span>
                    </div>
                    <div>
                      <strong>03</strong>
                      <span>{t.stats[2]}</span>
                    </div>
                  </div>

                  <div className="hero-countdown">
                    <span className="hero-countdown-label">
                      <Clock3 size={13} /> {lang === 'en' ? 'CLOSES 28 SEP' : '28 ಸೆಪ್ಟೆಂಬರ್ ಕೊನೆಯ ದಿನ'}
                    </span>
                    <div className="hero-countdown-grid">
                      {['D', 'H', 'M', 'S'].map((unit, idx) => (
                        <Fragment key={unit}>
                          <div className="cd-box">
                            <b>{time[idx]}</b>
                            <small>{unit}</small>
                          </div>
                          {idx < 3 && <span className="cd-sep">:</span>}
                        </Fragment>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="hero-art">
                <div className="orbit orbit-a" />
                <div className="orbit orbit-b" />
                <div className="earth-card">
                  <div className="earth-top">
                    <span>{lang === 'en' ? 'SMART INTERVENTION' : 'ಚುರುಕಾದ ಪರಿಹಾರ'}</span>
                    <span>2026</span>
                  </div>
                  <div className="earth-visual">
                    <div className="earth">
                      <div className="land land-a" />
                      <div className="land land-b" />
                      <div className="land land-c" />
                      <div className="cloud cloud-a" />
                      <div className="cloud cloud-b" />
                    </div>
                    <div className="earth-shadow" />
                    <div className="leaf-ring">
                      <Leaf size={40} fill="currentColor" />
                    </div>
                  </div>
                  <div className="earth-bottom">
                    <span>{lang === 'en' ? 'Clean communities' : 'ಸ್ವಚ್ಛ ಸಮುದಾಯಗಳು'}</span>
                    <span>·</span>
                    <span>{lang === 'en' ? 'Healthy planet' : 'ಆರೋಗ್ಯಕರ ಭೂಮಿ'}</span>
                    <span>·</span>
                    <span>{lang === 'en' ? 'Brighter future' : 'ಉಜ್ವಲ ಭವಿಷ್ಯ'}</span>
                  </div>
                </div>
                <div className="floating-card fc-one">
                  <Lightbulb size={20} />
                  <span>
                    <b>{lang === 'en' ? 'Smart' : 'ಚುರುಕಾದ'}</b> {lang === 'en' ? 'intervention' : 'ಪರಿಹಾರ'}
                  </span>
                </div>
                <div className="floating-card fc-two">
                  <Recycle size={20} />
                  <span>Reduce · Reuse · Recycle · Reimagine</span>
                </div>
              </div>
            </div>
          </div>

          {/* ECO CITY SKYLINE SILHOUETTE (MATCHING POSTER BACKDROP) */}
          <div className="hero-skyline" aria-hidden="true">
            <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
              <path
                d="M0,120 L0,85 L45,85 L45,52 L85,52 L85,85 L120,85 L120,38 L175,38 L175,85 L210,85 L210,62 L260,62 L260,85 L340,85 C370,65 410,65 440,85 L510,85 L510,42 L560,42 L560,85 L600,85 L600,28 L665,28 L665,85 L730,85 C770,58 820,58 860,85 L920,85 L920,48 L975,48 L975,85 L1020,85 L1020,34 L1085,34 L1085,85 L1140,85 C1180,62 1230,62 1270,85 L1320,85 L1320,55 L1375,55 L1375,85 L1440,85 L1440,120 Z"
                fill="rgba(12, 91, 53, 0.09)"
              />
              <path
                d="M0,120 L0,95 C180,72 360,105 540,88 C720,70 920,102 1120,84 C1260,72 1360,90 1440,82 L1440,120 Z"
                fill="rgba(12, 91, 53, 0.16)"
              />
            </svg>
          </div>

          {/* INTEGRATED TICKER BANNER */}
          <div className="ticker">
            <div className="ticker-track">
              {[...Array(2)].map((_, idx) => (
                <div className="ticker-content" key={idx}>
                  <span>REDUCE</span>
                  <i>✦</i>
                  <span>REUSE</span>
                  <i>✦</i>
                  <span>RECYCLE</span>
                  <i>✦</i>
                  <span>REIMAGINE</span>
                  <i>✦</i>
                  <span>CLEAN COMMUNITIES</span>
                  <i>✦</i>
                  <span>HEALTHY PLANET</span>
                  <i>✦</i>
                  <span>BRIGHTER FUTURE</span>
                  <i>✦</i>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* VIEW 1: INTRO / THE WHY (BENTO IMPACT GRID) */}
        <section className="section intro snap-section" id="about">
          <div className="container">
            <div className="about-layout">
              <div className="about-left">
                <p className="section-kicker">{t.about.kicker}</p>
                <h2>{t.about.title}</h2>
                <p className="about-lead">{t.about.p1}</p>
                <p className="about-sub">{t.about.p2}</p>

                {/* DARK FOREST POSTER BANNER CARD */}
                <div className="motto-banner">
                  <div className="motto-icon">
                    <Lightbulb size={28} />
                  </div>
                  <div>
                    <span className="motto-kicker">{t.about.mottoSub}</span>
                    <h3>“{t.about.mottoTitle}”</h3>
                  </div>
                </div>

                {/* 4 SMART INTERVENTION PILLARS */}
                <div className="pillars-grid">
                  {t.about.pillars.map(([pTitle, pDesc], idx) => (
                    <div className="pillar-chip" key={pTitle}>
                      <span className="pillar-num">0{idx + 1}</span>
                      <div>
                        <b>{pTitle}</b>
                        <small>{pDesc}</small>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="about-bento">
                {t.about.bento.map((card, i) => (
                  <article className={`bento-card bento-${i + 1}`} key={card.title}>
                    <div className="bento-top">
                      <span className="bento-badge">{card.badge}</span>
                      <span className="bento-metric">{card.metric}</span>
                    </div>
                    <h3>{card.title}</h3>
                    <p>{card.desc}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* VIEW 2: CHALLENGES (COLOR-CODED POSTER TRACKS + CLICKABLE SUBTOPICS) */}
        <section className={`section challenge-section theme-${currentChallenge.theme} snap-section`} id="challenges">
          <div className="container">
            <div className="section-heading">
              <div>
                <p className="section-kicker">{t.challenge.kicker}</p>
                <h2>{t.challenge.title}</h2>
              </div>
              <p>{t.challenge.sub}</p>
            </div>

            <div className="challenge-layout">
              <div className="challenge-list" role="tablist" aria-label="Challenges">
                {t.challenges.map((item, i) => {
                  const TrackIcon = item.icon;
                  return (
                    <button
                      className={`challenge-item track-${item.theme} ${active === i ? 'active' : ''}`}
                      key={item.title}
                      onClick={() => handleChallengeChange(i)}
                      role="tab"
                      aria-selected={active === i}
                    >
                      <span className="challenge-num">0{i + 1}</span>
                      <span className="challenge-icon">
                        <TrackIcon size={24} />
                      </span>
                      <div className="challenge-item-text">
                        <span className="challenge-title">{item.title}</span>
                        <span className="challenge-subcount">
                          {item.subtopics.map((s) => s.name).join(' · ')}
                        </span>
                      </div>
                      <ArrowUpRight className="challenge-arrow" size={22} />
                    </button>
                  );
                })}
              </div>

              <div className={`challenge-detail detail-${currentChallenge.theme}`} key={active}>
                <div className="challenge-detail-content">
                  <div className="detail-header-row">
                    <div className="detail-icon">
                      <Icon size={32} />
                    </div>
                    <span className="detail-num">
                      {lang === 'en' ? 'FOCUS AREA' : 'ಗಮನ ಕ್ಷೇತ್ರ'} 0{active + 1} / 03
                    </span>
                  </div>

                  <h3>{currentChallenge.title}</h3>
                  <p>{currentChallenge.desc}</p>

                  {/* INTERACTIVE SUB-TOPIC TAGS */}
                  <div className="tag-list" role="tablist" aria-label="Sub-topics">
                    {currentChallenge.subtopics.map((sub, sIdx) => (
                      <button
                        key={sub.name}
                        type="button"
                        className={`tag-pill ${activeSubtopic === sIdx ? 'active' : ''}`}
                        onClick={() => setActiveSubtopic(sIdx)}
                      >
                        <Check size={14} />
                        {sub.name}
                      </button>
                    ))}
                  </div>

                  {/* DYNAMIC SUB-TOPIC INTERVENTION PROMPT BOX */}
                  <div className="subtopic-spotlight">
                    <span className="spotlight-kicker">
                      <Sparkles size={14} /> {t.challenge.promptLabel}: <b>{currentSub.name}</b>
                    </span>
                    <p>{currentSub.prompt}</p>
                  </div>

                  <button
                    className="detail-link"
                    onClick={() => selectTrackForRegistration(active, activeSubtopic)}
                  >
                    {t.challenge.cta} ({currentSub.name})
                    <ArrowRight size={19} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* VIEW 3: BENEFITS / THE EXPERIENCE (DEEP FOREST DARK THEME) */}
        <section className="section benefits-dark snap-section" id="why">
          <div className="container">
            <div className="section-heading centered">
              <p className="section-kicker">{lang === 'en' ? '03 — THE EXPERIENCE' : '03 — ಅನುಭವ'}</p>
              <h2>
                {lang === 'en' ? (
                  <>
                    Make your idea <span>matter.</span>
                  </>
                ) : (
                  <>
                    ನಿಮ್ಮ ಆಲೋಚನೆಯನ್ನು <span>ಮಹತ್ವದ್ದಾಗಿಸಿ.</span>
                  </>
                )}
              </h2>
              <p>
                {lang === 'en'
                  ? 'Don’t wait for a perfect solution. Start with a meaningful problem and a bold intervention.'
                  : 'ಪರಿಪೂರ್ಣ ಪರಿಹಾರಕ್ಕಾಗಿ ಕಾಯಬೇಡಿ. ಅರ್ಥಪೂರ್ಣ ಸಮಸ್ಯೆ ಮತ್ತು ಉತ್ತಮ ಪ್ರಶ್ನೆಯಿಂದ ಪ್ರಾರಂಭಿಸಿ.'}
              </p>
            </div>

            <div className="benefit-grid">
              {t.benefits.map(([title, copy], i) => (
                <article className="benefit-card-dark" key={title}>
                  <div className="benefit-card-top">
                    <span className="benefit-num">0{i + 1}</span>
                    <div className="benefit-icon-dark">
                      <Sparkles size={22} />
                    </div>
                  </div>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </article>
              ))}
            </div>

            {/* EVALUATION RUBRIC BAR */}
            <div className="rubric-bar">
              <span className="rubric-label">{t.rubricTitle}</span>
              <div className="rubric-items">
                {t.rubric.map(([rTitle, rDesc]) => (
                  <div className="rubric-item" key={rTitle}>
                    <b>{rTitle}</b>
                    <span>{rDesc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* VIEW 4: TIMELINE (POSTER GREEN -> BLUE -> PURPLE MILESTONE CARDS) */}
        <section className="section timeline-section snap-section" id="timeline">
          <div className="container">
            <div className="section-heading">
              <div>
                <p className="section-kicker">{lang === 'en' ? '04 — MARK YOUR CALENDAR' : '04 — ನಿಮ್ಮ ಕ್ಯಾಲೆಂಡರ್ ಗುರುತಿಸಿ'}</p>
                <h2>
                  {lang === 'en' ? (
                    <>
                      From idea
                      <br />
                      <span>to impact.</span>
                    </>
                  ) : (
                    <>
                      ಆಲೋಚನೆಯಿಂದ
                      <br />
                      <span>ಪರಿಣಾಮದವರೆಗೆ.</span>
                    </>
                  )}
                </h2>
              </div>
              <div className="countdown">
                <span>{lang === 'en' ? 'REGISTRATION CLOSES IN' : 'ನೋಂದಣಿ ಮುಕ್ತಾಯವಾಗಲು ಬಾಕಿ'}</span>
                <div>
                  {time.map((x, i) => (
                    <Fragment key={i}>
                      <b>{x}</b>
                      {i < 3 && <i>:</i>}
                    </Fragment>
                  ))}
                </div>
                <small>{lang === 'en' ? 'days · hours · mins · secs' : 'ದಿನ · ಗಂಟೆ · ನಿಮಿಷ · ಸೆಕೆಂಡ್'}</small>
              </div>
            </div>

            <div className="timeline-cards">
              {t.timeline.map((step, i) => (
                <article className={`timeline-card step-${step.color}`} key={step.date}>
                  <div className="timeline-card-ribbon">
                    <span className="step-badge">STAGE 0{i + 1}</span>
                    <span className="step-date">
                      <CalendarDays size={15} /> {step.date}
                    </span>
                  </div>
                  <div className="timeline-card-body">
                    <h3>{step.title}</h3>
                    <p>{step.copy}</p>
                    <ul className="timeline-checklist">
                      {step.items.map((item) => (
                        <li key={item}>
                          <Check size={15} /> <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* VIEW 5: RULES & INTERACTIVE FAQ */}
        <section className="section rules snap-section" id="faq">
          <div className="container rules-grid">
            <div>
              <p className="section-kicker">{lang === 'en' ? '05 — RULES & FAQ' : '05 — ನಿಯಮಗಳು ಮತ್ತು ಮಾಹಿತಿ'}</p>
              <h2>
                {lang === 'en' ? (
                  <>
                    Ready to
                    <br />
                    <span>make a difference?</span>
                  </>
                ) : (
                  <>
                    ವ್ಯತ್ಯಾಸವನ್ನು
                    <br />
                    <span>ಮಾಡಲು ಸಿದ್ಧವೇ?</span>
                  </>
                )}
              </h2>
              <p className="rules-lead">
                {lang === 'en'
                  ? 'Everything you need to get started is simple: bring a team, choose a real problem and make your idea useful.'
                  : 'ಪ್ರಾರಂಭಿಸಲು ಬೇಕಾಗಿರುವುದು ಸರಳ: ತಂಡವನ್ನು ಕರೆತನ್ನಿ, ನೈಜ ಸಮಸ್ಯೆಯನ್ನು ಆರಿಸಿ ಮತ್ತು ನಿಮ್ಮ ಆಲೋಚನೆಯನ್ನು ಉಪಯುಕ್ತಗೊಳಿಸಿ.'}
              </p>

              <div className="rule-tiles">
                {[
                  [Users, lang === 'en' ? 'TEAM SIZE' : 'ತಂಡದ ಗಾತ್ರ', lang === 'en' ? '2–4 Members' : '2–4 ಜನರು'],
                  [Clock3, lang === 'en' ? 'AGE LIMIT' : 'ವಯಸ್ಸಿನ ಮಿತಿ', lang === 'en' ? 'No Age Limit' : 'ವಯಸ್ಸಿನ ಮಿತಿ ಇಲ್ಲ'],
                  [Trophy, lang === 'en' ? 'FORMAT' : 'ಸ್ವರೂಪ', lang === 'en' ? 'Idea Presentation' : 'ನವೀನ ಆಲೋಚನೆ ಪ್ರಸ್ತುತಿ'],
                  [Check, lang === 'en' ? 'THE MINDSET' : 'ಮನೋಭಾವ', lang === 'en' ? 'Curious · Practical · Bold' : 'ಕುತೂಹಲ · ಪ್ರಾಯೋಗಿಕ'],
                ].map(([I, label, value]) => (
                  <div className="rule-tile" key={label}>
                    <div className="rule-tile-icon">
                      <I size={22} />
                    </div>
                    <div>
                      <span>{label}</span>
                      <b>{value}</b>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* INTERACTIVE ACCORDION FAQ */}
            <div className="faq-box">
              <div className="faq-box-header">
                <HelpCircle size={20} />
                <span>{lang === 'en' ? 'FREQUENTLY ASKED QUESTIONS' : 'ಸಾಮಾನ್ಯ ಪ್ರಶ್ನೆಗಳು (FAQ)'}</span>
              </div>
              <div className="faq-list">
                {t.faqs.map(([q, a], idx) => {
                  const isOpen = openFaq === idx;
                  return (
                    <div className={`faq-item ${isOpen ? 'open' : ''}`} key={q}>
                      <button
                        type="button"
                        className="faq-question"
                        onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                        aria-expanded={isOpen}
                      >
                        <span>{q}</span>
                        <ChevronDown className="faq-chevron" size={18} />
                      </button>
                      {isOpen && <div className="faq-answer">{a}</div>}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* VIEW 5.5: IDEA PITCH & TEAM SUBMISSION WORKSPACE */}
        {user ? (
          <IdeaPitchSection />
        ) : null}

        {/* VIEW 6: REGISTER CTA, INTERACTIVE FORM & FOOTER */}
        <section className="register snap-section" id="register">
          <div className="register-leaf">
            <Leaf size={230} />
          </div>
          <div className="register-main">
            <div className="container register-grid">
              {/* LEFT: CALL TO ACTION + POSTER QR / CONTACT HUB */}
              <div className="register-left">
                <p className="section-kicker">{lang === 'en' ? '06 — YOUR TURN' : '06 — ನಿಮ್ಮ ಸರದಿ'}</p>
                <h2>
                  {lang === 'en' ? (
                    <>
                      What will you
                      <br />
                      <em>reimagine?</em>
                    </>
                  ) : (
                    <>
                      ನೀವು ಏನನ್ನು
                      <br />
                      <em>ಮರುಕಲ್ಪಿಸುವಿರಿ?</em>
                    </>
                  )}
                </h2>
                <p className="register-copy">
                  {lang === 'en'
                    ? 'Bring your team of 2–4. Choose your focus stream. Submit your smart intervention for a cleaner, greener tomorrow.'
                    : 'ನಿಮ್ಮ ತಂಡವನ್ನು ತನ್ನಿ. ಪ್ರಶ್ನೆಗಳನ್ನು ತನ್ನಿ. ರೂಪಿಸಲು ಯೋಗ್ಯವಾದ ಆಲೋಚನೆಯನ್ನು ತನ್ನಿ.'}
                </p>

                {/* POSTER QR & CONTACT BLOCK */}
                <div className="poster-contact-card">
                  <div className="qr-block" onClick={() => setShowPoster(true)} title="Click to view full poster">
                    <QrCode size={58} />
                    <span>{lang === 'en' ? 'Scan / View Poster' : 'ಪೋಸ್ಟರ್ ವೀಕ್ಷಿಸಿ'}</span>
                  </div>
                  <div className="contact-details">
                    <span className="contact-heading">
                      {lang === 'en' ? 'IDEATHON HELPDESK & UPDATES' : 'ಸಂಪರ್ಕ ಮತ್ತು ಮಾಹಿತಿ'}
                    </span>
                    <div className="contact-pills">
                      <a href="mailto:hasirusamvada@reimagine.org" className="contact-pill">
                        <Mail size={15} /> hasirusamvada@reimagine.org
                      </a>
                      <a href="tel:+919880000000" className="contact-pill">
                        <Phone size={15} /> +91 98800 00000
                      </a>
                      <button type="button" className="contact-pill whatsapp" onClick={() => setShowPoster(true)}>
                        <MessageCircle size={15} /> WhatsApp / QR Scanner
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT: INTERACTIVE TEAM REGISTRATION FORM CARD */}
              <div className="register-form-card">
                <span className="form-badge">{t.form.badge}</span>
                <h3>{t.form.title}</h3>

                {submitted ? (
                  <div className="form-success">
                    <div className="success-icon">
                      <Check size={32} />
                    </div>
                    <h4>{t.form.successTitle}</h4>
                    <p>{t.form.successMsg}</p>
                    <div className="success-summary">
                      <span>
                        <b>{formState.teamName || 'Team'}</b> · {formState.size}
                      </span>
                      <span>
                        {t.challenges[formState.trackIndex]?.title} —{' '}
                        {t.challenges[formState.trackIndex]?.subtopics[formState.subtopicIndex]?.name}
                      </span>
                    </div>
                    <button
                      type="button"
                      className="register-btn"
                      onClick={() => setSubmitted(false)}
                    >
                      {t.form.reset}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleFormSubmit} className="team-form">
                    <div className="form-row">
                      <label>
                        <span>{t.form.teamName} *</span>
                        <input
                          type="text"
                          required
                          placeholder={t.form.teamNamePh}
                          value={formState.teamName}
                          onChange={(e) => setFormState({ ...formState, teamName: e.target.value })}
                        />
                      </label>
                      <label>
                        <span>{t.form.leadName} *</span>
                        <input
                          type="text"
                          required
                          placeholder={t.form.leadNamePh}
                          value={formState.leadName}
                          onChange={(e) => setFormState({ ...formState, leadName: e.target.value })}
                        />
                      </label>
                    </div>

                    <div className="form-row">
                      <label>
                        <span>{t.form.email} *</span>
                        <input
                          type="email"
                          required
                          placeholder={t.form.emailPh}
                          value={formState.email}
                          onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                        />
                      </label>
                      <label>
                        <span>{t.form.phone} *</span>
                        <input
                          type="tel"
                          required
                          placeholder={t.form.phonePh}
                          value={formState.phone}
                          onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                        />
                      </label>
                    </div>

                    <div className="form-row three-col">
                      <label>
                        <span>{t.form.size}</span>
                        <select
                          value={formState.size}
                          onChange={(e) => setFormState({ ...formState, size: e.target.value })}
                        >
                          <option value="2 Members">2 Members</option>
                          <option value="3 Members">3 Members</option>
                          <option value="4 Members">4 Members</option>
                        </select>
                      </label>

                      <label>
                        <span>{t.form.track}</span>
                        <select
                          value={formState.trackIndex}
                          onChange={(e) =>
                            setFormState({
                              ...formState,
                              trackIndex: Number(e.target.value),
                              subtopicIndex: 0,
                            })
                          }
                        >
                          {t.challenges.map((tr, idx) => (
                            <option key={tr.title} value={idx}>
                              {tr.title}
                            </option>
                          ))}
                        </select>
                      </label>

                      <label>
                        <span>{t.form.subtopic}</span>
                        <select
                          value={formState.subtopicIndex}
                          onChange={(e) =>
                            setFormState({ ...formState, subtopicIndex: Number(e.target.value) })
                          }
                        >
                          {t.challenges[formState.trackIndex]?.subtopics.map((st, sIdx) => (
                            <option key={st.name} value={sIdx}>
                              {st.name}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>

                    <div className="form-row">
                      <label>
                        <span>{lang === 'en' ? 'Create Password *' : 'ಪಾಸ್‌ವರ್ಡ್ ರಚಿಸಿ *'}</span>
                        <input
                          type="password"
                          placeholder={lang === 'en' ? 'Min 6 characters (e.g. Pass@2026)' : 'ಕನಿಷ್ಠ ೬ ಅಕ್ಷರಗಳು'}
                          value={formState.password}
                          onChange={(e) => setFormState({ ...formState, password: e.target.value })}
                          required
                        />
                      </label>
                    </div>

                    <label>
                      <span>{t.form.idea}</span>
                      <textarea
                        rows={2}
                        placeholder={t.form.ideaPh}
                        value={formState.idea}
                        onChange={(e) => setFormState({ ...formState, idea: e.target.value })}
                      />
                    </label>

                    <button type="submit" className="register-btn full-width" disabled={isSubmitting}>
                      {isSubmitting
                        ? (lang === 'en' ? 'Creating Account & Workspace...' : 'ಖಾತೆ ರಚಿಸಲಾಗುತ್ತಿದೆ...')
                        : (
                          <>
                            {t.form.submit} <ArrowUpRight size={20} />
                          </>
                        )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
