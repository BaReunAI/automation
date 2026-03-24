import { layout } from './layout'

export function adminPage(): string {
  return layout('관리자', 'admin', `<style>
.admin-panel{display:none}.admin-panel.active{display:block}
.stat-card{text-align:center;padding:1.5rem}
.stat-num{font-size:2rem;font-weight:700;color:var(--primary)}
.stat-label{font-size:0.85rem;color:var(--text-sub);margin-top:0.25rem}
.tool-form-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.75rem}
@media(max-width:768px){.tool-form-grid{grid-template-columns:1fr}}
</style>`, `
<div id="login-screen">
  <section class="section" style="min-height:60vh;display:flex;align-items:center">
    <div class="container" style="max-width:400px"><div class="card"><div class="card-body" style="padding:2rem;text-align:center">
      <div style="width:64px;height:64px;background:var(--gradient);border-radius:16px;display:inline-flex;align-items:center;justify-content:center;margin-bottom:1rem"><i class="fas fa-lock" style="font-size:1.5rem;color:white"></i></div>
      <h2 style="font-size:1.25rem;margin-bottom:0.5rem">관리자 로그인</h2>
      <p class="text-sub text-sm mb-3">관리자 비밀번호를 입력하세요</p>
      <form id="login-form"><div class="form-group"><input type="password" class="form-input" id="admin-pw" placeholder="비밀번호" style="text-align:center" autofocus></div><button type="submit" class="btn btn-primary btn-block"><i class="fas fa-sign-in-alt"></i> 로그인</button></form>
      <div id="login-error" class="text-danger text-sm mt-1 hidden">비밀번호가 올바르지 않습니다</div>
    </div></div></div>
  </section>
</div>

<div id="admin-dashboard" class="hidden">
  <section class="hero" style="padding:2rem 0"><div class="container"><div style="display:flex;align-items:center;justify-content:space-between;position:relative"><div><h1 style="font-size:1.75rem">⚙️ 관리자 대시보드</h1><p>AI워크코치 서비스 관리</p></div><button class="btn btn-sm" style="background:rgba(255,255,255,0.15);color:white;border:1px solid rgba(255,255,255,0.3)" id="btn-logout"><i class="fas fa-sign-out-alt"></i> 로그아웃</button></div></div></section>

  <section class="section" style="padding-top:1.5rem"><div class="container">
    <div class="grid grid-4 mb-4">
      <div class="card"><div class="stat-card"><div class="stat-num" id="stat-subs">-</div><div class="stat-label">총 제출 건수</div></div></div>
      <div class="card"><div class="stat-card"><div class="stat-num" id="stat-reports" style="color:var(--success)">-</div><div class="stat-label">완료된 보고서</div></div></div>
      <div class="card"><div class="stat-card"><div class="stat-num" id="stat-tools" style="color:var(--accent)">-</div><div class="stat-label">등록된 AI 도구</div></div></div>
      <div class="card"><div class="stat-card"><div class="stat-num" id="stat-comments" style="color:var(--warning)">-</div><div class="stat-label">코치 코멘트</div></div></div>
    </div>

    <div class="tabs">
      <button class="tab active" data-panel="panel-submissions"><i class="fas fa-inbox"></i> 제출 이력</button>
      <button class="tab" data-panel="panel-comments"><i class="fas fa-comment-dots"></i> 코치 코멘트</button>
      <button class="tab" data-panel="panel-tools"><i class="fas fa-tools"></i> 도구 관리</button>
      <button class="tab" data-panel="panel-settings"><i class="fas fa-cog"></i> 설정</button>
    </div>

    <div class="admin-panel active" id="panel-submissions">
      <div class="table-wrap"><table><thead><tr><th>날짜</th><th>이름</th><th>조직/부서</th><th>요청 요약</th><th>상태</th><th>보고서</th></tr></thead><tbody id="subs-tbody"></tbody></table></div>
      <div class="empty-state hidden" id="subs-empty"><i class="fas fa-inbox"></i><p>제출 이력이 없습니다</p></div>
    </div>

    <div class="admin-panel" id="panel-comments">
      <div class="alert alert-info mb-3"><i class="fas fa-info-circle"></i><span>보고서에 대한 코치 코멘트를 작성하거나 수정할 수 있습니다.</span></div>
      <div id="comments-list"></div>
      <div class="empty-state hidden" id="comments-empty"><i class="fas fa-comment-slash"></i><p>보고서가 없습니다</p></div>
    </div>

    <div class="admin-panel" id="panel-tools">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem"><h3 style="font-size:1rem">AI 도구 목록</h3><button class="btn btn-sm btn-primary" id="btn-add-tool"><i class="fas fa-plus"></i> 새 도구 추가</button></div>
      <div class="table-wrap"><table><thead><tr><th>도구명</th><th>카테고리</th><th>난이도</th><th>가격</th><th>평점</th><th>상태</th><th>관리</th></tr></thead><tbody id="tools-tbody"></tbody></table></div>
    </div>

    <div class="admin-panel" id="panel-settings">
      <div class="grid grid-2" style="gap:1.5rem">
        <div class="card"><div class="card-body">
          <h3 style="font-size:1.05rem;margin-bottom:1rem"><i class="fas fa-key" style="color:var(--primary);margin-right:0.5rem"></i>API 키 설정</h3>
          <div class="form-group"><label class="form-label">OpenAI API Key</label><input type="password" class="form-input" id="set-api-key" placeholder="sk-proj-..."><div class="form-hint">platform.openai.com에서 발급한 OpenAI API 키</div></div>
          <button class="btn btn-sm btn-primary" id="btn-save-api"><i class="fas fa-save"></i> API 설정 저장</button>
        </div></div>
        <div class="card"><div class="card-body">
          <h3 style="font-size:1.05rem;margin-bottom:1rem"><i class="fas fa-user-tie" style="color:var(--success);margin-right:0.5rem"></i>코치 정보</h3>
          <div class="form-group"><label class="form-label">코치 이름</label><input type="text" class="form-input" id="set-coach-name" placeholder="오원석 박사"></div>
          <div class="form-group"><label class="form-label">코치 직함</label><input type="text" class="form-input" id="set-coach-title" placeholder="바른AI 대표"></div>
          <button class="btn btn-sm btn-primary" id="btn-save-coach"><i class="fas fa-save"></i> 코치 정보 저장</button>
        </div></div>
        <div class="card"><div class="card-body">
          <h3 style="font-size:1.05rem;margin-bottom:1rem"><i class="fas fa-lock" style="color:var(--danger);margin-right:0.5rem"></i>관리자 비밀번호 변경</h3>
          <div class="form-group"><label class="form-label">새 비밀번호</label><input type="password" class="form-input" id="set-new-pw" placeholder="새 비밀번호 입력"></div>
          <div class="form-group"><label class="form-label">비밀번호 확인</label><input type="password" class="form-input" id="set-new-pw2" placeholder="비밀번호 재입력"></div>
          <button class="btn btn-sm btn-danger" id="btn-save-pw"><i class="fas fa-save"></i> 비밀번호 변경</button>
        </div></div>
      </div>
    </div>
  </div></section>
</div>

<!-- 도구 모달 -->
<div class="modal-backdrop" id="tool-modal"><div class="modal" style="max-width:650px">
  <div class="modal-header"><h3 id="tool-modal-title">새 도구 추가</h3><button class="modal-close" id="tool-modal-close">&times;</button></div>
  <div class="modal-body"><form id="tool-form"><input type="hidden" id="tf-id">
    <div class="tool-form-grid">
      <div class="form-group"><label class="form-label">도구명 *</label><input type="text" class="form-input" id="tf-name" required></div>
      <div class="form-group"><label class="form-label">카테고리 *</label><select class="form-select" id="tf-category" required><option value="">선택</option><option>개발</option><option>고객서비스</option><option>데이터분석</option><option>리서치</option><option>마케팅</option><option>문서작성</option><option>업무자동화</option><option>영상생성</option><option>영상편집</option><option>음성입력</option><option>이미지생성</option><option>일정관리</option><option>회의</option></select></div>
      <div class="form-group"><label class="form-label">세부 카테고리</label><input type="text" class="form-input" id="tf-subcategory"></div>
      <div class="form-group"><label class="form-label">웹사이트 URL</label><input type="url" class="form-input" id="tf-url" placeholder="https://..."></div>
      <div class="form-group" style="grid-column:1/-1"><label class="form-label">설명</label><textarea class="form-textarea" id="tf-desc" rows="2"></textarea></div>
      <div class="form-group"><label class="form-label">난이도</label><select class="form-select" id="tf-difficulty"><option value="beginner">초급</option><option value="intermediate">중급</option><option value="advanced">고급</option></select></div>
      <div class="form-group"><label class="form-label">가격 유형</label><select class="form-select" id="tf-pricing"><option value="free">무료</option><option value="freemium">부분무료</option><option value="paid">유료</option></select></div>
      <div class="form-group"><label class="form-label">가격 상세</label><input type="text" class="form-input" id="tf-pricing-detail" placeholder="예) 무료 / Pro $20/월"></div>
      <div class="form-group"><label class="form-label">평점 (1~5)</label><input type="number" class="form-input" id="tf-rating" min="1" max="5" step="0.1" value="4.0"></div>
      <div class="form-group"><label class="form-label">자동화 수준</label><select class="form-select" id="tf-automation"><option value="semi">반자동</option><option value="full">완전자동</option></select></div>
      <div class="form-group"><label class="form-label">인기도 (1~100)</label><input type="number" class="form-input" id="tf-popularity" min="1" max="100" value="70"></div>
      <div class="form-group" style="grid-column:1/-1"><label class="form-label">활용 사례 (쉼표 구분)</label><input type="text" class="form-input" id="tf-usecases" placeholder="보고서 작성, 이메일 초안, 번역"></div>
      <div class="form-group" style="grid-column:1/-1"><label class="form-label">키워드 (쉼표 구분)</label><input type="text" class="form-input" id="tf-keywords" placeholder="AI, 문서, 자동화"></div>
    </div>
  </form></div>
  <div class="modal-footer"><button class="btn btn-ghost" id="tool-modal-cancel">취소</button><button class="btn btn-primary" id="tool-modal-save"><i class="fas fa-save"></i> 저장</button></div>
</div></div>

<!-- 코멘트 모달 -->
<div class="modal-backdrop" id="comment-modal"><div class="modal">
  <div class="modal-header"><h3>코치 코멘트 수정</h3><button class="modal-close" id="comment-modal-close">&times;</button></div>
  <div class="modal-body"><div id="comment-context" class="mb-2"></div><div class="form-group"><label class="form-label">코치 코멘트</label><textarea class="form-textarea" id="cm-comment" rows="5" placeholder="맞춤형 코치 코멘트를 입력하세요..."></textarea></div><input type="hidden" id="cm-report-id"></div>
  <div class="modal-footer"><button class="btn btn-ghost" id="comment-modal-cancel">취소</button><button class="btn btn-primary" id="comment-modal-save"><i class="fas fa-save"></i> 저장</button></div>
</div></div>
`, `<script src="/static/admin.js"></script>`)
}
