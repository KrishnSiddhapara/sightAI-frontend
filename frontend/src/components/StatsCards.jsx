import React from 'react';

const StatsCards = ({ analysisData, analysisTimer }) => {
  if (!analysisData) return null;

  const objects = analysisData.objects || [];
  const totalObjectsCount = objects.reduce((sum, cat) => sum + (cat.confirmed_count || 0), 0);

  let localizedCount = 0;
  objects.forEach(cat => {
    (cat.instances || []).forEach(inst => {
      if (inst.bounding_box) localizedCount++;
    });
  });
  
  const personCategories = objects.filter(cat => cat.name.toLowerCase() === 'person');
  const totalPeopleCount = personCategories.reduce((sum, cat) => sum + (cat.confirmed_count || 0), 0);

  const durationStr = analysisTimer?.finalDuration
    ? `${analysisTimer.finalDuration}s`
    : (analysisData.performance?.total_seconds ? `${analysisData.performance.total_seconds}s` : 'N/A');

  const stats = [
    { label: 'Objects Verified', value: totalObjectsCount },
    { label: 'Spatial Bounding Boxes', value: localizedCount },
    { label: 'People Count', value: totalPeopleCount },
    { label: 'Analysis Time', value: durationStr },
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
      gap: '1rem',
      marginBottom: '1.5rem'
    }}>
      {stats.map((stat, i) => (
        <div
          key={i}
          className="card-glass"
          style={{
            padding: '1rem 1.25rem',
            background: 'var(--bg-surface)'
          }}
        >
          <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', fontWeight: 600, uppercase: 'true', display: 'block', marginBottom: '0.25rem' }}>
            {stat.label}
          </span>
          <span style={{
            fontSize: '1.35rem',
            fontWeight: 800,
            color: 'var(--heading)',
            letterSpacing: '-0.02em',
            fontFamily: stat.label === 'Analysis Time' ? 'var(--font-mono)' : 'inherit'
          }}>
            {stat.value}
          </span>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
