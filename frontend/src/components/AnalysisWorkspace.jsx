import React, { useState } from 'react';
import ObjectDetectionViewer from './ObjectDetectionViewer';
import DetectedObjectsPanel from './DetectedObjectsPanel';
import SummaryCard from './SummaryCard';
import SceneCard from './SceneCard';
import ObjectInstanceCard from './ObjectInstanceCard';
import StatsCards from './StatsCards';

const AnalysisWorkspace = ({ analysisResult, imagePreview }) => {
  // Requirement 6 & 7: Object Detection HIDDEN BY DEFAULT
  const [showObjectDetection, setShowObjectDetection] = useState(false);
  
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedInstance, setSelectedInstance] = useState(null);
  const [hoveredInstance, setHoveredInstance] = useState(null);

  if (!analysisResult) return null;

  const handleSelectCategory = (catName) => {
    setSelectedCategory(catName);
    setSelectedInstance(null);
  };

  const handleSelectInstance = (instanceId, catName) => {
    setSelectedInstance(instanceId);
    if (catName) {
      setSelectedCategory(catName);
    }
  };

  const objects = analysisResult.objects || [];
  const totalObjectsCount = objects.reduce((sum, cat) => sum + (cat.confirmed_count || 0), 0);

  return (
    <div>
      {/* Top Level Quick Metrics */}
      <StatsCards analysisData={analysisResult} />

      {/* Main Analysis Layout */}
      <div className="grid-2" style={{ marginBottom: '1.5rem', alignItems: 'stretch' }}>
        {/* Left Column: Image Viewer with Toggleable Bounding Box Overlay */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <ObjectDetectionViewer
            imageSrc={imagePreview}
            categories={analysisResult.objects || []}
            showObjectDetection={showObjectDetection}
            selectedCategory={selectedCategory}
            selectedInstance={selectedInstance}
            hoveredInstance={hoveredInstance}
            onSelectInstance={handleSelectInstance}
            onHoverInstance={setHoveredInstance}
          />

          {/* Requirement 7: Object Detection Control Button */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-surface)', padding: '0.85rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--heading)', display: 'block' }}>
                Spatial Object Detection
              </span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                {totalObjectsCount} object{totalObjectsCount === 1 ? '' : 's'} verified in scene
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                const nextState = !showObjectDetection;
                setShowObjectDetection(nextState);
                if (!nextState) {
                  setSelectedCategory(null);
                  setSelectedInstance(null);
                }
              }}
              className={showObjectDetection ? 'btn-secondary' : 'btn-primary'}
              style={{ fontSize: '0.875rem', padding: '0.55rem 1.15rem' }}
            >
              {showObjectDetection ? 'Hide Object Detection' : 'View Object Detection'}
            </button>
          </div>
        </div>

        {/* Right Column: Scene Understanding, Executive Summary & Object Controls (when ON) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <SceneCard scene={analysisResult.scene} />

          <SummaryCard summary={analysisResult.overall_summary} />

          {/* Detected Objects Panel - Rendered ONLY when Object Detection is ON */}
          {showObjectDetection && (
            <DetectedObjectsPanel
              categories={analysisResult.objects || []}
              selectedCategory={selectedCategory}
              selectedInstance={selectedInstance}
              hoveredInstance={hoveredInstance}
              onSelectCategory={handleSelectCategory}
              onSelectInstance={handleSelectInstance}
              onHoverInstance={setHoveredInstance}
            />
          )}
        </div>
      </div>

      {/* Detailed Object Instances Section - Rendered ONLY when Object Detection is ON */}
      {showObjectDetection && (
        <div style={{ marginTop: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--heading)' }}>
              Object Instance Details
            </h3>
            {selectedCategory && (
              <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600 }}>
                Filter: {selectedCategory} {selectedInstance ? `(${selectedInstance})` : ''}
              </span>
            )}
          </div>

          {analysisResult.objects && analysisResult.objects.length > 0 ? (
            analysisResult.objects
              .filter(cat => !selectedCategory || cat.name.toLowerCase() === selectedCategory.toLowerCase())
              .map((cat) => (
                <ObjectInstanceCard
                  key={cat.name}
                  category={cat}
                  selectedInstance={selectedInstance}
                  onSelectInstance={handleSelectInstance}
                />
              ))
          ) : (
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              No detailed object instances found.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default AnalysisWorkspace;
