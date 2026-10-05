import React, { useState } from 'react';

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
    "Add black sunglasses to person 1",
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

  return (
    <div className="card-glass" style={{ marginBottom: '2rem', padding: '1.5rem' }}>
      <div style={{ marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--heading)' }}>
          AI Image Editor (Multi-Version)
        </h3>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          Instruct Gemini to modify, add, or remove objects with version control (Max image size: 6 MB / 6144 KB)
        </span>
      </div>

      {/* Select Base Version Dropdown */}
      <div style={{ marginBottom: '1.25rem' }}>
        <label style={{
          display: 'block',
          fontSize: '0.85rem',
          fontWeight: 600,
          color: 'var(--text-secondary)',
          marginBottom: '0.4rem'
        }}>
          Select Base Version to Edit:
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
        <span style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', marginTop: '0.35rem', display: 'block' }}>
          Selected base image: <strong>Version {sourceVersionNum}</strong>. Each edit creates a new version.
        </span>
      </div>

      {/* Form Input */}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--heading)', marginBottom: '0.4rem' }}>
            Edit Instruction
          </label>
          <input
            type="text"
            value={instruction}
            onChange={(e) => {
              setInstruction(e.target.value);
              checkAmbiguity(e.target.value);
            }}
            placeholder="e.g. Remove the car / Change person 1's shirt color to blue..."
            className="input-base"
            style={{ fontSize: '0.95rem', padding: '0.75rem 1rem' }}
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
            color: 'var(--warning-text)',
            fontSize: '0.85rem',
            marginBottom: '1rem',
          }}>
            <span>{ambiguityWarning}</span>
          </div>
        )}

        {/* Example Prompt Chips */}
        <div style={{ marginBottom: '1.25rem' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', fontWeight: 600, display: 'block', marginBottom: '0.5rem', uppercase: 'true' }}>
            Quick Prompts:
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {examplePrompts.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handlePromptClick(p)}
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-full)',
                  padding: '0.3rem 0.75rem',
                  color: 'var(--text-secondary)',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                + {p}
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
            padding: '0.85rem 1rem',
            color: 'var(--danger-text)',
            marginBottom: '1.25rem',
          }}>
            <strong style={{ display: 'block', color: 'var(--heading)', marginBottom: '0.2rem', fontSize: '0.9rem' }}>
              Generated Edit Rejected by Safety Gate
            </strong>
            <span style={{ fontSize: '0.85rem' }}>
              {editSafetyResult.error || 'The generated edit contained inappropriate content and was discarded. Previous versions remain safe.'}
            </span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isEditing || !instruction.trim() || !apiConfigured}
          className="btn-primary"
          style={{ width: '100%', padding: '0.75rem 1.5rem', fontSize: '0.95rem' }}
        >
          {isEditing ? 'Generating Edit & Screening Safety...' : 'Generate Edit'}
        </button>
      </form>
    </div>
  );
};

export default ImageEditor;
