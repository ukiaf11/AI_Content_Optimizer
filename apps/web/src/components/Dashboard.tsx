import React, { useState, useEffect } from 'react';
import { Play, Plus, Search, Trash2, Video, Image, FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface AnalysisItem {
  id: string;
  media_id: string;
  filename: string;
  type: string;
  platform: string;
  objective: string;
  status: string;
  created_at: string;
  completed_at: string | null;
  score: {
    overall: number;
    hook: number;
    pacing: number;
    clarity: number;
    visual: number;
    audio: number;
    accessibility: number;
    searchability: number;
    engagement: number;
  } | null;
  revision_group_id: string | null;
  niche: string | null;
  target_audience: string | null;
}

interface DashboardProps {
  onStartNew: () => void;
  onSelectReport: (id: string) => void;
  apiUrl: string;
}

export default function Dashboard({ onStartNew, onSelectReport, apiUrl }: DashboardProps) {
  const [analyses, setAnalyses] = useState<AnalysisItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [platformFilter, setPlatformFilter] = useState('all');
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const fetchAnalyses = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${apiUrl}/api/v1/analyses`);
      if (res.ok) {
        const data = await res.json();
        setAnalyses(data);
      }
    } catch (e) {
      console.error("Error fetching analyses:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyses();
  }, [apiUrl]);

  const handleDeleteClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid triggering row selection
    setDeleteTargetId(id);
  };

  const confirmDelete = async () => {
    if (!deleteTargetId) return;
    try {
      const res = await fetch(`${apiUrl}/api/v1/analyses/${deleteTargetId}`, { method: 'DELETE' });
      if (res.ok) {
        setAnalyses(prev => prev.filter(item => item.id !== deleteTargetId));
      } else {
        alert("Failed to delete analysis.");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting analysis.");
    } finally {
      setDeleteTargetId(null);
    }
  };

  // Compute metrics
  const completedReports = analyses.filter(a => a.status === 'completed');
  const avgScore = completedReports.length > 0
    ? Math.round(completedReports.reduce((acc, curr) => acc + (curr.score?.overall || 0), 0) / completedReports.length)
    : 0;

  const totalVideos = analyses.filter(a => a.type === 'video').length;
  const totalImages = analyses.filter(a => a.type === 'image').length;

  const filteredAnalyses = analyses.filter(a => {
    const matchesSearch = a.filename.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (a.niche && a.niche.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesPlatform = platformFilter === 'all' || a.platform.toLowerCase() === platformFilter.toLowerCase();
    return matchesSearch && matchesPlatform;
  });

  return (
    <div className="animate-fade-in" style={{ padding: '24px 0' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '8px', background: 'linear-gradient(135deg, #fff 0%, #a5b4fc 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Creative Intelligence Workspace
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Upload, analyze, and optimize your media assets for maximum impact.</p>
        </div>
        <button className="btn btn-primary" onClick={onStartNew}>
          <Plus size={18} />
          New Analysis
        </button>
      </div>

      {/* Analytics Highlights */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 500, textTransform: 'uppercase', marginBottom: '8px' }}>Total Assets</p>
          <h3 style={{ fontSize: '2.25rem', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            {analyses.length}
            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 'normal' }}>
              ({totalVideos} vids, {totalImages} imgs)
            </span>
          </h3>
        </div>
        
        <div className="glass-panel" style={{ padding: '20px', borderLeft: '3px solid var(--accent-primary)' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 500, textTransform: 'uppercase', marginBottom: '8px' }}>Average Quality Score</p>
          <h3 style={{ fontSize: '2.25rem', fontFamily: 'var(--font-display)', color: 'var(--accent-secondary)' }}>
            {avgScore > 0 ? `${avgScore}/100` : '—'}
          </h3>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 500, textTransform: 'uppercase', marginBottom: '8px' }}>Completed Analysis</p>
          <h3 style={{ fontSize: '2.25rem', fontFamily: 'var(--font-display)', color: 'var(--success)' }}>
            {completedReports.length}
          </h3>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 500, textTransform: 'uppercase', marginBottom: '8px' }}>Pending Jobs</p>
          <h3 style={{ fontSize: '2.25rem', fontFamily: 'var(--font-display)', color: 'var(--warning)' }}>
            {analyses.filter(a => a.status === 'pending' || a.status === 'processing').length}
          </h3>
        </div>
      </div>

      {/* History List Section */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '20px', fontFamily: 'var(--font-display)' }}>Analysis History</h3>
        
        {/* Filters */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
            <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={16} />
            <input 
              type="text"
              placeholder="Search by file name or niche..."
              className="glass-input"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '10px 16px 10px 36px', fontSize: '0.9rem' }}
            />
          </div>
          
          <select 
            className="glass-input" 
            value={platformFilter}
            onChange={e => setPlatformFilter(e.target.value)}
            style={{ padding: '10px 16px', fontSize: '0.9rem', width: '160px' }}
          >
            <option value="all">All Platforms</option>
            <option value="instagram">Instagram</option>
            <option value="tiktok">TikTok</option>
            <option value="youtube">YouTube</option>
          </select>
        </div>

        {/* List Content */}
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 0', gap: '16px' }}>
            <div className="animate-spin" style={{ width: '32px', height: '32px', border: '3px solid var(--accent-primary)', borderTopColor: 'transparent', borderRadius: '50%' }}></div>
            <p style={{ color: 'var(--text-secondary)' }}>Loading history...</p>
          </div>
        ) : filteredAnalyses.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)', border: '1px dashed var(--border-glow)', borderRadius: '12px' }}>
            <FileText size={48} style={{ marginBottom: '16px', color: 'var(--text-muted)' }} />
            <p style={{ fontSize: '1rem', marginBottom: '8px' }}>No analyses found</p>
            <p style={{ fontSize: '0.85rem' }}>Upload some content to get started.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-glow)' }}>
                  <th style={{ padding: '12px 16px', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>Media Asset</th>
                  <th style={{ padding: '12px 16px', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>Platform</th>
                  <th style={{ padding: '12px 16px', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>Objective</th>
                  <th style={{ padding: '12px 16px', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>Status</th>
                  <th style={{ padding: '12px 16px', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>Quality Score</th>
                  <th style={{ padding: '12px 16px', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>Date</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}></th>
                </tr>
              </thead>
              <tbody>
                {filteredAnalyses.map(item => (
                  <tr 
                    key={item.id} 
                    className="glass-panel-interactive"
                    onClick={() => onSelectReport(item.id)}
                    style={{ borderBottom: '1px solid var(--border-glow)', transition: 'background-color 0.2s' }}
                  >
                    <td style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div className="flex-center" style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glow)' }}>
                        {item.type === 'video' ? <Video size={18} style={{ color: 'var(--accent-primary)' }} /> : <Image size={18} style={{ color: 'var(--accent-secondary)' }} />}
                      </div>
                      <div>
                        <div style={{ fontWeight: 500, fontSize: '0.95rem', color: '#fff', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {item.filename}
                        </div>
                        {item.revision_group_id && (
                          <span style={{ fontSize: '0.75rem', background: 'var(--accent-primary-glow)', color: '#818cf8', padding: '1px 6px', borderRadius: '4px' }}>
                            Revision
                          </span>
                        )}
                      </div>
                    </td>
                    
                    <td style={{ padding: '16px', fontSize: '0.9rem' }}>
                      <span style={{ textTransform: 'capitalize' }}>{item.platform}</span>
                    </td>
                    
                    <td style={{ padding: '16px', fontSize: '0.9rem' }}>
                      <span style={{ textTransform: 'capitalize', color: 'var(--text-secondary)' }}>{item.objective}</span>
                    </td>
                    
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
                        {item.status === 'completed' && (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--success)' }}>
                            <CheckCircle size={14} /> Completed
                          </span>
                        )}
                        {(item.status === 'pending' || item.status === 'processing') && (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--warning)' }} className="animate-pulse-glow">
                            <Clock size={14} /> {item.status === 'processing' ? 'Analyzing' : 'Queued'}
                          </span>
                        )}
                        {item.status === 'failed' && (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--danger)' }}>
                            <AlertCircle size={14} /> Failed
                          </span>
                        )}
                      </div>
                    </td>
                    
                    <td style={{ padding: '16px', fontWeight: 600 }}>
                      {item.status === 'completed' && item.score ? (
                        <span style={{ 
                          color: item.score.overall >= 80 ? 'var(--success)' : item.score.overall >= 60 ? 'var(--warning)' : 'var(--danger)',
                          fontSize: '1rem' 
                        }}>
                          {item.score.overall}/100
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text-muted)' }}>—</span>
                      )}
                    </td>
                    
                    <td style={{ padding: '16px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {new Date(item.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    
                    <td style={{ padding: '16px', textAlign: 'right' }}>
                      <button 
                        style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '6px', borderRadius: '4px' }}
                        onClick={(e) => handleDeleteClick(item.id, e)}
                        className="btn-delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Custom Confirmation Modal */}
      {deleteTargetId && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div className="glass-panel animate-fade-in" style={{
            width: '100%',
            maxWidth: '400px',
            padding: '24px',
            borderRadius: '16px',
            textAlign: 'center',
            border: '1px solid var(--border-glow)',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
          }}>
            <h4 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)', marginBottom: '12px', color: '#fff' }}>Confirm Deletion</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '24px', lineHeight: '1.5' }}>
              Are you sure you want to delete this analysis and all associated media files? This action is permanent and cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button 
                onClick={() => setDeleteTargetId(null)}
                className="btn btn-secondary"
                style={{ padding: '10px 20px', fontSize: '0.88rem' }}
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="btn"
                style={{ background: 'var(--danger)', color: '#fff', border: 'none', padding: '10px 20px', fontSize: '0.88rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
