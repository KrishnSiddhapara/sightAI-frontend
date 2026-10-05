import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import ImageUploader from './components/ImageUploader';
import AnalysisProgress from './components/AnalysisProgress';
import SafetyStatus from './components/SafetyStatus';
import AnalysisWorkspace from './components/AnalysisWorkspace';
import ImageEditor from './components/ImageEditor';
import VersionHistory from './components/VersionHistory';
import ImageComparison from './components/ImageComparison';
import AskAI from './components/AskAI';
import EmptyState from './components/EmptyState';

import { getHealth, analyzeImage, editImage, researchWithAgent, exportImage } from './services/api';

const SESSION_STORAGE_KEY = 'sightai_session_state_v1';

function App() {
  const [activeTab, setActiveTab] = useState('analyze'); // 'analyze' | 'edit' | 'ask' | 'history'

  // Backend Health
  const [apiConnected, setApiConnected] = useState(false);
  const [apiConfigured, setApiConfigured] = useState(false);

  // Uploaded File & Base Image State
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageDimensions, setImageDimensions] = useState(null);

  // Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progressStep, setProgressStep] = useState('validating');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [safetyResult, setSafetyResult] = useState(null);

  // Multi-Version Editor State
  const [versionHistory, setVersionHistory] = useState([]);
  const [activeVersionNum, setActiveVersionNum] = useState(0);
  const [sourceVersionNum, setSourceVersionNum] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editSafetyResult, setEditSafetyResult] = useState(null);

  // Grounded Q&A State
  const [qaHistory, setQaHistory] = useState([]);
  const [isAsking, setIsAsking] = useState(false);

  // Theme System State ('light' default, or persisted preference)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('sightai_theme') || 'light';
  });

  // Global Error Alert
  const [globalError, setGlobalError] = useState(null);

  // High-Resolution Live Analysis Timer State
  const [analysisTimer, setAnalysisTimer] = useState({
    elapsedSeconds: '0.0',
    status: 'idle', // 'idle' | 'running' | 'completed' | 'failed'
    finalDuration: null
  });
  const analysisStartTimeRef = useRef(null);
  const timerIntervalRef = useRef(null);

  // Request ID Ref to prevent race conditions & stale response overwrites
  const activeRequestId = useRef(0);

  const startAnalysisTimer = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    const t0 = performance.now();
    analysisStartTimeRef.current = t0;
    setAnalysisTimer({
      elapsedSeconds: '0.0',
      status: 'running',
      finalDuration: null
    });

    timerIntervalRef.current = setInterval(() => {
      if (analysisStartTimeRef.current) {
        const elapsed = (performance.now() - analysisStartTimeRef.current) / 1000;
        setAnalysisTimer({
          elapsedSeconds: elapsed.toFixed(1),
          status: 'running',
          finalDuration: null
        });
      }
    }, 50);
  };

  const stopAnalysisTimer = (statusMode = 'completed') => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    const endTime = performance.now();
    const startTime = analysisStartTimeRef.current || endTime;
    const duration = ((endTime - startTime) / 1000).toFixed(1);

    setAnalysisTimer({
      elapsedSeconds: duration,
      status: statusMode,
      finalDuration: duration
    });
  };

  const resetAnalysisTimer = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    analysisStartTimeRef.current = null;
    setAnalysisTimer({
      elapsedSeconds: '0.0',
      status: 'idle',
      finalDuration: null
    });
  };

  // Synchronize theme attribute on HTML root element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('sightai_theme', theme);
  }, [theme]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, []);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Check Backend Health on mount & ensure fresh state startup
  useEffect(() => {
    checkBackendHealth();
    try {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    } catch (e) {}
  }, []);

  const checkBackendHealth = async () => {
    try {
      const res = await getHealth();
      setApiConnected(true);
      setApiConfigured(res.api_key_configured);
    } catch (err) {
      console.warn('Backend server connection issue:', err);
      setApiConnected(false);
      setApiConfigured(false);
    }
  };

  // Helper to format clean display timestamps
  const getFormattedTimestamp = () => {
    const d = new Date();
    const day = d.getDate().toString().padStart(2, '0');
    const month = d.toLocaleString('en-US', { month: 'short' });
    const year = d.getFullYear();
    const timeStr = d.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    return {
      iso: d.toISOString(),
      formatted: `${day} ${month} ${year} • ${timeStr}`
    };
  };

  // Handle Image File Selection
  const handleFileSelect = (file) => {
    activeRequestId.current = Date.now();
    resetAnalysisTimer();
    setSelectedFile(file);
    setAnalysisResult(null);
    setSafetyResult(null);
    setQaHistory([]);
    setEditSafetyResult(null);
    setGlobalError(null);
    setIsAnalyzing(false);

    // Read File into Base64 Data URI
    const reader = new FileReader();
    reader.onload = (e) => {
      const b64Data = e.target.result;
      setImagePreview(b64Data);

      // Measure dimensions
      const img = new Image();
      img.onload = () => {
        setImageDimensions({ width: img.width, height: img.height });
      };
      img.src = b64Data;

      const ts = getFormattedTimestamp();

      // Initialize Version 0 (Original Upload) with backend/server timestamp compatibility
      const initialVer = {
        version_id: 'v0',
        version_number: 0,
        image_base64: b64Data,
        edit_prompt: 'Original Upload',
        source_version_number: 0,
        parent_version_id: 'v0',
        created_at: ts.iso,
        formatted_time: ts.formatted
      };
      setVersionHistory([initialVer]);
      setActiveVersionNum(0);
      setSourceVersionNum(0);
    };
    reader.readAsDataURL(file);
  };

  // Remove Selected Image & clear session storage
  const handleRemoveImage = () => {
    activeRequestId.current = Date.now();
    resetAnalysisTimer();
    setSelectedFile(null);
    setImagePreview(null);
    setImageDimensions(null);
    setAnalysisResult(null);
    setSafetyResult(null);
    setVersionHistory([]);
    setActiveVersionNum(0);
    setSourceVersionNum(0);
    setQaHistory([]);
    setEditSafetyResult(null);
    setGlobalError(null);
    setIsAnalyzing(false);
    try {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    } catch (e) {}
  };

  // Trigger AI Vision Analysis Pipeline
  const handleAnalyze = async () => {
    if (!selectedFile && !imagePreview) return;

    const reqId = Date.now();
    activeRequestId.current = reqId;

    setIsAnalyzing(true);
    startAnalysisTimer();
    setGlobalError(null);
    setSafetyResult(null);

    // Step 1: Validating
    setProgressStep('validating');
    await new Promise(r => setTimeout(r, 200));
    if (activeRequestId.current !== reqId) return;

    // Step 2: Safety screening
    setProgressStep('safety');
    await new Promise(r => setTimeout(r, 200));
    if (activeRequestId.current !== reqId) return;

    // Step 3: Understanding image
    setProgressStep('understanding');

    try {
      setProgressStep('verifying');
      
      let res;
      if (selectedFile) {
        res = await analyzeImage(selectedFile);
      } else if (imagePreview) {
        // Fallback for restored base64 image
        const blob = await (await fetch(imagePreview)).blob();
        const dummyFile = new File([blob], "restored_image.jpg", { type: "image/jpeg" });
        res = await analyzeImage(dummyFile);
      }

      if (activeRequestId.current !== reqId) return;

      setProgressStep('preparing');
      await new Promise(r => setTimeout(r, 200));

      if (res && res.success) {
        setAnalysisResult(res.data);
        setSafetyResult(res.safety || { is_safe: true, category: 'SAFE' });
        stopAnalysisTimer('completed');
      } else if (res) {
        stopAnalysisTimer('failed');
        if (res.safety && !res.safety.is_safe && res.safety.category !== 'UNKNOWN') {
          setSafetyResult(res.safety);
        } else {
          setGlobalError(res.error || 'Image analysis encountered an error.');
        }
      }
    } catch (err) {
      if (activeRequestId.current !== reqId) return;

      stopAnalysisTimer('failed');
      console.error('Analysis error:', err);
      let errMsg = err.response?.data?.detail || err.response?.data?.error || err.message || 'Analysis failed.';
      
      if (err.code === 'ECONNABORTED' || (errMsg && errMsg.toLowerCase().includes('timeout'))) {
        errMsg = 'Analysis took longer than expected due to high image complexity or network latency. Please click "Analyze Image" again to retry.';
      }

      const returnedSafety = err.response?.data?.safety;
      if (returnedSafety && !returnedSafety.is_safe && returnedSafety.category !== 'UNKNOWN') {
        setSafetyResult(returnedSafety);
      } else {
        setGlobalError(errMsg);
      }
    } finally {
      if (activeRequestId.current === reqId) {
        setIsAnalyzing(false);
      }
    }
  };

  // Trigger AI Image Edit
  const handleGenerateEdit = async (instructionText) => {
    const baseVerObj = versionHistory.find(v => v.version_number === sourceVersionNum) || versionHistory[0];
    if (!baseVerObj) return;

    setIsEditing(true);
    setEditSafetyResult(null);
    setGlobalError(null);

    try {
      const res = await editImage({
        imageBase64: baseVerObj.image_base64,
        instruction: instructionText,
        visionContextJson: analysisResult,
        sourceVersionNumber: sourceVersionNum
      });

      if (res.success && res.is_safe && res.image_base64) {
        // Safe generated edit -> Create next version record with backend server timestamp
        const nextVerNum = Math.max(...versionHistory.map(v => v.version_number), 0) + 1;
        const ts = getFormattedTimestamp();

        const newVerRec = {
          version_id: res.version_id || `v${nextVerNum}`,
          version_number: nextVerNum,
          image_base64: res.image_base64,
          edit_prompt: instructionText.strip ? instructionText.strip() : instructionText,
          source_version_number: sourceVersionNum,
          parent_version_id: `v${sourceVersionNum}`,
          created_at: res.created_at || ts.iso,
          formatted_time: res.formatted_time || ts.formatted
        };

        setVersionHistory(prev => [...prev, newVerRec]);
        setActiveVersionNum(nextVerNum);
        setSourceVersionNum(nextVerNum);
        setActiveTab('history');
      } else {
        setEditSafetyResult(res.safety || { is_safe: false, error: res.error || 'Generated edit was rejected by safety gate.' });
      }
    } catch (err) {
      console.error('Edit error:', err);
      const errMsg = err.response?.data?.detail || err.response?.data?.error || err.message || 'Image edit failed.';
      if (err.response?.data?.safety) {
        setEditSafetyResult(err.response.data.safety);
      } else {
        setGlobalError(`Image Edit Failed: ${errMsg}`);
      }
    } finally {
      setIsEditing(false);
    }
  };

  // Active Version Object
  const activeVersionObj = versionHistory.find(v => v.version_number === activeVersionNum) || versionHistory[0];

  // Trigger Grounded Gemini Ask AI Agent Q&A
  const handleAskQuestion = async (questionText) => {
    setIsAsking(true);
    setGlobalError(null);

    try {
      const activeBase64 = activeVersionObj?.image_base64 || imagePreview;

      const res = await researchWithAgent({
        question: questionText,
        imageBase64: activeBase64,
        imageContext: analysisResult,
        conversationHistory: qaHistory
      });

      if (res.success) {
        setQaHistory(prev => [
          ...prev,
          {
            question: questionText,
            answer: res.answer,
            intent: res.intent || 'GENERAL_KNOWLEDGE',
            used_tools: res.used_tools || [],
            sources: res.sources || [],
            confidence: res.confidence || 'high',
            requires_research: res.requires_research || false,
            entity: res.entity || null
          }
        ]);
      } else {
        setGlobalError(`Ask AI Agent Error: ${res.error || 'Failed to generate response.'}`);
      }
    } catch (err) {
      console.error('Q&A error:', err);
      const errMsg = err.response?.data?.detail || err.message || 'Unable to process question.';
      setGlobalError(`Ask AI Error: ${errMsg}`);
    } finally {
      setIsAsking(false);
    }
  };

  // Handle Image Download
  const handleDownload = async (versionObj, formatType) => {
    try {
      const blobData = await exportImage({
        imageBase64: versionObj.image_base64,
        formatType: formatType || 'JPEG'
      });

      const ext = formatType === 'PDF' ? 'pdf' : formatType === 'PNG' ? 'png' : 'jpg';
      const url = window.URL.createObjectURL(new Blob([blobData]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `image_v${versionObj.version_number}.${ext}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Download error:', err);
      setGlobalError('Failed to download image file.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        apiConnected={apiConnected}
        apiConfigured={apiConfigured}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      {/* Main Content Area */}
      <main className="app-container" style={{ flex: 1 }}>
        <HeroSection />

        {/* Global Error Banner */}
        {globalError && (
          <div style={{
            background: 'var(--danger-bg)',
            border: '1px solid var(--danger-border)',
            borderRadius: 'var(--radius-md)',
            padding: '0.85rem 1.1rem',
            color: 'var(--danger-text)',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.9rem'
          }}>
            <span>{globalError}</span>
            <button
              onClick={() => setGlobalError(null)}
              style={{ background: 'none', border: 'none', color: 'var(--danger-text)', cursor: 'pointer', fontWeight: 700 }}
            >
              ✕
            </button>
          </div>
        )}

        {/* Primary Image Upload Workspace */}
        <ImageUploader
          selectedFile={selectedFile}
          imagePreview={imagePreview}
          imageDimensions={imageDimensions}
          onFileSelect={handleFileSelect}
          onRemoveImage={handleRemoveImage}
          onAnalyze={handleAnalyze}
          isAnalyzing={isAnalyzing}
          apiConfigured={apiConfigured}
          analysisTimer={analysisTimer}
        />

        {/* Multi-Step Analysis Progress */}
        {isAnalyzing && <AnalysisProgress currentStep={progressStep} />}

        {/* Safety Gate Warning Banner (If Input Image Unsafe) */}
        {safetyResult && !safetyResult.is_safe && (
          <SafetyStatus safetyResult={safetyResult} onReset={handleRemoveImage} />
        )}

        {/* MAIN TAB WORKSPACES */}
        {imagePreview && (safetyResult === null || safetyResult?.is_safe) && (
          <>
            {/* TAB 1: ANALYZE */}
            {activeTab === 'analyze' && (
              <div>
                {!analysisResult ? (
                  <EmptyState type="pending_analysis" onAction={handleAnalyze} />
                ) : (
                  <AnalysisWorkspace
                    analysisResult={analysisResult}
                    imagePreview={imagePreview}
                  />
                )}
              </div>
            )}

            {/* TAB 2: EDIT */}
            {activeTab === 'edit' && (
              <div>
                <ImageEditor
                  versionHistory={versionHistory}
                  sourceVersionNum={sourceVersionNum}
                  onSelectSourceVersion={setSourceVersionNum}
                  onGenerateEdit={handleGenerateEdit}
                  isEditing={isEditing}
                  editSafetyResult={editSafetyResult}
                  analysisData={analysisResult}
                  apiConfigured={apiConfigured}
                />

                {/* Comparison View */}
                {activeVersionObj && (
                  <ImageComparison
                    originalImage={imagePreview}
                    activeVersion={activeVersionObj}
                  />
                )}
              </div>
            )}

            {/* TAB 3: ASK AI */}
            {activeTab === 'ask' && (
              <AskAI
                qaHistory={qaHistory}
                onAskQuestion={handleAskQuestion}
                isAsking={isAsking}
                apiConfigured={apiConfigured}
              />
            )}

            {/* TAB 4: VERSION HISTORY */}
            {activeTab === 'history' && (
              <div>
                <VersionHistory
                  versionHistory={versionHistory}
                  activeVersionNum={activeVersionNum}
                  onMakeActive={setActiveVersionNum}
                  onUseAsSource={(vNum) => {
                    setSourceVersionNum(vNum);
                    setActiveTab('edit');
                  }}
                  onDownload={handleDownload}
                />

                {/* Comparison View */}
                {activeVersionObj && (
                  <ImageComparison
                    originalImage={imagePreview}
                    activeVersion={activeVersionObj}
                  />
                )}
              </div>
            )}
          </>
        )}

        {/* Empty State when no file uploaded */}
        {!imagePreview && <EmptyState type="upload" />}
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-color)',
        padding: '1.5rem',
        textAlign: 'center',
        color: 'var(--text-secondary)',
        fontSize: '0.8rem',
        marginTop: '3rem',
        background: 'var(--nav-bg)',
        transition: 'background var(--transition-normal)'
      }}>
        <div style={{ maxWidth: '1320px', margin: '0 auto' }}>
          SightAI —  Multimodal Vision & Gemini AI Agent
        </div>
      </footer>
    </div>
  );
}

export default App;
