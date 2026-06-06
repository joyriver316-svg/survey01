import React, { useState } from 'react';
import { initialQuestions } from './data/initialQuestions';
import { interstitials as initialInterstitials } from './data/interstitials';
import QuestionsTab from './components/QuestionsTab';
import FormulasTab from './components/FormulasTab';
import LogicTab from './components/LogicTab';
import InterstitialsTab from './components/InterstitialsTab';
import PreviewTab from './components/PreviewTab';
import IntegrationsTab from './components/IntegrationsTab';


const defaultOptionValueMaps = {
  Q9: ["FILTER.SAFE_MODE.ATOPIC", "FILTER.SAFE_MODE.ATOPIC", "FILTER.SAFE_MODE.ATOPIC", "FILTER.SAFE_MODE.ATOPIC", "FILTER.SAFE_MODE.ATOPIC", "FILTER.SAFE_MODE.ATOPIC", "FILTER.SAFE_MODE.NONE"],
  Q22: ["MOD.PREGNANT", "MOD.PREGNANT", "MOD.MENSES", "MOD.MENSES", "MOD.HORMONE", "MOD.THYROID", "MOD.NONE"],
  Q23: ["MOD.MENSES", "MOD.MENSES", "MOD.NONE", "MOD.NONE", "MOD.NONE", "MOD.NONE"],
  Q27: ["MOD.STRESS_LOW", "MOD.STRESS_LOW", "MOD.STRESS_LOW", "MOD.STRESS_LOW", "MOD.STRESS_HIGH", "MOD.STRESS_HIGH", "MOD.STRESS_HIGH"],
  Q34: ["FORM.LOW_IRRITATION", "FORM.DEEP_CLEANSE", "FORM.MOISTURIZING", "FORM.EXFOLIATION"],
  Q38: ["ING.ALLERGY.PARABEN", "ING.ALLERGY.SILICONE", "ING.ALLERGY.MINERAL_OIL", "ING.ALLERGY.FRAGRANCE", "ING.ALLERGY.METHANOL", "ING.ALLERGY.SULFATE", "ING.ALLERGY.NONE", "ING.ALLERGY.OTHER"],
  Q39: ["ING.ALLERGY.ESSENTIAL_OIL", "ING.ALLERGY.RETINOL", "ING.ALLERGY.ACID", "ING.ALLERGY.NICKEL", "ING.ALLERGY.LATEX", "ING.ALLERGY.FRAGRANCE", "ING.ALLERGY.ALCOHOL", "ING.ALLERGY.PARABEN", "ING.ALLERGY.NIACINAMIDE", "ING.ALLERGY.NONE", "ING.ALLERGY.OTHER"],
  Q40: ["ING.ALLERGY.FRAGRANCE", "ING.ALLERGY.FRAGRANCE", "ING.ALLERGY.FRAGRANCE", "ING.ALLERGY.NONE"],
  Q42: ["ING.USED.RETINOL", "ING.USED.NIACINAMIDE", "ING.USED.VITAMIN_C", "ING.USED.PEPTIDE", "ING.USED.AHA", "ING.USED.BHA", "ING.USED.NONE", "ING.USED.NONE"],
  Q43: ["LIT.L1", "LIT.L2", "LIT.L3", "LIT.L4"],
  Q44: ["SPEND.T1", "SPEND.T2", "SPEND.T3", "SPEND.T4", "SPEND.T5", "SPEND.T6"],
  Q45: ["REPURCHASE.EXPLORER", "REPURCHASE.EXPLORER", "REPURCHASE.LOYALIST", "REPURCHASE.LOYALIST", "REPURCHASE.LOYALIST"],
  Q46: ["FRAGRANCE.NONE", "FRAGRANCE.NATURAL", "FRAGRANCE.FLORAL", "FRAGRANCE.CITRUS", "FRAGRANCE.WOODY", "FRAGRANCE.MUSK", "FRAGRANCE.NONE"],
  Q47: ["EXPECT.INGREDIENT", "EXPECT.ROUTINE", "EXPECT.HIDDEN_BRAND", "EXPECT.COST_EFFECTIVE"]
};

export default function App() {
  const [questions, setQuestions] = useState(() => {
    return initialQuestions.map(q => ({
      ...q,
      valueMap: defaultOptionValueMaps[q.id] || Array(q.options ? q.options.length : 0).fill('')
    }));
  });
  const [activeTab, setActiveTab] = useState('questions');
  const [theme, setTheme] = useState('light');
  const [interstitials, setInterstitials] = useState(initialInterstitials);

  // Webhook & API integration state
  const [webhookUrl, setWebhookUrl] = useState('https://api.a-aura.com/v1/recommendation');
  const [webhookEnabled, setWebhookEnabled] = useState(true);
  const [webhookLogs, setWebhookLogs] = useState([]);

  const addWebhookLog = (message) => {
    setWebhookLogs(prev => [
      { timestamp: new Date().toLocaleTimeString(), message },
      ...prev.slice(0, 49)
    ]);
  };

  // B2B SaaS Algorithm Threshold Parameter State
  const [thresholds, setThresholds] = useState({
    S: 30, // 민감성 기준선
    P: 25, // 색소성 기준선
    W: 25, // 주름성 기준선
    O: 35, // 지성 기준선
    D: 35  // 건성 기준선
  });

  // B2B SaaS Algorithm Weight Parameter State
  const [weights, setWeights] = useState({
    Q1_level2: 2, Q1_level3: 5, Q1_level4: 7, // 따가움 가끔/자주/매일
    Q3_level2: 2, Q3_level3: 5, Q3_level4: 7, // 자극 가끔/절반/대부분
    Q4_dry: 5, Q4_oily: 5, Q4_combo_o: 3, Q4_combo_d: 2, Q4_sensitive: 3, // 세안후 당김/번들/T존/붉어짐
    Q5_max: 4, // 트러블 최대 S가산점
    Q8_atopic: 2, Q8_sensitive: 2, Q8_pigment: 2, Q8_aging: 2, // 가족력 가산
    Q9_illness: 5, // 의심 질환 민감도 추가 가산
    Q10_dry: 15, Q10_oily: 15, Q10_combo: 8, // 평소타입 자가진단 건성/지성/복합성
    Q13_level2: 2, Q13_level3: 5, Q13_level4: 7, // 자외선 톤변화 살짝/어두워짐/기미
    Q14_level2: 2, Q14_level3: 5, Q14_level4: 7, // 잡티수 1~2개/산발/광범위
    Q15_level2: 2, Q15_level3: 5, Q15_level4: 7, // 무표정 주름 자세히/명확/깊음
    Q17_level2: 3, Q17_level3: 6, Q17_level4: 8, // 표정 주름 살짝/명확/고정주름
    Q21_outdoor: 2, // 야외활동 1시간이상 가산
    Q25_under500: 2, Q25_under1l: 1, // 물섭취 건성 가산
    Q35_dry: 1, // 냉난방기/재택근무 건성 가산
    Q36_dry: 2, Q36_oily: 2, Q36_sensitive: 2, Q36_trouble: 2 // 날씨 반응 점수
  });

  const tabs = [
    {
      id: 'questions',
      name: '문항 추가/수정',
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
          <line x1="8" y1="6" x2="21" y2="6"></line>
          <line x1="8" y1="12" x2="21" y2="12"></line>
          <line x1="8" y1="18" x2="21" y2="18"></line>
          <line x1="3" y1="6" x2="3.01" y2="6"></line>
          <line x1="3" y1="12" x2="3.01" y2="12"></line>
          <line x1="3" y1="18" x2="3.01" y2="18"></line>
        </svg>
      )
    },
    {
      id: 'interstitials',
      name: '중간 팝업 설정',
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
      )
    },
    {
      id: 'formulas',
      name: '수식 (Formula) 설정',
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
          <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
          <line x1="9" y1="9" x2="15" y2="9"></line>
          <line x1="9" y1="15" x2="15" y2="15"></line>
          <line x1="12" y1="6" x2="12" y2="18"></line>
        </svg>
      )
    },
    {
      id: 'logic',
      name: '조건부 로직',
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
          <line x1="6" y1="3" x2="6" y2="15"></line>
          <circle cx="18" cy="6" r="3"></circle>
          <circle cx="6" cy="18" r="3"></circle>
          <path d="M18 9a9 9 0 0 1-9 9"></path>
        </svg>
      )
    },
    {
      id: 'preview',
      name: '설문 미리보기',
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
          <polygon points="5 3 19 12 5 21 5 3"></polygon>
        </svg>
      )
    },
    {
      id: 'integrations',
      name: 'API 및 웹훅 연동',
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
        </svg>
      )
    }
  ];

  return (
    <div className="dashboard-container" data-theme={theme}>
      {/* Sidebar Navigation */}
      <div className="sidebar">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <polyline points="16 18 22 12 16 6"></polyline>
              <polyline points="8 6 2 12 8 18"></polyline>
            </svg>
            <h2 style={{ fontSize: '1.15rem', fontWeight: '700', letterSpacing: '-0.03em', color: 'var(--text-primary)' }}>
              AAuraCode
            </h2>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', paddingLeft: '4px' }}>
            A.Aura 설문 & 알고리즘 솔루션
          </p>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon}
              <span className="nav-text">{tab.name}</span>
            </div>
          ))}
        </nav>

        {/* Sidebar Footer info */}
        <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border-color)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button 
            className="btn btn-secondary" 
            style={{ width: '100%', justifyContent: 'center', padding: '6px 10px', fontSize: '0.8rem', display: 'flex', gap: '6px' }}
            onClick={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? '☀️ 라이트 모드' : '🌙 다크 모드'}
          </button>
          
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>총 등록 문항</span>
              <span className="badge badge-violet" style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>{questions.length}개</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>스마트 순서기록</span>
              <span className="badge badge-teal" style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>활성</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Pane */}
      <div className="main-content">
        <h1>{tabs.find(t => t.id === activeTab)?.name}</h1>
        
        {activeTab === 'questions' && (
          <QuestionsTab questions={questions} setQuestions={setQuestions} />
        )}
        {activeTab === 'interstitials' && (
          <InterstitialsTab interstitials={interstitials} setInterstitials={setInterstitials} />
        )}
        {activeTab === 'formulas' && (
          <FormulasTab 
            thresholds={thresholds} 
            setThresholds={setThresholds} 
            weights={weights} 
            setWeights={setWeights} 
          />
        )}
        {activeTab === 'logic' && (
          <LogicTab />
        )}
        {activeTab === 'preview' && (
          <PreviewTab 
            questions={questions} 
            thresholds={thresholds} 
            weights={weights} 
            webhookUrl={webhookUrl}
            webhookEnabled={webhookEnabled}
            addWebhookLog={addWebhookLog}
            interstitials={interstitials}
          />
        )}
        {activeTab === 'integrations' && (
          <IntegrationsTab 
            webhookUrl={webhookUrl}
            setWebhookUrl={setWebhookUrl}
            webhookEnabled={webhookEnabled}
            setWebhookEnabled={setWebhookEnabled}
            webhookLogs={webhookLogs}
            addWebhookLog={addWebhookLog}
          />
        )}
      </div>
    </div>
  );
}
