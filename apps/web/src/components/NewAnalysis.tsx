import React, { useState, useRef } from 'react';
import { Upload, X, ArrowLeft, Loader2, Sparkles, Film, Image } from 'lucide-react';

interface NewAnalysisProps {
  onBack: () => void;
  onAnalysisStarted: (id: string) => void;
  apiUrl: string;
  revisionParentId?: string; // Optional: if this is a revision upload
  defaultSettings?: {
    platform: string;
    objective: string;
    language: string;
  };
}

export default function NewAnalysis({ onBack, onAnalysisStarted, apiUrl, revisionParentId, defaultSettings }: NewAnalysisProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileType, setFileType] = useState<'video' | 'image' | null>(null);

  // Metadata states
  const [platform, setPlatform] = useState(defaultSettings?.platform || 'instagram');
  const [objective, setObjective] = useState(defaultSettings?.objective || 'views');
  const [niche, setNiche] = useState('');
  const [audience, setAudience] = useState('');
  const [caption, setCaption] = useState('');
  const [language, setLanguage] = useState(defaultSettings?.language || 'en');

  // Status states
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (selectedFile: File) => {
    // Validate type (video or image)
    const isVideo = selectedFile.type.startsWith('video/');
    const isImage = selectedFile.type.startsWith('image/');
    
    if (!isVideo && !isImage) {
      alert("Unsupported file type. Please upload a video or an image.");
      return;
    }
    
    // Check size limit (e.g., 100MB)
    if (selectedFile.size > 100 * 1024 * 1024) {
      alert("File size exceeds 100MB limit.");
      return;
    }

    setFile(selectedFile);
    setFileType(isVideo ? 'video' : 'image');
    
    // Create preview url
    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);
  };

  const removeFile = () => {
    setFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setFileType(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      alert("Please upload a file first.");
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(0);

      // 1. Upload file using XMLHttpRequest to track progress
      const formData = new FormData();
      formData.append('file', file);

      const mediaId = await new Promise<string>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `${apiUrl}/api/v1/media/upload`);
        
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percent = Math.round((event.loaded / event.total) * 100);
            setUploadProgress(percent);
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const res = JSON.parse(xhr.responseText);
              resolve(res.media_id);
            } catch (err) {
              reject(new Error("Failed to parse upload response"));
            }
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        };

        xhr.onerror = () => reject(new Error("Network upload error"));
        xhr.send(formData);
      });

      setUploading(false);
      setSubmitting(true);

      // 2. Submit analysis configuration
      const analysisForm = new FormData();
      analysisForm.append('media_id', mediaId);
      analysisForm.append('platform', platform);
      analysisForm.append('objective', objective);
      analysisForm.append('niche', niche);
      analysisForm.append('target_audience', audience);
      analysisForm.append('language', language);
      analysisForm.append('current_caption', caption);
      if (revisionParentId) {
        analysisForm.append('revision_parent_id', revisionParentId);
      }

      const analysisRes = await fetch(`${apiUrl}/api/v1/analyses`, {
        method: 'POST',
        body: analysisForm
      });

      if (!analysisRes.ok) {
        throw new Error("Failed to trigger content analysis");
      }

      const analysisData = await analysisRes.json();
      onAnalysisStarted(analysisData.analysis_id);

    } catch (err: any) {
      console.error(err);
      alert(err.message || "An error occurred during submission.");
      setUploading(false);
      setSubmitting(false);
    }
  };

  const getPlatformGradient = () => {
    switch (platform) {
      case 'instagram':
        return 'linear-gradient(135deg, rgba(131, 58, 180, 0.08) 0%, rgba(253, 29, 29, 0.08) 50%, rgba(252, 176, 69, 0.08) 100%)';
      case 'tiktok':
        return 'linear-gradient(135deg, rgba(1, 1, 1, 0.9) 0%, rgba(254, 9, 121, 0.08) 50%, rgba(0, 242, 254, 0.08) 100%)';
      case 'youtube':
        return 'linear-gradient(135deg, rgba(255, 0, 0, 0.08) 0%, rgba(20, 20, 20, 0.95) 100%)';
      default:
        return 'transparent';
    }
  };

  const getPlatformBorder = () => {
    switch (platform) {
      case 'instagram': return 'rgba(214, 36, 159, 0.4)';
      case 'tiktok': return 'rgba(0, 242, 254, 0.4)';
      case 'youtube': return 'rgba(255, 0, 0, 0.4)';
      default: return 'var(--border-glow)';
    }
  };

  return (
    <div className="animate-fade-in" style={{ padding: '24px 0' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
        <button 
          onClick={onBack}
          style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '8px', borderRadius: '50%', display: 'flex' }}
          className="btn-secondary"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 style={{ fontSize: '2rem', fontFamily: 'var(--font-display)' }}>
            {revisionParentId ? "Upload Revised Version" : "New Creative Analysis"}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            {revisionParentId ? "Analyze a replacement iteration to directly compare scores." : "Submit an asset to run visual, audio, transcription, and copy analysis."}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        
        {/* Left Column: Upload Drop Zone */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', height: '100%', minHeight: '400px' }}>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '16px', fontFamily: 'var(--font-display)' }}>Creative Asset</h3>
          
          {!file ? (
            <div 
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              style={{
                flex: 1,
                border: '2px dashed',
                borderColor: getPlatformBorder(),
                background: getPlatformGradient(),
                borderRadius: '12px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '40px 20px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              className="dropzone-interactive"
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileSelect} 
                accept="video/*,image/*" 
                style={{ display: 'none' }} 
              />
              <div className="flex-center" style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.2)', marginBottom: '16px', color: 'var(--accent-primary)' }}>
                <Upload size={24} />
              </div>
              <p style={{ fontWeight: 600, marginBottom: '8px' }}>Drag & drop your file here</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textAlign: 'center', maxWidth: '240px' }}>
                Supports MP4, MOV, WebM, PNG, JPEG up to 100MB
              </p>
            </div>
          ) : (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ position: 'relative', flex: 1, minHeight: '260px', maxHeight: '340px', background: '#000', borderRadius: '12px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <button 
                  type="button"
                  onClick={removeFile}
                  style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(0,0,0,0.6)', border: 'none', color: '#fff', padding: '6px', borderRadius: '50%', cursor: 'pointer', zIndex: 10 }}
                >
                  <X size={16} />
                </button>
                {fileType === 'video' && previewUrl ? (
                  <video src={previewUrl} controls style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                ) : previewUrl ? (
                  <img src={previewUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                ) : null}
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glow)', borderRadius: '8px' }}>
                {fileType === 'video' ? <Film size={18} style={{ color: 'var(--accent-primary)' }} /> : <Image size={18} style={{ color: 'var(--accent-secondary)' }} />}
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <p style={{ fontSize: '0.875rem', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                </div>
              </div>
            </div>
          )}

          {/* Upload Progress Loader */}
          {(uploading || submitting) && (
            <div style={{ marginTop: '20px', padding: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glow)', borderRadius: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Loader2 className="animate-spin" size={14} style={{ color: 'var(--accent-primary)' }} />
                  {uploading ? `Uploading Creative Asset...` : `Scheduling AI Processing Pipelines...`}
                </p>
                {uploading && <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{uploadProgress}%</span>}
              </div>
              {uploading && (
                <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${uploadProgress}%`, height: '100%', background: 'var(--accent-primary)', transition: 'width 0.1s' }}></div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Parameters */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ fontSize: '1.15rem', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            Metadata & Settings
          </h3>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500, marginBottom: '8px' }}>Target Platform</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              {[
                { id: 'instagram', label: 'Instagram' },
                { id: 'tiktok', label: 'TikTok' },
                { id: 'youtube', label: 'YouTube' }
              ].map(p => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPlatform(p.id)}
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid',
                    borderColor: platform === p.id ? 'var(--accent-primary)' : 'var(--border-glow)',
                    background: platform === p.id ? 'var(--accent-primary-glow)' : 'transparent',
                    color: platform === p.id ? '#fff' : 'var(--text-secondary)',
                    fontWeight: platform === p.id ? 600 : 'normal',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500, marginBottom: '8px' }}>Content Objective</label>
            <select 
              className="glass-input" 
              value={objective} 
              onChange={e => setObjective(e.target.value)}
              style={{ width: '100%', padding: '12px', fontSize: '0.9rem' }}
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500, marginBottom: '8px' }}>Content Niche</label>
              <input 
                type="text" 
                placeholder="e.g. Finance Hacks" 
                className="glass-input"
                value={niche}
                onChange={e => setNiche(e.target.value)}
                style={{ width: '100%', padding: '12px', fontSize: '0.9rem' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500, marginBottom: '8px' }}>Language</label>
              <select 
                className="glass-input" 
                value={language}
                onChange={e => setLanguage(e.target.value)}
                style={{ width: '100%', padding: '12px', fontSize: '0.9rem' }}
              >
                <option value="en">English (US/UK)</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="hi">Hindi</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500, marginBottom: '8px' }}>Target Audience</label>
            <input 
              type="text" 
              placeholder="e.g. Beginner developers, age 18-24" 
              className="glass-input"
              value={audience}
              onChange={e => setAudience(e.target.value)}
              style={{ width: '100%', padding: '12px', fontSize: '0.9rem' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500, marginBottom: '8px' }}>Current Caption (Optional)</label>
            <textarea 
              placeholder="Paste your drafted caption here to get optimization suggestions..." 
              className="glass-input"
              value={caption}
              onChange={e => setCaption(e.target.value)}
              style={{ width: '100%', padding: '12px', fontSize: '0.9rem', minHeight: '80px', resize: 'vertical' }}
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-accent" 
            disabled={!file || uploading || submitting}
            style={{ width: '100%', marginTop: 'auto', padding: '14px', fontSize: '1rem', opacity: (!file || uploading || submitting) ? 0.5 : 1 }}
          >
            {uploading || submitting ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Processing...
              </>
            ) : (
              <>
                <Sparkles size={18} />
                Analyze Content
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
