import { layout } from './layout'

export function historyPage(): string {
  return layout('이력 조회', 'history', '', `
<section class="hero" style="padding:2.5rem 0">
  <div class="container">
    <h1 style="font-size:2rem">📋 분석 이력 조회</h1>
    <p>이메일과 비밀번호를 입력하여 과거 분석 보고서를 조회하세요</p>
  </div>
</section>

<section class="section" style="padding-top:2rem">
  <div class="container" style="max-width:700px">
    <div class="card mb-3"><div class="card-body">
      <h3 style="font-size:1.1rem;margin-bottom:1.25rem"><i class="fas fa-key" style="color:var(--primary);margin-right:0.5rem"></i>본인 인증</h3>
      <form id="history-form">
        <div class="grid grid-2">
          <div class="form-group"><label class="form-label">이메일 <span class="required">*</span></label><input type="email" class="form-input" id="h-email" placeholder="가입 시 입력한 이메일" required></div>
          <div class="form-group"><label class="form-label">비밀번호 <span class="required">*</span></label><input type="password" class="form-input" id="h-password" placeholder="보고서 조회 비밀번호" required></div>
        </div>
        <button type="submit" class="btn btn-primary btn-block" id="btn-search"><i class="fas fa-search"></i> 이력 조회</button>
      </form>
    </div></div>
    <div id="history-results" class="hidden">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem">
        <h3 style="font-size:1.1rem"><i class="fas fa-list" style="color:var(--accent);margin-right:0.5rem"></i>분석 이력</h3>
        <span class="text-sub text-sm" id="result-count"></span>
      </div>
      <div id="history-list"></div>
    </div>
    <div class="hidden" id="history-empty"><div class="empty-state"><i class="fas fa-inbox"></i><p>조회된 분석 이력이 없습니다</p><a href="/submit" class="btn btn-primary btn-sm mt-2"><i class="fas fa-plus"></i> 새 분석 요청</a></div></div>
  </div>
</section>
`, `<script src="/static/history.js"></script>`)
}
