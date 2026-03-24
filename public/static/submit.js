// submit.js - 업무 입력 페이지
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('submit-form');

  // 요청사항 사전 검토
  document.getElementById('btn-validate').addEventListener('click', async () => {
    const request = document.getElementById('automation-request').value.trim();
    if (!request) { Utils.toast('자동화 요청사항을 먼저 입력해주세요.', 'warning'); return; }
    const btn = document.getElementById('btn-validate');
    const resultDiv = document.getElementById('validate-result');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> AI 검토 중...';
    resultDiv.classList.remove('hidden');
    resultDiv.innerHTML = '<div class="alert alert-info"><i class="fas fa-spinner fa-spin"></i> AI가 요청사항을 검토하고 있습니다...</div>';
    try {
      const feedback = await API.callAI(
        `사용자의 자동화 요청사항을 검토해주세요:\n\n"${request}"\n\n다음 형식으로 답변:\n1. 이해도: (잘 이해됨/보통/추가 설명 필요)\n2. 구체성: (충분함/보통/부족함)\n3. 피드백: 간단한 피드백\n4. 개선 제안: 더 좋은 결과를 위한 제안`,
        '당신은 AI 업무 자동화 코칭 전문가입니다. 사용자의 자동화 요청사항이 AI 분석에 충분히 명확하고 구체적인지 평가해주세요. 한국어로 친절하게 3-4줄 이내로 답변합니다.'
      );
      resultDiv.innerHTML = `<div class="alert alert-success"><i class="fas fa-check-circle"></i><div>${feedback.replace(/\n/g, '<br>')}</div></div>`;
    } catch (e) {
      resultDiv.innerHTML = `<div class="alert alert-danger"><i class="fas fa-exclamation-circle"></i><div>검토 실패: ${e.message}</div></div>`;
    }
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-check-double"></i> 요청사항이 잘 이해될지 확인하기';
  });

  function validate() {
    let valid = true;
    const fields = [
      { id: 'organization', err: 'err-organization', check: v => v.trim() !== '' },
      { id: 'department', err: 'err-department', check: v => v.trim() !== '' },
      { id: 'name', err: 'err-name', check: v => v.trim() !== '' },
      { id: 'email', err: 'err-email', check: v => Utils.isEmail(v) },
      { id: 'password', err: 'err-password', check: v => v.length >= 4 },
      { id: 'password-confirm', err: 'err-password-confirm', check: v => v === document.getElementById('password').value },
      { id: 'job-description', err: 'err-job-description', check: v => v.trim() !== '' },
      { id: 'automation-request', err: 'err-automation-request', check: v => v.trim() !== '' },
      { id: 'frequency', err: 'err-frequency', check: v => v !== '' }
    ];
    fields.forEach(f => {
      const el = document.getElementById(f.id);
      const errEl = document.getElementById(f.err);
      if (!f.check(el.value)) { el.classList.add('error'); errEl.classList.add('show'); valid = false; }
      else { el.classList.remove('error'); errEl.classList.remove('show'); }
    });
    return valid;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validate()) { Utils.toast('필수 항목을 모두 입력해주세요.', 'warning'); return; }

    const loading = Utils.showLoading(['📋 업무 정보 저장 중...', '🔍 AI 도구 데이터 준비 중...', '🧠 AI 심층 분석 중 (ChatGPT)...', '📊 보고서 생성 중...']);

    try {
      const submissionId = Utils.uuid();
      const passwordHash = await Utils.sha256(document.getElementById('password').value);
      const submission = {
        id: submissionId,
        organization: document.getElementById('organization').value.trim(),
        department: document.getElementById('department').value.trim(),
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        password_hash: passwordHash,
        job_description: document.getElementById('job-description').value.trim(),
        automation_request: document.getElementById('automation-request').value.trim(),
        frequency: document.getElementById('frequency').value,
        estimated_hours: parseFloat(document.getElementById('estimated-hours').value) || 0,
        current_tools: document.getElementById('current-tools').value.trim(),
        ai_engine: 'chatgpt',
        status: 'analyzing'
      };
      await API.create('submissions', submission);
      loading.setStep(1);

      const toolsRes = await API.getAll('tools', { limit: 200 });
      const toolsList = (toolsRes.data || []).filter(t => t.is_active !== 0);
      const toolsContext = toolsList.map(t => {
        let uc = ''; try { uc = JSON.parse(t.use_cases || '[]').join(', '); } catch {}
        return `- ${t.name} (${t.category}): ${t.description} | 난이도: ${t.difficulty} | 가격: ${t.pricing_type} | 활용사례: ${uc}`;
      }).join('\n');
      loading.setStep(2);

      const systemPrompt = `당신은 "AI워크코치"의 수석 AI 업무 자동화 코칭 컨설턴트입니다.\n기업 현장에서 10년 이상 디지털 트랜스포메이션과 AI 자동화 컨설팅을 수행한 전문가로서, 사용자의 업무를 깊이 분석하고, 실질적이고 즉시 실행 가능한 자동화 전략을 제시합니다.\n\n## 분석 원칙\n1. 구체성: 해당 업무에 특화된 구체적 설정 방법과 클릭 단위 가이드\n2. 실행가능성: 단계별 액션 플랜\n3. ROI 중심: 시간 절감 + 품질 향상 + 오류 감소\n4. 단계적 접근: 즉시실행(1주), 단기(1개월), 중기(3개월)\n\n## 사용 가능한 AI 도구 목록\n${toolsContext}\n\n## 응답 규칙\n- 반드시 아래 JSON 형식으로만 응답. JSON 외 텍스트 금지\n- 모든 텍스트 한국어 작성\n- 구체적 수치, 도구명, 설정 방법 반드시 포함\n\nJSON 스키마:\n{"executive_summary":"3-4문장 핵심 진단 요약","current_state_analysis":{"pain_points":["비효율 포인트 3-5개"],"bottlenecks":["병목점 2-3개"],"automation_readiness_score":"1~100 숫자","automation_readiness_detail":"설명"},"recommended_tools":[{"name":"도구명","category":"카테고리","priority":"필수/권장/선택","match_score":"1~100","reason":"추천 이유","setup_guide":"설정 가이드","usage_scenario":"활용 시나리오","expected_effect":"기대 효과","caution":"주의사항"}],"automation_strategy":{"overview":"전략 요약","workflow_before":"현재 프로세스","workflow_after":"자동화 후 프로세스","steps":[{"phase":"즉시실행/단기/중기","step":"번호","title":"단계명","description":"설명","tool":"도구명","duration":"기간","difficulty":"쉬움/보통/어려움"}]},"time_saving":{"current_hours_per_cycle":"숫자","after_hours_per_cycle":"숫자","saving_percentage":"0-100","monthly_saving_hours":"숫자","yearly_saving_hours":"숫자","quality_improvement":"설명","error_reduction":"설명"},"roi_analysis":{"investment":"초기 투자","payback_period":"회수 기간","one_year_benefit":"1년 효과","risk_factors":["리스크"]},"learning_roadmap":{"total_duration":"기간","weekly_plan":[{"week":"주차","goal":"목표","tasks":["과제"],"tools_to_learn":["도구명"],"milestone":"달성 기준"}]},"coach_insight":{"strength":"강점","advice":"핵심 조언","motivation":"동기부여","next_level":"다음 단계"},"additional_resources":[{"type":"영상/문서/강의","title":"제목","description":"설명","url_hint":"검색 키워드"}]}`;

      const userPrompt = `[업무 분석 요청]\n\n■ 요청자 정보\n- 조직/구분: ${submission.organization}\n- 부서: ${submission.department}\n- 성명: ${submission.name}\n\n■ 업무 상세\n- 직무/업무: ${submission.job_description}\n- 자동화 요청사항: ${submission.automation_request}\n- 반복주기: ${submission.frequency}\n- 현재 소요시간: ${submission.estimated_hours ? submission.estimated_hours + '시간/' + submission.frequency : '미입력 (AI가 추정해주세요)'}\n- 현재 사용 도구: ${submission.current_tools || '없음'}\n\n■ 분석 요구사항\n1. 위 도구 목록에서 3-5개 선택\n2. Before/After 워크플로 대비\n3. 즉시실행/단기/중기 3단계로 5-7개 스텝\n4. 학습 로드맵 최소 3-4주\n5. 시간 절감 월간/연간 수치 포함\n6. ROI 분석\n7. 코치 인사이트 500자 이상\n8. 추가 학습 리소스 2-3개\n\nJSON으로 응답해주세요.`;

      const aiResponse = await API.callAI(userPrompt, systemPrompt, 'chatgpt');
      loading.setStep(3);

      const analysisResult = Utils.parseJSON(aiResponse);
      if (!analysisResult) throw new Error('AI 응답을 분석할 수 없습니다. 다시 시도해주세요.');

      const reportId = Utils.uuid();
      const settings = await API.getSettings();
      const coachName = settings.coach_name || '오원석 박사';
      const autoComment = generateCoachComment(submission, analysisResult);

      const report = {
        id: reportId, submission_id: submissionId, ai_engine_used: 'chatgpt',
        analysis_result: JSON.stringify(analysisResult),
        recommended_tools: JSON.stringify(analysisResult.recommended_tools || []),
        time_saving_estimate: JSON.stringify(analysisResult.time_saving || {}),
        coach_comment: autoComment, coach_comment_by: coachName,
        coach_comment_at: new Date().toISOString()
      };
      await API.create('reports', report);
      await API.patch('submissions', submission.id, { status: 'completed' });
      loading.hide();
      Utils.toast('분석이 완료되었습니다!', 'success');
      setTimeout(() => { window.location.href = `/result?id=${reportId}`; }, 500);
    } catch (err) {
      loading.hide();
      console.error('분석 오류:', err);
      Utils.toast(`분석 실패: ${err.message}`, 'danger');
    }
  });
});

function generateCoachComment(submission, analysis) {
  const frequency = submission.frequency;
  const toolCount = (analysis.recommended_tools || []).length;
  const saving = analysis.time_saving?.saving_percentage || 0;
  const coachInsight = analysis.coach_insight || {};
  const readiness = analysis.current_state_analysis?.automation_readiness_score || 50;
  let comment = `안녕하세요, ${submission.name}님. AI워크코치 분석 결과를 안내드립니다. ${submission.organization} ${submission.department}에서 수행하시는 업무를 면밀히 분석한 결과, `;
  if (readiness >= 70) comment += `자동화 준비도가 ${readiness}점으로 매우 높습니다. 이미 업무 프로세스가 체계적으로 정리되어 있어 AI 도구 도입 효과가 즉시 나타날 것으로 예상됩니다. `;
  else if (readiness >= 40) comment += `자동화 준비도가 ${readiness}점으로 양호한 수준입니다. 일부 업무 프로세스를 정리하면 AI 도구 도입 효과를 극대화할 수 있습니다. `;
  else comment += `자동화 준비도가 ${readiness}점으로, 먼저 업무 프로세스 표준화가 선행되어야 합니다. 하지만 걱정하지 마세요! 추천 도구들이 이 과정을 자연스럽게 도와줄 것입니다. `;
  if (frequency === '매일') comment += `특히 매일 반복되는 업무이므로 자동화 ROI가 매우 높습니다. `;
  else if (frequency === '매주') comment += `매주 반복되는 업무는 자동화의 핵심 대상입니다. `;
  if (toolCount >= 4) comment += `총 ${toolCount}개의 AI 도구가 추천되었는데, 학습 로드맵에 따라 우선순위가 높은 도구부터 차례로 익히시길 권장합니다. `;
  else if (toolCount >= 2) comment += `추천된 ${toolCount}개 도구를 전략적으로 조합하면 시너지 효과가 극대화됩니다. `;
  if (saving >= 70) comment += `약 ${saving}%의 시간 절감이 예상되며, 절약된 시간을 더 창의적이고 전략적인 업무에 투자하시길 바랍니다. `;
  else if (saving >= 40) comment += `약 ${saving}%의 시간 절감이 기대됩니다. AI 도구에 익숙해질수록 절감률은 더 높아질 것입니다. `;
  if (coachInsight.advice) comment += coachInsight.advice + ' ';
  comment += `AI 자동화는 꾸준한 학습과 적용의 과정입니다. 학습 로드맵을 따라 한 주에 하나의 도구씩 마스터하시면, 한 달 후에는 업무 방식이 완전히 달라져 있을 것입니다. 궁금한 점이나 추가 코칭이 필요하시면 언제든지 문의해 주세요. ${submission.name}님의 스마트워크 여정을 응원합니다!`;
  return comment;
}
