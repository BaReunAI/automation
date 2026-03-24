// result.js - 분석 결과 보고서 페이지
document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const reportId = urlParams.get('id');
  if (!reportId) { showError('보고서 ID가 없습니다.'); return; }

  try {
    const report = await API.getById('reports', reportId);
    if (!report || report.error) throw new Error('보고서를 찾을 수 없습니다.');

    const subRes = await API.getAll('submissions', { search: report.submission_id, limit: 100 });
    const submission = (subRes.data || []).find(s => s.id === report.submission_id) || {};

    const analysis = typeof report.analysis_result === 'string' ? JSON.parse(report.analysis_result) : report.analysis_result;
    const timeSaving = analysis.time_saving || (typeof report.time_saving_estimate === 'string' ? JSON.parse(report.time_saving_estimate) : report.time_saving_estimate || {});
    const recommendedTools = analysis.recommended_tools || (typeof report.recommended_tools === 'string' ? JSON.parse(report.recommended_tools) : report.recommended_tools || []);

    document.getElementById('page-loading').style.display = 'none';
    renderReport(report, submission, analysis, timeSaving, recommendedTools);
  } catch (err) {
    console.error(err);
    showError(err.message);
  }
});

function showError(msg) {
  document.getElementById('page-loading').style.display = 'none';
  document.getElementById('result-content').innerHTML = `<div class="section" style="text-align:center"><div class="container" style="max-width:500px"><i class="fas fa-exclamation-triangle" style="font-size:3rem;color:var(--warning);margin-bottom:1rem"></i><h2 style="margin-bottom:0.5rem">보고서를 불러올 수 없습니다</h2><p class="text-sub">${msg}</p><a href="/submit" class="btn btn-primary mt-3"><i class="fas fa-plus"></i> 새 분석 요청</a></div></div>`;
}

function safe(v, d) { return v || d || ''; }
function safeNum(v) { return parseFloat(v) || 0; }
function escH(s) { return Utils.escapeHTML(s); }

function renderReport(report, submission, analysis, timeSaving, recommendedTools) {
  const container = document.getElementById('result-content');
  const engineLabel = report.ai_engine_used === 'claude' ? '🟣 Claude Sonnet' : '🟢 ChatGPT';
  const reportDate = Utils.formatDateTime(report.created_at);
  const currentH = safeNum(timeSaving.current_hours_per_cycle || timeSaving.current_hours);
  const afterH = safeNum(timeSaving.after_hours_per_cycle || timeSaving.estimated_hours);
  const savePct = safeNum(timeSaving.saving_percentage);
  const monthlySave = safeNum(timeSaving.monthly_saving_hours);
  const yearlySave = safeNum(timeSaving.yearly_saving_hours);
  const csa = analysis.current_state_analysis || {};
  const readiness = safeNum(csa.automation_readiness_score) || 50;
  const painPoints = csa.pain_points || [];
  const bottlenecks = csa.bottlenecks || [];
  const strategy = analysis.automation_strategy || {};
  const steps = strategy.steps || [];
  const roi = analysis.roi_analysis || {};
  const roadmap = analysis.learning_roadmap || {};
  const weeklyPlan = roadmap.weekly_plan || [];
  const insight = analysis.coach_insight || {};
  const resources = analysis.additional_resources || [];

  container.innerHTML = `
    <section class="hero" style="padding:2.5rem 0"><div class="container"><div style="max-width:700px;margin:0 auto">
      <div style="font-size:0.85rem;opacity:0.8;margin-bottom:0.5rem">보고서 번호 #${report.id.substring(0,8).toUpperCase()} | ${reportDate}</div>
      <h1 style="font-size:1.75rem;margin-bottom:0.5rem">📊 AI 자동화 코칭 보고서</h1>
      <p style="font-size:1rem;opacity:0.9">${escH(submission.name)}님의 업무 자동화 진단 · 전략 · 로드맵</p>
      <div style="display:flex;gap:0.75rem;justify-content:center;margin-top:1.25rem;flex-wrap:wrap;position:relative">
        <button class="btn btn-white" id="btn-pdf"><i class="fas fa-file-pdf"></i> PDF 보고서 다운로드</button>
        <a href="/submit" class="btn" style="background:rgba(255,255,255,0.15);color:white;border:2px solid rgba(255,255,255,0.3)"><i class="fas fa-plus"></i> 새 분석 요청</a>
      </div>
    </div></div></section>

    <section class="section" style="padding-top:2rem"><div class="container" style="max-width:960px"><div id="report-printable">

    <!-- KPI -->
    <div class="report-section"><div class="kpi-grid">
      <div class="kpi-card kpi-danger"><div class="kpi-icon">⏱️</div><div class="kpi-value" style="color:var(--danger)">${currentH}h</div><div class="kpi-label">현재 소요시간</div><div class="kpi-sub">${submission.frequency}마다</div></div>
      <div class="kpi-card kpi-success"><div class="kpi-icon">⚡</div><div class="kpi-value" style="color:var(--success)">${afterH}h</div><div class="kpi-label">자동화 후 예상</div><div class="kpi-sub">${(currentH - afterH).toFixed(1)}시간 절약</div></div>
      <div class="kpi-card kpi-primary"><div class="kpi-icon">📈</div><div class="kpi-value" style="color:var(--primary)">${savePct}%</div><div class="kpi-label">시간 절감률</div><div class="kpi-sub">업무 효율 향상</div></div>
      <div class="kpi-card kpi-warning"><div class="kpi-icon">📅</div><div class="kpi-value" style="color:var(--warning)">${yearlySave || (monthlySave * 12).toFixed(0)}h</div><div class="kpi-label">연간 절감 시간</div><div class="kpi-sub">약 ${((yearlySave || monthlySave * 12) / 8).toFixed(0)}일 분량</div></div>
    </div></div>

    <!-- 입력 정보 -->
    <div class="report-section"><div class="card"><div class="card-body">
      <h3 style="font-size:1.1rem;margin-bottom:1rem"><span class="section-num">1</span>입력 정보 요약</h3>
      <div class="grid grid-2" style="gap:0.75rem;margin-bottom:1rem">
        <div><span class="text-sub text-sm">조직/구분:</span> <strong>${escH(submission.organization)}</strong></div>
        <div><span class="text-sub text-sm">부서:</span> <strong>${escH(submission.department)}</strong></div>
        <div><span class="text-sub text-sm">성명:</span> <strong>${escH(submission.name)}</strong></div>
        <div><span class="text-sub text-sm">반복주기:</span> <strong>${submission.frequency}</strong> | <span class="text-sub text-sm">AI:</span> <strong>${engineLabel}</strong></div>
      </div>
      <div style="padding:0.75rem;background:var(--border-light);border-radius:var(--radius);margin-bottom:0.75rem"><div class="text-sub text-sm fw-semi mb-1">📋 직무/업무</div><div class="text-sm">${escH(submission.job_description)}</div></div>
      <div style="padding:0.75rem;background:var(--border-light);border-radius:var(--radius)"><div class="text-sub text-sm fw-semi mb-1">🎯 자동화 요청사항</div><div class="text-sm">${escH(submission.automation_request)}</div></div>
    </div></div></div>

    <!-- AI 진단 -->
    <div class="report-section"><div class="card"><div class="card-body">
      <h3 style="font-size:1.1rem;margin-bottom:1.25rem"><span class="section-num">2</span>AI 진단 결과</h3>
      <div class="alert alert-info" style="margin-bottom:1.5rem;border-left:4px solid var(--primary)"><i class="fas fa-brain" style="font-size:1.25rem"></i><div><div class="fw-semi" style="margin-bottom:0.35rem">핵심 진단 요약</div><div style="line-height:1.8">${escH(safe(analysis.executive_summary, analysis.summary))}</div></div></div>
      <div style="display:flex;gap:2rem;flex-wrap:wrap;margin-bottom:1.5rem">
        <div class="score-ring-wrap" style="flex:1;min-width:280px">
          <div class="score-ring"><svg width="120" height="120" viewBox="0 0 120 120"><circle cx="60" cy="60" r="52" fill="none" stroke="#E5E7EB" stroke-width="8"/><circle cx="60" cy="60" r="52" fill="none" stroke="url(#grad)" stroke-width="8" stroke-linecap="round" stroke-dasharray="${(readiness/100)*327} 327"/><defs><linearGradient id="grad"><stop offset="0%" stop-color="#7C3AED"/><stop offset="100%" stop-color="#3B82F6"/></linearGradient></defs></svg><div class="score-ring-value"><div class="num">${readiness}</div><div class="label">자동화 준비도</div></div></div>
          <div><div class="fw-semi" style="margin-bottom:0.35rem">자동화 준비도 ${readiness >= 70 ? '🟢 높음' : readiness >= 40 ? '🟡 보통' : '🔴 개선 필요'}</div><div class="text-sm text-sub" style="line-height:1.7">${escH(safe(csa.automation_readiness_detail, ''))}</div></div>
        </div>
      </div>
      ${painPoints.length > 0 ? `<div style="margin-bottom:1rem"><div class="fw-semi text-sm" style="margin-bottom:0.5rem;color:var(--danger)"><i class="fas fa-exclamation-triangle"></i> 현재 업무 비효율 포인트</div><div style="display:flex;flex-direction:column;gap:0.5rem">${painPoints.map(p => `<div style="display:flex;align-items:flex-start;gap:0.5rem;padding:0.5rem 0.75rem;background:#FEF2F2;border-radius:var(--radius);font-size:0.85rem;border-left:3px solid var(--danger)"><i class="fas fa-times-circle" style="color:var(--danger);margin-top:2px;flex-shrink:0"></i><span>${escH(p)}</span></div>`).join('')}</div></div>` : ''}
      ${bottlenecks.length > 0 ? `<div><div class="fw-semi text-sm" style="margin-bottom:0.5rem;color:var(--warning)"><i class="fas fa-traffic-light"></i> 프로세스 병목점</div><div style="display:flex;flex-direction:column;gap:0.5rem">${bottlenecks.map(b => `<div style="display:flex;align-items:flex-start;gap:0.5rem;padding:0.5rem 0.75rem;background:#FFFBEB;border-radius:var(--radius);font-size:0.85rem;border-left:3px solid var(--warning)"><i class="fas fa-exclamation-circle" style="color:var(--warning);margin-top:2px;flex-shrink:0"></i><span>${escH(b)}</span></div>`).join('')}</div></div>` : ''}
    </div></div></div>

    <!-- 시간 절감 -->
    <div class="report-section"><div class="card"><div class="card-body">
      <h3 style="font-size:1.1rem;margin-bottom:1.25rem"><span class="section-num">3</span>시간 절감 상세 분석</h3>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;margin-bottom:1.5rem">
        <div style="height:220px"><canvas id="time-bar-chart"></canvas></div>
        <div style="height:220px"><canvas id="time-doughnut-chart"></canvas></div>
      </div>
      <div class="grid grid-3" style="gap:1rem;margin-bottom:1rem">
        <div class="roi-metric" style="background:#ECFDF5"><div class="roi-value" style="color:var(--success)">${monthlySave || (((currentH - afterH) * (submission.frequency === '매일' ? 22 : submission.frequency === '매주' ? 4 : 1))).toFixed(1)}h</div><div class="roi-label">월간 절감 시간</div></div>
        <div class="roi-metric" style="background:#EFF6FF"><div class="roi-value" style="color:var(--accent)">${yearlySave || (monthlySave * 12).toFixed(0)}h</div><div class="roi-label">연간 절감 시간</div></div>
        <div class="roi-metric" style="background:#FDF4FF"><div class="roi-value" style="color:var(--primary)">약 ${((yearlySave || monthlySave * 12) / 8).toFixed(0)}일</div><div class="roi-label">연간 절감 일수</div></div>
      </div>
      ${timeSaving.quality_improvement ? `<div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem"><div style="padding:0.75rem;background:#ECFDF5;border-radius:var(--radius);font-size:0.85rem"><div class="fw-semi text-sm" style="color:#065F46;margin-bottom:0.25rem"><i class="fas fa-check-circle"></i> 품질 향상</div>${escH(timeSaving.quality_improvement)}</div><div style="padding:0.75rem;background:#EFF6FF;border-radius:var(--radius);font-size:0.85rem"><div class="fw-semi text-sm" style="color:#1D4ED8;margin-bottom:0.25rem"><i class="fas fa-shield-alt"></i> 오류 감소</div>${escH(timeSaving.error_reduction || '')}</div></div>` : ''}
    </div></div></div>

    <!-- 추천 도구 -->
    <div class="report-section"><div class="card"><div class="card-body">
      <h3 style="font-size:1.1rem;margin-bottom:1.25rem"><span class="section-num">4</span>추천 AI 도구 (${recommendedTools.length}개)</h3>
      <div style="display:flex;flex-direction:column;gap:1.25rem">
        ${recommendedTools.map((tool, i) => {
          const matchScore = safeNum(tool.match_score) || 80;
          const priorityColor = tool.priority === '필수' ? '#EF4444' : tool.priority === '권장' ? '#3B82F6' : '#10B981';
          return `<div class="tool-card">
            <div class="tool-priority"><span class="badge" style="background:${priorityColor}15;color:${priorityColor};font-weight:700">${tool.priority || '권장'}</span></div>
            <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:0.75rem"><span style="width:32px;height:32px;background:var(--gradient);border-radius:50%;display:inline-flex;align-items:center;justify-content:center;color:white;font-size:0.8rem;font-weight:700">${i+1}</span><div><strong style="font-size:1.05rem">${escH(tool.name)}</strong>${tool.category ? ` <span class="badge badge-category" style="margin-left:0.35rem">${tool.category}</span>` : ''}</div></div>
            <div style="font-size:0.85rem;margin-bottom:0.25rem"><strong>업무 적합도</strong></div>
            <div class="tool-match-bar"><div class="tool-match-fill" style="width:${matchScore}%"></div></div>
            <div class="text-sm text-sub" style="margin-top:0.15rem">${matchScore}점 / 100점</div>
            <div style="margin-top:1rem;display:grid;gap:0.75rem">
              <div style="padding:0.75rem;background:#F9FAFB;border-radius:var(--radius)"><div class="fw-semi text-sm" style="color:var(--primary);margin-bottom:0.25rem">💡 추천 이유</div><div class="text-sm">${escH(tool.reason)}</div></div>
              ${tool.setup_guide ? `<div style="padding:0.75rem;background:#EFF6FF;border-radius:var(--radius)"><div class="fw-semi text-sm" style="color:#1D4ED8;margin-bottom:0.25rem">⚙️ 초기 설정 가이드</div><div class="text-sm" style="line-height:1.8">${escH(tool.setup_guide)}</div></div>` : ''}
              ${tool.usage_scenario ? `<div style="padding:0.75rem;background:#ECFDF5;border-radius:var(--radius)"><div class="fw-semi text-sm" style="color:#065F46;margin-bottom:0.25rem">🎬 활용 시나리오</div><div class="text-sm" style="line-height:1.8">${escH(tool.usage_scenario)}</div></div>` : ''}
              ${tool.expected_effect ? `<div style="padding:0.75rem;background:#FFFBEB;border-radius:var(--radius)"><div class="fw-semi text-sm" style="color:#92400E;margin-bottom:0.25rem">📈 기대 효과</div><div class="text-sm">${escH(tool.expected_effect)}</div></div>` : ''}
              ${tool.caution ? `<div style="padding:0.75rem;background:#FEF2F2;border-radius:var(--radius)"><div class="fw-semi text-sm" style="color:#991B1B;margin-bottom:0.25rem">⚠️ 주의사항</div><div class="text-sm">${escH(tool.caution)}</div></div>` : ''}
            </div>
          </div>`;
        }).join('')}
      </div>
    </div></div></div>

    <!-- 자동화 전략 -->
    <div class="report-section"><div class="card"><div class="card-body">
      <h3 style="font-size:1.1rem;margin-bottom:1.25rem"><span class="section-num">5</span>자동화 전략</h3>
      ${strategy.overview ? `<p class="text-sub text-sm" style="margin-bottom:1.25rem;line-height:1.8">${escH(strategy.overview)}</p>` : ''}
      ${(strategy.workflow_before || strategy.workflow_after) ? `<div style="display:grid;grid-template-columns:1fr auto 1fr;gap:1rem;margin-bottom:2rem;align-items:stretch">
        <div class="workflow-box workflow-before"><div class="workflow-label" style="color:#991B1B"><i class="fas fa-times-circle"></i> Before (현재)</div><div class="workflow-steps">${(strategy.workflow_before || '').split('→').map((s, i, arr) => `<span class="workflow-step">${s.trim().replace(/^\\d+\\.\\s*/, '')}</span>${i < arr.length-1 ? '<span class="workflow-arrow"><i class="fas fa-arrow-down"></i></span>' : ''}`).join('')}</div></div>
        <div style="display:flex;align-items:center;justify-content:center"><div style="width:48px;height:48px;background:var(--gradient);border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-size:1.25rem"><i class="fas fa-arrow-right"></i></div></div>
        <div class="workflow-box workflow-after"><div class="workflow-label" style="color:#065F46"><i class="fas fa-check-circle"></i> After (자동화)</div><div class="workflow-steps">${(strategy.workflow_after || '').split('→').map((s, i, arr) => `<span class="workflow-step">${s.trim().replace(/^\\d+\\.\\s*/, '')}</span>${i < arr.length-1 ? '<span class="workflow-arrow"><i class="fas fa-arrow-down"></i></span>' : ''}`).join('')}</div></div>
      </div>` : ''}
      <div class="fw-semi" style="margin-bottom:1rem"><i class="fas fa-route" style="color:var(--accent);margin-right:0.35rem"></i>단계별 실행 계획</div>
      <div class="timeline">
        ${steps.map((step, i) => {
          const phase = step.phase || (i < 2 ? '즉시실행' : i < 4 ? '단기' : '중기');
          const phaseClass = phase.includes('즉시') ? 'phase-immediate' : phase.includes('단기') ? 'phase-short' : 'phase-mid';
          const phaseLabel = phase.includes('즉시') ? '🚀 즉시' : phase.includes('단기') ? '📋 단기' : '🎯 중기';
          const phaseColor = phaseClass === 'phase-immediate' ? '#7C3AED' : phaseClass === 'phase-short' ? '#3B82F6' : '#10B981';
          return `<div class="timeline-item"><div class="timeline-dot ${phaseClass}">${step.step || i+1}</div><div class="timeline-content">
            <div style="display:flex;align-items:center;gap:0.5rem;flex-wrap:wrap;margin-bottom:0.35rem"><strong>${escH(step.title)}</strong><span class="badge" style="background:${phaseColor}15;color:${phaseColor};font-size:0.7rem">${phaseLabel}</span>${step.tool ? `<span class="badge badge-category">${step.tool}</span>` : ''}${step.duration ? `<span class="text-sub text-sm"><i class="fas fa-clock"></i> ${step.duration}</span>` : ''}</div>
            <div class="text-sm text-sub" style="line-height:1.7">${escH(step.description)}</div>
            ${step.difficulty ? `<div class="text-sm mt-1"><span style="color:${step.difficulty === '쉬움' ? '#10B981' : step.difficulty === '어려움' ? '#EF4444' : '#F59E0B'}">● ${step.difficulty}</span></div>` : ''}
          </div></div>`;
        }).join('')}
      </div>
    </div></div></div>

    <!-- ROI -->
    ${roi.investment || roi.payback_period ? `<div class="report-section"><div class="card"><div class="card-body">
      <h3 style="font-size:1.1rem;margin-bottom:1.25rem"><span class="section-num">6</span>ROI(투자수익률) 분석</h3>
      <div class="grid grid-3" style="gap:1rem;margin-bottom:1.25rem">
        <div class="roi-metric" style="background:#FDF4FF"><div class="roi-value" style="color:var(--primary)">${escH(safe(roi.payback_period, '-'))}</div><div class="roi-label">투자 회수 기간</div></div>
        <div class="roi-metric" style="background:#ECFDF5"><div style="font-size:0.75rem;color:var(--text-sub);margin-bottom:0.25rem">초기 투자</div><div class="text-sm fw-semi">${escH(safe(roi.investment, '-'))}</div></div>
        <div class="roi-metric" style="background:#EFF6FF"><div style="font-size:0.75rem;color:var(--text-sub);margin-bottom:0.25rem">1년간 기대 효과</div><div class="text-sm fw-semi">${escH(safe(roi.one_year_benefit, '-'))}</div></div>
      </div>
      ${(roi.risk_factors || []).length > 0 ? `<div style="padding:0.75rem;background:#FEF2F2;border-radius:var(--radius)"><div class="fw-semi text-sm" style="color:#991B1B;margin-bottom:0.35rem"><i class="fas fa-exclamation-triangle"></i> 리스크 요소</div><ul style="margin:0;padding-left:1.25rem;font-size:0.85rem;color:#991B1B">${roi.risk_factors.map(r => `<li>${escH(r)}</li>`).join('')}</ul></div>` : ''}
    </div></div></div>` : ''}

    <!-- 학습 로드맵 -->
    ${weeklyPlan.length > 0 ? `<div class="report-section"><div class="card"><div class="card-body">
      <h3 style="font-size:1.1rem;margin-bottom:0.5rem"><span class="section-num">7</span>학습 로드맵</h3>
      <p class="text-sub text-sm" style="margin-bottom:1.25rem">총 학습 기간: <strong>${escH(safe(roadmap.total_duration, '4주'))}</strong></p>
      <div>${weeklyPlan.map((w, i) => `<div class="roadmap-week"><div class="roadmap-header"><div><i class="fas fa-calendar-week" style="margin-right:0.35rem"></i>${escH(w.week || (i+1)+'주차')} — ${escH(w.goal || '')}</div>${w.milestone ? `<span class="text-sm" style="opacity:0.8">🎯 ${escH(w.milestone)}</span>` : ''}</div><div class="roadmap-body">${(w.tools_to_learn || []).length > 0 ? `<div style="margin-bottom:0.5rem;display:flex;gap:0.35rem;flex-wrap:wrap">${w.tools_to_learn.map(t => `<span class="badge badge-category">${escH(t)}</span>`).join('')}</div>` : ''}${(w.tasks || []).map(t => `<div class="roadmap-task">${escH(t)}</div>`).join('')}</div></div>`).join('')}</div>
    </div></div></div>` : ''}

    <!-- 추가 학습 리소스 -->
    ${resources.length > 0 ? `<div class="report-section"><div class="card"><div class="card-body">
      <h3 style="font-size:1.1rem;margin-bottom:1.25rem"><span class="section-num">8</span>추천 학습 리소스</h3>
      <div style="display:grid;gap:1rem">${resources.map(r => {
        const typeIcon = r.type === '영상' ? 'fa-video' : r.type === '강의' ? 'fa-graduation-cap' : 'fa-file-alt';
        const typeColor = r.type === '영상' ? '#EF4444' : r.type === '강의' ? '#7C3AED' : '#3B82F6';
        return `<div class="resource-card"><div class="resource-icon" style="background:${typeColor}12;color:${typeColor}"><i class="fas ${typeIcon}"></i></div><div><div class="fw-semi text-sm">${escH(r.title)}</div><div class="text-sub text-sm" style="margin-top:0.15rem">${escH(r.description || '')}</div>${r.url_hint ? `<div class="text-sm" style="margin-top:0.25rem;color:var(--primary)"><i class="fas fa-search"></i> ${escH(r.url_hint)}</div>` : ''}</div></div>`;
      }).join('')}</div>
    </div></div></div>` : ''}

    <!-- 코치 코멘트 -->
    <div class="report-section"><div class="coach-card">
      <div style="display:flex;align-items:flex-start;gap:1rem;margin-bottom:1rem">
        <div class="coach-avatar">코</div>
        <div><div class="fw-semi" style="font-size:1.05rem">${escH(report.coach_comment_by || '오원석 박사')}</div><div class="text-sub text-sm">바른AI 대표 · 디지털융합교육원 지도교수</div><div class="text-sub" style="font-size:0.75rem">${report.coach_comment_at ? Utils.formatDateTime(report.coach_comment_at) : ''}</div></div>
      </div>
      <div style="line-height:2;font-size:0.92rem;color:var(--text)">${escH(report.coach_comment || '코치 코멘트가 준비 중입니다.').split('. ').map((s, i) => s.trim() ? (i % 3 === 2 ? s + '.<br><br>' : s + '. ') : '').join('')}</div>
      ${insight.motivation ? `<div style="margin-top:1rem;padding:1rem;background:linear-gradient(135deg,rgba(124,58,237,0.06),rgba(59,130,246,0.06));border-radius:var(--radius);border-left:4px solid var(--primary)"><div class="fw-semi text-sm" style="color:var(--primary);margin-bottom:0.35rem">💪 코치의 응원 메시지</div><div class="text-sm" style="line-height:1.8">${escH(insight.motivation)}</div></div>` : ''}
      ${insight.next_level ? `<div style="margin-top:0.75rem;padding:1rem;background:linear-gradient(135deg,rgba(16,185,129,0.06),rgba(59,130,246,0.06));border-radius:var(--radius);border-left:4px solid var(--success)"><div class="fw-semi text-sm" style="color:var(--success);margin-bottom:0.35rem">🚀 다음 단계 제안</div><div class="text-sm" style="line-height:1.8">${escH(insight.next_level)}</div></div>` : ''}
    </div></div>

    <div style="text-align:center;padding:2rem 0;border-top:1px solid var(--border);margin-top:1rem"><div style="font-size:0.8rem;color:var(--text-light)">본 보고서는 AI워크코치의 AI 분석 엔진(${engineLabel})에 의해 자동 생성되었습니다.<br>코치: 오원석 박사 · 바른AI 대표 · 디지털융합교육원 지도교수<br>© 2026 AI워크코치. All rights reserved.</div></div>

    </div></div></section>`;

  // Charts
  const barCtx = document.getElementById('time-bar-chart');
  if (barCtx && currentH > 0) {
    new Chart(barCtx, { type:'bar', data:{ labels:['현재','자동화 후'], datasets:[{ data:[currentH,afterH], backgroundColor:['rgba(239,68,68,0.15)','rgba(16,185,129,0.15)'], borderColor:['#EF4444','#10B981'], borderWidth:2, borderRadius:8 }] }, options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{display:false}, title:{display:true,text:`1회 소요시간 비교 (${submission.frequency})`,font:{size:13,weight:'600'}} }, scales:{ y:{beginAtZero:true,title:{display:true,text:'시간(h)'}} } } });
  }
  const doughnutCtx = document.getElementById('time-doughnut-chart');
  if (doughnutCtx && savePct > 0) {
    new Chart(doughnutCtx, { type:'doughnut', data:{ labels:['절감','잔여'], datasets:[{ data:[savePct,100-savePct], backgroundColor:['#7C3AED','#E5E7EB'], borderWidth:0 }] }, options:{ responsive:true, maintainAspectRatio:false, cutout:'70%', plugins:{ legend:{display:false}, title:{display:true,text:`시간 절감률 ${savePct}%`,font:{size:13,weight:'600'}} } } });
  }

  // PDF
  document.getElementById('btn-pdf').addEventListener('click', async () => {
    const btn = document.getElementById('btn-pdf');
    btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> PDF 생성 중...';
    try {
      const { jsPDF } = window.jspdf;
      const printable = document.getElementById('report-printable');
      printable.style.width = '900px'; printable.style.padding = '0 20px';
      const canvas = await html2canvas(printable, { scale:2, useCORS:true, logging:false, backgroundColor:'#FFFFFF', windowWidth:960 });
      printable.style.width = ''; printable.style.padding = '';
      const imgData = canvas.toDataURL('image/jpeg', 0.92);
      const pdf = new jsPDF('p','mm','a4');
      const pdfW = pdf.internal.pageSize.getWidth(), pdfH = pdf.internal.pageSize.getHeight(), margin = 10;
      const imgW = pdfW - margin*2, imgH = (canvas.height * imgW) / canvas.width;
      let heightLeft = imgH, position = margin;
      pdf.addImage(imgData, 'JPEG', margin, position, imgW, imgH);
      heightLeft -= (pdfH - margin*2);
      while (heightLeft > 0) { position = heightLeft - imgH + margin; pdf.addPage(); pdf.addImage(imgData, 'JPEG', margin, position, imgW, imgH); heightLeft -= (pdfH - margin*2); }
      const totalPages = pdf.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) { pdf.setPage(i); pdf.setFontSize(8); pdf.setTextColor(150); pdf.text(`AI Work Coach Report | Page ${i} / ${totalPages}`, pdfW/2, pdfH-5, {align:'center'}); }
      pdf.save(`AI_WorkCoach_${submission.name || 'report'}_${new Date().toISOString().slice(0,10)}.pdf`);
      Utils.toast('PDF가 다운로드되었습니다! 📄', 'success');
    } catch (err) { console.error(err); Utils.toast('PDF 생성 실패: '+err.message, 'danger'); }
    btn.disabled = false; btn.innerHTML = '<i class="fas fa-file-pdf"></i> PDF 보고서 다운로드';
  });
}
