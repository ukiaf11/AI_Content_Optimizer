import React, { useState } from 'react';
import { 
  Sparkles, 
  Zap, 
  Target, 
  BarChart3, 
  FileText, 
  GitCompare, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  TrendingUp, 
  Clock, 
  Eye,
  Layers,
  Award
} from 'lucide-react';

interface ServicesViewProps {
  onStartAnalysis: () => void;
}

export default function ServicesView({ onStartAnalysis }: ServicesViewProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'audit' | 'optimization' | 'growth'>('all');

  const services = [
    {
      id: 'hook-audit',
      category: 'audit',
      title: '3-Second Hook Retention Audit',
      icon: <Zap size={24} style={{ color: '#f59e0b' }} />,
      gradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(217, 119, 6, 0.05) 100%)',
      borderColor: 'rgba(245, 158, 11, 0.3)',
      tag: 'VIRALITY DRIVER',
      description: 'We probe the critical first 3 seconds of your video to analyze opening visual dynamics, text hook clarity, and audio entry punchiness.',
      benefits: [
        'Identifies exact drop-off risk timestamps',
        'Evaluates visual motion in initial frames',
        'Suggests high-converting text hook alternatives'
      ]
    },
    {
      id: 'safe-zone',
      category: 'optimization',
      title: 'Platform Safe-Zone Grid Mapping',
      icon: <Target size={24} style={{ color: '#00F2FE' }} />,
      gradient: 'linear-gradient(135deg, rgba(0, 242, 254, 0.15) 0%, rgba(79, 70, 229, 0.05) 100%)',
      borderColor: 'rgba(0, 242, 254, 0.3)',
      tag: 'UI COMPLIANCE',
      description: 'Overlays precise button grids for Instagram Reels, TikTok, and YouTube Shorts so your text captions and face focus are never blocked by social UI elements.',
      benefits: [
        'Live interactive overlay for 3 target platforms',
        'Prevents like/comment button overlaps',
        'Ensures 100% subtitle readability'
      ]
    },
    {
      id: 'radar-score',
      category: 'audit',
      title: '8-Factor Creative Quality Radar',
      icon: <BarChart3 size={24} style={{ color: '#6366f1' }} />,
      gradient: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.05) 100%)',
      borderColor: 'rgba(99, 102, 241, 0.3)',
      tag: 'DEEP DIAGNOSTICS',
      description: 'Generates a pure-SVG quality fingerprint rating Hook, Clarity, Edit Pacing, Framing, Speech Audio, Accessibility, SEO, and Engagement from 1 to 100.',
      benefits: [
        'Instant multi-dimensional score breakdown',
        'Highlights top strength & critical fix area',
        'Presents evidence-based improvement checklist'
      ]
    },
    {
      id: 'copy-gen',
      category: 'growth',
      title: 'Copy-Ready SEO Captions & Hashtags',
      icon: <FileText size={24} style={{ color: '#ec4899' }} />,
      gradient: 'linear-gradient(135deg, rgba(236, 72, 153, 0.15) 0%, rgba(244, 63, 94, 0.05) 100%)',
      borderColor: 'rgba(236, 72, 153, 0.3)',
      tag: 'SEARCH OPTIMIZATION',
      description: 'Produces platform-customized captions with core keywords embedded in the first 5 words to rank higher in Instagram & TikTok search discovery.',
      benefits: [
        'Generates 3 tone variations (Viral, Educational, Direct)',
        'Includes high-performing niche hashtag clusters',
        'One-click copy to clipboard'
      ]
    },
    {
      id: 'revision-compare',
      category: 'growth',
      title: 'Side-by-Side Version Comparison',
      icon: <GitCompare size={24} style={{ color: '#10b981' }} />,
      gradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.05) 100%)',
      borderColor: 'rgba(16, 185, 129, 0.3)',
      tag: 'AB TESTING',
      description: 'Upload your edited video draft to compare scores side-by-side with your original version, verifying improvements before going live.',
      benefits: [
        'Calculates exact score gain (+∆ points)',
        'Marks resolved issues automatically',
        'Validates pacing & audio fixes'
      ]
    }
  ];

  const outcomes = [
    {
      metric: '+340%',
      label: 'Higher 3-Sec Hook Retention',
      subtext: 'Stop scroll-past bounces instantly by optimizing early visual text triggers.',
      icon: <Eye size={20} style={{ color: '#00F2FE' }} />
    },
    {
      metric: '2.8x',
      label: 'Average Engagement Rate',
      subtext: 'Eliminate dead pacing gaps and drive more likes, comments, and saves.',
      icon: <TrendingUp size={20} style={{ color: '#10b981' }} />
    },
    {
      metric: '100%',
      label: 'Safe-Zone Readability',
      subtext: 'Ensure zero subtitles or key subjects are hidden beneath platform UI buttons.',
      icon: <ShieldCheck size={20} style={{ color: '#6366f1' }} />
    },
    {
      metric: '< 30s',
      label: 'Turnaround Time',
      subtext: 'Get full multimodal analysis, transcription, and copy in seconds.',
      icon: <Clock size={20} style={{ color: '#ec4899' }} />
    }
  ];

  const filteredServices = activeTab === 'all' 
    ? services 
    : services.filter(s => s.category === activeTab);

  return (
    <div style={{ paddingBottom: '60px', animation: 'fadeIn 0.3s ease' }}>
      
      {/* Hero Section */}
      <section style={{ 
        textAlign: 'center', 
        padding: '60px 20px 40px 20px',
        position: 'relative',
        maxWidth: '900px',
        margin: '0 auto'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          borderRadius: '30px',
          background: 'rgba(99, 102, 241, 0.1)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          color: '#818cf8',
          fontSize: '0.82rem',
          fontWeight: 600,
          marginBottom: '20px',
          letterSpacing: '0.04em'
        }}>
          <Sparkles size={14} /> AI-POWERED CREATIVE INTELLIGENCE PLATFORM
        </div>

        <h1 style={{ 
          fontSize: '2.75rem', 
          fontFamily: 'var(--font-display)', 
          lineHeight: 1.15, 
          marginBottom: '20px',
          background: 'linear-gradient(135deg, #ffffff 0%, #a5b4fc 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Transform Raw Clips into High-Converting Viral Assets
        </h1>

        <p style={{ 
          color: 'var(--text-secondary)', 
          fontSize: '1.1rem', 
          lineHeight: 1.6, 
          maxWidth: '720px', 
          margin: '0 auto 32px auto' 
        }}>
          Our multimodal AI engine analyzes your video frame-by-frame, evaluates audio pacing, tests UI safe-zones, and writes SEO-optimized copy tailored for Instagram, TikTok, and YouTube Shorts.
        </p>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button 
            onClick={onStartAnalysis}
            className="btn btn-primary"
            style={{ padding: '14px 28px', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 20px var(--accent-primary-glow)' }}
          >
            Start Free Analysis <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* Value Outcomes Grid */}
      <section style={{ marginBottom: '60px' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <h2 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-display)', color: '#fff', marginBottom: '8px' }}>
            What You Will Achieve
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Measurable creator results backed by multimodal video intelligence.
          </p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
          gap: '20px' 
        }}>
          {outcomes.map((item, idx) => (
            <div 
              key={idx} 
              className="glass-panel" 
              style={{ 
                padding: '24px', 
                borderRadius: '16px', 
                border: '1px solid var(--border-glow)',
                transition: 'transform 0.2s ease, border-color 0.2s ease',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: '#fff' }}>
                  {item.metric}
                </div>
                <div className="flex-center" style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glow)' }}>
                  {item.icon}
                </div>
              </div>
              <h4 style={{ fontSize: '0.98rem', color: '#fff', fontWeight: 600, marginBottom: '6px' }}>
                {item.label}
              </h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', lineHeight: 1.5 }}>
                {item.subtext}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Services Breakdown Section */}
      <section>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <h2 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-display)', color: '#fff', marginBottom: '8px' }}>
            Our Intelligent Optimization Services
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>
            Comprehensive analysis tools built to maximize retention and platform reach.
          </p>

          {/* Category Filter Tabs */}
          <div style={{ display: 'inline-flex', gap: '8px', background: 'rgba(255,255,255,0.03)', padding: '4px', borderRadius: '12px', border: '1px solid var(--border-glow)' }}>
            {[
              { key: 'all', label: 'All Services' },
              { key: 'audit', label: 'Audits & Scores' },
              { key: 'optimization', label: 'Safe-Zone UI' },
              { key: 'growth', label: 'SEO & Copy' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  background: activeTab === tab.key ? 'var(--accent-primary)' : 'transparent',
                  color: activeTab === tab.key ? '#fff' : 'var(--text-muted)',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Services Cards List */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
          {filteredServices.map(service => (
            <div 
              key={service.id}
              className="glass-panel"
              style={{
                padding: '28px',
                borderRadius: '16px',
                background: service.gradient,
                border: `1px solid ${service.borderColor}`,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.25s ease'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div className="flex-center" style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    {service.icon}
                  </div>
                  <span style={{ 
                    fontSize: '0.7rem', 
                    fontWeight: 700, 
                    letterSpacing: '0.06em', 
                    padding: '4px 10px', 
                    borderRadius: '20px', 
                    background: 'rgba(255,255,255,0.06)', 
                    color: '#fff',
                    border: '1px solid rgba(255,255,255,0.1)'
                  }}>
                    {service.tag}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-display)', color: '#fff', marginBottom: '10px' }}>
                  {service.title}
                </h3>

                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.5, marginBottom: '20px' }}>
                  {service.description}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
                  {service.benefits.map((benefit, bIdx) => (
                    <div key={bIdx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      <CheckCircle2 size={15} style={{ color: 'var(--success)', flexShrink: 0 }} />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button 
                onClick={onStartAnalysis}
                className="btn btn-secondary"
                style={{ width: '100%', padding: '10px', fontSize: '0.88rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                Try This Service <ArrowRight size={14} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section style={{ marginTop: '60px' }}>
        <div className="glass-panel" style={{ 
          padding: '40px', 
          borderRadius: '20px', 
          textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(0, 242, 254, 0.08) 100%)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
        }}>
          <Award size={36} style={{ color: 'var(--accent-primary)', marginBottom: '16px' }} />
          <h2 style={{ fontSize: '1.75rem', fontFamily: 'var(--font-display)', color: '#fff', marginBottom: '12px' }}>
            Ready to Optimize Your Next Viral Creative?
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '580px', margin: '0 auto 24px auto' }}>
            Upload your video asset now and get a comprehensive scorecard with copy-ready captions in seconds.
          </p>
          <button 
            onClick={onStartAnalysis}
            className="btn btn-primary"
            style={{ padding: '12px 28px', fontSize: '0.95rem' }}
          >
            Launch Creative Analyzer
          </button>
        </div>
      </section>

    </div>
  );
}
