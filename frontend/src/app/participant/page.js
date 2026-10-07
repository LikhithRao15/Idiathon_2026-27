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

const translations = {
  en: {
    header: {
      title: "🌱 Idea Pitching & Submission Portal",
      teamLeader: "Team Leader",
      event: "Hasiru Samvadha Ideathon 2026",
      refresh: "Refresh Status",
    },

    progress: {
      teamLeader: "1. Team & Leader",
      registerTeam: "Register Team",
      round1: "2. Round 1 Pitch",
      selected: "Selected ✓",
      draft: "Draft",
      round2: "3. Round 2 Elaboration",
      locked: "Locked",
      notSelected: "Not Selected",
      submitted: "Submitted ✓",
      unlocked: "Unlocked",
      grandFinale: "4. Grand Finale",
      stagePassReady: "Stage Pass Ready",
      pending: "Pending",
    },

    finalist: {
      title: "OFFICIAL GRAND FINALE STAGE PASS",
      congratulations: (name) => `Congratulations, ${name}!`,
      message:
        "Your team has been selected as a Grand Finalist by the judges. Here are your auditorium presentation slot details:",
      venue: "STAGE / VENUE",
      slot: "SLOT TIME",
      date: "DATE",
      instructions: "INSTRUCTIONS",
      defaultVenue: "Grand Innovation Stage",
      defaultTime: "11:00 AM",
      defaultDate: "Finale Day",
      defaultInstructions: "Bring working demo hardware",
    },

    tabs: {
      teamHub: "👥 1. Team Hub & Theme",
      round1: "💡 2. Round 1: Idea Pitch",
      round2: "💡 3. Round 2: Elaboration",
      round2Locked: "🔒 3. Round 2: Elaboration",
    },

    team: {
      generalInnovation: "General Innovation",
      finalist: "FINALIST",
      draft: "DRAFT",
      leader: "Team Leader",
      primaryAccount: "Primary Account",
      notProvided: "Not provided",
      members: "Team Members",
      additional: "additional",
      soloTitle: "Solo Innovator Submission",
      soloDescription:
        "Participating as a 1-person team (Leader only).",
      proceedRound1: "Proceed to Round 1 Idea Pitch",
    },

    createTeam: {
      title: "Register Your Team",
      subtitle:
        "This team should be registered only by the Team Leader. Team members do not need to create separate accounts.",
      teamName: "Team Name *",
      theme: "Select Challenge Theme *",
      selectTheme: "Select a Theme...",
      teammates: "Teammates (Optional)",
      solo:
        "Solo innovators (1 person = Leader only) are welcome!",
      explanation:
        "Add up to 3 additional teammates. They will be included in your team submission.",
      memberName: (index) => `Member ${index} Full Name *`,
      email: "Email",
      phone: "Phone",
      role: "Role (e.g. Embedded Developer)",
      remove: "✕ Remove",
      add: "+ Add Teammate (Optional)",
      noMembers:
        "No additional members added (continuing as a 1-person team).",
      create:
        "Create Team & Unlock Round 1 Pitching",
    },

    round1: {
      stage: "STAGE 01",
      maxWords: "Max 400 Total Words",
      title: "Round 1: Idea Pitch Proposal",
      subtitle:
        "Present the core problem and your proposed technical solution.",
      challengeTheme: "Challenge Theme",
      themeUnavailable: "Theme not available",
      themeNote:
        "This is the theme selected when your team was created.",
      coastalFocusNotice:
        "The identified problem statements and solutions should focus on the challenges faced by coastal areas.",
      problem: "2. Problem Statement *",
      locked: "Locked",
      words: "words",
      problemHint:
        "Clearly explain the problem your team is trying to solve.",
      problemPlaceholder:
        "Describe the problem, who is affected, and why it matters...",
      solution: "3. Proposed Technical Solution *",
      solutionHint:
        "Explain your proposed solution and how it addresses the problem.",
      solutionPlaceholder:
        "Describe your solution, core technology, and how it will work...",
      lockedBanner: "Round 1 Proposal Locked & Verified",
      congratulations: "Congratulations!",
      selected: "SELECTED",
      goToRound2: "Go to Round 2 →",
      submittedTitle: "Round 1 Proposal Submitted",
      submittedDescription:
        "Your Round 1 proposal has been submitted and is currently locked for review.",
      submit:
        "Submit Round 1 Proposal to Database",
    },

    round2: {
      lockedTitle: "Round 2 is Currently Locked",
      lockedDescription:
        "Round 2 is not currently open for submissions. Please wait for the organizers to unlock it.",
      lockedNote:
        "You will be able to access the Round 2 dossier once the round is opened and your team is eligible.",
      stage: "STAGE 02",
      title: "Round 2: Elaborating Your Idea",
      subtitle:
        "Expand your idea with implementation, value proposition, feasibility, and resource details.",
      selectedLocked: "SELECTED (LOCKED)",
      notSelected: "NOT SELECTED",
      submittedLocked: "SUBMITTED (LOCKED)",
      unlocked: "UNLOCKED",

      detailedConcept: "1. Detailed Concept *",
      detailedConceptHint:
        "Explain the complete concept, implementation approach, and key technical details.",
      detailedConceptPlaceholder:
        "Describe your complete solution in detail...",

      valueProposition: "2. Value Proposition and Circularity *",
      valuePropositionHint:
        "Explain the value created by your solution and its environmental circularity.",
      valuePropositionPlaceholder:
        "Explain the value proposition and environmental circularity...",

      feasibility: "3. 90 Days Feasibility Plan *",
      feasibilityHint:
        "Explain how your team can develop and pilot the solution within 90 days.",
      feasibilityPlaceholder:
        "Describe your 90-day implementation and pilot plan...",

      resources: "4. Resource Requirement *",
      resourcesHint:
        "Mention the resources, infrastructure, technology, or support required.",
      resourcesPlaceholder:
        "List the resources required for implementation...",

      selectedBanner: "Selected — Grand Finalist",
      submittedTitle: "Round 2 Dossier Submitted",
      update:
        "Update Round 2 Dossier in Database",
      submit:
        "Submit Full Round 2 Dossier to Database",
    },

    toast: {
      maxTeammates:
        "Maximum 3 additional teammates allowed (Leader + 3 members).",
      teamCreated: (name) =>
        `Team "${name}" created successfully!`,
      teamCreationFailed: "Failed to create team.",
      r1AlreadySubmitted:
        "Round 1 has already been submitted.",
      problemTooLong: (count) =>
        `Problem Statement exceeds the word limit (${count} words).`,
      solutionTooLong: (count) =>
        `Proposed Technical Solution exceeds the word limit (${count} words).`,
      r1Submitted:
        "Round 1 proposal submitted successfully!",
      r1SubmissionFailed:
        "Failed to submit Round 1 proposal.",

      r2Locked:
        "Round 2 is currently locked.",
      conceptTooLong: (count) =>
        `Detailed Concept exceeds the word limit (${count} words).`,
      valueTooLong: (count) =>
        `Value Proposition and Circularity exceeds the word limit (${count} words).`,
      feasibilityTooLong: (count) =>
        `90 Days Feasibility Plan exceeds the word limit (${count} words).`,
      resourceTooLong: (count) =>
        `Resource Requirement exceeds the word limit (${count} words).`,
      r2Submitted:
        "Round 2 dossier submitted successfully!",
      r2SubmissionFailed:
        "Failed to submit Round 2 dossier.",
    },
  },

  kn: {
    header: {
      title: "🌱 ಐಡಿಯಾ ಪಿಚಿಂಗ್ ಮತ್ತು ಸಲ್ಲಿಕೆ ಪೋರ್ಟಲ್",
      teamLeader: "ತಂಡದ ನಾಯಕ",
      event: "ಹಸಿರು ಸಂವಾದ ಐಡಿಯಾಥಾನ್ 2026",
      refresh: "ಸ್ಥಿತಿಯನ್ನು ರಿಫ್ರೆಶ್ ಮಾಡಿ",
    },

    progress: {
      teamLeader: "1. ತಂಡ ಮತ್ತು ನಾಯಕ",
      registerTeam: "ತಂಡವನ್ನು ನೋಂದಾಯಿಸಿ",
      round1: "2. ರೌಂಡ್ 1 ಪಿಚ್",
      selected: "ಆಯ್ಕೆ ಮಾಡಲಾಗಿದೆ ✓",
      draft: "ಡ್ರಾಫ್ಟ್",
      round2: "3. ರೌಂಡ್ 2 ವಿವರಣೆ",
      locked: "ಲಾಕ್ ಮಾಡಲಾಗಿದೆ",
      notSelected: "ಆಯ್ಕೆ ಆಗಿಲ್ಲ",
      submitted: "ಸಲ್ಲಿಸಲಾಗಿದೆ ✓",
      unlocked: "ಅನ್ಲಾಕ್ ಮಾಡಲಾಗಿದೆ",
      grandFinale: "4. ಗ್ರ್ಯಾಂಡ್ ಫಿನಾಲೆ",
      stagePassReady: "ಸ್ಟೇಜ್ ಪಾಸ್ ಸಿದ್ಧವಾಗಿದೆ",
      pending: "ಬಾಕಿಯಿದೆ",
    },

    finalist: {
      title: "ಅಧಿಕೃತ ಗ್ರ್ಯಾಂಡ್ ಫಿನಾಲೆ ಸ್ಟೇಜ್ ಪಾಸ್",
      congratulations: (name) => `ಅಭಿನಂದನೆಗಳು, ${name}!`,
      message:
        "ನಿಮ್ಮ ತಂಡವನ್ನು ತೀರ್ಪುಗಾರರು ಗ್ರ್ಯಾಂಡ್ ಫೈನಲಿಸ್ಟ್ ಆಗಿ ಆಯ್ಕೆ ಮಾಡಿದ್ದಾರೆ. ನಿಮ್ಮ ಆಡಿಟೋರಿಯಂ ಪ್ರಸ್ತುತಿ ಸ್ಲಾಟ್ ವಿವರಗಳು ಇಲ್ಲಿವೆ:",
      venue: "ಸ್ಟೇಜ್ / ಸ್ಥಳ",
      slot: "ಸ್ಲಾಟ್ ಸಮಯ",
      date: "ದಿನಾಂಕ",
      instructions: "ಸೂಚನೆಗಳು",
      defaultVenue: "ಗ್ರ್ಯಾಂಡ್ ಇನೋವೇಶನ್ ಸ್ಟೇಜ್",
      defaultTime: "11:00 AM",
      defaultDate: "ಫಿನಾಲೆ ದಿನ",
      defaultInstructions: "ಕಾರ್ಯನಿರ್ವಹಿಸುವ ಡೆಮೊ ಹಾರ್ಡ್ವೇರ್ ತರಿರಿ",
    },

    tabs: {
      teamHub: "👥 1. ತಂಡದ ಕೇಂದ್ರ ಮತ್ತು ಥೀಮ್",
      round1: "💡 2. ರೌಂಡ್ 1: ಐಡಿಯಾ ಪಿಚ್",
      round2: "💡 3. ರೌಂಡ್ 2: ವಿವರಣೆ",
      round2Locked: "🔒 3. ರೌಂಡ್ 2: ವಿವರಣೆ",
    },

    team: {
      generalInnovation: "ಸಾಮಾನ್ಯ ನವೀನತೆ",
      finalist: "ಫೈನಲಿಸ್ಟ್",
      draft: "ಡ್ರಾಫ್ಟ್",
      leader: "ತಂಡದ ನಾಯಕ",
      primaryAccount: "ಪ್ರಾಥಮಿಕ ಖಾತೆ",
      notProvided: "ನೀಡಲಾಗಿಲ್ಲ",
      members: "ತಂಡದ ಸದಸ್ಯರು",
      additional: "ಹೆಚ್ಚುವರಿ",
      soloTitle: "ಸೋಲೋ ಇನ್ನೋವೇಟರ್ ಸಲ್ಲಿಕೆ",
      soloDescription:
        "1-ವ್ಯಕ್ತಿಯ ತಂಡವಾಗಿ (ನಾಯಕ ಮಾತ್ರ) ಭಾಗವಹಿಸುತ್ತಿದ್ದಾರೆ.",
      proceedRound1: "ರೌಂಡ್ 1 ಐಡಿಯಾ ಪಿಚ್ಗೆ ಮುಂದುವರಿಯಿರಿ",
    },

    createTeam: {
      title: "ನಿಮ್ಮ ತಂಡವನ್ನು ನೋಂದಾಯಿಸಿ",
      subtitle:
        "ಈ ತಂಡವನ್ನು ತಂಡದ ನಾಯಕ ಮಾತ್ರ ನೋಂದಾಯಿಸಬೇಕು. ತಂಡದ ಸದಸ್ಯರು ಪ್ರತ್ಯೇಕ ಖಾತೆಗಳನ್ನು ರಚಿಸುವ ಅಗತ್ಯವಿಲ್ಲ.",
      teamName: "ತಂಡದ ಹೆಸರು *",
      theme: "ಚಾಲೆಂಜ್ ಥೀಮ್ ಆಯ್ಕೆಮಾಡಿ *",
      selectTheme: "ಥೀಮ್ ಆಯ್ಕೆಮಾಡಿ...",
      teammates: "ತಂಡದ ಸದಸ್ಯರು (ಐಚ್ಛಿಕ)",
      solo:
        "ಸೋಲೋ ಇನ್ನೋವೇಟರ್ಗಳು (1 ವ್ಯಕ್ತಿ = ನಾಯಕ ಮಾತ್ರ) ಸ್ವಾಗತ!",
      explanation:
        "ಗರಿಷ್ಠ 3 ಹೆಚ್ಚುವರಿ ತಂಡದ ಸದಸ್ಯರನ್ನು ಸೇರಿಸಿ. ಅವರು ನಿಮ್ಮ ತಂಡದ ಸಲ್ಲಿಕೆಯಲ್ಲಿ ಸೇರಿಸಲ್ಪಡುತ್ತಾರೆ.",
      memberName: (index) =>
        `ಸದಸ್ಯ ${index}ರ ಪೂರ್ಣ ಹೆಸರು *`,
      email: "ಇಮೇಲ್",
      phone: "ದೂರವಾಣಿ",
      role: "ಪಾತ್ರ (ಉದಾ. ಎಂಬೆಡೆಡ್ ಡೆವಲಪರ್)",
      remove: "✕ ತೆಗೆದುಹಾಕಿ",
      add: "+ ತಂಡದ ಸದಸ್ಯರನ್ನು ಸೇರಿಸಿ (ಐಚ್ಛಿಕ)",
      noMembers:
        "ಯಾವುದೇ ಹೆಚ್ಚುವರಿ ಸದಸ್ಯರನ್ನು ಸೇರಿಸಲಾಗಿಲ್ಲ (1-ವ್ಯಕ್ತಿಯ ತಂಡವಾಗಿ ಮುಂದುವರಿಯಲಾಗುತ್ತಿದೆ).",
      create:
        "ತಂಡವನ್ನು ರಚಿಸಿ ಮತ್ತು ರೌಂಡ್ 1 ಪಿಚಿಂಗ್ ಅನ್ಲಾಕ್ ಮಾಡಿ",
    },

    round1: {
      stage: "ಹಂತ 01",
      maxWords: "ಗರಿಷ್ಠ 400 ಒಟ್ಟು ಪದಗಳು",
      title: "ರೌಂಡ್ 1: ಐಡಿಯಾ ಪಿಚ್ ಪ್ರಸ್ತಾವನೆ",
      subtitle:
        "ಮೂಲ ಸಮಸ್ಯೆ ಮತ್ತು ನಿಮ್ಮ ಪ್ರಸ್ತಾವಿತ ತಾಂತ್ರಿಕ ಪರಿಹಾರವನ್ನು ಪ್ರಸ್ತುತಪಡಿಸಿ.",
      challengeTheme: "ಚಾಲೆಂಜ್ ಥೀಮ್",
      themeUnavailable: "ಥೀಮ್ ಲಭ್ಯವಿಲ್ಲ",
      themeNote:
        "ನಿಮ್ಮ ತಂಡವನ್ನು ರಚಿಸುವಾಗ ಆಯ್ಕೆ ಮಾಡಿದ ಥೀಮ್ ಇದು.",
      coastalFocusNotice:
        "ಗುರುತಿಸಲಾದ ಸಮಸ್ಯೆಯ ಹೇಳಿಕೆಗಳು ಮತ್ತು ಪರಿಹಾರಗಳು ಕರಾವಳಿ ಪ್ರದೇಶಗಳ ಸಮಸ್ಯೆಗಳ ಮೇಲೆ ಕೇಂದ್ರೀಕರಿಸಿರಬೇಕು.",
      problem: "2. ಸಮಸ್ಯೆಯ ಹೇಳಿಕೆ *",
      locked: "ಲಾಕ್ ಮಾಡಲಾಗಿದೆ",
      words: "ಪದಗಳು",
      problemHint:
        "ನಿಮ್ಮ ತಂಡವು ಪರಿಹರಿಸಲು ಪ್ರಯತ್ನಿಸುತ್ತಿರುವ ಸಮಸ್ಯೆಯನ್ನು ಸ್ಪಷ್ಟವಾಗಿ ವಿವರಿಸಿ.",
      problemPlaceholder:
        "ಸಮಸ್ಯೆ, ಇದರಿಂದ ಪ್ರಭಾವಿತರಾಗಿರುವವರು ಮತ್ತು ಅದು ಏಕೆ ಮುಖ್ಯ ಎಂಬುದನ್ನು ವಿವರಿಸಿ...",
      solution: "3. ಪ್ರಸ್ತಾವಿತ ತಾಂತ್ರಿಕ ಪರಿಹಾರ *",
      solutionHint:
        "ನಿಮ್ಮ ಪ್ರಸ್ತಾವಿತ ಪರಿಹಾರ ಮತ್ತು ಅದು ಸಮಸ್ಯೆಯನ್ನು ಹೇಗೆ ಪರಿಹರಿಸುತ್ತದೆ ಎಂಬುದನ್ನು ವಿವರಿಸಿ.",
      solutionPlaceholder:
        "ನಿಮ್ಮ ಪರಿಹಾರ, ಪ್ರಮುಖ ತಂತ್ರಜ್ಞಾನ ಮತ್ತು ಅದು ಹೇಗೆ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ ಎಂಬುದನ್ನು ವಿವರಿಸಿ...",
      lockedBanner: "ರೌಂಡ್ 1 ಪ್ರಸ್ತಾವನೆ ಲಾಕ್ ಮತ್ತು ಪರಿಶೀಲಿಸಲಾಗಿದೆ",
      congratulations: "ಅಭಿನಂದನೆಗಳು!",
      selected: "ಆಯ್ಕೆ ಮಾಡಲಾಗಿದೆ",
      goToRound2: "ರೌಂಡ್ 2ಕ್ಕೆ ಹೋಗಿ →",
      submittedTitle: "ರೌಂಡ್ 1 ಪ್ರಸ್ತಾವನೆ ಸಲ್ಲಿಸಲಾಗಿದೆ",
      submittedDescription:
        "ನಿಮ್ಮ ರೌಂಡ್ 1 ಪ್ರಸ್ತಾವನೆಯನ್ನು ಸಲ್ಲಿಸಲಾಗಿದೆ ಮತ್ತು ಪರಿಶೀಲನೆಗಾಗಿ ಲಾಕ್ ಮಾಡಲಾಗಿದೆ.",
      submit:
        "ರೌಂಡ್ 1 ಪ್ರಸ್ತಾವನೆಯನ್ನು ಡೇಟಾಬೇಸ್ಗೆ ಸಲ್ಲಿಸಿ",
    },

    round2: {
      lockedTitle: "ರೌಂಡ್ 2 ಪ್ರಸ್ತುತ ಲಾಕ್ ಆಗಿದೆ",
      lockedDescription:
        "ರೌಂಡ್ 2 ಪ್ರಸ್ತುತ ಸಲ್ಲಿಕೆಗಳಿಗೆ ತೆರೆಯಲಾಗಿಲ್ಲ. ಆಯೋಜಕರು ಅದನ್ನು ಅನ್ಲಾಕ್ ಮಾಡುವವರೆಗೆ ಕಾಯಿರಿ.",
      lockedNote:
        "ರೌಂಡ್ ತೆರೆಯಲ್ಪಟ್ಟ ನಂತರ ಮತ್ತು ನಿಮ್ಮ ತಂಡ ಅರ್ಹವಾಗಿದ್ದರೆ ರೌಂಡ್ 2 ಡೋಸಿಯರ್ ಅನ್ನು ಪ್ರವೇಶಿಸಲು ಸಾಧ್ಯವಾಗುತ್ತದೆ.",
      stage: "ಹಂತ 02",
      title: "ರೌಂಡ್ 2: ನಿಮ್ಮ ಐಡಿಯಾವನ್ನು ವಿಸ್ತರಿಸುವುದು",
      subtitle:
        "ಅನುಷ್ಠಾನ, ಮೌಲ್ಯ ಪ್ರಸ್ತಾವನೆ, ಕಾರ್ಯಸಾಧ್ಯತೆ ಮತ್ತು ಸಂಪನ್ಮೂಲ ವಿವರಗಳೊಂದಿಗೆ ನಿಮ್ಮ ಐಡಿಯಾವನ್ನು ವಿಸ್ತರಿಸಿ.",
      selectedLocked: "ಆಯ್ಕೆ ಮಾಡಲಾಗಿದೆ (ಲಾಕ್)",
      notSelected: "ಆಯ್ಕೆ ಆಗಿಲ್ಲ",
      submittedLocked: "ಸಲ್ಲಿಸಲಾಗಿದೆ (ಲಾಕ್)",
      unlocked: "ಅನ್ಲಾಕ್ ಮಾಡಲಾಗಿದೆ",

      detailedConcept: "1. ವಿವರವಾದ ಪರಿಕಲ್ಪನೆ *",
      detailedConceptHint:
        "ಸಂಪೂರ್ಣ ಪರಿಕಲ್ಪನೆ, ಅನುಷ್ಠಾನ ವಿಧಾನ ಮತ್ತು ಪ್ರಮುಖ ತಾಂತ್ರಿಕ ವಿವರಗಳನ್ನು ವಿವರಿಸಿ.",
      detailedConceptPlaceholder:
        "ನಿಮ್ಮ ಸಂಪೂರ್ಣ ಪರಿಹಾರವನ್ನು ವಿವರವಾಗಿ ವಿವರಿಸಿ...",

      valueProposition: "2. ಮೌಲ್ಯ ಪ್ರಸ್ತಾವನೆ ಮತ್ತು ಸರ್ಕ್ಯುಲಾರಿಟಿ *",
      valuePropositionHint:
        "ನಿಮ್ಮ ಪರಿಹಾರದಿಂದ ಸೃಷ್ಟಿಯಾಗುವ ಮೌಲ್ಯ ಮತ್ತು ಅದರ ಪರಿಸರ ಸರ್ಕ್ಯುಲಾರಿಟಿಯನ್ನು ವಿವರಿಸಿ.",
      valuePropositionPlaceholder:
        "ಮೌಲ್ಯ ಪ್ರಸ್ತಾವನೆ ಮತ್ತು ಪರಿಸರ ಸರ್ಕ್ಯುಲಾರಿಟಿಯನ್ನು ವಿವರಿಸಿ...",

      feasibility: "3. 90 ದಿನಗಳ ಕಾರ್ಯಸಾಧ್ಯತಾ ಯೋಜನೆ *",
      feasibilityHint:
        "90 ದಿನಗಳೊಳಗೆ ನಿಮ್ಮ ತಂಡವು ಪರಿಹಾರವನ್ನು ಅಭಿವೃದ್ಧಿಪಡಿಸಿ ಪೈಲಟ್ ಮಾಡುವುದು ಹೇಗೆ ಎಂಬುದನ್ನು ವಿವರಿಸಿ.",
      feasibilityPlaceholder:
        "ನಿಮ್ಮ 90 ದಿನಗಳ ಅನುಷ್ಠಾನ ಮತ್ತು ಪೈಲಟ್ ಯೋಜನೆಯನ್ನು ವಿವರಿಸಿ...",

      resources: "4. ಅಗತ್ಯವಿರುವ ಸಂಪನ್ಮೂಲಗಳು *",
      resourcesHint:
        "ಅನುಷ್ಠಾನಕ್ಕೆ ಅಗತ್ಯವಿರುವ ಸಂಪನ್ಮೂಲಗಳು, ಮೂಲಸೌಕರ್ಯ, ತಂತ್ರಜ್ಞಾನ ಅಥವಾ ಬೆಂಬಲವನ್ನು ಉಲ್ಲೇಖಿಸಿ.",
      resourcesPlaceholder:
        "ಅನುಷ್ಠಾನಕ್ಕೆ ಅಗತ್ಯವಿರುವ ಸಂಪನ್ಮೂಲಗಳನ್ನು ಪಟ್ಟಿ ಮಾಡಿ...",

      selectedBanner: "ಆಯ್ಕೆ ಮಾಡಲಾಗಿದೆ — ಗ್ರ್ಯಾಂಡ್ ಫೈನಲಿಸ್ಟ್",
      submittedTitle: "ರೌಂಡ್ 2 ಡೋಸಿಯರ್ ಸಲ್ಲಿಸಲಾಗಿದೆ",
      update:
        "ರೌಂಡ್ 2 ಡೋಸಿಯರ್ ಅನ್ನು ಡೇಟಾಬೇಸ್ನಲ್ಲಿ ನವೀಕರಿಸಿ",
      submit:
        "ಸಂಪೂರ್ಣ ರೌಂಡ್ 2 ಡೋಸಿಯರ್ ಅನ್ನು ಡೇಟಾಬೇಸ್ಗೆ ಸಲ್ಲಿಸಿ",
    },

    toast: {
      maxTeammates:
        "ಗರಿಷ್ಠ 3 ಹೆಚ್ಚುವರಿ ತಂಡದ ಸದಸ್ಯರನ್ನು ಮಾತ್ರ ಸೇರಿಸಬಹುದು (ನಾಯಕ + 3 ಸದಸ್ಯರು).",
      teamCreated: (name) =>
        `"${name}" ತಂಡವನ್ನು ಯಶಸ್ವಿಯಾಗಿ ರಚಿಸಲಾಗಿದೆ!`,
      teamCreationFailed: "ತಂಡವನ್ನು ರಚಿಸಲು ವಿಫಲವಾಗಿದೆ.",
      r1AlreadySubmitted:
        "ರೌಂಡ್ 1 ಈಗಾಗಲೇ ಸಲ್ಲಿಸಲಾಗಿದೆ.",
      problemTooLong: (count) =>
        `ಸಮಸ್ಯೆಯ ಹೇಳಿಕೆಯು ಪದಗಳ ಮಿತಿಯನ್ನು ಮೀರಿದೆ (${count} ಪದಗಳು).`,
      solutionTooLong: (count) =>
        `ಪ್ರಸ್ತಾವಿತ ತಾಂತ್ರಿಕ ಪರಿಹಾರವು ಪದಗಳ ಮಿತಿಯನ್ನು ಮೀರಿದೆ (${count} ಪದಗಳು).`,
      r1Submitted:
        "ರೌಂಡ್ 1 ಪ್ರಸ್ತಾವನೆಯನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಸಲ್ಲಿಸಲಾಗಿದೆ!",
      r1SubmissionFailed:
        "ರೌಂಡ್ 1 ಪ್ರಸ್ತಾವನೆಯನ್ನು ಸಲ್ಲಿಸಲು ವಿಫಲವಾಗಿದೆ.",

      r2Locked:
        "ರೌಂಡ್ 2 ಪ್ರಸ್ತುತ ಲಾಕ್ ಆಗಿದೆ.",
      conceptTooLong: (count) =>
        `ವಿವರವಾದ ಪರಿಕಲ್ಪನೆಯು ಪದಗಳ ಮಿತಿಯನ್ನು ಮೀರಿದೆ (${count} ಪದಗಳು).`,
      valueTooLong: (count) =>
        `ಮೌಲ್ಯ ಪ್ರಸ್ತಾವನೆ ಮತ್ತು ಸರ್ಕ್ಯುಲಾರಿಟಿಯು ಪದಗಳ ಮಿತಿಯನ್ನು ಮೀರಿದೆ (${count} ಪದಗಳು).`,
      feasibilityTooLong: (count) =>
        `90 ದಿನಗಳ ಕಾರ್ಯಸಾಧ್ಯತಾ ಯೋಜನೆಯು ಪದಗಳ ಮಿತಿಯನ್ನು ಮೀರಿದೆ (${count} ಪದಗಳು).`,
      resourceTooLong: (count) =>
        `ಅಗತ್ಯವಿರುವ ಸಂಪನ್ಮೂಲಗಳು ಪದಗಳ ಮಿತಿಯನ್ನು ಮೀರಿವೆ (${count} ಪದಗಳು).`,
      r2Submitted:
        "ರೌಂಡ್ 2 ಡೋಸಿಯರ್ ಅನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಸಲ್ಲಿಸಲಾಗಿದೆ!",
      r2SubmissionFailed:
        "ರೌಂಡ್ 2 ಡೋಸಿಯರ್ ಸಲ್ಲಿಸಲು ವಿಫಲವಾಗಿದೆ.",
    },
  },
};

export default function ParticipantPage() {
  const { user, token, showToast, lang } = useAuth();
  const tx = translations[lang] || translations.en;
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

    const schedule = res.data?.schedule || null;

    if (res.ok && schedule && schedule.status === 'SCHEDULED') {
      setFinalistPass(schedule);
    } else {
      setFinalistPass(null);
    }
  };

  const addMemberRow = () => {
    if (members.length >= 3) {
      showToast(tx.toast.maxTeammates, true);
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
      showToast(tx.toast.teamCreated(teamName));
      await loadMyTeam();
      setActiveTab('r1');
    } else {
      showToast(res.message || tx.toast.teamCreationFailed, true);
    }
  };

  const handleR1Submit = async (e) => {
    e.preventDefault();

    if (
      team?.round1Status === 'SUBMITTED' ||
      team?.round1Status === 'SELECTED'
    ) {
      showToast(tx.toast.r1AlreadySubmitted, true);
      return;
    }

    const problemWords = countWords(r1Problem);
    const solutionWords = countWords(r1Solution);

    if (problemWords > 150) {
      showToast(tx.toast.problemTooLong(problemWords), true);
      return;
    }
    if (solutionWords > 250) {
      showToast(tx.toast.solutionTooLong(solutionWords), true);
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
      showToast(tx.toast.r1Submitted);
      await loadMyTeam();
      await loadRound1Data();
    } else {
      showToast(res.message || tx.toast.r1SubmissionFailed, true);
    }
  };

  const handleR2Submit = async (e) => {
    e.preventDefault();

    // Prevent editing after Round 2 has been submitted/evaluated
    if (
      ['SUBMITTED', 'UNDER_EVALUATION', 'SELECTED', 'NOT_SELECTED']
        .includes(team?.round2Status)
    ) {
      showToast(tx.toast.r2Locked, true);
      return;
    }

    const conceptWords = countWords(r2Data.detailedConcept);
    const valPropWords = countWords(r2Data.valuePropositionAndCircularity);
    const feasibilityWords = countWords(r2Data.feasibilityPlan90Days);
    const resourceWords = countWords(r2Data.resourceRequirements);

    if (conceptWords > 1000) {
      showToast(tx.toast.conceptTooLong(conceptWords), true);
      return;
    }
    if (valPropWords > 150) {
      showToast(tx.toast.valueTooLong(valPropWords), true);
      return;
    }
    if (feasibilityWords > 200) {
      showToast(tx.toast.feasibilityTooLong(feasibilityWords), true);
      return;
    }
    if (resourceWords > 100) {
      showToast(tx.toast.resourceTooLong(resourceWords), true);
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
      showToast(tx.toast.r2Submitted);
      await loadMyTeam();
      await loadRound2Data();
    } else {
      showToast(res.message || tx.toast.r2SubmissionFailed, true);
    }
  };

  const r2IsLocked = [
    'SUBMITTED',
    'UNDER_EVALUATION',
    'SELECTED',
    'NOT_SELECTED'
  ].includes(team?.round2Status);

  const r2IsFinalist = team?.round2Status === 'SELECTED';

  const r2IsRejected = team?.round2Status === 'NOT_SELECTED';

  const r2IsUnderEvaluation =
    team?.round2Status === 'SUBMITTED' ||
    team?.round2Status === 'UNDER_EVALUATION';

  const isR1Locked =
    team?.round1Status === 'SUBMITTED' ||
    team?.round1Status === 'SELECTED';

  const isR2Unlocked =
    team?.round1Status === 'SELECTED';

  return (
    <div className="portal-container participant-portal-wrap">
      {/* HEADER */}
      <div className="portal-header">
        <div>
          <h1 className="portal-title">{tx.header.title}</h1>
          <p className="portal-subtitle">
            {tx.header.teamLeader}: <strong>{user?.name}</strong> ({user?.email}) • {tx.header.event}
          </p>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={loadData}>
          <RefreshCw size={14} /> {tx.header.refresh}
        </button>
      </div>

      {/* PROGRESS TRACKER */}
      <div className="tracker-box">
        <div className={`tracker-node ${team ? 'done' : 'current'}`}>
          <div className="tracker-bubble">{team ? '✓' : '1'}</div>
          <div className="tracker-info">
            <strong>{tx.progress.teamLeader}</strong>
            <span>{team ? team.teamName : tx.progress.registerTeam}</span>
          </div>
        </div>

        <div className={`tracker-connector ${team ? 'done' : ''}`}></div>

        <div className={`tracker-node ${team?.round1Status === 'SELECTED' ? 'done' : team?.round1Status === 'SUBMITTED' ? 'current' : ''}`}>
          <div className="tracker-bubble">{team?.round1Status === 'SELECTED' ? '✓' : '2'}</div>
          <div className="tracker-info">
            <strong>{tx.progress.round1}</strong>
            <span>{team?.round1Status === 'SELECTED' ? tx.progress.selected : team?.round1Status || tx.progress.draft}</span>
          </div>
        </div>

        <div className={`tracker-connector ${team?.round1Status === 'SELECTED' ? 'done' : ''}`}></div>

        <div
          className={`tracker-node ${
            team?.finalStatus === 'FINALIST'
              ? 'done'
              : team?.round1Status === 'SELECTED'
              ? 'current'
              : ''
          }`}
        >
          <div className="tracker-bubble">
            {team?.finalStatus === 'FINALIST' ? '✓' : '3'}
          </div>

          <div className="tracker-info">
            <strong>{tx.progress.round2}</strong>

            <span>
              {team?.round1Status !== 'SELECTED'
                ? tx.progress.locked
                : r2IsFinalist
                ? tx.progress.selected
                : r2IsRejected
                ? tx.progress.notSelected
                : r2IsUnderEvaluation
                ? tx.progress.submitted
                : tx.progress.unlocked}
            </span>
          </div>
        </div>

        <div className={`tracker-connector ${team?.finalStatus === 'FINALIST' ? 'done' : ''}`}></div>

        <div className={`tracker-node ${team?.finalStatus === 'FINALIST' ? 'done' : ''}`}>
          <div className="tracker-bubble">🏆</div>
          <div className="tracker-info">
            <strong>{tx.progress.grandFinale}</strong>
            <span>{team?.finalStatus === 'FINALIST' ? tx.progress.stagePassReady : tx.progress.pending}</span>
          </div>
        </div>
      </div>

      {/* GRAND FINALIST STAGE PASS (If qualified) */}
      {finalistPass && (
        <div className="finalist-pass">
          <div className="pass-icon">🏆</div>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#b45309', textTransform: 'uppercase', letterSpacing: '1px' }}>
              {tx.finalist.title}
            </span>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', fontWeight: 800, color: '#92400e', margin: '4px 0' }}>
              {tx.finalist.congratulations(team?.teamName || '')}
            </h3>
            <p style={{ color: '#78350f', fontSize: '13px', marginBottom: '12px' }}>
              {tx.finalist.message}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
              <div style={{ background: '#ffffff', padding: '10px 14px', borderRadius: '8px', border: '1px solid #fde68a' }}>
                <strong style={{ fontSize: '10px', color: '#b45309', display: 'block', marginBottom: '2px' }}>{tx.finalist.venue}</strong>
                <span style={{ fontWeight: 600, color: '#78350f' }}>{finalistPass.venue || tx.finalist.defaultVenue}</span>
              </div>
              <div style={{ background: '#ffffff', padding: '10px 14px', borderRadius: '8px', border: '1px solid #fde68a' }}>
                <strong style={{ fontSize: '10px', color: '#b45309', display: 'block', marginBottom: '2px' }}>{tx.finalist.slot}</strong>
                <span style={{ fontWeight: 600, color: '#78350f' }}>{finalistPass.startTime || tx.finalist.defaultTime} ({finalistPass.presentationDuration || '15 min'})</span>
              </div>
              <div style={{ background: '#ffffff', padding: '10px 14px', borderRadius: '8px', border: '1px solid #fde68a' }}>
                <strong style={{ fontSize: '10px', color: '#b45309', display: 'block', marginBottom: '2px' }}>{tx.finalist.date}</strong>
                <span style={{ fontWeight: 600, color: '#78350f' }}>{finalistPass.eventDate ? new Date(finalistPass.eventDate).toLocaleDateString() : tx.finalist.defaultDate}</span>
              </div>
              <div style={{ background: '#ffffff', padding: '10px 14px', borderRadius: '8px', border: '1px solid #fde68a' }}>
                <strong style={{ fontSize: '10px', color: '#b45309', display: 'block', marginBottom: '2px' }}>{tx.finalist.instructions}</strong>
                <span style={{ fontWeight: 600, color: '#78350f' }}>{finalistPass.instructions || tx.finalist.defaultInstructions}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TABS */}
      <div className="tab-bar">
        <button className={`tab-btn ${activeTab === 'team' ? 'active' : ''}`} onClick={() => setActiveTab('team')}>
          {tx.tabs.teamHub}
        </button>
        <button className={`tab-btn ${activeTab === 'r1' ? 'active' : ''}`} onClick={() => setActiveTab('r1')}>
          {tx.tabs.round1}
        </button>
        <button className={`tab-btn ${activeTab === 'r2' ? 'active' : ''}`} onClick={() => setActiveTab('r2')}>
          {isR2Unlocked ? tx.tabs.round2 : tx.tabs.round2Locked}
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
                      <Tag size={12} /> {team.theme?.name || tx.team.generalInnovation}
                    </span>
                  </div>
                  <h2 className="team-hub-title">{team.teamName}</h2>
                </div>
                <span className={`badge ${team.finalStatus === 'FINALIST' ? 'FINALIST' : team.round1Status || 'DRAFT'}`}>
                  {team.finalStatus === 'FINALIST' ? `🏆 ${tx.team.finalist}` : team.round1Status || tx.team.draft}
                </span>
              </div>

              <div className="grid-2 participant-roster-grid">
                <div className="roster-card leader-card">
                  <div className="roster-card-header">
                    <span className="roster-badge leader-badge">👑 {tx.team.leader}</span>
                    <span className="roster-auth-tag">{tx.team.primaryAccount}</span>
                  </div>
                  <div className="roster-card-body">
                    <h3 className="roster-name">{team.leader?.name || user?.name}</h3>
                    <div className="roster-contact-item">
                      <Mail size={14} /> <span>{team.leader?.email || user?.email}</span>
                    </div>
                    <div className="roster-contact-item">
                      <Phone size={14} /> <span>{team.leader?.phone || user?.phone || tx.team.notProvided}</span>
                    </div>
                  </div>
                </div>

                <div className="roster-card members-card">
                  <div className="roster-card-header">
                    <span className="roster-badge member-badge">👥 {tx.team.members}</span>
                    <span className="roster-count">{team.members?.length || 0} {tx.team.additional}</span>
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
                          <strong>{tx.team.soloTitle}</strong>
                          <p>{tx.team.soloDescription}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="team-hub-action-bar">
                <button className="btn btn-primary" onClick={() => setActiveTab('r1')}>
                  {tx.team.proceedRound1} <ArrowRight size={16} />
                </button>
              </div>
            </div>
          ) : (
            <div className="light-card participant-card">
              <div className="team-create-header">
                <h2 className="pitch-form-title">
                  👥 {tx.createTeam.title}
                </h2>
                <p className="pitch-form-subtitle">
                  {tx.createTeam.subtitle}
                </p>
              </div>

              <form onSubmit={handleCreateTeam}>
                <div className="grid-2" style={{ marginBottom: '20px' }}>
                  <div className="form-group pitch-form-group">
                    <label className="pitch-label">{tx.createTeam.teamName}</label>
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
                    <label className="pitch-label">{tx.createTeam.theme}</label>
                    <select
                      className="pitch-input select-styled"
                      value={selectedTheme}
                      onChange={(e) => setSelectedTheme(e.target.value)}
                      required
                    >
                      <option value="">{tx.createTeam.selectTheme}</option>
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
                      {tx.createTeam.teammates}
                    </h4>
                    <span style={{ fontSize: '12px', color: 'var(--green2)', fontWeight: 700 }}>
                      {tx.createTeam.solo}
                    </span>
                  </div>
                  <p style={{ color: 'var(--muted)', fontSize: '12.5px', marginTop: '3px' }}>
                    {tx.createTeam.explanation}
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
                        {tx.createTeam.remove}
                      </button>
                    </div>

                    <div className="grid-2" style={{ gap: '12px' }}>
                      <input
                        type="text"
                        className="pitch-input"
                        placeholder={tx.createTeam.memberName(idx + 1)}
                        value={m.name}
                        onChange={(e) => updateMember(idx, 'name', e.target.value)}
                        required
                      />
                      <input
                        type="email"
                        className="pitch-input"
                        placeholder={tx.createTeam.email}
                        value={m.email}
                        onChange={(e) => updateMember(idx, 'email', e.target.value)}
                        required
                      />
                      <input
                        type="tel"
                        className="pitch-input"
                        placeholder={tx.createTeam.phone}
                        value={m.phone}
                        onChange={(e) => updateMember(idx, 'phone', e.target.value)}
                        required
                      />
                      <input
                        type="text"
                        className="pitch-input"
                        placeholder={tx.createTeam.role}
                        value={m.roleInTeam}
                        onChange={(e) => updateMember(idx, 'roleInTeam', e.target.value)}
                      />
                    </div>
                  </div>
                ))}

                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '20px' }}>
                  {members.length < 3 && (
                    <button type="button" className="btn btn-secondary btn-sm" onClick={addMemberRow}>
                      {tx.createTeam.add}
                    </button>
                  )}
                  {members.length === 0 && (
                    <span style={{ fontSize: '12.5px', color: 'var(--muted)' }}>
                      {tx.createTeam.noMembers}
                    </span>
                  )}
                </div>

                <button type="submit" className="btn btn-primary pitch-submit-btn">
                  {tx.createTeam.create} <ArrowRight size={16} />
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
                <span className="round-badge">{tx.round1.stage}</span>
                <span className="round-subbadge">{tx.round1.maxWords}</span>
              </div>
              <h2 className="pitch-form-title">
                💡 {tx.round1.title}
              </h2>
              <p className="pitch-form-subtitle">
                {tx.round1.subtitle}
              </p>
            </div>
            <span className={`badge ${team?.round1Status || (r1Submission ? r1Submission.status : 'NOT_SUBMITTED')}`}>
              {team?.round1Status === 'SELECTED' ? `🔒 ${tx.round1.selected} (${tx.round1.locked.toUpperCase()})` : (r1Submission ? r1Submission.status : 'NOT SUBMITTED')}
            </span>
          </div>

          {team?.round1Status === 'SELECTED' && (
            <div className="selected-locked-banner">
              <div>
                <strong>🔒 {tx.round1.lockedBanner}</strong>
                <p>
                  {tx.round1.congratulations} Your team has been <strong>{tx.round1.selected}</strong> for Round 2.
                </p>
              </div>
              <button
                type="button"
                className="btn btn-sm btn-primary"
                onClick={() => setActiveTab('r2')}
              >
                {tx.round1.goToRound2}
              </button>
            </div>
          )}

          <form onSubmit={handleR1Submit} className="pitch-form">
            {/* 1. CHALLENGE THEME (READ-ONLY) */}
            <div className="form-group pitch-form-group">
              <label className="pitch-label">
                1. {tx.round1.challengeTheme}
              </label>

              <div
                className="pitch-input"
                style={{
                  background: '#f8fafc',
                  color: '#334155',
                  cursor: 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontWeight: 600,
                }}
              >
                <Tag size={16} />
                {team?.theme?.name || tx.round1.themeUnavailable}
              </div>

              <p className="form-hint">
                {tx.round1.themeNote}
              </p>
            </div>

            {/* Coastal Areas Focus Guideline Notice */}
            <div
              style={{
                background: 'linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%)',
                border: '1.5px solid #6ee7b7',
                borderRadius: '12px',
                padding: '14px 18px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                boxShadow: '0 2px 6px rgba(16, 185, 129, 0.08)',
              }}
            >
              <div
                style={{
                  fontSize: '22px',
                  background: '#d1fae5',
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                🌊
              </div>
              <div
                style={{
                  fontSize: '13.5px',
                  fontWeight: 700,
                  color: '#065f46',
                  lineHeight: 1.5,
                }}
              >
                {tx.round1.coastalFocusNotice}
              </div>
            </div>

            {/* 2. PROBLEM STATEMENT (MAX 150 WORDS) */}
            <div className="form-group pitch-form-group">
              <div className="pitch-label-row">
                <label className="pitch-label">
                  {tx.round1.problem} {isR1Locked && `(${tx.round1.locked})`}
                </label>
                <span
                  className={`word-counter-pill ${countWords(r1Problem) > 150 ? 'exceeded' : countWords(r1Problem) > 130 ? 'warning' : ''
                    }`}
                >
                  {countWords(r1Problem)} / 150 {tx.round1.words}
                </span>
              </div>
              <p className="form-hint">{tx.round1.problemHint}</p>
              <textarea
                rows={5}
                value={r1Problem}
                onChange={(e) => setR1Problem(e.target.value)}
                placeholder={tx.round1.problemPlaceholder}
                disabled={isR1Locked}
                className="pitch-textarea"
                style={
                  isR1Locked
                    ? {
                        background: '#f8fafc',
                        cursor: 'not-allowed',
                        color: '#334155',
                      }
                    : {}
                }
                required
              />
            </div>

            {/* 3. PROPOSED SOLUTION (MAX 250 WORDS) */}
            <div className="form-group pitch-form-group">
              <div className="pitch-label-row">
                <label className="pitch-label">
                  {tx.round1.solution} {isR1Locked && `(${tx.round1.locked})`}
                </label>
                <span
                  className={`word-counter-pill ${countWords(r1Solution) > 250 ? 'exceeded' : countWords(r1Solution) > 220 ? 'warning' : ''
                    }`}
                >
                  {countWords(r1Solution)} / 250 {tx.round1.words}
                </span>
              </div>
              <p className="form-hint">{tx.round1.solutionHint}</p>
              <textarea
                rows={6}
                value={r1Solution}
                onChange={(e) => setR1Solution(e.target.value)}
                placeholder={tx.round1.solutionPlaceholder}
                disabled={isR1Locked}
                className="pitch-textarea"
                style={
                  isR1Locked
                    ? {
                        background: '#f8fafc',
                        cursor: 'not-allowed',
                        color: '#334155',
                      }
                    : {}
                }
                required
              />
            </div>

            {team?.round1Status === 'SELECTED' ? (
              <button
                type="button"
                className="btn btn-primary pitch-submit-btn"
                onClick={() => setActiveTab('r2')}
              >
                🚀 {tx.round1.goToRound2}
              </button>
            ) : team?.round1Status === 'SUBMITTED' ? (
              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  borderRadius: '12px',
                  padding: '16px',
                  color: '#334155',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <Lock size={20} />

                <div>
                  <strong>{tx.round1.submittedTitle}</strong>
                  <p style={{ margin: '4px 0 0', fontSize: '13px' }}>
                    {tx.round1.submittedDescription}
                  </p>
                </div>
              </div>
            ) : (
              <button
                type="submit"
                className="btn btn-primary pitch-submit-btn"
              >
                🚀 {tx.round1.submit}
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
                {tx.round2.lockedTitle}
              </h3>
              <p style={{ color: 'var(--muted)', maxWidth: '520px', margin: '0 auto 16px auto', fontSize: '14px', lineHeight: 1.6 }}>
                {tx.round2.lockedDescription}
              </p>
              <div style={{ background: '#ecfdf5', color: '#065f46', padding: '8px 18px', borderRadius: '20px', display: 'inline-block', fontSize: '12.5px', fontWeight: 600 }}>
                💡 {tx.round2.lockedNote}
              </div>
            </div>
          ) : (
            <div className="light-card participant-card">
              <div className="pitch-form-header">
                <div>
                  <div className="pitch-badge-row">
                    <span className="round-badge round-badge-blue">{tx.round2.stage}</span>
                    <span className="round-subbadge">Deep-Dive Dossier</span>
                  </div>
                  <h2 className="pitch-form-title">
                    🚀 {tx.round2.title}
                  </h2>
                  <p className="pitch-form-subtitle">
                    {tx.round2.subtitle}
                  </p>
                </div>
                <span
                  className={`badge ${
                    r2IsFinalist
                      ? 'SELECTED'
                      : r2IsRejected
                      ? 'NOT_SELECTED'
                      : r2IsLocked
                      ? 'SUBMITTED'
                      : 'SELECTED'
                  }`}
                >
                  {r2IsFinalist
                    ? tx.round2.selectedLocked
                    : r2IsRejected
                    ? tx.round2.notSelected
                    : r2IsLocked
                    ? tx.round2.submittedLocked
                    : tx.round2.unlocked}
                </span>
              </div>

              {r2IsFinalist && (
                <div
                  style={{
                    background: '#ecfdf5',
                    border: '1px solid #a7f3d0',
                    color: '#065f46',
                    padding: '16px 18px',
                    borderRadius: '10px',
                    marginBottom: '18px',
                  }}
                >
                  <strong>
                    🏆 {tx.round2.selectedBanner}
                  </strong>

                  <div style={{ marginTop: '5px', fontSize: '13px' }}>
                    Your Round 2 dossier is now locked and cannot be edited.
                  </div>
                </div>
              )}

              {r2IsRejected && (
                <div
                  style={{
                    background: '#fef2f2',
                    border: '1px solid #fecaca',
                    color: '#991b1b',
                    padding: '16px 18px',
                    borderRadius: '10px',
                    marginBottom: '18px',
                  }}
                >
                  <strong>Round 2 evaluation is complete.</strong>

                  <div style={{ marginTop: '5px', fontSize: '13px' }}>
                    Your team was not selected for the Grand Finale. Your submitted dossier is locked.
                  </div>
                </div>
              )}

              {r2IsUnderEvaluation && (
                <div
                  style={{
                    background: '#eff6ff',
                    border: '1px solid #bfdbfe',
                    color: '#1e40af',
                    padding: '16px 18px',
                    borderRadius: '10px',
                    marginBottom: '18px',
                  }}
                >
                  <strong>🔒 {tx.round2.submittedTitle}</strong>

                  <div style={{ marginTop: '5px', fontSize: '13px' }}>
                    Your submission is locked while it is being evaluated by the judging panel.
                  </div>
                </div>
              )}

              <form onSubmit={handleR2Submit} className="pitch-form">
                {/* 1. DETAILED CONCEPT (MAX 1000 WORDS) */}
                <div className="form-group pitch-form-group">
                  <div className="pitch-label-row">
                    <label className="pitch-label">{tx.round2.detailedConcept} (Max 1000 words)</label>
                    <span
                      className={`word-counter-pill ${
                        countWords(r2Data.detailedConcept) > 1000
                          ? 'exceeded'
                          : countWords(r2Data.detailedConcept) > 850
                          ? 'warning'
                          : ''
                      }`}
                    >
                      {countWords(r2Data.detailedConcept)} / 1000 words
                    </span>
                  </div>
                  <p className="form-hint">{tx.round2.detailedConceptHint}</p>
                  <textarea
                    rows={8}
                    className="pitch-textarea"
                    value={r2Data.detailedConcept}
                    onChange={(e) => setR2Data({ ...r2Data, detailedConcept: e.target.value })}
                    placeholder={tx.round2.detailedConceptPlaceholder}
                    required
                    disabled={r2IsLocked}
                    style={
                      r2IsLocked
                        ? {
                            background: '#f8fafc',
                            cursor: 'not-allowed',
                            color: '#334155',
                          }
                        : {}
                    }
                  />
                </div>

                {/* 2. VALUE PROPOSITION AND CIRCULARITY (MAX 150 WORDS) */}
                <div className="form-group pitch-form-group">
                  <div className="pitch-label-row">
                    <label className="pitch-label">{tx.round2.valueProposition} (Max 150 words)</label>
                    <span
                      className={`word-counter-pill ${
                        countWords(r2Data.valuePropositionAndCircularity) > 150
                          ? 'exceeded'
                          : countWords(r2Data.valuePropositionAndCircularity) > 130
                          ? 'warning'
                          : ''
                      }`}
                    >
                      {countWords(r2Data.valuePropositionAndCircularity)} / 150 words
                    </span>
                  </div>
                  <p className="form-hint">{tx.round2.valuePropositionHint}</p>
                  <textarea
                    rows={4}
                    className="pitch-textarea"
                    value={r2Data.valuePropositionAndCircularity}
                    onChange={(e) => setR2Data({ ...r2Data, valuePropositionAndCircularity: e.target.value })}
                    placeholder={tx.round2.valuePropositionPlaceholder}
                    required
                    disabled={r2IsLocked}
                    style={
                      r2IsLocked
                        ? {
                            background: '#f8fafc',
                            cursor: 'not-allowed',
                            color: '#334155',
                          }
                        : {}
                    }
                  />
                </div>

                {/* 3. 90 DAYS FEASIBILITY PLAN (MAX 200 WORDS) */}
                <div className="form-group pitch-form-group">
                  <div className="pitch-label-row">
                    <label className="pitch-label">{tx.round2.feasibility} (Max 200 words)</label>
                    <span
                      className={`word-counter-pill ${
                        countWords(r2Data.feasibilityPlan90Days) > 200
                          ? 'exceeded'
                          : countWords(r2Data.feasibilityPlan90Days) > 175
                          ? 'warning'
                          : ''
                      }`}
                    >
                      {countWords(r2Data.feasibilityPlan90Days)} / 200 words
                    </span>
                  </div>
                  <p className="form-hint">{tx.round2.feasibilityHint}</p>
                  <textarea
                    rows={4}
                    className="pitch-textarea"
                    value={r2Data.feasibilityPlan90Days}
                    onChange={(e) => setR2Data({ ...r2Data, feasibilityPlan90Days: e.target.value })}
                    placeholder={tx.round2.feasibilityPlaceholder}
                    required
                    disabled={r2IsLocked}
                    style={
                      r2IsLocked
                        ? {
                            background: '#f8fafc',
                            cursor: 'not-allowed',
                            color: '#334155',
                          }
                        : {}
                    }
                  />
                </div>

                {/* 4. RESOURCE REQUIREMENT (MAX 100 WORDS) */}
                <div className="form-group pitch-form-group">
                  <div className="pitch-label-row">
                    <label className="pitch-label">{tx.round2.resources} (Max 100 words)</label>
                    <span
                      className={`word-counter-pill ${
                        countWords(r2Data.resourceRequirements) > 100
                          ? 'exceeded'
                          : countWords(r2Data.resourceRequirements) > 85
                          ? 'warning'
                          : ''
                      }`}
                    >
                      {countWords(r2Data.resourceRequirements)} / 100 words
                    </span>
                  </div>
                  <p className="form-hint">{tx.round2.resourcesHint}</p>
                  <textarea
                    rows={3}
                    className="pitch-textarea"
                    value={r2Data.resourceRequirements}
                    onChange={(e) => setR2Data({ ...r2Data, resourceRequirements: e.target.value })}
                    placeholder={tx.round2.resourcesPlaceholder}
                    required
                    disabled={r2IsLocked}
                    style={
                      r2IsLocked
                        ? {
                            background: '#f8fafc',
                            cursor: 'not-allowed',
                            color: '#334155',
                          }
                        : {}
                    }
                  />
                </div>

                {team?.round2Status === 'SELECTED' ? (
                  <div
                    style={{
                      background: '#ecfdf5',
                      border: '1px solid #a7f3d0',
                      borderRadius: '12px',
                      padding: '16px',
                      color: '#065f46',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                    }}
                  >
                    <span style={{ fontSize: '20px' }}>🏆</span>

                    <div>
                      <strong>{tx.round2.selectedBanner}</strong>
                      <p style={{ margin: '4px 0 0', fontSize: '13px' }}>
                        Congratulations! Your Round 2 dossier has been selected for the Grand Finale.
                      </p>
                    </div>
                  </div>
                ) : team?.round2Status === 'SUBMITTED' ? (
                  <div
                    style={{
                      background: '#f8fafc',
                      border: '1px solid #cbd5e1',
                      borderRadius: '12px',
                      padding: '16px',
                      color: '#334155',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                    }}
                  >
                    <Lock size={20} />

                    <div>
                      <strong>{tx.round2.submittedTitle}</strong>
                      <p style={{ margin: '4px 0 0', fontSize: '13px' }}>
                        Your dossier is locked and is currently under review.
                        You cannot edit it unless the submission is reopened by the organizers.
                      </p>
                    </div>
                  </div>
                ) : !r2IsLocked ? (
                  <button type="submit" className="btn btn-primary pitch-submit-btn">
                    {r2Submission ? `💾 ${tx.round2.update}` : `🚀 ${tx.round2.submit}`}
                  </button>
                ) : null}
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
