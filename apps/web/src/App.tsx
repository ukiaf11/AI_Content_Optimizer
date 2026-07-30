import React, { useState, useEffect } from 'react';
import { Film, History, LayoutDashboard, PlusCircle, Settings, HelpCircle, User } from 'lucide-react';
import Dashboard from './components/Dashboard';
import NewAnalysis from './components/NewAnalysis';
import ProcessingView from './components/ProcessingView';
import ReportView from './components/ReportView';
import RevisionCompare from './components/RevisionCompare';

const API_URL = import.meta.env.VITE_API_URL || `${window.location.protocol}//${window.location.hostname}:8000`;

export default function App() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'new_analysis' | 'processing' | 'report' | 'compare'>('dashboard');
  const [selectedAnalysisId, setSelectedAnalysisId] = useState<string | null>(null);
  const [compareRevisionId, setCompareRevisionId] = useState<string | null>(null);
  const [revisionParentId, setRevisionParentId] = useState<string | null>(null);

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
            ].map(item => {
              const isActive = currentView === item.view;
              return (
                <div 
                  key={item.label}
                  onClick={() => {
                    if (item.view === 'dashboard') navigateToDashboard();
                    else if (item.view === 'new_analysis') startNewAnalysis();
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
          <div title="Settings" style={{ display: 'flex', cursor: 'pointer' }}><Settings size={20} /></div>
          <div title="Help" style={{ display: 'flex', cursor: 'pointer' }}><HelpCircle size={20} /></div>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-glow)' }}>
            <User size={16} />
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

      </main>

    </div>
  );
}
