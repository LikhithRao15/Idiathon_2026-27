'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiRequest } from '../../lib/api';
import { useRouter } from 'next/navigation';
import {
  Users,
  User,
  Mail,
  Phone,
  Sparkles,
  CheckCircle2,
  Lock,
  ArrowRight,
  RefreshCw,
  Lightbulb,
  FileText,
  Award,
  Tag,
  Calendar,
  Clock,
  MapPin,
  HelpCircle,
  ShieldCheck,
} from 'lucide-react';

// Helper function to count words
function countWords(str) {
  if (!str) return 0;
  const matches = str.trim().match(/\S+/g);
  return matches ? matches.length : 0;
}

export default function ParticipantPage() {
  const { user, token, showToast } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState('team');
  const [team, setTeam] = useState(null);
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Team Form
  const [teamName, setTeamName] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('');
  const [members, setMembers] = useState([]);

  // Round 1 Form
  const [r1ThemeId, setR1ThemeId] = useState('');
  const [r1Problem, setR1Problem] = useState('');
  const [r1Solution, setR1Solution] = useState('');
  const [r1Submission, setR1Submission] = useState(null);

  // Round 2 Form (The 4 Exact Questions)
  const [r2Data, setR2Data] = useState({
    detailedConcept: '',
    valuePropositionAndCircularity: '',
    feasibilityPlan90Days: '',
    resourceRequirements: '',
  });
  const [r2Submission, setR2Submission] = useState(null);

  // Finalist Pass
  const [finalistPass, setFinalistPass] = useState(null);

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }
    loadData();
  }, [token]);

  const loadData = async () => {
    setLoading(true);
    await Promise.all([loadThemes(), loadMyTeam()]);
    setLoading(false);
  };

  const loadThemes = async () => {
    const res = await apiRequest('/themes');
    const data = Array.isArray(res.data) ? res.data : (res.data?.themes || []);
    setThemes(data);
  };

  const loadMyTeam = async () => {
    const res = await apiRequest('/teams/my-team');
    const teamData = res.data && res.data._id ? res.data : null;

    if (res.ok && teamData) {
      setTeam(teamData);
      setR1ThemeId(teamData.theme?._id || teamData.theme || '');
      loadRound1Data();
      loadRound2Data();

      if (teamData.finalStatus === 'FINALIST') {
        loadFinalistDetails(teamData._id);
      }
    } else {
      setTeam(null);
    }
  };

  const loadRound1Data = async () => {
    const res = await apiRequest('/round1/submission');
    const s = res.data && res.data._id ? res.data : null;
    if (res.ok && s) {
      setR1Submission(s);
      setR1Problem(s.problemStatement || '');
      setR1Solution(s.proposedSolution || '');
      if (s.themeId) setR1ThemeId(s.themeId._id || s.themeId);
    }
  };

  const loadRound2Data = async () => {
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
  };

  const loadFinalistDetails = async (teamId) => {
    const res = await apiRequest(`/finalists/${teamId}`);
    const d = res.data && res.data.venue ? res.data : (res.data?.finalistDetails || null);
    if (res.ok && d) {
      setFinalistPass(d);
    }
  };

  const addMemberRow = () => {
    if (members.length >= 2) {
      showToast('Maximum 2 additional teammates allowed (Leader + 2 members)', true);
      return;
    }
    setMembers([...members, { name: '', email: '', phone: '', roleInTeam: '' }]);
  };

  const removeMemberRow = (index) => {
    setMembers(members.filter((_, i) => i !== index));
  };

  const updateMember = (index, field, value) => {
    const updated = [...members];
    updated[index][field] = value;
    setMembers(updated);
  };

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    const cleanMembers = members.filter((m) => m.name && m.email && m.phone);
    const res = await apiRequest('/teams', {
      method: 'POST',
      body: JSON.stringify({
        teamName,
        theme: selectedTheme,
        members: cleanMembers,
      }),
    });

    if (res.ok) {
      showToast(`Team "${teamName}" created successfully!`);
      await loadMyTeam();
      setActiveTab('r1');
    } else {
      showToast(res.message || 'Team creation failed', true);
    }
  };

  const handleR1Submit = async (e) => {
    e.preventDefault();

    const problemWords = countWords(r1Problem);
    const solutionWords = countWords(r1Solution);

    if (problemWords > 150) {
      showToast(`Problem Statement exceeds 150 words limit (${problemWords} words). Please condense.`, true);
      return;
    }
    if (solutionWords > 250) {
      showToast(`Proposed Solution exceeds 250 words limit (${solutionWords} words). Please condense.`, true);
      return;
    }

    const res = await apiRequest('/round1/submit', {
      method: 'POST',
      body: JSON.stringify({
        themeId: r1ThemeId || team?.theme?._id || team?.theme,
        problemStatement: r1Problem,
        proposedSolution: r1Solution,
      }),
    });

    if (res.ok) {
      showToast('Round 1 Proposal Submitted Successfully! Assigned Judges can now evaluate.');
      await loadMyTeam();
      await loadRound1Data();
    } else {
      showToast(res.message || 'Round 1 Submission Failed', true);
    }
  };

  const handleR2Submit = async (e) => {
    e.preventDefault();

    const conceptWords = countWords(r2Data.detailedConcept);
    const valPropWords = countWords(r2Data.valuePropositionAndCircularity);
    const feasibilityWords = countWords(r2Data.feasibilityPlan90Days);
    const resourceWords = countWords(r2Data.resourceRequirements);

    if (conceptWords > 1000) {
      showToast(`Detailed Concept exceeds 1000 words limit (${conceptWords} words).`, true);
      return;
    }
    if (valPropWords > 150) {
      showToast(`Value Proposition and Circularity exceeds 150 words limit (${valPropWords} words).`, true);
      return;
    }
    if (feasibilityWords > 200) {
      showToast(`90 Days Feasibility Plan exceeds 200 words limit (${feasibilityWords} words).`, true);
      return;
    }
    if (resourceWords > 100) {
      showToast(`Resource Requirement exceeds 100 words limit (${resourceWords} words).`, true);
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
      showToast('Round 2 Deep-Dive Dossier successfully submitted to MongoDB!');
      await loadMyTeam();
      await loadRound2Data();
    } else {
      showToast(res.message || 'Round 2 Submission Failed', true);
    }
  };

  return (
    <div className="portal-container participant-portal-wrap">
      {/* HEADER */}
      <div className="portal-header">
        <div>
          <h1 className="portal-title">🌱 Idea Pitching & Submission Portal</h1>
          <p className="portal-subtitle">
            Team Leader: <strong>{user?.name}</strong> ({user?.email}) • Hasiru Samvadha Ideathon 2026
          </p>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={loadData}>
          <RefreshCw size={14} /> Refresh Status
        </button>
      </div>

      {/* PROGRESS TRACKER */}
      <div className="tracker-box">
        <div className={`tracker-node ${team ? 'done' : 'current'}`}>
          <div className="tracker-bubble">{team ? '✓' : '1'}</div>
          <div className="tracker-info">
            <strong>1. Team & Leader</strong>
            <span>{team ? team.teamName : 'Register Team'}</span>
          </div>
        </div>

        <div className={`tracker-connector ${team ? 'done' : ''}`}></div>

        <div className={`tracker-node ${team?.round1Status === 'SELECTED' ? 'done' : team?.round1Status === 'SUBMITTED' ? 'current' : ''}`}>
          <div className="tracker-bubble">{team?.round1Status === 'SELECTED' ? '✓' : '2'}</div>
          <div className="tracker-info">
            <strong>2. Round 1 Pitch</strong>
            <span>{team?.round1Status === 'SELECTED' ? 'Selected ✓' : team?.round1Status || 'Draft'}</span>
          </div>
        </div>

        <div className={`tracker-connector ${team?.round1Status === 'SELECTED' ? 'done' : ''}`}></div>

        <div className={`tracker-node ${team?.finalStatus === 'FINALIST' ? 'done' : team?.round1Status === 'SELECTED' ? 'current' : ''}`}>
          <div className="tracker-bubble">{team?.finalStatus === 'FINALIST' ? '✓' : '3'}</div>
          <div className="tracker-info">
            <strong>3. Round 2 Elaboration</strong>
            <span>{team?.round1Status === 'SELECTED' ? (team?.round2Status === 'SUBMITTED' ? 'Submitted ✓' : 'Unlocked') : 'Locked'}</span>
          </div>
        </div>

        <div className={`tracker-connector ${team?.finalStatus === 'FINALIST' ? 'done' : ''}`}></div>

        <div className={`tracker-node ${team?.finalStatus === 'FINALIST' ? 'done' : ''}`}>
          <div className="tracker-bubble">🏆</div>
          <div className="tracker-info">
            <strong>4. Grand Finale</strong>
            <span>{team?.finalStatus === 'FINALIST' ? 'Stage Pass Ready' : 'Pending'}</span>
          </div>
        </div>
      </div>

      {/* GRAND FINALIST STAGE PASS (If qualified) */}
      {finalistPass && (
        <div className="finalist-pass">
          <div className="pass-icon">🏆</div>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#b45309', textTransform: 'uppercase', letterSpacing: '1px' }}>
              OFFICIAL GRAND FINALE STAGE PASS
            </span>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', fontWeight: 800, color: '#92400e', margin: '4px 0' }}>
              Congratulations, {team?.teamName}!
            </h3>
            <p style={{ color: '#78350f', fontSize: '13px', marginBottom: '12px' }}>
              Your team has been selected by the Jury as a Grand Finalist. Here are your auditorium presentation slot details:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
              <div style={{ background: '#ffffff', padding: '10px 14px', borderRadius: '8px', border: '1px solid #fde68a' }}>
                <strong style={{ fontSize: '10px', color: '#b45309', display: 'block', marginBottom: '2px' }}>STAGE / VENUE</strong>
                <span style={{ fontWeight: 600, color: '#78350f' }}>{finalistPass.venue || 'Grand Innovation Stage'}</span>
              </div>
              <div style={{ background: '#ffffff', padding: '10px 14px', borderRadius: '8px', border: '1px solid #fde68a' }}>
                <strong style={{ fontSize: '10px', color: '#b45309', display: 'block', marginBottom: '2px' }}>SLOT TIME</strong>
                <span style={{ fontWeight: 600, color: '#78350f' }}>{finalistPass.startTime || '11:00 AM'} ({finalistPass.presentationDuration || '15 min'})</span>
              </div>
              <div style={{ background: '#ffffff', padding: '10px 14px', borderRadius: '8px', border: '1px solid #fde68a' }}>
                <strong style={{ fontSize: '10px', color: '#b45309', display: 'block', marginBottom: '2px' }}>DATE</strong>
                <span style={{ fontWeight: 600, color: '#78350f' }}>{finalistPass.eventDate ? new Date(finalistPass.eventDate).toLocaleDateString() : 'Finale Day'}</span>
              </div>
              <div style={{ background: '#ffffff', padding: '10px 14px', borderRadius: '8px', border: '1px solid #fde68a' }}>
                <strong style={{ fontSize: '10px', color: '#b45309', display: 'block', marginBottom: '2px' }}>INSTRUCTIONS</strong>
                <span style={{ fontWeight: 600, color: '#78350f' }}>{finalistPass.instructions || 'Bring working demo hardware'}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TABS */}
      <div className="tab-bar">
        <button className={`tab-btn ${activeTab === 'team' ? 'active' : ''}`} onClick={() => setActiveTab('team')}>
          👥 1. Team Hub & Theme
        </button>
        <button className={`tab-btn ${activeTab === 'r1' ? 'active' : ''}`} onClick={() => setActiveTab('r1')}>
          💡 2. Round 1: Idea Pitch
        </button>
        <button className={`tab-btn ${activeTab === 'r2' ? 'active' : ''}`} onClick={() => setActiveTab('r2')}>
          🔒 3. Round 2: Idea Elaboration
        </button>
      </div>

      {/* TAB 1: TEAM HUB */}
      {activeTab === 'team' && (
        <div>
          {team ? (
            <div className="light-card participant-card">
              <div className="team-hub-header">
                <div>
                  <div className="team-meta-row">
                    <span className="team-id-badge">{team.teamId}</span>
                    <span className="team-theme-pill">
                      <Tag size={12} /> {team.theme?.name || 'General Innovation'}
                    </span>
                  </div>
                  <h2 className="team-hub-title">{team.teamName}</h2>
                </div>
                <span className={`badge ${team.finalStatus === 'FINALIST' ? 'FINALIST' : team.round1Status || 'DRAFT'}`}>
                  {team.finalStatus === 'FINALIST' ? '🏆 FINALIST' : team.round1Status || 'DRAFT'}
                </span>
              </div>

              <div className="grid-2 participant-roster-grid">
                <div className="roster-card leader-card">
                  <div className="roster-card-header">
                    <span className="roster-badge leader-badge">👑 Team Leader</span>
                    <span className="roster-auth-tag">Primary Account</span>
                  </div>
                  <div className="roster-card-body">
                    <h3 className="roster-name">{team.leader?.name || user?.name}</h3>
                    <div className="roster-contact-item">
                      <Mail size={14} /> <span>{team.leader?.email || user?.email}</span>
                    </div>
                    <div className="roster-contact-item">
                      <Phone size={14} /> <span>{team.leader?.phone || user?.phone || 'Not provided'}</span>
                    </div>
                  </div>
                </div>

                <div className="roster-card members-card">
                  <div className="roster-card-header">
                    <span className="roster-badge member-badge">👥 Team Members</span>
                    <span className="roster-count">{team.members?.length || 0} additional</span>
                  </div>
                  <div className="roster-card-body">
                    {team.members?.length > 0 ? (
                      <div className="members-sublist">
                        {team.members.map((m, i) => (
                          <div key={i} className="member-subitem">
                            <div className="member-subitem-top">
                              <strong>{m.name}</strong>
                              {m.roleInTeam && <span className="member-role-tag">{m.roleInTeam}</span>}
                            </div>
                            <div className="member-subitem-contact">
                              <span><Mail size={12} /> {m.email}</span>
                              {m.phone && <span><Phone size={12} /> {m.phone}</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="solo-leader-note">
                        <User size={20} />
                        <div>
                          <strong>Solo Innovator Submission</strong>
                          <p>Participating as a 1-person team (Leader only).</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="team-hub-action-bar">
                <button className="btn btn-primary" onClick={() => setActiveTab('r1')}>
                  Proceed to Round 1 Idea Pitch <ArrowRight size={16} />
                </button>
              </div>
            </div>
          ) : (
            <div className="light-card participant-card">
              <div className="team-create-header">
                <h2 className="pitch-form-title">
                  👥 Register Your Team
                </h2>
                <p className="pitch-form-subtitle">
                  Only the team leader registers this team. Teammates do not need to register separate accounts.
                </p>
              </div>

              <form onSubmit={handleCreateTeam}>
                <div className="grid-2" style={{ marginBottom: '20px' }}>
                  <div className="form-group pitch-form-group">
                    <label className="pitch-label">Team Name *</label>
                    <input
                      type="text"
                      className="pitch-input"
                      placeholder="e.g. EcoTransformers"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group pitch-form-group">
                    <label className="pitch-label">Select Challenge Theme *</label>
                    <select
                      className="pitch-input select-styled"
                      value={selectedTheme}
                      onChange={(e) => setSelectedTheme(e.target.value)}
                      required
                    >
                      <option value="">Select a Theme...</option>
                      {themes.map((t) => (
                        <option key={t._id} value={t._id}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ marginTop: '24px', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: 800, margin: 0, color: 'var(--ink)' }}>
                      Teammates (Optional)
                    </h4>
                    <span style={{ fontSize: '12px', color: 'var(--green2)', fontWeight: 700 }}>
                      Solo innovators (1 person = Leader only) are welcome!
                    </span>
                  </div>
                  <p style={{ color: 'var(--muted)', fontSize: '12.5px', marginTop: '3px' }}>
                    If you are participating alone, you can skip adding teammates and submit directly.
                  </p>
                </div>

                {members.map((m, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: 'rgba(12, 91, 53, 0.03)',
                      border: '1px solid rgba(12, 91, 53, 0.12)',
                      padding: '16px',
                      borderRadius: '12px',
                      marginBottom: '14px',
                      position: 'relative',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <strong style={{ fontSize: '13px', color: 'var(--ink)' }}>
                        Teammate #{idx + 1}
                      </strong>
                      <button
                        type="button"
                        style={{
                          background: '#fee2e2',
                          color: '#b91c1c',
                          border: 'none',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                        onClick={() => removeMemberRow(idx)}
                      >
                        ✕ Remove
                      </button>
                    </div>

                    <div className="grid-2" style={{ gap: '12px' }}>
                      <input
                        type="text"
                        className="pitch-input"
                        placeholder={`Member ${idx + 1} Full Name *`}
                        value={m.name}
                        onChange={(e) => updateMember(idx, 'name', e.target.value)}
                        required
                      />
                      <input
                        type="email"
                        className="pitch-input"
                        placeholder={`Member ${idx + 1} Email *`}
                        value={m.email}
                        onChange={(e) => updateMember(idx, 'email', e.target.value)}
                        required
                      />
                      <input
                        type="tel"
                        className="pitch-input"
                        placeholder={`Member ${idx + 1} Phone *`}
                        value={m.phone}
                        onChange={(e) => updateMember(idx, 'phone', e.target.value)}
                        required
                      />
                      <input
                        type="text"
                        className="pitch-input"
                        placeholder="Role (e.g. Embedded Developer)"
                        value={m.roleInTeam}
                        onChange={(e) => updateMember(idx, 'roleInTeam', e.target.value)}
                      />
                    </div>
                  </div>
                ))}

                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '20px' }}>
                  {members.length < 2 && (
                    <button type="button" className="btn btn-secondary btn-sm" onClick={addMemberRow}>
                      + Add Teammate (Optional)
                    </button>
                  )}
                  {members.length === 0 && (
                    <span style={{ fontSize: '12.5px', color: 'var(--muted)' }}>
                      No additional members added (Proceeding as a 1-person team)
                    </span>
                  )}
                </div>

                <button type="submit" className="btn btn-primary pitch-submit-btn">
                  Create Team & Unlock Round 1 Pitching <ArrowRight size={16} />
                </button>
              </form>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: ROUND 1 PITCH FORM */}
      {activeTab === 'r1' && (
        <div className="light-card participant-card">
          <div className="pitch-form-header">
            <div>
              <div className="pitch-badge-row">
                <span className="round-badge">STAGE 01</span>
                <span className="round-subbadge">Max 400 Total Words</span>
              </div>
              <h2 className="pitch-form-title">
                💡 Round 1: Idea Pitch Proposal
              </h2>
              <p className="pitch-form-subtitle">
                Select your focus theme, articulate the root problem statement (max 150 words), and detail your proposed intervention (max 250 words).
              </p>
            </div>
            <span className={`badge ${team?.round1Status || (r1Submission ? r1Submission.status : 'NOT_SUBMITTED')}`}>
              {team?.round1Status === 'SELECTED' ? '🔒 SELECTED (LOCKED)' : (r1Submission ? r1Submission.status : 'NOT SUBMITTED')}
            </span>
          </div>

          {team?.round1Status === 'SELECTED' && (
            <div className="selected-locked-banner">
              <div>
                <strong>🔒 Round 1 Proposal Locked & Verified</strong>
                <p>
                  Congratulations! Your team has been <strong>SELECTED</strong> for Round 2. Your Round 1 Problem Statement and Solution are locked.
                </p>
              </div>
              <button
                type="button"
                className="btn btn-sm btn-primary"
                onClick={() => setActiveTab('r2')}
              >
                Go to Round 2 →
              </button>
            </div>
          )}

          <form onSubmit={handleR1Submit} className="pitch-form">
            {/* 1. THEME SELECTION BEFORE PROBLEM STATEMENT */}
            <div className="form-group pitch-form-group">
              <label className="pitch-label">
                1. Challenge Theme * {team?.round1Status === 'SELECTED' && '(Locked)'}
              </label>
              <select
                value={r1ThemeId}
                onChange={(e) => setR1ThemeId(e.target.value)}
                disabled={team?.round1Status === 'SELECTED'}
                className="pitch-input select-styled"
                style={team?.round1Status === 'SELECTED' ? { background: '#f1f5f9', cursor: 'not-allowed', color: '#475569' } : {}}
                required
              >
                <option value="">Select Domain Theme...</option>
                {themes.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 2. PROBLEM STATEMENT (MAX 150 WORDS) */}
            <div className="form-group pitch-form-group">
              <div className="pitch-label-row">
                <label className="pitch-label">
                  2. Problem Statement * {team?.round1Status === 'SELECTED' && '(Locked)'}
                </label>
                <span
                  className={`word-counter-pill ${
                    countWords(r1Problem) > 150 ? 'exceeded' : countWords(r1Problem) > 130 ? 'warning' : ''
                  }`}
                >
                  {countWords(r1Problem)} / 150 words
                </span>
              </div>
              <p className="form-hint">Describe the core pain point, affected demographic, and current inefficiencies.</p>
              <textarea
                rows={5}
                value={r1Problem}
                onChange={(e) => setR1Problem(e.target.value)}
                placeholder="State the core problem (up to 150 words)..."
                disabled={team?.round1Status === 'SELECTED'}
                className="pitch-textarea"
                style={team?.round1Status === 'SELECTED' ? { background: '#f8fafc', cursor: 'not-allowed', color: '#334155' } : {}}
                required
              />
            </div>

            {/* 3. PROPOSED SOLUTION (MAX 250 WORDS) */}
            <div className="form-group pitch-form-group">
              <div className="pitch-label-row">
                <label className="pitch-label">
                  3. Proposed Technical Solution * {team?.round1Status === 'SELECTED' && '(Locked)'}
                </label>
                <span
                  className={`word-counter-pill ${
                    countWords(r1Solution) > 250 ? 'exceeded' : countWords(r1Solution) > 220 ? 'warning' : ''
                  }`}
                >
                  {countWords(r1Solution)} / 250 words
                </span>
              </div>
              <p className="form-hint">Explain the technical approach, AI/IoT/Hardware mechanism, and solution architecture.</p>
              <textarea
                rows={6}
                value={r1Solution}
                onChange={(e) => setR1Solution(e.target.value)}
                placeholder="Explain your technical solution (up to 250 words)..."
                disabled={team?.round1Status === 'SELECTED'}
                className="pitch-textarea"
                style={team?.round1Status === 'SELECTED' ? { background: '#f8fafc', cursor: 'not-allowed', color: '#334155' } : {}}
                required
              />
            </div>

            {team?.round1Status === 'SELECTED' ? (
              <button
                type="button"
                className="btn btn-primary pitch-submit-btn"
                onClick={() => setActiveTab('r2')}
              >
                🚀 Proceed to Round 2: Idea Elaboration →
              </button>
            ) : (
              <button type="submit" className="btn btn-primary pitch-submit-btn">
                {r1Submission ? '💾 Update Round 1 Pitch in Database' : '🚀 Submit Round 1 Proposal to Database'}
              </button>
            )}
          </form>
        </div>
      )}

      {/* TAB 3: ROUND 2 ELABORATION FORM (STRICT LOCK & 4 QUESTIONS) */}
      {activeTab === 'r2' && (
        <div>
          {team?.round1Status !== 'SELECTED' ? (
            <div className="light-card text-center" style={{ padding: '60px 24px', border: '2px dashed #cbd5e1' }}>
              <div style={{ fontSize: '48px', marginBottom: '14px' }}>🔒</div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', fontWeight: 800, marginBottom: '8px', color: 'var(--ink)' }}>
                Round 2 is Currently Locked
              </h3>
              <p style={{ color: 'var(--muted)', maxWidth: '520px', margin: '0 auto 16px auto', fontSize: '14px', lineHeight: 1.6 }}>
                Round 2 is strictly unlocked after your Round 1 proposal is evaluated and marked as <strong>SELECTED</strong> by the judging panel.
              </p>
              <div style={{ background: '#ecfdf5', color: '#065f46', padding: '8px 18px', borderRadius: '20px', display: 'inline-block', fontSize: '12.5px', fontWeight: 600 }}>
                💡 Note: Round 2 will be automatically unlocked once your Round 1 proposal is evaluated and approved.
              </div>
            </div>
          ) : (
            <div className="light-card participant-card">
              <div className="pitch-form-header">
                <div>
                  <div className="pitch-badge-row">
                    <span className="round-badge round-badge-blue">STAGE 02</span>
                    <span className="round-subbadge">Deep-Dive Dossier</span>
                  </div>
                  <h2 className="pitch-form-title">
                    🚀 Round 2: Elaborating Your Idea
                  </h2>
                  <p className="pitch-form-subtitle">
                    Deep-dive on the idea you entered in the first round across the 4 core dimensions.
                  </p>
                </div>
                <span className="badge SELECTED">UNLOCKED</span>
              </div>

              <form onSubmit={handleR2Submit} className="pitch-form">
                {/* 1. DETAILED CONCEPT (MAX 1000 WORDS) */}
                <div className="form-group pitch-form-group">
                  <div className="pitch-label-row">
                    <label className="pitch-label">1. Detailed Concept * (Max 1000 words)</label>
                    <span
                      className={`word-counter-pill ${
                        countWords(r2Data.detailedConcept) > 1000 ? 'exceeded' : countWords(r2Data.detailedConcept) > 850 ? 'warning' : ''
                      }`}
                    >
                      {countWords(r2Data.detailedConcept)} / 1000 words
                    </span>
                  </div>
                  <p className="form-hint">Comprehensive architectural breakdown, algorithmic components, system diagrams, and data flows.</p>
                  <textarea
                    rows={8}
                    className="pitch-textarea"
                    value={r2Data.detailedConcept}
                    onChange={(e) => setR2Data({ ...r2Data, detailedConcept: e.target.value })}
                    placeholder="Elaborate your full technical concept and design in depth (up to 1000 words)..."
                    required
                  />
                </div>

                {/* 2. VALUE PROPOSITION AND CIRCULARITY (MAX 150 WORDS) */}
                <div className="form-group pitch-form-group">
                  <div className="pitch-label-row">
                    <label className="pitch-label">2. Value Proposition and Circularity * (Max 150 words)</label>
                    <span
                      className={`word-counter-pill ${
                        countWords(r2Data.valuePropositionAndCircularity) > 150 ? 'exceeded' : countWords(r2Data.valuePropositionAndCircularity) > 130 ? 'warning' : ''
                      }`}
                    >
                      {countWords(r2Data.valuePropositionAndCircularity)} / 150 words
                    </span>
                  </div>
                  <p className="form-hint">Core value, circular economy impact, resource efficiency, and competitive differentiation.</p>
                  <textarea
                    rows={4}
                    className="pitch-textarea"
                    value={r2Data.valuePropositionAndCircularity}
                    onChange={(e) => setR2Data({ ...r2Data, valuePropositionAndCircularity: e.target.value })}
                    placeholder="Explain value proposition and circularity benefits (up to 150 words)..."
                    required
                  />
                </div>

                {/* 3. 90 DAYS FEASIBILITY PLAN (MAX 200 WORDS) */}
                <div className="form-group pitch-form-group">
                  <div className="pitch-label-row">
                    <label className="pitch-label">3. 90 Days Feasibility Plan * (Max 200 words)</label>
                    <span
                      className={`word-counter-pill ${
                        countWords(r2Data.feasibilityPlan90Days) > 200 ? 'exceeded' : countWords(r2Data.feasibilityPlan90Days) > 175 ? 'warning' : ''
                      }`}
                    >
                      {countWords(r2Data.feasibilityPlan90Days)} / 200 words
                    </span>
                  </div>
                  <p className="form-hint">Month 1, Month 2, and Month 3 deliverables, prototype testing, pilot deployment roadmap.</p>
                  <textarea
                    rows={4}
                    className="pitch-textarea"
                    value={r2Data.feasibilityPlan90Days}
                    onChange={(e) => setR2Data({ ...r2Data, feasibilityPlan90Days: e.target.value })}
                    placeholder="Outline your 90-day implementation roadmap (up to 200 words)..."
                    required
                  />
                </div>

                {/* 4. RESOURCE REQUIREMENT (MAX 100 WORDS) */}
                <div className="form-group pitch-form-group">
                  <div className="pitch-label-row">
                    <label className="pitch-label">4. Resource Requirement * (Max 100 words)</label>
                    <span
                      className={`word-counter-pill ${
                        countWords(r2Data.resourceRequirements) > 100 ? 'exceeded' : countWords(r2Data.resourceRequirements) > 85 ? 'warning' : ''
                      }`}
                    >
                      {countWords(r2Data.resourceRequirements)} / 100 words
                    </span>
                  </div>
                  <p className="form-hint">Bill of materials, cloud computing, laboratory equipment, domain expertise, and budget breakdown.</p>
                  <textarea
                    rows={3}
                    className="pitch-textarea"
                    value={r2Data.resourceRequirements}
                    onChange={(e) => setR2Data({ ...r2Data, resourceRequirements: e.target.value })}
                    placeholder="List needed resources, hardware, and estimated costs (up to 100 words)..."
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary pitch-submit-btn">
                  {r2Submission ? '💾 Update Round 2 Dossier in Database' : '🚀 Submit Full Round 2 Dossier to Database'}
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
