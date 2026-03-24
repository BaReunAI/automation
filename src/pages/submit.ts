import { layout } from './layout'

export function submitPage(): string {
  return layout('업무 입력', 'submit', '', `
<section class="hero" style="padding:3rem 0">
  <div class="container">
    <h1 style="font-size:2rem">📝 업무 자동화 분석 요청</h1>
    <p>자동화하고 싶은 업무를 입력하면 AI가 최적의 도구와 전략을 추천합니다</p>
  </div>
</section>

<section class="section">
  <div class="container" style="max-width:800px">
    <form id="submit-form" novalidate>
      <div class="card mb-3"><div class="card-body">
        <h3 style="font-size:1.15rem;margin-bottom:1.25rem"><i class="fas fa-user" style="color:var(--primary);margin-right:0.5rem"></i>기본 정보</h3>
        <div class="grid grid-2">
          <div class="form-group"><label class="form-label">구분/조직 <span class="required">*</span></label><input type="text" class="form-input" id="organization" placeholder="예) 마케팅, 개발, 기획" required><div class="form-error" id="err-organization">구분/조직을 입력해주세요</div></div>
          <div class="form-group"><label class="form-label">부서 <span class="required">*</span></label><input type="text" class="form-input" id="department" placeholder="예) 마케팅팀, 개발팀" required><div class="form-error" id="err-department">부서를 입력해주세요</div></div>
        </div>
        <div class="grid grid-2">
          <div class="form-group"><label class="form-label">성명 <span class="required">*</span></label><input type="text" class="form-input" id="name" placeholder="이름을 입력하세요" required><div class="form-error" id="err-name">성명을 입력해주세요</div></div>
          <div class="form-group"><label class="form-label">이메일 <span class="required">*</span></label><input type="email" class="form-input" id="email" placeholder="example@email.com" required><div class="form-error" id="err-email">올바른 이메일을 입력해주세요</div></div>
        </div>
        <div class="grid grid-2">
          <div class="form-group"><label class="form-label">보고서 조회 비밀번호 <span class="required">*</span></label><input type="password" class="form-input" id="password" placeholder="4자리 이상" minlength="4" required><div class="form-hint">이력 조회 시 사용됩니다</div><div class="form-error" id="err-password">4자리 이상 비밀번호를 입력해주세요</div></div>
          <div class="form-group"><label class="form-label">비밀번호 확인 <span class="required">*</span></label><input type="password" class="form-input" id="password-confirm" placeholder="비밀번호 재입력" required><div class="form-error" id="err-password-confirm">비밀번호가 일치하지 않습니다</div></div>
        </div>
      </div></div>

      <div class="card mb-3"><div class="card-body">
        <h3 style="font-size:1.15rem;margin-bottom:1.25rem"><i class="fas fa-briefcase" style="color:var(--accent);margin-right:0.5rem"></i>업무 정보</h3>
        <div class="form-group"><label class="form-label">하는 일 / 직무 <span class="required">*</span></label><textarea class="form-textarea" id="job-description" rows="3" placeholder="현재 수행 중인 업무를 상세히 설명해주세요&#10;예) 매주 월요일 팀 회의 후 회의록을 작성하고, 관련 부서에 이메일로 공유합니다." required></textarea><div class="form-error" id="err-job-description">업무 내용을 입력해주세요</div></div>
        <div class="form-group"><label class="form-label">AI 자동화 요청사항 <span class="required">*</span></label><textarea class="form-textarea" id="automation-request" rows="4" placeholder="자동화하고 싶은 업무를 구체적으로 작성해주세요&#10;예) 회의록 작성을 자동화하고 싶습니다." required></textarea><div class="form-error" id="err-automation-request">자동화 요청사항을 입력해주세요</div>
          <div style="margin-top:0.5rem"><button type="button" class="btn btn-sm btn-outline" id="btn-validate"><i class="fas fa-check-double"></i> 요청사항이 잘 이해될지 확인하기</button></div>
          <div id="validate-result" class="hidden mt-1"></div>
        </div>
        <div class="grid grid-3">
          <div class="form-group"><label class="form-label">반복주기 <span class="required">*</span></label><select class="form-select" id="frequency" required><option value="">선택하세요</option><option value="매일">매일</option><option value="매주">매주</option><option value="매월">매월</option><option value="분기별">분기별</option><option value="비정기">비정기</option></select><div class="form-error" id="err-frequency">반복주기를 선택해주세요</div></div>
          <div class="form-group"><label class="form-label">예상 소요시간</label><input type="number" class="form-input" id="estimated-hours" placeholder="시간 단위" min="0" step="0.5"><div class="form-hint">해당 업무에 걸리는 시간</div></div>
          <div class="form-group"><label class="form-label">현재 사용 도구</label><input type="text" class="form-input" id="current-tools" placeholder="예) Excel, Notion"><div class="form-hint">현재 사용 중인 도구</div></div>
        </div>
      </div></div>

      <div class="card mb-3"><div class="card-body">
        <h3 style="font-size:1.15rem;margin-bottom:1rem"><i class="fas fa-brain" style="color:var(--success);margin-right:0.5rem"></i>AI 코칭 엔진</h3>
        <div class="alert alert-info" style="margin-bottom:0"><i class="fas fa-robot"></i><div><strong>🟢 ChatGPT (GPT-4o-mini)</strong> 엔진으로 분석합니다.<div class="text-sm" style="margin-top:0.25rem;opacity:0.8">업무 분석, 도구 추천, 자동화 전략 수립에 최적화된 AI 엔진입니다.</div></div></div>
      </div></div>

      <div style="display:flex;gap:1rem;justify-content:center;margin-top:2rem">
        <a href="/" class="btn btn-ghost btn-lg"><i class="fas fa-times"></i> 취소</a>
        <button type="submit" class="btn btn-primary btn-lg" id="btn-submit"><i class="fas fa-paper-plane"></i> 분석 요청</button>
      </div>
    </form>
  </div>
</section>
`, `<script src="/static/submit.js"></script>`)
}
