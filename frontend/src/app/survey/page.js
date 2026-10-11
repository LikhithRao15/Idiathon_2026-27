'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  MapPin,
  Camera,
  Calendar,
  Clock,
  Send,
  AlertCircle,
  RotateCcw,
  Sparkles,
  Trash2,
  FileText,
  Home,
  ShieldCheck,
  Leaf
} from 'lucide-react';
import surveySchema from '../../data/swachhaSarvekshanaForm.json';
import { apiRequest } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

export default function SurveyPage() {
  const router = useRouter();
  const { lang: contextLang, setLang: setContextLang } = useAuth();
  const [lang, setLang] = useState(contextLang || 'en');
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [locationStatus, setLocationStatus] = useState('');
  const [photoPreview, setPhotoPreview] = useState(null);

  // Sync lang with context
  useEffect(() => {
    if (contextLang) setLang(contextLang);
  }, [contextLang]);

  const toggleLang = (newLang) => {
    setLang(newLang);
    if (setContextLang) setContextLang(newLang);
    if (typeof window !== 'undefined') localStorage.setItem('ideathon_lang', newLang);
  };

  // Group inputs into logical steps using 'readme' items as section boundaries
  const sections = [];
  let currentSection = null;

  surveySchema.inputs.forEach((input) => {
    if (input.type === 'readme') {
      if (currentSection) {
        sections.push(currentSection);
      }
      currentSection = {
        title: input.question.replace(/<[^>]*>?/gm, '').trim(),
        sectionId: input.section_id || `sec_${sections.length}`,
        inputs: [],
      };
    } else {
      if (!currentSection) {
        currentSection = {
          title: 'General Information / ಸಾಮಾನ್ಯ ಮಾಹಿತಿ',
          sectionId: 'sec_0',
          inputs: [],
        };
      }
      currentSection.inputs.push(input);
    }
  });
  if (currentSection) {
    sections.push(currentSection);
  }

  // Load draft from localStorage on mount
  useEffect(() => {
    try {
      const savedDraft = localStorage.getItem('swachha_survey_draft');
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft);
        if (parsed.answers) setAnswers(parsed.answers);
        if (typeof parsed.step === 'number') setCurrentStep(parsed.step);
        if (parsed.photoPreview) setPhotoPreview(parsed.photoPreview);
      }
    } catch (e) {
      console.warn('Could not load survey draft', e);
    }

    // Set default date and time if empty
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toTimeString().split(' ')[0].substring(0, 5);

    setAnswers((prev) => {
      const updated = { ...prev };
      surveySchema.inputs.forEach((inp) => {
        if (inp.type === 'date' && !updated[inp.ref]) {
          updated[inp.ref] = dateStr;
        }
        if (inp.type === 'time' && !updated[inp.ref]) {
          updated[inp.ref] = timeStr;
        }
      });
      return updated;
    });
  }, []);

  // Auto-save draft on changes
  useEffect(() => {
    if (Object.keys(answers).length > 0 && !isSubmitted) {
      try {
        localStorage.setItem(
          'swachha_survey_draft',
          JSON.stringify({ answers, step: currentStep, photoPreview })
        );
      } catch (e) {
        // storage quota exceeded or disabled
      }
    }
  }, [answers, currentStep, photoPreview, isSubmitted]);

  // Handler for text / integer / dropdown / date / time
  const handleInputChange = (ref, val) => {
    setAnswers((prev) => ({
      ...prev,
      [ref]: val,
    }));
  };

  // Handler for single-select (radio)
  const handleRadioSelect = (ref, answerRef) => {
    setAnswers((prev) => ({
      ...prev,
      [ref]: answerRef,
    }));
  };

  // Handler for multi-select (checkbox)
  const handleCheckboxToggle = (ref, answerRef) => {
    setAnswers((prev) => {
      const currentArr = Array.isArray(prev[ref]) ? prev[ref] : [];
      let updatedArr;
      if (currentArr.includes(answerRef)) {
        updatedArr = currentArr.filter((item) => item !== answerRef);
      } else {
        updatedArr = [...currentArr, answerRef];
      }
      return {
        ...prev,
        [ref]: updatedArr,
      };
    });
  };

  // Handle GPS location detection
  const handleDetectLocation = (ref) => {
    if (!navigator.geolocation) {
      setLocationStatus('Geolocation is not supported by your browser.');
      return;
    }
    setLocationStatus(lang === 'kn' ? 'ಸ್ಥಳವನ್ನು ಪತ್ತೆ ಮಾಡಲಾಗುತ್ತಿದೆ...' : 'Detecting GPS coordinates...');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        const locString = `Lat: ${latitude.toFixed(6)}, Lon: ${longitude.toFixed(6)} (±${Math.round(accuracy)}m)`;
        setAnswers((prev) => ({
          ...prev,
          [ref]: locString,
          _geoCoords: { latitude, longitude, accuracy },
        }));
        setLocationStatus(
          lang === 'kn'
            ? `ಸ್ಥಳ ಯಶಸ್ವಿಯಾಗಿ ದಾಖಲಾಗಿದೆ: ${latitude.toFixed(5)}, ${longitude.toFixed(5)}`
            : `Location acquired: ${latitude.toFixed(5)}, ${longitude.toFixed(5)}`
        );
      },
      (err) => {
        setLocationStatus(
          lang === 'kn'
            ? 'ಜಿಪಿಎಸ್ ಪಡೆಯಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಬ್ರೌಸರ್ ಅನುಮತಿ ಪರಿಶೀಲಿಸಿ.'
            : `GPS error: ${err.message}. Please enter manually.`
        );
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
    );
  };

  // Handle photo upload
  const handlePhotoUpload = (ref, e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert(lang === 'kn' ? 'ಭಾವಚಿತ್ರದ ಗಾತ್ರ 5MB ಗಿಂತ ಕಡಿಮೆ ಇರಬೇಕು' : 'Photo size must be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = reader.result;
        setPhotoPreview(base64Data);
        setAnswers((prev) => ({
          ...prev,
          [ref]: base64Data,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = (ref) => {
    setPhotoPreview(null);
    setAnswers((prev) => {
      const copy = { ...prev };
      delete copy[ref];
      return copy;
    });
  };

  // Form submission
  const handleSubmit = async () => {
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      // Find key values for backend top-level schema
      const nameInput = surveySchema.inputs.find((i) => i.question.includes('Name of the Respondent'));
      const villageInput = surveySchema.inputs.find((i) => i.question.includes('Name of the Village'));
      const categoryInput = surveySchema.inputs.find((i) => i.question.includes('Respondent Category'));
      const phoneInput = surveySchema.inputs.find((i) => i.question.includes('Phone Number'));
      const teamInput = surveySchema.inputs.find((i) => i.question.includes('Survey Team'));
      const dateInput = surveySchema.inputs.find((i) => i.type === 'date');
      const timeInput = surveySchema.inputs.find((i) => i.type === 'time');
      const photoInput = surveySchema.inputs.find((i) => i.type === 'photo');

      const respondentName = nameInput ? answers[nameInput.ref] : '';
      const villageName = villageInput ? answers[villageInput.ref] : '';
      
      let categoryAnswer = '';
      if (categoryInput && answers[categoryInput.ref]) {
        const matched = categoryInput.possible_answers.find((p) => p.answer_ref === answers[categoryInput.ref]);
        categoryAnswer = matched ? matched.answer : answers[categoryInput.ref];
      }

      const payload = {
        formSlug: surveySchema.slug,
        formName: surveySchema.name,
        respondentName: respondentName || 'Field Respondent',
        villageName: villageName || 'Not Specified',
        respondentCategory: categoryAnswer,
        respondentPhone: phoneInput ? answers[phoneInput.ref] : '',
        surveyTeam: teamInput ? answers[teamInput.ref] : '',
        location: answers._geoCoords || null,
        photoData: photoInput ? answers[photoInput.ref] : null,
        surveyDate: dateInput ? answers[dateInput.ref] : '',
        surveyTime: timeInput ? answers[timeInput.ref] : '',
        answers,
      };

      const res = await apiRequest('/survey/submit', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsSubmitted(true);
        setSubmittedData({
          name: respondentName || 'Respondent',
          village: villageName || 'Your Village',
          id: res.data?.id,
          time: new Date().toLocaleTimeString(),
        });
        localStorage.removeItem('swachha_survey_draft');
      } else {
        setErrorMessage(res.message || 'Submission failed. Please check your answers and try again.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'An unexpected error occurred during submission.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearDraft = () => {
    if (confirm(lang === 'kn' ? 'ಎಲ್ಲಾ ಉತ್ತರಗಳನ್ನು ಅಳಿಸಿ ಮೊದಲಿನಿಂದ ಪ್ರಾರಂಭಿಸುವುದೇ?' : 'Clear all answers and restart survey?')) {
      localStorage.removeItem('swachha_survey_draft');
      setAnswers({});
      setCurrentStep(0);
      setPhotoPreview(null);
    }
  };

  const activeSection = sections[currentStep] || sections[0];
  const progressPercent = Math.round(((currentStep + 1) / sections.length) * 100);

  // Helper to extract bilingual parts
  const formatBilingual = (str) => {
    if (!str) return { main: '', sub: '' };
    const parts = str.split('/');
    if (parts.length > 1) {
      return {
        en: parts[0].trim(),
        kn: parts.slice(1).join('/').trim(),
      };
    }
    return { en: str, kn: '' };
  };

  if (isSubmitted) {
    return (
      <div className="survey-page-container">
        <div className="container survey-wrapper">
          <div className="survey-card survey-success-card">
            <div className="survey-success-icon-wrap">
              <CheckCircle2 size={68} className="survey-success-check" />
              <div className="survey-success-glow" />
            </div>

            <h1 className="survey-success-title">
              {lang === 'kn' ? 'ಸಮೀಕ್ಷೆ ಯಶಸ್ವಿಯಾಗಿ ಸಲ್ಲಿಕೆಯಾಗಿದೆ!' : 'Survey Submitted Successfully!'}
            </h1>

            <p className="survey-success-lead">
              {lang === 'kn'
                ? 'ಸ್ವಚ್ಛ ಸರ್ವೇಕ್ಷಣ ಮತ್ತು ಸುಸ್ಥಿರ ತ್ಯಾಜ್ಯ ನಿರ್ವಹಣೆ ಸಮೀಕ್ಷೆಯಲ್ಲಿ ಭಾಗವಹಿಸಿದ್ದಕ್ಕಾಗಿ ಧನ್ಯವಾದಗಳು.'
                : 'Thank you for contributing valuable ground data to Swachha Sarvekshana & sustainable waste management.'}
            </p>

            <div className="survey-summary-box">
              <div className="survey-summary-row">
                <span>{lang === 'kn' ? 'ಪ್ರತಿಕ್ರಿಯೆದಾರರು:' : 'Respondent:'}</span>
                <b>{submittedData?.name}</b>
              </div>
              <div className="survey-summary-row">
                <span>{lang === 'kn' ? 'ಗ್ರಾಮ:' : 'Village:'}</span>
                <b>{submittedData?.village}</b>
              </div>
              <div className="survey-summary-row">
                <span>{lang === 'kn' ? 'ಸಮಯ:' : 'Recorded At:'}</span>
                <b>{submittedData?.time}</b>
              </div>
            </div>

            <div className="survey-success-actions">
              <Link href="/" className="survey-btn-primary">
                <Home size={18} />
                <span>{lang === 'kn' ? 'ಮುಖಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ' : 'Return to Home Page'}</span>
              </Link>
              <button
                type="button"
                onClick={() => {
                  setIsSubmitted(false);
                  setAnswers({});
                  setCurrentStep(0);
                  setPhotoPreview(null);
                }}
                className="survey-btn-secondary"
              >
                <RotateCcw size={18} />
                <span>{lang === 'kn' ? 'ಮತ್ತೊಂದು ಸಮೀಕ್ಷೆ ಸಲ್ಲಿಸಿ' : 'Submit Another Response'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="survey-page-container">
      {/* TOP HEADER BAR */}
      <header className="survey-nav-header">
        <div className="container survey-nav-flex">
          <Link href="/" className="survey-back-link" title="Back to homepage">
            <ArrowLeft size={18} />
            <span>{lang === 'kn' ? 'ಮುಖಪುಟ' : 'Back to Home'}</span>
          </Link>

          <div className="survey-header-branding">
            <span className="survey-header-badge">
              <Sparkles size={13} />
              <span>SWACHHA SARVEKSHANA 2026</span>
            </span>
            <h1 className="survey-header-title">
              {lang === 'kn' ? 'ಸ್ವಚ್ಛ ಸರ್ವೇಕ್ಷಣ ಸಮೀಕ್ಷೆ' : 'Swachha Sarvekshana Field Survey'}
            </h1>
          </div>

          <div className="survey-header-right">
            <div className="survey-lang-toggle">
              <button
                type="button"
                className={`survey-lang-btn ${lang === 'en' ? 'is-active' : ''}`}
                onClick={() => toggleLang('en')}
              >
                EN
              </button>
              <button
                type="button"
                className={`survey-lang-btn ${lang === 'kn' ? 'is-active' : ''}`}
                onClick={() => toggleLang('kn')}
              >
                ಕನ್ನಡ
              </button>
            </div>

            {Object.keys(answers).length > 2 && (
              <button
                type="button"
                onClick={clearDraft}
                className="survey-clear-btn"
                title="Clear Draft"
              >
                <Trash2 size={16} />
                <span className="hide-mobile">{lang === 'kn' ? 'ಅಳಿಸಿ' : 'Reset'}</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* PROGRESS TRACKER */}
      <div className="survey-progress-bar-wrap">
        <div className="container">
          <div className="survey-progress-meta">
            <div className="survey-step-indicator">
              <span className="survey-step-pill">
                {lang === 'kn' ? `ಹಂತ ${currentStep + 1} / ${sections.length}` : `Section ${currentStep + 1} of ${sections.length}`}
              </span>
              <span className="survey-step-name">
                {lang === 'kn' ? formatBilingual(activeSection.title).kn || activeSection.title : formatBilingual(activeSection.title).en}
              </span>
            </div>
            <span className="survey-progress-percent">{progressPercent}%</span>
          </div>

          <div className="survey-progress-track">
            <div className="survey-progress-fill" style={{ width: `${progressPercent}%` }} />
          </div>

          {/* STEPPER PILLS */}
          <div className="survey-stepper-dots">
            {sections.map((sec, idx) => (
              <button
                key={sec.sectionId}
                type="button"
                className={`survey-stepper-dot ${idx === currentStep ? 'is-current' : idx < currentStep ? 'is-done' : ''}`}
                onClick={() => setCurrentStep(idx)}
                title={sec.title}
              >
                {idx < currentStep ? <Check size={12} /> : idx + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* MAIN QUESTIONS CARD */}
      <main className="container survey-content-container">
        <div className="survey-card">
          <div className="survey-card-header">
            <div className="survey-section-icon-badge">
              <Leaf size={20} />
            </div>
            <div>
              <h2 className="survey-section-title">
                {lang === 'kn' ? formatBilingual(activeSection.title).kn || activeSection.title : formatBilingual(activeSection.title).en}
              </h2>
              {formatBilingual(activeSection.title).kn && (
                <small className="survey-section-sub">
                  {lang === 'kn' ? formatBilingual(activeSection.title).en : formatBilingual(activeSection.title).kn}
                </small>
              )}
            </div>
          </div>

          {/* QUESTIONS LIST */}
          <div className="survey-questions-list">
            {activeSection.inputs.map((inp, qIdx) => {
              const biQ = formatBilingual(inp.question);
              const val = answers[inp.ref];

              return (
                <div key={inp.ref} className="survey-question-block" id={`q_${inp.ref}`}>
                  <label className="survey-question-label">
                    <span className="survey-q-num">{qIdx + 1}.</span>
                    <div>
                      <span className="survey-q-text">
                        {lang === 'kn' ? biQ.kn || inp.question : biQ.en}
                      </span>
                      {biQ.kn && (
                        <span className="survey-q-subtext">
                          {lang === 'kn' ? biQ.en : biQ.kn}
                        </span>
                      )}
                    </div>
                    {inp.is_required && <span className="survey-required-star">*</span>}
                  </label>

                  {/* 1. TEXT / INTEGER INPUT */}
                  {(inp.type === 'text' || inp.type === 'integer') && (
                    <div className="survey-input-wrap">
                      <input
                        type={inp.type === 'integer' ? 'number' : 'text'}
                        value={val || ''}
                        placeholder={inp.placeholder || (lang === 'kn' ? 'ನಿಮ್ಮ ಉತ್ತರವನ್ನು ಬರೆಯಿರಿ...' : 'Type your answer here...')}
                        onChange={(e) => handleInputChange(inp.ref, e.target.value)}
                        className="survey-text-input"
                      />
                    </div>
                  )}

                  {/* 2. RADIO (SINGLE SELECT CARDS) */}
                  {inp.type === 'radio' && (
                    <div className="survey-options-grid radio-grid">
                      {inp.possible_answers?.map((opt) => {
                        const biAns = formatBilingual(opt.answer);
                        const isSelected = val === opt.answer_ref;

                        return (
                          <div
                            key={opt.answer_ref}
                            className={`survey-option-card ${isSelected ? 'is-selected' : ''}`}
                            onClick={() => handleRadioSelect(inp.ref, opt.answer_ref)}
                            role="radio"
                            aria-checked={isSelected}
                            tabIndex={0}
                            onKeyDown={(e) => e.key === 'Enter' && handleRadioSelect(inp.ref, opt.answer_ref)}
                          >
                            <div className="survey-radio-indicator">
                              <div className="survey-radio-dot" />
                            </div>
                            <div className="survey-option-content">
                              <span className="survey-opt-main">
                                {lang === 'kn' ? biAns.kn || opt.answer : biAns.en}
                              </span>
                              {biAns.kn && (
                                <span className="survey-opt-sub">
                                  {lang === 'kn' ? biAns.en : biAns.kn}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* 3. CHECKBOX (MULTI SELECT CHIPS) */}
                  {inp.type === 'checkbox' && (
                    <div className="survey-options-grid checkbox-grid">
                      {inp.possible_answers?.map((opt) => {
                        const biAns = formatBilingual(opt.answer);
                        const isChecked = Array.isArray(val) && val.includes(opt.answer_ref);

                        return (
                          <div
                            key={opt.answer_ref}
                            className={`survey-option-card checkbox-card ${isChecked ? 'is-selected' : ''}`}
                            onClick={() => handleCheckboxToggle(inp.ref, opt.answer_ref)}
                            role="checkbox"
                            aria-checked={isChecked}
                            tabIndex={0}
                            onKeyDown={(e) => e.key === 'Enter' && handleCheckboxToggle(inp.ref, opt.answer_ref)}
                          >
                            <div className="survey-checkbox-indicator">
                              {isChecked && <Check size={14} className="checkbox-check" />}
                            </div>
                            <div className="survey-option-content">
                              <span className="survey-opt-main">
                                {lang === 'kn' ? biAns.kn || opt.answer : biAns.en}
                              </span>
                              {biAns.kn && (
                                <span className="survey-opt-sub">
                                  {lang === 'kn' ? biAns.en : biAns.kn}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* 4. DROPDOWN (SELECT) */}
                  {inp.type === 'dropdown' && (
                    <div className="survey-select-wrap">
                      <select
                        value={val || ''}
                        onChange={(e) => handleInputChange(inp.ref, e.target.value)}
                        className="survey-select-input"
                      >
                        <option value="">
                          {lang === 'kn' ? '-- ಆಯ್ಕೆಮಾಡಿ --' : '-- Select an Option --'}
                        </option>
                        {inp.possible_answers?.map((opt) => {
                          const biAns = formatBilingual(opt.answer);
                          return (
                            <option key={opt.answer_ref} value={opt.answer_ref}>
                              {lang === 'kn' ? biAns.kn || opt.answer : biAns.en}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  )}

                  {/* 5. LOCATION (GPS DETECTOR) */}
                  {inp.type === 'location' && (
                    <div className="survey-location-card">
                      <div className="survey-location-header">
                        <MapPin size={22} className="location-pin-icon" />
                        <div>
                          <b>{lang === 'kn' ? 'ಸ್ವಯಂಚಾಲಿತ ಜಿಪಿಎಸ್ ಪತ್ತೆ' : 'Automatic GPS Detection'}</b>
                          <small>
                            {lang === 'kn'
                              ? 'ನಿಮ್ಮ ಪ್ರಸ್ತುತ ಸ್ಥಳವನ್ನು ನಿಖರವಾಗಿ ದಾಖಲಿಸಲು ಕೆಳಗಿನ ಬಟನ್ ಒತ್ತಿ.'
                              : 'Click below to capture exact coordinates directly from device GPS.'}
                          </small>
                        </div>
                      </div>

                      <div className="survey-location-controls">
                        <button
                          type="button"
                          onClick={() => handleDetectLocation(inp.ref)}
                          className="survey-detect-gps-btn"
                        >
                          <MapPin size={16} />
                          <span>{lang === 'kn' ? 'ಸ್ಥಳ ಪತ್ತೆ ಮಾಡಿ (GPS)' : 'Detect My Location'}</span>
                        </button>

                        {val && (
                          <div className="survey-geo-result">
                            <CheckCircle2 size={16} className="geo-success-icon" />
                            <span>{val}</span>
                          </div>
                        )}
                      </div>

                      {locationStatus && <p className="survey-geo-status">{locationStatus}</p>}

                      <input
                        type="text"
                        value={val || ''}
                        placeholder={lang === 'kn' ? 'ಅಥವಾ ಸ್ಥಳವನ್ನು ನೇರವಾಗಿ ಇಲ್ಲಿ ಬರೆಯಿರಿ' : 'Or type address/coordinates manually'}
                        onChange={(e) => handleInputChange(inp.ref, e.target.value)}
                        className="survey-text-input"
                        style={{ marginTop: '12px' }}
                      />
                    </div>
                  )}

                  {/* 6. DATE & TIME */}
                  {inp.type === 'date' && (
                    <div className="survey-input-wrap with-icon">
                      <Calendar size={18} className="input-pre-icon" />
                      <input
                        type="date"
                        value={val || ''}
                        onChange={(e) => handleInputChange(inp.ref, e.target.value)}
                        className="survey-text-input date-input"
                      />
                    </div>
                  )}

                  {inp.type === 'time' && (
                    <div className="survey-input-wrap with-icon">
                      <Clock size={18} className="input-pre-icon" />
                      <input
                        type="time"
                        value={val || ''}
                        onChange={(e) => handleInputChange(inp.ref, e.target.value)}
                        className="survey-text-input time-input"
                      />
                    </div>
                  )}

                  {/* 7. PHOTO UPLOAD */}
                  {inp.type === 'photo' && (
                    <div className="survey-photo-upload-wrap">
                      {photoPreview ? (
                        <div className="survey-photo-preview-box">
                          <img src={photoPreview} alt="Respondent preview" className="survey-uploaded-img" />
                          <button
                            type="button"
                            onClick={() => removePhoto(inp.ref)}
                            className="survey-remove-photo-btn"
                            title="Remove photo"
                          >
                            <Trash2 size={16} />
                            <span>{lang === 'kn' ? 'ತೆಗೆದುಹಾಕಿ' : 'Remove Photo'}</span>
                          </button>
                        </div>
                      ) : (
                        <label className="survey-photo-dropzone">
                          <Camera size={32} className="camera-icon" />
                          <b>{lang === 'kn' ? 'ಛಾಯಾಚಿತ್ರ ತೆಗೆಯಿರಿ ಅಥವಾ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ' : 'Capture or Upload Photo'}</b>
                          <small>Supports camera capture or PNG/JPG file up to 5MB</small>
                          <input
                            type="file"
                            accept="image/*"
                            capture="environment"
                            onChange={(e) => handlePhotoUpload(inp.ref, e)}
                            className="survey-file-input"
                          />
                        </label>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* ERROR ALERT */}
          {errorMessage && (
            <div className="survey-error-alert" role="alert">
              <AlertCircle size={18} />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* FOOTER ACTIONS */}
          <div className="survey-card-footer">
            <button
              type="button"
              className="survey-nav-btn prev-btn"
              disabled={currentStep === 0}
              onClick={() => {
                setCurrentStep((prev) => Math.max(0, prev - 1));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <ArrowLeft size={18} />
              <span>{lang === 'kn' ? 'ಹಿಂದಿನ ಹಂತ' : 'Previous Section'}</span>
            </button>

            {currentStep < sections.length - 1 ? (
              <button
                type="button"
                className="survey-nav-btn next-btn"
                onClick={() => {
                  setCurrentStep((prev) => Math.min(sections.length - 1, prev + 1));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                <span>{lang === 'kn' ? 'ಮುಂದಿನ ಹಂತ' : 'Save & Continue'}</span>
                <ArrowRight size={18} />
              </button>
            ) : (
              <button
                type="button"
                className="survey-nav-btn submit-btn"
                disabled={isSubmitting}
                onClick={handleSubmit}
              >
                {isSubmitting ? (
                  <span>{lang === 'kn' ? 'ಸಲ್ಲಿಸಲಾಗುತ್ತಿದೆ...' : 'Submitting Response...'}</span>
                ) : (
                  <>
                    <Send size={18} />
                    <span>{lang === 'kn' ? 'ಸಮೀಕ್ಷೆ ಸಲ್ಲಿಸಿ' : 'Submit Final Survey'}</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
