'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiRequest } from '../../lib/api';
import { useRouter } from 'next/navigation';
import {
  Users,
  Lightbulb,
  Rocket,
  Trophy,
  Search,
  Filter,
  RefreshCw,
  Plus,
  Trash2,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  Shield,
  UserCheck,
  Award,
  Key,
  ChevronRight,
  Eye,
  FileText,
  Star,
  CheckSquare,
  Square,
  Sliders,
  Sparkles,
  TrendingUp,
  X,
  MessageSquare,
} from 'lucide-react';

const adminTranslations = {
  en: {
    commandCenter: '👑 Executive Command Center',
    liveDb: 'MongoDB Atlas Live',
    title: 'Ideathon Administration & Evaluation Console',
    subtitle: 'Manage teams, monitor panelist scoring, select round qualifiers, and issue finalist passes.',
    refreshBtn: 'Refresh Live Data',
    totalTeams: 'Total Registered Teams',
    r1Pitches: 'Round 1 Pitches',
    r2Selected: 'Round 2 Selected',
    grandFinalists: 'Grand Finalists',
    tabTeams: 'All Teams & Score Progression',
    tabPanelists: 'Judges & Panelist Assignments',
    tabFinalists: 'Grand Finale Stage Scheduler',
    allTeamsTitle: '📋 Registered Teams & Panelist Scoring Leaderboard',
    allTeamsSub: 'Review jury scores, filter by cutoffs, and select qualifiers for Round 2 or Grand Finale.',
    searchPlaceholder: 'Search by team name, ID, or leader email...',
    allThemes: 'All Themes',
    allStatuses: 'All Statuses',
    r1Submitted: 'Round 1 Submitted',
    r1SelectedStatus: 'Round 1 Selected (R2 Unlocked)',
    r2SubmittedStatus: 'Round 2 Dossier Submitted',
    finalistStatus: 'Grand Finalist 🏆',
    notSelectedStatus: 'Not Selected',
    sortBy: 'Sort by:',
    sortHighestR1: '⭐ Highest R1 Score (Top Ranked)',
    sortHighestR2: '🏆 Highest R2 Score',
    sortLowestR1: 'Lowest R1 Score',
    sortNewest: 'Newest Registration',
    sortAlpha: 'Team Name (A-Z)',
    cutoffToolTitle: '🎯 Score-Based Selection & Batch Advancement',
    cutoffMinScore: 'Min R1 Cutoff Score (≥):',
    selectQualified: 'Select Qualified Teams',
    batchSelectR1: '✓ Batch Advance Selected to Round 2',
    batchSelectR2: '🏆 Batch Promote Selected to Finalists',
    clearSelection: 'Clear Selection',
    thSelect: 'Select',
    thTeamId: 'Team ID',
    thTeamName: 'Team Name',
    thTheme: 'Theme Track',
    thLeader: 'Team Leader',
    thR1Score: 'R1 Judge Score',
    thR2Score: 'R2 Judge Score',
    thR1Status: 'R1 Status',
    thR2Status: 'R2 Status',
    thFinalStatus: 'Final Stage',
    thAssignedJudges: 'Assigned Judges',
    thActions: 'Score Actions',
    noMatchingTeams: 'No matching teams found',
    noMatchingSub: 'Try adjusting your search query, score filter, or track selection.',
    selectR1Btn: '✓ Select R1',
    finalistBtn: '🏆 Finalist',
    rejectBtn: '✗ Reject',
    inspectBtn: '👁️ Inspect & Scores',
    evalBreakdownTitle: 'Team Pitch & Jury Evaluation Scorecard',
    closeModal: 'Close',
    modalTeamInfo: 'Team & Leader Information',
    modalR1Pitch: 'Round 1 Problem & Solution Pitch',
    modalR2Dossier: 'Round 2 Detailed Dossier',
    modalScoresTitle: '⚖️ Panelist Evaluation Breakdowns',
    noScoresYet: 'No panelist evaluations submitted for this team yet.',
    totalScore: 'Total Score',
    criteriaMarks: 'Criteria Marks',
    judgeComments: 'Judge Observations / Feedback',
    advanceToR2Modal: '✓ Select Team for Round 2',
    promoteFinalistModal: '🏆 Promote to Grand Finalist',
    rejectModal: '✗ Mark Not Selected',
    createJudgeTitle: 'Create Judge (Panelist) Account',
    createJudgeSub: 'Jury members do not register publicly. Create their official evaluation credentials here.',
    judgeNameLabel: 'Judge Full Name *',
    judgeEmailLabel: 'Official Email Address *',
    judgePhoneLabel: 'Contact Phone Number *',
    judgePasswordLabel: 'Initial Login Password *',
    saveJudgeBtn: 'Save & Issue Panelist Credential',
    activeJudgesTitle: '⚖️ Active Jury Panelists',
    activeJudgesSub: 'Authorized evaluators with active portal credentials.',
    noJudgesCreated: 'No judge accounts created yet.',
    assignJudgesTitle: 'Assign Jury Panelists to Teams',
    assignJudgesSub: 'Assign one or multiple evaluators to a specific team so submissions become visible in the judge’s portal.',
    targetTeamLabel: '1. Select Target Team *',
    selectJudgesLabel: '2. Select Assigned Judges *',
    confirmAssignmentBtn: 'Confirm Assignment & Push to Evaluator Portals',
    schedulerTitle: 'Grand Finale Presentation Slot Scheduler',
    schedulerSub: 'Schedule stage venue, live presentation slot, and instructions for qualified finalists.',
    selectFinalistLabel: 'Select Qualified Finalist Team *',
    venueLabel: 'Venue / Stage *',
    timeLabel: 'Slot Start Time *',
    durationLabel: 'Presentation Duration *',
    dateLabel: 'Event Date *',
    instructionsLabel: 'Finalist Instructions & Guidelines',
    confirmSlotBtn: 'Confirm Slot & Issue Grand Finale Stage Pass',
    passPreviewTitle: '🎟️ Grand Finale Stage Pass Preview',
    passPreviewSub: 'Real-time preview of the stage pass issued to the selected finalist team.',
  },
  kn: {
    commandCenter: '👑 ಕಾರ್ಯನಿರ್ವಾಹಕ ನಿರ್ವಹಣಾ ಕೇಂದ್ರ',
    liveDb: 'ಲೈವ್ ಡೇಟಾಬೇಸ್ ಸಂಪರ್ಕದಲ್ಲಿದೆ',
    title: 'ಐಡಿಯಾಥಾನ್ ಆಡಳಿತ ಮತ್ತು ಮೌಲ್ಯಮಾಪನ ಕನ್ಸೋಲ್',
    subtitle: 'ತಂಡಗಳನ್ನು ನಿರ್ವಹಿಸಿ, ತೀರ್ಪುಗಾರರ ಅಂಕಗಳನ್ನು ಪರಿಶೀಲಿಸಿ, ಮುಂದಿನ ಹಂತಕ್ಕೆ ಆಯ್ಕೆ ಮಾಡಿ ಮತ್ತು ಫೈನಲಿಸ್ಟ್ ಪಾಸ್ ನೀಡಿ.',
    refreshBtn: 'ಡೇಟಾ ನವೀಕರಿಸಿ',
    totalTeams: 'ಒಟ್ಟು ನೋಂದಾಯಿತ ತಂಡಗಳು',
    r1Pitches: 'ಹಂತ ೧ ರ ಯೋಜನೆಗಳು',
    r2Selected: 'ಹಂತ ೨ ಕ್ಕೆ ಆಯ್ಕೆಯಾದವರು',
    grandFinalists: 'ಗ್ರ್ಯಾಂಡ್ ಫೈನಲಿಸ್ಟ್‌ಗಳು',
    tabTeams: 'ಎಲ್ಲಾ ತಂಡಗಳು ಮತ್ತು ಅಂಕಗಳ ಪ್ರಗತಿ',
    tabPanelists: 'ತೀರ್ಪುಗಾರರು ಮತ್ತು ತಂಡ ಹಂಚಿಕೆ',
    tabFinalists: 'ಗ್ರ್ಯಾಂಡ್ ಫಿನಾಲೆ ವೇದಿಕೆ ವೇಳಾಪಟ್ಟಿ',
    allTeamsTitle: '📋 ನೋಂದಾಯಿತ ತಂಡಗಳು ಮತ್ತು ತೀರ್ಪುಗಾರರ ಅಂಕಗಳ ಪಟ್ಟಿ',
    allTeamsSub: 'ತೀರ್ಪುಗಾರರ ಅಂಕಗಳನ್ನು ಪರಿಶೀಲಿಸಿ ಮತ್ತು ಮುಂದಿನ ಹಂತಕ್ಕೆ ತಂಡಗಳನ್ನು ಸುಲಭವಾಗಿ ಆಯ್ಕೆ ಮಾಡಿ.',
    searchPlaceholder: 'ತಂಡದ ಹೆಸರು, ಐಡಿ ಅಥವಾ ಇಮೇಲ್ ಮೂಲಕ ಹುಡುಕಿ...',
    allThemes: 'ಎಲ್ಲಾ ವಿಷಯಗಳು',
    allStatuses: 'ಎಲ್ಲಾ ಸ್ಥಿತಿಗಳು',
    r1Submitted: 'ಹಂತ ೧ ಸಲ್ಲಿಸಲಾಗಿದೆ',
    r1SelectedStatus: 'ಹಂತ ೧ ಆಯ್ಕೆಯಾಗಿದೆ (ಹಂತ ೨ ಮುಕ್ತವಾಗಿದೆ)',
    r2SubmittedStatus: 'ಹಂತ ೨ ಸಲ್ಲಿಸಲಾಗಿದೆ',
    finalistStatus: 'ಗ್ರ್ಯಾಂಡ್ ಫೈನಲಿಸ್ಟ್ 🏆',
    notSelectedStatus: 'ಆಯ್ಕೆಯಾಗಿಲ್ಲ',
    sortBy: 'ವಿಂಗಡಿಸಿ:',
    sortHighestR1: '⭐ ಗರಿಷ್ಠ ಹಂತ ೧ ಅಂಕಗಳು (ಮೊದಲು)',
    sortHighestR2: '🏆 ಗರಿಷ್ಠ ಹಂತ ೨ ಅಂಕಗಳು',
    sortLowestR1: 'ಕಡಿಮೆ ಹಂತ ೧ ಅಂಕಗಳು',
    sortNewest: 'ಹೊಸ ನೋಂದಣಿಗಳು',
    sortAlpha: 'ತಂಡದ ಹೆಸರು (A-Z)',
    cutoffToolTitle: '🎯 ಅಂಕ ಆಧಾರಿತ ಆಯ್ಕೆ ಮತ್ತು ಸಾಮೂಹಿಕ ಮುಂಬಡ್ತಿ',
    cutoffMinScore: 'ಕನಿಷ್ಠ ಹಂತ ೧ ಕಟ್‌ಆಫ್ ಅಂಕ (≥):',
    selectQualified: 'ಅರ್ಹ ತಂಡಗಳನ್ನು ಆಯ್ಕೆ ಮಾಡಿ',
    batchSelectR1: '✓ ಆಯ್ಕೆ ಮಾಡಿದ ತಂಡಗಳನ್ನು ಹಂತ ೨ ಕ್ಕೆ ಮುಂಬಡ್ತಿ ನೀಡಿ',
    batchSelectR2: '🏆 ಆಯ್ಕೆ ಮಾಡಿದ ತಂಡಗಳನ್ನು ಫೈನಲ್‌ಗೆ ಮುಂಬಡ್ತಿ ನೀಡಿ',
    clearSelection: 'ಆಯ್ಕೆ ರದ್ದುಗೊಳಿಸಿ',
    thSelect: 'ಆಯ್ಕೆ',
    thTeamId: 'ತಂಡದ ಐಡಿ',
    thTeamName: 'ತಂಡದ ಹೆಸರು',
    thTheme: 'ವಿಷಯ',
    thLeader: 'ತಂಡದ ನಾಯಕ',
    thR1Score: 'ಹಂತ ೧ ತೀರ್ಪುಗಾರರ ಅಂಕ',
    thR2Score: 'ಹಂತ ೨ ತೀರ್ಪುಗಾರರ ಅಂಕ',
    thR1Status: 'ಹಂತ ೧ ಸ್ಥಿತಿ',
    thR2Status: 'ಹಂತ ೨ ಸ್ಥಿತಿ',
    thFinalStatus: 'ಅಂತಿಮ ಹಂತ',
    thAssignedJudges: 'ನಿಯೋಜಿತ ತೀರ್ಪುಗಾರರು',
    thActions: 'ಅಂಕ ಕ್ರಮಗಳು',
    noMatchingTeams: 'ಯಾವುದೇ ತಂಡಗಳು ಕಂಡುಬಂದಿಲ್ಲ',
    noMatchingSub: 'ದಯವಿಟ್ಟು ಹುಡುಕಾಟ ಅಥವಾ ಫಿಲ್ಟರ್ ಬದಲಾಯಿಸಿ.',
    selectR1Btn: '✓ ಹಂತ ೧ ಆಯ್ಕೆ',
    finalistBtn: '🏆 ಫೈನಲಿಸ್ಟ್',
    rejectBtn: '✗ ತಿರಸ್ಕರಿಸಿ',
    inspectBtn: '👁️ ಅಂಕ ವಿವರ ವೀಕ್ಷಿಸಿ',
    evalBreakdownTitle: 'ತಂಡದ ಯೋಜನೆ ಮತ್ತು ತೀರ್ಪುಗಾರರ ಮೌಲ್ಯಮಾಪನ ವಿವರ',
    closeModal: 'ಮುಚ್ಚಿ',
    modalTeamInfo: 'ತಂಡ ಮತ್ತು ನಾಯಕರ ವಿವರ',
    modalR1Pitch: 'ಹಂತ ೧ ಸಮಸ್ಯೆ ಮತ್ತು ಪರಿಹಾರ ವಿವರ',
    modalR2Dossier: 'ಹಂತ ೨ ವಿವರವಾದ ವರದಿ',
    modalScoresTitle: '⚖️ ತೀರ್ಪುಗಾರರ ಅಂಕಗಳ ವಿವರಣೆ',
    noScoresYet: 'ಈ ತಂಡಕ್ಕೆ ತೀರ್ಪುಗಾರರಿಂದ ಇನ್ನೂ ಅಂಕಗಳು ಬಂದಿಲ್ಲ.',
    totalScore: 'ಒಟ್ಟು ಅಂಕ',
    criteriaMarks: 'ಮಾನದಂಡಗಳ ಅಂಕಗಳು',
    judgeComments: 'ತೀರ್ಪುಗಾರರ ಅಭಿಪ್ರಾಯ / ಪ್ರತಿಕ್ರಿಯೆ',
    advanceToR2Modal: '✓ ತಂಡವನ್ನು ಹಂತ ೨ ಕ್ಕೆ ಆಯ್ಕೆ ಮಾಡಿ',
    promoteFinalistModal: '🏆 ಗ್ರ್ಯಾಂಡ್ ಫೈನಲಿಸ್ಟ್ ಆಗಿ ಆಯ್ಕೆ ಮಾಡಿ',
    rejectModal: '✗ ತಿರಸ್ಕರಿಸಿ',
    createJudgeTitle: 'ತೀರ್ಪುಗಾರರ ಖಾತೆ ರಚಿಸಿ',
    createJudgeSub: 'ತೀರ್ಪುಗಾರರು ಸಾರ್ವಜನಿಕವಾಗಿ ನೋಂದಾಯಿಸುವುದಿಲ್ಲ. ಇಲ್ಲಿ ಅಧಿಕೃತ ಖಾತೆಯನ್ನು ರಚಿಸಿ.',
    judgeNameLabel: 'ತೀರ್ಪುಗಾರರ ಪೂರ್ಣ ಹೆಸರು *',
    judgeEmailLabel: 'ಅಧಿಕೃತ ಇಮೇಲ್ *',
    judgePhoneLabel: 'ಸಂಪರ್ಕ ದೂರವಾಣಿ *',
    judgePasswordLabel: 'ಲಾಗಿನ್ ಪಾಸ್‌ವರ್ಡ್ *',
    saveJudgeBtn: 'ತೀರ್ಪುಗಾರರ ಖಾತೆ ರಚಿಸಿ',
    activeJudgesTitle: '⚖️ ಸಕ್ರಿಯ ತೀರ್ಪುಗಾರರು',
    activeJudgesSub: 'ಪೋರ್ಟಲ್ ಪ್ರವೇಶ ಹೊಂದಿರುವ ಅಧಿಕೃತ ತೀರ್ಪುಗಾರರು.',
    noJudgesCreated: 'ಇನ್ನೂ ಯಾವುದೇ ತೀರ್ಪುಗಾರರ ಖಾತೆ ರಚಿಸಲಾಗಿಲ್ಲ.',
    assignJudgesTitle: 'ತಂಡಗಳಿಗೆ ತೀರ್ಪುಗಾರರನ್ನು ನಿಯೋಜಿಸಿ',
    assignJudgesSub: 'ತಂಡಗಳನ್ನು ಮೌಲ್ಯಮಾಪನ ಮಾಡಲು ತೀರ್ಪುಗಾರರನ್ನು ನಿಯೋಜಿಸಿ.',
    targetTeamLabel: '೧. ತಂಡವನ್ನು ಆಯ್ಕೆ ಮಾಡಿ *',
    selectJudgesLabel: '೨. ತೀರ್ಪುಗಾರರನ್ನು ಆಯ್ಕೆ ಮಾಡಿ *',
    confirmAssignmentBtn: 'ನಿಯೋಜನೆಯನ್ನು ದೃಢೀಕರಿಸಿ',
    schedulerTitle: 'ಗ್ರ್ಯಾಂಡ್ ಫಿನಾಲೆ ವೇದಿಕೆ ವೇಳಾಪಟ್ಟಿ',
    schedulerSub: 'ಅಂತಿಮ ಹಂತದ ಪ್ರಸ್ತುತಿಗಾಗಿ ಸ್ಥಳ, ಸಮಯ ಮತ್ತು ಸೂಚನೆಗಳನ್ನು ನಿಗದಿಪಡಿಸಿ.',
    selectFinalistLabel: 'ಅರ್ಹ ಫೈನಲಿಸ್ಟ್ ತಂಡವನ್ನು ಆಯ್ಕೆ ಮಾಡಿ *',
    venueLabel: 'ವೇದಿಕೆ / ಸಭಾಂಗಣ *',
    timeLabel: 'ನಿಗದಿತ ಸಮಯ *',
    durationLabel: 'ಕಾಲಾವಧಿ *',
    dateLabel: 'ದಿನಾಂಕ *',
    instructionsLabel: 'ಫೈನಲಿಸ್ಟ್‌ಗಳಿಗೆ ಸೂಚನೆಗಳು',
    confirmSlotBtn: 'ವೇದಿಕೆ ಪಾಸ್ ನೀಡಿ',
    passPreviewTitle: '🎟️ ಗ್ರ್ಯಾಂಡ್ ಫಿನಾಲೆ ಪಾಸ್ ಮುನ್ನೋಟ',
    passPreviewSub: 'ಆಯ್ಕೆಯಾದ ತಂಡಕ್ಕೆ ನೀಡಲಾಗುವ ಅಧಿಕೃತ ಪಾಸ್ ಮುನ್ನೋಟ.',
  },
};

export default function AdminPage() {
  const { user, token, login, showToast, lang = 'en' } = useAuth();
  const router = useRouter();

  const t = adminTranslations[lang] || adminTranslations.en;

  const [activeTab, setActiveTab] = useState('teams'); // 'teams' | 'panelists' | 'finalists'
  const [stats, setStats] = useState({});
  const [teams, setTeams] = useState([]);
  const [panelists, setPanelists] = useState([]);
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(false);

  // Search, Filters & Sorting
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTheme, setFilterTheme] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [sortBy, setSortBy] = useState('score_r1_desc'); // 'score_r1_desc' | 'score_r2_desc' | 'score_r1_asc' | 'newest' | 'name_asc'

  // Score Cutoff & Batch Selection State
  const [minCutoff, setMinCutoff] = useState(70);
  const [selectedTeamIds, setSelectedTeamIds] = useState([]);
  const [batchActionLoading, setBatchActionLoading] = useState(false);

  // Inspect Modal State
  const [inspectTeam, setInspectTeam] = useState(null);
  const [teamSubmissions, setTeamSubmissions] = useState({ r1: null, r2: null });
  const [inspectLoading, setInspectLoading] = useState(false);

  // Admin Auth Form
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Create Panelist Form
  const [panelistForm, setPanelistForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });

  // Assign Panelist Form
  const [assignTeamId, setAssignTeamId] = useState('');
  const [assignPanelistEmails, setAssignPanelistEmails] = useState([]);

  // Schedule Finalist Form
  const [schedTeamId, setSchedTeamId] = useState('');
  const [schedVenue, setSchedVenue] = useState('Grand Innovation Stage - Hall A');
  const [schedTime, setSchedTime] = useState('11:30 AM');
  const [schedDuration, setSchedDuration] = useState('15 minutes');
  const [schedDate, setSchedDate] = useState(
    new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString().split('T')[0]
  );
  const [schedInstructions, setSchedInstructions] = useState(
    'Bring live hardware prototype, slides on backup USB, and prepare for 5 min Q&A by jury.'
  );

  useEffect(() => {
    if (token && user?.role === 'admin') {
      loadData();
    }
  }, [token, user]);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    await login(adminEmail, adminPassword);
    setAuthLoading(false);
  };

  const loadData = async () => {
    setLoading(true);
    await Promise.all([loadStats(), loadTeams(), loadPanelists(), loadThemes()]);
    setLoading(false);
  };

  const loadStats = async () => {
    const res = await apiRequest('/admin/dashboard');
    const s = res.data && res.data.totalTeams !== undefined ? res.data : res.data?.stats || {};
    if (res.ok) {
      setStats(s);
    }
  };

  const loadTeams = async () => {
    const res = await apiRequest('/teams');
    const data = Array.isArray(res.data) ? res.data : [];
    if (res.ok && Array.isArray(data)) {
      setTeams(data);
    }
  };

  const loadPanelists = async () => {
    const res = await apiRequest('/admin/panelists');
    const data = Array.isArray(res.data) ? res.data : [];
    if (res.ok && Array.isArray(data)) {
      setPanelists(data);
    }
  };

  const loadThemes = async () => {
    const res = await apiRequest('/themes');
    const data = Array.isArray(res.data) ? res.data : res.data?.themes || [];
    if (res.ok && Array.isArray(data)) {
      setThemes(data);
    }
  };

  // Inspect Team & Fetch Full Dossier
  const openInspectModal = async (team) => {
    setInspectTeam(team);
    setInspectLoading(true);
    setTeamSubmissions({ r1: null, r2: null });

    try {
      const [r1Res, r2Res] = await Promise.all([
        apiRequest(`/round1/submission?teamId=${team._id}`),
        apiRequest(`/round2/submission?teamId=${team._id}`).catch(() => ({ ok: false })),
      ]);

      setTeamSubmissions({
        r1: r1Res.ok ? r1Res.data : null,
        r2: r2Res.ok ? r2Res.data : null,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setInspectLoading(false);
    }
  };

  const closeInspectModal = () => {
    setInspectTeam(null);
    setTeamSubmissions({ r1: null, r2: null });
  };

  // Single Team Progression
  const handleSelectRound1 = async (teamId) => {
    const res = await apiRequest(`/admin/teams/${teamId}/round1/select`, {
      method: 'PUT',
    });
    if (res.ok) {
      showToast('🎉 Team selected for Round 2! Round 2 dossier is now unlocked for the team.');
      loadTeams();
      loadStats();
      if (inspectTeam && inspectTeam._id === teamId) {
        setInspectTeam((prev) => ({ ...prev, round1Status: 'SELECTED', round2Status: 'DRAFT' }));
      }
    } else {
      showToast(res.message || 'Selection failed', true);
    }
  };

  const handleRejectRound1 = async (teamId) => {
    if (!confirm('Reject this team for Round 1?')) return;
    const res = await apiRequest(`/admin/teams/${teamId}/round1/reject`, {
      method: 'PUT',
    });
    if (res.ok) {
      showToast('Team marked NOT_SELECTED for Round 1.');
      loadTeams();
      loadStats();
      if (inspectTeam && inspectTeam._id === teamId) {
        setInspectTeam((prev) => ({ ...prev, round1Status: 'NOT_SELECTED' }));
      }
    } else {
      showToast(res.message || 'Rejection failed', true);
    }
  };

  const handleSelectRound2 = async (teamId) => {
    const res = await apiRequest(`/admin/teams/${teamId}/round2/select`, {
      method: 'PUT',
    });
    if (res.ok) {
      showToast('🏆 Team promoted to Grand Finalist! Multi-channel notifications sent.');
      loadTeams();
      loadStats();
      if (inspectTeam && inspectTeam._id === teamId) {
        setInspectTeam((prev) => ({ ...prev, round2Status: 'SELECTED', finalStatus: 'FINALIST' }));
      }
    } else {
      showToast(res.message || 'Promotion failed', true);
    }
  };

  const handleRejectRound2 = async (teamId) => {
    if (!confirm('Reject this team for Round 2?')) return;
    const res = await apiRequest(`/admin/teams/${teamId}/round2/reject`, {
      method: 'PUT',
    });
    if (res.ok) {
      showToast('Team marked NOT_SELECTED for Round 2.');
      loadTeams();
      loadStats();
      if (inspectTeam && inspectTeam._id === teamId) {
        setInspectTeam((prev) => ({ ...prev, round2Status: 'NOT_SELECTED', finalStatus: 'NOT_QUALIFIED' }));
      }
    } else {
      showToast(res.message || 'Rejection failed', true);
    }
  };

  // Batch Selection
  const toggleSelectTeam = (id) => {
    setSelectedTeamIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAllByCutoff = () => {
    const qualified = filteredTeams
      .filter((t) => t.r1AvgScore !== null && t.r1AvgScore >= Number(minCutoff))
      .map((t) => t._id);
    setSelectedTeamIds(qualified);
    showToast(`Selected ${qualified.length} teams meeting R1 score cutoff ≥ ${minCutoff}`);
  };

  const handleBatchSelectRound1 = async () => {
    if (selectedTeamIds.length === 0) {
      showToast('Please select at least one team.', true);
      return;
    }
    setBatchActionLoading(true);
    const res = await apiRequest('/admin/teams/batch-select-round1', {
      method: 'PUT',
      body: JSON.stringify({ teamIds: selectedTeamIds }),
    });
    setBatchActionLoading(false);
    if (res.ok) {
      showToast(`🎉 Successfully advanced ${selectedTeamIds.length} teams to Round 2!`);
      setSelectedTeamIds([]);
      loadTeams();
      loadStats();
    } else {
      showToast(res.message || 'Batch selection failed', true);
    }
  };

  const handleBatchSelectRound2 = async () => {
    if (selectedTeamIds.length === 0) {
      showToast('Please select at least one team.', true);
      return;
    }
    setBatchActionLoading(true);
    const res = await apiRequest('/admin/teams/batch-select-round2', {
      method: 'PUT',
      body: JSON.stringify({ teamIds: selectedTeamIds }),
    });
    setBatchActionLoading(false);
    if (res.ok) {
      showToast(`🏆 Successfully promoted ${selectedTeamIds.length} teams to Grand Finalists!`);
      setSelectedTeamIds([]);
      loadTeams();
      loadStats();
    } else {
      showToast(res.message || 'Batch promotion failed', true);
    }
  };

  // Create Panelist
  const handleCreatePanelist = async (e) => {
    e.preventDefault();
    const res = await apiRequest('/admin/panelists', {
      method: 'POST',
      body: JSON.stringify(panelistForm),
    });

    if (res.ok) {
      showToast(`Judge account created for ${panelistForm.name}! Credentials saved in MongoDB.`);
      setPanelistForm({ name: '', email: '', phone: '', password: '' });
      loadPanelists();
    } else {
      showToast(res.message || 'Failed to create judge account', true);
    }
  };

  const handleDeletePanelist = async (panelistId, panelistName) => {
    if (!confirm(`Are you sure you want to delete judge '${panelistName}'?`)) {
      return;
    }
    const res = await apiRequest(`/admin/panelists/${panelistId}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      showToast(`Judge '${panelistName}' deleted successfully!`);
      loadPanelists();
    } else {
      showToast(res.message || 'Failed to delete judge', true);
    }
  };

  const handleAssignPanelists = async (e) => {
    e.preventDefault();
    if (!assignTeamId) {
      showToast('Please select a team.', true);
      return;
    }
    if (assignPanelistEmails.length === 0) {
      showToast('Please select at least one judge.', true);
      return;
    }

    const res = await apiRequest('/admin/assign-panelist', {
      method: 'POST',
      body: JSON.stringify({
        teamId: assignTeamId,
        panelistEmails: assignPanelistEmails,
      }),
    });

    if (res.ok) {
      showToast('✅ Judging panel assigned to team in database!');
      setAssignTeamId('');
      setAssignPanelistEmails([]);
      loadTeams();
      loadPanelists();
    } else {
      showToast(res.message || 'Assignment failed', true);
    }
  };

  const togglePanelistSelection = (email) => {
    setAssignPanelistEmails((prev) =>
      prev.includes(email) ? prev.filter((e) => e !== email) : [...prev, email]
    );
  };

  const handleScheduleFinalist = async (e) => {
    e.preventDefault();
    if (!schedTeamId) {
      showToast('Please select a finalist team.', true);
      return;
    }

    const res = await apiRequest('/admin/finalists', {
      method: 'POST',
      body: JSON.stringify({
        teamId: schedTeamId,
        venue: schedVenue,
        startTime: schedTime,
        presentationDuration: schedDuration,
        eventDate: schedDate,
        instructions: schedInstructions,
      }),
    });

    if (res.ok) {
      showToast('🏆 Grand Finale presentation slot confirmed & pass issued!');
      loadTeams();
      loadStats();
    } else {
      showToast(res.message || 'Scheduling failed', true);
    }
  };

  // Filter & Sort Logic
  const filteredTeams = teams
    .filter((t) => {
      const matchSearch =
        !searchQuery.trim() ||
        t.teamName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.teamId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.leader?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.leader?.email?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchTheme =
        filterTheme === 'ALL' || t.theme?._id === filterTheme || t.theme?.name === filterTheme;

      const matchStatus =
        filterStatus === 'ALL' ||
        (filterStatus === 'R1_SUBMITTED' && t.round1Status === 'SUBMITTED') ||
        (filterStatus === 'R1_SELECTED' && t.round1Status === 'SELECTED') ||
        (filterStatus === 'R2_SUBMITTED' && t.round2Status === 'SUBMITTED') ||
        (filterStatus === 'FINALIST' && t.finalStatus === 'FINALIST') ||
        (filterStatus === 'NOT_SELECTED' &&
          (t.round1Status === 'NOT_SELECTED' || t.round2Status === 'NOT_SELECTED'));

      return matchSearch && matchTheme && matchStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'score_r1_desc') {
        const scoreA = a.r1AvgScore !== null ? a.r1AvgScore : -1;
        const scoreB = b.r1AvgScore !== null ? b.r1AvgScore : -1;
        return scoreB - scoreA;
      }
      if (sortBy === 'score_r2_desc') {
        const scoreA = a.r2AvgScore !== null ? a.r2AvgScore : -1;
        const scoreB = b.r2AvgScore !== null ? b.r2AvgScore : -1;
        return scoreB - scoreA;
      }
      if (sortBy === 'score_r1_asc') {
        const scoreA = a.r1AvgScore !== null ? a.r1AvgScore : 999;
        const scoreB = b.r1AvgScore !== null ? b.r1AvgScore : 999;
        return scoreA - scoreB;
      }
      if (sortBy === 'name_asc') {
        return (a.teamName || '').localeCompare(b.teamName || '');
      }
      // 'newest' default
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });

  // Unauthenticated Admin Login Screen
  if (!token || user?.role !== 'admin') {
    return (
      <div style={{ maxWidth: '480px', margin: '60px auto', padding: '0 20px' }}>
        <div className="light-card" style={{ padding: '36px 32px' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ fontSize: '38px', marginBottom: '8px' }}>👑</div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', fontWeight: 800 }}>
              Ideathon Administration
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '4px' }}>
              Restricted management console for event coordinators
            </p>
          </div>

          <div
            style={{
              background: '#fef3c7',
              border: '1px solid #fde68a',
              color: '#92400e',
              padding: '10px 14px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '12px',
              marginBottom: '20px',
              lineHeight: 1.4,
            }}
          >
            🛡️ <strong>Executive Console:</strong> Enter administrator email and password to access the command center.
          </div>

          <form onSubmit={handleAdminLogin}>
            <div className="form-group">
              <label>Administrator Email *</label>
              <input
                type="email"
                placeholder="admin@ideathon.org"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Password *</label>
              <input
                type="password"
                placeholder="••••••••"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary w-full mt-4" disabled={authLoading}>
              {authLoading ? 'Authenticating Admin...' : 'Unlock Admin Console →'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="portal-container admin-portal">
      {/* EXECUTIVE HEADER */}
      <div className="portal-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <span
              style={{
                background: 'rgba(12, 91, 53, 0.12)',
                color: 'var(--green)',
                padding: '4px 10px',
                borderRadius: '999px',
                fontSize: '11.5px',
                fontWeight: 800,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}
            >
              {t.commandCenter}
            </span>
            <span style={{ fontSize: '12px', color: 'var(--muted)' }}>• {t.liveDb}</span>
          </div>
          <h1 className="portal-title">{t.title}</h1>
          <p className="portal-subtitle">
            Welcome, <strong>{user?.name}</strong> ({user?.email}). {t.subtitle}
          </p>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={loadData} disabled={loading}>
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> {t.refreshBtn}
        </button>
      </div>

      {/* METRIC STATS ROW */}
      <div className="grid-4 mb-6">
        <div className="admin-stat-card">
          <div className="stat-icon-wrap" style={{ background: '#ecfdf5', color: '#047857' }}>
            <Users size={26} />
          </div>
          <div>
            <div className="stat-label">{t.totalTeams}</div>
            <div className="stat-value">{stats.totalTeams || teams.length || 0}</div>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-icon-wrap" style={{ background: '#f0f9ff', color: '#0284c7' }}>
            <Lightbulb size={26} />
          </div>
          <div>
            <div className="stat-label">{t.r1Pitches}</div>
            <div className="stat-value">{stats.round1Submissions || 0}</div>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-icon-wrap" style={{ background: '#f5f3ff', color: '#7c3aed' }}>
            <Rocket size={26} />
          </div>
          <div>
            <div className="stat-label">{t.r2Selected}</div>
            <div className="stat-value">{stats.round2Selected || 0}</div>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-icon-wrap" style={{ background: '#fffbeb', color: '#d97706' }}>
            <Trophy size={26} />
          </div>
          <div>
            <div className="stat-label">{t.grandFinalists}</div>
            <div className="stat-value">{stats.finalists || 0}</div>
          </div>
        </div>
      </div>

      {/* ADMIN NAVIGATION TABS */}
      <div className="admin-nav-tabs">
        <button
          className={`admin-tab ${activeTab === 'teams' ? 'active' : ''}`}
          onClick={() => setActiveTab('teams')}
        >
          <Users size={16} /> {t.tabTeams}
          <span className="admin-tab-count">{teams.length}</span>
        </button>
        <button
          className={`admin-tab ${activeTab === 'panelists' ? 'active' : ''}`}
          onClick={() => setActiveTab('panelists')}
        >
          <UserCheck size={16} /> {t.tabPanelists}
          <span className="admin-tab-count">{panelists.length}</span>
        </button>
        <button
          className={`admin-tab ${activeTab === 'finalists' ? 'active' : ''}`}
          onClick={() => setActiveTab('finalists')}
        >
          <Award size={16} /> {t.tabFinalists}
          <span className="admin-tab-count">
            {teams.filter((t) => t.finalStatus === 'FINALIST').length}
          </span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: TEAMS & SCORE PROGRESSION LEADERBOARD                              */}
      {/* ========================================================================= */}
      {activeTab === 'teams' && (
        <div className="light-card" style={{ padding: '28px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '18px',
              flexWrap: 'wrap',
              gap: '14px',
            }}
          >
            <div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: 800, margin: 0 }}>
                {t.allTeamsTitle} ({filteredTeams.length} of {teams.length})
              </h3>
              <p style={{ color: 'var(--muted)', fontSize: '13px', margin: '2px 0 0' }}>
                {t.allTeamsSub}
              </p>
            </div>
          </div>

          {/* SCORE CUTOFF & BATCH ADVANCEMENT TOOLBAR */}
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(12, 91, 53, 0.05) 0%, rgba(183, 223, 57, 0.08) 100%)',
              border: '1.5px solid rgba(12, 91, 53, 0.15)',
              borderRadius: '14px',
              padding: '16px 20px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '13.5px', color: 'var(--ink)' }}>
                <Sparkles size={18} style={{ color: 'var(--green)' }} />
                <span>{t.cutoffToolTitle}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '12.5px', color: 'var(--muted)' }}>{t.cutoffMinScore}</span>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={minCutoff}
                  onChange={(e) => setMinCutoff(e.target.value)}
                  style={{ width: '68px', padding: '4px 8px', fontSize: '13px', borderRadius: '6px' }}
                />
                <button
                  type="button"
                  className="btn btn-sm btn-secondary"
                  onClick={handleSelectAllByCutoff}
                  style={{ padding: '6px 12px', fontSize: '12px' }}
                >
                  {t.selectQualified}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              {selectedTeamIds.length > 0 && (
                <>
                  <span
                    style={{
                      background: 'var(--green)',
                      color: '#ffffff',
                      padding: '4px 10px',
                      borderRadius: '999px',
                      fontSize: '12px',
                      fontWeight: 700,
                    }}
                  >
                    {selectedTeamIds.length} Selected
                  </span>
                  <button
                    type="button"
                    className="btn btn-sm"
                    style={{ background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0' }}
                    onClick={handleBatchSelectRound1}
                    disabled={batchActionLoading}
                  >
                    {t.batchSelectR1}
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-primary"
                    onClick={handleBatchSelectRound2}
                    disabled={batchActionLoading}
                  >
                    {t.batchSelectR2}
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm"
                    style={{ color: 'var(--muted)', background: 'transparent' }}
                    onClick={() => setSelectedTeamIds([])}
                  >
                    {t.clearSelection}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* SEARCH, FILTER & SORT BAR */}
          <div className="filter-bar" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            <div className="filter-input-wrap" style={{ flex: '2 1 240px' }}>
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <select
              className="filter-select"
              value={filterTheme}
              onChange={(e) => setFilterTheme(e.target.value)}
              style={{ flex: '1 1 150px' }}
            >
              <option value="ALL">{t.allThemes}</option>
              {themes.map((th) => (
                <option key={th._id} value={th._id}>
                  {th.name}
                </option>
              ))}
            </select>

            <select
              className="filter-select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{ flex: '1 1 150px' }}
            >
              <option value="ALL">{t.allStatuses}</option>
              <option value="R1_SUBMITTED">{t.r1Submitted}</option>
              <option value="R1_SELECTED">{t.r1SelectedStatus}</option>
              <option value="R2_SUBMITTED">{t.r2SubmittedStatus}</option>
              <option value="FINALIST">{t.finalistStatus}</option>
              <option value="NOT_SELECTED">{t.notSelectedStatus}</option>
            </select>

            <select
              className="filter-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{ flex: '1 1 200px', fontWeight: 600 }}
            >
              <option value="score_r1_desc">{t.sortHighestR1}</option>
              <option value="score_r2_desc">{t.sortHighestR2}</option>
              <option value="score_r1_asc">{t.sortLowestR1}</option>
              <option value="newest">{t.sortNewest}</option>
              <option value="name_asc">{t.sortAlpha}</option>
            </select>
          </div>

          {/* TEAMS & EVALUATION LEADERBOARD TABLE */}
          <div className="table-wrap">
            <table className="light-table">
              <thead>
                <tr>
                  <th style={{ width: '40px' }}>
                    <input
                      type="checkbox"
                      checked={
                        filteredTeams.length > 0 &&
                        filteredTeams.every((t) => selectedTeamIds.includes(t._id))
                      }
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedTeamIds(filteredTeams.map((t) => t._id));
                        } else {
                          setSelectedTeamIds([]);
                        }
                      }}
                    />
                  </th>
                  <th>{t.thTeamId}</th>
                  <th>{t.thTeamName}</th>
                  <th>{t.thTheme}</th>
                  <th>{t.thLeader}</th>
                  <th>{t.thR1Score}</th>
                  <th>{t.thR2Score}</th>
                  <th>{t.thR1Status}</th>
                  <th>{t.thR2Status}</th>
                  <th>{t.thFinalStatus}</th>
                  <th>{t.thAssignedJudges}</th>
                  <th style={{ textAlign: 'right' }}>{t.thActions}</th>
                </tr>
              </thead>
              <tbody>
                {filteredTeams.length === 0 ? (
                  <tr>
                    <td colSpan={12} className="text-center" style={{ padding: '36px 14px' }}>
                      <div style={{ fontSize: '28px', marginBottom: '8px' }}>🔍</div>
                      <strong style={{ color: 'var(--text-main)' }}>{t.noMatchingTeams}</strong>
                      <p style={{ color: 'var(--muted)', fontSize: '13px', marginTop: '4px' }}>
                        {t.noMatchingSub}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredTeams.map((team) => {
                    const isSelected = selectedTeamIds.includes(team._id);

                    // Score pill color calculation
                    const getScoreBadge = (score, count) => {
                      if (score === null || score === undefined) {
                        return (
                          <span style={{ fontSize: '11px', color: 'var(--muted)', fontStyle: 'italic' }}>
                            Pending review
                          </span>
                        );
                      }
                      let bg = '#ecfdf5';
                      let color = '#047857';
                      let border = '#a7f3d0';

                      if (score < 50) {
                        bg = '#fff1f2';
                        color = '#be123c';
                        border = '#fecdd3';
                      } else if (score < 70) {
                        bg = '#fffbeb';
                        color = '#b45309';
                        border = '#fde68a';
                      }

                      return (
                        <div style={{ display: 'inline-flex', flexDirection: 'column', gap: '2px' }}>
                          <span
                            style={{
                              background: bg,
                              color: color,
                              border: `1px solid ${border}`,
                              padding: '2px 8px',
                              borderRadius: '999px',
                              fontSize: '12px',
                              fontWeight: 800,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            ⭐ {score} <small style={{ opacity: 0.8 }}>/100</small>
                          </span>
                          <span style={{ fontSize: '10px', color: 'var(--muted)' }}>
                            {count || 1} {count === 1 ? 'judge' : 'judges'}
                          </span>
                        </div>
                      );
                    };

                    return (
                      <tr
                        key={team._id}
                        style={{
                          background: isSelected ? 'rgba(12, 91, 53, 0.04)' : undefined,
                        }}
                      >
                        <td>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelectTeam(team._id)}
                          />
                        </td>
                        <td>
                          <code
                            style={{
                              background: '#f1f5f9',
                              padding: '3px 6px',
                              borderRadius: '4px',
                              fontSize: '12px',
                              fontWeight: 700,
                            }}
                          >
                            {team.teamId || team._id.substring(0, 8)}
                          </code>
                        </td>
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <strong style={{ color: 'var(--ink)', fontSize: '14px' }}>
                              {team.teamName}
                            </strong>
                            <div style={{ fontSize: '11px', color: 'var(--muted)' }}>
                              {team.members?.length || 1} members
                            </div>
                          </div>
                        </td>
                        <td>
                          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--green)' }}>
                            {team.theme?.name || 'Assigned Track'}
                          </span>
                        </td>
                        <td>
                          <div style={{ fontSize: '12.5px', fontWeight: 700 }}>
                            {team.leader?.name || 'Leader'}
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--muted)' }}>
                            {team.leader?.email}
                          </div>
                          {team.leader?.phone && (
                            <div style={{ fontSize: '10.5px', color: 'var(--muted)' }}>
                              📱 {team.leader?.phone}
                            </div>
                          )}
                        </td>
                        <td>{getScoreBadge(team.r1AvgScore, team.r1EvaluationsCount)}</td>
                        <td>{getScoreBadge(team.r2AvgScore, team.r2EvaluationsCount)}</td>
                        <td>
                          <span className={`badge ${team.round1Status}`}>{team.round1Status}</span>
                        </td>
                        <td>
                          <span className={`badge ${team.round2Status}`}>{team.round2Status}</span>
                        </td>
                        <td>
                          <span className={`badge ${team.finalStatus}`}>{team.finalStatus}</span>
                        </td>
                        <td>
                          {team.assignedPanelists && team.assignedPanelists.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                              {team.assignedPanelists.map((p, idx) => (
                                <span
                                  key={idx}
                                  style={{
                                    background: 'rgba(2, 132, 199, 0.1)',
                                    color: '#0369a1',
                                    padding: '2px 6px',
                                    borderRadius: '4px',
                                    fontSize: '11px',
                                    fontWeight: 600,
                                  }}
                                >
                                  ⚖️ {p.name ? p.name.split(' ')[0] : 'Judge'}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span style={{ fontSize: '11px', color: 'var(--muted)', fontStyle: 'italic' }}>
                              None assigned
                            </span>
                          )}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                            <button
                              className="btn btn-sm btn-secondary"
                              onClick={() => openInspectModal(team)}
                              title="Inspect Pitch, Dossier and Score Breakdown"
                              style={{ padding: '4px 8px', fontSize: '11.5px' }}
                            >
                              <Eye size={13} /> {t.inspectBtn}
                            </button>

                            {team.round1Status !== 'SELECTED' && (
                              <button
                                className="btn btn-sm"
                                style={{
                                  background: '#ecfdf5',
                                  color: '#047857',
                                  border: '1px solid #a7f3d0',
                                  padding: '4px 8px',
                                  fontSize: '11.5px',
                                }}
                                onClick={() => handleSelectRound1(team._id)}
                                title="Advance to Round 2"
                              >
                                {t.selectR1Btn}
                              </button>
                            )}

                            {team.round1Status === 'SELECTED' && team.finalStatus !== 'FINALIST' && (
                              <button
                                className="btn btn-sm btn-primary"
                                style={{ padding: '4px 8px', fontSize: '11.5px' }}
                                onClick={() => handleSelectRound2(team._id)}
                                title="Promote to Grand Finalist"
                              >
                                {t.finalistBtn}
                              </button>
                            )}

                            {team.round1Status === 'SUBMITTED' && (
                              <button
                                className="btn btn-sm"
                                style={{
                                  background: '#fff1f2',
                                  color: '#be123c',
                                  border: '1px solid #fecdd3',
                                  padding: '4px 8px',
                                  fontSize: '11.5px',
                                }}
                                onClick={() => handleRejectRound1(team._id)}
                                title="Reject Round 1"
                              >
                                {t.rejectBtn}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: JUDGES & PANELIST MANAGEMENT                                      */}
      {/* ========================================================================= */}
      {activeTab === 'panelists' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="grid-2">
            {/* CREATE JUDGE ACCOUNT */}
            <div className="light-card" style={{ padding: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                <span style={{ background: '#f0fdf4', color: 'var(--green)', padding: '6px', borderRadius: '8px' }}>
                  <UserCheck size={20} />
                </span>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: 800, margin: 0 }}>
                  {t.createJudgeTitle}
                </h3>
              </div>
              <p style={{ color: 'var(--muted)', fontSize: '13px', marginBottom: '20px' }}>
                {t.createJudgeSub}
              </p>

              <form onSubmit={handleCreatePanelist}>
                <div className="form-group">
                  <label>{t.judgeNameLabel}</label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. Ananya Sharma"
                    value={panelistForm.name}
                    onChange={(e) => setPanelistForm({ ...panelistForm, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group" style={{ margin: 0 }}>
                    <label>{t.judgeEmailLabel}</label>
                    <input
                      type="email"
                      placeholder="judge@ideathon.org"
                      value={panelistForm.email}
                      onChange={(e) => setPanelistForm({ ...panelistForm, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label>{t.judgePhoneLabel}</label>
                    <input
                      type="tel"
                      placeholder="+91 98765 00000"
                      value={panelistForm.phone}
                      onChange={(e) => setPanelistForm({ ...panelistForm, phone: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginTop: '16px' }}>
                  <label>{t.judgePasswordLabel}</label>
                  <input
                    type="password"
                    placeholder="Min 6 characters (e.g. Judge@2026)"
                    value={panelistForm.password}
                    onChange={(e) => setPanelistForm({ ...panelistForm, password: e.target.value })}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary w-full mt-2">
                  <Plus size={16} /> {t.saveJudgeBtn}
                </button>
              </form>
            </div>

            {/* ACTIVE JUDGES DIRECTORY */}
            <div className="light-card" style={{ padding: '28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: 800, margin: 0 }}>
                    {t.activeJudgesTitle} ({panelists.length})
                  </h3>
                  <p style={{ color: 'var(--muted)', fontSize: '13px', margin: '2px 0 0' }}>
                    {t.activeJudgesSub}
                  </p>
                </div>
              </div>

              {panelists.length === 0 ? (
                <div style={{ padding: '36px 0', textAlign: 'center', color: 'var(--muted)' }}>
                  <div style={{ fontSize: '32px', marginBottom: '6px' }}>⚖️</div>
                  <strong>{t.noJudgesCreated}</strong>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '380px', overflowY: 'auto' }}>
                  {panelists.map((p) => (
                    <div
                      key={p._id}
                      style={{
                        background: 'rgba(12, 91, 53, 0.03)',
                        border: '1px solid rgba(12, 91, 53, 0.12)',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '12px',
                      }}
                    >
                      <div>
                        <strong style={{ fontSize: '14px', color: 'var(--ink)' }}>{p.name}</strong>
                        <div style={{ color: 'var(--muted)', fontSize: '12px', marginTop: '2px' }}>
                          ✉️ {p.email} • 📱 {p.phone || 'No phone'}
                        </div>
                        <div style={{ color: 'var(--green2)', fontWeight: 700, fontSize: '11.5px', marginTop: '3px' }}>
                          📊 {p.assignedTeamsCount || 0} teams assigned • {p.evaluatedCount || 0} evaluations submitted
                        </div>
                      </div>
                      <button
                        type="button"
                        className="btn btn-sm"
                        style={{
                          background: '#fee2e2',
                          color: '#b91c1c',
                          border: '1px solid #fecaca',
                          padding: '6px 12px',
                          fontSize: '11.5px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          borderRadius: '8px',
                          flexShrink: 0,
                        }}
                        onClick={() => handleDeletePanelist(p._id, p.name)}
                        title={`Delete ${p.name}`}
                      >
                        <Trash2 size={13} /> Delete
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ASSIGN PANELISTS TO TEAMS */}
          <div className="light-card" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <span style={{ background: '#f0f9ff', color: '#0284c7', padding: '6px', borderRadius: '8px' }}>
                <Key size={20} />
              </span>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: 800, margin: 0 }}>
                {t.assignJudgesTitle}
              </h3>
            </div>
            <p style={{ color: 'var(--muted)', fontSize: '13px', marginBottom: '20px' }}>
              {t.assignJudgesSub}
            </p>

            <form onSubmit={handleAssignPanelists}>
              <div className="form-row">
                <div className="form-group" style={{ margin: 0 }}>
                  <label>{t.targetTeamLabel}</label>
                  <select
                    value={assignTeamId}
                    onChange={(e) => setAssignTeamId(e.target.value)}
                    required
                  >
                    <option value="">Select Team to Assign...</option>
                    {teams.map((t) => (
                      <option key={t._id} value={t._id}>
                        {t.teamName} ({t.teamId || t._id.substring(0, 6)}) — {t.theme?.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label>
                    {t.selectJudgesLabel} ({assignPanelistEmails.length} Selected)
                  </label>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '4px' }}>
                    {panelists.map((p) => {
                      const isSelected = assignPanelistEmails.includes(p.email);
                      return (
                        <button
                          key={p._id}
                          type="button"
                          onClick={() => togglePanelistSelection(p.email)}
                          style={{
                            background: isSelected ? 'var(--green)' : '#ffffff',
                            color: isSelected ? '#ffffff' : 'var(--ink)',
                            border: `1.5px solid ${isSelected ? 'var(--green)' : 'rgba(12, 91, 53, 0.2)'}`,
                            padding: '6px 14px',
                            borderRadius: '999px',
                            fontSize: '12px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            transition: 'all 0.2s ease',
                          }}
                        >
                          {isSelected ? '✓ ' : '+ '}
                          {p.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '20px' }}>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={!assignTeamId || assignPanelistEmails.length === 0}
                >
                  <CheckCircle2 size={16} /> {t.confirmAssignmentBtn}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: GRAND FINALE STAGE SCHEDULER                                       */}
      {/* ========================================================================= */}
      {activeTab === 'finalists' && (
        <div className="grid-2">
          {/* SCHEDULE FORM */}
          <div className="light-card" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <span style={{ background: '#fffbeb', color: '#d97706', padding: '6px', borderRadius: '8px' }}>
                <Trophy size={20} />
              </span>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: 800, margin: 0 }}>
                {t.schedulerTitle}
              </h3>
            </div>
            <p style={{ color: 'var(--muted)', fontSize: '13px', marginBottom: '20px' }}>
              {t.schedulerSub}
            </p>

            <form onSubmit={handleScheduleFinalist}>
              <div className="form-group">
                <label>{t.selectFinalistLabel}</label>
                <select
                  value={schedTeamId}
                  onChange={(e) => setSchedTeamId(e.target.value)}
                  required
                >
                  <option value="">Select Finalist Team...</option>
                  {teams
                    .filter((t) => t.finalStatus === 'FINALIST')
                    .map((t) => (
                      <option key={t._id} value={t._id}>
                        🏆 {t.teamName} ({t.teamId})
                      </option>
                    ))}
                </select>
              </div>

              <div className="form-row">
                <div className="form-group" style={{ margin: 0 }}>
                  <label>{t.venueLabel}</label>
                  <input
                    type="text"
                    value={schedVenue}
                    onChange={(e) => setSchedVenue(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label>{t.timeLabel}</label>
                  <input
                    type="text"
                    value={schedTime}
                    onChange={(e) => setSchedTime(e.target.value)}
                    placeholder="e.g. 11:30 AM"
                    required
                  />
                </div>
              </div>

              <div className="form-row" style={{ marginTop: '16px' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label>{t.durationLabel}</label>
                  <input
                    type="text"
                    value={schedDuration}
                    onChange={(e) => setSchedDuration(e.target.value)}
                    placeholder="e.g. 15 minutes"
                    required
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label>{t.dateLabel}</label>
                  <input
                    type="date"
                    value={schedDate}
                    onChange={(e) => setSchedDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginTop: '16px' }}>
                <label>{t.instructionsLabel}</label>
                <input
                  type="text"
                  value={schedInstructions}
                  onChange={(e) => setSchedInstructions(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary w-full mt-4">
                <Trophy size={16} /> {t.confirmSlotBtn}
              </button>
            </form>
          </div>

          {/* FINALIST PASS PREVIEW */}
          <div className="light-card" style={{ padding: '28px' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: 800, marginBottom: '6px' }}>
              {t.passPreviewTitle}
            </h3>
            <p style={{ color: 'var(--muted)', fontSize: '13px', marginBottom: '20px' }}>
              {t.passPreviewSub}
            </p>

            <div
              style={{
                background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
                border: '2px solid #fcd34d',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 10px 30px rgba(217, 119, 6, 0.1)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '16px',
                }}
              >
                <span
                  style={{
                    background: '#d97706',
                    color: '#ffffff',
                    padding: '4px 12px',
                    borderRadius: '999px',
                    fontSize: '11px',
                    fontWeight: 800,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                  }}
                >
                  🏆 Official Finalist Pass
                </span>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#92400e' }}>
                  HASIRU SAMVADHA 2026–27
                </span>
              </div>

              <h4 style={{ fontSize: '20px', fontWeight: 800, color: '#78350f', margin: '0 0 14px' }}>
                {teams.find((t) => t._id === schedTeamId)?.teamName || 'Selected Finalist Team'}
              </h4>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '14px',
                  fontSize: '13px',
                  color: '#92400e',
                  marginBottom: '16px',
                }}
              >
                <div>
                  <strong style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', opacity: 0.8 }}>
                    Venue / Stage
                  </strong>
                  <span>📍 {schedVenue}</span>
                </div>
                <div>
                  <strong style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', opacity: 0.8 }}>
                    Time & Duration
                  </strong>
                  <span>
                    ⏰ {schedTime} ({schedDuration})
                  </span>
                </div>
                <div>
                  <strong style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', opacity: 0.8 }}>
                    Date
                  </strong>
                  <span>📅 {schedDate}</span>
                </div>
                <div>
                  <strong style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', opacity: 0.8 }}>
                    Access Status
                  </strong>
                  <span style={{ color: '#047857', fontWeight: 700 }}>✓ Stage Pass Confirmed</span>
                </div>
              </div>

              <div style={{ borderTop: '1px dashed #f59e0b', paddingTop: '12px', fontSize: '12px', color: '#78350f' }}>
                <strong>Guidelines:</strong> {schedInstructions}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* INSPECT TEAM & JURY SCORECARD BREAKDOWN MODAL                             */}
      {/* ========================================================================= */}
      {inspectTeam && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 41, 30, 0.75)',
            backdropFilter: 'blur(8px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={closeInspectModal}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '20px',
              width: '100%',
              maxWidth: '900px',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
              border: '1px solid rgba(12, 91, 53, 0.2)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* MODAL HEADER */}
            <div
              style={{
                padding: '24px 28px',
                borderBottom: '1px solid rgba(12, 91, 53, 0.1)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                position: 'sticky',
                top: 0,
                background: '#ffffff',
                zIndex: 10,
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <code style={{ background: '#f1f5f9', padding: '3px 8px', borderRadius: '4px', fontSize: '13px', fontWeight: 700 }}>
                    {inspectTeam.teamId || inspectTeam._id}
                  </code>
                  <span style={{ fontSize: '12px', color: 'var(--green)', fontWeight: 700 }}>
                    {inspectTeam.theme?.name || 'General Track'}
                  </span>
                </div>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', fontWeight: 800, margin: 0, color: 'var(--ink)' }}>
                  {inspectTeam.teamName}
                </h2>
                <div style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '2px' }}>
                  Leader: <strong>{inspectTeam.leader?.name}</strong> ({inspectTeam.leader?.email}) • {inspectTeam.members?.length || 1} Members
                </div>
              </div>

              <button
                onClick={closeInspectModal}
                style={{
                  background: '#f1f5f9',
                  border: 'none',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'var(--ink)',
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* MODAL BODY */}
            <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* STATUS & SCORE SUMMARY CARDS */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
                <div style={{ background: 'rgba(12, 91, 53, 0.04)', padding: '14px 18px', borderRadius: '12px', border: '1px solid rgba(12, 91, 53, 0.1)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                    Round 1 Avg Score
                  </div>
                  <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--green)', marginTop: '2px' }}>
                    {inspectTeam.r1AvgScore !== null ? `⭐ ${inspectTeam.r1AvgScore}/100` : '—'}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--muted)' }}>
                    {inspectTeam.r1EvaluationsCount || 0} Jury Evaluations
                  </div>
                </div>

                <div style={{ background: 'rgba(2, 132, 199, 0.04)', padding: '14px 18px', borderRadius: '12px', border: '1px solid rgba(2, 132, 199, 0.15)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                    Round 2 Avg Score
                  </div>
                  <div style={{ fontSize: '22px', fontWeight: 800, color: '#0284c7', marginTop: '2px' }}>
                    {inspectTeam.r2AvgScore !== null ? `⭐ ${inspectTeam.r2AvgScore}/100` : '—'}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--muted)' }}>
                    {inspectTeam.r2EvaluationsCount || 0} Jury Evaluations
                  </div>
                </div>

                <div style={{ background: '#fafaf9', padding: '14px 18px', borderRadius: '12px', border: '1px solid #e7e5e4' }}>
                  <div style={{ fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                    Progression Status
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '6px' }}>
                    <span className={`badge ${inspectTeam.round1Status}`}>R1: {inspectTeam.round1Status}</span>
                    <span className={`badge ${inspectTeam.round2Status}`}>R2: {inspectTeam.round2Status}</span>
                    <span className={`badge ${inspectTeam.finalStatus}`}>Final: {inspectTeam.finalStatus}</span>
                  </div>
                </div>
              </div>

              {/* JURY EVALUATION BREAKDOWN SCORECARDS */}
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--ink)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Star size={18} style={{ color: '#d97706' }} />
                  {t.modalScoresTitle} ({inspectTeam.evaluations?.length || 0})
                </h3>

                {(!inspectTeam.evaluations || inspectTeam.evaluations.length === 0) ? (
                  <div style={{ padding: '24px', background: '#f8fafc', borderRadius: '12px', textAlign: 'center', color: 'var(--muted)', fontSize: '13px' }}>
                    {t.noScoresYet}
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {inspectTeam.evaluations.map((ev, idx) => (
                      <div
                        key={idx}
                        style={{
                          background: '#ffffff',
                          border: '1.5px solid rgba(12, 91, 53, 0.15)',
                          borderRadius: '14px',
                          padding: '18px 20px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                          <div>
                            <strong style={{ fontSize: '14.5px', color: 'var(--ink)' }}>
                              ⚖️ {ev.panelistId?.name || 'Jury Member'}
                            </strong>
                            <span style={{ fontSize: '12px', color: 'var(--muted)', marginLeft: '8px' }}>
                              ({ev.panelistId?.email}) • Round {ev.round}
                            </span>
                          </div>
                          <span
                            style={{
                              background: '#ecfdf5',
                              color: '#047857',
                              fontWeight: 800,
                              fontSize: '15px',
                              padding: '4px 12px',
                              borderRadius: '999px',
                              border: '1px solid #a7f3d0',
                            }}
                          >
                            ⭐ {ev.totalScore} / 100
                          </span>
                        </div>

                        {/* Criteria marks */}
                        {ev.scores && typeof ev.scores === 'object' && Object.keys(ev.scores).length > 0 && (
                          <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '8px', marginBottom: '10px', fontSize: '12.5px' }}>
                            <strong style={{ color: 'var(--ink)', display: 'block', marginBottom: '4px', fontSize: '11.5px', textTransform: 'uppercase' }}>
                              {t.criteriaMarks}:
                            </strong>
                            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                              {Object.entries(ev.scores).map(([k, v]) => (
                                <span key={k} style={{ color: '#334155' }}>
                                  <strong>{k}:</strong> {v}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {ev.comments && (
                          <div style={{ fontSize: '13px', color: '#475569', background: '#fffbeb', padding: '10px 14px', borderRadius: '8px', border: '1px solid #fef3c7' }}>
                            <strong style={{ color: '#92400e' }}>💬 {t.judgeComments}:</strong> {ev.comments}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* ROUND 1 PITCH CONTENT */}
              {teamSubmissions.r1 && (
                <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--ink)', marginBottom: '10px' }}>
                    📝 {t.modalR1Pitch}
                  </h3>
                  <div style={{ marginBottom: '12px' }}>
                    <strong style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--muted)', display: 'block' }}>
                      Problem Statement:
                    </strong>
                    <p style={{ fontSize: '13.5px', color: 'var(--ink)', margin: '4px 0 0', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                      {teamSubmissions.r1.problemStatement || 'No problem statement provided.'}
                    </p>
                  </div>
                  <div>
                    <strong style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--muted)', display: 'block' }}>
                      Proposed Solution Blueprint:
                    </strong>
                    <p style={{ fontSize: '13.5px', color: 'var(--ink)', margin: '4px 0 0', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                      {teamSubmissions.r1.proposedSolution || 'No solution blueprint provided.'}
                    </p>
                  </div>
                </div>
              )}

              {/* ROUND 2 DOSSIER CONTENT */}
              {teamSubmissions.r2 && (
                <div style={{ background: '#f0fdf4', padding: '20px', borderRadius: '14px', border: '1px solid #bbf7d0' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--green-deep)', marginBottom: '10px' }}>
                    🚀 {t.modalR2Dossier}
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13.5px' }}>
                    <div>
                      <strong style={{ color: 'var(--green)' }}>1. Detailed Concept & Architecture:</strong>
                      <p style={{ margin: '4px 0 0', whiteSpace: 'pre-wrap' }}>{teamSubmissions.r2.detailedConcept}</p>
                    </div>
                    <div>
                      <strong style={{ color: 'var(--green)' }}>2. Value Proposition & Circularity:</strong>
                      <p style={{ margin: '4px 0 0', whiteSpace: 'pre-wrap' }}>{teamSubmissions.r2.valuePropositionAndCircularity}</p>
                    </div>
                    <div>
                      <strong style={{ color: 'var(--green)' }}>3. 90-Day Implementation Plan:</strong>
                      <p style={{ margin: '4px 0 0', whiteSpace: 'pre-wrap' }}>{teamSubmissions.r2.feasibilityPlan90Days}</p>
                    </div>
                    <div>
                      <strong style={{ color: 'var(--green)' }}>4. Resource Requirements & Budget:</strong>
                      <p style={{ margin: '4px 0 0', whiteSpace: 'pre-wrap' }}>{teamSubmissions.r2.resourceRequirements}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* MODAL FOOTER WITH ADVANCE / REJECT ACTIONS */}
            <div
              style={{
                padding: '18px 28px',
                borderTop: '1px solid rgba(12, 91, 53, 0.1)',
                background: '#f8fafc',
                borderBottomLeftRadius: '20px',
                borderBottomRightRadius: '20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <button className="btn btn-secondary" onClick={closeInspectModal}>
                {t.closeModal}
              </button>

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {inspectTeam.round1Status !== 'SELECTED' && (
                  <button
                    className="btn"
                    style={{ background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0' }}
                    onClick={() => handleSelectRound1(inspectTeam._id)}
                  >
                    {t.advanceToR2Modal}
                  </button>
                )}

                {inspectTeam.finalStatus !== 'FINALIST' && (
                  <button
                    className="btn btn-primary"
                    onClick={() => handleSelectRound2(inspectTeam._id)}
                  >
                    {t.promoteFinalistModal}
                  </button>
                )}

                <button
                  className="btn"
                  style={{ background: '#fff1f2', color: '#be123c', border: '1px solid #fecdd3' }}
                  onClick={() => handleRejectRound1(inspectTeam._id)}
                >
                  {t.rejectModal}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
