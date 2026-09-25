'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiRequest } from '../../lib/api';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const { user, token, login, showToast } = useAuth();
  const router = useRouter();

  const [stats, setStats] = useState({});
  const [teams, setTeams] = useState([]);
  const [panelists, setPanelists] = useState([]);
  const [loading, setLoading] = useState(false);

  // Admin Auth Form (for direct URL access)
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
  const [schedInstructions, setSchedInstructions] = useState('Bring live hardware prototype and presentation on backup USB.');

  useEffect(() => {
    if (token && user?.role === 'admin') {
      loadData();
    }
  }, [token, user]);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    const res = await login(adminEmail, adminPassword);
    setAuthLoading(false);
  };

  const loadData = async () => {
    setLoading(true);
    await Promise.all([loadStats(), loadTeams(), loadPanelists()]);
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
      showToast('Team selected for Round 2! Round 2 dossier is now unlocked for the team.');
      loadTeams();
      loadStats();
    } else {
      showToast(res.message || 'Selection failed', true);
    }
  };

  const handleSelectRound2 = async (teamId) => {
    const res = await apiRequest(`/admin/teams/${teamId}/round2/select`, {
      method: 'PUT',
    });
    if (res.ok) {
      showToast('Team promoted to Grand Finalist! 🏆');
      loadTeams();
      loadStats();
    } else {
      showToast(res.message || 'Promotion failed', true);
    }
  };

  const handleAssignPanelists = async (e) => {
    e.preventDefault();
    const res = await apiRequest('/admin/assign-panelist', {
      method: 'POST',
      body: JSON.stringify({
        teamId: assignTeamId,
        panelistEmails: assignPanelistEmails,
      }),
    });

    if (res.ok) {
      showToast('Judge panel assigned to team in database!');
      loadTeams();
    } else {
      showToast(res.message || 'Assignment failed', true);
    }
  };

  const handleScheduleFinalist = async (e) => {
    e.preventDefault();
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
      showToast('Grand Finale presentation slot confirmed & pass issued! 🏆');
      loadTeams();
    } else {
      showToast(res.message || 'Scheduling failed', true);
    }
  };

  // If not logged in as admin, show dedicated Admin Login screen
  if (!token || user?.role !== 'admin') {
    return (
      <div style={{ maxWidth: '440px', margin: '70px auto', padding: '0 20px' }}>
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

          <div style={{ background: '#fef3c7', border: '1px solid #fde68a', color: '#92400e', padding: '10px 14px', borderRadius: 'var(--radius-sm)', fontSize: '12px', marginBottom: '20px', lineHeight: 1.4 }}>
            🛡️ <strong>Executive Portal:</strong> Unauthorized access attempts are monitored and restricted.
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

            <button type="submit" className="btn btn-primary w-full mt-2" disabled={authLoading}>
              {authLoading ? 'Authenticating Admin...' : 'Unlock Admin Console →'}
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
          <h1 className="portal-title">👑 Admin Command Center</h1>
          <p className="portal-subtitle">
            Welcome, <strong>{user?.name}</strong>. Create panelist credentials, manage team progressions, and schedule finale slots.
          </p>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={loadData}>
          🔄 Refresh All Live Data
        </button>
      </div>

      {/* METRICS ROW */}
      <div className="grid-3 mb-6" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div className="light-card" style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '18px' }}>
          <div style={{ fontSize: '26px', background: '#ecfdf5', padding: '10px', borderRadius: '10px' }}>👥</div>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Total Teams</div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', fontWeight: 800 }}>{stats.totalTeams || 0}</div>
          </div>
        </div>

        <div className="light-card" style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '18px' }}>
          <div style={{ fontSize: '26px', background: '#f0f9ff', padding: '10px', borderRadius: '10px' }}>💡</div>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Round 1 Pitches</div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', fontWeight: 800 }}>{stats.round1Submissions || 0}</div>
          </div>
        </div>

        <div className="light-card" style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '18px' }}>
          <div style={{ fontSize: '26px', background: '#f5f3ff', padding: '10px', borderRadius: '10px' }}>🚀</div>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Round 2 Selected</div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', fontWeight: 800 }}>{stats.round2Selected || 0}</div>
          </div>
        </div>

        <div className="light-card" style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '18px' }}>
          <div style={{ fontSize: '26px', background: '#fffbeb', padding: '10px', borderRadius: '10px' }}>🏆</div>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Grand Finalists</div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', fontWeight: 800 }}>{stats.finalists || 0}</div>
          </div>
        </div>
      </div>

      {/* TEAMS MANAGEMENT TABLE */}
      <div className="light-card mb-6">
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: 800, marginBottom: '14px' }}>
          📋 All Registered Teams & Round Status
        </h3>

        <div className="table-wrap">
          <table className="light-table">
            <thead>
              <tr>
                <th>Team ID</th>
                <th>Team Name</th>
                <th>Theme</th>
                <th>Leader</th>
                <th>Round 1</th>
                <th>Round 2</th>
                <th>Final Status</th>
                <th>Quick Actions</th>
              </tr>
            </thead>
            <tbody>
              {teams.length === 0 ? (
                <tr><td colSpan={8} className="text-center">No teams registered yet.</td></tr>
              ) : (
                teams.map((t) => (
                  <tr key={t._id}>
                    <td><code>{t.teamId || t._id.substring(0, 8)}</code></td>
                    <td><strong>{t.teamName}</strong></td>
                    <td>{t.theme?.name || 'Assigned'}</td>
                    <td>{t.leader?.name || t.leader?.email}</td>
                    <td><span className={`badge ${t.round1Status}`}>{t.round1Status}</span></td>
                    <td><span className={`badge ${t.round2Status}`}>{t.round2Status}</span></td>
                    <td><span className={`badge ${t.finalStatus}`}>{t.finalStatus}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button className="btn btn-sm btn-secondary" onClick={() => handleSelectRound1(t._id)}>
                          ✓ Select R1
                        </button>
                        <button className="btn btn-sm btn-primary" onClick={() => handleSelectRound2(t._id)}>
                          🏆 Finalist
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* LOWER 2-COLUMN GRID: CREATE PANELIST & FINALE SCHEDULER */}
      <div className="grid-2">
        {/* CREATE PANELIST ACCOUNT (NO PUBLIC SIGNUP) */}
        <div className="light-card">
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: 800, marginBottom: '6px' }}>
            ⚖️ Create Panelist (Judge) Account
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '16px' }}>
            Panelists do not register publicly. Admin generates their credentials here.
          </p>

          <form onSubmit={handleCreatePanelist}>
            <div className="form-group">
              <label>Judge Full Name *</label>
              <input
                type="text"
                placeholder="Dr. Ananya Sharma"
                value={panelistForm.name}
                onChange={(e) => setPanelistForm({ ...panelistForm, name: e.target.value })}
                required
              />
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label>Judge Email Address *</label>
                <input
                  type="email"
                  placeholder="judge@ideathon.org"
                  value={panelistForm.email}
                  onChange={(e) => setPanelistForm({ ...panelistForm, email: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone Number *</label>
                <input
                  type="tel"
                  placeholder="+919876500000"
                  value={panelistForm.phone}
                  onChange={(e) => setPanelistForm({ ...panelistForm, phone: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Initial Login Password *</label>
              <input
                type="password"
                value={panelistForm.password}
                onChange={(e) => setPanelistForm({ ...panelistForm, password: e.target.value })}
                required
              />
            </div>

            <button type="submit" className="btn btn-secondary w-full">
              ➕ Save & Issue Panelist Credential
            </button>
          </form>

          {/* ACTIVE JUDGES LIST */}
          <div style={{ marginTop: '20px', borderTop: '1px solid var(--border-color)', paddingTop: '14px' }}>
            <h4 style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '10px' }}>
              Active Judging Panelists ({panelists.length})
            </h4>
            {panelists.length === 0 ? (
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>No judge accounts created yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '220px', overflowY: 'auto' }}>
                {panelists.map((p) => (
                  <div
                    key={p._id}
                    style={{
                      background: 'var(--bg-subtle)',
                      border: '1px solid var(--border-color)',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '10px',
                    }}
                  >
                    <div>
                      <strong style={{ fontSize: '13px', color: 'var(--text-main)', display: 'block' }}>{p.name}</strong>
                      <div style={{ color: 'var(--text-muted)', fontSize: '11.5px', marginTop: '2px' }}>
                        {p.email} • {p.phone || 'No phone'}
                      </div>
                      <div style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '11px', marginTop: '2px' }}>
                        📊 {p.assignedTeamsCount || 0} teams assigned • {p.evaluatedCount || 0} evaluations
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
                        borderRadius: 'var(--radius-sm)',
                        flexShrink: 0,
                      }}
                      onClick={() => handleDeletePanelist(p._id, p.name)}
                      title={`Delete ${p.name}`}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* SCHEDULE GRAND FINALE PASS */}
        <div className="light-card">
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: 800, marginBottom: '6px' }}>
            🏆 Grand Finale Stage Scheduler
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '16px' }}>
            Assign presentation stage, date, time slot, and special instructions for Finalists.
          </p>

          <form onSubmit={handleScheduleFinalist}>
            <div className="form-group">
              <label>Select Qualified Finalist Team *</label>
              <select value={schedTeamId} onChange={(e) => setSchedTeamId(e.target.value)} required>
                <option value="">Select Finalist Team...</option>
                {teams.filter((t) => t.finalStatus === 'FINALIST').map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.teamName} (Finalist)
                  </option>
                ))}
              </select>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label>Venue / Stage *</label>
                <input
                  type="text"
                  value={schedVenue}
                  onChange={(e) => setSchedVenue(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Presentation Slot Time *</label>
                <input
                  type="text"
                  value={schedTime}
                  onChange={(e) => setSchedTime(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label>Presentation Duration *</label>
                <input
                  type="text"
                  value={schedDuration}
                  onChange={(e) => setSchedDuration(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Event Date *</label>
                <input
                  type="date"
                  value={schedDate}
                  onChange={(e) => setSchedDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Finalist Instructions</label>
              <input
                type="text"
                value={schedInstructions}
                onChange={(e) => setSchedInstructions(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary w-full">
              Confirm Schedule & Issue Finale Stage Pass 🏆
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
