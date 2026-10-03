import React, { useState } from 'react';
import ObjectDetectionViewer from './ObjectDetectionViewer';
import DetectedObjectsPanel from './DetectedObjectsPanel';
import SummaryCard from './SummaryCard';
import SceneCard from './SceneCard';
import ObjectInstanceCard from './ObjectInstanceCard';
import StatsCards from './StatsCards';

const AnalysisWorkspace = ({ analysisResult, imagePreview }) => {
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

  return (
    <div>
      {/* Top Level Quick Metrics */}
      <StatsCards analysisData={analysisResult} />

      {/* Main Two-Column Analysis Grid */}
      <div className="grid-2" style={{ marginBottom: '1.5rem', alignItems: 'stretch' }}>
        {/* Left Column: Interactive Image Viewer with Bounding Boxes */}
        <div>
          <ObjectDetectionViewer
            imageSrc={imagePreview}
            categories={analysisResult.objects || []}
            selectedCategory={selectedCategory}
            selectedInstance={selectedInstance}
            hoveredInstance={hoveredInstance}
            onSelectCategory={handleSelectCategory}
            onSelectInstance={handleSelectInstance}
            onHoverInstance={setHoveredInstance}
          />
        </div>

        {/* Right Column: AI Executive Summary & Interactive Object Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <SummaryCard summary={analysisResult.overall_summary} />

          <DetectedObjectsPanel
            categories={analysisResult.objects || []}
            selectedCategory={selectedCategory}
            selectedInstance={selectedInstance}
            hoveredInstance={hoveredInstance}
            onSelectCategory={handleSelectCategory}
            onSelectInstance={handleSelectInstance}
            onHoverInstance={setHoveredInstance}
          />

          <SceneCard scene={analysisResult.scene} />
        </div>
      </div>

      {/* Detailed Object Instances Breakdown */}
      <div style={{ marginTop: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#F8FAFC' }}>
            Object Details & Independent Instances
          </h3>
          {selectedCategory && (
            <span style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600 }}>
              Filtering: {selectedCategory} {selectedInstance ? `(${selectedInstance})` : ''}
            </span>
          )}
        </div>

        {analysisResult.objects && analysisResult.objects.length > 0 ? (
          analysisResult.objects
            .filter(cat => !selectedCategory || cat.name.toLowerCase() === selectedCategory.toLowerCase())
            .map((cat, idx) => (
              <ObjectInstanceCard
                key={cat.name || idx}
                category={cat}
                selectedInstance={selectedInstance}
                onSelectInstance={handleSelectInstance}
              />
            ))
        ) : (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            No detailed object instances found.
          </p>
        )}
      </div>
    </div>
  );
};

export default AnalysisWorkspace;
