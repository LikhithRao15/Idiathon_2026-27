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
    problemUnderstanding: 0,
    innovation: 0,
    proposedSolution: 0,
    feasibility: 0,
    expectedImpact: 0,
  });

  const [r2Scores, setR2Scores] = useState({
    conceptClarity: 0,
    innovation: 0,
    valueProposition: 0,
    technicalFeasibility: 0,
    feasibilityPlan90Days: 0,
    resourcePlanning: 0,
    expectedImpact: 0,
    scalability: 0,
  });

  const [comments, setComments] = useState('');
  const [isEvaluated, setIsEvaluated] = useState(false);

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

  const loadTeamEvaluation = (team) => {
    const evaluation =
      selectedRound === 1
        ? team?.myEvaluations?.round1
        : team?.myEvaluations?.round2;

    const getScore = (scores, key) => {
      if (!scores) return 0;
      if (typeof scores.get === 'function') return scores.get(key) ?? 0;
      return scores[key] ?? 0;
    };

    if (evaluation) {
      setIsEvaluated(true);
      if (selectedRound === 1) {
        setR1Scores({
          problemUnderstanding: getScore(evaluation.scores, 'problemUnderstanding'),
          innovation: getScore(evaluation.scores, 'innovation'),
          proposedSolution: getScore(evaluation.scores, 'proposedSolution'),
          feasibility: getScore(evaluation.scores, 'feasibility'),
          expectedImpact: getScore(evaluation.scores, 'expectedImpact'),
        });
      } else {
        setR2Scores({
          conceptClarity: getScore(evaluation.scores, 'conceptClarity'),
          innovation: getScore(evaluation.scores, 'innovation'),
          valueProposition: getScore(evaluation.scores, 'valueProposition'),
          technicalFeasibility: getScore(evaluation.scores, 'technicalFeasibility'),
          feasibilityPlan90Days: getScore(evaluation.scores, 'feasibilityPlan90Days'),
          resourcePlanning: getScore(evaluation.scores, 'resourcePlanning'),
          expectedImpact: getScore(evaluation.scores, 'expectedImpact'),
          scalability: getScore(evaluation.scores, 'scalability'),
        });
      }

      setComments(evaluation.comments || '');
    } else {
      setIsEvaluated(false);
      // No evaluation for this team yet: reset to 0
      if (selectedRound === 1) {
        setR1Scores({
          problemUnderstanding: 0,
          innovation: 0,
          proposedSolution: 0,
          feasibility: 0,
          expectedImpact: 0,
        });
      } else {
        setR2Scores({
          conceptClarity: 0,
          innovation: 0,
          valueProposition: 0,
          technicalFeasibility: 0,
          feasibilityPlan90Days: 0,
          resourcePlanning: 0,
          expectedImpact: 0,
          scalability: 0,
        });
      }

      setComments('');
    }
  };

  const loadAssignedTeams = async () => {
    setLoading(true);
    const res = await apiRequest('/panelists/assigned-teams');
    const teams = Array.isArray(res.data) ? res.data : [];

    if (res.ok && Array.isArray(teams)) {
      setAssignedTeams(teams);

      if (teams.length > 0) {
        const firstTeam = teams[0];

        setSelectedTeam({
          id: firstTeam._id,
          name: firstTeam.teamName,
        });

        loadTeamEvaluation(firstTeam);

        const detailsRes = await apiRequest(`/panelists/assigned-teams/${firstTeam._id}`);
        if (detailsRes.ok && detailsRes.data) {
          setSubmissionDetails(detailsRes.data);
          if (Array.isArray(detailsRes.data.evaluations)) {
            const ev = detailsRes.data.evaluations.find((e) => e.round === selectedRound);
            if (ev) {
              loadTeamEvaluation({ myEvaluations: { [selectedRound === 1 ? 'round1' : 'round2']: ev } });
            }
          }
        }
      } else {
        setSelectedTeam(null);
        setSubmissionDetails(null);
        loadTeamEvaluation(null);
      }
    }
    setLoading(false);
  };

  const selectTeam = async (teamId, teamName) => {
    setSelectedTeam({ id: teamId, name: teamName });

    // Find the selected team from the assigned teams list
    const team = assignedTeams.find((t) => t._id === teamId);

    // Load this team's existing evaluation or reset the form
    loadTeamEvaluation(team);

    // Load submission details
    const res = await apiRequest(`/panelists/assigned-teams/${teamId}`);

    if (res.ok && res.data) {
      setSubmissionDetails(res.data);
      if (Array.isArray(res.data.evaluations)) {
        const ev = res.data.evaluations.find((e) => e.round === selectedRound);
        if (ev) {
          loadTeamEvaluation({ myEvaluations: { [selectedRound === 1 ? 'round1' : 'round2']: ev } });
        }
      }
    } else {
      setSubmissionDetails(null);
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
            Welcome, <strong>{user?.name}</strong>. Inspect submissions, enter weighted rubric scores, and submit your evaluation.
          </p>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={loadAssignedTeams}>
          🔄 Refresh Teams
        </button>
      </div>

      {/* ROUND SELECTOR BAR */}
      <div
        className="panelist-round-selector"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#ffffff',
          padding: '12px 20px',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-color)',
          marginBottom: '24px',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
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
          <div
            className="panelist-submission-header"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '14px',
              borderBottom: '1px solid var(--border-color)',
              paddingBottom: '8px',
            }}
          >
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
                🎯 Rubric Evaluation: {selectedTeam?.name || 'Select a Team'}
              </h3>
              {submissionDetails?.team?.theme && (
                <div style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 600, marginTop: '2px' }}>
                  Theme: {submissionDetails.team.theme.name}
                </div>
              )}
            </div>
            <span className={`badge ${isEvaluated ? 'SUCCESS' : 'SELECTED'}`}>
              {isEvaluated ? '🔒 Score Locked' : 'Active Rubric'}
            </span>
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
          {isEvaluated && (
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 'var(--radius-md)', padding: '12px 16px', color: '#166534', fontSize: '13px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🔒</span>
              <span>This evaluation has been submitted to MongoDB and is locked against further edits.</span>
            </div>
          )}

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
                      disabled={isEvaluated}
                      className="rubric-number-input"
                      value={r1Scores.problemUnderstanding}
                      onFocus={(e) => e.target.select()}
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
                      disabled={isEvaluated}
                      className="rubric-number-input"
                      value={r1Scores.innovation}
                      onFocus={(e) => e.target.select()}
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
                      disabled={isEvaluated}
                      className="rubric-number-input"
                      value={r1Scores.proposedSolution}
                      onFocus={(e) => e.target.select()}
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
                      disabled={isEvaluated}
                      className="rubric-number-input"
                      value={r1Scores.feasibility}
                      onFocus={(e) => e.target.select()}
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
                      disabled={isEvaluated}
                      className="rubric-number-input"
                      value={r1Scores.expectedImpact}
                      onFocus={(e) => e.target.select()}
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
                      disabled={isEvaluated}
                      className="rubric-number-input"
                      value={r2Scores.conceptClarity}
                      onFocus={(e) => e.target.select()}
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
                      disabled={isEvaluated}
                      className="rubric-number-input"
                      value={r2Scores.innovation}
                      onFocus={(e) => e.target.select()}
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
                      disabled={isEvaluated}
                      className="rubric-number-input"
                      value={r2Scores.valueProposition}
                      onFocus={(e) => e.target.select()}
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
                      disabled={isEvaluated}
                      className="rubric-number-input"
                      value={r2Scores.technicalFeasibility}
                      onFocus={(e) => e.target.select()}
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
                      disabled={isEvaluated}
                      className="rubric-number-input"
                      value={r2Scores.feasibilityPlan90Days}
                      onFocus={(e) => e.target.select()}
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
                      disabled={isEvaluated}
                      className="rubric-number-input"
                      value={r2Scores.resourcePlanning}
                      onFocus={(e) => e.target.select()}
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
                      disabled={isEvaluated}
                      className="rubric-number-input"
                      value={r2Scores.expectedImpact}
                      onFocus={(e) => e.target.select()}
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
                      disabled={isEvaluated}
                      className="rubric-number-input"
                      value={r2Scores.scalability}
                      onFocus={(e) => e.target.select()}
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
                disabled={isEvaluated}
                style={isEvaluated ? { background: '#f8fafc', cursor: 'not-allowed', color: '#475569' } : {}}
                required
              />
            </div>

            <div className="mt-4">
              {isEvaluated ? (
                <button
                  type="button"
                  className="btn btn-secondary w-full"
                  disabled
                  style={{
                    background: '#e2e8f0',
                    color: '#64748b',
                    cursor: 'not-allowed',
                    border: '1px solid #cbd5e1',
                    fontWeight: 700,
                  }}
                >
                  🔒 Score Submitted (Locked)
                </button>
              ) : (
                <button type="submit" className="btn btn-secondary w-full">
                  💾 Save Score Record
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
