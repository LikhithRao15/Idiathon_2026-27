import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

// Helper to reliably construct jsPDF document
const createPDFDoc = (options) => {
  if (typeof jsPDF === 'function') {
    return new jsPDF(options);
  }
  try {
    const jspdfPkg = require('jspdf');
    const Cls = jspdfPkg.jsPDF || jspdfPkg.default || jspdfPkg;
    return new Cls(options);
  } catch {
    return new jsPDF(options);
  }
};

// Helper to safely call autoTable whether default export or function
const runAutoTable = (doc, options) => {
  if (typeof doc.autoTable === 'function') {
    doc.autoTable(options);
  } else if (typeof autoTable === 'function') {
    autoTable(doc, options);
  } else if (autoTable && typeof autoTable.default === 'function') {
    autoTable.default(doc, options);
  }
};

/**
 * Format date nicely
 */
const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  try {
    return new Date(dateStr).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return String(dateStr);
  }
};

/**
 * Export all or selected teams to Excel (.xlsx) with complete details
 */
export const exportTeamsToExcel = (teams = [], filename = 'Ideathon_Teams_Data.xlsx') => {
  if (!teams || teams.length === 0) {
    throw new Error('No team data available to export.');
  }

  const wb = XLSX.utils.book_new();

  // 1. Sheet 1: Master Team Overview with ALL database fields
  const masterRows = teams.map((team, idx) => {
    const leader = team.leader || {};
    const theme = team.theme || {};
    const members = Array.isArray(team.members) ? team.members : [];
    const r1 = team.round1Submission || {};
    const r2 = team.round2Submission || {};
    const assignedJudges = Array.isArray(team.assignedPanelists)
      ? team.assignedPanelists.map((p) => (typeof p === 'object' ? p.name || p.email : p)).filter(Boolean).join(', ')
      : '';
    const evals = Array.isArray(team.evaluations) ? team.evaluations : [];
    const evalsSummary = evals
      .map(
        (e) =>
          `[R${e.round}] ${e.panelistId?.name || 'Judge'}: ${e.totalScore || 0} pts - "${e.comments || 'No comment'}"`
      )
      .join(' | ');

    // Detailed members summary
    const membersSummary = members
      .map((m, i) => `${i + 1}. ${m.name || 'Member'} (${m.phone || 'No phone'}${m.email ? `, ${m.email}` : ''}${m.roleInTeam ? `, ${m.roleInTeam}` : ''})`)
      .join('; ');

    return {
      'Sl. No.': idx + 1,
      'Team ID': team.teamId || team._id || '',
      'Team Name': team.teamName || '',
      'Theme Track': theme.name || 'Unassigned',
      'Theme Description': theme.description || '',
      'Leader Name': leader.name || '',
      'Leader Email': leader.email || '',
      'Leader Phone': leader.phone || '',
      'Total Team Size': members.length + 1,
      'Members Summary': membersSummary || 'None (Solo Team Leader)',
      'Member 1 Name': members[0]?.name || '',
      'Member 1 Phone': members[0]?.phone || '',
      'Member 1 Email': members[0]?.email || '',
      'Member 1 Role': members[0]?.roleInTeam || '',
      'Member 2 Name': members[1]?.name || '',
      'Member 2 Phone': members[1]?.phone || '',
      'Member 2 Email': members[1]?.email || '',
      'Member 2 Role': members[1]?.roleInTeam || '',
      'Member 3 Name': members[2]?.name || '',
      'Member 3 Phone': members[2]?.phone || '',
      'Member 3 Email': members[2]?.email || '',
      'Member 3 Role': members[2]?.roleInTeam || '',
      'Round 1 Status': team.round1Status || 'NOT_SUBMITTED',
      'Round 1 Avg Score': team.r1AvgScore !== null && team.r1AvgScore !== undefined ? `${team.r1AvgScore} / 50` : 'Not Evaluated',
      'Round 1 Evaluations Count': team.r1EvaluationsCount || 0,
      'Round 1 Problem Statement': r1.problemStatement || 'Not submitted',
      'Round 1 Proposed Solution': r1.proposedSolution || 'Not submitted',
      'Round 1 Submission Date': formatDate(r1.submittedAt || r1.createdAt),
      'Round 2 Status': team.round2Status || 'LOCKED',
      'Round 2 Avg Score': team.r2AvgScore !== null && team.r2AvgScore !== undefined ? `${team.r2AvgScore} / 80` : 'Not Evaluated',
      'Round 2 Evaluations Count': team.r2EvaluationsCount || 0,
      'Round 2 Detailed Concept': r2.detailedConcept || 'Not submitted',
      'Round 2 90-Day Feasibility': r2.feasibilityPlan90Days || 'Not submitted',
      'Round 2 Resource Requirements': r2.resourceRequirements || 'Not submitted',
      'Final Stage Status': team.finalStatus || 'NOT_QUALIFIED',
      'Assigned Panelists / Judges': assignedJudges || 'None assigned',
      'Jury Scores & Comments': evalsSummary || 'No evaluations recorded',
      'Registered Date': formatDate(team.createdAt),
    };
  });

  const wsMaster = XLSX.utils.json_to_sheet(masterRows);
  // Auto calculate column widths
  const masterKeys = Object.keys(masterRows[0] || {});
  wsMaster['!cols'] = masterKeys.map((k) => ({
    wch: Math.max(k.length + 2, 14),
  }));
  XLSX.utils.book_append_sheet(wb, wsMaster, 'All Teams Master');

  // 2. Sheet 2: All Members Detail (Every member and leader)
  const memberRows = [];
  teams.forEach((team) => {
    const leader = team.leader || {};
    memberRows.push({
      'Team ID': team.teamId || team._id,
      'Team Name': team.teamName,
      'Theme Track': team.theme?.name || 'Unassigned',
      'Designation': 'Team Leader',
      'Name': leader.name || '—',
      'Email': leader.email || '—',
      'Phone': leader.phone || '—',
      'Role in Team': 'Leader',
      'Final Stage': team.finalStatus,
    });

    if (Array.isArray(team.members)) {
      team.members.forEach((m) => {
        memberRows.push({
          'Team ID': team.teamId || team._id,
          'Team Name': team.teamName,
          'Theme Track': team.theme?.name || 'Unassigned',
          'Designation': 'Member',
          'Name': m.name || '—',
          'Email': m.email || '—',
          'Phone': m.phone || '—',
          'Role in Team': m.roleInTeam || 'Member',
          'Final Stage': team.finalStatus,
        });
      });
    }
  });

  if (memberRows.length > 0) {
    const wsMembers = XLSX.utils.json_to_sheet(memberRows);
    wsMembers['!cols'] = Object.keys(memberRows[0]).map((k) => ({
      wch: Math.max(k.length + 2, 15),
    }));
    XLSX.utils.book_append_sheet(wb, wsMembers, 'Team Members');
  }

  // 3. Sheet 3: Individual Jury Evaluation Breakdown
  const evalRows = [];
  teams.forEach((team) => {
    const evals = Array.isArray(team.evaluations) ? team.evaluations : [];
    evals.forEach((ev) => {
      let criteriaStr = '';
      if (Array.isArray(ev.criteriaMarks)) {
        criteriaStr = ev.criteriaMarks.map((c) => `${c.criteriaName || 'Criterion'}: ${c.marks}`).join('; ');
      } else if (ev.criteria && typeof ev.criteria === 'object') {
        criteriaStr = Object.entries(ev.criteria)
          .map(([k, v]) => `${k}: ${v}`)
          .join('; ');
      }

      evalRows.push({
        'Team ID': team.teamId || team._id,
        'Team Name': team.teamName,
        'Round': `Round ${ev.round || 1}`,
        'Judge Name': ev.panelistId?.name || 'Official Panelist',
        'Judge Email': ev.panelistId?.email || '—',
        'Total Score': ev.totalScore !== undefined ? ev.totalScore : '—',
        'Max Possible': ev.round === 2 ? 80 : 50,
        'Criteria Breakdown': criteriaStr || '—',
        'Observations / Feedback': ev.comments || 'No feedback recorded',
        'Evaluated Date': formatDate(ev.createdAt),
      });
    });
  });

  if (evalRows.length > 0) {
    const wsEvals = XLSX.utils.json_to_sheet(evalRows);
    wsEvals['!cols'] = Object.keys(evalRows[0]).map((k) => ({
      wch: Math.max(k.length + 2, 16),
    }));
    XLSX.utils.book_append_sheet(wb, wsEvals, 'Jury Evaluations');
  }

  XLSX.writeFile(wb, filename);
};

/**
 * Export a single team entry to Excel (.xlsx)
 */
export const exportSingleTeamToExcel = (team) => {
  if (!team) return;
  const safeName = (team.teamName || 'Team').replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = `${team.teamId || 'TEAM'}_${safeName}_Dossier.xlsx`;
  exportTeamsToExcel([team], filename);
};

/**
 * Export all or selected teams to PDF report
 */
export const exportTeamsToPDF = (teams = [], filename = 'Ideathon_Teams_Report.pdf') => {
  if (!teams || teams.length === 0) {
    throw new Error('No team data available to export.');
  }

  // Landscape A4 orientation
  const doc = createPDFDoc({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  // Document Title Header
  doc.setFillColor(12, 91, 53); // #0c5b35
  doc.rect(0, 0, pageWidth, 24, 'F');

  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text('IDEATHON 2026-27 — TEAMS EVALUATION & LEADERBOARD', 14, 12);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(220, 252, 231);
  const subtitle = `Generated: ${new Date().toLocaleString('en-IN')} | Total Listed Teams: ${teams.length}`;
  doc.text(subtitle, 14, 18);

  // Table Body Rows
  const tableData = teams.map((team, idx) => {
    const leader = team.leader || {};
    const leaderStr = `${leader.name || 'Leader'}\n${leader.phone || ''}\n${leader.email || ''}`.trim();
    const r1Score = team.r1AvgScore !== null && team.r1AvgScore !== undefined ? `${team.r1AvgScore} / 50` : '—';
    const r2Score = team.r2AvgScore !== null && team.r2AvgScore !== undefined ? `${team.r2AvgScore} / 80` : '—';
    const memberCount = (team.members?.length || 0) + 1;
    const assigned = Array.isArray(team.assignedPanelists) && team.assignedPanelists.length > 0
      ? team.assignedPanelists.map((p) => (typeof p === 'object' ? p.name || p.email : p)).filter(Boolean).join(', ')
      : 'None';

    return [
      idx + 1,
      team.teamId || team._id?.substring(0, 8) || '',
      team.teamName || '',
      team.theme?.name || 'Unassigned',
      leaderStr,
      `${memberCount}`,
      r1Score,
      r2Score,
      team.round1Status || '—',
      team.round2Status || '—',
      team.finalStatus || '—',
      assigned,
    ];
  });

  runAutoTable(doc, {
    startY: 28,
    head: [
      [
        '#',
        'Team ID',
        'Team Name',
        'Theme Track',
        'Leader & Contact',
        'Size',
        'R1 Score',
        'R2 Score',
        'R1 Status',
        'R2 Status',
        'Final Stage',
        'Assigned Judges',
      ],
    ],
    body: tableData,
    theme: 'grid',
    styles: {
      fontSize: 7.5,
      cellPadding: 2,
      textColor: [30, 41, 59],
      valign: 'middle',
      overflow: 'linebreak',
    },
    headStyles: {
      fillColor: [12, 91, 53],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8,
      halign: 'center',
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    columnStyles: {
      0: { cellWidth: 8, halign: 'center' },
      1: { cellWidth: 24, fontStyle: 'bold' },
      2: { cellWidth: 32, fontStyle: 'bold' },
      3: { cellWidth: 28 },
      4: { cellWidth: 42 },
      5: { cellWidth: 12, halign: 'center' },
      6: { cellWidth: 18, halign: 'center' },
      7: { cellWidth: 18, halign: 'center' },
      8: { cellWidth: 22, halign: 'center' },
      9: { cellWidth: 22, halign: 'center' },
      10: { cellWidth: 22, halign: 'center' },
      11: { cellWidth: 30 },
    },
    didDrawPage: (data) => {
      // Footer page numbering
      const pageNumber = doc.internal.getNumberOfPages();
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text(
        `Ideathon Administration Console — Page ${data.pageNumber} of ${pageNumber}`,
        pageWidth / 2,
        doc.internal.pageSize.getHeight() - 6,
        { align: 'center' }
      );
    },
    margin: { top: 28, bottom: 12, left: 10, right: 10 },
  });

  doc.save(filename);
};

/**
 * Export a single team entry to comprehensive PDF dossier and scorecard
 */
export const exportSingleTeamToPDF = (team) => {
  if (!team) return;

  const doc = createPDFDoc({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const leader = team.leader || {};
  const theme = team.theme || {};
  const members = Array.isArray(team.members) ? team.members : [];
  const r1 = team.round1Submission || {};
  const r2 = team.round2Submission || {};
  const evals = Array.isArray(team.evaluations) ? team.evaluations : [];

  // Top Banner
  doc.setFillColor(12, 91, 53); // #0c5b35
  doc.rect(0, 0, pageWidth, 28, 'F');

  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text('IDEATHON 2026-27', 14, 12);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(220, 252, 231);
  doc.text('OFFICIAL TEAM DOSSIER & EVALUATION SCORECARD', 14, 18);

  doc.setFontSize(8);
  doc.setTextColor(187, 247, 208);
  doc.text(`Generated: ${new Date().toLocaleString('en-IN')}`, 14, 24);

  let curY = 35;

  // Section 1: Team & Leader Profile Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(12, curY, pageWidth - 24, 38, 3, 3, 'FD');

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(`Team ID: ${team.teamId || team._id || '—'}`, 16, curY + 7);
  doc.text(`Team Name: ${team.teamName || '—'}`, 16, curY + 14);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text(`Theme Track: ${theme.name || 'Unassigned'}`, 16, curY + 21);
  doc.text(`Registration Date: ${formatDate(team.createdAt)}`, 16, curY + 28);
  doc.text(`Final Stage: ${team.finalStatus || 'NOT_QUALIFIED'}`, 16, curY + 34);

  // Right column of profile box: Leader info
  const rightX = pageWidth / 2 + 5;
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Team Leader Information', rightX, curY + 7);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(`Name: ${leader.name || '—'}`, rightX, curY + 14);
  doc.text(`Email: ${leader.email || '—'}`, rightX, curY + 21);
  doc.text(`Phone: ${leader.phone || '—'}`, rightX, curY + 28);
  doc.text(`Total Members: ${members.length + 1}`, rightX, curY + 34);

  curY += 44;

  // Section 2: Team Members Table
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(12, 91, 53);
  doc.text('TEAM ROSTER & MEMBERS', 14, curY);
  curY += 3;

  const rosterRows = [
    ['Leader', leader.name || '—', leader.email || '—', leader.phone || '—', 'Team Leader / Primary Contact'],
    ...members.map((m) => ['Member', m.name || '—', m.email || '—', m.phone || '—', m.roleInTeam || 'Member']),
  ];

  runAutoTable(doc, {
    startY: curY,
    head: [['Role', 'Member Name', 'Email', 'Phone', 'Responsibility']],
    body: rosterRows,
    theme: 'grid',
    styles: { fontSize: 8, cellPadding: 2.5 },
    headStyles: { fillColor: [12, 91, 53], textColor: 255, fontStyle: 'bold' },
    margin: { left: 12, right: 12 },
  });

  curY = doc.lastAutoTable.finalY + 8;

  // Section 3: Evaluation & Scores Summary Table
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(12, 91, 53);
  doc.text('PROGRESSION & JURY SCORES SUMMARY', 14, curY);
  curY += 3;

  const r1ScoreText = team.r1AvgScore !== null && team.r1AvgScore !== undefined ? `${team.r1AvgScore} / 50` : 'Not Evaluated';
  const r2ScoreText = team.r2AvgScore !== null && team.r2AvgScore !== undefined ? `${team.r2AvgScore} / 80` : 'Not Evaluated';
  const assigned = Array.isArray(team.assignedPanelists) && team.assignedPanelists.length > 0
    ? team.assignedPanelists.map((p) => (typeof p === 'object' ? p.name || p.email : p)).filter(Boolean).join(', ')
    : 'None assigned';

  const scoreSummaryRows = [
    ['Round 1 (Pitch Evaluation)', team.round1Status || '—', r1ScoreText, `${team.r1EvaluationsCount || 0} judges`],
    ['Round 2 (Detailed Dossier)', team.round2Status || '—', r2ScoreText, `${team.r2EvaluationsCount || 0} judges`],
    ['Grand Finale Stage', team.finalStatus || '—', '—', `Assigned: ${assigned}`],
  ];

  runAutoTable(doc, {
    startY: curY,
    head: [['Stage', 'Status', 'Jury Score (Avg)', 'Evaluations / Assigned']],
    body: scoreSummaryRows,
    theme: 'grid',
    styles: { fontSize: 8, cellPadding: 2.5 },
    headStyles: { fillColor: [30, 41, 59], textColor: 255, fontStyle: 'bold' },
    margin: { left: 12, right: 12 },
  });

  curY = doc.lastAutoTable.finalY + 8;

  // Section 4: Round 1 Pitch
  if (r1.problemStatement || r1.proposedSolution) {
    if (curY > 230) {
      doc.addPage();
      curY = 20;
    }

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(12, 91, 53);
    doc.text('ROUND 1 PITCH SUBMISSION', 14, curY);
    curY += 5;

    const r1PitchData = [
      ['Problem Statement', r1.problemStatement || 'Not submitted'],
      ['Proposed Solution', r1.proposedSolution || 'Not submitted'],
    ];

    runAutoTable(doc, {
      startY: curY,
      body: r1PitchData,
      theme: 'grid',
      styles: { fontSize: 8, cellPadding: 3, overflow: 'linebreak' },
      columnStyles: {
        0: { cellWidth: 40, fontStyle: 'bold', fillColor: [241, 245, 249] },
        1: { cellWidth: pageWidth - 64 },
      },
      margin: { left: 12, right: 12 },
    });

    curY = doc.lastAutoTable.finalY + 8;
  }

  // Section 5: Round 2 Dossier (if submitted)
  if (r2.detailedConcept || r2.feasibilityPlan90Days || r2.resourceRequirements) {
    if (curY > 230) {
      doc.addPage();
      curY = 20;
    }

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(12, 91, 53);
    doc.text('ROUND 2 DETAILED DOSSIER', 14, curY);
    curY += 5;

    const r2DossierData = [];
    if (r2.detailedConcept) r2DossierData.push(['Detailed Concept', r2.detailedConcept]);
    if (r2.feasibilityPlan90Days) r2DossierData.push(['90-Day Feasibility Plan', r2.feasibilityPlan90Days]);
    if (r2.resourceRequirements) r2DossierData.push(['Resource Requirements', r2.resourceRequirements]);

    runAutoTable(doc, {
      startY: curY,
      body: r2DossierData,
      theme: 'grid',
      styles: { fontSize: 8, cellPadding: 3, overflow: 'linebreak' },
      columnStyles: {
        0: { cellWidth: 40, fontStyle: 'bold', fillColor: [241, 245, 249] },
        1: { cellWidth: pageWidth - 64 },
      },
      margin: { left: 12, right: 12 },
    });

    curY = doc.lastAutoTable.finalY + 8;
  }

  // Section 6: Individual Jury Evaluations & Feedback
  if (evals.length > 0) {
    if (curY > 220) {
      doc.addPage();
      curY = 20;
    }

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(12, 91, 53);
    doc.text('PANELIST EVALUATION SCORECARDS & FEEDBACK', 14, curY);
    curY += 5;

    const evalTableData = evals.map((ev) => {
      let criteriaStr = '';
      if (Array.isArray(ev.criteriaMarks)) {
        criteriaStr = ev.criteriaMarks.map((c) => `${c.criteriaName || 'Item'}: ${c.marks}`).join(', ');
      } else if (ev.criteria && typeof ev.criteria === 'object') {
        criteriaStr = Object.entries(ev.criteria)
          .map(([k, v]) => `${k}: ${v}`)
          .join(', ');
      }

      return [
        `R${ev.round || 1}`,
        ev.panelistId?.name || 'Panelist',
        criteriaStr || '—',
        `${ev.totalScore || 0} / ${ev.round === 2 ? 80 : 50}`,
        ev.comments || 'No feedback provided',
      ];
    });

    runAutoTable(doc, {
      startY: curY,
      head: [['Round', 'Evaluator', 'Criteria Marks', 'Score', 'Observations & Feedback']],
      body: evalTableData,
      theme: 'grid',
      styles: { fontSize: 7.5, cellPadding: 2.5, overflow: 'linebreak' },
      headStyles: { fillColor: [12, 91, 53], textColor: 255, fontStyle: 'bold' },
      columnStyles: {
        0: { cellWidth: 14, halign: 'center' },
        1: { cellWidth: 32 },
        2: { cellWidth: 45 },
        3: { cellWidth: 20, halign: 'center', fontStyle: 'bold' },
        4: { cellWidth: pageWidth - 135 },
      },
      margin: { left: 12, right: 12 },
    });
  }

  // Page numbering on all pages
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `Ideathon Official Evaluation Dossier — ${team.teamId || team.teamName} | Page ${i} of ${totalPages}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 6,
      { align: 'center' }
    );
  }

  const safeName = (team.teamName || 'Team').replace(/[^a-zA-Z0-9_-]/g, '_');
  doc.save(`${team.teamId || 'TEAM'}_${safeName}_Dossier.pdf`);
};
