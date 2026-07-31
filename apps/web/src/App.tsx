import React, { useState, useEffect } from 'react';
import { Film, LayoutDashboard, PlusCircle, Settings, HelpCircle, User, X, Sparkles, Sun, Moon, ChevronDown, LogOut, Globe, Target, Languages } from 'lucide-react';
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

  // Theme state (Task 2)
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('theme');
    return (saved === 'light' || saved === 'dark') ? saved : 'dark';
  });

  // Accordion FAQ state (Task 7)
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Profile dynamic analysis count (Task 8)
  const [analysisCount, setAnalysisCount] = useState<number | null>(null);

  // Preference states
  const [defaultPlatform, setDefaultPlatform] = useState(() => localStorage.getItem('def_platform') || 'instagram');
  const [defaultObjective, setDefaultObjective] = useState(() => localStorage.getItem('def_objective') || 'views');
  const [defaultLanguage, setDefaultLanguage] = useState(() => localStorage.getItem('def_lang') || 'en');

  // Edit preference states (for Settings Modal)
  const [editPlatform, setEditPlatform] = useState(defaultPlatform);
  const [editObjective, setEditObjective] = useState(defaultObjective);
  const [editLanguage, setEditLanguage] = useState(defaultLanguage);

  // Apply theme on mount and change (Task 2)
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    if (showSettings) {
      setEditPlatform(defaultPlatform);
      setEditObjective(defaultObjective);
      setEditLanguage(defaultLanguage);
    }
  }, [showSettings, defaultPlatform, defaultObjective, defaultLanguage]);

  // Fetch analysis count when Profile modal opens (Task 8)
  useEffect(() => {
    if (showProfile) {
      fetch(`${API_URL}/api/v1/analyses`)
        .then(res => res.json())
        .then(data => {
          setAnalysisCount(Array.isArray(data) ? data.length : 0);
        })
        .catch(() => setAnalysisCount(null));
    }
  }, [showProfile]);

  const saveSettings = (plat: string, obj: string, lang: string) => {
    localStorage.setItem('def_platform', plat);
    localStorage.setItem('def_objective', obj);
    localStorage.setItem('def_lang', lang);
    setDefaultPlatform(plat);
    setDefaultObjective(obj);
    setDefaultLanguage(lang);
    setShowSettings(false);
  };

  // Reset to Defaults handler (Task 6)
  const resetSettingsToDefaults = () => {
    setEditPlatform('instagram');
    setEditObjective('views');
    setEditLanguage('en');
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

  // FAQ data for accordion (Task 7)
  const faqItems = [
    {
      question: '1. How does the Creative Scorecard work?',
      answer: 'Our visual intelligence engine rates your content from 1 to 100 on eight metrics. The Hook Retention score checks the first 3 seconds for immediate engagement hooks. Topic Clarity assesses how easily viewers understand your subject, and Pacing checks shot dynamics. Visual and Audio evaluate production quality, while Accessibility, Searchability, and Engagement measure discoverability and audience connection.'
    },
    {
      question: '2. Using the Safe-Zone Overlay',
      answer: 'When viewing a video report, toggle the Safe-Zone Overlay. This presents a visual UI grid layer mimicking Instagram, TikTok, and YouTube UI buttons. Always place text and focal points inside the center zones to avoid being blocked by social buttons, captions, or interaction elements.'
    },
    {
      question: '3. How do I optimize using Revisions?',
      answer: 'Once you apply our generated copy modifications or visual adjustments, export your revised video and upload it using "Upload Revised Version" inside the report view. This triggers a side-by-side comparison to verify score improvements across all 8 metrics with delta badges showing exactly what changed.'
    },
    {
      question: '4. What platforms are supported?',
      answer: 'Currently, the optimizer supports Instagram Reels, TikTok, and YouTube Shorts. Each platform has specific UI overlay zones and algorithmic preferences that our analysis engine accounts for when generating scores and recommendations.'
    },
    {
      question: '5. How accurate are the AI scores?',
      answer: 'Scores are generated by analyzing visual hooks, pacing, audio clarity, text placement, and platform-specific best practices. They provide directional guidance for improvement. We recommend focusing on relative score changes between revisions rather than absolute numbers.'
    }
  ];

  // Nav items for both sidebar and bottom-nav
  const navItems = [
    { icon: <LayoutDashboard size={20} />, smallIcon: <LayoutDashboard size={18} />, label: 'Dashboard', view: 'dashboard' as const },
    { icon: <PlusCircle size={20} />, smallIcon: <PlusCircle size={18} />, label: 'New', view: 'new_analysis' as const },
    { icon: <Sparkles size={20} />, smallIcon: <Sparkles size={18} />, label: 'Services', view: 'services' as const },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      
      {/* Left Navigation Rail (Desktop) */}
      <aside 
        className="desktop-sidebar"
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
            {navItems.map(item => {
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
          {/* Theme Toggle (Task 2) */}
          <button 
            onClick={toggleTheme}
            className="theme-toggle-btn"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

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
      <main className="main-workspace" style={{ flex: 1, padding: '0 40px', overflowY: 'auto', maxHeight: '100vh' }}>
        
        {/* Page Transition Wrapper (Task 4) */}
        <div className="page-transition" key={currentView + (selectedAnalysisId || '') + (compareRevisionId || '')}>
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
        </div>

      </main>

      {/* Mobile Bottom-Nav Bar (Task 3) */}
      <nav className="bottom-nav">
        {navItems.map(item => {
          const isActive = currentView === item.view;
          return (
            <button
              key={item.label}
              className={`bottom-nav-item${isActive ? ' active' : ''}`}
              onClick={() => {
                if (item.view === 'dashboard') navigateToDashboard();
                else if (item.view === 'new_analysis') startNewAnalysis();
                else if (item.view === 'services') setCurrentView('services');
              }}
            >
              {item.smallIcon}
              <span>{item.label}</span>
            </button>
          );
        })}
        <button
          className="bottom-nav-item"
          onClick={toggleTheme}
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          <span>Theme</span>
        </button>
      </nav>

      {/* Settings Modal (Task 6 — polished) */}
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
          <div className="glass-panel modal-scale-in" style={{
            width: '100%',
            maxWidth: '500px',
            padding: '28px',
            borderRadius: '16px',
            border: '1px solid var(--border-glow)',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>Preferences & Defaults</h3>
              <button 
                onClick={() => setShowSettings(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '20px' }}>
              {/* Platform setting with icon */}
              <div className="settings-row">
                <div className="settings-row-label">
                  <div className="settings-row-icon" style={{ background: 'var(--accent-primary-glow)', color: 'var(--accent-primary)' }}>
                    <Globe size={16} />
                  </div>
                  Default Target Platform
                </div>
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

              {/* Objective setting with icon */}
              <div className="settings-row">
                <div className="settings-row-label">
                  <div className="settings-row-icon" style={{ background: 'var(--success-glow)', color: 'var(--success)' }}>
                    <Target size={16} />
                  </div>
                  Default Objective
                </div>
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

              {/* Language setting with icon */}
              <div className="settings-row">
                <div className="settings-row-label">
                  <div className="settings-row-icon" style={{ background: 'var(--warning-glow)', color: 'var(--warning)' }}>
                    <Languages size={16} />
                  </div>
                  Default Language
                </div>
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

            {/* Reset to Defaults button (Task 6) */}
            <button 
              onClick={resetSettingsToDefaults}
              className="btn-reset"
              style={{ marginBottom: '20px' }}
            >
              ↺ Reset to Defaults
            </button>

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

      {/* Help Modal — Accordion FAQ (Task 7) */}
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
          <div className="glass-panel modal-scale-in" style={{
            width: '100%',
            maxWidth: '600px',
            padding: '28px',
            borderRadius: '16px',
            border: '1px solid var(--border-glow)',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
            maxHeight: '85vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid var(--border-glow)', paddingBottom: '12px' }}>
              <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <HelpCircle size={20} style={{ color: 'var(--accent-primary)' }} />
                Workspace Help & FAQ
              </h3>
              <button 
                onClick={() => { setShowHelp(false); setOpenFaqIndex(null); }}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Accordion FAQ items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {faqItems.map((item, index) => (
                <div key={index} className="accordion-item">
                  <button 
                    className="accordion-header"
                    onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                  >
                    <span>{item.question}</span>
                    <ChevronDown 
                      size={18} 
                      className={`accordion-chevron${openFaqIndex === index ? ' expanded' : ''}`} 
                    />
                  </button>
                  <div className={`accordion-content${openFaqIndex === index ? ' expanded' : ''}`}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.6' }}>
                      {item.answer}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Tip box */}
            <div style={{ padding: '12px', background: 'var(--accent-primary-glow)', border: '1px dashed var(--border-glow-active)', borderRadius: '8px', fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'flex', gap: '8px', marginTop: '20px' }}>
              💡 <span><strong>Tip:</strong> Always include target keywords inside the first 5 words of your captions to optimize platform search indices!</span>
            </div>

            {/* Contact/Support link */}
            <div style={{ marginTop: '16px', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                Need more help?{' '}
                <a 
                  href="mailto:support@contentoptimizer.ai" 
                  style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: 500 }}
                >
                  Contact Support →
                </a>
              </p>
            </div>

            <button 
              onClick={() => { setShowHelp(false); setOpenFaqIndex(null); }}
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '20px', padding: '12px' }}
            >
              Got It
            </button>
          </div>
        </div>
      )}

      {/* Profile Modal — Dynamic Data + Gradient Avatar + Logout (Task 8) */}
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
          <div className="glass-panel modal-scale-in" style={{
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

            {/* Avatar with gradient ring (Task 8) */}
            <div style={{ margin: '0 auto 16px auto', width: 'fit-content' }}>
              <div className="avatar-gradient-ring">
                <div className="avatar-gradient-ring-inner">
                  <User size={32} />
                </div>
              </div>
            </div>

            <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)', color: 'var(--text-primary)', marginBottom: '4px' }}>Upendra Kushwaha</h3>
            <p style={{ color: 'var(--accent-secondary)', fontSize: '0.82rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '20px' }}>Creator Tier</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', textAlign: 'left', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glow)', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Workspace Path:</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>insta_suggestions</span>
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
                <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>main</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>API Status:</span>
                <span style={{ color: 'var(--success)', fontWeight: 500 }}>Online</span>
              </div>
              {/* Dynamic analysis count (Task 8) */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', borderTop: '1px solid var(--border-glow)', paddingTop: '10px', marginTop: '4px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Total Analyses:</span>
                <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>
                  {analysisCount !== null ? analysisCount : '—'}
                </span>
              </div>
            </div>

            {/* Logout placeholder (Task 8) */}
            <button className="btn-logout" style={{ marginBottom: '12px' }} disabled>
              <LogOut size={16} />
              Sign Out (Coming Soon)
            </button>

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
