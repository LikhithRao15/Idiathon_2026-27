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

const participantTranslations = {
  en: {
    headerTitle: '🌱 Idea Pitching & Submission Portal',
    headerSubtitleLeader: 'Team Leader:',
    headerSubtitleEvent: 'Hasiru Samvadha Ideathon 2026',
    refreshBtn: 'Refresh Status',
    trackerTeam: '1. Team & Leader',
    trackerRegTeam: 'Register Team',
    trackerR1: '2. Round 1 Pitch',
    trackerDraft: 'Draft',
    trackerSelected: 'Selected ✓',
    trackerR2: '3. Round 2 Elaboration',
    trackerUnlocked: 'Unlocked',
    trackerLocked: 'Locked',
    trackerSubmitted: 'Submitted ✓',
    trackerFinale: '4. Grand Finale',
    trackerStageReady: 'Stage Pass Ready',
    trackerPending: 'Pending',
    passBadge: 'OFFICIAL GRAND FINALE STAGE PASS',
    passCongrats: 'Congratulations,',
    passDesc: 'Your team has been selected by the Jury as a Grand Finalist. Here are your auditorium presentation slot details:',
    passVenue: 'STAGE / VENUE',
    passTime: 'SLOT TIME',
    passDate: 'DATE',
    passInstructions: 'INSTRUCTIONS',
    tab1: '👥 1. Team Hub & Theme',
    tab2: '💡 2. Round 1: Idea Pitch',
    tab3: '🔒 3. Round 2: Idea Elaboration',
    teamSelectedTheme: 'Selected Theme:',
    generalInnovation: 'General Innovation',
    teamLeaderBadge: '👑 Team Leader',
    primaryAccount: 'Primary Account',
    notProvided: 'Not provided',
    teamMembersBadge: '👥 Team Members',
    additionalMembers: 'additional',
    soloInnovator: 'Solo Innovator Submission',
    soloDesc: 'Participating as a 1-person team (Leader only).',
    proceedToR1: 'Proceed to Round 1 Idea Pitch',
    registerTeamTitle: '👥 Register Your Team',
    registerTeamSubtitle: 'Only the team leader registers this team. Teammates do not need to register separate accounts.',
    teamNameLabel: 'Team Name *',
    teamNamePh: 'e.g. EcoTransformers',
    selectThemeLabel: 'Select Challenge Theme *',
    selectThemeOption: 'Select a Theme...',
    teammatesTitle: 'Teammates (Optional)',
    soloWelcome: 'Solo innovators (1 person = Leader only) are welcome!',
    soloHint: 'If you are participating alone, you can skip adding teammates and submit directly.',
    teammateNumber: 'Teammate #',
    removeBtn: '✕ Remove',
    memberNamePh: 'Full Name *',
    memberEmailPh: 'Email *',
    memberPhonePh: 'Phone *',
    memberRolePh: 'Role (e.g. Embedded Developer)',
    addTeammateBtn: '+ Add Teammate (Optional)',
    noAdditionalMembers: 'No additional members added (Proceeding as a 1-person team)',
    createTeamSubmit: 'Create Team & Unlock Round 1 Pitching',
    r1StageBadge: 'STAGE 01',
    r1MaxWords: 'Max 400 Total Words',
    r1Title: '💡 Round 1: Idea Pitch Proposal',
    r1Subtitle: 'Select your focus theme, articulate the root problem statement (max 150 words), and detail your proposed intervention (max 250 words).',
    r1LockedVerified: '🔒 Round 1 Proposal Locked & Verified',
    r1LockedDesc: 'Congratulations! Your team has been SELECTED for Round 2. Your Round 1 Problem Statement and Solution are locked.',
    goToR2: 'Go to Round 2 →',
    r1ThemeLabel: '1. Challenge Theme *',
    r1ThemeLocked: '(Locked)',
    r1ProblemLabel: '2. Problem Statement *',
    r1ProblemMax: '(Max 150 words)',
    r1ProblemHint: 'Describe the core pain point, affected demographic, and current inefficiencies.',
    r1ProblemPh: 'State the core problem (up to 150 words)...',
    r1SolutionLabel: '3. Proposed Technical Solution *',
    r1SolutionMax: '(Max 250 words)',
    r1SolutionHint: 'Explain the technical approach, AI/IoT/Hardware mechanism, and solution architecture.',
    r1SolutionPh: 'Explain your technical solution (up to 250 words)...',
    r1UpdateBtn: '💾 Update Round 1 Pitch in Database',
    r1SubmitBtn: '🚀 Submit Round 1 Proposal to Database',
    proceedToR2Btn: '🚀 Proceed to Round 2: Idea Elaboration →',
    r2LockedTitle: 'Round 2 is Currently Locked',
    r2LockedDesc: 'Round 2 is strictly unlocked after your Round 1 proposal is evaluated and marked as SELECTED by the judging panel.',
    r2LockedNote: '💡 Note: Round 2 will be automatically unlocked once your Round 1 proposal is evaluated and approved.',
    r2StageBadge: 'STAGE 02',
    r2DossierBadge: 'Deep-Dive Dossier',
    r2Title: '🚀 Round 2: Elaborating Your Idea',
    r2Subtitle: 'Deep-dive on the idea you entered in the first round across the 4 core dimensions.',
    r2UnlockedBadge: 'UNLOCKED',
    q1Label: '1. Detailed Concept * (Max 1000 words)',
    q1Hint: 'Comprehensive architectural breakdown, algorithmic components, system diagrams, and data flows.',
    q1Ph: 'Elaborate your full technical concept and design in depth (up to 1000 words)...',
    q2Label: '2. Value Proposition and Circularity * (Max 150 words)',
    q2Hint: 'Core value, circular economy impact, resource efficiency, and competitive differentiation.',
    q2Ph: 'Explain value proposition and circularity benefits (up to 150 words)...',
    q3Label: '3. 90 Days Feasibility Plan * (Max 200 words)',
    q3Hint: 'Month 1, Month 2, and Month 3 deliverables, prototype testing, pilot deployment roadmap.',
    q3Ph: 'Outline your 90-day implementation roadmap (up to 200 words)...',
    q4Label: '4. Resource Requirement * (Max 100 words)',
    q4Hint: 'Bill of materials, cloud computing, laboratory equipment, domain expertise, and budget breakdown.',
    q4Ph: 'List needed resources, hardware, and estimated costs (up to 100 words)...',
    r2UpdateBtn: '💾 Update Round 2 Dossier in Database',
    r2SubmitBtn: '🚀 Submit Full Round 2 Dossier to Database',
    wordsUnit: 'words',
  },
  kn: {
    headerTitle: '🌱 ಆಲೋಚನಾ ವೇದಿಕೆ & ಸಲ್ಲಿಕೆ ಪೋರ್ಟಲ್',
    headerSubtitleLeader: 'ತಂಡದ ಮುಖ್ಯಸ್ಥರು:',
    headerSubtitleEvent: 'ಹಸಿರು ಸಂವಾದ ಐಡಿಯಾಥಾನ್ ೨೦೨೬',
    refreshBtn: 'ಸ್ಥಿತಿ ನವೀಕರಿಸಿ',
    trackerTeam: '೧. ತಂಡ ಮತ್ತು ನಾಯಕ',
    trackerRegTeam: 'ತಂಡ ನೋಂದಣಿ',
    trackerR1: '೨. ಹಂತ ೧: ಆಲೋಚನೆ ಸಲ್ಲಿಕೆ',
    trackerDraft: 'ಕರಡು',
    trackerSelected: 'ಆಯ್ಕೆಯಾಗಿದೆ ✓',
    trackerR2: '೩. ಹಂತ ೨: ವಿವರಣೆ',
    trackerUnlocked: 'ಮುಕ್ತವಾಗಿದೆ',
    trackerLocked: 'ಲಾಕ್ ಆಗಿದೆ',
    trackerSubmitted: 'ಸಲ್ಲಿಸಲಾಗಿದೆ ✓',
    trackerFinale: '೪. ಗ್ರ್ಯಾಂಡ್ ಫಿನಾಲೆ',
    trackerStageReady: 'ವೇದಿಕೆ ಪಾಸ್ ಸಿದ್ಧ',
    trackerPending: 'ಬಾಕಿ ಇದೆ',
    passBadge: 'ಅಧಿಕೃತ ಗ್ರ್ಯಾಂಡ್ ಫಿನಾಲೆ ವೇದಿಕೆ ಪಾಸ್',
    passCongrats: 'ಅಭಿನಂದನೆಗಳು,',
    passDesc: 'ತೀರ್ಪುಗಾರರ ಮಂಡಳಿಯು ನಿಮ್ಮ ತಂಡವನ್ನು ಗ್ರ್ಯಾಂಡ್ ಫಿನಾಲೆಗೆ ಆಯ್ಕೆ ಮಾಡಿದೆ. ನಿಮ್ಮ ಪ್ರಸ್ತುತಿಯ ವಿವರಗಳು ಕೆಳಗಿವೆ:',
    passVenue: 'ವೇದಿಕೆ / ಸ್ಥಳ',
    passTime: 'ನಿಗದಿತ ಸಮಯ',
    passDate: 'ದಿನಾಂಕ',
    passInstructions: 'ಸೂಚನೆಗಳು',
    tab1: '👥 ೧. ತಂಡದ ವಿವರ & ವಿಷಯ',
    tab2: '💡 ೨. ಹಂತ ೧: ಆಲೋಚನೆ ಸಲ್ಲಿಕೆ',
    tab3: '🔒 ೩. ಹಂತ ೨: ವಿವರವಾದ ಯೋಜನೆ',
    teamSelectedTheme: 'ಆಯ್ಕೆಯಾದ ವಿಷಯ:',
    generalInnovation: 'ಸಾಮಾನ್ಯ ನಾವೀನ್ಯತೆ',
    teamLeaderBadge: '👑 ತಂಡದ ನಾಯಕರು',
    primaryAccount: 'ಮುಖ್ಯ ಖಾತೆ',
    notProvided: 'ನೀಡಲಾಗಿಲ್ಲ',
    teamMembersBadge: '👥 ತಂಡದ ಸದಸ್ಯರು',
    additionalMembers: 'ಹೆಚ್ಚುವರಿ ಸದಸ್ಯರು',
    soloInnovator: 'ಏಕವ್ಯಕ್ತಿ ನಾವೀನ್ಯತಾ ಸಲ್ಲಿಕೆ',
    soloDesc: '೧-ವ್ಯಕ್ತಿ ತಂಡವಾಗಿ ಭಾಗವಹಿಸುತ್ತಿದ್ದೀರಿ (ನಾಯಕರು ಮಾತ್ರ).',
    proceedToR1: 'ಹಂತ ೧: ಆಲೋಚನೆ ಸಲ್ಲಿಕೆಗೆ ಮುಂದುವರಿಯಿರಿ',
    registerTeamTitle: '👥 ನಿಮ್ಮ ತಂಡವನ್ನು ನೋಂದಾಯಿಸಿ',
    registerTeamSubtitle: 'ತಂಡದ ಒಬ್ಬ ಮುಖ್ಯಸ್ಥರು ಮಾತ್ರ ತಂಡವನ್ನು ನೋಂದಾಯಿಸುತ್ತಾರೆ. ಸದಸ್ಯರು ಪ್ರತ್ಯೇಕ ಖಾತೆ ರಚಿಸುವ ಅಗತ್ಯವಿಲ್ಲ.',
    teamNameLabel: 'ತಂಡದ ಹೆಸರು *',
    teamNamePh: 'ಉದಾ: ಹಸಿರು ತಂಡ',
    selectThemeLabel: 'ಸವಾಲಿನ ವಿಷಯವನ್ನು ಆಯ್ಕೆಮಾಡಿ *',
    selectThemeOption: 'ವಿಷಯವನ್ನು ಆರಿಸಿ...',
    teammatesTitle: 'ತಂಡದ ಸದಸ್ಯರು (ಐಚ್ಛಿಕ)',
    soloWelcome: 'ಏಕವ್ಯಕ್ತಿ (೧ ವ್ಯಕ್ತಿ = ನಾಯಕರು ಮಾತ್ರ) ಭಾಗವಹಿಸುವಿಕೆಗೂ ಸ್ವಾಗತ!',
    soloHint: 'ನೀವು ಒಬ್ಬರೇ ಭಾಗವಹಿಸುತ್ತಿದ್ದರೆ, ಸದಸ್ಯರನ್ನು ಸೇರಿಸದೆ ನೇರವಾಗಿ ಮುಂದುವರಿಯಬಹುದು.',
    teammateNumber: 'ಸದಸ್ಯರು #',
    removeBtn: '✕ ತೆಗೆದುಹಾಕಿ',
    memberNamePh: 'ಪೂರ್ಣ ಹೆಸರು *',
    memberEmailPh: 'ಇಮೇಲ್ *',
    memberPhonePh: 'ಫೋನ್ *',
    memberRolePh: 'ಪಾತ್ರ (ಉದಾ: ತಾಂತ್ರಿಕ ಡೆವಲಪರ್)',
    addTeammateBtn: '+ ಸದಸ್ಯರನ್ನು ಸೇರಿಸಿ (ಐಚ್ಛಿಕ)',
    noAdditionalMembers: 'ಯಾವುದೇ ಹೆಚ್ಚುವರಿ ಸದಸ್ಯರನ್ನು ಸೇರಿಸಲಾಗಿಲ್ಲ (೧-ವ್ಯಕ್ತಿ ತಂಡವಾಗಿ ಮುಂದುವರಿಯಲಾಗುತ್ತಿದೆ)',
    createTeamSubmit: 'ತಂಡವನ್ನು ರಚಿಸಿ & ಹಂತ ೧ ಆಲೋಚನೆ ಅನ್‌ಲಾಕ್ ಮಾಡಿ',
    r1StageBadge: 'ಹಂತ ೦೧',
    r1MaxWords: 'ಗರಿಷ್ಠ ೪೦೦ ಪದಗಳು',
    r1Title: '💡 ಹಂತ ೧: ನವೀನ ಆಲೋಚನೆ ಸಲ್ಲಿಕೆ',
    r1Subtitle: 'ನಿಮ್ಮ ವಿಷಯವನ್ನು ಆಯ್ಕೆಮಾಡಿ, ಸಮಸ್ಯೆಯ ವಿವರಣೆ (ಗರಿಷ್ಠ ೧೫೦ ಪದಗಳು) ಮತ್ತು ಪ್ರಸ್ತಾವಿತ ತಾಂತ್ರಿಕ ಪರಿಹಾರವನ್ನು (ಗರಿಷ್ಠ ೨೫೦ ಪದಗಳು) ವಿವರಿಸಿ.',
    r1LockedVerified: '🔒 ಹಂತ ೧ ರ ಪ್ರಸ್ತಾವನೆಯು ಪರಿಶೀಲಿಸಲ್ಪಟ್ಟಿದೆ & ಲಾಕ್ ಆಗಿದೆ',
    r1LockedDesc: 'ಅಭಿನಂದನೆಗಳು! ನಿಮ್ಮ ತಂಡವು ಹಂತ ೨ ಕ್ಕೆ ಆಯ್ಕೆಯಾಗಿದೆ. ನಿಮ್ಮ ಹಂತ ೧ ರ ಸಮಸ್ಯೆ ಮತ್ತು ಪರಿಹಾರವು ಲಾಕ್ ಆಗಿದೆ.',
    goToR2: 'ಹಂತ ೨ ಕ್ಕೆ ಮುಂದುವರಿಯಿರಿ →',
    r1ThemeLabel: '೧. ಸವಾಲಿನ ವಿಷಯ *',
    r1ThemeLocked: '(ಲಾಕ್ ಆಗಿದೆ)',
    r1ProblemLabel: '೨. ಸಮಸ್ಯೆಯ ವಿವರಣೆ (Problem Statement) *',
    r1ProblemMax: '(ಗರಿಷ್ಠ ೧೫೦ ಪದಗಳು)',
    r1ProblemHint: 'ಮುಖ್ಯ ಸಮಸ್ಯೆ, ಬಾಧಿತ ಜನಸಮುದಾಯ ಮತ್ತು ಪ್ರಸ್ತುತ ಇರುವ ಕೊರತೆಗಳನ್ನು ವಿವರಿಸಿ.',
    r1ProblemPh: 'ಮುಖ್ಯ ಸಮಸ್ಯೆಯನ್ನು ವಿವರಿಸಿ (೧೫೦ ಪದಗಳವರೆಗೆ)...',
    r1SolutionLabel: '೩. ಪ್ರಸ್ತಾವಿತ ತಾಂತ್ರಿಕ ಪರಿಹಾರ (Proposed Solution) *',
    r1SolutionMax: '(ಗರಿಷ್ಠ ೨೫೦ ಪದಗಳು)',
    r1SolutionHint: 'ತಾಂತ್ರಿಕ ವಿಧಾನ, AI/IoT/ಹಾರ್ಡ್‌ವೇರ್ ಕಾರ್ಯವಿಧಾನ ಮತ್ತು ಪರಿಹಾರದ ರಚನೆಯನ್ನು ವಿವರಿಸಿ.',
    r1SolutionPh: 'ನಿಮ್ಮ ತಾಂತ್ರಿಕ ಪರಿಹಾರವನ್ನು ವಿವರಿಸಿ (೨೫೦ ಪದಗಳವರೆಗೆ)...',
    r1UpdateBtn: '💾 ಹಂತ ೧ ರ ಆಲೋಚನೆಯನ್ನು ನವೀಕರಿಸಿ',
    r1SubmitBtn: '🚀 ಹಂತ ೧ ರ ಪ್ರಸ್ತಾವನೆಯನ್ನು ಸಲ್ಲಿಸಿ',
    proceedToR2Btn: '🚀 ಹಂತ ೨: ವಿವರವಾದ ಯೋಜನೆಗೆ ಮುಂದುವರಿಯಿರಿ →',
    r2LockedTitle: 'ಹಂತ ೨ ಪ್ರಸ್ತುತ ಲಾಕ್ ಆಗಿದೆ',
    r2LockedDesc: 'ತೀರ್ಪುಗಾರರ ಮಂಡಳಿಯು ನಿಮ್ಮ ಹಂತ ೧ ರ ಪ್ರಸ್ತಾವನೆಯನ್ನು ಮೌಲ್ಯಮಾಪನ ಮಾಡಿ "ಆಯ್ಕೆಯಾಗಿದೆ" ಎಂದು ದೃಢಪಡಿಸಿದ ನಂತರ ಹಂತ ೨ ಅನ್‌ಲಾಕ್ ಆಗುತ್ತದೆ.',
    r2LockedNote: '💡 ಸೂಚನೆ: ತೀರ್ಪುಗಾರರು ಹಂತ ೧ ರ ಪ್ರಸ್ತಾವನೆಯನ್ನು ಅನುಮೋದಿಸಿದ ತಕ್ಷಣ ಹಂತ ೨ ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಅನ್‌ಲಾಕ್ ಆಗುತ್ತದೆ.',
    r2StageBadge: 'ಹಂತ ೦೨',
    r2DossierBadge: 'ಸಂಪೂರ್ಣ ವಿವರವಾದ ಯೋಜನೆ',
    r2Title: '🚀 ಹಂತ ೨: ನಿಮ್ಮ ಆಲೋಚನೆಯ ವಿವರವಾದ ಯೋಜನೆ',
    r2Subtitle: 'ಮೊದಲ ಹಂತದಲ್ಲಿ ನೀವು ಸಲ್ಲಿಸಿದ ಆಲೋಚನೆಯನ್ನು ೪ ಪ್ರಮುಖ ಆಯಾಮಗಳಲ್ಲಿ ವಿವರವಾಗಿ ಮಂಡಿಸಿ.',
    r2UnlockedBadge: 'ಮುಕ್ತವಾಗಿದೆ',
    q1Label: '೧. ವಿವರವಾದ ಪರಿಕಲ್ಪನೆ (Detailed Concept) * (ಗರಿಷ್ಠ ೧೦೦೦ ಪದಗಳು)',
    q1Hint: 'ಸಮಗ್ರ ವಿನ್ಯಾಸ, ಅಲ್ಗಾರಿದಮ್ ಘಟಕಗಳು, ಸಿಸ್ಟಮ್ ರೇಖಾಚಿತ್ರ ಮತ್ತು ಡೇಟಾ ಹರಿವು.',
    q1Ph: 'ನಿಮ್ಮ ಸಂಪೂರ್ಣ ತಾಂತ್ರಿಕ ಪರಿಕಲ್ಪನೆಯನ್ನು ವಿವರವಾಗಿ ಬರೆಯಿರಿ (೧೦೦೦ ಪದಗಳವರೆಗೆ)...',
    q2Label: '೨. ಮೌಲ್ಯ ಮತ್ತು ವೃತ್ತಾಕಾರದ ಆರ್ಥಿಕತೆ (Value Proposition & Circularity) * (ಗರಿಷ್ಠ ೧೫೦ ಪದಗಳು)',
    q2Hint: 'ಮುಖ್ಯ ಮೌಲ್ಯ, ವೃತ್ತಾಕಾರದ ಆರ್ಥಿಕತೆಯ ಪರಿಣಾಮ, ಸಂಪನ್ಮೂಲ ದಕ್ಷತೆ ಮತ್ತು ನವೀನತೆ.',
    q2Ph: 'ಮೌಲ್ಯ ಮತ್ತು ಮರುಬಳಕೆಯ ಪ್ರಯೋಜನಗಳನ್ನು ವಿವರಿಸಿ (೧೫೦ ಪದಗಳವರೆಗೆ)...',
    q3Label: '೩. ೯೦ ದಿನಗಳ ಕಾರ್ಯಸಾಧ್ಯತೆಯ ಯೋಜನೆ (90 Days Plan) * (ಗರಿಷ್ಠ ೨೦೦ ಪದಗಳು)',
    q3Hint: 'ತಿಂಗಳು ೧, ತಿಂಗಳು ೨ ಮತ್ತು ತಿಂಗಳು ೩ ರ ಗುರಿಗಳು, ಮಾದರಿ ಪರೀಕ್ಷೆ ಮತ್ತು ಪ್ರಾಯೋಗಿಕ ಜಾರಿ.',
    q3Ph: 'ನಿಮ್ಮ ೯೦ ದಿನಗಳ ಅನುಷ್ಠಾನ ಯೋಜನೆಯನ್ನು ರೂಪಿಸಿ (೨೦೦ ಪದಗಳವರೆಗೆ)...',
    q4Label: '೪. ಸಂಪನ್ಮೂಲಗಳ ಅಗತ್ಯತೆ (Resource Requirements) * (ಗರಿಷ್ಠ ೧೦೦ ಪದಗಳು)',
    q4Hint: 'ಸಾಮಗ್ರಿಗಳ ಪಟ್ಟಿ, ಕ್ಲೌಡ್ ತಂತ್ರಜ್ಞಾನ, ಪ್ರಯೋಗಾಲಯದ ಉಪಕರಣಗಳು ಮತ್ತು ಬಜೆಟ್ ವಿವರ.',
    q4Ph: 'ಅಗತ್ಯವಿರುವ ಸಂಪನ್ಮೂಲಗಳು, ಹಾರ್ಡ್‌ವೇರ್ ಮತ್ತು ಅಂದಾಜು ವೆಚ್ಚವನ್ನು ಪಟ್ಟಿ ಮಾಡಿ (೧೦೦ ಪದಗಳವರೆಗೆ)...',
    r2UpdateBtn: '💾 ಹಂತ ೨ ರ ಯೋಜನೆಯನ್ನು ನವೀಕರಿಸಿ',
    r2SubmitBtn: '🚀 ಹಂತ ೨ ರ ಸಂಪೂರ್ಣ ಯೋಜನೆಯನ್ನು ಸಲ್ಲಿಸಿ',
    wordsUnit: 'ಪದಗಳು',
  },
};

// Helper function to count words
function countWords(str) {
  if (!str) return 0;
  const matches = str.trim().match(/\S+/g);
  return matches ? matches.length : 0;
}

export default function ParticipantPage() {
  const { user, token, showToast, lang = 'en' } = useAuth();
  const router = useRouter();

  const t = participantTranslations[lang] || participantTranslations.en;

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
      showToast(lang === 'kn' ? 'ಗರಿಷ್ಠ ೨ ಹೆಚ್ಚುವರಿ ಸದಸ್ಯರನ್ನು ಮಾತ್ರ ಸೇರಿಸಬಹುದು (ನಾಯಕ + ೨ ಸದಸ್ಯರು)' : 'Maximum 2 additional teammates allowed (Leader + 2 members)', true);
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
      showToast(lang === 'kn' ? `ತಂಡ "${teamName}" ಯಶಸ್ವಿಯಾಗಿ ರಚಿಸಲ್ಪಟ್ಟಿದೆ!` : `Team "${teamName}" created successfully!`);
      await loadMyTeam();
      setActiveTab('r1');
    } else {
      showToast(res.message || (lang === 'kn' ? 'ತಂಡ ರಚನೆ ವಿಫಲವಾಗಿದೆ' : 'Team creation failed'), true);
    }
  };

  const handleR1Submit = async (e) => {
    e.preventDefault();

    const problemWords = countWords(r1Problem);
    const solutionWords = countWords(r1Solution);

    if (problemWords > 150) {
      showToast(lang === 'kn' ? `ಸಮಸ್ಯೆಯ ವಿವರಣೆಯು ೧೫೦ ಪದಗಳ ಮಿತಿಯನ್ನು ಮೀರಿದೆ (${problemWords} ಪದಗಳು).` : `Problem Statement exceeds 150 words limit (${problemWords} words). Please condense.`, true);
      return;
    }
    if (solutionWords > 250) {
      showToast(lang === 'kn' ? `ಪ್ರಸ್ತಾವಿತ ಪರಿಹಾರವು ೨೫೦ ಪದಗಳ ಮಿತಿಯನ್ನು ಮೀರಿದೆ (${solutionWords} ಪದಗಳು).` : `Proposed Solution exceeds 250 words limit (${solutionWords} words). Please condense.`, true);
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
      showToast(lang === 'kn' ? 'ಹಂತ ೧ ರ ಪ್ರಸ್ತಾವನೆಯು ಯಶಸ್ವಿಯಾಗಿ ಸಲ್ಲಿಕೆಯಾಗಿದೆ!' : 'Round 1 Proposal Submitted Successfully! Assigned Judges can now evaluate.');
      await loadMyTeam();
      await loadRound1Data();
    } else {
      showToast(res.message || (lang === 'kn' ? 'ಹಂತ ೧ ಸಲ್ಲಿಕೆ ವಿಫಲವಾಗಿದೆ' : 'Round 1 Submission Failed'), true);
    }
  };

  const handleR2Submit = async (e) => {
    e.preventDefault();

    const conceptWords = countWords(r2Data.detailedConcept);
    const valPropWords = countWords(r2Data.valuePropositionAndCircularity);
    const feasibilityWords = countWords(r2Data.feasibilityPlan90Days);
    const resourceWords = countWords(r2Data.resourceRequirements);

    if (conceptWords > 1000) {
      showToast(lang === 'kn' ? `ವಿವರವಾದ ಪರಿಕಲ್ಪನೆಯು ೧೦೦೦ ಪದಗಳ ಮಿತಿಯನ್ನು ಮೀರಿದೆ (${conceptWords} ಪದಗಳು).` : `Detailed Concept exceeds 1000 words limit (${conceptWords} words).`, true);
      return;
    }
    if (valPropWords > 150) {
      showToast(lang === 'kn' ? `ಮೌಲ್ಯ ಮತ್ತು ಮರುಬಳಕೆಯ ವಿವರಣೆಯು ೧೫೦ ಪದಗಳ ಮಿತಿಯನ್ನು ಮೀರಿದೆ (${valPropWords} ಪದಗಳು).` : `Value Proposition and Circularity exceeds 150 words limit (${valPropWords} words).`, true);
      return;
    }
    if (feasibilityWords > 200) {
      showToast(lang === 'kn' ? `೯೦ ದಿನಗಳ ಯೋಜನೆಯು ೨೦೦ ಪದಗಳ ಮಿತಿಯನ್ನು ಮೀರಿದೆ (${feasibilityWords} ಪದಗಳು).` : `90 Days Feasibility Plan exceeds 200 words limit (${feasibilityWords} words).`, true);
      return;
    }
    if (resourceWords > 100) {
      showToast(lang === 'kn' ? `ಸಂಪನ್ಮೂಲಗಳ ಅಗತ್ಯತೆಯು ೧೦೦ ಪದಗಳ ಮಿತಿಯನ್ನು ಮೀರಿದೆ (${resourceWords} ಪದಗಳು).` : `Resource Requirement exceeds 100 words limit (${resourceWords} words).`, true);
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
      showToast(lang === 'kn' ? 'ಹಂತ ೨ ರ ಸಂಪೂರ್ಣ ಯೋಜನೆಯು ಯಶಸ್ವಿಯಾಗಿ ಸಲ್ಲಿಕೆಯಾಗಿದೆ!' : 'Round 2 Deep-Dive Dossier successfully submitted to MongoDB!');
      await loadMyTeam();
      await loadRound2Data();
    } else {
      showToast(res.message || (lang === 'kn' ? 'ಹಂತ ೨ ಸಲ್ಲಿಕೆ ವಿಫಲವಾಗಿದೆ' : 'Round 2 Submission Failed'), true);
    }
  };

  return (
    <div className={`portal-container participant-portal-wrap ${lang === 'kn' ? 'kannada' : ''}`}>
      {/* HEADER */}
      <div className="portal-header">
        <div>
          <h1 className="portal-title">{t.headerTitle}</h1>
          <p className="portal-subtitle">
            {t.headerSubtitleLeader} <strong>{user?.name}</strong> ({user?.email}) • {t.headerSubtitleEvent}
          </p>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={loadData}>
          <RefreshCw size={14} /> {t.refreshBtn}
        </button>
      </div>

      {/* PROGRESS TRACKER */}
      <div className="tracker-box">
        <div className={`tracker-node ${team ? 'done' : 'current'}`}>
          <div className="tracker-bubble">{team ? '✓' : '1'}</div>
          <div className="tracker-info">
            <strong>{t.trackerTeam}</strong>
            <span>{team ? team.teamName : t.trackerRegTeam}</span>
          </div>
        </div>

        <div className={`tracker-connector ${team ? 'done' : ''}`}></div>

        <div className={`tracker-node ${team?.round1Status === 'SELECTED' ? 'done' : team?.round1Status === 'SUBMITTED' ? 'current' : ''}`}>
          <div className="tracker-bubble">{team?.round1Status === 'SELECTED' ? '✓' : '2'}</div>
          <div className="tracker-info">
            <strong>{t.trackerR1}</strong>
            <span>{team?.round1Status === 'SELECTED' ? t.trackerSelected : team?.round1Status ? (team.round1Status === 'SUBMITTED' ? t.trackerSubmitted : team.round1Status) : t.trackerDraft}</span>
          </div>
        </div>

        <div className={`tracker-connector ${team?.round1Status === 'SELECTED' ? 'done' : ''}`}></div>

        <div className={`tracker-node ${team?.finalStatus === 'FINALIST' ? 'done' : team?.round1Status === 'SELECTED' ? 'current' : ''}`}>
          <div className="tracker-bubble">{team?.finalStatus === 'FINALIST' ? '✓' : '3'}</div>
          <div className="tracker-info">
            <strong>{t.trackerR2}</strong>
            <span>{team?.round1Status === 'SELECTED' ? (team?.round2Status === 'SUBMITTED' ? t.trackerSubmitted : t.trackerUnlocked) : t.trackerLocked}</span>
          </div>
        </div>

        <div className={`tracker-connector ${team?.finalStatus === 'FINALIST' ? 'done' : ''}`}></div>

        <div className={`tracker-node ${team?.finalStatus === 'FINALIST' ? 'done' : ''}`}>
          <div className="tracker-bubble">🏆</div>
          <div className="tracker-info">
            <strong>{t.trackerFinale}</strong>
            <span>{team?.finalStatus === 'FINALIST' ? t.trackerStageReady : t.trackerPending}</span>
          </div>
        </div>
      </div>

      {/* GRAND FINALIST STAGE PASS (If qualified) */}
      {finalistPass && (
        <div className="finalist-pass">
          <div className="pass-icon">🏆</div>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#b45309', textTransform: 'uppercase', letterSpacing: '1px' }}>
              {t.passBadge}
            </span>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', fontWeight: 800, color: '#92400e', margin: '4px 0' }}>
              {t.passCongrats} {team?.teamName}!
            </h3>
            <p style={{ color: '#78350f', fontSize: '13px', marginBottom: '12px' }}>
              {t.passDesc}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
              <div style={{ background: '#ffffff', padding: '10px 14px', borderRadius: '8px', border: '1px solid #fde68a' }}>
                <strong style={{ fontSize: '10px', color: '#b45309', display: 'block', marginBottom: '2px' }}>{t.passVenue}</strong>
                <span style={{ fontWeight: 600, color: '#78350f' }}>{finalistPass.venue || (lang === 'kn' ? 'ಮುಖ್ಯ ಆವಿಷ್ಕಾರ ವೇದಿಕೆ' : 'Grand Innovation Stage')}</span>
              </div>
              <div style={{ background: '#ffffff', padding: '10px 14px', borderRadius: '8px', border: '1px solid #fde68a' }}>
                <strong style={{ fontSize: '10px', color: '#b45309', display: 'block', marginBottom: '2px' }}>{t.passTime}</strong>
                <span style={{ fontWeight: 600, color: '#78350f' }}>{finalistPass.startTime || '11:00 AM'} ({finalistPass.presentationDuration || (lang === 'kn' ? '೧೫ ನಿಮಿಷ' : '15 min')})</span>
              </div>
              <div style={{ background: '#ffffff', padding: '10px 14px', borderRadius: '8px', border: '1px solid #fde68a' }}>
                <strong style={{ fontSize: '10px', color: '#b45309', display: 'block', marginBottom: '2px' }}>{t.passDate}</strong>
                <span style={{ fontWeight: 600, color: '#78350f' }}>{finalistPass.eventDate ? new Date(finalistPass.eventDate).toLocaleDateString() : (lang === 'kn' ? 'ಫಿನಾಲೆ ದಿನ' : 'Finale Day')}</span>
              </div>
              <div style={{ background: '#ffffff', padding: '10px 14px', borderRadius: '8px', border: '1px solid #fde68a' }}>
                <strong style={{ fontSize: '10px', color: '#b45309', display: 'block', marginBottom: '2px' }}>{t.passInstructions}</strong>
                <span style={{ fontWeight: 600, color: '#78350f' }}>{finalistPass.instructions || (lang === 'kn' ? 'ಕಾರ್ಯನಿರ್ವಹಿಸುವ ಹಾರ್ಡ್‌ವೇರ್ ಡೆಮೊ ತನ್ನಿ' : 'Bring working demo hardware')}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TABS */}
      <div className="tab-bar">
        <button className={`tab-btn ${activeTab === 'team' ? 'active' : ''}`} onClick={() => setActiveTab('team')}>
          {t.tab1}
        </button>
        <button className={`tab-btn ${activeTab === 'r1' ? 'active' : ''}`} onClick={() => setActiveTab('r1')}>
          {t.tab2}
        </button>
        <button className={`tab-btn ${activeTab === 'r2' ? 'active' : ''}`} onClick={() => setActiveTab('r2')}>
          {t.tab3}
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
                      <Tag size={12} /> {team.theme?.name || t.generalInnovation}
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
                    <span className="roster-badge leader-badge">{t.teamLeaderBadge}</span>
                    <span className="roster-auth-tag">{t.primaryAccount}</span>
                  </div>
                  <div className="roster-card-body">
                    <h3 className="roster-name">{team.leader?.name || user?.name}</h3>
                    <div className="roster-contact-item">
                      <Mail size={14} /> <span>{team.leader?.email || user?.email}</span>
                    </div>
                    <div className="roster-contact-item">
                      <Phone size={14} /> <span>{team.leader?.phone || user?.phone || t.notProvided}</span>
                    </div>
                  </div>
                </div>

                <div className="roster-card members-card">
                  <div className="roster-card-header">
                    <span className="roster-badge member-badge">{t.teamMembersBadge}</span>
                    <span className="roster-count">{team.members?.length || 0} {t.additionalMembers}</span>
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
                          <strong>{t.soloInnovator}</strong>
                          <p>{t.soloDesc}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="team-hub-action-bar">
                <button className="btn btn-primary" onClick={() => setActiveTab('r1')}>
                  {t.proceedToR1} <ArrowRight size={16} />
                </button>
              </div>
            </div>
          ) : (
            <div className="light-card participant-card">
              <div className="team-create-header">
                <h2 className="pitch-form-title">
                  {t.registerTeamTitle}
                </h2>
                <p className="pitch-form-subtitle">
                  {t.registerTeamSubtitle}
                </p>
              </div>

              <form onSubmit={handleCreateTeam}>
                <div className="grid-2" style={{ marginBottom: '20px' }}>
                  <div className="form-group pitch-form-group">
                    <label className="pitch-label">{t.teamNameLabel}</label>
                    <input
                      type="text"
                      className="pitch-input"
                      placeholder={t.teamNamePh}
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group pitch-form-group">
                    <label className="pitch-label">{t.selectThemeLabel}</label>
                    <select
                      className="pitch-input select-styled"
                      value={selectedTheme}
                      onChange={(e) => setSelectedTheme(e.target.value)}
                      required
                    >
                      <option value="">{t.selectThemeOption}</option>
                      {themes.map((tItem) => (
                        <option key={tItem._id} value={tItem._id}>
                          {tItem.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ marginTop: '24px', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: 800, margin: 0, color: 'var(--ink)' }}>
                      {t.teammatesTitle}
                    </h4>
                    <span style={{ fontSize: '12px', color: 'var(--green2)', fontWeight: 700 }}>
                      {t.soloWelcome}
                    </span>
                  </div>
                  <p style={{ color: 'var(--muted)', fontSize: '12.5px', marginTop: '3px' }}>
                    {t.soloHint}
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
                        {t.teammateNumber}{idx + 1}
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
                        {t.removeBtn}
                      </button>
                    </div>

                    <div className="grid-2" style={{ gap: '12px' }}>
                      <input
                        type="text"
                        className="pitch-input"
                        placeholder={`${lang === 'kn' ? 'ಸದಸ್ಯ' : 'Member'} ${idx + 1} ${t.memberNamePh}`}
                        value={m.name}
                        onChange={(e) => updateMember(idx, 'name', e.target.value)}
                        required
                      />
                      <input
                        type="email"
                        className="pitch-input"
                        placeholder={`${lang === 'kn' ? 'ಸದಸ್ಯ' : 'Member'} ${idx + 1} ${t.memberEmailPh}`}
                        value={m.email}
                        onChange={(e) => updateMember(idx, 'email', e.target.value)}
                        required
                      />
                      <input
                        type="tel"
                        className="pitch-input"
                        placeholder={`${lang === 'kn' ? 'ಸದಸ್ಯ' : 'Member'} ${idx + 1} ${t.memberPhonePh}`}
                        value={m.phone}
                        onChange={(e) => updateMember(idx, 'phone', e.target.value)}
                        required
                      />
                      <input
                        type="text"
                        className="pitch-input"
                        placeholder={t.memberRolePh}
                        value={m.roleInTeam}
                        onChange={(e) => updateMember(idx, 'roleInTeam', e.target.value)}
                      />
                    </div>
                  </div>
                ))}

                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '20px' }}>
                  {members.length < 2 && (
                    <button type="button" className="btn btn-secondary btn-sm" onClick={addMemberRow}>
                      {t.addTeammateBtn}
                    </button>
                  )}
                  {members.length === 0 && (
                    <span style={{ fontSize: '12.5px', color: 'var(--muted)' }}>
                      {t.noAdditionalMembers}
                    </span>
                  )}
                </div>

                <button type="submit" className="btn btn-primary pitch-submit-btn">
                  {t.createTeamSubmit} <ArrowRight size={16} />
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
                <span className="round-badge">{t.r1StageBadge}</span>
                <span className="round-subbadge">{t.r1MaxWords}</span>
              </div>
              <h2 className="pitch-form-title">
                {t.r1Title}
              </h2>
              <p className="pitch-form-subtitle">
                {t.r1Subtitle}
              </p>
            </div>
            <span className={`badge ${team?.round1Status || (r1Submission ? r1Submission.status : 'NOT_SUBMITTED')}`}>
              {team?.round1Status === 'SELECTED' ? '🔒 SELECTED (LOCKED)' : (r1Submission ? r1Submission.status : 'NOT SUBMITTED')}
            </span>
          </div>

          {team?.round1Status === 'SELECTED' && (
            <div className="selected-locked-banner">
              <div>
                <strong>{t.r1LockedVerified}</strong>
                <p>
                  {t.r1LockedDesc}
                </p>
              </div>
              <button
                type="button"
                className="btn btn-sm btn-primary"
                onClick={() => setActiveTab('r2')}
              >
                {t.goToR2}
              </button>
            </div>
          )}

          <form onSubmit={handleR1Submit} className="pitch-form">
            {/* 1. THEME SELECTION BEFORE PROBLEM STATEMENT */}
            <div className="form-group pitch-form-group">
              <label className="pitch-label">
                {t.r1ThemeLabel} {team?.round1Status === 'SELECTED' && t.r1ThemeLocked}
              </label>
              <select
                value={r1ThemeId}
                onChange={(e) => setR1ThemeId(e.target.value)}
                disabled={team?.round1Status === 'SELECTED'}
                className="pitch-input select-styled"
                style={team?.round1Status === 'SELECTED' ? { background: '#f1f5f9', cursor: 'not-allowed', color: '#475569' } : {}}
                required
              >
                <option value="">{t.selectThemeOption}</option>
                {themes.map((tItem) => (
                  <option key={tItem._id} value={tItem._id}>
                    {tItem.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 2. PROBLEM STATEMENT (MAX 150 WORDS) */}
            <div className="form-group pitch-form-group">
              <div className="pitch-label-row">
                <label className="pitch-label">
                  {t.r1ProblemLabel} {team?.round1Status === 'SELECTED' && t.r1ThemeLocked}
                </label>
                <span
                  className={`word-counter-pill ${
                    countWords(r1Problem) > 150 ? 'exceeded' : countWords(r1Problem) > 130 ? 'warning' : ''
                  }`}
                >
                  {countWords(r1Problem)} / 150 {t.wordsUnit}
                </span>
              </div>
              <p className="form-hint">{t.r1ProblemHint}</p>
              <textarea
                rows={5}
                value={r1Problem}
                onChange={(e) => setR1Problem(e.target.value)}
                placeholder={t.r1ProblemPh}
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
                  {t.r1SolutionLabel} {team?.round1Status === 'SELECTED' && t.r1ThemeLocked}
                </label>
                <span
                  className={`word-counter-pill ${
                    countWords(r1Solution) > 250 ? 'exceeded' : countWords(r1Solution) > 220 ? 'warning' : ''
                  }`}
                >
                  {countWords(r1Solution)} / 250 {t.wordsUnit}
                </span>
              </div>
              <p className="form-hint">{t.r1SolutionHint}</p>
              <textarea
                rows={6}
                value={r1Solution}
                onChange={(e) => setR1Solution(e.target.value)}
                placeholder={t.r1SolutionPh}
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
                {t.proceedToR2Btn}
              </button>
            ) : (
              <button type="submit" className="btn btn-primary pitch-submit-btn">
                {r1Submission ? t.r1UpdateBtn : t.r1SubmitBtn}
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
                {t.r2LockedTitle}
              </h3>
              <p style={{ color: 'var(--muted)', maxWidth: '520px', margin: '0 auto 16px auto', fontSize: '14px', lineHeight: 1.6 }}>
                {t.r2LockedDesc}
              </p>
              <div style={{ background: '#ecfdf5', color: '#065f46', padding: '8px 18px', borderRadius: '20px', display: 'inline-block', fontSize: '12.5px', fontWeight: 600 }}>
                {t.r2LockedNote}
              </div>
            </div>
          ) : (
            <div className="light-card participant-card">
              <div className="pitch-form-header">
                <div>
                  <div className="pitch-badge-row">
                    <span className="round-badge round-badge-blue">{t.r2StageBadge}</span>
                    <span className="round-subbadge">{t.r2DossierBadge}</span>
                  </div>
                  <h2 className="pitch-form-title">
                    {t.r2Title}
                  </h2>
                  <p className="pitch-form-subtitle">
                    {t.r2Subtitle}
                  </p>
                </div>
                <span className="badge SELECTED">{t.r2UnlockedBadge}</span>
              </div>

              <form onSubmit={handleR2Submit} className="pitch-form">
                {/* 1. DETAILED CONCEPT (MAX 1000 WORDS) */}
                <div className="form-group pitch-form-group">
                  <div className="pitch-label-row">
                    <label className="pitch-label">{t.q1Label}</label>
                    <span
                      className={`word-counter-pill ${
                        countWords(r2Data.detailedConcept) > 1000 ? 'exceeded' : countWords(r2Data.detailedConcept) > 850 ? 'warning' : ''
                      }`}
                    >
                      {countWords(r2Data.detailedConcept)} / 1000 {t.wordsUnit}
                    </span>
                  </div>
                  <p className="form-hint">{t.q1Hint}</p>
                  <textarea
                    rows={8}
                    className="pitch-textarea"
                    value={r2Data.detailedConcept}
                    onChange={(e) => setR2Data({ ...r2Data, detailedConcept: e.target.value })}
                    placeholder={t.q1Ph}
                    required
                  />
                </div>

                {/* 2. VALUE PROPOSITION AND CIRCULARITY (MAX 150 WORDS) */}
                <div className="form-group pitch-form-group">
                  <div className="pitch-label-row">
                    <label className="pitch-label">{t.q2Label}</label>
                    <span
                      className={`word-counter-pill ${
                        countWords(r2Data.valuePropositionAndCircularity) > 150 ? 'exceeded' : countWords(r2Data.valuePropositionAndCircularity) > 130 ? 'warning' : ''
                      }`}
                    >
                      {countWords(r2Data.valuePropositionAndCircularity)} / 150 {t.wordsUnit}
                    </span>
                  </div>
                  <p className="form-hint">{t.q2Hint}</p>
                  <textarea
                    rows={4}
                    className="pitch-textarea"
                    value={r2Data.valuePropositionAndCircularity}
                    onChange={(e) => setR2Data({ ...r2Data, valuePropositionAndCircularity: e.target.value })}
                    placeholder={t.q2Ph}
                    required
                  />
                </div>

                {/* 3. 90 DAYS FEASIBILITY PLAN (MAX 200 WORDS) */}
                <div className="form-group pitch-form-group">
                  <div className="pitch-label-row">
                    <label className="pitch-label">{t.q3Label}</label>
                    <span
                      className={`word-counter-pill ${
                        countWords(r2Data.feasibilityPlan90Days) > 200 ? 'exceeded' : countWords(r2Data.feasibilityPlan90Days) > 175 ? 'warning' : ''
                      }`}
                    >
                      {countWords(r2Data.feasibilityPlan90Days)} / 200 {t.wordsUnit}
                    </span>
                  </div>
                  <p className="form-hint">{t.q3Hint}</p>
                  <textarea
                    rows={4}
                    className="pitch-textarea"
                    value={r2Data.feasibilityPlan90Days}
                    onChange={(e) => setR2Data({ ...r2Data, feasibilityPlan90Days: e.target.value })}
                    placeholder={t.q3Ph}
                    required
                  />
                </div>

                {/* 4. RESOURCE REQUIREMENT (MAX 100 WORDS) */}
                <div className="form-group pitch-form-group">
                  <div className="pitch-label-row">
                    <label className="pitch-label">{t.q4Label}</label>
                    <span
                      className={`word-counter-pill ${
                        countWords(r2Data.resourceRequirements) > 100 ? 'exceeded' : countWords(r2Data.resourceRequirements) > 85 ? 'warning' : ''
                      }`}
                    >
                      {countWords(r2Data.resourceRequirements)} / 100 {t.wordsUnit}
                    </span>
                  </div>
                  <p className="form-hint">{t.q4Hint}</p>
                  <textarea
                    rows={3}
                    className="pitch-textarea"
                    value={r2Data.resourceRequirements}
                    onChange={(e) => setR2Data({ ...r2Data, resourceRequirements: e.target.value })}
                    placeholder={t.q4Ph}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary pitch-submit-btn">
                  {r2Submission ? t.r2UpdateBtn : t.r2SubmitBtn}
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
