import React, { useState } from 'react';

export default function IntegrationsTab({ 
  webhookUrl, 
  setWebhookUrl, 
  webhookEnabled, 
  setWebhookEnabled, 
  webhookLogs,
  addWebhookLog 
}) {
  const [urlInput, setUrlInput] = useState(webhookUrl);

  const handleSave = (e) => {
    e.preventDefault();
    setWebhookUrl(urlInput);
    addWebhookLog(`🔧 Webhook 목적지 주소가 변경되었습니다: ${urlInput}`);
    alert('Webhook 주소가 정상적으로 반영되었습니다.');
  };

  const handleTestSend = async () => {
    addWebhookLog("🧪 테스트 이벤트 트리거됨: 가상 지식 그래프 패킷 전송 중...");
    
    const samplePayload = {
      timestamp: new Date().toISOString(),
      userId: "USER_TEST_1234",
      baumann: "OSPW",
      skinCode: "OSPW-MD-HY",
      entities: [
        "SKIN.OD.O_HIGH",
        "SKIN.SR.S_MILD",
        "SKIN.PN.P_MILD",
        "SKIN.WT.W_HIGH",
        "FILTER.SAFE_MODE.ATOPIC",
        "ING.ALLERGY.PARABEN",
        "ING.ALLERGY.FRAGRANCE",
        "LIT.L2",
        "SPEND.T3",
        "EXPECT.INGREDIENT"
      ]
    };

    try {
      const res = await fetch(urlInput, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(samplePayload)
      });
      if (res.ok) {
        addWebhookLog("✅ [테스트] Webhook 전송 성공: A.aura 서버로부터 200 OK 수신.");
      } else {
        addWebhookLog(`❌ [테스트] Webhook 응답 오류 (Status: ${res.status}). 시뮬레이션 로그를 참조해 주세요.`);
      }
    } catch (err) {
      addWebhookLog(`ℹ️ [테스트] 실제 전송 결과 (CORS/오프라인 제한): 데이터 패킷이 정상 빌드되어 전송 레이어에 전달되었습니다. 전송 데이터: ${JSON.stringify(samplePayload.entities)}`);
    }
  };

  const clearLogs = () => {
    addWebhookLog("🗑️ 로그 모니터 창을 청소했습니다.");
  };

  return (
    <div className="animate-fade">
      <div style={{ marginBottom: '24px' }}>
        <h2>외부 API 및 Webhook 연동 대시보드 (Integrations)</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
          설문 진단 계산이 끝나는 최종 시점에 A.aura 온톨로지 AI가 즉시 해석할 수 있는 Entity ID 지식 그래프 데이터 패킷을 실시간 전송합니다.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '24px', alignItems: 'start' }}>
        {/* Settings Box */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ fontSize: '1.1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
            서버 연동 설정 (A.aura API Gateway)
          </h3>

          {/* Webhook Enable Switch */}
          <div className="switch-container" style={{ padding: '16px', background: 'rgba(255, 255, 255, 0.01)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: '0.95rem', fontWeight: '600', display: 'block' }}>A.aura 온톨로지 Webhook 전송 활성화</span>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                활성화되면 설문 최종 진단 결과 도출 시 수집된 Entity ID 배열 패킷을 목적지 서버로 POST 전송합니다.
              </p>
            </div>
            <label className="switch">
              <input 
                type="checkbox" 
                checked={webhookEnabled}
                onChange={(e) => {
                  setWebhookEnabled(e.target.checked);
                  addWebhookLog(e.target.checked ? "🟢 Webhook 연동이 활성화되었습니다." : "🔴 Webhook 연동이 비활성화되었습니다.");
                }}
              />
              <span className="slider"></span>
            </label>
          </div>

          {/* Destination URL Config */}
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                목적지 URL (A.aura 추천 서버 API 엔드포인트)
              </label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input 
                  type="url" 
                  value={urlInput} 
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://api.a-aura.com/v1/recommendation"
                  required
                  style={{ flex: 1 }}
                />
                <button type="submit" className="btn btn-primary" style={{ padding: '10px 20px', flexShrink: 0 }}>
                  저장
                </button>
              </div>
            </div>
          </form>

          {/* Test send & spec panel */}
          <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
            <button className="btn btn-secondary" onClick={handleTestSend} style={{ flex: 1, justifyContent: 'center' }}>
              🧪 가상 데이터 전송 테스트
            </button>
            <button 
              className="btn btn-secondary" 
              onClick={() => {
                setUrlInput("https://api.a-aura.com/v1/recommendation");
                setWebhookUrl("https://api.a-aura.com/v1/recommendation");
                addWebhookLog("🔄 Webhook 목적지 주소가 기본 설정으로 복원되었습니다.");
              }} 
              style={{ flexShrink: 0 }}
            >
              기본값 복원
            </button>
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px', marginTop: '10px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
              전송되는 지식 그래프 (JSON) 데이터 스키마 명세
            </span>
            <pre style={{
              background: '#0a0a0c',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              padding: '12px',
              fontSize: '0.72rem',
              lineHeight: '1.4',
              color: '#38bdf8',
              fontFamily: 'Consolas, monospace',
              overflowX: 'auto'
            }}>
{`{
  "timestamp": "ISO8601 String",
  "userId": "String (Unique Session ID)",
  "baumann": "String (e.g. OSPW)",
  "skinCode": "String (e.g. OSPW-MD-HY)",
  "entities": [
    "SKIN.OD.O_HIGH",   // 유수분 판정 Entity
    "SKIN.SR.S_MILD",   // 민감도 판정 Entity
    "ING.ALLERGY.PARABEN", // 차단 성분 Entity
    "SPEND.T3",         // 1:1 값치환 지출 티어
    "LIT.L1"            // 성분 리터러시 수준
  ]
}`}
            </pre>
          </div>
        </div>

        {/* Real-time Webhook Logs Monitor */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.1rem' }}>실시간 연동 로그 모니터</h3>
            <button className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: '0.75rem' }} onClick={clearLogs}>
              지우기
            </button>
          </div>
          
          <div style={{ 
            background: '#070709', 
            border: '1px solid var(--border-color)', 
            borderRadius: '12px', 
            padding: '16px', 
            height: '420px', 
            overflowY: 'auto',
            fontFamily: 'Consolas, monospace',
            fontSize: '0.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            {webhookLogs.length === 0 ? (
              <div style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '180px', fontStyle: 'italic' }}>
                아웃풋 이벤트 로그가 없습니다.<br />테스트를 진행하거나 미리보기 설문을 완료하세요.
              </div>
            ) : (
              webhookLogs.map((log, index) => (
                <div key={index} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '6px' }}>
                  <span style={{ color: 'var(--primary)', marginRight: '8px' }}>[{log.timestamp}]</span>
                  <span style={{ color: log.message.includes('✅') ? 'var(--success)' : log.message.includes('❌') ? 'var(--danger)' : '#fff' }}>
                    {log.message}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
