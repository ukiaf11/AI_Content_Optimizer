import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, AlertTriangle, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';

interface RevisionCompareProps {
  originalId: string;
  revisionId: string;
  onBack: () => void;
  apiUrl: string;
}

export default function RevisionCompare({ originalId, revisionId, onBack, apiUrl }: RevisionCompareProps) {
  const [originalReport, setOriginalReport] = useState<any>(null);
  const [revisionReport, setRevisionReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const [res1, res2] = await Promise.all([
        fetch(`${apiUrl}/api/v1/analyses/${originalId}/report`),
        fetch(`${apiUrl}/api/v1/analyses/${revisionId}/report`)
      ]);
      
      if (res1.ok && res2.ok) {
        setOriginalReport(await res1.json());
        setRevisionReport(await res2.json());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [originalId, revisionId, apiUrl]);

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', gap: '16px' }}>
        <div className="animate-spin" style={{ width: '40px', height: '40px', border: '3px solid var(--accent-primary)', borderTopColor: 'transparent', borderRadius: '50%' }}></div>
        <p style={{ color: 'var(--text-secondary)' }}>Comparing video versions...</p>
      </div>
    );
  }

  if (!originalReport || !revisionReport) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
        <h3>Error Loading Comparison</h3>
        <p style={{ margin: '8px 0 20px 0' }}>One of the versions failed to load.</p>
        <button onClick={onBack} className="btn btn-secondary">Go Back</button>
      </div>
    );
  }

  const origScore = originalReport.score;
  const revScore = revisionReport.score;

  const getDelta = (orig: number, rev: number) => {
    const diff = rev - orig;
    if (diff > 0) return { text: `+${diff}`, color: 'var(--success)', icon: <TrendingUp size={14} /> };
    if (diff < 0) return { text: `${diff}`, color: 'var(--danger)', icon: <TrendingDown size={14} /> };
    return { text: '0', color: 'var(--text-muted)', icon: null };
  };

  const getScoreColor = (val: number) => {
    if (val >= 80) return 'var(--success)';
    if (val >= 60) return 'var(--warning)';
    return 'var(--danger)';
  };

  const scoreKeys = [
    { key: 'overall', label: 'Overall Quality' },
    { key: 'hook', label: 'Hook Retention' },
    { key: 'clarity', label: 'Topic Clarity' },
    { key: 'pacing', label: 'Pacing / Edits' },
    { key: 'visual', label: 'Visual Quality' },
    { key: 'audio', label: 'Audio Clarity' },
    { key: 'accessibility', label: 'Accessibility' },
    { key: 'searchability', label: 'SEO Searchability' },
    { key: 'engagement', label: 'Engagement CTA' }
  ];

  return (
    <div className="animate-fade-in" style={{ padding: '16px 0 40px 0' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
        <button onClick={onBack} className="btn btn-secondary" style={{ padding: '8px', borderRadius: '50%' }}>
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 style={{ fontSize: '2rem', fontFamily: 'var(--font-display)' }}>Revision Comparison</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Compare metrics between original draft and edited revision side-by-side.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        
        {/* Left Side: Score Changes list */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', fontFamily: 'var(--font-display)' }}>Score Differences</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {scoreKeys.map(s => {
              const oVal = origScore[s.key] || 0;
              const rVal = revScore[s.key] || 0;
              const delta = getDelta(oVal, rVal);
              
              return (
                <div 
                  key={s.key} 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between', 
                    padding: '12px 16px', 
                    background: s.key === 'overall' ? 'rgba(255,255,255,0.03)' : 'transparent',
                    border: s.key === 'overall' ? '1px solid var(--border-glow-active)' : '1px solid var(--border-glow)',
                    borderRadius: '8px'
                  }}
                >
                  <div>
                    <p style={{ fontWeight: s.key === 'overall' ? 700 : 500, fontSize: '0.95rem' }}>{s.label}</p>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                      Original: <strong style={{ color: '#fff' }}>{oVal}</strong> | Revision: <strong style={{ color: '#fff' }}>{rVal}</strong>
                    </span>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: delta.color, fontWeight: 700 }}>
                    {delta.icon}
                    <span>{delta.text}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Visual compare & resolved list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Quick files overview card */}
          <div className="glass-panel" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', fontFamily: 'var(--font-display)' }}>Iteration Files</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ padding: '12px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-glow)', borderRadius: '8px' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>Original draft</p>
                <p style={{ fontSize: '0.88rem', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{originalReport.media.original_filename}</p>
                <span style={{ fontSize: '0.8rem', color: getScoreColor(origScore.overall), fontWeight: 700 }}>{origScore.overall}/100</span>
              </div>
              <div style={{ padding: '12px', background: 'var(--accent-primary-glow)', border: '1px solid var(--border-glow-active)', borderRadius: '8px' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>Revision draft</p>
                <p style={{ fontSize: '0.88rem', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{revisionReport.media.original_filename}</p>
                <span style={{ fontSize: '0.8rem', color: getScoreColor(revScore.overall), fontWeight: 700 }}>{revScore.overall}/100</span>
              </div>
            </div>
          </div>

          {/* Resolutions summary card */}
          <div className="glass-panel" style={{ padding: '24px', flex: 1 }}>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '16px', fontFamily: 'var(--font-display)' }}>Resolved Issues Summary</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {originalReport.findings.filter((f: any) => f.severity === 'high').map((f: any) => {
                // If overall revision score went up by at least 3 points, hypothesize these are resolved
                const isResolved = (revScore.overall - origScore.overall) >= 3;
                return (
                  <div key={f.id} style={{ display: 'flex', gap: '12px', padding: '12px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-glow)', borderRadius: '8px', alignItems: 'flex-start' }}>
                    {isResolved ? (
                      <CheckCircle size={18} style={{ color: 'var(--success)', marginTop: '2px', flexShrink: 0 }} />
                    ) : (
                      <AlertTriangle size={18} style={{ color: 'var(--warning)', marginTop: '2px', flexShrink: 0 }} />
                    )}
                    <div>
                      <p style={{ fontSize: '0.88rem', fontWeight: 600, color: '#fff' }}>{f.title}</p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{f.recommendation}</p>
                      <span style={{ display: 'inline-block', fontSize: '0.72rem', color: isResolved ? 'var(--success)' : 'var(--warning)', fontWeight: 600, marginTop: '6px' }}>
                        {isResolved ? 'RESOLVED / IMPROVED' : 'POTENTIALLY UNRESOLVED'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
