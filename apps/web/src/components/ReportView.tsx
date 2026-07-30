import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, Check, Copy, Film, Image as ImageIcon, Volume2, 
  Sparkles, Compass, AlertCircle, FileText, Share2, 
  Eye, RefreshCw, BarChart2, Award, Zap, HelpCircle, 
  Smile, ShieldAlert, Monitor, ChevronRight
} from 'lucide-react';

interface RadarChartProps {
  score: {
    hook: number;
    clarity: number;
    pacing: number;
    visual: number;
    audio: number;
    accessibility: number;
    searchability: number;
    engagement: number;
  };
}

function RadarChart({ score }: RadarChartProps) {
  const size = 200;
  const center = size / 2;
  const radius = size / 2 - 25;
  const metrics = [
    { name: 'Hook', val: score.hook },
    { name: 'Clarity', val: score.clarity },
    { name: 'Pacing', val: score.pacing },
    { name: 'Visual', val: score.visual },
    { name: 'Audio', val: score.audio },
    { name: 'Access', val: score.accessibility },
    { name: 'SEO', val: score.searchability },
    { name: 'Engage', val: score.engagement }
  ];

  const getCoordinates = (index: number, value: number) => {
    const angle = (index * 2 * Math.PI) / 8 - Math.PI / 2;
    const distance = radius * (value / 100);
    const x = center + distance * Math.cos(angle);
    const y = center + distance * Math.sin(angle);
    return { x, y };
  };

  const gridLevels = [0.2, 0.4, 0.6, 0.8, 1.0];
  const gridPolygons = gridLevels.map(level => {
    const points = metrics.map((_, i) => {
      const angle = (i * 2 * Math.PI) / 8 - Math.PI / 2;
      const x = center + radius * level * Math.cos(angle);
      const y = center + radius * level * Math.sin(angle);
      return `${x},${y}`;
    }).join(' ');
    return points;
  });

  const scorePoints = metrics.map((m, i) => {
    const coords = getCoordinates(i, m.val);
    return `${coords.x},${coords.y}`;
  }).join(' ');

  return (
    <div style={{ display: 'flex', justifyContent: 'center', margin: '15px 0' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {gridPolygons.map((points, idx) => (
          <polygon
            key={idx}
            points={points}
            fill="none"
            stroke="rgba(255, 255, 255, 0.05)"
            strokeWidth="1"
            strokeDasharray={idx === 4 ? "none" : "2,2"}
          />
        ))}

        {metrics.map((_, i) => {
          const angle = (i * 2 * Math.PI) / 8 - Math.PI / 2;
          const x = center + radius * Math.cos(angle);
          const y = center + radius * Math.sin(angle);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="rgba(255, 255, 255, 0.05)"
              strokeWidth="1"
            />
          );
        })}

        <polygon
          points={scorePoints}
          fill="rgba(99, 102, 241, 0.15)"
          stroke="var(--accent-primary)"
          strokeWidth="2"
        />

        {metrics.map((m, i) => {
          const coords = getCoordinates(i, m.val);
          return (
            <circle
              key={i}
              cx={coords.x}
              cy={coords.y}
              r="4"
              fill="var(--accent-secondary)"
              stroke="#08090C"
              strokeWidth="1.5"
            />
          );
        })}

        {metrics.map((m, i) => {
          const angle = (i * 2 * Math.PI) / 8 - Math.PI / 2;
          const labelDist = radius + 15;
          const x = center + labelDist * Math.cos(angle);
          const y = center + labelDist * Math.sin(angle);
          
          let textAnchor: "start" | "middle" | "end" = "middle";
          if (Math.cos(angle) > 0.1) textAnchor = "start";
          else if (Math.cos(angle) < -0.1) textAnchor = "end";

          return (
            <text
              key={i}
              x={x}
              y={y + 3}
              fill="var(--text-muted)"
              fontSize="9px"
              fontWeight="600"
              textAnchor={textAnchor}
              fontFamily="var(--font-display)"
            >
              {m.name}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

interface ReportViewProps {
  analysisId: string;
  onBack: () => void;
  onStartRevision: (parentAnalysisId: string) => void;
  apiUrl: string;
}

export default function ReportView({ analysisId, onBack, onStartRevision, apiUrl }: ReportViewProps) {
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [copiedTextId, setCopiedTextId] = useState<string | null>(null);
  const [showSafeZone, setShowSafeZone] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${apiUrl}/api/v1/analyses/${analysisId}/report`);
      if (res.ok) {
        const data = await res.json();
        setReport(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [analysisId, apiUrl]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTextId(id);
    setTimeout(() => setCopiedTextId(null), 2000);
  };

  const handleSeek = (ms: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = ms / 1000;
      videoRef.current.play().catch(() => {});
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', gap: '16px' }}>
        <div className="animate-spin" style={{ width: '40px', height: '40px', border: '3px solid var(--accent-primary)', borderTopColor: 'transparent', borderRadius: '50%' }}></div>
        <p style={{ color: 'var(--text-secondary)' }}>Synthesizing creative findings...</p>
      </div>
    );
  }

  if (!report || report.status !== 'completed') {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
        <AlertCircle size={48} style={{ color: 'var(--danger)', marginBottom: '16px' }} />
        <h3>Report Not Found</h3>
        <p style={{ margin: '8px 0 20px 0' }}>This analysis could not be loaded or is in a failed state.</p>
        <button onClick={onBack} className="btn btn-secondary">Go Back</button>
      </div>
    );
  }

  const { media, score, transcript, scenes, findings, generated_assets, revisions } = report;

  // Filter findings for overview
  const highSeverityFindings = findings.filter((f: any) => f.severity === 'high');

  const getSeverityColor = (sev: string) => {
    switch (sev) {
      case 'high': return 'var(--danger)';
      case 'medium': return 'var(--warning)';
      default: return 'var(--accent-secondary)';
    }
  };

  const getScoreColor = (val: number) => {
    if (val >= 80) return 'var(--success)';
    if (val >= 60) return 'var(--warning)';
    return 'var(--danger)';
  };

  const formatTime = (ms: number) => {
    const totalSecs = Math.floor(ms / 1000);
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="animate-fade-in" style={{ padding: '16px 0 40px 0' }}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button onClick={onBack} className="btn btn-secondary" style={{ padding: '8px', borderRadius: '50%' }}>
            <ArrowLeft size={18} />
          </button>
          <div>
            <h2 style={{ fontSize: '1.75rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}>
              {media.original_filename}
              <span style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', padding: '4px 10px', borderRadius: '20px', border: '1px solid var(--border-glow)' }}>
                {report.platform.toUpperCase()} • {report.objective.toUpperCase()}
              </span>
            </h2>
            {report.niche && (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '4px' }}>
                Niche: <strong style={{ color: '#fff' }}>{report.niche}</strong> | Target Audience: <strong style={{ color: '#fff' }}>{report.target_audience}</strong>
              </p>
            )}
          </div>
        </div>

        <button className="btn btn-primary" onClick={() => onStartRevision(analysisId)}>
          <RefreshCw size={16} />
          Upload Revised Version
        </button>
      </div>

      {/* Main Grid: Left Player (40%), Right Info (60%) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px', alignItems: 'start' }}>
        
        {/* Left Side: Player & Media Stats */}
        <div style={{ position: 'sticky', top: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Player Container */}
          <div className="glass-panel" style={{ padding: '12px', overflow: 'hidden' }}>
            <div style={{ position: 'relative', width: '100%', aspectRatio: media.type === 'video' ? (media.width && media.height ? `${media.width}/${media.height}` : '9/16') : '1/1', background: '#000', borderRadius: '12px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {media.type === 'video' ? (
                <video 
                  ref={videoRef}
                  src={`${apiUrl}${media.media_url}`} 
                  controls 
                  playsInline
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              ) : (
                <img src={`${apiUrl}${media.media_url}`} alt="Asset preview" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              )}

              {/* Safe Zone Overlay */}
              {showSafeZone && (
                <div className="video-safe-zone"></div>
              )}
            </div>

            {/* Overlay toggle and Quick info */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', padding: '4px' }}>
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <input 
                  type="checkbox" 
                  checked={showSafeZone} 
                  onChange={e => setShowSafeZone(e.target.checked)}
                  style={{ accentColor: 'var(--accent-primary)' }}
                />
                Show Safe-Zone Overlay
              </label>

              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {media.width}x{media.height} • {media.fps || 30} FPS
              </span>
            </div>
          </div>

          {/* Quick Scorecard Card */}
          <div className="glass-panel" style={{ padding: '20px' }}>
            <h4 style={{ fontSize: '1.05rem', marginBottom: '16px', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BarChart2 size={16} style={{ color: 'var(--accent-primary)' }} />
              Creative Score Breakdown
            </h4>

            {/* Overall Score Dial */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid var(--border-glow)' }}>
              <div className="flex-center" style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'rgba(255,255,255,0.02)', border: `4px solid ${getScoreColor(score.overall)}` }}>
                <span style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>{score.overall}</span>
              </div>
              <div>
                <p style={{ fontWeight: 600, fontSize: '1.05rem' }}>Overall Grade</p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {score.overall >= 80 ? 'Excellent creative setup! Ready to publish.' : score.overall >= 60 ? 'Good, but high-impact optimizations are recommended.' : 'Refining hook and pacing is highly suggested.'}
                </p>
              </div>
            </div>

            {/* Radar Chart Visual Fingerprint */}
            <RadarChart score={score} />

            {/* Sub-scores lists */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              {[
                { name: 'Hook Retention', val: score.hook },
                { name: 'Topic Clarity', val: score.clarity },
                { name: 'Pacing / Edits', val: score.pacing },
                { name: 'Visual Quality', val: score.visual },
                { name: 'Audio Clarity', val: score.audio },
                { name: 'Accessibility', val: score.accessibility },
                { name: 'SEO Keywords', val: score.searchability },
                { name: 'Engagement CTA', val: score.engagement }
              ].map(sub => (
                <div key={sub.name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '4px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{sub.name}</span>
                    <span style={{ fontWeight: 600, color: getScoreColor(sub.val) }}>{sub.val}</span>
                  </div>
                  <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.04)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ width: `${sub.val}%`, height: '100%', background: getScoreColor(sub.val) }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Side: Tabbed analysis pages */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Tab Selector */}
          <div className="glass-panel" style={{ padding: '6px', display: 'flex', gap: '4px', overflowX: 'auto', whiteSpace: 'nowrap' }}>
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'timeline', label: 'Findings Timeline' },
              { id: 'audio_visual', label: 'Video & Audio' },
              { id: 'copy', label: 'Captions & Keywords' },
              { id: 'cta_covers', label: 'Covers & CTAs' },
              { id: 'next_steps', label: 'Next Content' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '10px 16px',
                  borderRadius: '10px',
                  border: 'none',
                  background: activeTab === tab.id ? 'var(--accent-primary)' : 'transparent',
                  color: activeTab === tab.id ? '#fff' : 'var(--text-secondary)',
                  fontWeight: activeTab === tab.id ? 600 : 500,
                  cursor: 'pointer',
                  fontSize: '0.88rem',
                  fontFamily: 'var(--font-display)',
                  transition: 'all 0.2s'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content Box */}
          <div className="glass-panel" style={{ padding: '24px', minHeight: '400px' }}>
            
            {/* 1. OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '8px', fontFamily: 'var(--font-display)' }}>Executive Creative Brief</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: '1.5' }}>
                    Based on analyzing {media.type === 'video' ? 'video pacing, transcript pacing, and framing safe zones' : 'image color compositions and overlays'} for {report.platform}, here are your most important visual and narrative findings.
                  </p>
                </div>

                {/* Major Strengths */}
                <div style={{ padding: '16px', background: 'rgba(16, 185, 129, 0.04)', border: '1px solid rgba(16, 185, 129, 0.1)', borderRadius: '12px' }}>
                  <h4 style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem', marginBottom: '10px' }}>
                    <Award size={18} />
                    Core Strengths (What's working)
                  </h4>
                  <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    <li>Transcript starts immediately in the first frame, maximizing early reader focus.</li>
                    <li>Audio level is clear with distinct pronunciation throughout.</li>
                    <li>Niche-specific framing draws immediate visual eyes to the subject.</li>
                  </ul>
                </div>

                {/* Highest Severity Issues */}
                {highSeverityFindings.length > 0 && (
                  <div>
                    <h4 style={{ color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem', marginBottom: '12px' }}>
                      <ShieldAlert size={18} />
                      Critical Fixes Required
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {highSeverityFindings.map((f: any) => (
                        <div 
                          key={f.id} 
                          style={{ padding: '16px', background: 'rgba(239, 68, 68, 0.03)', border: '1px solid rgba(239, 68, 68, 0.1)', borderRadius: '12px', cursor: f.start_ms !== null ? 'pointer' : 'default' }}
                          onClick={() => f.start_ms !== null && handleSeek(f.start_ms)}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                            <h5 style={{ fontWeight: 600, fontSize: '0.92rem', color: '#fff' }}>{f.title}</h5>
                            {f.start_ms !== null && (
                              <span style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', background: 'var(--accent-primary-glow)', padding: '2px 8px', borderRadius: '4px' }}>
                                Jump to {formatTime(f.start_ms)}
                              </span>
                            )}
                          </div>
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>{f.explanation}</p>
                          <div style={{ borderTop: '1px solid rgba(255,255,255,0.03)', marginTop: '10px', paddingTop: '8px', fontSize: '0.82rem' }}>
                            <strong style={{ color: 'var(--success)' }}>Fix: </strong>
                            <span style={{ color: 'var(--text-primary)' }}>{f.recommendation}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sub-scoring overview text */}
                <div style={{ display: 'flex', gap: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glow)', borderRadius: '12px', padding: '16px', alignItems: 'flex-start' }}>
                  <Zap size={20} style={{ color: 'var(--accent-secondary)', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <p style={{ fontWeight: 600, fontSize: '0.92rem', marginBottom: '4px' }}>Optimization Hypothesis</p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                      Implementing these changes is projected to improve the <strong>{report.objective}</strong> signal by resolving visual blocks and audio pacing delays.
                    </p>
                  </div>
                </div>

                {/* Revisions list */}
                {revisions && revisions.length > 0 && (
                  <div style={{ marginTop: '12px' }}>
                    <h4 style={{ fontSize: '1rem', marginBottom: '12px', fontFamily: 'var(--font-display)' }}>Revision Iterations</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {revisions.map((rev: any) => (
                        <div key={rev.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glow)', borderRadius: '8px' }}>
                          <div>
                            <p style={{ fontSize: '0.88rem', fontWeight: 500 }}>{rev.filename}</p>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              {new Date(rev.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent-secondary)' }}>
                              Score: {rev.score.overall}/100
                            </span>
                            <button 
                              className="btn btn-secondary" 
                              style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                              onClick={() => {
                                // Reload page with the comparison or selected report
                                window.location.search = `?id=${rev.id}`;
                              }}
                            >
                              View
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* 2. TIMELINE TAB */}
            {activeTab === 'timeline' && (
              <div className="animate-fade-in">
                <h3 style={{ fontSize: '1.25rem', marginBottom: '16px', fontFamily: 'var(--font-display)' }}>Interactive Timeline Findings</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '20px' }}>
                  Click on any recommendation below to jump directly to that timestamp in the media player on the left.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', paddingLeft: '16px', borderLeft: '1px solid var(--border-glow)' }}>
                  {findings.map((f: any) => (
                    <div 
                      key={f.id} 
                      onClick={() => f.start_ms !== null && handleSeek(f.start_ms)}
                      style={{ 
                        position: 'relative', 
                        padding: '16px', 
                        background: 'rgba(255,255,255,0.02)', 
                        border: '1px solid var(--border-glow)', 
                        borderRadius: '12px',
                        cursor: f.start_ms !== null ? 'pointer' : 'default',
                        transition: 'all 0.2s'
                      }}
                      className="glass-panel-interactive"
                    >
                      {/* Timeline Dot Marker */}
                      {f.start_ms !== null && (
                        <div style={{ 
                          position: 'absolute', 
                          left: '-23px', 
                          top: '22px', 
                          width: '12px', 
                          height: '12px', 
                          borderRadius: '50%', 
                          background: getSeverityColor(f.severity),
                          border: '3px solid var(--bg-primary)'
                        }}></div>
                      )}

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase', background: getSeverityColor(f.severity) + '1a', color: getSeverityColor(f.severity), border: `1px solid ${getSeverityColor(f.severity)}33` }}>
                          {f.category} • {f.severity}
                        </span>
                        {f.start_ms !== null && (
                          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-primary)' }}>
                            {formatTime(f.start_ms)}
                          </span>
                        )}
                      </div>

                      <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '6px', color: '#fff' }}>{f.title}</h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px', lineHeight: '1.4' }}>{f.explanation}</p>
                      
                      <div style={{ display: 'flex', gap: '4px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        <strong>Evidence: </strong>
                        <span>{f.evidence}</span>
                      </div>

                      <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.03)', fontSize: '0.85rem' }}>
                        <span style={{ color: 'var(--success)', fontWeight: 600 }}>Optimized Fix: </span>
                        <span style={{ color: 'var(--text-primary)' }}>{f.recommendation}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. AUDIO VISUAL TAB */}
            {activeTab === 'audio_visual' && (
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '4px', fontFamily: 'var(--font-display)' }}>Visual Scenes & Dialogue</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>Timeline segmentation of camera scenes alongside transcribed dialogue.</p>
                </div>

                {/* Scenes and Transcript timeline */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {scenes.map((scene: any, idx: number) => {
                    // Find transcript segment matching this scene
                    const matchingText = transcript
                      .filter((t: any) => t.start_ms >= scene.start_ms && t.start_ms < scene.end_ms)
                      .map((t: any) => t.text)
                      .join(' ');
                    
                    return (
                      <div 
                        key={idx}
                        onClick={() => handleSeek(scene.start_ms)}
                        style={{ display: 'grid', gridTemplateColumns: '80px 100px 1fr', gap: '16px', padding: '16px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-glow)', borderRadius: '12px', cursor: 'pointer', alignItems: 'center' }}
                        className="glass-panel-interactive"
                      >
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-primary)', display: 'flex', alignItems: 'center' }}>
                          {formatTime(scene.start_ms)} - {formatTime(scene.end_ms)}
                        </span>

                        {scene.representative_frame_url ? (
                          <img 
                            src={`${apiUrl}${scene.representative_frame_url}`} 
                            alt="Scene visual" 
                            style={{ width: '100px', height: '56px', borderRadius: '6px', objectFit: 'cover', border: '1px solid var(--border-glow)' }}
                          />
                        ) : (
                          <div className="flex-center" style={{ width: '100px', height: '56px', borderRadius: '6px', background: 'rgba(255,255,255,0.02)', border: '1px dashed var(--border-glow)', color: 'var(--text-muted)' }}>
                            <Film size={16} />
                          </div>
                        )}
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <div>
                            <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '2px' }}>Scene Composition</p>
                            <p style={{ fontSize: '0.88rem', color: 'var(--text-primary)' }}>{scene.description}</p>
                          </div>

                          {scene.ocr_text && (
                            <div style={{ padding: '6px 10px', background: 'rgba(0,242,254,0.03)', borderLeft: '2px solid var(--accent-secondary)', fontSize: '0.78rem', color: 'var(--accent-secondary)' }}>
                              <strong>Screen OCR: </strong> "{scene.ocr_text}"
                            </div>
                          )}

                          {matchingText && (
                            <div style={{ display: 'flex', gap: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.02)', padding: '8px 12px', borderRadius: '6px' }}>
                              <Volume2 size={14} style={{ color: 'var(--accent-primary)', flexShrink: 0, marginTop: '2px' }} />
                              <p><em>"{matchingText}"</em></p>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 4. CAPTION & SEO TAB */}
            {activeTab === 'copy' && (
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '4px', fontFamily: 'var(--font-display)' }}>High-Converting Copy Sets</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>Optimized captions generated specifically for your content objective: <strong>{report.objective}</strong>.</p>
                </div>

                {/* Caption Variants */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {generated_assets.captions?.map((cap: any, idx: number) => {
                    const copyId = `cap-${idx}`;
                    return (
                      <div key={idx} className="glass-panel" style={{ padding: '20px', background: 'rgba(255,255,255,0.02)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', borderBottom: '1px solid var(--border-glow)', paddingBottom: '8px' }}>
                          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent-secondary)' }}>{cap.variant}</h4>
                          <button
                            className="btn btn-secondary"
                            style={{ padding: '4px 10px', fontSize: '0.78rem', gap: '4px' }}
                            onClick={() => handleCopy(cap.text, copyId)}
                          >
                            {copiedTextId === copyId ? (
                              <>
                                <Check size={12} style={{ color: 'var(--success)' }} />
                                Copied
                              </>
                            ) : (
                              <>
                                <Copy size={12} />
                                Copy Text
                              </>
                            )}
                          </button>
                        </div>
                        <p style={{ fontSize: '0.88rem', whiteSpace: 'pre-wrap', lineHeight: '1.5', color: '#e5e7eb', marginBottom: '12px' }}>{cap.text}</p>
                        {cap.explanation && (
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', borderTop: '1px solid rgba(255,255,255,0.02)', paddingTop: '8px' }}>
                            <strong>Strategy: </strong> {cap.explanation}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* SEO Keywords */}
                {generated_assets.keyword && (
                  <div>
                    <h4 style={{ fontSize: '1rem', marginBottom: '10px', fontFamily: 'var(--font-display)' }}>SEO & Searchability Keywords</h4>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {generated_assets.keyword.keywords?.map((kw: string, idx: number) => (
                        <span 
                          key={idx} 
                          style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glow)', borderRadius: '20px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Hashtags */}
                {generated_assets.hashtag_set && (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <h4 style={{ fontSize: '1rem', fontFamily: 'var(--font-display)' }}>Recommended Hashtag Group</h4>
                      <button
                        className="btn btn-secondary"
                        style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                        onClick={() => handleCopy(generated_assets.hashtag_set.hashtags?.join(' '), 'hashtags')}
                      >
                        {copiedTextId === 'hashtags' ? <Check size={12} style={{ color: 'var(--success)' }} /> : <Copy size={12} />}
                        Copy Group
                      </button>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {generated_assets.hashtag_set.hashtags?.map((tag: string, idx: number) => (
                        <span 
                          key={idx} 
                          style={{ padding: '6px 10px', background: 'var(--accent-primary-glow)', color: '#818cf8', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 500 }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* 5. COVERS & CTAS TAB */}
            {activeTab === 'cta_covers' && (
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '4px', fontFamily: 'var(--font-display)' }}>Covers & Call-To-Actions</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>Visual and text hooks to maximize initial hook CTR and end conversions.</p>
                </div>

                {/* Cover Options */}
                {generated_assets.cover && (
                  <div>
                    <h4 style={{ fontSize: '1rem', marginBottom: '12px', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Monitor size={16} style={{ color: 'var(--accent-secondary)' }} />
                      Title Card & Cover Hook Options
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {generated_assets.cover.covers?.map((cover: string, idx: number) => (
                        <div 
                          key={idx} 
                          style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-glow)', borderRadius: '8px', fontSize: '0.88rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '12px' }}
                        >
                          <span style={{ fontWeight: 700, color: 'var(--accent-secondary)' }}>0{idx + 1}</span>
                          <p>{cover}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* CTA Options */}
                {generated_assets.cta && (
                  <div>
                    <h4 style={{ fontSize: '1rem', marginBottom: '12px', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Share2 size={16} style={{ color: 'var(--accent-primary)' }} />
                      Auditory & Visual CTA Scripts
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {generated_assets.cta.ctas?.map((cta: string, idx: number) => (
                        <div 
                          key={idx} 
                          style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-glow)', borderRadius: '8px', fontSize: '0.88rem', color: 'var(--text-secondary)' }}
                        >
                          <p>{cta}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* 6. NEXT STEPS TAB */}
            {activeTab === 'next_steps' && (
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '4px', fontFamily: 'var(--font-display)' }}>Future Content Pillars</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>Next topics suggested to build context authority and follow-up loops.</p>
                </div>

                {generated_assets.idea && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {generated_assets.idea.ideas?.map((idea: string, idx: number) => (
                      <div 
                        key={idx} 
                        style={{ 
                          padding: '16px', 
                          background: 'rgba(255,255,255,0.01)', 
                          border: '1px solid var(--border-glow)', 
                          borderRadius: '12px',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '12px'
                        }}
                      >
                        <div className="flex-center" style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--accent-primary-glow)', color: 'var(--accent-primary)', flexShrink: 0, fontWeight: 700, fontSize: '0.8rem' }}>
                          {idx + 1}
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 600, marginBottom: '4px' }}>
                            {idea.split(':')[0] || 'Content Idea'}
                          </p>
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                            {idea.split(':').slice(1).join(':').trim() || idea}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}
