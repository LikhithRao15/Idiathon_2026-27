'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiRequest } from '../../lib/api';
import { useRouter } from 'next/navigation';

export default function PanelistPage() {
  const { user, token, login, showToast } = useAuth();
  const router = useRouter();

  const [selectedRound, setSelectedRound] = useState(1); // 1 or 2
  const [assignedTeams, setAssignedTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [submissionDetails, setSubmissionDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  // Judge Auth Form (for direct URL access)
  const [judgeEmail, setJudgeEmail] = useState('');
  const [judgePassword, setJudgePassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Rubric Scoring State
  const [r1Scores, setR1Scores] = useState({
    problemUnderstanding: 8,
    innovation: 9,
    proposedSolution: 8,
    feasibility: 8,
    expectedImpact: 9,
  });

  const [r2Scores, setR2Scores] = useState({
    conceptClarity: 8,
    innovation: 9,
    valueProposition: 8,
    technicalFeasibility: 8,
    feasibilityPlan90Days: 8,
    resourcePlanning: 8,
    expectedImpact: 9,
    scalability: 8,
  });

  const [comments, setComments] = useState('');

  useEffect(() => {
    if (token && user?.role === 'panelist') {
      loadAssignedTeams();
    }
  }, [token, user, selectedRound]);

  const handleJudgeLogin = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    const res = await login(judgeEmail, judgePassword);
    setAuthLoading(false);
  };

  const loadAssignedTeams = async () => {
    setLoading(true);
    const res = await apiRequest('/panelists/assigned-teams');
    const teams = Array.isArray(res.data) ? res.data : [];

    if (res.ok && Array.isArray(teams)) {
      setAssignedTeams(teams);
      if (teams.length > 0) {
        selectTeam(teams[0]._id, teams[0].teamName);
      } else {
        setSelectedTeam(null);
        setSubmissionDetails(null);
      }
    }
    setLoading(false);
  };

  const selectTeam = async (teamId, teamName) => {
    setSelectedTeam({ id: teamId, name: teamName });
    const res = await apiRequest(`/panelists/assigned-teams/${teamId}`);
    if (res.ok && res.data) {
      setSubmissionDetails(res.data);
    }
  };

  const currentScores = selectedRound === 1 ? r1Scores : r2Scores;
  const totalScore = Object.values(currentScores).reduce((a, b) => Number(a) + Number(b), 0);
  const maxScore = selectedRound === 1 ? 50 : 80;

  const handleScoreSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTeam) {
      showToast('Please select a team to evaluate first', true);
      return;
    }

    const endpoint = selectedRound === 1 ? '/evaluations/round1' : '/evaluations/round2';
    const payload = {
      teamId: selectedTeam.id,
      scores: selectedRound === 1 ? r1Scores : r2Scores,
      comments,
    };

    const res = await apiRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      showToast(`Evaluation for Round ${selectedRound} recorded successfully!`);
      loadAssignedTeams();
    } else {
      showToast(res.message || 'Evaluation submission failed', true);
    }
  };

  const handleAdvanceToNextRound = async () => {
    if (!selectedTeam) {
      showToast('Select a team to advance!', true);
      return;
    }

    if (selectedRound === 1) {
      const res = await apiRequest(`/panelists/teams/${selectedTeam.id}/select-round1`, {
        method: 'PUT',
      });
      if (res.ok) {
        showToast(`🎉 Team "${selectedTeam.name}" has been SELECTED for Round 2 in MongoDB! Round 2 is now open for this team.`);
        loadAssignedTeams();
      } else {
        showToast(res.message || 'Failed to select team', true);
      }
    } else {
      const res = await apiRequest(`/admin/teams/${selectedTeam.id}/round2/select`, {
        method: 'PUT',
      });
      if (res.ok) {
        showToast(`🏆 Team "${selectedTeam.name}" promoted to Grand Finalist in MongoDB!`);
        loadAssignedTeams();
      } else {
        showToast(res.message || 'Failed to promote team', true);
      }
    }
  };

  // If not logged in as panelist, show dedicated Judge Login screen
  if (!token || user?.role !== 'panelist') {
    return (
      <div style={{ maxWidth: '440px', margin: '70px auto', padding: '0 20px' }}>
        <div className="light-card" style={{ padding: '36px 32px' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ fontSize: '38px', marginBottom: '8px' }}>⚖️</div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', fontWeight: 800 }}>
              Jury & Panelist Portal
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '4px' }}>
              Direct access for appointed evaluation jury members
            </p>
          </div>

          <div style={{ background: '#f5f3ff', border: '1px solid #ddd6fe', color: '#6d28d9', padding: '10px 14px', borderRadius: 'var(--radius-sm)', fontSize: '12px', marginBottom: '20px', lineHeight: 1.4 }}>
            🔒 <strong>Private Access:</strong> Panelist credentials are generated and issued by the Ideathon Administrator.
          </div>

          <form onSubmit={handleJudgeLogin}>
            <div className="form-group">
              <label>Judge Email Address *</label>
              <input
                type="email"
                placeholder="e.g. panelist@ideathon.org"
                value={judgeEmail}
                onChange={(e) => setJudgeEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Password *</label>
              <input
                type="password"
                placeholder="••••••••"
                value={judgePassword}
                onChange={(e) => setJudgePassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary w-full mt-2" disabled={authLoading}>
              {authLoading ? 'Verifying Credentials...' : 'Sign In to Jury Workspace →'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="portal-container">
      {/* HEADER */}
      <div className="portal-header">
        <div>
          <h1 className="portal-title">⚖️ Jury & Panelist Evaluation Portal</h1>
          <p className="portal-subtitle">
            Welcome, <strong>{user?.name}</strong>. Inspect submissions, enter weighted rubric scores, and select teams for the next round.
          </p>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={loadAssignedTeams}>
          🔄 Refresh Teams
        </button>
      </div>

      {/* ROUND SELECTOR BAR */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#ffffff', padding: '12px 20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', marginBottom: '24px', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-main)' }}>Select Evaluation Stage:</span>
          <button
            className={`btn btn-sm ${selectedRound === 1 ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setSelectedRound(1)}
          >
            💡 Round 1: Idea Pitching
          </button>
          <button
            className={`btn btn-sm ${selectedRound === 2 ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setSelectedRound(2)}
          >
            🚀 Round 2: Prototype & Roadmap
          </button>
        </div>
        <span className="badge warning">Round {selectedRound} Active</span>
      </div>

      {/* WORKSPACE GRID */}
      <div className="grid-2">
        {/* LEFT COLUMN: ASSIGNED TEAMS LIST */}
        <div className="light-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: 800, margin: 0 }}>
              📋 Submissions for Round {selectedRound} ({assignedTeams.length})
            </h3>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Live Ideathon Pool
            </span>
          </div>

          {assignedTeams.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px 10px', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>📭</div>
              <p style={{ fontSize: '14px', fontWeight: 600 }}>No idea submissions found yet.</p>
              <p style={{ fontSize: '12px' }}>When participants submit their pitches, they will automatically appear here for jury evaluation.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '580px', overflowY: 'auto', paddingRight: '4px' }}>
              {assignedTeams.map((t) => {
                const isSelected = selectedTeam?.id === t._id;
                const status = selectedRound === 1 ? (t.round1Status || 'DRAFT') : (t.round2Status || 'NOT_ELIGIBLE');
                const hasEvaluated = selectedRound === 1 ? !!t.myEvaluations?.round1 : !!t.myEvaluations?.round2;

                return (
                  <div
                    key={t._id}
                    onClick={() => selectTeam(t._id, t.teamName)}
                    style={{
                      padding: '14px',
                      borderRadius: 'var(--radius-md)',
                      border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                      background: isSelected ? 'var(--primary-subtle)' : '#ffffff',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <strong style={{ fontSize: '15px', color: 'var(--text-main)' }}>{t.teamName}</strong>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        {hasEvaluated && (
                          <span style={{ fontSize: '11px', background: '#e0f2fe', color: '#0369a1', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                            ✓ Scored
                          </span>
                        )}
                        <span className={`badge ${status}`}>{status}</span>
                      </div>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                      <span>Leader: <strong>{t.leader?.name || 'Participant'}</strong></span>
                      <span>Theme: <strong>{t.theme?.name || 'General'}</strong></span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: EVALUATION & SUBMISSION INSPECTOR */}
        <div className="light-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
            <div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: 800, margin: 0 }}>
                🎯 Rubric & Decision: {selectedTeam?.name || 'Select a Team'}
              </h3>
              {submissionDetails?.team?.theme && (
                <div style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 600, marginTop: '2px' }}>
                  Theme: {submissionDetails.team.theme.name}
                </div>
              )}
            </div>
            <span className="badge SELECTED">Active Rubric</span>
          </div>

          {/* SUBMISSION DETAILS INSPECTOR */}
          {submissionDetails ? (
            <div style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '16px', marginBottom: '18px', maxHeight: '240px', overflowY: 'auto' }}>
              {selectedRound === 1 ? (
                <div>
                  <h4 style={{ fontSize: '12px', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', marginBottom: '4px' }}>
                    1. Problem Statement (Max 150 words):
                  </h4>
                  <p style={{ fontSize: '13px', color: 'var(--text-main)', marginBottom: '12px', whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>
                    {submissionDetails.round1Submission?.problemStatement || 'No statement submitted yet.'}
                  </p>
                  <h4 style={{ fontSize: '12px', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', marginBottom: '4px' }}>
                    2. Proposed Technical Solution (Max 250 words):
                  </h4>
                  <p style={{ fontSize: '13px', color: 'var(--text-main)', whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>
                    {submissionDetails.round1Submission?.proposedSolution || 'No solution submitted yet.'}
                  </p>
                </div>
              ) : (
                <div>
                  <h4 style={{ fontSize: '12px', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', marginBottom: '4px' }}>
                    1. Detailed Concept (Max 1000 words):
                  </h4>
                  <p style={{ fontSize: '13px', color: 'var(--text-main)', marginBottom: '10px', whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>
                    {submissionDetails.round2Submission?.detailedConcept || 'No concept submitted yet.'}
                  </p>
                  <h4 style={{ fontSize: '12px', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', marginBottom: '4px' }}>
                    2. Value Proposition & Circularity (Max 150 words):
                  </h4>
                  <p style={{ fontSize: '13px', color: 'var(--text-main)', marginBottom: '10px', whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>
                    {submissionDetails.round2Submission?.valuePropositionAndCircularity || submissionDetails.round2Submission?.valueProposition || 'No value proposition submitted yet.'}
                  </p>
                  <h4 style={{ fontSize: '12px', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', marginBottom: '4px' }}>
                    3. 90-Day Feasibility Plan (Max 200 words):
                  </h4>
                  <p style={{ fontSize: '13px', color: 'var(--text-main)', marginBottom: '10px', whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>
                    {submissionDetails.round2Submission?.feasibilityPlan90Days || 'No feasibility plan submitted yet.'}
                  </p>
                  <h4 style={{ fontSize: '12px', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', marginBottom: '4px' }}>
                    4. Resource Requirements (Max 100 words):
                  </h4>
                  <p style={{ fontSize: '13px', color: 'var(--text-main)', whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>
                    {submissionDetails.round2Submission?.resourceRequirements || 'No resource requirements submitted yet.'}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '16px' }}>
              Select a team from the list on the left to inspect their pitch.
            </p>
          )}

          {/* RUBRIC FORM */}
          <form onSubmit={handleScoreSubmit}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)' }}>
                ✍️ Enter Criterion Marks (0 to 10 each):
              </span>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Scale: 0 (Poor) – 10 (Outstanding)
              </span>
            </div>

            {selectedRound === 1 ? (
              <div>
                <div className="rubric-entry-card">
                  <div className="rubric-info">
                    <div className="rubric-title">1. Problem Understanding</div>
                    <div className="rubric-hint">Depth of problem analysis, root causes & local context</div>
                  </div>
                  <div className="rubric-input-wrap">
                    <input
                      type="number"
                      min="0"
                      max="10"
                      step="0.5"
                      className="rubric-number-input"
                      value={r1Scores.problemUnderstanding}
                      onChange={(e) => {
                        const val = Math.min(10, Math.max(0, parseFloat(e.target.value) || 0));
                        setR1Scores({ ...r1Scores, problemUnderstanding: val });
                      }}
                      required
                    />
                    <span className="rubric-max-badge">/ 10</span>
                  </div>
                </div>

                <div className="rubric-entry-card">
                  <div className="rubric-info">
                    <div className="rubric-title">2. Innovation & Novelty</div>
                    <div className="rubric-hint">Originality of approach, unique value & differentiation</div>
                  </div>
                  <div className="rubric-input-wrap">
                    <input
                      type="number"
                      min="0"
                      max="10"
                      step="0.5"
                      className="rubric-number-input"
                      value={r1Scores.innovation}
                      onChange={(e) => {
                        const val = Math.min(10, Math.max(0, parseFloat(e.target.value) || 0));
                        setR1Scores({ ...r1Scores, innovation: val });
                      }}
                      required
                    />
                    <span className="rubric-max-badge">/ 10</span>
                  </div>
                </div>

                <div className="rubric-entry-card">
                  <div className="rubric-info">
                    <div className="rubric-title">3. Proposed Solution Quality</div>
                    <div className="rubric-hint">Soundness of technical mechanism & logic</div>
                  </div>
                  <div className="rubric-input-wrap">
                    <input
                      type="number"
                      min="0"
                      max="10"
                      step="0.5"
                      className="rubric-number-input"
                      value={r1Scores.proposedSolution}
                      onChange={(e) => {
                        const val = Math.min(10, Math.max(0, parseFloat(e.target.value) || 0));
                        setR1Scores({ ...r1Scores, proposedSolution: val });
                      }}
                      required
                    />
                    <span className="rubric-max-badge">/ 10</span>
                  </div>
                </div>

                <div className="rubric-entry-card">
                  <div className="rubric-info">
                    <div className="rubric-title">4. Feasibility & Architecture</div>
                    <div className="rubric-hint">Practical viability, tech stack readiness & execution ease</div>
                  </div>
                  <div className="rubric-input-wrap">
                    <input
                      type="number"
                      min="0"
                      max="10"
                      step="0.5"
                      className="rubric-number-input"
                      value={r1Scores.feasibility}
                      onChange={(e) => {
                        const val = Math.min(10, Math.max(0, parseFloat(e.target.value) || 0));
                        setR1Scores({ ...r1Scores, feasibility: val });
                      }}
                      required
                    />
                    <span className="rubric-max-badge">/ 10</span>
                  </div>
                </div>

                <div className="rubric-entry-card">
                  <div className="rubric-info">
                    <div className="rubric-title">5. Expected Environmental Impact</div>
                    <div className="rubric-hint">Measurable sustainability, circularity & community benefit</div>
                  </div>
                  <div className="rubric-input-wrap">
                    <input
                      type="number"
                      min="0"
                      max="10"
                      step="0.5"
                      className="rubric-number-input"
                      value={r1Scores.expectedImpact}
                      onChange={(e) => {
                        const val = Math.min(10, Math.max(0, parseFloat(e.target.value) || 0));
                        setR1Scores({ ...r1Scores, expectedImpact: val });
                      }}
                      required
                    />
                    <span className="rubric-max-badge">/ 10</span>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="rubric-entry-card">
                  <div className="rubric-info">
                    <div className="rubric-title">1. Concept Clarity</div>
                    <div className="rubric-hint">Completeness of 1000-word concept elaboration & technical depth</div>
                  </div>
                  <div className="rubric-input-wrap">
                    <input
                      type="number"
                      min="0"
                      max="10"
                      step="0.5"
                      className="rubric-number-input"
                      value={r2Scores.conceptClarity}
                      onChange={(e) => {
                        const val = Math.min(10, Math.max(0, parseFloat(e.target.value) || 0));
                        setR2Scores({ ...r2Scores, conceptClarity: val });
                      }}
                      required
                    />
                    <span className="rubric-max-badge">/ 10</span>
                  </div>
                </div>

                <div className="rubric-entry-card">
                  <div className="rubric-info">
                    <div className="rubric-title">2. Innovation & Depth</div>
                    <div className="rubric-hint">Degree of novel engineering, tech breakthroughs or process invention</div>
                  </div>
                  <div className="rubric-input-wrap">
                    <input
                      type="number"
                      min="0"
                      max="10"
                      step="0.5"
                      className="rubric-number-input"
                      value={r2Scores.innovation}
                      onChange={(e) => {
                        const val = Math.min(10, Math.max(0, parseFloat(e.target.value) || 0));
                        setR2Scores({ ...r2Scores, innovation: val });
                      }}
                      required
                    />
                    <span className="rubric-max-badge">/ 10</span>
                  </div>
                </div>

                <div className="rubric-entry-card">
                  <div className="rubric-info">
                    <div className="rubric-title">3. Value Proposition & Circularity</div>
                    <div className="rubric-hint">Circular economic loop, lifecycle analysis & customer value</div>
                  </div>
                  <div className="rubric-input-wrap">
                    <input
                      type="number"
                      min="0"
                      max="10"
                      step="0.5"
                      className="rubric-number-input"
                      value={r2Scores.valueProposition}
                      onChange={(e) => {
                        const val = Math.min(10, Math.max(0, parseFloat(e.target.value) || 0));
                        setR2Scores({ ...r2Scores, valueProposition: val });
                      }}
                      required
                    />
                    <span className="rubric-max-badge">/ 10</span>
                  </div>
                </div>

                <div className="rubric-entry-card">
                  <div className="rubric-info">
                    <div className="rubric-title">4. Technical Feasibility</div>
                    <div className="rubric-hint">Readiness of implementation, components & architectural soundness</div>
                  </div>
                  <div className="rubric-input-wrap">
                    <input
                      type="number"
                      min="0"
                      max="10"
                      step="0.5"
                      className="rubric-number-input"
                      value={r2Scores.technicalFeasibility}
                      onChange={(e) => {
                        const val = Math.min(10, Math.max(0, parseFloat(e.target.value) || 0));
                        setR2Scores({ ...r2Scores, technicalFeasibility: val });
                      }}
                      required
                    />
                    <span className="rubric-max-badge">/ 10</span>
                  </div>
                </div>

                <div className="rubric-entry-card">
                  <div className="rubric-info">
                    <div className="rubric-title">5. 90-Day Feasibility Plan</div>
                    <div className="rubric-hint">Actionable milestones, sprint breakdown & delivery realism</div>
                  </div>
                  <div className="rubric-input-wrap">
                    <input
                      type="number"
                      min="0"
                      max="10"
                      step="0.5"
                      className="rubric-number-input"
                      value={r2Scores.feasibilityPlan90Days}
                      onChange={(e) => {
                        const val = Math.min(10, Math.max(0, parseFloat(e.target.value) || 0));
                        setR2Scores({ ...r2Scores, feasibilityPlan90Days: val });
                      }}
                      required
                    />
                    <span className="rubric-max-badge">/ 10</span>
                  </div>
                </div>

                <div className="rubric-entry-card">
                  <div className="rubric-info">
                    <div className="rubric-title">6. Resource Planning</div>
                    <div className="rubric-hint">Clear budget estimation, BOM, lab requirements & tooling</div>
                  </div>
                  <div className="rubric-input-wrap">
                    <input
                      type="number"
                      min="0"
                      max="10"
                      step="0.5"
                      className="rubric-number-input"
                      value={r2Scores.resourcePlanning}
                      onChange={(e) => {
                        const val = Math.min(10, Math.max(0, parseFloat(e.target.value) || 0));
                        setR2Scores({ ...r2Scores, resourcePlanning: val });
                      }}
                      required
                    />
                    <span className="rubric-max-badge">/ 10</span>
                  </div>
                </div>

                <div className="rubric-entry-card">
                  <div className="rubric-info">
                    <div className="rubric-title">7. Expected Real-World Impact</div>
                    <div className="rubric-hint">Carbon reduction, resource recovery & quantifiable green impact</div>
                  </div>
                  <div className="rubric-input-wrap">
                    <input
                      type="number"
                      min="0"
                      max="10"
                      step="0.5"
                      className="rubric-number-input"
                      value={r2Scores.expectedImpact}
                      onChange={(e) => {
                        const val = Math.min(10, Math.max(0, parseFloat(e.target.value) || 0));
                        setR2Scores({ ...r2Scores, expectedImpact: val });
                      }}
                      required
                    />
                    <span className="rubric-max-badge">/ 10</span>
                  </div>
                </div>

                <div className="rubric-entry-card">
                  <div className="rubric-info">
                    <div className="rubric-title">8. Scalability & Market Fit</div>
                    <div className="rubric-hint">Commercialization potential, unit economics & market demand</div>
                  </div>
                  <div className="rubric-input-wrap">
                    <input
                      type="number"
                      min="0"
                      max="10"
                      step="0.5"
                      className="rubric-number-input"
                      value={r2Scores.scalability}
                      onChange={(e) => {
                        const val = Math.min(10, Math.max(0, parseFloat(e.target.value) || 0));
                        setR2Scores({ ...r2Scores, scalability: val });
                      }}
                      required
                    />
                    <span className="rubric-max-badge">/ 10</span>
                  </div>
                </div>
              </div>
            )}

            <div className="rubric-total">
              <span>Computed Rubric Total:</span>
              <strong>{totalScore} / {maxScore}</strong>
            </div>

            <div className="form-group mt-4">
              <label>Constructive Jury Feedback</label>
              <textarea
                rows={3}
                placeholder="Remarks, strengths, and areas for improvement..."
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                required
              />
            </div>

            <div className="grid-2 mt-4">
              <button type="submit" className="btn btn-secondary w-full">
                💾 Save Score Record
              </button>
              <button
                type="button"
                className="btn btn-primary w-full"
                onClick={handleAdvanceToNextRound}
              >
                {selectedRound === 1 ? '🚀 Select for Round 2' : '🏆 Select as Finalist'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
