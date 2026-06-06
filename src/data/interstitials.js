export const interstitials = {
  START: {
    progress: 0,
    title: "환영합니다! ✨",
    subtitle: "당신의 피부를 가장 정확하게 이해하기 위한 4분의 여정을 시작합니다. 정답은 없어요. 솔직하게 답해주세요.",
    tone: "Trust-Calm (신뢰와 차분함)"
  },
  SEC_A: {
    triggerQuestion: "Q10",
    progress: 20,
    title: "당신의 피부 본질이 보이기 시작했어요 🔍",
    subtitle: "수분과 유분의 균형, 그리고 자극에 반응하는 방식까지 피부의 가장 깊은 층을 파악했어요. 이제 시간의 흔적을 살펴볼게요.",
    tone: "Discovery (새로운 발견)"
  },
  SEC_B: {
    triggerQuestion: "Q17",
    progress: 34,
    title: "시간을 거스르는 단서를 찾았어요 ⏳",
    subtitle: "색소가 남는 방식과 주름이 자리잡는 형태 - 당신만의 노화 패턴이 드러나고 있어요. Soft Aging의 시작이에요.",
    tone: "Soft Aging (웰에이징 가이드 연동)"
  },
  SEC_C: {
    triggerQuestion: "Q21",
    progress: 42,
    title: "당신의 피부와 햇빛의 관계 ☀️",
    subtitle: "햇볕에 어떻게 반응하는지, 어떤 자외선 차단이 필요한지 명확해졌어요. 다음은 라이프스타일이에요.",
    tone: "UV Group 확정 및 고지"
  },
  SEC_D: {
    triggerQuestion: "Q28",
    progress: 56,
    title: "당신의 일상이 피부에 어떻게 비치는지 보여요 🌿",
    subtitle: "호르몬, 수면, 식습관, 스트레스 - 당신의 피부는 매일의 선택을 기억하고 있어요. 이제 현재 루틴을 보여주세요.",
    tone: "Modifier 분석 및 가치 공감"
  },
  SEC_E: {
    triggerQuestion: "Q34",
    progress: 64,
    title: "지금의 루틴, 그리고 더 나은 길 🌟",
    subtitle: "당신이 어떻게 피부를 가꿔왔는지 봤어요. 곧 이 루틴을 어떻게 진화시킬 수 있는지 알려드릴게요.",
    tone: "현재 루틴 상태 인덱싱 완료"
  },
  SEC_F_G: {
    triggerQuestion: "Q40",
    progress: 78,
    title: "안전하게 - 피해야 할 성분까지 기억할게요 🛡️",
    subtitle: "당신이 머무는 공간, 날씨에 반응하는 방식, 그리고 피해야 할 성분과 좋아하는 제형을 알았어요. 추천 알고리즘에서 자동으로 걸러낼게요.",
    tone: "Context 보정 및 원천 안전 Filter 레이어 적용 고지"
  },
  SEC_H_I: {
    triggerQuestion: "Q47",
    progress: 94,
    title: "당신만의 뷰티 가치관이 있어요. 거의 다 왔어요! 🏁",
    subtitle: "어떤 가치를 중요하게 여기는지, 화장품을 얼마나 깊이 이해하는지, 그리고 구매 패턴과 기대 가치까지 파악했어요. 마지막으로 기본 정보 몇 가지만 알려주세요.",
    tone: "Value & Buying Behavior 세그먼트 인코딩 준비"
  },
  FINAL: {
    triggerQuestion: "Q50",
    progress: 100,
    title: "당신의 피부 코드를 정밀 분석하고 있습니다... 🧪",
    subtitle: "당신의 피부 답변 데이터를 기반으로 192가지 피부 유형 중 어디에 속하는지, 어떤 성분이 가장 안전하고 잘 맞는지 고유 코드를 조합하고 있습니다. 잠시만 기다려 주세요.",
    tone: "최종 결과 도출 백엔드 연산 로딩 인터랙션 (3~5초 소요)"
  }
};
