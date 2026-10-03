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

import { getHealth, analyzeImage, editImage, askQuestion, researchWithAgent, exportImage } from './services/api';

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
  const [userRegion, setUserRegion] = useState('Global');

  // Theme System State ('light' default, or persisted preference)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('sightai_theme') || 'light';
  });

  // Global Error Alert
  const [globalError, setGlobalError] = useState(null);

  // Request ID Ref to prevent race conditions & stale response overwrites
  const activeRequestId = useRef(0);

  // Synchronize theme attribute on HTML root element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('sightai_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Check Backend Health on mount
  useEffect(() => {
    checkBackendHealth();
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

  // Handle Image File Selection
  const handleFileSelect = (file) => {
    activeRequestId.current = Date.now(); // Invalidate any running analysis request
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

      // Initialize Version 0 (Original Upload)
      const initialVer = {
        version_number: 0,
        image_base64: b64Data,
        edit_prompt: 'Original Upload',
        source_version_number: 0,
        created_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      };
      setVersionHistory([initialVer]);
      setActiveVersionNum(0);
      setSourceVersionNum(0);
    };
    reader.readAsDataURL(file);
  };

  // Remove Selected Image
  const handleRemoveImage = () => {
    activeRequestId.current = Date.now(); // Invalidate any running analysis request
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
  };

  // Trigger AI Vision Analysis Pipeline
  const handleAnalyze = async () => {
    if (!selectedFile || isAnalyzing) return;

    const reqId = Date.now();
    activeRequestId.current = reqId;

    setIsAnalyzing(true);
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
      // Step 4: Verifying objects & bounding boxes
      setProgressStep('verifying');
      const res = await analyzeImage(selectedFile);

      if (activeRequestId.current !== reqId) {
        console.warn('Discarding stale analysis response from previous image.');
        return;
      }

      // Step 5: Preparing results
      setProgressStep('preparing');
      await new Promise(r => setTimeout(r, 200));

      if (res.success) {
        setAnalysisResult(res.data);
        setSafetyResult(res.safety || { is_safe: true, category: 'SAFE' });
      } else {
        setSafetyResult(res.safety || { is_safe: false, category: 'UNSAFE', error: res.error });
      }
    } catch (err) {
      if (activeRequestId.current !== reqId) return;

      console.error('Analysis error:', err);
      let errMsg = err.response?.data?.detail || err.response?.data?.error || err.message || 'Analysis failed.';
      
      if (err.code === 'ECONNABORTED' || (errMsg && errMsg.toLowerCase().includes('timeout'))) {
        errMsg = 'Analysis took longer than expected due to high image complexity or network latency. Please click "Analyze Image" again to retry.';
      }

      if (err.response?.data?.safety) {
        setSafetyResult(err.response.data.safety);
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
        visionContextJson: analysisResult
      });

      if (res.success && res.is_safe && res.image_base64) {
        // Safe generated edit -> Create next version
        const nextVerNum = Math.max(...versionHistory.map(v => v.version_number), 0) + 1;
        const newVerRec = {
          version_number: nextVerNum,
          image_base64: res.image_base64,
          edit_prompt: instructionText,
          source_version_number: sourceVersionNum,
          created_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        };

        setVersionHistory(prev => [...prev, newVerRec]);
        setActiveVersionNum(nextVerNum);
        setSourceVersionNum(nextVerNum);
        setActiveTab('history');
      } else {
        // Unsafe edit -> Reject output image, preserve history
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



  // Trigger Grounded AI Research Agent Q&A
  const handleAskQuestion = async (questionText) => {
    setIsAsking(true);
    setGlobalError(null);

    try {
      const res = await researchWithAgent({
        question: questionText,
        imageContext: analysisResult,
        conversationHistory: qaHistory,
        userRegion: userRegion
      });

      if (res.success) {
        setQaHistory(prev => [
          ...prev,
          {
            question: questionText,
            answer: res.answer,
            used_tools: res.used_tools || [],
            sources: res.sources || [],
            confidence: res.confidence || 'high',
            requires_research: res.requires_research || false
          }
        ]);
      } else {
        setGlobalError(`Research Agent Error: ${res.error || 'Failed to generate research response.'}`);
      }
    } catch (err) {
      console.error('Q&A error:', err);
      const errMsg = err.response?.data?.detail || err.message || 'Unable to process question.';
      setGlobalError(`Visual Q&A Error: ${errMsg}`);
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

  // Active Version Object
  const activeVersionObj = versionHistory.find(v => v.version_number === activeVersionNum) || versionHistory[0];

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
            color: 'var(--danger)',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.9rem'
          }}>
            <span>{globalError}</span>
            <button
              onClick={() => setGlobalError(null)}
              style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontWeight: 700 }}
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
        />

        {/* Multi-Step Analysis Progress */}
        {isAnalyzing && <AnalysisProgress currentStep={progressStep} />}

        {/* Safety Gate Warning Banner (If Input Image Unsafe) */}
        {safetyResult && !safetyResult.is_safe && (
          <SafetyStatus safetyResult={safetyResult} onReset={handleRemoveImage} />
        )}

        {/* MAIN TAB WORKSPACES */}
        {selectedFile && safetyResult?.is_safe && (
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
                imageContext={analysisResult}
                userRegion={userRegion}
                setUserRegion={setUserRegion}
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
        {!selectedFile && <EmptyState type="upload" />}
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-color)',
        padding: '1.5rem',
        textAlign: 'center',
        color: 'var(--text-subtle)',
        fontSize: '0.8rem',
        marginTop: '3rem',
        background: 'var(--nav-bg)',
        transition: 'background var(--transition-normal)'
      }}>
        <div style={{ maxWidth: '1320px', margin: '0 auto' }}>
          SightAI — Enterprise Multimodal Vision & AI Research Agent
        </div>
      </footer>
    </div>
  );
}

export default App;
