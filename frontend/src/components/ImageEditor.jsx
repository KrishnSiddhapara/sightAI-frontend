import React, { useState } from 'react';
import { Sliders, Sparkles, RefreshCw, AlertCircle, Info, Layers } from 'lucide-react';

const ImageEditor = ({
  versionHistory,
  sourceVersionNum,
  onSelectSourceVersion,
  onGenerateEdit,
  isEditing,
  editSafetyResult,
  analysisData,
  apiConfigured
}) => {
  const [instruction, setInstruction] = useState('');
  const [ambiguityWarning, setAmbiguityWarning] = useState(null);

  const examplePrompts = [
    "Add a football next to the person",
    "Change person 1's shirt color to blue",
    "Remove the car from the background",
    "Replace background with a tropical beach",
    "Add black sunglasses to the person",
  ];

  const handlePromptClick = (promptText) => {
    setInstruction(promptText);
    checkAmbiguity(promptText);
  };

  const checkAmbiguity = (text) => {
    if (!text.trim() || !analysisData || !analysisData.objects) {
      setAmbiguityWarning(null);
      return;
    }
    const lower = text.toLowerCase();
    const personKeywords = ["shirt", "t-shirt", "jacket", "pants", "dress", "top", "clothes", "clothing", "hat", "glasses"];
    const mentionsClothing = personKeywords.some(kw => lower.includes(kw));
    const mentionsSpecificPerson = ["person 1", "person 2", "person 3", "first person", "second person", "person on left", "person on right"].some(kw => lower.includes(kw));

    if (mentionsClothing && !mentionsSpecificPerson) {
      const personCats = analysisData.objects.filter(cat => cat.name.toLowerCase() === 'person');
      const totalPeople = personCats.reduce((sum, c) => sum + (c.confirmed_count || 0), 0);
      if (totalPeople > 1) {
        setAmbiguityWarning(`Target tip: The image contains ${totalPeople} people. Consider specifying which person (e.g., 'Change person 1\'s shirt to blue').`);
        return;
      }
    }
    setAmbiguityWarning(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!instruction.trim() || isEditing || !apiConfigured) return;
    onGenerateEdit(instruction.trim());
  };

  // Find source version object
  const currentSourceRec = versionHistory.find(v => v.version_number === sourceVersionNum) || versionHistory[0];

  return (
    <div className="card-glass" style={{ marginBottom: '2rem', padding: '1.75rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
        <Sliders size={22} color="var(--primary)" />
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#F8FAFC' }}>
          ✨ AI Image Editor (Multi-Version)
        </h3>
      </div>

      {/* Select Base Version Dropdown */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          fontSize: '0.9rem',
          fontWeight: 600,
          color: 'var(--text-muted)',
          marginBottom: '0.5rem'
        }}>
          <Layers size={16} color="var(--secondary)" /> Select Base Version to Edit:
        </label>
        <select
          value={sourceVersionNum}
          onChange={(e) => onSelectSourceVersion(Number(e.target.value))}
          className="input-base"
          style={{ cursor: 'pointer' }}
        >
          {versionHistory.map((v) => (
            <option key={v.version_number} value={v.version_number}>
              {v.version_number === 0
                ? 'Version 0: Original Uploaded Image'
                : `Version ${v.version_number}: "${v.edit_prompt}" (Based on v${v.source_version_number})`}
            </option>
          ))}
        </select>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', marginTop: '0.35rem', display: 'block' }}>
          Selected base image: <strong>Version {sourceVersionNum}</strong>. Each edit creates a new immutable version.
        </span>
      </div>

      {/* Form Input */}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#F8FAFC', marginBottom: '0.5rem' }}>
            What would you like to change in the image?
          </label>
          <input
            type="text"
            value={instruction}
            onChange={(e) => {
              setInstruction(e.target.value);
              checkAmbiguity(e.target.value);
            }}
            placeholder="Describe what you want to change (e.g., Remove the car / Change shirt color to blue)..."
            className="input-base"
            style={{ fontSize: '1rem', padding: '0.85rem 1rem' }}
            disabled={isEditing}
          />
        </div>

        {/* Ambiguity Tip */}
        {ambiguityWarning && (
          <div style={{
            background: 'var(--warning-bg)',
            border: '1px solid var(--warning-border)',
            borderRadius: 'var(--radius-md)',
            padding: '0.75rem 1rem',
            color: '#FCD34D',
            fontSize: '0.85rem',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <Info size={16} shrink={0} />
            <span>{ambiguityWarning}</span>
          </div>
        )}

        {/* Example Prompt Chips */}
        <div style={{ marginBottom: '1.5rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>
            💡 Quick Example Prompts:
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {examplePrompts.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handlePromptClick(p)}
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-full)',
                  padding: '0.35rem 0.85rem',
                  color: 'var(--text-muted)',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = 'var(--primary)';
                  e.currentTarget.style.color = '#F8FAFC';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                  e.currentTarget.style.color = 'var(--text-muted)';
                }}
              >
                + "{p}"
              </button>
            ))}
          </div>
        </div>

        {/* Edit Safety Rejection Alert */}
        {editSafetyResult && !editSafetyResult.is_safe && (
          <div style={{
            background: 'var(--danger-bg)',
            border: '1px solid var(--danger-border)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            color: '#FCA5A5',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.75rem'
          }}>
            <AlertCircle size={20} shrink={0} color="#EF4444" style={{ marginTop: '2px' }} />
            <div>
              <strong style={{ display: 'block', color: '#F8FAFC', marginBottom: '0.2rem' }}>
                Generated Edit Rejected by Safety Gate
              </strong>
              <span style={{ fontSize: '0.875rem' }}>
                {editSafetyResult.error || 'The generated edit contained inappropriate or sensitive content and was discarded. Your previous versions remain safe and preserved.'}
              </span>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isEditing || !instruction.trim() || !apiConfigured}
          className="btn-primary"
          style={{ width: '100%', padding: '0.85rem 1.5rem', fontSize: '1.05rem' }}
        >
          {isEditing ? (
            <>
              <RefreshCw size={20} className="animate-spin" /> Generating Edit & Screening Safety...
            </>
          ) : (
            <>
              <Sparkles size={20} /> Generate Edit
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default ImageEditor;
