import React, { useState, useEffect } from 'react';
import { Film, History, LayoutDashboard, PlusCircle, Settings, HelpCircle, User, X, Sparkles } from 'lucide-react';
import Dashboard from './components/Dashboard';
import NewAnalysis from './components/NewAnalysis';
import ProcessingView from './components/ProcessingView';
import ReportView from './components/ReportView';
import RevisionCompare from './components/RevisionCompare';
import ServicesView from './components/ServicesView';

const API_URL = import.meta.env.VITE_API_URL || `${window.location.protocol}//${window.location.hostname}:8000`;

export default function App() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'new_analysis' | 'processing' | 'report' | 'compare' | 'services'>('dashboard');
  const [selectedAnalysisId, setSelectedAnalysisId] = useState<string | null>(null);
  const [compareRevisionId, setCompareRevisionId] = useState<string | null>(null);
  const [revisionParentId, setRevisionParentId] = useState<string | null>(null);

  // UI Modal states
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // Preference states
  const [defaultPlatform, setDefaultPlatform] = useState(() => localStorage.getItem('def_platform') || 'instagram');
  const [defaultObjective, setDefaultObjective] = useState(() => localStorage.getItem('def_objective') || 'views');
  const [defaultLanguage, setDefaultLanguage] = useState(() => localStorage.getItem('def_lang') || 'en');

  // Edit preference states (for Settings Modal)
  const [editPlatform, setEditPlatform] = useState(defaultPlatform);
  const [editObjective, setEditObjective] = useState(defaultObjective);
  const [editLanguage, setEditLanguage] = useState(defaultLanguage);

  useEffect(() => {
    if (showSettings) {
      setEditPlatform(defaultPlatform);
      setEditObjective(defaultObjective);
      setEditLanguage(defaultLanguage);
    }
  }, [showSettings, defaultPlatform, defaultObjective, defaultLanguage]);

  const saveSettings = (plat: string, obj: string, lang: string) => {
    localStorage.setItem('def_platform', plat);
    localStorage.setItem('def_objective', obj);
    localStorage.setItem('def_lang', lang);
    setDefaultPlatform(plat);
    setDefaultObjective(obj);
    setDefaultLanguage(lang);
    setShowSettings(false);
  };

  // Check URL params on load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const compId = params.get('compare');
    
    if (id && compId) {
      setSelectedAnalysisId(id);
      setCompareRevisionId(compId);
      setCurrentView('compare');
    } else if (id) {
      setSelectedAnalysisId(id);
      setCurrentView('report');
    }
  }, []);

  const navigateToDashboard = () => {
    // Clear URL query params cleanly
    window.history.pushState({}, '', window.location.pathname);
    setCurrentView('dashboard');
    setSelectedAnalysisId(null);
    setCompareRevisionId(null);
    setRevisionParentId(null);
  };

  const startNewAnalysis = (parentId?: string) => {
    if (parentId) {
      setRevisionParentId(parentId);
    } else {
      setRevisionParentId(null);
    }
    setCurrentView('new_analysis');
  };

  const handleAnalysisStarted = (analysisId: string) => {
    setSelectedAnalysisId(analysisId);
    setCurrentView('processing');
  };

  const handleProcessingCompleted = (analysisId: string) => {
    // If it was a revision, we automatically navigate to comparison view
    if (revisionParentId) {
      setCompareRevisionId(analysisId);
      setSelectedAnalysisId(revisionParentId);
      
      // Update URL query params
      window.history.pushState({}, '', `?id=${revisionParentId}&compare=${analysisId}`);
      setCurrentView('compare');
    } else {
      setSelectedAnalysisId(analysisId);
      // Update URL query params
      window.history.pushState({}, '', `?id=${analysisId}`);
      setCurrentView('report');
    }
  };

  const handleSelectReport = (id: string) => {
    setSelectedAnalysisId(id);
    window.history.pushState({}, '', `?id=${id}`);
    setCurrentView('report');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      
      {/* Left Navigation Rail */}
      <aside 
        style={{ 
          width: '80px', 
          background: 'var(--bg-secondary)', 
          borderRight: '1px solid var(--border-glow)', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          padding: '24px 0', 
          justifyContent: 'space-between',
          zIndex: 10
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', alignItems: 'center', width: '100%' }}>
          
          {/* Logo */}
          <div 
            onClick={navigateToDashboard}
            style={{ 
              width: '44px', 
              height: '44px', 
              borderRadius: '12px', 
              background: 'linear-gradient(135deg, var(--accent-primary) 0%, #00F2FE 100%)', 
              cursor: 'pointer',
              boxShadow: '0 4px 12px var(--accent-primary-glow)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#08090C'
            }}
          >
            <Film size={20} />
          </div>

          {/* Nav Items */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
            {[
              { icon: <LayoutDashboard size={20} />, label: 'Dashboard', view: 'dashboard' },
              { icon: <PlusCircle size={20} />, label: 'New', view: 'new_analysis' },
              { icon: <Sparkles size={20} />, label: 'Services', view: 'services' },
            ].map(item => {
              const isActive = currentView === item.view;
              return (
                <div 
                  key={item.label}
                  onClick={() => {
                    if (item.view === 'dashboard') navigateToDashboard();
                    else if (item.view === 'new_analysis') startNewAnalysis();
                    else if (item.view === 'services') setCurrentView('services');
                  }}
                  title={item.label}
                  style={{ 
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '12px 0',
                    cursor: 'pointer',
                    color: isActive ? 'var(--accent-primary)' : 'var(--text-muted)',
                    borderLeft: isActive ? '3px solid var(--accent-primary)' : '3px solid transparent',
                    background: isActive ? 'var(--accent-primary-glow)' : 'transparent',
                    transition: 'all 0.2s',
                    width: '100%'
                  }}
                  className="nav-item-hover"
                >
                  {item.icon}
                  <span style={{ fontSize: '0.65rem', marginTop: '4px', fontWeight: isActive ? 600 : 'normal' }}>{item.label}</span>
                </div>
              );
            })}
          </nav>
        </div>

        {/* Footer actions inside Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center', color: 'var(--text-muted)' }}>
          <div 
            title="Settings" 
            style={{ display: 'flex', cursor: 'pointer', color: showSettings ? 'var(--accent-primary)' : 'inherit', transition: 'color 0.2s' }}
            onClick={() => setShowSettings(true)}
            className="nav-item-hover"
          >
            <Settings size={20} />
          </div>
          <div 
            title="Help" 
            style={{ display: 'flex', cursor: 'pointer', color: showHelp ? 'var(--accent-primary)' : 'inherit', transition: 'color 0.2s' }}
            onClick={() => setShowHelp(true)}
            className="nav-item-hover"
          >
            <HelpCircle size={20} />
          </div>
          <div 
            title="Profile"
            style={{ 
              width: '32px', 
              height: '32px', 
              borderRadius: '50%', 
              background: showProfile ? 'var(--accent-primary-glow)' : 'rgba(255,255,255,0.05)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              border: showProfile ? '1px solid var(--accent-primary)' : '1px solid var(--border-glow)',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onClick={() => setShowProfile(true)}
            className="nav-item-hover"
          >
            <User size={16} style={{ color: showProfile ? 'var(--accent-primary)' : 'inherit' }} />
          </div>
        </div>
      </aside>

      {/* Main Workspace Frame */}
      <main style={{ flex: 1, padding: '0 40px', overflowY: 'auto', maxHeight: '100vh' }}>
        
        {/* Render active view */}
        {currentView === 'dashboard' && (
          <Dashboard 
            onStartNew={() => startNewAnalysis()} 
            onSelectReport={handleSelectReport} 
            apiUrl={API_URL} 
          />
        )}
        
        {currentView === 'new_analysis' && (
          <NewAnalysis 
            onBack={navigateToDashboard} 
            onAnalysisStarted={handleAnalysisStarted} 
            apiUrl={API_URL} 
            revisionParentId={revisionParentId || undefined}
            defaultSettings={{
              platform: defaultPlatform,
              objective: defaultObjective,
              language: defaultLanguage
            }}
          />
        )}
        
        {currentView === 'processing' && selectedAnalysisId && (
          <ProcessingView 
            analysisId={selectedAnalysisId} 
            onCompleted={handleProcessingCompleted} 
            onCancel={navigateToDashboard} 
            apiUrl={API_URL} 
          />
        )}
        
        {currentView === 'report' && selectedAnalysisId && (
          <ReportView 
            analysisId={selectedAnalysisId} 
            onBack={navigateToDashboard} 
            onStartRevision={startNewAnalysis}
            apiUrl={API_URL} 
          />
        )}
        
        {currentView === 'compare' && selectedAnalysisId && compareRevisionId && (
          <RevisionCompare 
            originalId={selectedAnalysisId} 
            revisionId={compareRevisionId} 
            onBack={navigateToDashboard} 
            apiUrl={API_URL} 
          />
        )}

        {currentView === 'services' && (
          <ServicesView onStartAnalysis={() => startNewAnalysis()} />
        )}

      </main>

      {/* Settings Modal */}
      {showSettings && (
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
            maxWidth: '500px',
            padding: '24px',
            borderRadius: '16px',
            border: '1px solid var(--border-glow)',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)', color: '#fff' }}>Preferences & Defaults</h3>
              <button 
                onClick={() => setShowSettings(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Default Target Platform</label>
                <select 
                  className="glass-input" 
                  value={editPlatform} 
                  onChange={e => setEditPlatform(e.target.value)}
                  style={{ width: '100%', padding: '10px', fontSize: '0.9rem' }}
                >
                  <option value="instagram">Instagram</option>
                  <option value="tiktok">TikTok</option>
                  <option value="youtube">YouTube</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Default Objective</label>
                <select 
                  className="glass-input" 
                  value={editObjective} 
                  onChange={e => setEditObjective(e.target.value)}
                  style={{ width: '100%', padding: '10px', fontSize: '0.9rem' }}
                >
                  <option value="views">Maximize Views / Reach</option>
                  <option value="follows">Drive Account Follows</option>
                  <option value="saves">Increase Saves / Bookmarks</option>
                  <option value="shares">Boost Sharing / Virality</option>
                  <option value="comments">Generate Comments & Chat</option>
                  <option value="leads">Generate Clicks & Leads</option>
                  <option value="sales">Drive Direct Product Sales</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Default Language</label>
                <select 
                  className="glass-input" 
                  value={editLanguage} 
                  onChange={e => setEditLanguage(e.target.value)}
                  style={{ width: '100%', padding: '10px', fontSize: '0.9rem' }}
                >
                  <option value="en">English (US/UK)</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="hi">Hindi</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => setShowSettings(false)}
                className="btn btn-secondary"
                style={{ padding: '8px 16px', fontSize: '0.88rem' }}
              >
                Cancel
              </button>
              <button 
                onClick={() => saveSettings(editPlatform, editObjective, editLanguage)}
                className="btn btn-primary"
                style={{ padding: '8px 16px', fontSize: '0.88rem' }}
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Help Modal */}
      {showHelp && (
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
            maxWidth: '600px',
            padding: '24px',
            borderRadius: '16px',
            border: '1px solid var(--border-glow)',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
            maxHeight: '85vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--border-glow)', paddingBottom: '12px' }}>
              <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <HelpCircle size={20} style={{ color: 'var(--accent-primary)' }} />
                Workspace Help & FAQ Guide
              </h3>
              <button 
                onClick={() => setShowHelp(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'left' }}>
              <div>
                <h4 style={{ color: '#fff', fontWeight: 600, fontSize: '0.95rem', marginBottom: '6px' }}>1. How does the Creative Scorecard work?</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.5' }}>
                  Our visual intelligence engine rates your content from 1 to 100 on eight metrics. The <strong>Hook Retention</strong> score checks the first 3 seconds for immediate engagement hooks. <strong>Topic Clarity</strong> assesses how easily viewers understand your subject, and <strong>Pacing</strong> checks shot dynamics.
                </p>
              </div>

              <div>
                <h4 style={{ color: '#fff', fontWeight: 600, fontSize: '0.95rem', marginBottom: '6px' }}>2. Using the Safe-Zone Overlay</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.5' }}>
                  When viewing a video report, toggle the <strong>Safe-Zone Overlay</strong>. This presents a visual UI grid layer mimicking Instagram, TikTok, and YouTube UI buttons. Always place text and focal points inside the center zones to avoid being blocked by social buttons.
                </p>
              </div>

              <div>
                <h4 style={{ color: '#fff', fontWeight: 600, fontSize: '0.95rem', marginBottom: '6px' }}>3. How do I optimize using Revisions?</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.5' }}>
                  Once you apply our generated copy modifications or visual adjustments, export your revised video and upload it using <strong>Upload Revised Version</strong> inside the report view. This triggers a side-by-side comparison to verify score improvements.
                </p>
              </div>

              <div style={{ padding: '12px', background: 'rgba(99, 102, 241, 0.05)', border: '1px dashed var(--accent-primary-glow)', borderRadius: '8px', fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'flex', gap: '8px' }}>
                💡 <strong>Tip:</strong> Always include target keywords inside the first 5 words of your captions to optimize platform search indices!
              </div>
            </div>

            <button 
              onClick={() => setShowHelp(false)}
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '24px', padding: '12px' }}
            >
              Got It
            </button>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {showProfile && (
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
            maxWidth: '420px',
            padding: '28px 24px',
            borderRadius: '16px',
            border: '1px solid var(--border-glow)',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
            textAlign: 'center'
          }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-12px', marginRight: '-12px' }}>
              <button 
                onClick={() => setShowProfile(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Avatar block */}
            <div className="flex-center" style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'var(--accent-primary-glow)', border: '2px solid var(--accent-primary)', margin: '0 auto 16px auto', color: 'var(--accent-primary)' }}>
              <User size={36} />
            </div>

            <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)', color: '#fff', marginBottom: '4px' }}>Upendra Kushwaha</h3>
            <p style={{ color: 'var(--accent-secondary)', fontSize: '0.82rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '20px' }}>Creator Tier</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', textAlign: 'left', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glow)', borderRadius: '12px', padding: '16px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Workspace Path:</span>
                <span style={{ color: '#fff', fontWeight: 500 }}>insta_suggestions</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Connected DB:</span>
                <span style={{ color: 'var(--success)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--success)' }}></div>
                  Supabase (aws-1)
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Active Branch:</span>
                <span style={{ color: '#fff', fontWeight: 500 }}>main</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>API Status:</span>
                <span style={{ color: 'var(--success)', fontWeight: 500 }}>Online</span>
              </div>
            </div>

            <button 
              onClick={() => setShowProfile(false)}
              className="btn btn-secondary"
              style={{ width: '100%', padding: '10px' }}
            >
              Close Profile
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
