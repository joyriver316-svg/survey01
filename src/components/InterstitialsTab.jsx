import React, { useState } from 'react';
import { interstitials } from '../data/interstitials';

export default function InterstitialsTab() {
  const [activePreview, setActivePreview] = useState(null);
  const [progressWidth, setProgressWidth] = useState(0);

  const triggerPreview = (key, screen) => {
    setActivePreview({ key, ...screen });
    setProgressWidth(0);
    
    // Animate progress bar (takes 0.8s)
    setTimeout(() => {
      setProgressWidth(screen.progress);
    }, 100);

    // Auto-close after 2.5 seconds (0.3s fade + 0.8s fill + 1.5s display)
    setTimeout(() => {
      setActivePreview(null);
    }, 2800);
  };

  return (
    <div className="animate-fade">
      <div style={{ marginBottom: '24px' }}>
        <h2>화면 전환 및 중간 팝업 설정 (Interstitials)</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
          지루함을 방지하고 완독률을 높이기 위해 각 진단 섹션이 종료되는 시점에 1.5초간 노출되는 맞춤 브레이크 화면입니다.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
        {Object.entries(interstitials).map(([key, screen]) => (
          <div key={key} className="glass-panel" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '220px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span className="badge badge-teal" style={{ padding: '4px 8px' }}>
                  {key === 'START' ? '설문 시작' : key === 'FINAL' ? '최종 분석' : `${screen.triggerQuestion} 완료시`}
                </span>
                <span className="badge badge-violet" style={{ fontWeight: 'bold' }}>{screen.progress}% 완료</span>
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '600', color: '#fff', marginBottom: '8px' }}>
                {screen.title}
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.4', marginBottom: '16px' }}>
                {screen.subtitle}
              </p>
            </div>
            
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                톤: {screen.tone.split(' ')[0]}
              </span>
              <button 
                className="btn btn-secondary" 
                style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                onClick={() => triggerPreview(key, screen)}
              >
                미리보기 재생
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Interstitial Animation Simulation Overlay */}
      {activePreview && (
        <div className="interstitial-backdrop" style={{ animation: 'fadeIn 0.3s forwards' }}>
          <div className="interstitial-card animate-scale">
            <span className="badge badge-teal" style={{ marginBottom: '16px' }}>
              {activePreview.key === 'START' ? 'START SCREENER' : activePreview.key === 'FINAL' ? 'BACKEND ENCODING' : `BREAK POINT (${activePreview.key})`}
            </span>
            <h2 style={{ fontSize: '1.6rem', color: '#fff', marginBottom: '12px', fontFamily: 'var(--font-display)' }}>
              {activePreview.title}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '32px' }}>
              {activePreview.subtitle}
            </p>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
              <span>진행률</span>
              <span>{activePreview.progress}%</span>
            </div>
            <div className="progress-bar-container">
              <div 
                className="progress-bar-fill" 
                style={{ 
                  width: `${progressWidth}%`, 
                  transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)' 
                }}
              ></div>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '16px' }}>
              ※ 실제 설문에서는 1.5초간 노출 후 다음 문항으로 자동 스킵 처리됩니다.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
