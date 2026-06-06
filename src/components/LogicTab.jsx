import React from 'react';

export default function LogicTab() {
  const steps = [
    {
      title: "STEP 1: 최우선 안전 필터 (Safety Mode)",
      target: "질환 및 심각반응 (Q9)",
      desc: "의학적 피부 질환(아토피, 지루성 피부염, 습진, 주사비, 건선) 진단 혹은 의심 문항 응답 시, 최종 점수와 무관하게 민감성('S') 피부로 강제 분류하고 백엔드 SAFE MODE 및 전용 안전 필터를 활성화합니다."
    },
    {
      title: "STEP 2: 유수분(O/D) 교차 검증 판정",
      target: "O/D 점수 편차 + 자가진단 (Q2, Q4, Q10)",
      desc: "행동 스코어 (O_score vs D_score) 차이를 기본으로 분류하되, 두 점수가 모두 35점 미만인 경계 영역일 경우 Q10 자가진단 값을 최종 활용합니다. 자가진단이 '복합성(3번)'인 경우 O_MID 지성 약함을 할당하고 COMBO 복합성 태그를 부여합니다."
    },
    {
      title: "STEP 3: 바우만 4글자 조합 (Baumann Code)",
      target: "OD + SR + PN + WT 합산",
      desc: "유수분(O/D), 민감도(S/R), 색소성(P/N), 주름/탄력(W/T) 네 가지 축의 분류 결과를 하나의 4글자 문자열(예: OSPW, DRNT 등)로 조립합니다."
    },
    {
      title: "STEP 4: UV 대응 그룹 (Fitzpatrick + 기후 위도 보정)",
      target: "피부 반응(Q18) + 모발색(Q19) + 거주위도(Q50)",
      desc: "기본 피츠패트릭 등급(LT/MD/DP)에 모발색 가중치를 합치고, 거주 지역/국가의 실제 지구 위도 기후 인덱스 데이터를 조회하여 위도 40도 이상 시 LT(자외선 취약) +1 보정, 25도 이하 시 DP(자외선 차단력) +1 보정을 적용해 최적의 UV 차단 방어막 등급을 확정합니다."
    },
    {
      title: "STEP 5: 다축 결합형 최종 타깃 니즈 (Need) 판정",
      target: "1순위 고민(60%) + 2순위 고민(30%) + 현재 루틴(10%)",
      desc: "고민 고민 1순위(Q6), 2순위(Q7) 및 사용중인 루틴 스킨케어 성분 가점(Q29, Q30)을 복합 가중치 연산합니다. 1, 2순위 카테고리가 서로 어긋날 경우 복합 케어를 위한 TC(토탈/타깃 케어) 권한 플래그가 자동 발생합니다."
    },
    {
      title: "STEP 6: 데이터 신뢰도(Confidence) 일관성 지표",
      target: "Q1-Q11 교차 / Q4-Q10 일치율 검사",
      desc: "자가 보고한 피부상태와 실제 유해반응 간의 일치도를 검증하여 신뢰도가 70% 미만(CONFIDENCE.LOW)인 경우 결과 화면 하단에 전문가 무료 상담 및 재진단 권장 배너 레이어를 강제 노출 제어합니다."
    }
  ];

  return (
    <div className="animate-fade">
      <div style={{ marginBottom: '24px' }}>
        <h2>조건부 로직 & 192 분류 엔진 (Logic)</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
          수집된 원시 피부 스코어를 조립하여 192가지 다차원 피부 유형(바우만 코드 + UV 세그먼트 + 핵심 Need)을 최종 분류하는 라우팅 엔진 로직 명세입니다.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '24px', alignItems: 'start' }}>
        {/* Step Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {steps.map((s, idx) => (
            <div key={idx} className="glass-panel" style={{ display: 'flex', gap: '20px', padding: '20px' }}>
              <div style={{
                background: 'var(--primary-glow)',
                border: '1px solid rgba(139,92,246,0.3)',
                borderRadius: '8px',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary-hover)',
                fontWeight: 'bold',
                flexShrink: '0'
              }}>
                {idx + 1}
              </div>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: '600', marginBottom: '4px' }}>{s.title}</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--accent)', fontWeight: '500', display: 'block', marginBottom: '8px' }}>
                  대상 필드: {s.target}
                </span>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: '1.5' }}>
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Code Visualizer Panel */}
        <div className="glass-panel" style={{ position: 'sticky', top: '20px', padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '14px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
            백엔드 컴파일러 의사 코드
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            설문 완료 시 백엔드 파이프라인에서 192분류 코드를 조립하는 핵심 알고리즘 펑션입니다.
          </p>

          <pre style={{
            background: '#0a0a0c',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            padding: '16px',
            fontFamily: 'Consolas, monospace',
            fontSize: '0.75rem',
            lineHeight: '1.5',
            color: '#a78bfa',
            overflowX: 'auto',
            maxHeight: '500px'
          }}>
{`// 192가지 피부 유형 다차원 분류 알고리즘
function generateFinalSkinCode(responses, scores) {
  let sr, od, pn, wt;

  // 1. 최우선 질환 필터 검증 (Q9)
  if (responses['Q9'] && responses['Q9'].length > 0 && 
      !responses['Q9'].includes('해당 없음')) {
    sr = 'S'; // 무조건 강제 민감성 격리
  } else {
    sr = scores.S_score >= 30 ? 'S' : 'R';
  }

  // 2. 유수분 판정 및 자가진단(Q10) 교차 검증
  if (scores.O_score >= 35 && scores.O_score > scores.D_score) {
    od = 'O';
  } else if (scores.D_score >= 35 && scores.D_score > scores.O_score) {
    od = 'D';
  } else {
    // 경계구역일 때 Q10 응답값 활용
    if (responses['Q10'] === '건성') od = 'D';
    else if (responses['Q10'] === '지성') od = 'O';
    else if (responses['Q10'] === '복합성') {
      od = 'O';
      scores['COMBO_TAG'] = true;
    } else od = 'D';
  }

  // 3. 색소성 및 주름/탄력 판정
  pn = scores.P_score >= 25 ? 'P' : 'N';
  wt = scores.W_score >= 25 ? 'W' : 'T';

  const bauman_code = od + sr + pn + wt; // 예: OSPW

  // 4. 자외선 방어막 그룹 (LT/MD/DP) + 기후 보정
  let uv_raw = 'MD';
  if (responses['Q18']?.includes('항상 빨갛게') || responses['Q18']?.includes('대부분 빨갛게')) {
    uv_raw = 'LT';
  } else if (responses['Q18']?.includes('매우 드물게') || responses['Q18']?.includes('절대 익지')) {
    uv_raw = 'DP';
  }
  let uv_group = adjustUVByEnvironment(uv_raw, responses['Q19'], responses['latitude']);

  // 5. 복합 가중치 1순위(60%)+2순위(30%)+루틴(10%) 니즈 판정
  let need = calculateNeed(responses['Q6'], responses['Q7'], responses['Q29'], responses['Q30']);

  // 6. 192 분류 코드 조립 완료
  return \`\${bauman_code}-\${uv_group}-\${need}\`;
}`}
          </pre>
        </div>
      </div>
    </div>
  );
}
