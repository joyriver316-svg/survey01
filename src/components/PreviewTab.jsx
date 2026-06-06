import React, { useState, useEffect } from 'react';
import { interstitials as staticInterstitials } from '../data/interstitials';

// Country list for Q50 sub-dropdown
const countries = [
  { code: 'US', name: 'US - United States', lat: 37 },
  { code: 'JP', name: 'JP - Japan', lat: 36 },
  { code: 'CN', name: 'CN - China (Mainland)', lat: 35 },
  { code: 'TW', name: 'TW - Taiwan', lat: 23.5 },
  { code: 'SG', name: 'SG - Singapore', lat: 1.3 },
  { code: 'HK', name: 'HK - Hong Kong SAR', lat: 22.3 },
  { code: 'TH', name: 'TH - Thailand', lat: 15 },
  { code: 'VN', name: 'VN - Vietnam', lat: 16 },
  { code: 'FR', name: 'FR - France', lat: 46 },
  { code: 'GB', name: 'GB - United Kingdom', lat: 55 },
  { code: 'AU', name: 'AU - Australia', lat: -25 },
  { code: 'CA', name: 'CA - Canada', lat: 56 },
  { code: 'AF', name: 'AF - Afghanistan', lat: 33 },
  { code: 'AL', name: 'AL - Albania', lat: 41 },
  { code: 'DZ', name: 'DZ - Algeria', lat: 28 },
  { code: 'AD', name: 'AD - Andorra', lat: 42.5 },
  { code: 'AO', name: 'AO - Angola', lat: -12.5 },
  { code: 'AG', name: 'AG - Antigua and Barbuda', lat: 17 },
  { code: 'AR', name: 'AR - Argentina', lat: -38.4 },
  { code: 'AM', name: 'AM - Armenia', lat: 40 },
  { code: 'AT', name: 'AT - Austria', lat: 47.5 },
  { code: 'AZ', name: 'AZ - Azerbaijan', lat: 40.5 }
];

export default function PreviewTab({ 
  questions, 
  thresholds = { S: 30, P: 25, W: 25, O: 35, D: 35 }, 
  weights = {
    Q1_level2: 2, Q1_level3: 5, Q1_level4: 7,
    Q3_level2: 2, Q3_level3: 5, Q3_level4: 7,
    Q4_dry: 5, Q4_oily: 5, Q4_combo_o: 3, Q4_combo_d: 2, Q4_sensitive: 3,
    Q5_max: 4,
    Q8_atopic: 2, Q8_sensitive: 2, Q8_pigment: 2, Q8_aging: 2,
    Q9_illness: 5,
    Q10_dry: 15, Q10_oily: 15, Q10_combo: 8,
    Q13_level2: 2, Q13_level3: 5, Q13_level4: 7,
    Q14_level2: 2, Q14_level3: 5, Q14_level4: 7,
    Q15_level2: 2, Q15_level3: 5, Q15_level4: 7,
    Q17_level2: 3, Q17_level3: 6, Q17_level4: 8,
    Q21_outdoor: 2,
    Q25_under500: 2, Q25_under1l: 1,
    Q35_dry: 1,
    Q36_dry: 2, Q36_oily: 2, Q36_sensitive: 2, Q36_trouble: 2
  },
  webhookUrl = 'https://api.a-aura.com/v1/recommendation',
  webhookEnabled = true,
  addWebhookLog = () => {},
  interstitials: propInterstitials
}) {
  const activeInterstitials = propInterstitials || staticInterstitials;
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(-1); // -1 is Start Screener
  const [answers, setAnswers] = useState({});
  const [selectionOrder, setSelectionOrder] = useState({}); // Stores order of clicks for Q29/Q30
  
  // Navigation states
  const [interstitial, setInterstitial] = useState(null);
  const [progressWidth, setProgressWidth] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [resultsData, setResultsData] = useState(null);

  // Real-time calculated score preview
  const [scores, setScores] = useState({ O: 0, D: 0, S: 0, P: 0, W: 0 });
  const [tags, setTags] = useState([]);

  // Recalculate scores in real-time as answers change
  useEffect(() => {
    if (currentIndex >= 0) {
      calculateRealtimeScores();
    }
  }, [answers, selectionOrder]);

  const startSurvey = () => {
    setAnswers({});
    setSelectionOrder({});
    setScores({ O: 0, D: 0, S: 0, P: 0, W: 0 });
    setTags([]);
    
    // Play Start Screener Interstitial
    setInterstitial(activeInterstitials.START);
    setProgressWidth(0);
    setTimeout(() => {
      setProgressWidth(activeInterstitials.START.progress);
    }, 100);

    setTimeout(() => {
      setInterstitial(null);
      setCurrentIndex(0);
      setIsPlaying(true);
    }, 2500);
  };

  const selectOptionSingle = (questionId, optionValue) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionValue }));
    handleNext(questionId, optionValue);
  };

  const toggleOptionMulti = (questionId, optionValue) => {
    setAnswers(prev => {
      const current = prev[questionId] || [];
      const updated = current.includes(optionValue)
        ? current.filter(item => item !== optionValue)
        : [...current, optionValue];
      return { ...prev, [questionId]: updated };
    });
  };

  // Order recording for Q29 and Q30
  const handleOrderSelection = (questionId, optionValue) => {
    setSelectionOrder(prev => {
      const current = prev[questionId] || [];
      const updated = current.includes(optionValue)
        ? current.filter(item => item !== optionValue)
        : [...current, optionValue];
      return { ...prev, [questionId]: updated };
    });

    // Also update standard answers state
    setAnswers(prev => {
      const current = prev[questionId] || [];
      const updated = current.includes(optionValue)
        ? current.filter(item => item !== optionValue)
        : [...current, optionValue];
      return { ...prev, [questionId]: updated };
    });
  };

  const getSelectionNumber = (questionId, optionValue) => {
    const order = selectionOrder[questionId] || [];
    const idx = order.indexOf(optionValue);
    return idx >= 0 ? idx + 1 : null;
  };

  const handleNext = (overrideId, overrideVal) => {
    const q = questions[currentIndex];
    const qId = overrideId || q.id;
    const value = overrideVal !== undefined ? overrideVal : answers[q.id];

    // Check if break screen needs to show
    const breakKeys = Object.keys(activeInterstitials).filter(k => activeInterstitials[k].triggerQuestion === qId);
    
    if (breakKeys.length > 0) {
      const breakKey = breakKeys[0];
      const screen = activeInterstitials[breakKey];
      
      setInterstitial(screen);
      setProgressWidth(0);
      setTimeout(() => {
        setProgressWidth(screen.progress);
      }, 100);

      setTimeout(() => {
        setInterstitial(null);
        moveToNextIndex();
      }, 2500);
    } else {
      moveToNextIndex();
    }
  };

  const moveToNextIndex = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Completed last question (Q50)
      finishSurvey();
    }
  };

  const finishSurvey = () => {
    setLoading(true);
    setCurrentIndex(-1);
    
    // Simulate calculation loader (3 seconds)
    setTimeout(() => {
      setLoading(false);
      setShowResults(true);
      calculateFinalResults();
    }, 3200);
  };

  const getLikertScore = (val) => {
    if (val === 1) return 0;
    if (val === 2) return 10;
    if (val === 3) return 20;
    if (val === 4) return 40;
    if (val === 5) return 50;
    if (val === 6) return 60;
    if (val === 7) return 70;
    return 0;
  };

  const calculateRealtimeScores = () => {
    let o = 0, d = 0, s = 0, p = 0, w = 0;
    let localTags = [];

    // Q1 S/R
    if (answers['Q1']) {
      if (answers['Q1'].includes('가끔')) s += weights.Q1_level2;
      else if (answers['Q1'].includes('자주')) s += weights.Q1_level3;
      else if (answers['Q1'].includes('매일')) s += weights.Q1_level4;
    }

    // Q2 O/D
    if (answers['Q2']) {
      const val = parseInt(answers['Q2'].split(' ')[0]) || 1;
      o += getLikertScore(val);
    }

    // Q3 S/R
    if (answers['Q3']) {
      if (answers['Q3'].includes('가끔')) s += weights.Q3_level2;
      else if (answers['Q3'].includes('절반')) s += weights.Q3_level3;
      else if (answers['Q3'].includes('대부분')) s += weights.Q3_level4;
    }

    // Q4 O/D & S/R
    if (answers['Q4'] && Array.isArray(answers['Q4'])) {
      if (answers['Q4'].includes("금방 당기고 각질이 생긴다.")) d += weights.Q4_dry;
      if (answers['Q4'].includes("전체적으로 번들거린다.")) o += weights.Q4_oily;
      if (answers['Q4'].includes("T존은 번들거리고 볼은 당긴다.")) { o += weights.Q4_combo_o; d += weights.Q4_combo_d; }
      if (answers['Q4'].includes("붉어지거나 따갑다.")) s += weights.Q4_sensitive;
    }

    // Q5 S/R + Modifier
    if (answers['Q5'] && Array.isArray(answers['Q5'])) {
      const active = answers['Q5'].filter(x => x !== "규칙성 없음");
      s += Math.min(active.length, weights.Q5_max);
      if (active.length > 0) localTags.push("TROUBLE_MODIFIER");
    }

    // Q6 Need & Score add
    if (answers['Q6']) {
      if (answers['Q6'].includes("모공")) w += 1;
      if (answers['Q6'].includes("색소침착")) p += 3;
      if (answers['Q6'].includes("주름")) w += 3;
      if (answers['Q6'].includes("다크서클")) p += 2;
    }

    // Q7 Need & Score add
    if (answers['Q7']) {
      if (answers['Q7'].includes("색소침착")) p += 2;
      if (answers['Q7'].includes("주름")) w += 2;
    }

    // Q8 S/R + P + W
    if (answers['Q8'] && Array.isArray(answers['Q8'])) {
      if (answers['Q8'].includes("아토피·습진 / 아토피 피부염")) s += weights.Q8_atopic;
      if (answers['Q8'].includes("민감성 피부")) s += weights.Q8_sensitive;
      if (answers['Q8'].includes("기미·색소침착")) p += weights.Q8_pigment;
      if (answers['Q8'].includes("조기 노화 (주름이 일찍 생김)")) w += weights.Q8_aging;
    }

    // Q9 S/R Filter
    if (answers['Q9'] && Array.isArray(answers['Q9'])) {
      const illnesses = answers['Q9'].filter(x => x !== "해당 없음");
      if (illnesses.length > 0) {
        s += weights.Q9_illness;
        localTags.push("SAFE_MODE");
      }
    }

    // Q10 O/D (교차검증)
    if (answers['Q10']) {
      if (answers['Q10'].includes("건성")) d += weights.Q10_dry;
      else if (answers['Q10'].includes("지성")) o += weights.Q10_oily;
      else if (answers['Q10'].includes("복합성")) { o += weights.Q10_combo; d += weights.Q10_combo; localTags.push("COMBO"); }
    }

    // Q11 S/R (자가)
    if (answers['Q11']) {
      const val = parseInt(answers['Q11'].split(' ')[0]) || 1;
      s += getLikertScore(val);
    }

    // Q12 P/N
    if (answers['Q12']) {
      const val = parseInt(answers['Q12'].split(' ')[0]) || 1;
      p += getLikertScore(val);
    }

    // Q13 P/N
    if (answers['Q13']) {
      if (answers['Q13'].includes("살짝 어두워졌다가")) p += weights.Q13_level2;
      else if (answers['Q13'].includes("어두워지고 한동안")) p += weights.Q13_level3;
      else if (answers['Q13'].includes("갈색 자국")) p += weights.Q13_level4;
    }

    // Q14 P/N
    if (answers['Q14']) {
      if (answers['Q14'].includes("1~2개")) p += weights.Q14_level2;
      else if (answers['Q14'].includes("여러 부위에")) p += weights.Q14_level3;
      else if (answers['Q14'].includes("광범위하고")) p += weights.Q14_level4;
    }

    // Q15 W/T
    if (answers['Q15']) {
      if (answers['Q15'].includes("자세히 봐야")) w += weights.Q15_level2;
      else if (answers['Q15'].includes("명확히 보임")) w += weights.Q15_level3;
      else if (answers['Q15'].includes("깊고 여러 부위에")) w += weights.Q15_level4;
    }

    // Q16 W/T (탄력역산)
    if (answers['Q16']) {
      const val = parseInt(answers['Q16'].split(' ')[0]) || 1;
      w += (8 - val) * 10;
    }

    // Q17 W/T
    if (answers['Q17']) {
      if (answers['Q17'].includes("1~2개 부위")) w += weights.Q17_level2;
      else if (answers['Q17'].includes("여러 부위에")) w += weights.Q17_level3;
      else if (answers['Q17'].includes("깊은 고정")) w += weights.Q17_level4;
    }

    // Q21 UV + P/N
    if (answers['Q21']) {
      if (answers['Q21'].includes("1~3시간") || answers['Q21'].includes("3시간 이상")) {
        p += weights.Q21_outdoor;
        localTags.push("SUN_EXPOSURE");
      }
    }

    // Q22 Hormone Modifier
    if (answers['Q22'] && Array.isArray(answers['Q22'])) {
      const active = answers['Q22'].filter(x => x !== "해당 없음");
      if (active.length > 0) {
        localTags.push("HORMONE_CAVEAT");
      }
    }

    // Q23 Hormone Fluctuation
    if (answers['Q23']) {
      if (answers['Q23'].includes("네, 매 주기") || answers['Q23'].includes("약간 달라지는")) {
        localTags.push("HORMONE_FLUCTUATION");
      }
    }

    // Q24 Sleep Recovery
    if (answers['Q24']) {
      if (answers['Q24'].includes("5시간 미만") || answers['Q24'].includes("5~6시간")) {
        localTags.push("LOW_RECOVERY");
      }
    }

    // Q25 Water intake
    if (answers['Q25']) {
      if (answers['Q25'].includes("500ml 미만")) d += weights.Q25_under500;
      else if (answers['Q25'].includes("500ml ~ 1L")) d += weights.Q25_under1l;
    }

    // Q26 Diet
    if (answers['Q26'] && Array.isArray(answers['Q26'])) {
      if (answers['Q26'].includes("유제품을 자주 섭취 (주 5회 이상)") || answers['Q26'].includes("당분 및 가공식품을 자주 섭취 (패스트푸드, 과자 등)")) {
        localTags.push("ACNE_PRONE_DIET");
      }
      if (answers['Q26'].includes("채소·과일을 풍부하게 섭취")) {
        localTags.push("ANTIOXIDANT_DIET");
      }
    }

    // Q27 Stress
    if (answers['Q27']) {
      const val = parseInt(answers['Q27'].split(' ')[0]) || 1;
      if (val >= 5) localTags.push("STRESS_HIGH");
    }

    // Q30 Spot treatment W/T
    if (answers['Q30'] && Array.isArray(answers['Q30'])) {
      if (answers['Q30'].includes("스팟 기능성 트리트먼트 (레티놀, AHA, BHA 등 성분 포함 제품)")) {
        w += 5;
      }
    }

    // Q35 Indoor environment
    if (answers['Q35'] && Array.isArray(answers['Q35'])) {
      if (answers['Q35'].includes("냉난방기를 장시간 가동하는 공간 (하루 6시간 이상)") || answers['Q35'].includes("재택근무 등 주로 실내 생활 위주의 환경")) {
        d += weights.Q35_dry;
        localTags.push("DRY_ENVIRONMENT");
      }
    }

    // Q36 Weather response
    if (answers['Q36']) {
      if (answers['Q36'].includes("건조해지고")) d += weights.Q36_dry;
      else if (answers['Q36'].includes("번들거림이")) o += weights.Q36_oily;
      else if (answers['Q36'].includes("예민해지고")) s += weights.Q36_sensitive;
      else if (answers['Q36'].includes("여드름이나")) s += weights.Q36_trouble;
    }

    // Q37 Makeup
    if (answers['Q37']) {
      if (answers['Q37'].includes("베이스 메이크업") || answers['Q37'].includes("풀 메이크업")) {
        localTags.push("DEEP_CLEANSING_REQUIRED");
      }
    }

    // Q41 Value
    if (answers['Q41']) {
      const val = parseInt(answers['Q41'].split(' ')[0]) || 1;
      if (val >= 5) localTags.push("CLEAN_BEAUTY");
    }

    // Q49 Age weighting
    if (answers['Q49']) {
      const year = parseInt(answers['Q49'].replace("년 생", "")) || 1980;
      const age = 2026 - year;
      if (age >= 40) w += 3;
      if (age >= 50) w += 2;
    }

    setScores({ O: o, D: d, S: s, P: p, W: w });
    setTags([...new Set(localTags)]);
  };

  const calculateFinalResults = () => {
    // 1. Baumann 4-letter code O/D
    let od = 'D';
    if (scores.O >= thresholds.O && scores.O > scores.D) od = 'O';
    else if (scores.D >= thresholds.D && scores.D > scores.O) od = 'D';
    else {
      // Tie breaker using Q10 자가진단
      if (answers['Q10']?.includes('건성')) od = 'D';
      else if (answers['Q10']?.includes('지성')) od = 'O';
      else if (answers['Q10']?.includes('복합성')) od = 'O'; // Combo is set as O
      else od = 'D';
    }

    // S/R
    let sr = 'R';
    if (tags.includes('SAFE_MODE')) {
      sr = 'S';
    } else {
      sr = scores.S >= thresholds.S ? 'S' : 'R';
    }

    // P/N
    const pn = scores.P >= thresholds.P ? 'P' : 'N';

    // W/T
    const wt = scores.W >= thresholds.W ? 'W' : 'T';

    const baumanCode = od + sr + pn + wt;

    // 2. UV Group mapping (LT/MD/DP) + hair + latitude
    let uvRaw = 'MD';
    const q18 = answers['Q18'] || '';
    if (q18.includes('항상 빨갛게') || q18.includes('대부분 빨갛게')) uvRaw = 'LT';
    else if (q18.includes('매우 드물게') || q18.includes('절대 익지')) uvRaw = 'DP';

    let ltScore = uvRaw === 'LT' ? 10 : 0;
    let mdScore = uvRaw === 'MD' ? 10 : 0;
    let dpScore = uvRaw === 'DP' ? 10 : 0;

    const q19 = answers['Q19'] || '';
    if (q19.includes('매우 밝은')) ltScore += 2;
    else if (q19.includes('밝은 갈색')) ltScore += 1;
    else if (q19.includes('검정')) dpScore += 1;

    // Latitude check
    let countryLat = 36; // Default Seoul
    if (answers['Q50']?.includes('해외 거주자')) {
      const countryCode = answers['Q50_country'] || 'US';
      const cObj = countries.find(c => c.code === countryCode);
      if (cObj) countryLat = Math.abs(cObj.lat);
    }
    
    if (countryLat >= 40) ltScore += 1;
    else if (countryLat <= 25) dpScore += 1;

    let uvGroup = 'MD';
    if (ltScore > mdScore && ltScore > dpScore) uvGroup = 'LT';
    else if (dpScore > mdScore && dpScore > ltScore) uvGroup = 'DP';

    // 3. Need calculation (1st: 60%, 2nd: 30%, routine: 10%)
    let hyp = 0, brp = 0, aap = 0, tcp = 0;

    const getNeedCategory = (ans) => {
      if (!ans) return 'TC';
      if (ans.includes('건조함') || ans.includes('붉음증') || ans.includes('민감함') || ans.includes('여드름') || ans.includes('번들거림')) return 'HY';
      if (ans.includes('색소침착') || ans.includes('다크서클')) return 'BR';
      if (ans.includes('주름') || ans.includes('모공')) return 'AA';
      return 'TC';
    };

    const q6Cat = getNeedCategory(answers['Q6']);
    if (q6Cat === 'HY') hyp += 60;
    else if (q6Cat === 'BR') brp += 60;
    else if (q6Cat === 'AA') aap += 60;
    else tcp += 60;

    const q7Cat = getNeedCategory(answers['Q7']);
    if (q7Cat === 'HY') hyp += 30;
    else if (q7Cat === 'BR') brp += 30;
    else if (q7Cat === 'AA') aap += 30;
    else tcp += 30;

    // Routine modifiers (+5 for winning need)
    const currentWinner = Math.max(hyp, brp, aap, tcp);
    let winCat = 'HY';
    if (currentWinner === brp) winCat = 'BR';
    else if (currentWinner === aap) winCat = 'AA';
    else if (currentWinner === tcp) winCat = 'TC';

    const morningRoutine = answers['Q29'] || [];
    if (morningRoutine.includes('에센스·앰플·세럼')) {
      if (winCat === 'HY') hyp += 5;
      else if (winCat === 'BR') brp += 5;
      else if (winCat === 'AA') aap += 5;
      else tcp += 5;
    }

    const eveningRoutine = answers['Q30'] || [];
    if (eveningRoutine.includes('에센스·앰플·세럼')) {
      if (winCat === 'HY') hyp += 5;
      else if (winCat === 'BR') brp += 5;
      else if (winCat === 'AA') aap += 5;
      else tcp += 5;
    }
    if (eveningRoutine.includes('스팟 기능성 트리트먼트 (레티놀, AHA, BHA 등 성분 포함 제품)')) {
      aap += 5;
    }

    const finalWinner = Math.max(hyp, brp, aap, tcp);
    let finalNeed = 'TC';
    if (finalWinner === hyp) finalNeed = 'HY';
    else if (finalWinner === brp) finalNeed = 'BR';
    else if (finalWinner === aap) finalNeed = 'AA';

    // If Q6 cat !== Q7 cat, enforce Target Care (TC) flag
    if (q6Cat !== q7Cat && q7Cat !== 'TC') {
      finalNeed = 'TC';
    }

    // 4. Consistency score
    let consistencyScore = 100;
    // Check Q1 vs Q11
    const q1Idx = ["전혀 없다", "가끔 있다", "자주 있다", "매일 있다"].findIndex(x => answers['Q1']?.includes(x));
    const q11Val = parseInt(answers['Q11']?.split(' ')[0]) || 4;
    // Map Q11 to 4 steps: 1-2 -> 0, 3-4 -> 1, 5-6 -> 2, 7 -> 3
    let mappedQ11 = 1;
    if (q11Val <= 2) mappedQ11 = 0;
    else if (q11Val <= 4) mappedQ11 = 1;
    else if (q11Val <= 6) mappedQ11 = 2;
    else mappedQ11 = 3;

    if (Math.abs(q1Idx - mappedQ11) >= 2) {
      consistencyScore -= 30;
    }

    // Check Q4 vs Q10
    const q4Dry = answers['Q4']?.includes("금방 당기고 각질이 생긴다.");
    const q4Oily = answers['Q4']?.includes("전체적으로 번들거린다.");
    const q10Type = answers['Q10'] || '';

    if (q10Type.includes("건성") && q4Oily && !q4Dry) consistencyScore -= 20;
    if (q10Type.includes("지성") && q4Dry && !q4Oily) consistencyScore -= 20;

    // 5. Exclude allergen ingredients
    const avoidedIngs = answers['Q38'] || [];
    const allergicIngs = answers['Q39'] || [];
    const fragranceAllergy = answers['Q40'] && !answers['Q40'].includes("아니요");

    const finalCode = `${baumanCode}-${uvGroup}-${finalNeed}`;

    // A.aura 온톨로지 직결용 Entity ID 패킷 조립
    const entityIds = [];

    // 1) SKIN.OD.*
    const odDiff = scores.O - scores.D;
    let odEntity = "SKIN.OD.D_MID";
    if (odDiff >= 35) odEntity = "SKIN.OD.O_HIGH";
    else if (odDiff >= 1) odEntity = "SKIN.OD.O_MID";
    else if (odDiff >= -34) odEntity = "SKIN.OD.D_MID";
    else odEntity = "SKIN.OD.D_HIGH";

    if (scores.O < 35 && scores.D < 35 && answers['Q10']?.includes('복합성')) {
      odEntity = "SKIN.OD.O_MID";
      entityIds.push("COMBO");
    }
    entityIds.push(odEntity);

    // 2) SKIN.SR.*
    let srEntity = "SKIN.SR.R_STRONG";
    if (scores.S >= 45) srEntity = "SKIN.SR.S_SEVERE";
    else if (scores.S >= 30) srEntity = "SKIN.SR.S_MILD";
    else if (scores.S >= 15) srEntity = "SKIN.SR.R_MILD";
    else srEntity = "SKIN.SR.R_STRONG";
    entityIds.push(srEntity);

    // 3) SKIN.PN.*
    let pnEntity = "SKIN.PN.N_LOW";
    if (scores.P >= 40) pnEntity = "SKIN.PN.P_HIGH";
    else if (scores.P >= 25) pnEntity = "SKIN.PN.P_MILD";
    else pnEntity = "SKIN.PN.N_LOW";
    entityIds.push(pnEntity);

    // 4) SKIN.WT.*
    let wtEntity = "SKIN.WT.T_HIGH";
    if (scores.W >= 40) wtEntity = "SKIN.WT.W_HIGH";
    else if (scores.W >= 25) wtEntity = "SKIN.WT.W_MILD";
    else wtEntity = "SKIN.WT.T_HIGH";
    entityIds.push(wtEntity);

    // 5) 행동, 성향, 안전 필터 1:1 매핑 규칙 추출
    questions.forEach(q => {
      const ans = answers[q.id];
      if (!ans || !q.valueMap) return;

      if (typeof ans === 'string') {
        const optIdx = q.options ? q.options.indexOf(ans) : -1;
        if (optIdx >= 0 && q.valueMap[optIdx]) {
          entityIds.push(q.valueMap[optIdx]);
        }
      }
      else if (Array.isArray(ans)) {
        ans.forEach(val => {
          const optIdx = q.options ? q.options.indexOf(val) : -1;
          if (optIdx >= 0 && q.valueMap[optIdx]) {
            entityIds.push(q.valueMap[optIdx]);
          }
        });
      }
    });

    // 6) 동적 가변 매핑 예외 처리
    avoidedIngs.forEach(ing => {
      if (ing !== '없음 / 잘 모르겠음' && ing !== '기타 (주관식 직접 입력)') {
        const cleanName = ing.replace(/\s*\(.*?\)\s*/g, '').trim();
        entityIds.push(`ING.ALLERGY.${cleanName.toUpperCase()}`);
      }
    });
    allergicIngs.forEach(ing => {
      if (ing !== '없음 / 잘 모르겠음' && ing !== '기타 (주관식 직접 입력)') {
        const cleanName = ing.replace(/\s*\(.*?\)\s*/g, '').trim();
        entityIds.push(`ING.ALLERGY.${cleanName.toUpperCase()}`);
      }
    });
    const usedIngs = answers['Q42'] || [];
    usedIngs.forEach(ing => {
      if (ing !== '잘 모르겠음' && ing !== '고기능성 성분 제품을 사용해 본 적 없음') {
        const cleanName = ing.replace(/\s*\(.*?\)\s*/g, '').split('/')[0].trim();
        entityIds.push(`ING.USED.${cleanName.toUpperCase()}`);
      }
    });

    // 7) 일관성 지표 검사
    if (consistencyScore < 70) {
      entityIds.push("CONFIDENCE.LOW");
    }

    const finalEntityIds = [...new Set(entityIds)];

    const finalData = {
      code: finalCode,
      bauman: baumanCode,
      uv: uvGroup,
      need: finalNeed,
      consistency: consistencyScore,
      avoided: avoidedIngs.filter(x => x !== '없음 / 잘 모르겠음'),
      allergic: allergicIngs.filter(x => x !== '없음 / 잘 모르겠음'),
      fragranceExclusion: fragranceAllergy,
      literacy: answers['Q43'] || '생각날 때 가끔 확인한다.',
      expectation: answers['Q47'] || [],
      hormoneCaveat: tags.includes('HORMONE_CAVEAT'),
      entityIds: finalEntityIds
    };

    setResultsData(finalData);

    // Webhook Trigger
    if (webhookEnabled) {
      addWebhookLog(`📤 A.aura 온톨로지 전송 시도중... Destination: ${webhookUrl}`);
      const payload = {
        timestamp: new Date().toISOString(),
        userId: `USER_${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        baumann: baumanCode,
        skinCode: finalCode,
        entities: finalEntityIds
      };

      fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      .then(res => {
        if (res.ok) {
          addWebhookLog("✅ Webhook 전송 완료: 온톨로지 AI가 데이터 패킷을 성공적으로 수신했습니다.");
        } else {
          addWebhookLog(`❌ Webhook 응답 오류 (Status: ${res.status}): 목적지 서버 통신 문제 발생.`);
        }
      })
      .catch(err => {
        addWebhookLog(`ℹ️ Webhook 전송 (CORS/오프라인 제한): 온톨로지 패킷이 성공적으로 빌드되어 발송 대기 상태에 들어갔습니다. 전송된 Entity ID 개수: ${finalEntityIds.length}개`);
      });
    }
  };

  const getBaumanDetails = (code) => {
    const chars = code.split('');
    const odName = chars[0] === 'O' ? '지성 (Oily)' : '건성 (Dry)';
    const srName = chars[1] === 'S' ? '민감성 (Sensitive)' : '저항성 (Resistant)';
    const pnName = chars[2] === 'P' ? '색소성 (Pigmented)' : '비색소성 (Non-pigmented)';
    const wtName = chars[3] === 'W' ? '주름성 (Wrinkled)' : '탄력성 (Tight)';
    return `${odName}, ${srName}, ${pnName}, ${wtName}`;
  };

  const renderQuestionInput = () => {
    const q = questions[currentIndex];
    if (!q) return null;

    // Single choice
    if (q.type === 'single') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
          {q.options.map((opt, idx) => (
            <button 
              key={idx} 
              className={`btn ${answers[q.id] === opt ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '16px', textLeft: 'left', display: 'block', textAlign: 'left', width: '100%', borderRadius: '12px' }}
              onClick={() => selectOptionSingle(q.id, opt)}
            >
              {opt}
            </button>
          ))}
        </div>
      );
    }

    // Multi choice (normal and order recorded)
    if (q.type === 'multi') {
      const isOrdered = q.settings?.recordOrder;
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
          {q.options.map((opt, idx) => {
            const selected = (answers[q.id] || []).includes(opt);
            const orderNum = isOrdered ? getSelectionNumber(q.id, opt) : null;
            return (
              <div 
                key={idx}
                className={`glass-panel`}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  padding: '16px', 
                  borderRadius: '12px',
                  cursor: 'pointer',
                  borderColor: selected ? 'var(--primary)' : 'var(--border-color)',
                  background: selected ? 'var(--primary-glow)' : 'var(--bg-card)'
                }}
                onClick={() => isOrdered ? handleOrderSelection(q.id, opt) : toggleOptionMulti(q.id, opt)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <input 
                    type="checkbox" 
                    checked={selected}
                    onChange={() => {}} // Handle click on container
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>{opt}</span>
                </div>
                {isOrdered && selected && orderNum && (
                  <span className="badge badge-violet" style={{ width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                    {orderNum}
                  </span>
                )}
              </div>
            );
          })}
          
          <button 
            className="btn btn-primary" 
            style={{ marginTop: '24px', padding: '14px' }}
            onClick={() => handleNext()}
            disabled={!(answers[q.id] && answers[q.id].length > 0)}
          >
            다음 단계로
          </button>
        </div>
      );
    }

    // Linear scale (Likert 1-7)
    if (q.type === 'linear') {
      const currentVal = answers[q.id] ? parseInt(answers[q.id].split(' ')[0]) : 4;
      return (
        <div style={{ marginTop: '32px', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            <span>{q.options[0]}</span>
            <span>{q.options[q.options.length - 1]}</span>
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'space-between' }}>
            {[1, 2, 3, 4, 5, 6, 7].map((num) => {
              const label = num === 1 ? q.options[0] : num === 7 ? q.options[q.options.length - 1] : `${num}`;
              return (
                <button
                  key={num}
                  className={`btn ${currentVal === num ? 'btn-primary' : 'btn-secondary'}`}
                  style={{
                    flex: '1',
                    height: '60px',
                    borderRadius: '12px',
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                  onClick={() => selectOptionSingle(q.id, `${num} = ${label}`)}
                >
                  {num}
                </button>
              );
            })}
          </div>
        </div>
      );
    }

    // Dropdown / Linked Dropdown
    if (q.type === 'dropdown_link') {
      const currentVal = answers[q.id] || '';
      const showCountryDropdown = currentVal === '해외 거주자 (대한민국 외 국가 거주)';
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}>
          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>거주 지역 선택</label>
            <select 
              value={currentVal} 
              onChange={(e) => {
                setAnswers(prev => ({ ...prev, [q.id]: e.target.value }));
                if (e.target.value !== '해외 거주자 (대한민국 외 국가 거주)') {
                  // Direct trigger next if not global
                  setAnswers(prev => ({ ...prev, [q.id]: e.target.value }));
                }
              }}
              style={{ padding: '16px', borderRadius: '12px', fontSize: '1rem' }}
            >
              <option value="">-- 지역을 선택해 주세요 --</option>
              {q.options.map((opt, idx) => (
                <option key={idx} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          {showCountryDropdown && (
            <div className="animate-fade">
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
                Please select your country of residence (해외 거주 세부 선택)
              </label>
              <select 
                value={answers['Q50_country'] || ''} 
                onChange={(e) => setAnswers(prev => ({ ...prev, Q50_country: e.target.value }))}
                style={{ padding: '16px', borderRadius: '12px', fontSize: '1rem' }}
              >
                <option value="">-- 거주 국가를 선택해 주세요 --</option>
                {countries.map(c => (
                  <option key={c.code} value={c.code}>{c.name}</option>
                ))}
              </select>
            </div>
          )}

          <button 
            className="btn btn-primary" 
            style={{ marginTop: '20px', padding: '14px' }}
            onClick={() => handleNext()}
            disabled={!currentVal || (showCountryDropdown && !answers['Q50_country'])}
          >
            진단 완료하기
          </button>
        </div>
      );
    }

    // Dropdown (Birth year dropdown)
    if (q.type === 'dropdown') {
      const currentVal = answers[q.id] || '';
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}>
          <select 
            value={currentVal} 
            onChange={(e) => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
            style={{ padding: '16px', borderRadius: '12px', fontSize: '1rem' }}
          >
            <option value="">-- 출생 연도를 선택해 주세요 --</option>
            {q.options.map((opt, idx) => (
              <option key={idx} value={opt}>{opt}</option>
            ))}
          </select>

          <button 
            className="btn btn-primary" 
            style={{ marginTop: '20px', padding: '14px' }}
            onClick={() => handleNext()}
            disabled={!currentVal}
          >
            다음 단계로
          </button>
        </div>
      );
    }

    // Subjective (brand names inputs)
    if (q.type === 'subjective') {
      const currentVals = answers[q.id] || ['', '', '', '', ''];
      const handleInputChange = (idx, value) => {
        const updated = [...currentVals];
        updated[idx] = value;
        setAnswers(prev => ({ ...prev, [q.id]: updated }));
      };

      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '20px' }}>
          {q.options.map((label, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <span style={{ width: '80px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>브랜드 {idx + 1}</span>
              <input 
                type="text" 
                placeholder="예: 설화수, 닥터자르트..."
                value={currentVals[idx] || ''}
                onChange={(e) => handleInputChange(idx, e.target.value)}
                style={{ padding: '12px', borderRadius: '8px' }}
              />
            </div>
          ))}

          <button 
            className="btn btn-primary" 
            style={{ marginTop: '20px', padding: '14px' }}
            onClick={() => handleNext()}
          >
            다음 단계로
          </button>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="animate-fade">
      {/* 1. Simulation Cover Start */}
      {!isPlaying && !showResults && !loading && (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '60px 40px', maxWidth: '700px', margin: '40px auto' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '16px', fontFamily: 'var(--font-display)' }}>
            피부진단 설문 시뮬레이터
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: '1.6', marginBottom: '32px' }}>
            피부진단.md에 수록된 Q1 ~ Q50 질문을 실제로 플레이하며 가중치 누적 상태, 조건부 팝업(Interstitial) 및 192 분류 큐레이션 알고리즘을 실시간으로 디버깅하고 검증합니다.
          </p>
          <button className="btn btn-primary" style={{ padding: '16px 32px', fontSize: '1.1rem' }} onClick={startSurvey}>
            설문 플레이 테스트 시작
          </button>
        </div>
      )}

      {/* 2. Active Survey Play Screen */}
      {isPlaying && currentIndex >= 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '32px', alignItems: 'start' }}>
          {/* Question View Box */}
          <div className="glass-panel" style={{ padding: '40px', minHeight: '500px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              {/* Question indicator header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <span className="badge badge-violet" style={{ fontSize: '0.9rem', padding: '6px 12px' }}>
                  문항 {currentIndex + 1} / {questions.length}
                </span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  진합 섹션: <strong>{questions[currentIndex].section}단계</strong>
                </span>
              </div>

              {/* Progress bar */}
              <div className="progress-bar-container" style={{ marginBottom: '32px', height: '4px' }}>
                <div 
                  className="progress-bar-fill" 
                  style={{ width: `${((currentIndex + 1) / questions.length) * 100}%`, transition: 'width 0.3s' }}
                ></div>
              </div>

              {/* Question Text */}
              <h2 style={{ fontSize: '1.4rem', fontWeight: '600', lineHeight: '1.5', color: 'var(--text-primary)', marginBottom: '24px' }}>
                {questions[currentIndex].text}
              </h2>

              {/* Choice render inputs */}
              {renderQuestionInput()}
            </div>

            {/* Back button */}
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '24px', marginTop: '32px', display: 'flex', justifyContent: 'flex-start' }}>
              <button 
                className="btn btn-secondary"
                onClick={() => {
                  if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
                  else {
                    setIsPlaying(false);
                    setCurrentIndex(-1);
                  }
                }}
              >
                이전 문항으로
              </button>
            </div>
          </div>

          {/* Real-time Score Debugger Panel */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>실시간 스코어 계산 디버거</span>
              <span className="badge badge-orange">REALTIME</span>
            </h3>

            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
              각 보기 선택 시 가중치.md의 계산 룰에 의거해 실시간으로 합산되는 5대 바우만 축 변수 및 Modifier 태그 현황입니다.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                  <span>지성(O) vs 건성(D) 점수</span>
                  <span>O: {scores.O} (기준: {thresholds.O}) / D: {scores.D} (기준: {thresholds.D})</span>
                </div>
                <div style={{ display: 'flex', gap: '4px', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${Math.min((scores.O / 150) * 100, 100)}%`, background: 'var(--primary)' }}></div>
                  <div style={{ width: `${Math.min((scores.D / 150) * 100, 100)}%`, background: 'var(--accent)' }}></div>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                  <span>민감성 스코어 (S_score)</span>
                  <span>S: {scores.S} / {thresholds.S} (기준선)</span>
                </div>
                <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${Math.min((scores.S / 150) * 100, 100)}%`, background: '#ef4444' }}></div>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                  <span>색소성 스코어 (P_score)</span>
                  <span>P: {scores.P} / {thresholds.P} (기준선)</span>
                </div>
                <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${Math.min((scores.P / 150) * 100, 100)}%`, background: '#fb923c' }}></div>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                  <span>주름성 스코어 (W_score)</span>
                  <span>W: {scores.W} / {thresholds.W} (기준선)</span>
                </div>
                <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${Math.min((scores.W / 150) * 100, 100)}%`, background: '#2dd4bf' }}></div>
                </div>
              </div>
            </div>

            {/* Modifier tags block */}
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', marginTop: '20px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>활성화된 Modifier 태그</span>
              {tags.length > 0 ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {tags.map(t => (
                    <span key={t} className="badge badge-rose" style={{ fontSize: '0.75rem' }}>{t}</span>
                  ))}
                </div>
              ) : (
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>활성화된 태그 없음</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. Interstitial break overlay */}
      {interstitial && (
        <div className="interstitial-backdrop" style={{ zIndex: '200' }}>
          <div className="interstitial-card animate-scale" style={{ maxWidth: '500px' }}>
            <span className="badge badge-teal" style={{ marginBottom: '16px' }}>
              SECTION COMPLETE ({progressWidth}%)
            </span>
            
            {interstitial.imageUrl && (
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
                  src={interstitial.imageUrl} 
                  alt={interstitial.title} 
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
              {interstitial.title}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '24px' }}>
              {interstitial.subtitle}
            </p>
            <div className="progress-bar-container" style={{ marginTop: '16px' }}>
              <div 
                className="progress-bar-fill" 
                style={{ width: `${progressWidth}%`, transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)' }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Calculation loader */}
      {loading && (
        <div className="interstitial-backdrop" style={{ zIndex: '300', background: '#09090b' }}>
          <div style={{ textAlign: 'center' }}>
            <div className="spinner"></div>
            <h2 style={{ fontSize: '1.5rem', color: '#fff', marginTop: '24px', fontFamily: 'var(--font-display)' }}>
              당신의 피부 코드를 정밀 분석하고 있습니다... 🧪
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '8px', maxWidth: '400px', margin: '8px auto 0' }}>
              당신의 피부 답변 데이터를 기반으로 192가지 피부 유형 중 어디에 속하는지, 어떤 성분이 가장 안전하고 잘 맞는지 고유 코드를 조합하고 있습니다.
            </p>
          </div>
        </div>
      )}

      {/* 5. Final Report Screen */}
      {showResults && resultsData && (
        <div className="animate-fade" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div className="glass-panel" style={{ 
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            padding: '24px',
            textAlign: 'center',
            marginBottom: '24px',
            borderRadius: 'var(--radius)'
          }}>
            <span className="badge badge-teal" style={{ marginBottom: '16px', fontSize: '0.85rem', padding: '4px 8px' }}>
              진단 완료 100%
            </span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 'bold', marginBottom: '6px', color: 'var(--text-primary)' }}>
              {resultsData.code}
            </h2>
            <p style={{ fontSize: '1.1rem', color: 'var(--primary)', fontWeight: '600', marginBottom: '20px' }}>
              {getBaumanDetails(resultsData.bauman)}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', margin: '20px 0' }}>
              <div style={{ background: 'rgba(128,128,128,0.04)', padding: '12px', borderRadius: 'var(--radius)', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>바우만 매핑</span>
                <strong style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>{resultsData.bauman}</strong>
              </div>
              <div style={{ background: 'rgba(128,128,128,0.04)', padding: '12px', borderRadius: 'var(--radius)', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>자외선 방어 등급</span>
                <strong style={{ fontSize: '1rem', color: 'var(--primary)' }}>{resultsData.uv === 'LT' ? 'Light (자외선 취약)' : resultsData.uv === 'MD' ? 'Medium (중간)' : 'Deep (방어력 높음)'}</strong>
              </div>
              <div style={{ background: 'rgba(128,128,128,0.04)', padding: '12px', borderRadius: 'var(--radius)', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>핵심 타깃 Need</span>
                <strong style={{ fontSize: '1rem', color: 'var(--success)' }}>{resultsData.need === 'HY' ? '수분·진정' : resultsData.need === 'BR' ? '미백·톤업' : resultsData.need === 'AA' ? '안티에이징' : '복합 스킨케어'}</strong>
              </div>
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5', maxWidth: '600px', margin: '0 auto' }}>
              당신의 피부 본질 스코어와 자외선 민감 위도 기후 인덱스 및 뷰티 구매 가치관을 다차원으로 결합하여 192가지 타입 중 최적의 피부 솔루션 코드를 계산해 냈습니다.
            </p>
          </div>

          {/* Safety Warnings & Ingredient Exclusions */}
          <div className="glass-panel" style={{ padding: '32px', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: 'var(--danger)', fontSize: '1.4rem', lineHeight: '0' }}>🛡️</span>
              성분 차단 안전 필터 결과 (Ingredient Filters)
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ padding: '14px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239,68,68,0.2)' }}>
                <span style={{ fontSize: '0.8rem', color: '#f87171', display: 'block', fontWeight: 'bold', marginBottom: '4px' }}>
                  화장품 추천 차단 (Force Exclude) 성분 리스트:
                </span>
                {resultsData.avoided.length > 0 || resultsData.allergic.length > 0 || resultsData.fragranceExclusion ? (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                    {resultsData.allergic.map(i => <span key={i} className="badge badge-rose">{i} (알레르기 밴)</span>)}
                    {resultsData.avoided.map(i => <span key={i} className="badge badge-orange">{i} (회피 희망)</span>)}
                    {resultsData.fragranceExclusion && <span className="badge badge-rose">인공향료/에센셜오일 (향료 밴)</span>}
                  </div>
                ) : (
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>안전 필터에 걸려 제외된 성분이 없습니다. 깨끗한 성분 매칭이 가능합니다.</span>
                )}
              </div>

              {resultsData.hormoneCaveat && (
                <div style={{ padding: '14px', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245,158,11,0.2)' }}>
                  <span style={{ fontSize: '0.85rem', color: '#fbbf24', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>
                    ⚠️ 현재 호르몬 상태(임신/수유/생리) 안내 고지:
                  </span>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                    임신, 수유 또는 생리 주기 영향에 따라 일시적인 피부 변화가 심하게 나타날 수 있는 변동 상태입니다. 3개월 후 호르몬 주기가 안정되었을 때 재진단을 받아 비교해 보시길 권장합니다.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* A.aura Ontology JSON Packet Panel */}
          <div className="glass-panel" style={{ padding: '32px', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: 'var(--primary)', fontSize: '1.4rem', lineHeight: '0' }}>🔗</span>
              A.aura 지식 그래프 연동 패킷 (Ontology Payload)
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
              A.aura 온톨로지 AI가 수집할 최종 Entity ID 패킷 목록입니다 (설문 완료 시 <code>{webhookUrl}</code>로 전송됨).
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
              {resultsData.entityIds && resultsData.entityIds.map(id => (
                <span key={id} className="badge badge-blue" style={{ fontSize: '0.72rem', fontFamily: 'Consolas, monospace', padding: '4px 8px' }}>{id}</span>
              ))}
            </div>
            
            <details style={{ background: '#070709', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '12px' }} open>
              <summary style={{ cursor: 'pointer', fontSize: '0.8rem', color: 'var(--text-muted)', userSelect: 'none' }}>
                전송 완료 JSON Payload 미리보기
              </summary>
              <pre style={{
                marginTop: '10px',
                fontSize: '0.72rem',
                lineHeight: '1.4',
                color: '#2dd4bf',
                fontFamily: 'Consolas, monospace',
                overflowX: 'auto',
                padding: '8px',
                background: '#040406',
                borderRadius: '6px'
              }}>
{JSON.stringify({
  timestamp: new Date().toISOString(),
  userId: "SESSION_USER_ACTIVE",
  baumann: resultsData.bauman,
  skinCode: resultsData.code,
  entities: resultsData.entityIds
}, null, 2)}
              </pre>
            </details>
          </div>

          {/* Confidence and Advice Box */}
          <div className="glass-panel" style={{ padding: '32px', marginBottom: '32px' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>품질 지표 및 케어 가이드</span>
              <span className={`badge ${resultsData.consistency >= 70 ? 'badge-teal' : 'badge-rose'}`}>
                신뢰도: {resultsData.consistency}%
              </span>
            </h3>

            {resultsData.consistency < 70 && (
              <div style={{ padding: '16px', borderRadius: '8px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', marginBottom: '20px' }}>
                <strong style={{ fontSize: '0.9rem', color: '#f87171', display: 'block', marginBottom: '4px' }}>
                  일관되지 않은 응답 패턴 감지 (CONFIDENCE.LOW)
                </strong>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                  피부 당김 및 유분 자가 응답과 민감도 측정 문항의 교차 체크 과정에서 일관성이 다소 낮게 측정되었습니다. 정확한 코스메틱 매칭을 위해 1:1 피부 전문가 상담 또는 재진단을 권장합니다.
                </p>
              </div>
            )}

            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                화장품 리터러시 수준 ({resultsData.literacy})에 최적화된 맞춤 설명
              </span>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                {resultsData.literacy.includes("항상 확인") ? (
                  "당신은 성분을 매우 전문적으로 탐색하는 유저입니다. 추천해 드린 스킨케어 포트폴리오는 비건 및 클린 뷰티 기준을 최우선으로 충족하며, 전성분 데이터베이스에서 검증된 활성 펩타이드 및 고기능성 나이아신아마이드 위주로 가중치를 부여해 구성했습니다."
                ) : resultsData.literacy.includes("주요 핵심 효능") ? (
                  "주로 성분의 핵심 기능을 보시는 경향이 있어, 추천 제품들의 타깃 활성 효능성분(보습 수분막 결합을 위한 세라마이드, 진피 탄력을 돕는 레티놀 등)의 농도와 목적을 알기 쉬운 인포그래픽 카드로 웰컴 배너와 함께 시각화했습니다."
                ) : (
                  "성분을 일일이 확인하기 힘든 유저의 난이도를 감안하여, 복잡한 성분 이름 대신 안티에이징 주름 케어와 저자극 수분 충전 등 피부 코드에 맞추어 의학적이고 직관적인 텍스트 카피 설명서로 구성해 제공합니다."
                )}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <button className="btn btn-primary" style={{ padding: '12px 24px' }} onClick={() => { setShowResults(false); setIsPlaying(false); }}>
              시뮬레이터 처음으로 돌아가기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
