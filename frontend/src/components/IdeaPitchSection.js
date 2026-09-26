'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../lib/api';
import {
  Sparkles,
  CheckCircle,
  Lock,
  Clock,
  Send,
  Save,
  Users,
  AlertCircle,
  Trophy,
  Calendar,
  MapPin,
  RefreshCw,
  Plus,
  Trash2,
} from 'lucide-react';

const pitchSectionTranslations = {
  en: {
    tag: 'Team & Submissions',
    title: '🌱 Idea Pitch & Evaluation Workspace',
    subtitleLeader: 'Logged in as Team Leader:',
    refreshBtn: 'Refresh Status',
    activeTeam: 'Active Team:',
    theme: 'Theme:',
    round1: 'Round 1:',
    round2: 'Round 2:',
    grandFinalist: '🏆 GRAND FINALIST',
    tabTeam: 'My Team & Members',
    tabCreateTeam: 'Create Team',
    tabRound1: 'Round 1: Idea Pitch',
    tabRound2: 'Round 2: Deep-Dive Dossier',
    tabFinale: 'Grand Finale Pass',
    rosterTitle: 'Team Roster:',
    designatedLeader: 'Designated Leader',
    teammate: 'Teammate',
    noPhone: 'No phone',
    proceedToR1: 'Proceed to Round 1 Idea Pitch →',
    createTeamTitle: 'Create Your Team',
    createTeamSubtitle: 'Solo participation is supported (1 person). You can optionally add up to 2 teammates.',
    teamNameLabel: 'Team Name *',
    teamNamePh: 'e.g. EcoInnovators Hub',
    trackLabel: 'Primary Waste Challenge Track *',
    trackOption: '-- Choose Focus Track --',
    optionalTeammates: 'Optional Team Members',
    addTeammate: 'Add Teammate',
    fullNamePh: 'Teammate Full Name',
    emailPh: 'Teammate Email',
    phonePh: 'Teammate Phone',
    createTeamBtn: 'Create Team & Continue →',
    r1Title: 'Round 1: Idea Pitch Submission',
    r1Deadline: 'Deadline: Nov 1, 2026 • Clear, concise problem definition & technical solution',
    r1LockedBadge: '🔒 SELECTED for Round 2 (Pitch Locked)',
    r1CreateTeamFirst: 'Please create your team first to submit a Round 1 pitch.',
    createTeamNow: 'Create Team Now →',
    r1ProblemLabel: '1. Problem Statement & Root Cause Brief *',
    r1ProblemPh: 'Clearly articulate the specific waste challenge, affected ecosystem/community, and why existing solutions fail...',
    r1SolutionLabel: '2. Proposed Technical Architecture & Intervention *',
    r1SolutionPh: 'Describe your technical innovation, mechanical/chemical workflow, digital tools, and expected practical impact...',
    saveDraft: 'Save as Draft',
    finalSubmit: 'Final Submit Proposal',
    r1Congrats: 'Congratulations! Your team was selected in Round 1. Proceed to Round 2: Deep-Dive Dossier to submit your 90-day plan.',
    r2Title: 'Round 2: Concept Elaboration & 90-Day Feasibility Plan',
    r2Timeline: 'Timeline: Nov 2 – Dec 1, 2026 • Strict access for teams marked SELECTED in Round 1',
    r2LockedTitle: 'Round 2 Access Locked',
    r2LockedDesc: 'Round 2 is strictly unlocked once your Round 1 pitch is evaluated and marked SELECTED by the expert panel.',
    q1Label: '1. Detailed Concept & Technical Specifications *',
    q1Ph: 'Comprehensive technical architecture, components, workflows, and process flows...',
    q2Label: '2. Value Proposition & Circularity Model *',
    q2Ph: 'How does your solution transform waste into reusable value or resource loops...',
    q3Label: '3. 90-Day Implementation & Pilot Feasibility Plan *',
    q3Ph: 'Milestone roadmap: Month 1 (Lab validation), Month 2 (Pilot run), Month 3 (Community rollout)...',
    q4Label: '4. Resource Requirements & Budget Estimates *',
    q4Ph: 'Estimated seed budget, hardware/cloud infrastructure needs, and mentors required...',
    r2SubmitBtn: 'Submit Round 2 Dossier',
    finalePassTitle: 'Official Grand Finale Stage Pass',
    finalePassSub: 'Hasiru Samvadha Ideathon 2026 • Live Jury Demonstration',
    eventDate: 'Event Date',
    timeSlot: 'Time Slot',
    pitchDuration: 'Allocated Pitch Duration',
    venue: 'Auditorium Stage / Venue',
    instructionsTitle: 'SPECIAL INSTRUCTIONS FOR PRESENTERS:',
    wordsUnit: 'words',
  },
  kn: {
    tag: 'ತಂಡ & ಆಲೋಚನಾ ಸಲ್ಲಿಕೆ',
    title: '🌱 ಆಲೋಚನಾ ಸಲ್ಲಿಕೆ ಮತ್ತು ಮೌಲ್ಯಮಾಪನ ವೇದಿಕೆ',
    subtitleLeader: 'ಲಾಗಿನ್ ಆಗಿರುವ ತಂಡದ ನಾಯಕರು:',
    refreshBtn: 'ಸ್ಥಿತಿ ನವೀಕರಿಸಿ',
    activeTeam: 'ಸಕ್ರಿಯ ತಂಡ:',
    theme: 'ವಿಷಯ:',
    round1: 'ಹಂತ ೧:',
    round2: 'ಹಂತ ೨:',
    grandFinalist: '🏆 ಗ್ರ್ಯಾಂಡ್ ಫಿನಾಲೆ ಆಯ್ಕೆ',
    tabTeam: 'ನನ್ನ ತಂಡ ಮತ್ತು ಸದಸ್ಯರು',
    tabCreateTeam: 'ತಂಡ ರಚಿಸಿ',
    tabRound1: 'ಹಂತ ೧: ಆಲೋಚನೆ ಸಲ್ಲಿಕೆ',
    tabRound2: 'ಹಂತ ೨: ವಿವರವಾದ ಯೋಜನೆ',
    tabFinale: 'ಗ್ರ್ಯಾಂಡ್ ಫಿನಾಲೆ ಪಾಸ್',
    rosterTitle: 'ತಂಡದ ವಿವರ:',
    designatedLeader: 'ತಂಡದ ನಾಯಕರು',
    teammate: 'ಸದಸ್ಯರು',
    noPhone: 'ಫೋನ್ ಇಲ್ಲ',
    proceedToR1: 'ಹಂತ ೧: ಆಲೋಚನೆ ಸಲ್ಲಿಕೆಗೆ ಮುಂದುವರಿಯಿರಿ →',
    createTeamTitle: 'ನಿಮ್ಮ ತಂಡವನ್ನು ರಚಿಸಿ',
    createTeamSubtitle: 'ಏಕವ್ಯಕ್ತಿ (೧ ವ್ಯಕ್ತಿ) ಭಾಗವಹಿಸುವಿಕೆಗೂ ಅವಕಾಶವಿದೆ. ಐಚ್ಛಿಕವಾಗಿ ೨ ಸದಸ್ಯರನ್ನು ಸೇರಿಸಬಹುದು.',
    teamNameLabel: 'ತಂಡದ ಹೆಸರು *',
    teamNamePh: 'ಉದಾ: ಹಸಿರು ತಂಡ',
    trackLabel: 'ತ್ಯಾಜ್ಯ ನಿರ್ವಹಣೆಯ ಸವಾಲಿನ ಕ್ಷೇತ್ರ *',
    trackOption: '-- ಸವಾಲಿನ ಕ್ಷೇತ್ರವನ್ನು ಆರಿಸಿ --',
    optionalTeammates: 'ತಂಡದ ಸದಸ್ಯರು (ಐಚ್ಛಿಕ)',
    addTeammate: 'ಸದಸ್ಯರನ್ನು ಸೇರಿಸಿ',
    fullNamePh: 'ಸದಸ್ಯರ ಪೂರ್ಣ ಹೆಸರು',
    emailPh: 'ಸದಸ್ಯರ ಇಮೇಲ್',
    phonePh: 'ಸದಸ್ಯರ ಫೋನ್',
    createTeamBtn: 'ತಂಡ ರಚಿಸಿ & ಮುಂದುವರಿಯಿರಿ →',
    r1Title: 'ಹಂತ ೧: ನವೀನ ಆಲೋಚನೆ ಸಲ್ಲಿಕೆ',
    r1Deadline: 'ಕೊನೆಯ ದಿನಾಂಕ: ನವೆಂಬರ್ ೧, ೨೦೨೬ • ಸ್ಪಷ್ಟ ಸಮಸ್ಯೆಯ ವಿವರಣೆ ಮತ್ತು ತಾಂತ್ರಿಕ ಪರಿಹಾರ',
    r1LockedBadge: '🔒 ಹಂತ ೨ ಕ್ಕೆ ಆಯ್ಕೆಯಾಗಿದೆ (ಪ್ರಸ್ತಾವನೆ ಲಾಕ್ ಆಗಿದೆ)',
    r1CreateTeamFirst: 'ಹಂತ ೧ ಆಲೋಚನೆ ಸಲ್ಲಿಸಲು ಮೊದಲು ನಿಮ್ಮ ತಂಡವನ್ನು ರಚಿಸಿ.',
    createTeamNow: 'ಈಗಲೇ ತಂಡ ರಚಿಸಿ →',
    r1ProblemLabel: '೧. ಸಮಸ್ಯೆಯ ವಿವರಣೆ ಮತ್ತು ಕಾರಣಗಳ ವಿಶ್ಲೇಷಣೆ *',
    r1ProblemPh: 'ತ್ಯಾಜ್ಯ ಸಮಸ್ಯೆಯ ಸ್ವರೂಪ, ಬಾಧಿತ ಸಮುದಾಯ ಮತ್ತು ಪ್ರಸ್ತುತ ಪರಿಹಾರಗಳ ಮಿತಿಗಳನ್ನು ಸ್ಪಷ್ಟವಾಗಿ ವಿವರಿಸಿ...',
    r1SolutionLabel: '೨. ಪ್ರಸ್ತಾವಿತ ತಾಂತ್ರಿಕ ಪರಿಹಾರ ಮತ್ತು ರಚನೆ *',
    r1SolutionPh: 'ನಿಮ್ಮ ನವೀನ ತಂತ್ರಜ್ಞಾನ, ಯಾಂತ್ರಿಕ/ರಾಸಾಯನಿಕ ವಿಧಾನ, ಡಿಜಿಟಲ್ ಉಪಕರಣಗಳು ಮತ್ತು ಪ್ರಾಯೋಗಿಕ ಪರಿಣಾಮವನ್ನು ವಿವರಿಸಿ...',
    saveDraft: 'ಕರಡನ್ನು ಉಳಿಸಿ',
    finalSubmit: 'ಅಂತಿಮ ಪ್ರಸ್ತಾವನೆ ಸಲ್ಲಿಸಿ',
    r1Congrats: 'ಅಭಿನಂದನೆಗಳು! ನಿಮ್ಮ ತಂಡವು ಹಂತ ೧ ರಲ್ಲಿ ಆಯ್ಕೆಯಾಗಿದೆ. ನಿಮ್ಮ ೯೦ ದಿನಗಳ ಯೋಜನೆ ಸಲ್ಲಿಸಲು ಹಂತ ೨ ಕ್ಕೆ ಮುಂದುವರಿಯಿರಿ.',
    r2Title: 'ಹಂತ ೨: ಪರಿಕಲ್ಪನೆಯ ವಿವರಣೆ ಮತ್ತು ೯೦ ದಿನಗಳ ಯೋಜನೆ',
    r2Timeline: 'ಸಮಯಾವಧಿ: ನವೆಂಬರ್ ೨ – ಡಿಸೆಂಬರ್ ೧, ೨೦೨೬ • ಹಂತ ೧ ರಲ್ಲಿ ಆಯ್ಕೆಯಾದ ತಂಡಗಳಿಗೆ ಮಾತ್ರ',
    r2LockedTitle: 'ಹಂತ ೨ ಪ್ರವೇಶ ಲಾಕ್ ಆಗಿದೆ',
    r2LockedDesc: 'ತೀರ್ಪುಗಾರರ ಮಂಡಳಿಯು ನಿಮ್ಮ ಹಂತ ೧ ರ ಆಲೋಚನೆಯನ್ನು ಮೌಲ್ಯಮಾಪನ ಮಾಡಿ ಆಯ್ಕೆ ಮಾಡಿದ ನಂತರ ಹಂತ ೨ ಮುಕ್ತವಾಗುತ್ತದೆ.',
    q1Label: '೧. ವಿವರವಾದ ಪರಿಕಲ್ಪನೆ ಮತ್ತು ತಾಂತ್ರಿಕ ವಿವರಣೆಗಳು *',
    q1Ph: 'ಸಮಗ್ರ ತಾಂತ್ರಿಕ ವಿನ್ಯಾಸ, ಘಟಕಗಳು, ಕಾರ್ಯವಿಧಾನ ಮತ್ತು ಪ್ರಕ್ರಿಯೆ...',
    q2Label: '೨. ಮೌಲ್ಯ ಮತ್ತು ವೃತ್ತಾಕಾರದ ಆರ್ಥಿಕತೆಯ ಮಾದರಿ *',
    q2Ph: 'ನಿಮ್ಮ ಪರಿಹಾರವು ತ್ಯಾಜ್ಯವನ್ನು ಹೇಗೆ ಮರುಬಳಕೆಯ ಮೌಲ್ಯವನ್ನಾಗಿ ಪರಿವರ್ತಿಸುತ್ತದೆ...',
    q3Label: '೩. ೯೦ ದಿನಗಳ ಅನುಷ್ಠಾನ ಮತ್ತು ಪ್ರಾಯೋಗಿಕ ಪರೀಕ್ಷಾ ಯೋಜನೆ *',
    q3Ph: 'ಹಂತಗಳ ಯೋಜನೆ: ತಿಂಗಳು ೧ (ಪ್ರಯೋಗಾಲಯ ಪರೀಕ್ಷೆ), ತಿಂಗಳು ೨ (ಪ್ರಾಯೋಗಿಕ ಚಾಲನೆ), ತಿಂಗಳು ೩ (ಸಮುದಾಯ ಅನುಷ್ಠಾನ)...',
    q4Label: '೪. ಸಂಪನ್ಮೂಲಗಳ ಅಗತ್ಯತೆ ಮತ್ತು ಬಜೆಟ್ ಅಂದಾಜು *',
    q4Ph: 'ಅಗತ್ಯವಿರುವ ಬಜೆಟ್, ಹಾರ್ಡ್‌ವೇರ್/ಕ್ಲೌಡ್ ಸೌಲಭ್ಯಗಳು ಮತ್ತು ಮಾರ್ಗದರ್ಶಕರ ಅಗತ್ಯತೆ...',
    r2SubmitBtn: 'ಹಂತ ೨ ರ ಯೋಜನೆಯನ್ನು ಸಲ್ಲಿಸಿ',
    finalePassTitle: 'ಅಧಿಕೃತ ಗ್ರ್ಯಾಂಡ್ ಫಿನಾಲೆ ವೇದಿಕೆ ಪಾಸ್',
    finalePassSub: 'ಹಸಿರು ಸಂವಾದ ಐಡಿಯಾಥಾನ್ ೨೦೨೬ • ತೀರ್ಪುಗಾರರ ಎದುರು ನೇರ ಪ್ರಾತ್ಯಕ್ಷಿಕೆ',
    eventDate: 'ಕಾರ್ಯಕ್ರಮದ ದಿನಾಂಕ',
    timeSlot: 'ನಿಗದಿತ ಸಮಯ',
    pitchDuration: 'ಪ್ರಸ್ತುತಿಯ ಕಾಲಾವಧಿ',
    venue: 'ವೇದಿಕೆ / ಸಭಾಂಗಣ',
    instructionsTitle: 'ಭಾಗವಹಿಸುವವರಿಗೆ ವಿಶೇಷ ಸೂಚನೆಗಳು:',
    wordsUnit: 'ಪದಗಳು',
  },
};

function countWords(str) {
  if (!str) return 0;
  const matches = str.trim().match(/\S+/g);
  return matches ? matches.length : 0;
}

export default function IdeaPitchSection() {
  const { user, token, showToast, lang = 'en' } = useAuth();

  const t = pitchSectionTranslations[lang] || pitchSectionTranslations.en;

  const [activeTab, setActiveTab] = useState('round1');
  const [team, setTeam] = useState(null);
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Team Creation Form
  const [teamName, setTeamName] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('');
  const [members, setMembers] = useState([]);

  // Round 1 Pitch State
  const [r1ThemeId, setR1ThemeId] = useState('');
  const [r1Problem, setR1Problem] = useState('');
  const [r1Solution, setR1Solution] = useState('');
  const [r1Submission, setR1Submission] = useState(null);

  // Round 2 Dossier State
  const [r2Data, setR2Data] = useState({
    detailedConcept: '',
    valuePropositionAndCircularity: '',
    feasibilityPlan90Days: '',
    resourceRequirements: '',
  });
  const [r2Submission, setR2Submission] = useState(null);

  // Finalist Details
  const [finalistPass, setFinalistPass] = useState(null);

  useEffect(() => {
    if (token && user) {
      loadData();
    }
  }, [token, user]);

  const loadData = async () => {
    setLoading(true);
    await Promise.all([loadThemes(), loadMyTeam()]);
    setLoading(false);
  };

  const loadThemes = async () => {
    try {
      const res = await apiRequest('/themes');
      const data = Array.isArray(res.data) ? res.data : (res.data?.themes || []);
      setThemes(data);
    } catch (e) {
      console.error(e);
    }
  };

  const loadMyTeam = async () => {
    try {
      const res = await apiRequest('/teams/my-team');
      const teamData = res.data && res.data._id ? res.data : null;
      if (res.ok && teamData) {
        setTeam(teamData);
        setR1ThemeId(teamData.theme?._id || teamData.theme || '');
        await Promise.all([loadRound1Data(), loadRound2Data()]);
        if (teamData.finalStatus === 'FINALIST') {
          loadFinalistDetails(teamData._id);
        }
      } else {
        setTeam(null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const loadRound1Data = async () => {
    try {
      const res = await apiRequest('/round1/submission');
      const s = res.data && res.data._id ? res.data : null;
      if (res.ok && s) {
        setR1Submission(s);
        setR1Problem(s.problemStatement || '');
        setR1Solution(s.proposedSolution || '');
        if (s.themeId) setR1ThemeId(s.themeId._id || s.themeId);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const loadRound2Data = async () => {
    try {
      const res = await apiRequest('/round2/submission');
      const s = res.data && res.data._id ? res.data : null;
      if (res.ok && s) {
        setR2Submission(s);
        setR2Data({
          detailedConcept: s.detailedConcept || '',
          valuePropositionAndCircularity: s.valuePropositionAndCircularity || s.valueProposition || '',
          feasibilityPlan90Days: s.feasibilityPlan90Days || '',
          resourceRequirements: s.resourceRequirements || '',
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const loadFinalistDetails = async (teamId) => {
    try {
      const res = await apiRequest(`/finalists/${teamId}`);
      const d = res.data && res.data.venue ? res.data : (res.data?.finalistDetails || null);
      if (res.ok && d) {
        setFinalistPass(d);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const addMemberRow = () => {
    if (members.length >= 2) {
      showToast(lang === 'kn' ? 'ಗರಿಷ್ಠ ೨ ಹೆಚ್ಚುವರಿ ಸದಸ್ಯರನ್ನು ಮಾತ್ರ ಸೇರಿಸಬಹುದು' : 'Maximum 2 additional teammates allowed (Leader + 2 members)', true);
      return;
    }
    setMembers([...members, { name: '', email: '', phone: '', roleInTeam: 'Technical / Design' }]);
  };

  const updateMemberField = (idx, field, val) => {
    const updated = [...members];
    updated[idx][field] = val;
    setMembers(updated);
  };

  const removeMemberRow = (idx) => {
    setMembers(members.filter((_, i) => i !== index));
  };

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    if (!selectedTheme) {
      showToast(lang === 'kn' ? 'ದಯವಿಟ್ಟು ಸವಾಲಿನ ವಿಷಯವನ್ನು ಆಯ್ಕೆಮಾಡಿ' : 'Please select a focus waste theme', true);
      return;
    }

    const payload = {
      teamName,
      themeId: selectedTheme,
      members: members.filter((m) => m.name && m.email && m.phone),
    };

    const res = await apiRequest('/teams', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      showToast(lang === 'kn' ? `ತಂಡ '${teamName}' ಯಶಸ್ವಿಯಾಗಿ ರಚಿಸಲ್ಪಟ್ಟಿದೆ!` : `Team '${teamName}' successfully created!`);
      await loadMyTeam();
      setActiveTab('round1');
    } else {
      showToast(res.message || (lang === 'kn' ? 'ತಂಡ ರಚನೆ ವಿಫಲವಾಗಿದೆ' : 'Failed to create team'), true);
    }
  };

  const handleR1Submit = async (isDraft) => {
    if (!r1Problem.trim()) {
      showToast(lang === 'kn' ? 'ದಯವಿಟ್ಟು ಸಮಸ್ಯೆಯ ವಿವರಣೆಯನ್ನು ನಮೂದಿಸಿ' : 'Please provide a problem statement.', true);
      return;
    }
    if (!r1Solution.trim()) {
      showToast(lang === 'kn' ? 'ದಯವಿಟ್ಟು ಪ್ರಸ್ತಾವಿತ ಪರಿಹಾರವನ್ನು ನಮೂದಿಸಿ' : 'Please describe your proposed solution.', true);
      return;
    }

    const problemWords = countWords(r1Problem);
    const solutionWords = countWords(r1Solution);

    if (problemWords > 150) {
      showToast(lang === 'kn' ? `ಸಮಸ್ಯೆಯ ವಿವರಣೆಯು ೧೫೦ ಪದಗಳ ಮಿತಿಯನ್ನು ಮೀರಿದೆ (${problemWords} ಪದಗಳು).` : `Problem statement exceeds 150 words (${problemWords} words).`, true);
      return;
    }
    if (solutionWords > 250) {
      showToast(lang === 'kn' ? `ಪ್ರಸ್ತಾವಿತ ಪರಿಹಾರವು ೨೫೦ ಪದಗಳ ಮಿತಿಯನ್ನು ಮೀರಿದೆ (${solutionWords} ಪದಗಳು).` : `Proposed solution exceeds 250 words (${solutionWords} words).`, true);
      return;
    }

    const res = await apiRequest('/round1/submit', {
      method: 'POST',
      body: JSON.stringify({
        themeId: r1ThemeId || team?.theme?._id || team?.theme,
        problemStatement: r1Problem,
        proposedSolution: r1Solution,
        isDraft,
      }),
    });

    if (res.ok) {
      showToast(isDraft ? (lang === 'kn' ? 'ಕರಡು ಯಶಸ್ವಿಯಾಗಿ ಉಳಿಸಲಾಗಿದೆ!' : 'Draft saved successfully!') : (lang === 'kn' ? '🎉 ಹಂತ ೧ ರ ಆಲೋಚನೆಯು ಸಲ್ಲಿಕೆಯಾಗಿದೆ!' : '🎉 Round 1 Idea Pitch submitted to MongoDB!'));
      await loadMyTeam();
      await loadRound1Data();
    } else {
      showToast(res.message || (lang === 'kn' ? 'ಸಲ್ಲಿಕೆ ವಿಫಲವಾಗಿದೆ' : 'Submission failed'), true);
    }
  };

  const handleR2Submit = async () => {
    const conceptWords = countWords(r2Data.detailedConcept);
    const valPropWords = countWords(r2Data.valuePropositionAndCircularity);
    const feasibilityWords = countWords(r2Data.feasibilityPlan90Days);
    const resourceWords = countWords(r2Data.resourceRequirements);

    if (!r2Data.detailedConcept.trim() || !r2Data.valuePropositionAndCircularity.trim()) {
      showToast(lang === 'kn' ? 'ದಯವಿಟ್ಟು ಅಗತ್ಯವಿರುವ ಎಲ್ಲಾ ವಿವರಗಳನ್ನು ಭರ್ತಿ ಮಾಡಿ' : 'Please fill out all required Round 2 sections.', true);
      return;
    }
    if (conceptWords > 1000) {
      showToast(lang === 'kn' ? `ವಿವರವಾದ ಪರಿಕಲ್ಪನೆಯು ೧೦೦೦ ಪದಗಳ ಮಿತಿಯನ್ನು ಮೀರಿದೆ (${conceptWords} ಪದಗಳು).` : `Detailed Concept exceeds 1000 words limit (${conceptWords} words).`, true);
      return;
    }
    if (valPropWords > 150) {
      showToast(lang === 'kn' ? `ಮೌಲ್ಯ ಮತ್ತು ಮರುಬಳಕೆಯ ವಿವರಣೆಯು ೧೫೦ ಪದಗಳ ಮಿತಿಯನ್ನು ಮೀರಿದೆ (${valPropWords} ಪದಗಳು).` : `Value Proposition exceeds 150 words limit (${valPropWords} words).`, true);
      return;
    }
    if (feasibilityWords > 200) {
      showToast(lang === 'kn' ? `೯೦ ದಿನಗಳ ಯೋಜನೆಯು ೨೦೦ ಪದಗಳ ಮಿತಿಯನ್ನು ಮೀರಿದೆ (${feasibilityWords} ಪದಗಳು).` : `90-Day Plan exceeds 200 words limit (${feasibilityWords} words).`, true);
      return;
    }
    if (resourceWords > 100) {
      showToast(lang === 'kn' ? `ಸಂಪನ್ಮೂಲಗಳ ಅಗತ್ಯತೆಯು ೧೦೦ ಪದಗಳ ಮಿತಿಯನ್ನು ಮೀರಿದೆ (${resourceWords} ಪದಗಳು).` : `Resource Requirements exceeds 100 words limit (${resourceWords} words).`, true);
      return;
    }

    const res = await apiRequest('/round2/submit', {
      method: 'POST',
      body: JSON.stringify({
        detailedConcept: r2Data.detailedConcept,
        valuePropositionAndCircularity: r2Data.valuePropositionAndCircularity,
        valueProposition: r2Data.valuePropositionAndCircularity,
        feasibilityPlan90Days: r2Data.feasibilityPlan90Days,
        resourceRequirements: r2Data.resourceRequirements,
      }),
    });

    if (res.ok) {
      showToast(lang === 'kn' ? '🎉 ಹಂತ ೨ ರ ಸಂಪೂರ್ಣ ಯೋಜನೆಯು ಯಶಸ್ವಿಯಾಗಿ ಸಲ್ಲಿಕೆಯಾಗಿದೆ!' : '🎉 Round 2 Deep-Dive Dossier successfully submitted!');
      await loadMyTeam();
      await loadRound2Data();
    } else {
      showToast(res.message || (lang === 'kn' ? 'ಹಂತ ೨ ಸಲ್ಲಿಕೆ ವಿಫಲವಾಗಿದೆ' : 'Round 2 Submission Failed'), true);
    }
  };

  const isR1Locked = team?.round1Status === 'SELECTED';
  const isR2Unlocked = team?.round1Status === 'SELECTED';

  return (
    <section id="pitch" className={`section ${lang === 'kn' ? 'kannada' : ''}`} style={{ background: '#ffffff', borderTop: '2px solid rgba(12, 91, 53, 0.15)' }}>
      <div className="container">
        {/* SECTION HEADER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span className="section-tag">{t.tag}</span>
            <h2 className="section-title" style={{ margin: 0, textAlign: 'left' }}>
              {t.title}
            </h2>
            <p style={{ color: 'var(--muted)', marginTop: '4px', fontSize: '14px' }}>
              {t.subtitleLeader} <strong>{user?.name}</strong> ({user?.email})
            </p>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={loadData}>
            <RefreshCw size={14} /> {t.refreshBtn}
          </button>
        </div>

        {/* PROGRESS TRACKER BAR */}
        {team && (
          <div
            style={{
              background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%)',
              border: '1px solid rgba(12, 91, 53, 0.2)',
              borderRadius: '16px',
              padding: '20px 24px',
              marginBottom: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px',
            }}
          >
            <div>
              <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--green2)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {t.activeTeam} {team.teamName} ({team.teamId})
              </div>
              <div style={{ fontSize: '14px', color: 'var(--ink)', marginTop: '4px' }}>
                {t.theme} <strong>{team.theme?.name || (lang === 'kn' ? 'ತ್ಯಾಜ್ಯ ನಿರ್ವಹಣೆ' : 'Waste Management')}</strong>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
              <span className={`badge ${team.round1Status === 'SELECTED' ? 'success' : team.round1Status === 'SUBMITTED' ? 'warning' : 'secondary'}`}>
                {t.round1} {team.round1Status}
              </span>
              <span className={`badge ${team.round2Status === 'SELECTED' ? 'success' : isR2Unlocked ? 'warning' : 'LOCKED'}`}>
                {t.round2} {isR2Unlocked ? (team.round2Status === 'SELECTED' ? 'SELECTED' : 'UNLOCKED') : 'LOCKED'}
              </span>
              {team.finalStatus === 'FINALIST' && (
                <span className="badge success" style={{ background: '#fef3c7', color: '#b45309', border: '1px solid #fcd34d' }}>
                  {t.grandFinalist}
                </span>
              )}
            </div>
          </div>
        )}

        {/* TAB BAR NAVIGATION */}
        <div style={{ display: 'flex', gap: '8px', borderBottom: '2px solid rgba(12, 91, 53, 0.12)', marginBottom: '28px', overflowX: 'auto' }}>
          <button
            className={`tab-btn ${activeTab === 'team' ? 'active' : ''}`}
            onClick={() => setActiveTab('team')}
          >
            <Users size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
            {team ? t.tabTeam : t.tabCreateTeam}
          </button>

          <button
            className={`tab-btn ${activeTab === 'round1' ? 'active' : ''}`}
            onClick={() => setActiveTab('round1')}
          >
            <Send size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
            {t.tabRound1}
          </button>

          <button
            className={`tab-btn ${activeTab === 'round2' ? 'active' : ''}`}
            onClick={() => setActiveTab('round2')}
          >
            {isR2Unlocked ? (
              <Sparkles size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle', color: 'var(--green2)' }} />
            ) : (
              <Lock size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
            )}
            {t.tabRound2} {isR2Unlocked ? '🟢' : '🔒'}
          </button>

          {team?.finalStatus === 'FINALIST' && (
            <button
              className={`tab-btn ${activeTab === 'finalist' ? 'active' : ''}`}
              onClick={() => setActiveTab('finalist')}
            >
              <Trophy size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle', color: '#d97706' }} />
              {t.tabFinale}
            </button>
          )}
        </div>

        {/* TAB 1: TEAM DETAILS & CREATION */}
        {activeTab === 'team' && (
          <div className="light-card" style={{ padding: '32px' }}>
            {team ? (
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--ink)', marginBottom: '16px' }}>
                  {t.rosterTitle} {team.teamName}
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px', marginBottom: '24px' }}>
                  <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '16px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--green2)', textTransform: 'uppercase' }}>{t.designatedLeader}</div>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--ink)', marginTop: '4px' }}>{user?.name}</div>
                    <div style={{ fontSize: '13px', color: 'var(--muted)' }}>{user?.email} • {user?.phone || t.noPhone}</div>
                  </div>

                  {team.members?.map((m, idx) => (
                    <div key={idx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px' }}>
                      <div style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>{t.teammate} {idx + 1} ({m.roleInTeam || (lang === 'kn' ? 'ಸದಸ್ಯ' : 'Member')})</div>
                      <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--ink)', marginTop: '4px' }}>{m.name}</div>
                      <div style={{ fontSize: '13px', color: 'var(--muted)' }}>{m.email} • {m.phone}</div>
                    </div>
                  ))}
                </div>

                <div style={{ textAlign: 'right' }}>
                  <button className="btn btn-primary" onClick={() => setActiveTab('round1')}>
                    {t.proceedToR1}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleCreateTeam}>
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--ink)', marginBottom: '8px' }}>
                  {t.createTeamTitle}
                </h3>
                <p style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '20px' }}>
                  {t.createTeamSubtitle}
                </p>

                <div className="form-row">
                  <div className="form-group">
                    <label>{t.teamNameLabel}</label>
                    <input
                      type="text"
                      required
                      placeholder={t.teamNamePh}
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>{t.trackLabel}</label>
                    <select
                      required
                      value={selectedTheme}
                      onChange={(e) => setSelectedTheme(e.target.value)}
                    >
                      <option value="">{t.trackOption}</option>
                      {themes.map((th) => (
                        <option key={th._id} value={th._id}>
                          {th.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* OPTIONAL TEAMMATES */}
                <div style={{ marginTop: '20px', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <label style={{ fontSize: '14px', fontWeight: 700, color: 'var(--ink)' }}>
                      {t.optionalTeammates} ({members.length}/2)
                    </label>
                    {members.length < 2 && (
                      <button type="button" className="btn btn-outline btn-sm" onClick={addMemberRow}>
                        <Plus size={14} /> {t.addTeammate}
                      </button>
                    )}
                  </div>

                  {members.map((m, idx) => (
                    <div key={idx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--green2)' }}>{t.teammate} #{idx + 1}</span>
                        <button type="button" onClick={() => removeMemberRow(idx)} style={{ color: '#e11d48', background: 'none', border: 'none', cursor: 'pointer' }}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="form-row three-col">
                        <input
                          type="text"
                          required
                          placeholder={t.fullNamePh}
                          value={m.name}
                          onChange={(e) => updateMemberField(idx, 'name', e.target.value)}
                        />
                        <input
                          type="email"
                          required
                          placeholder={t.emailPh}
                          value={m.email}
                          onChange={(e) => updateMemberField(idx, 'email', e.target.value)}
                        />
                        <input
                          type="tel"
                          required
                          placeholder={t.phonePh}
                          value={m.phone}
                          onChange={(e) => updateMemberField(idx, 'phone', e.target.value)}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <button type="submit" className="btn btn-primary">
                  {t.createTeamBtn}
                </button>
              </form>
            )}
          </div>
        )}

        {/* TAB 2: ROUND 1 IDEA PITCH */}
        {activeTab === 'round1' && (
          <div className="light-card" style={{ padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--ink)', margin: 0 }}>
                  {t.r1Title}
                </h3>
                <p style={{ color: 'var(--muted)', fontSize: '13px', marginTop: '4px' }}>
                  {t.r1Deadline}
                </p>
              </div>

              {isR1Locked && (
                <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#047857', padding: '8px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 700 }}>
                  {t.r1LockedBadge}
                </div>
              )}
            </div>

            {!team ? (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <p style={{ color: 'var(--muted)', marginBottom: '16px' }}>{t.r1CreateTeamFirst}</p>
                <button className="btn btn-primary" onClick={() => setActiveTab('team')}>
                  {t.createTeamNow}
                </button>
              </div>
            ) : (
              <div>
                {/* 1. Problem Statement */}
                <div className="form-group" style={{ marginBottom: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <label style={{ fontWeight: 700, color: 'var(--ink)' }}>
                      {t.r1ProblemLabel}
                    </label>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: countWords(r1Problem) > 150 ? '#e11d48' : 'var(--green2)' }}>
                      {countWords(r1Problem)} / 150 {t.wordsUnit}
                    </span>
                  </div>
                  <textarea
                    rows={4}
                    disabled={isR1Locked}
                    placeholder={t.r1ProblemPh}
                    value={r1Problem}
                    onChange={(e) => setR1Problem(e.target.value)}
                    style={{ background: isR1Locked ? '#f8fafc' : '#ffffff' }}
                  />
                </div>

                {/* 2. Proposed Technical Solution */}
                <div className="form-group" style={{ marginBottom: '28px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <label style={{ fontWeight: 700, color: 'var(--ink)' }}>
                      {t.r1SolutionLabel}
                    </label>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: countWords(r1Solution) > 250 ? '#e11d48' : 'var(--green2)' }}>
                      {countWords(r1Solution)} / 250 {t.wordsUnit}
                    </span>
                  </div>
                  <textarea
                    rows={6}
                    disabled={isR1Locked}
                    placeholder={t.r1SolutionPh}
                    value={r1Solution}
                    onChange={(e) => setR1Solution(e.target.value)}
                    style={{ background: isR1Locked ? '#f8fafc' : '#ffffff' }}
                  />
                </div>

                {!isR1Locked ? (
                  <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                    <button type="button" className="btn btn-secondary" onClick={() => handleR1Submit(true)}>
                      <Save size={16} /> {t.saveDraft}
                    </button>
                    <button type="button" className="btn btn-primary" onClick={() => handleR1Submit(false)}>
                      <Send size={16} /> {t.finalSubmit}
                    </button>
                  </div>
                ) : (
                  <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '16px', color: '#065f46', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <CheckCircle size={20} color="#059669" />
                    <div>
                      {t.r1Congrats}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: ROUND 2 DEEP-DIVE DOSSIER */}
        {activeTab === 'round2' && (
          <div className="light-card" style={{ padding: '32px' }}>
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--ink)', margin: 0 }}>
                {t.r2Title}
              </h3>
              <p style={{ color: 'var(--muted)', fontSize: '13px', marginTop: '4px' }}>
                {t.r2Timeline}
              </p>
            </div>

            {!isR2Unlocked ? (
              <div style={{ textAlign: 'center', padding: '50px 20px', background: '#f8fafc', borderRadius: '16px', border: '2px dashed #cbd5e1' }}>
                <Lock size={44} color="#94a3b8" style={{ margin: '0 auto 12px auto' }} />
                <h4 style={{ fontSize: '18px', fontWeight: 800, color: '#334155' }}>{t.r2LockedTitle}</h4>
                <p style={{ color: 'var(--muted)', maxWidth: '520px', margin: '8px auto 0 auto', fontSize: '14px' }}>
                  {t.r2LockedDesc}
                </p>
              </div>
            ) : (
              <div>
                {/* 1. Detailed Concept */}
                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <label style={{ fontWeight: 700, color: 'var(--ink)' }}>
                      {t.q1Label}
                    </label>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: countWords(r2Data.detailedConcept) > 1000 ? '#e11d48' : 'var(--green2)' }}>
                      {countWords(r2Data.detailedConcept)} / 1000 {t.wordsUnit}
                    </span>
                  </div>
                  <textarea
                    rows={6}
                    placeholder={t.q1Ph}
                    value={r2Data.detailedConcept}
                    onChange={(e) => setR2Data({ ...r2Data, detailedConcept: e.target.value })}
                  />
                </div>

                {/* 2. Value Proposition & Circularity */}
                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <label style={{ fontWeight: 700, color: 'var(--ink)' }}>
                      {t.q2Label}
                    </label>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: countWords(r2Data.valuePropositionAndCircularity) > 150 ? '#e11d48' : 'var(--green2)' }}>
                      {countWords(r2Data.valuePropositionAndCircularity)} / 150 {t.wordsUnit}
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    placeholder={t.q2Ph}
                    value={r2Data.valuePropositionAndCircularity}
                    onChange={(e) => setR2Data({ ...r2Data, valuePropositionAndCircularity: e.target.value })}
                  />
                </div>

                {/* 3. 90-Day Feasibility Plan */}
                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <label style={{ fontWeight: 700, color: 'var(--ink)' }}>
                      {t.q3Label}
                    </label>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: countWords(r2Data.feasibilityPlan90Days) > 200 ? '#e11d48' : 'var(--green2)' }}>
                      {countWords(r2Data.feasibilityPlan90Days)} / 200 {t.wordsUnit}
                    </span>
                  </div>
                  <textarea
                    rows={4}
                    placeholder={t.q3Ph}
                    value={r2Data.feasibilityPlan90Days}
                    onChange={(e) => setR2Data({ ...r2Data, feasibilityPlan90Days: e.target.value })}
                  />
                </div>

                {/* 4. Resource Requirements */}
                <div className="form-group" style={{ marginBottom: '28px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <label style={{ fontWeight: 700, color: 'var(--ink)' }}>
                      {t.q4Label}
                    </label>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: countWords(r2Data.resourceRequirements) > 100 ? '#e11d48' : 'var(--green2)' }}>
                      {countWords(r2Data.resourceRequirements)} / 100 {t.wordsUnit}
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    placeholder={t.q4Ph}
                    value={r2Data.resourceRequirements}
                    onChange={(e) => setR2Data({ ...r2Data, resourceRequirements: e.target.value })}
                  />
                </div>

                <div style={{ textAlign: 'right' }}>
                  <button type="button" className="btn btn-primary" onClick={handleR2Submit}>
                    <Send size={16} /> {t.r2SubmitBtn}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: FINALIST PRESENTATION PASS */}
        {activeTab === 'finalist' && finalistPass && (
          <div
            style={{
              background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
              border: '2px solid #fcd34d',
              borderRadius: '20px',
              padding: '36px',
              boxShadow: '0 20px 40px rgba(217, 119, 6, 0.12)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
              <span style={{ fontSize: '40px' }}>🏆</span>
              <div>
                <h3 style={{ fontSize: '24px', fontWeight: 900, color: '#92400e', margin: 0 }}>
                  {t.finalePassTitle}
                </h3>
                <p style={{ color: '#b45309', margin: '4px 0 0 0', fontWeight: 600 }}>
                  {t.finalePassSub}
                </p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px', marginBottom: '24px' }}>
              <div style={{ background: '#ffffff', padding: '16px', borderRadius: '12px', border: '1px solid #fde68a' }}>
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#b45309', textTransform: 'uppercase' }}>{t.eventDate}</div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#78350f', marginTop: '4px' }}>
                  {finalistPass.eventDate ? new Date(finalistPass.eventDate).toLocaleDateString() : 'Dec 15, 2026'}
                </div>
              </div>

              <div style={{ background: '#ffffff', padding: '16px', borderRadius: '12px', border: '1px solid #fde68a' }}>
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#b45309', textTransform: 'uppercase' }}>{t.timeSlot}</div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#78350f', marginTop: '4px' }}>
                  {finalistPass.startTime || '10:00 AM'}
                </div>
              </div>

              <div style={{ background: '#ffffff', padding: '16px', borderRadius: '12px', border: '1px solid #fde68a' }}>
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#b45309', textTransform: 'uppercase' }}>{t.pitchDuration}</div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#78350f', marginTop: '4px' }}>
                  {finalistPass.presentationDuration || (lang === 'kn' ? '೧೫ ನಿಮಿಷ' : '15 Minutes')}
                </div>
              </div>

              <div style={{ background: '#ffffff', padding: '16px', borderRadius: '12px', border: '1px solid #fde68a' }}>
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#b45309', textTransform: 'uppercase' }}>{t.venue}</div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#78350f', marginTop: '4px' }}>
                  {finalistPass.venue || (lang === 'kn' ? 'ಮುಖ್ಯ ಆವಿಷ್ಕಾರ ಸಭಾಂಗಣ' : 'Grand Innovation Auditorium')}
                </div>
              </div>
            </div>

            <div style={{ background: '#ffffff', padding: '18px 24px', borderRadius: '12px', border: '1px solid #fde68a' }}>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#b45309', marginBottom: '6px' }}>
                {t.instructionsTitle}
              </div>
              <p style={{ color: '#78350f', fontSize: '14px', margin: 0, lineHeight: 1.6 }}>
                {finalistPass.instructions || (lang === 'kn' ? 'ದಯವಿಟ್ಟು ನಿಗದಿತ ಸಮಯಕ್ಕಿಂತ ೧೫ ನಿಮಿಷ ಮುಂಚಿತವಾಗಿ USB ಡ್ರೈವ್‌ನಲ್ಲಿ ಸ್ಲೈಡ್‌ಗಳು ಮತ್ತು ಕಾರ್ಯನಿರ್ವಹಿಸುವ ಹಾರ್ಡ್‌ವೇರ್ ಡೆಮೋದೊಂದಿಗೆ ಆಗಮಿಸಿ.' : 'Please arrive 15 minutes before your scheduled presentation with your slides on a USB drive and working hardware demos.')}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
