import React, { useState, useEffect } from 'react';
import { Loader2, Film, CheckCircle2, Circle, AlertCircle, XCircle, ArrowLeft } from 'lucide-react';

interface Stage {
  stage: string;
  status: string;
  started_at: string | null;
  completed_at: string | null;
  error_message: string | null;
}

interface ProcessingViewProps {
  analysisId: string;
  onCompleted: (id: string) => void;
  onCancel: () => void;
  apiUrl: string;
}

export default function ProcessingView({ analysisId, onCompleted, onCancel, apiUrl }: ProcessingViewProps) {
  const [stages, setStages] = useState<Stage[]>([]);
  const [status, setStatus] = useState('pending');
  const [elapsedTime, setElapsedTime] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Poll analysis status
  useEffect(() => {
    let intervalId: any;

    const pollStatus = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/v1/analyses/${analysisId}`);
        if (!res.ok) {
          throw new Error("Failed to fetch analysis progress.");
        }
        
        const data = await res.json();
        setStatus(data.status);
        if (data.stages) {
          // Sort or preserve stage order
          const order = ["media_probe", "transcription", "scene_detection", "ocr", "creative_analysis", "completed"];
          const sortedStages = data.stages.sort((a: Stage, b: Stage) => order.indexOf(a.stage) - order.indexOf(b.stage));
          setStages(sortedStages);
        }

        if (data.status === 'completed') {
          clearInterval(intervalId);
          onCompleted(analysisId);
        } else if (data.status === 'failed') {
          clearInterval(intervalId);
          // Find error message from failed stage
          const failedStage = data.stages.find((s: Stage) => s.status === 'failed');
          setErrorMessage(failedStage?.error_message || "Creative analysis pipeline failed.");
        }
      } catch (err: any) {
        console.error("Polling error:", err);
      }
    };

    pollStatus(); // initial poll
    intervalId = setInterval(pollStatus, 1500);

    return () => clearInterval(intervalId);
  }, [analysisId, apiUrl]);

  // Elapsed timer
  useEffect(() => {
    if (status === 'completed' || status === 'failed') return;
    
    const timer = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [status]);

  const getStageLabel = (stageKey: string) => {
    switch (stageKey) {
      case 'media_probe': return 'Preparing media & extracting properties';
      case 'transcription': return 'Transcribing audio speech & syncing timestamps';
      case 'scene_detection': return 'Segmenting scene shots & sampling keyframes';
      case 'ocr': return 'Extracting on-screen text & overlay placements';
      case 'creative_analysis': return 'Analyzing hook strength, pacing & creative scores';
      case 'completed': return 'Building final creative brief & options';
      default: return stageKey;
    }
  };

  const renderStageIcon = (stageStatus: string) => {
    switch (stageStatus) {
      case 'completed':
        return <CheckCircle2 size={20} style={{ color: 'var(--success)' }} />;
      case 'processing':
        return <Loader2 size={20} style={{ color: 'var(--accent-primary)' }} className="animate-spin" />;
      case 'failed':
        return <AlertCircle size={20} style={{ color: 'var(--danger)' }} />;
      default:
        return <Circle size={20} style={{ color: 'var(--text-muted)' }} />;
    }
  };

  return (
    <div className="animate-fade-in flex-center" style={{ minHeight: 'calc(100vh - 120px)', padding: '24px 0' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '640px', padding: '36px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        {/* Animated Media Icon */}
        <div 
          className={status !== 'failed' ? 'animate-pulse-glow flex-center' : 'flex-center'}
          style={{ 
            width: '80px', 
            height: '80px', 
            borderRadius: '50%', 
            background: 'var(--accent-primary-glow)', 
            border: '2px solid var(--accent-primary)',
            boxShadow: '0 0 30px var(--accent-primary-glow)',
            marginBottom: '24px',
            color: 'var(--accent-primary)',
          }}
        >
          <Film size={32} />
        </div>

        <h2 style={{ fontSize: '1.75rem', marginBottom: '8px', fontFamily: 'var(--font-display)' }}>
          {status === 'failed' ? 'Pipeline Failure' : 'Running Creative Intelligence Pipeline'}
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '24px', textAlign: 'center' }}>
          {status === 'failed' 
            ? 'We encountered an error processing your video asset.' 
            : `Processing media file. Elapsed time: ${elapsedTime}s. Please do not close this window.`}
        </p>

        {/* Progress List */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
          {stages.map((s) => (
            <div 
              key={s.stage} 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '16px', 
                padding: '16px', 
                background: s.status === 'processing' ? 'rgba(255,255,255,0.02)' : 'transparent',
                border: s.status === 'processing' ? '1px solid var(--border-glow)' : '1px solid transparent',
                borderRadius: '12px',
                transition: 'all 0.3s'
              }}
            >
              {renderStageIcon(s.status)}
              <div style={{ flex: 1 }}>
                <p style={{ 
                  fontSize: '0.95rem', 
                  fontWeight: s.status === 'processing' ? 600 : 'normal',
                  color: s.status === 'completed' ? 'var(--text-primary)' : s.status === 'pending' ? 'var(--text-muted)' : '#fff'
                }}>
                  {getStageLabel(s.stage)}
                </p>
                {s.status === 'processing' && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--accent-primary)' }}>In progress...</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Error Callout */}
        {status === 'failed' && errorMessage && (
          <div style={{ 
            width: '100%', 
            padding: '16px', 
            background: 'var(--danger-glow)', 
            border: '1px solid var(--danger)', 
            borderRadius: '12px', 
            color: '#fda4af', 
            display: 'flex', 
            gap: '12px',
            alignItems: 'flex-start',
            marginBottom: '24px',
            fontSize: '0.9rem'
          }}>
            <XCircle size={18} style={{ flexShrink: 0, marginTop: '2px', color: 'var(--danger)' }} />
            <div>
              <p style={{ fontWeight: 600, marginBottom: '4px' }}>Error Details:</p>
              <p>{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Safe Escape Button */}
        <button 
          onClick={onCancel}
          className="btn btn-secondary"
          style={{ width: '100%', padding: '12px' }}
        >
          <ArrowLeft size={16} />
          {status === 'failed' ? 'Back to Dashboard' : 'Cancel & Go Back'}
        </button>

      </div>
    </div>
  );
}
