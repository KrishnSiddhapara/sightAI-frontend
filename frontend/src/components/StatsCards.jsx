import React from 'react';
import { Box, Users, MapPin, CheckCircle2 } from 'lucide-react';

const StatsCards = ({ analysisData }) => {
  if (!analysisData) return null;

  const objects = analysisData.objects || [];
  const totalObjectsCount = objects.reduce((sum, cat) => sum + (cat.confirmed_count || 0), 0);
  
  const personCategories = objects.filter(cat => cat.name.toLowerCase() === 'person');
  const totalPeopleCount = personCategories.reduce((sum, cat) => sum + (cat.confirmed_count || 0), 0);

  const sceneCategory = analysisData.scene?.category || 'General Scene';

  const stats = [
    { label: 'Objects Verified', value: totalObjectsCount, icon: Box, color: '#6366F1' },
    { label: 'People Count', value: totalPeopleCount, icon: Users, color: '#8B5CF6' },
    { label: 'Scene Category', value: sceneCategory, icon: MapPin, color: '#10B981' },
    { label: 'Analysis Status', value: 'Complete', icon: CheckCircle2, color: '#3B82F6' },
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '1.25rem',
      marginBottom: '2rem'
    }}>
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <div
            key={i}
            className="card-glass"
            style={{
              padding: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              background: 'var(--bg-surface)'
            }}
          >
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: `${stat.color}15`,
              border: `1px solid ${stat.color}30`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: stat.color,
              flexShrink: 0
            }}>
              <Icon size={24} />
            </div>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500, display: 'block' }}>
                {stat.label}
              </span>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#F8FAFC', letterSpacing: '-0.02em' }}>
                {stat.value}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;
