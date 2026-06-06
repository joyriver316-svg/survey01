import React from 'react';

export default function FormulasTab({ thresholds, setThresholds, weights, setWeights }) {
  
  const handleThresholdChange = (key, val) => {
    const numVal = parseInt(val) || 0;
    setThresholds(prev => ({ ...prev, [key]: numVal }));
  };

  const handleWeightChange = (key, val) => {
    const numVal = parseInt(val) || 0;
    setWeights(prev => ({ ...prev, [key]: numVal }));
  };

  return (
    <div className="animate-fade">
      <div style={{ marginBottom: '20px' }}>
        <h2>AuraCode 연산 수식 및 가중치 제어판</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '4px' }}>
          피부유형 판정 기준선(Threshold) 및 각 설문 문항별 가중치 점수(Weight)를 실시간으로 조정합니다. 변경 즉시 설문 시뮬레이터 연산에 반영됩니다.
        </p>
      </div>

      {/* 1. Threshold Configuration Panel */}
      <div className="glass-panel" style={{ marginBottom: '20px', padding: '16px' }}>
        <h3 style={{ fontSize: '0.95rem', marginBottom: '12px', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px', color: 'var(--primary)' }}>
          ⚙️ 192 분류 판정 기준선 (Thresholds)
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '12px' }}>
          각 진단축 점수가 설정된 기준선 이상일 때 해당 피부 성향(지성/민감성/색소성/주름성)으로 인코딩됩니다.
        </p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>지성 (O) 기준선</label>
            <input 
              type="number" 
              value={thresholds.O} 
              onChange={(e) => handleThresholdChange('O', e.target.value)} 
              style={{ padding: '6px' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>건성 (D) 기준선</label>
            <input 
              type="number" 
              value={thresholds.D} 
              onChange={(e) => handleThresholdChange('D', e.target.value)} 
              style={{ padding: '6px' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>민감성 (S) 기준선</label>
            <input 
              type="number" 
              value={thresholds.S} 
              onChange={(e) => handleThresholdChange('S', e.target.value)} 
              style={{ padding: '6px' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>색소성 (P) 기준선</label>
            <input 
              type="number" 
              value={thresholds.P} 
              onChange={(e) => handleThresholdChange('P', e.target.value)} 
              style={{ padding: '6px' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>주름성 (W) 기준선</label>
            <input 
              type="number" 
              value={thresholds.W} 
              onChange={(e) => handleThresholdChange('W', e.target.value)} 
              style={{ padding: '6px' }}
            />
          </div>
        </div>
      </div>

      {/* 2. Weights Configuration Panel */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        
        {/* O/D Group */}
        <div className="glass-panel" style={{ padding: '16px' }}>
          <h3 style={{ fontSize: '0.95rem', marginBottom: '12px', color: 'var(--primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px' }}>
            O/D 유수분 가중치 설정
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Q4 세안후 당김 (D점수 가산)</span>
              <input type="number" value={weights.Q4_dry} onChange={(e) => handleWeightChange('Q4_dry', e.target.value)} style={{ width: '60px', padding: '4px' }} />
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Q4 세안후 번들거림 (O점수 가산)</span>
              <input type="number" value={weights.Q4_oily} onChange={(e) => handleWeightChange('Q4_oily', e.target.value)} style={{ width: '60px', padding: '4px' }} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Q4 T존번들/볼당김 (O가산 / D가산)</span>
              <div style={{ display: 'flex', gap: '4px' }}>
                <input type="number" value={weights.Q4_combo_o} onChange={(e) => handleWeightChange('Q4_combo_o', e.target.value)} style={{ width: '45px', padding: '4px' }} />
                <input type="number" value={weights.Q4_combo_d} onChange={(e) => handleWeightChange('Q4_combo_d', e.target.value)} style={{ width: '45px', padding: '4px' }} />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Q10 자가타입 건성/지성/복합성</span>
              <div style={{ display: 'flex', gap: '4px' }}>
                <input type="number" value={weights.Q10_dry} onChange={(e) => handleWeightChange('Q10_dry', e.target.value)} style={{ width: '40px', padding: '4px' }} title="건성 가산" />
                <input type="number" value={weights.Q10_oily} onChange={(e) => handleWeightChange('Q10_oily', e.target.value)} style={{ width: '40px', padding: '4px' }} title="지성 가산" />
                <input type="number" value={weights.Q10_combo} onChange={(e) => handleWeightChange('Q10_combo', e.target.value)} style={{ width: '40px', padding: '4px' }} title="복합성 가산" />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Q25 물섭취 부족 (&lt;500ml / &lt;1L)</span>
              <div style={{ display: 'flex', gap: '4px' }}>
                <input type="number" value={weights.Q25_under500} onChange={(e) => handleWeightChange('Q25_under500', e.target.value)} style={{ width: '45px', padding: '4px' }} />
                <input type="number" value={weights.Q25_under1l} onChange={(e) => handleWeightChange('Q25_under1l', e.target.value)} style={{ width: '45px', padding: '4px' }} />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Q35 냉난방기/재택 건조 (D가산)</span>
              <input type="number" value={weights.Q35_dry} onChange={(e) => handleWeightChange('Q35_dry', e.target.value)} style={{ width: '60px', padding: '4px' }} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Q36 날씨 건조 / 번들 (D가산 / O가산)</span>
              <div style={{ display: 'flex', gap: '4px' }}>
                <input type="number" value={weights.Q36_dry} onChange={(e) => handleWeightChange('Q36_dry', e.target.value)} style={{ width: '45px', padding: '4px' }} />
                <input type="number" value={weights.Q36_oily} onChange={(e) => handleWeightChange('Q36_oily', e.target.value)} style={{ width: '45px', padding: '4px' }} />
              </div>
            </div>

          </div>
        </div>

        {/* S/R Group */}
        <div className="glass-panel" style={{ padding: '16px' }}>
          <h3 style={{ fontSize: '0.95rem', marginBottom: '12px', color: 'var(--danger)', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px' }}>
            S/R 민감도 가중치 설정
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Q1 따가움 (가끔 / 자주 / 매일)</span>
              <div style={{ display: 'flex', gap: '4px' }}>
                <input type="number" value={weights.Q1_level2} onChange={(e) => handleWeightChange('Q1_level2', e.target.value)} style={{ width: '40px', padding: '4px' }} />
                <input type="number" value={weights.Q1_level3} onChange={(e) => handleWeightChange('Q1_level3', e.target.value)} style={{ width: '40px', padding: '4px' }} />
                <input type="number" value={weights.Q1_level4} onChange={(e) => handleWeightChange('Q1_level4', e.target.value)} style={{ width: '40px', padding: '4px' }} />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Q3 제품자극 (가끔 / 절반 / 대부분)</span>
              <div style={{ display: 'flex', gap: '4px' }}>
                <input type="number" value={weights.Q3_level2} onChange={(e) => handleWeightChange('Q3_level2', e.target.value)} style={{ width: '40px', padding: '4px' }} />
                <input type="number" value={weights.Q3_level3} onChange={(e) => handleWeightChange('Q3_level3', e.target.value)} style={{ width: '40px', padding: '4px' }} />
                <input type="number" value={weights.Q3_level4} onChange={(e) => handleWeightChange('Q3_level4', e.target.value)} style={{ width: '40px', padding: '4px' }} />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Q4 세안후 붉어짐 자극 가산</span>
              <input type="number" value={weights.Q4_sensitive} onChange={(e) => handleWeightChange('Q4_sensitive', e.target.value)} style={{ width: '60px', padding: '4px' }} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Q5 트러블 빈도 최대 한도 제한</span>
              <input type="number" value={weights.Q5_max} onChange={(e) => handleWeightChange('Q5_max', e.target.value)} style={{ width: '60px', padding: '4px' }} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Q8 가족력 (아토피 / 민감성)</span>
              <div style={{ display: 'flex', gap: '4px' }}>
                <input type="number" value={weights.Q8_atopic} onChange={(e) => handleWeightChange('Q8_atopic', e.target.value)} style={{ width: '45px', padding: '4px' }} />
                <input type="number" value={weights.Q8_sensitive} onChange={(e) => handleWeightChange('Q8_sensitive', e.target.value)} style={{ width: '45px', padding: '4px' }} />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Q9 질환진단 의심 가산점</span>
              <input type="number" value={weights.Q9_illness} onChange={(e) => handleWeightChange('Q9_illness', e.target.value)} style={{ width: '60px', padding: '4px' }} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Q36 날씨반응 (예민홍조 / 트러블발생)</span>
              <div style={{ display: 'flex', gap: '4px' }}>
                <input type="number" value={weights.Q36_sensitive} onChange={(e) => handleWeightChange('Q36_sensitive', e.target.value)} style={{ width: '45px', padding: '4px' }} />
                <input type="number" value={weights.Q36_trouble} onChange={(e) => handleWeightChange('Q36_trouble', e.target.value)} style={{ width: '45px', padding: '4px' }} />
              </div>
            </div>

          </div>
        </div>

        {/* P/N Group */}
        <div className="glass-panel" style={{ padding: '16px' }}>
          <h3 style={{ fontSize: '0.95rem', marginBottom: '12px', color: 'var(--warning)', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px' }}>
            P/N 색소성 가중치 설정
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Q13 햇볕톤변화 (살짝 / 유지 / 기미)</span>
              <div style={{ display: 'flex', gap: '4px' }}>
                <input type="number" value={weights.Q13_level2} onChange={(e) => handleWeightChange('Q13_level2', e.target.value)} style={{ width: '40px', padding: '4px' }} />
                <input type="number" value={weights.Q13_level3} onChange={(e) => handleWeightChange('Q13_level3', e.target.value)} style={{ width: '40px', padding: '4px' }} />
                <input type="number" value={weights.Q13_level4} onChange={(e) => handleWeightChange('Q13_level4', e.target.value)} style={{ width: '40px', padding: '4px' }} />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Q14 잡티개수 (1~2개 / 산발 / 광범위)</span>
              <div style={{ display: 'flex', gap: '4px' }}>
                <input type="number" value={weights.Q14_level2} onChange={(e) => handleWeightChange('Q14_level2', e.target.value)} style={{ width: '40px', padding: '4px' }} />
                <input type="number" value={weights.Q14_level3} onChange={(e) => handleWeightChange('Q14_level3', e.target.value)} style={{ width: '40px', padding: '4px' }} />
                <input type="number" value={weights.Q14_level4} onChange={(e) => handleWeightChange('Q14_level4', e.target.value)} style={{ width: '40px', padding: '4px' }} />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Q8 가족력 기미 색소 가산점</span>
              <input type="number" value={weights.Q8_pigment} onChange={(e) => handleWeightChange('Q8_pigment', e.target.value)} style={{ width: '60px', padding: '4px' }} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Q21 야외활동 야외누출 자외선 가산</span>
              <input type="number" value={weights.Q21_outdoor} onChange={(e) => handleWeightChange('Q21_outdoor', e.target.value)} style={{ width: '60px', padding: '4px' }} />
            </div>

          </div>
        </div>

        {/* W/T Group */}
        <div className="glass-panel" style={{ padding: '16px' }}>
          <h3 style={{ fontSize: '0.95rem', marginBottom: '12px', color: 'var(--accent)', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px' }}>
            W/T 주름/탄력 가중치 설정
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Q15 무표정주름 (자세히 / 명확 / 깊음)</span>
              <div style={{ display: 'flex', gap: '4px' }}>
                <input type="number" value={weights.Q15_level2} onChange={(e) => handleWeightChange('Q15_level2', e.target.value)} style={{ width: '40px', padding: '4px' }} />
                <input type="number" value={weights.Q15_level3} onChange={(e) => handleWeightChange('Q15_level3', e.target.value)} style={{ width: '40px', padding: '4px' }} />
                <input type="number" value={weights.Q15_level4} onChange={(e) => handleWeightChange('Q15_level4', e.target.value)} style={{ width: '40px', padding: '4px' }} />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Q17 표정주름 (살짝 / 명확 / 고정주름)</span>
              <div style={{ display: 'flex', gap: '4px' }}>
                <input type="number" value={weights.Q17_level2} onChange={(e) => handleWeightChange('Q17_level2', e.target.value)} style={{ width: '40px', padding: '4px' }} />
                <input type="number" value={weights.Q17_level3} onChange={(e) => handleWeightChange('Q17_level3', e.target.value)} style={{ width: '40px', padding: '4px' }} />
                <input type="number" value={weights.Q17_level4} onChange={(e) => handleWeightChange('Q17_level4', e.target.value)} style={{ width: '40px', padding: '4px' }} />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Q8 가족력 조기노화 가산점</span>
              <input type="number" value={weights.Q8_aging} onChange={(e) => handleWeightChange('Q8_aging', e.target.value)} style={{ width: '60px', padding: '4px' }} />
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
