import React, { useState } from 'react';
import { interstitials as staticInterstitials } from '../data/interstitials';

const PRESET_IMAGES = [
  {
    name: "🧴 스킨케어 보틀 (Aesthetic Bottles)",
    url: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "💦 촉촉한 수분감 (Water Drops)",
    url: "https://images.unsplash.com/photo-1518173946687-a4c8a383392e?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "🌿 자연주의 식물 (Green Leaf)",
    url: "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "❄️ 크림 제형 (Whipped Cream)",
    url: "https://images.unsplash.com/photo-1629732047847-50b7ef468565?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "🔮 프리미엄 그라데이션 (Gradient)",
    url: "https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "✨ 깨끗한 피부 (Clean Skin)",
    url: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80"
  }
];

export default function InterstitialsTab({ interstitials = staticInterstitials, setInterstitials }) {
  const [activePreview, setActivePreview] = useState(null);
  const [progressWidth, setProgressWidth] = useState(0);
  
  // Editing state
  const [editingKey, setEditingKey] = useState(null);
  const [editForm, setEditForm] = useState({
    title: '',
    subtitle: '',
    tone: '',
    imageUrl: ''
  });

  const triggerPreview = (key, screen) => {
    setActivePreview({ key, ...screen });
    setProgressWidth(0);
    
    // Animate progress bar (takes 0.8s)
    setTimeout(() => {
      setProgressWidth(screen.progress);
    }, 100);

    // Auto-close after 2.8 seconds
    setTimeout(() => {
      setActivePreview(null);
    }, 2800);
  };

  const openEditModal = (key, screen) => {
    setEditingKey(key);
    setEditForm({
      title: screen.title || '',
      subtitle: screen.subtitle || '',
      tone: screen.tone || '',
      imageUrl: screen.imageUrl || ''
    });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024 * 2) {
        alert("이미지 크기는 최대 2MB 이하여야 합니다.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditForm(prev => ({ ...prev, imageUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const saveEdit = () => {
    if (!setInterstitials) {
      alert("상위 컴포넌트의 상태를 업데이트할 수 없습니다.");
      return;
    }
    setInterstitials(prev => ({
      ...prev,
      [editingKey]: {
        ...prev[editingKey],
        title: editForm.title,
        subtitle: editForm.subtitle,
        tone: editForm.tone,
        imageUrl: editForm.imageUrl
      }
    }));
    setEditingKey(null);
  };

  return (
    <div className="animate-fade">
      <div style={{ marginBottom: '24px' }}>
        <h2>화면 전환 및 중간 팝업 설정 (Interstitials)</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
          지루함을 방지하고 완독률을 높이기 위해 각 진단 섹션이 종료되는 시점에 노출되는 맞춤 브레이크 화면입니다. 팝업에 노출될 타이틀 정보 및 이미지를 설정할 수 있습니다.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
        {Object.entries(interstitials).map(([key, screen]) => (
          <div key={key} className="glass-panel" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '260px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span className="badge badge-teal" style={{ padding: '4px 8px' }}>
                  {key === 'START' ? '설문 시작' : key === 'FINAL' ? '최종 분석' : `${screen.triggerQuestion} 완료시`}
                </span>
                <span className="badge badge-violet" style={{ fontWeight: 'bold' }}>{screen.progress}% 완료</span>
              </div>
              
              {screen.imageUrl && (
                <div style={{ 
                  width: '100%', 
                  height: '110px', 
                  borderRadius: '6px', 
                  overflow: 'hidden', 
                  marginBottom: '12px',
                  border: '1px solid var(--border-color)'
                }}>
                  <img src={screen.imageUrl} alt={screen.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}

              <h3 style={{ fontSize: '1.05rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '8px' }}>
                {screen.title}
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.4', marginBottom: '16px' }}>
                {screen.subtitle}
              </p>
            </div>
            
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '140px' }}>
                톤: {screen.tone ? screen.tone.split(' ')[0] : '미지정'}
              </span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  className="btn btn-secondary" 
                  style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                  onClick={() => openEditModal(key, screen)}
                >
                  편집
                </button>
                <button 
                  className="btn btn-primary" 
                  style={{ padding: '6px 12px', fontSize: '0.8rem', background: 'var(--primary)', borderColor: 'var(--primary)' }}
                  onClick={() => triggerPreview(key, screen)}
                >
                  재생
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingKey && (
        <div className="interstitial-backdrop" style={{ zIndex: '250', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="interstitial-card animate-scale" style={{ textAlign: 'left', maxWidth: '580px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--text-primary)', margin: 0 }}>
                중간 팝업 설정 편집 - {editingKey === 'START' ? '설문 시작' : editingKey === 'FINAL' ? '최종 분석' : `섹션 (${editingKey})`}
              </h3>
              <span className="badge badge-blue">{interstitials[editingKey].progress}% 완료 지점</span>
            </div>

            {/* Size Guide Box */}
            <div style={{
              background: 'rgba(59, 130, 246, 0.06)',
              border: '1px solid rgba(59, 130, 246, 0.15)',
              borderRadius: '6px',
              padding: '10px 12px',
              marginBottom: '16px',
              fontSize: '0.75rem',
              color: 'var(--text-secondary)'
            }}>
              <strong style={{ color: 'var(--primary)', display: 'block', marginBottom: '4px' }}>
                💡 이미지 규격 및 등록 가이드
              </strong>
              <ul style={{ margin: 0, paddingLeft: '16px', lineHeight: '1.4', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <li><strong>권장 크기:</strong> 800 x 400px (2:1 비율) 또는 1200 x 600px</li>
                <li><strong>권장 포맷:</strong> WebP (모바일 최적화), PNG, JPG</li>
                <li><strong>최대 용량:</strong> 1MB 이하 권장 (네트워크 지연 방지)</li>
                <li>실제 노출 시 영역에 맞춰 <code>object-fit: cover</code> 및 줌 애니메이션이 적용됩니다.</li>
              </ul>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>제목 (Title)</label>
                <input 
                  type="text" 
                  value={editForm.title} 
                  onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))} 
                  placeholder="팝업 제목을 입력해 주세요."
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>부제목 (Subtitle)</label>
                <textarea 
                  rows="3" 
                  value={editForm.subtitle} 
                  onChange={(e) => setEditForm(prev => ({ ...prev, subtitle: e.target.value }))} 
                  placeholder="팝업에 노출될 설명 문구를 입력해 주세요."
                  style={{ resize: 'vertical', width: '100%', minHeight: '60px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>노출 톤 (Tone/Concept)</label>
                <input 
                  type="text" 
                  value={editForm.tone} 
                  onChange={(e) => setEditForm(prev => ({ ...prev, tone: e.target.value }))} 
                  placeholder="예: Trust-Calm (신뢰와 차분함)"
                />
              </div>

              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-primary)', display: 'block', marginBottom: '8px' }}>
                  🖼️ 팝업 이미지 설정
                </label>
                
                {/* Image Input Options */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <div style={{ flex: 1 }}>
                    <input 
                      type="text" 
                      value={editForm.imageUrl} 
                      onChange={(e) => setEditForm(prev => ({ ...prev, imageUrl: e.target.value }))} 
                      placeholder="이미지 URL을 입력하거나 아래에서 업로드/선택하세요."
                      style={{ fontSize: '0.8rem' }}
                    />
                  </div>
                  <div>
                    <label className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem', display: 'flex', cursor: 'pointer', margin: 0 }}>
                      파일 업로드
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileUpload} 
                        style={{ display: 'none' }} 
                      />
                    </label>
                  </div>
                </div>

                {/* Preset List */}
                <div style={{ marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>프리미엄 프리셋 이미지 선택:</span>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                    {PRESET_IMAGES.map((preset, index) => (
                      <button 
                        key={index} 
                        className="btn btn-secondary" 
                        style={{ 
                          padding: '4px', 
                          fontSize: '0.7rem', 
                          textAlign: 'left',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          border: editForm.imageUrl === preset.url ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                          background: editForm.imageUrl === preset.url ? 'var(--primary-glow)' : 'var(--bg-card)'
                        }}
                        onClick={() => setEditForm(prev => ({ ...prev, imageUrl: preset.url }))}
                        title={preset.name}
                      >
                        {preset.name}
                      </button>
                    ))}
                    {editForm.imageUrl && (
                      <button 
                        className="btn btn-danger" 
                        style={{ padding: '4px', fontSize: '0.7rem', gridColumn: 'span 3', marginTop: '4px', justifyContent: 'center' }}
                        onClick={() => setEditForm(prev => ({ ...prev, imageUrl: '' }))}
                      >
                        이미지 제거
                      </button>
                    )}
                  </div>
                </div>

                {/* Image Live Preview inside Modal */}
                {editForm.imageUrl && (
                  <div style={{ marginTop: '12px' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>이미지 미리보기 (2:1 크롭 비율):</span>
                    <div style={{ 
                      width: '100%', 
                      height: '140px', 
                      borderRadius: '6px', 
                      overflow: 'hidden', 
                      border: '1px solid var(--border-color)',
                      boxShadow: 'inset 0 0 10px rgba(0,0,0,0.2)'
                    }}>
                      <img 
                        src={editForm.imageUrl} 
                        alt="Preview" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        onError={(e) => {
                          e.target.style.display = 'none';
                          alert("이미지를 불러올 수 없습니다. 올바른 URL인지 확인해 주세요.");
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
              <button 
                className="btn btn-secondary" 
                onClick={() => setEditingKey(null)}
              >
                취소
              </button>
              <button 
                className="btn btn-primary" 
                style={{ background: 'var(--primary)', borderColor: 'var(--primary)' }}
                onClick={saveEdit}
              >
                변경사항 저장
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interstitial Animation Simulation Overlay */}
      {activePreview && (
        <div className="interstitial-backdrop" style={{ animation: 'fadeIn 0.3s forwards', zIndex: '300' }}>
          <div className="interstitial-card animate-scale" style={{ maxWidth: '500px' }}>
            <span className="badge badge-teal" style={{ marginBottom: '16px' }}>
              {activePreview.key === 'START' ? 'START SCREENER' : activePreview.key === 'FINAL' ? 'BACKEND ENCODING' : `BREAK POINT (${activePreview.key})`}
            </span>
            
            {activePreview.imageUrl && (
              <div style={{ 
                width: '100%', 
                height: '180px', 
                overflow: 'hidden', 
                borderRadius: '8px', 
                marginBottom: '16px',
                border: '1px solid var(--border-color)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
              }}>
                <img 
                  src={activePreview.imageUrl} 
                  alt={activePreview.title} 
                  className="zoom-in-slow"
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover',
                    display: 'block'
                  }} 
                />
              </div>
            )}

            <h2 style={{ fontSize: '1.45rem', color: '#fff', marginBottom: '12px', fontFamily: 'var(--font-display)' }}>
              {activePreview.title}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '24px' }}>
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
