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
} from 'lucide-react';

export default function AdminPage() {
  const { user, token, login, showToast } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState('teams'); // 'teams' | 'panelists' | 'finalists' | 'controls'
  const [stats, setStats] = useState({});
  const [teams, setTeams] = useState([]);
  const [panelists, setPanelists] = useState([]);
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(false);

  // Search & Filters for Teams
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTheme, setFilterTheme] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');

  // Selected Team for Inspection Modal
  const [inspectTeam, setInspectTeam] = useState(null);

  // Admin Auth Form (for direct unauthenticated access)
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
  const [schedDate, setSchedDate] = useState(new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString().split('T')[0]);
  const [schedInstructions, setSchedInstructions] = useState('Bring live hardware prototype and presentation slides on backup USB.');

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
    const s = res.data && res.data.totalTeams !== undefined ? res.data : (res.data?.stats || {});
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
    const data = Array.isArray(res.data) ? res.data : (res.data?.themes || []);
    if (res.ok && Array.isArray(data)) {
      setThemes(data);
    }
  };

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
    if (!confirm(`Are you sure you want to delete judge '${panelistName}'? This will remove their assignments.`)) {
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

  const handleSelectRound1 = async (teamId) => {
    const res = await apiRequest(`/admin/teams/${teamId}/round1/select`, {
      method: 'PUT',
    });
    if (res.ok) {
      showToast('🎉 Team selected for Round 2! Round 2 dossier is now unlocked for the team.');
      loadTeams();
      loadStats();
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
    } else {
      showToast(res.message || 'Rejection failed', true);
    }
  };

  const handleSelectRound2 = async (teamId) => {
    const res = await apiRequest(`/admin/teams/${teamId}/round2/select`, {
      method: 'PUT',
    });
    if (res.ok) {
      showToast('🏆 Team promoted to Grand Finalist! SMS & Email sent.');
      loadTeams();
      loadStats();
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
    } else {
      showToast(res.message || 'Rejection failed', true);
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

  // Filtered Teams Computation
  const filteredTeams = teams.filter((t) => {
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
      (filterStatus === 'NOT_SELECTED' && (t.round1Status === 'NOT_SELECTED' || t.round2Status === 'NOT_SELECTED'));

    return matchSearch && matchTheme && matchStatus;
  });

  // If not authenticated as admin, display clean executive login form
  if (!token || user?.role !== 'admin') {
    return (
      <div style={{ maxWidth: '440px', margin: '60px auto', padding: '0 20px' }}>
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
    <div className="portal-container">
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
              👑 Executive Command Center
            </span>
            <span style={{ fontSize: '12px', color: 'var(--muted)' }}>• MongoDB Atlas Live</span>
          </div>
          <h1 className="portal-title">Ideathon Administration & Evaluation Console</h1>
          <p className="portal-subtitle">
            Welcome, <strong>{user?.name}</strong> ({user?.email}). Manage teams, assign judging panelists, and issue finalist passes.
          </p>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={loadData} disabled={loading}>
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh Live Data
        </button>
      </div>

      {/* METRIC STATS ROW (4 CARDS) */}
      <div className="grid-4 mb-6">
        <div className="admin-stat-card">
          <div className="stat-icon-wrap" style={{ background: '#ecfdf5', color: '#047857' }}>
            <Users size={26} />
          </div>
          <div>
            <div className="stat-label">Total Registered Teams</div>
            <div className="stat-value">{stats.totalTeams || teams.length || 0}</div>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-icon-wrap" style={{ background: '#f0f9ff', color: '#0284c7' }}>
            <Lightbulb size={26} />
          </div>
          <div>
            <div className="stat-label">Round 1 Pitches</div>
            <div className="stat-value">{stats.round1Submissions || 0}</div>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-icon-wrap" style={{ background: '#f5f3ff', color: '#7c3aed' }}>
            <Rocket size={26} />
          </div>
          <div>
            <div className="stat-label">Round 2 Selected</div>
            <div className="stat-value">{stats.round2Selected || 0}</div>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-icon-wrap" style={{ background: '#fffbeb', color: '#d97706' }}>
            <Trophy size={26} />
          </div>
          <div>
            <div className="stat-label">Grand Finalists</div>
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
          <Users size={16} /> All Teams & Progression
          <span className="admin-tab-count">{teams.length}</span>
        </button>
        <button
          className={`admin-tab ${activeTab === 'panelists' ? 'active' : ''}`}
          onClick={() => setActiveTab('panelists')}
        >
          <UserCheck size={16} /> Judges & Panelist Assignments
          <span className="admin-tab-count">{panelists.length}</span>
        </button>
        <button
          className={`admin-tab ${activeTab === 'finalists' ? 'active' : ''}`}
          onClick={() => setActiveTab('finalists')}
        >
          <Award size={16} /> Grand Finale Stage Scheduler
          <span className="admin-tab-count">{teams.filter((t) => t.finalStatus === 'FINALIST').length}</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: TEAMS & ROUND PROGRESSION                                         */}
      {/* ========================================================================= */}
      {activeTab === 'teams' && (
        <div className="light-card" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '14px' }}>
            <div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: 800, margin: 0 }}>
                📋 All Registered Teams ({filteredTeams.length} of {teams.length})
              </h3>
              <p style={{ color: 'var(--muted)', fontSize: '13px', margin: '2px 0 0' }}>
                Review proposals, select Round 1 qualifiers, and promote to Grand Finalists.
              </p>
            </div>
          </div>

          {/* SEARCH & FILTER BAR */}
          <div className="filter-bar">
            <div className="filter-input-wrap">
              <input
                type="text"
                placeholder="Search by team name, ID, or leader email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <select
              className="filter-select"
              value={filterTheme}
              onChange={(e) => setFilterTheme(e.target.value)}
            >
              <option value="ALL">All Themes</option>
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
            >
              <option value="ALL">All Statuses</option>
              <option value="R1_SUBMITTED">Round 1 Submitted</option>
              <option value="R1_SELECTED">Round 1 Selected (R2 Unlocked)</option>
              <option value="R2_SUBMITTED">Round 2 Dossier Submitted</option>
              <option value="FINALIST">Grand Finalist 🏆</option>
              <option value="NOT_SELECTED">Not Selected</option>
            </select>
          </div>

          {/* TEAMS TABLE */}
          <div className="table-wrap">
            <table className="light-table">
              <thead>
                <tr>
                  <th>Team ID</th>
                  <th>Team Name</th>
                  <th>Theme Track</th>
                  <th>Team Leader</th>
                  <th>R1 Pitch</th>
                  <th>R2 Dossier</th>
                  <th>Final Stage</th>
                  <th>Assigned Judges</th>
                  <th>Review Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTeams.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center" style={{ padding: '36px 14px' }}>
                      <div style={{ fontSize: '28px', marginBottom: '8px' }}>🔍</div>
                      <strong style={{ color: 'var(--text-main)' }}>No matching teams found</strong>
                      <p style={{ color: 'var(--muted)', fontSize: '13px', marginTop: '4px' }}>
                        Try adjusting your search query or filter criteria.
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredTeams.map((t) => (
                    <tr key={t._id}>
                      <td>
                        <code style={{ background: '#f1f5f9', padding: '3px 6px', borderRadius: '4px', fontSize: '12px', fontWeight: 700 }}>
                          {t.teamId || t._id.substring(0, 8)}
                        </code>
                      </td>
                      <td>
                        <strong style={{ color: 'var(--ink)', fontSize: '14px' }}>{t.teamName}</strong>
                        <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{t.members?.length || 1} members</div>
                      </td>
                      <td>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--green)' }}>
                          {t.theme?.name || 'Assigned Track'}
                        </span>
                      </td>
                      <td>
                        <div style={{ fontSize: '12.5px', fontWeight: 700 }}>{t.leader?.name || 'Leader'}</div>
                        <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{t.leader?.email}</div>
                        {t.leader?.phone && (
                          <div style={{ fontSize: '10.5px', color: 'var(--muted)' }}>📱 {t.leader?.phone}</div>
                        )}
                      </td>
                      <td>
                        <span className={`badge ${t.round1Status}`}>{t.round1Status}</span>
                      </td>
                      <td>
                        <span className={`badge ${t.round2Status}`}>{t.round2Status}</span>
                      </td>
                      <td>
                        <span className={`badge ${t.finalStatus}`}>{t.finalStatus}</span>
                      </td>
                      <td>
                        {t.assignedPanelists && t.assignedPanelists.length > 0 ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                            {t.assignedPanelists.map((p, idx) => (
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
                          <span style={{ fontSize: '11px', color: 'var(--muted)', fontStyle: 'italic' }}>None assigned</span>
                        )}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          {t.round1Status !== 'SELECTED' && (
                            <button
                              className="btn btn-sm"
                              style={{ background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0' }}
                              onClick={() => handleSelectRound1(t._id)}
                              title="Select for Round 2"
                            >
                              ✓ Select R1
                            </button>
                          )}
                          {t.finalStatus !== 'FINALIST' && (
                            <button
                              className="btn btn-sm btn-primary"
                              onClick={() => handleSelectRound2(t._id)}
                              title="Promote to Grand Finalist"
                            >
                              🏆 Finalist
                            </button>
                          )}
                          {t.round1Status === 'SUBMITTED' && (
                            <button
                              className="btn btn-sm"
                              style={{ background: '#fff1f2', color: '#be123c', border: '1px solid #fecdd3' }}
                              onClick={() => handleRejectRound1(t._id)}
                              title="Reject Round 1"
                            >
                              ✗ Reject
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
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
          {/* TOP 2-COLUMN: CREATE JUDGE + DIRECTORY */}
          <div className="grid-2">
            {/* CREATE JUDGE ACCOUNT */}
            <div className="light-card" style={{ padding: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                <span style={{ background: '#f0fdf4', color: 'var(--green)', padding: '6px', borderRadius: '8px' }}>
                  <UserCheck size={20} />
                </span>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: 800, margin: 0 }}>
                  Create Judge (Panelist) Account
                </h3>
              </div>
              <p style={{ color: 'var(--muted)', fontSize: '13px', marginBottom: '20px' }}>
                Jury members do not register publicly. Create their official evaluation credentials here.
              </p>

              <form onSubmit={handleCreatePanelist}>
                <div className="form-group">
                  <label>Judge Full Name *</label>
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
                    <label>Official Email Address *</label>
                    <input
                      type="email"
                      placeholder="judge@ideathon.org"
                      value={panelistForm.email}
                      onChange={(e) => setPanelistForm({ ...panelistForm, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label>Contact Phone Number *</label>
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
                  <label>Initial Login Password *</label>
                  <input
                    type="password"
                    placeholder="Min 6 characters (e.g. Judge@2026)"
                    value={panelistForm.password}
                    onChange={(e) => setPanelistForm({ ...panelistForm, password: e.target.value })}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary w-full mt-2">
                  <Plus size={16} /> Save & Issue Panelist Credential
                </button>
              </form>
            </div>

            {/* ACTIVE JUDGES DIRECTORY */}
            <div className="light-card" style={{ padding: '28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: 800, margin: 0 }}>
                    ⚖️ Active Jury Panelists ({panelists.length})
                  </h3>
                  <p style={{ color: 'var(--muted)', fontSize: '13px', margin: '2px 0 0' }}>
                    Authorized evaluators with active portal credentials.
                  </p>
                </div>
              </div>

              {panelists.length === 0 ? (
                <div style={{ padding: '36px 0', textAlign: 'center', color: 'var(--muted)' }}>
                  <div style={{ fontSize: '32px', marginBottom: '6px' }}>⚖️</div>
                  <strong>No judge accounts created yet.</strong>
                  <p style={{ fontSize: '12px' }}>Use the form on the left to add your first evaluator.</p>
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

          {/* BOTTOM CARD: ASSIGN PANELISTS TO TEAMS */}
          <div className="light-card" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <span style={{ background: '#f0f9ff', color: '#0284c7', padding: '6px', borderRadius: '8px' }}>
                <Key size={20} />
              </span>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: 800, margin: 0 }}>
                Assign Jury Panelists to Teams
              </h3>
            </div>
            <p style={{ color: 'var(--muted)', fontSize: '13px', marginBottom: '20px' }}>
              Assign one or multiple evaluators to a specific team so submissions become visible in the judge’s portal.
            </p>

            <form onSubmit={handleAssignPanelists}>
              <div className="form-row">
                <div className="form-group" style={{ margin: 0 }}>
                  <label>1. Select Target Team *</label>
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
                  <label>2. Select Assigned Judges ({assignPanelistEmails.length} Selected) *</label>
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
                <button type="submit" className="btn btn-primary" disabled={!assignTeamId || assignPanelistEmails.length === 0}>
                  <CheckCircle2 size={16} /> Confirm Assignment & Push to Evaluator Portals
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
                Grand Finale Presentation Slot Scheduler
              </h3>
            </div>
            <p style={{ color: 'var(--muted)', fontSize: '13px', marginBottom: '20px' }}>
              Schedule stage venue, live presentation slot, and instructions for qualified finalists.
            </p>

            <form onSubmit={handleScheduleFinalist}>
              <div className="form-group">
                <label>Select Qualified Finalist Team *</label>
                <select
                  value={schedTeamId}
                  onChange={(e) => setSchedTeamId(e.target.value)}
                  required
                >
                  <option value="">Select Finalist Team...</option>
                  {teams.filter((t) => t.finalStatus === 'FINALIST').map((t) => (
                    <option key={t._id} value={t._id}>
                      🏆 {t.teamName} ({t.teamId})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-row">
                <div className="form-group" style={{ margin: 0 }}>
                  <label>Venue / Stage *</label>
                  <input
                    type="text"
                    value={schedVenue}
                    onChange={(e) => setSchedVenue(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label>Slot Start Time *</label>
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
                  <label>Presentation Duration *</label>
                  <input
                    type="text"
                    value={schedDuration}
                    onChange={(e) => setSchedDuration(e.target.value)}
                    placeholder="e.g. 15 minutes"
                    required
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label>Event Date *</label>
                  <input
                    type="date"
                    value={schedDate}
                    onChange={(e) => setSchedDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginTop: '16px' }}>
                <label>Finalist Instructions & Guidelines</label>
                <input
                  type="text"
                  value={schedInstructions}
                  onChange={(e) => setSchedInstructions(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary w-full mt-4">
                <Trophy size={16} /> Confirm Slot & Issue Grand Finale Stage Pass
              </button>
            </form>
          </div>

          {/* FINALIST PASS PREVIEW */}
          <div className="light-card" style={{ padding: '28px' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: 800, marginBottom: '6px' }}>
              🎟️ Grand Finale Stage Pass Preview
            </h3>
            <p style={{ color: 'var(--muted)', fontSize: '13px', marginBottom: '20px' }}>
              Real-time preview of the stage pass issued to the selected finalist team.
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', fontSize: '13px', color: '#92400e', marginBottom: '16px' }}>
                <div>
                  <strong style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', opacity: 0.8 }}>Venue / Stage</strong>
                  <span>📍 {schedVenue}</span>
                </div>
                <div>
                  <strong style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', opacity: 0.8 }}>Time & Duration</strong>
                  <span>⏰ {schedTime} ({schedDuration})</span>
                </div>
                <div>
                  <strong style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', opacity: 0.8 }}>Date</strong>
                  <span>📅 {schedDate}</span>
                </div>
                <div>
                  <strong style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', opacity: 0.8 }}>Access Status</strong>
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
    </div>
  );
}
