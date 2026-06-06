import React, { useState } from 'react';

export default function QuestionsTab({ questions, setQuestions }) {
  const [filterSection, setFilterSection] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // New question form state
  const [newId, setNewId] = useState('');
  const [newText, setNewText] = useState('');
  const [newType, setNewType] = useState('single');
  const [newOptionsText, setNewOptionsText] = useState('');
  const [newAxis, setNewAxis] = useState('S/R');
  const [newNotes, setNewNotes] = useState('');
  const [newSection, setNewSection] = useState('A');
  const [newRecordOrder, setNewRecordOrder] = useState(false);

  const sections = [
    { code: 'ALL', name: '전체 보기' },
    { code: 'A', name: '1단계: 피부 본질 (Q1~Q10)' },
    { code: 'B', name: '2단계: 색소/노화 (Q11~Q17)' },
    { code: 'C', name: '3단계: 자외선 반응 (Q18~Q21)' },
    { code: 'D', name: '4단계: 호르몬/습관 (Q22~Q28)' },
    { code: 'E', name: '5단계: 루틴/제품 (Q29~Q34)' },
    { code: 'F_G', name: '6단계: 환경/필터 (Q35~Q40)' },
    { code: 'H_I', name: '7단계: 가치관/채널 (Q41~Q47)' },
    { code: 'J', name: '8단계: 데모그래픽 (Q48~Q50)' }
  ];

  const filteredQuestions = questions.filter(q => {
    const matchSec = filterSection === 'ALL' || q.section === filterSection;
    const matchSearch = q.text.toLowerCase().includes(searchQuery.toLowerCase()) || q.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSec && matchSearch;
  });

  const handleEdit = (q) => {
    setEditingQuestion({
      ...q,
      optionsText: q.options ? q.options.join('\n') : '',
      recordOrder: q.settings?.recordOrder || false,
      valueMap: q.valueMap || Array(q.options ? q.options.length : 0).fill('')
    });
  };

  const saveEdit = (e) => {
    e.preventDefault();
    setQuestions(prev => prev.map(q => {
      if (q.id === editingQuestion.id) {
        const parsedOptions = editingQuestion.optionsText.split('\n').filter(o => o.trim() !== '');
        // Sync valueMap length with parsedOptions
        const syncedValueMap = parsedOptions.map((_, idx) => editingQuestion.valueMap[idx] || '');
        return {
          ...q,
          text: editingQuestion.text,
          type: editingQuestion.type,
          options: parsedOptions,
          valueMap: syncedValueMap,
          axis: editingQuestion.axis,
          notes: editingQuestion.notes,
          section: editingQuestion.section,
          settings: {
            ...q.settings,
            recordOrder: editingQuestion.recordOrder
          }
        };
      }
      return q;
    }));
    setEditingQuestion(null);
    alert(`${editingQuestion.id} 문항이 성공적으로 수정되었습니다!`);
  };

  const handleAdd = (e) => {
    e.preventDefault();
    const id = newId.trim() || `Q${questions.length + 1}`;
    
    // 중복 ID 방지 검증
    if (questions.some(q => q.id === id)) {
      alert(`ID가 "${id}"인 문항이 이미 존재합니다. 다른 ID를 입력해 주세요.`);
      return;
    }

    const options = newOptionsText.split('\n').filter(o => o.trim() !== '');
    
    const newQ = {
      id,
      text: newText,
      type: newType,
      options,
      valueMap: Array(options.length).fill(''),
      axis: newAxis,
      notes: newNotes,
      section: newSection,
      settings: newRecordOrder ? { recordOrder: true } : {}
    };

    setQuestions(prev => [...prev, newQ]);
    setFilterSection('ALL'); // 새 문항이 필터에 가려져 안 보이는 현상 방지
    setSearchQuery(''); // 검색어 초기화
    setShowAddForm(false);
    resetAddForm();
    alert(`${id} 문항이 성공적으로 추가되었습니다!`);
  };

  const resetAddForm = () => {
    setNewId('');
    setNewText('');
    setNewType('single');
    setNewOptionsText('');
    setNewAxis('S/R');
    setNewNotes('');
    setNewSection('A');
    setNewRecordOrder(false);
  };

  const deleteQuestion = (id) => {
    if (confirm(`정말로 ${id} 문항을 삭제하시겠습니까?`)) {
      setQuestions(prev => prev.filter(q => q.id !== id));
    }
  };

  return (
    <div className="animate-fade">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2>문항 관리 대시보드</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            피부진단 설문 문항의 유형, 텍스트, 보기 선택지를 설정하고 AuraCode 기능을 제어합니다.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddForm(true)}>
          <span style={{ fontSize: '1.2rem', lineHeight: '0' }}>+</span> 새 문항 추가
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel" style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ flex: '1', minWidth: '200px' }}>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>섹션 필터</label>
          <select value={filterSection} onChange={(e) => setFilterSection(e.target.value)}>
            {sections.map(s => <option key={s.code} value={s.code}>{s.name}</option>)}
          </select>
        </div>
        <div style={{ flex: '2', minWidth: '300px' }}>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>문항 검색 (ID 또는 질문 텍스트)</label>
          <input 
            type="text" 
            placeholder="예: Q29 또는 수면 시간..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Question Cards List */}
      <div className="question-grid">
        {filteredQuestions.map((q) => (
          <div key={q.id} className="glass-panel question-card" style={{ position: 'relative' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <span className="badge badge-violet" style={{ fontSize: '0.85rem', padding: '4px 8px' }}>{q.id}</span>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <span className={`badge ${
                    q.type === 'single' ? 'badge-blue' : 
                    q.type === 'multi' ? 'badge-teal' : 
                    q.type === 'linear' ? 'badge-orange' : 'badge-rose'
                  }`}>
                    {q.type === 'single' ? '단일선택' : 
                     q.type === 'multi' ? '복수선택' : 
                     q.type === 'linear' ? '선형 배율' : 
                     q.type === 'dropdown' ? '드롭다운' : 
                     q.type === 'dropdown_link' ? '연동 드롭다운' : '주관식'}
                  </span>
                  {q.settings?.recordOrder && (
                    <span className="badge badge-rose" style={{ animation: 'pulseGlow 2s infinite' }}>순서 기록 ON</span>
                  )}
                </div>
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '500', marginBottom: '14px', lineHeight: '1.4' }}>{q.text}</h3>
              
              {q.options && q.options.length > 0 && (
                <div style={{ marginBottom: '16px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>보기 항목:</span>
                  <ul style={{ listStyle: 'none', paddingLeft: '0', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {q.options.slice(0, 5).map((opt, idx) => (
                      <li key={idx} style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>•</span> {opt}
                      </li>
                    ))}
                    {q.options.length > 5 && (
                      <li style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic', paddingLeft: '12px' }}>
                        외 {q.options.length - 5}개 선택지 더 있음...
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>

            <div>
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px', marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  매핑: <strong style={{ color: 'var(--text-secondary)' }}>{q.axis}</strong>
                </span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => handleEdit(q)}>
                    수정
                  </button>
                  <button className="btn btn-danger" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => deleteQuestion(q.id)}>
                    삭제
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Dialog Modal */}
      {editingQuestion && (
        <div className="interstitial-backdrop" style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div className="glass-panel animate-scale" style={{ maxWidth: '600px', width: '100%', padding: '32px' }}>
            <h3 style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
              <span>문항 편집 - {editingQuestion.id}</span>
              <span style={{ cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => setEditingQuestion(null)}>✕</span>
            </h3>
            
            <form onSubmit={saveEdit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>질문 내용</label>
                <textarea 
                  rows="3" 
                  value={editingQuestion.text}
                  onChange={(e) => setEditingQuestion(prev => ({ ...prev, text: e.target.value }))}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>문항 유형</label>
                  <select 
                    value={editingQuestion.type}
                    onChange={(e) => setEditingQuestion(prev => ({ ...prev, type: e.target.value }))}
                  >
                    <option value="single">단일선택</option>
                    <option value="multi">복수선택</option>
                    <option value="linear">선형 배율 (Likert)</option>
                    <option value="dropdown">드롭다운</option>
                    <option value="dropdown_link">연동형 드롭다운</option>
                    <option value="subjective">주관식 단답형</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>진단축 매핑</label>
                  <input 
                    type="text" 
                    value={editingQuestion.axis}
                    onChange={(e) => setEditingQuestion(prev => ({ ...prev, axis: e.target.value }))}
                  />
                </div>
              </div>

              {editingQuestion.type === 'multi' && (
                <div className="glass-panel" style={{ background: 'rgba(255,255,255,0.02)', padding: '12px' }}>
                  <div className="switch-container">
                    <label className="switch">
                      <input 
                        type="checkbox" 
                        checked={editingQuestion.recordOrder}
                        onChange={(e) => setEditingQuestion(prev => ({ ...prev, recordOrder: e.target.checked }))}
                      />
                      <span className="slider"></span>
                    </label>
                    <div>
                      <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>선택 순서 기록 기능 활성화</span>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        사용자가 선택한 순서대로 가중치 점수를 부여하는 순서 배열(Array) 매핑 기능입니다.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {['single', 'multi', 'linear', 'dropdown', 'dropdown_link', 'subjective'].includes(editingQuestion.type) && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                      선택지 목록 (한 줄에 하나씩 입력)
                    </label>
                    <textarea 
                      rows="6" 
                      placeholder="선택지 1&#13;선택지 2&#13;선택지 3"
                      value={editingQuestion.optionsText}
                      onChange={(e) => {
                        const val = e.target.value;
                        const newOpts = val.split('\n');
                        setEditingQuestion(prev => {
                          const nextMap = [...(prev.valueMap || [])];
                          while (nextMap.length < newOpts.length) nextMap.push('');
                          return { ...prev, optionsText: val, valueMap: nextMap };
                        });
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                      데이터 변수 매핑 (Entity ID)
                    </label>
                    <div style={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      gap: '8px', 
                      maxHeight: '144px', 
                      overflowY: 'auto', 
                      border: '1px solid var(--border-color)', 
                      borderRadius: '8px', 
                      padding: '10px', 
                      background: 'rgba(0,0,0,0.15)' 
                    }}>
                      {editingQuestion.optionsText.split('\n').filter(o => o.trim() !== '').map((opt, idx) => (
                        <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <span style={{ 
                            fontSize: '0.72rem', 
                            color: 'var(--text-muted)', 
                            width: '90px', 
                            overflow: 'hidden', 
                            textOverflow: 'ellipsis', 
                            whiteSpace: 'nowrap' 
                          }} title={opt}>
                            {opt}
                          </span>
                          <input 
                            type="text" 
                            style={{ padding: '4px 8px', fontSize: '0.75rem', borderRadius: '4px', flex: 1 }}
                            placeholder={`값 ${idx + 1} 매핑 (예: SPEND.T1)`}
                            value={editingQuestion.valueMap[idx] || ''}
                            onChange={(e) => {
                              const updatedMap = [...editingQuestion.valueMap];
                              updatedMap[idx] = e.target.value;
                              setEditingQuestion(prev => ({ ...prev, valueMap: updatedMap }));
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>가중치 및 연산 로직 (메모)</label>
                <input 
                  type="text" 
                  value={editingQuestion.notes}
                  onChange={(e) => setEditingQuestion(prev => ({ ...prev, notes: e.target.value }))}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setEditingQuestion(null)}>
                  취소
                </button>
                <button type="submit" className="btn btn-primary">
                  저장하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Dialog Modal */}
      {showAddForm && (
        <div className="interstitial-backdrop" style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div className="glass-panel animate-scale" style={{ maxWidth: '600px', width: '100%', padding: '32px' }}>
            <h3 style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
              <span>새 문항 추가</span>
              <span style={{ cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => setShowAddForm(false)}>✕</span>
            </h3>
            
            <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>문항 고유 ID</label>
                  <input 
                    type="text" 
                    placeholder="예: Q51"
                    value={newId}
                    onChange={(e) => setNewId(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>소속 섹션 단계</label>
                  <select value={newSection} onChange={(e) => setNewSection(e.target.value)}>
                    <option value="A">1단계: 피부 본질 (A)</option>
                    <option value="B">2단계: 색소/노화 (B)</option>
                    <option value="C">3단계: 자외선 (C)</option>
                    <option value="D">4단계: 생활습관 (D)</option>
                    <option value="E">5단계: 루틴/제품 (E)</option>
                    <option value="F_G">6단계: 환경/필터 (F_G)</option>
                    <option value="H_I">7단계: 가치관/채널 (H_I)</option>
                    <option value="J">8단계: 데모그래픽 (J)</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>질문 내용</label>
                <textarea 
                  rows="3" 
                  placeholder="피부 진단 질문 텍스트를 입력하세요."
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>문항 유형</label>
                  <select 
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                  >
                    <option value="single">단일선택</option>
                    <option value="multi">복수선택</option>
                    <option value="linear">선형 배율 (Likert)</option>
                    <option value="dropdown">드롭다운</option>
                    <option value="dropdown_link">연동형 드롭다운</option>
                    <option value="subjective">주관식 단답형</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>진단축 매핑</label>
                  <input 
                    type="text" 
                    placeholder="예: O/D, S/R"
                    value={newAxis}
                    onChange={(e) => setNewAxis(e.target.value)}
                  />
                </div>
              </div>

              {newType === 'multi' && (
                <div className="glass-panel" style={{ background: 'rgba(255,255,255,0.02)', padding: '12px' }}>
                  <div className="switch-container">
                    <label className="switch">
                      <input 
                        type="checkbox" 
                        checked={newRecordOrder}
                        onChange={(e) => setNewRecordOrder(e.target.checked)}
                      />
                      <span className="slider"></span>
                    </label>
                    <div>
                      <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>선택 순서 기록 기능 활성화</span>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        사용자가 선택한 순서대로 가중치를 매핑하는 순서 배열(Array) 기능입니다.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  선택지 목록 (한 줄에 하나씩 입력)
                </label>
                <textarea 
                  rows="4" 
                  placeholder="선택지 1&#13;선택지 2"
                  value={newOptionsText}
                  onChange={(e) => setNewOptionsText(e.target.value)}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>가중치 및 연산 로직 (메모)</label>
                <input 
                  type="text" 
                  placeholder="예: 선택 1시 O점수 +5점"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddForm(false)}>
                  취소
                </button>
                <button type="submit" className="btn btn-primary">
                  추가하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
