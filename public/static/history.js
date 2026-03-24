// history.js - 이력 조회 페이지
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('history-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('h-email').value.trim();
    const password = document.getElementById('h-password').value;
    if (!Utils.isEmail(email) || !password) { Utils.toast('이메일과 비밀번호를 입력해주세요.', 'warning'); return; }
    const btn = document.getElementById('btn-search');
    btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 조회 중...';
    try {
      const passwordHash = await Utils.sha256(password);
      const subRes = await API.getAll('submissions', { search: email, limit: 100 });
      const submissions = (subRes.data || []).filter(s => s.email === email && s.password_hash === passwordHash);
      if (submissions.length === 0) {
        document.getElementById('history-results').classList.add('hidden');
        document.getElementById('history-empty').classList.remove('hidden');
        btn.disabled = false; btn.innerHTML = '<i class="fas fa-search"></i> 이력 조회'; return;
      }
      const reportsRes = await API.getAll('reports', { limit: 200 });
      const reports = reportsRes.data || [];
      const results = submissions.map(sub => { const report = reports.find(r => r.submission_id === sub.id); return { ...sub, report }; }).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      document.getElementById('history-empty').classList.add('hidden');
      document.getElementById('history-results').classList.remove('hidden');
      document.getElementById('result-count').textContent = `총 ${results.length}건`;
      document.getElementById('history-list').innerHTML = results.map(item => `
        <div class="card mb-2"><div class="card-body" style="padding:1rem 1.25rem">
          <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:0.5rem">
            <div style="flex:1;min-width:200px">
              <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.35rem">${Utils.statusBadge(item.status)}<span class="text-sub text-sm">${Utils.formatDateTime(item.created_at)}</span></div>
              <div class="fw-semi text-sm" style="margin-bottom:0.25rem">${Utils.escapeHTML(item.organization)} · ${Utils.escapeHTML(item.department)}</div>
              <div class="text-sub text-sm" style="display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">${Utils.escapeHTML(item.automation_request || item.job_description)}</div>
            </div>
            <div>${item.report ? `<a href="/result?id=${item.report.id}" class="btn btn-sm btn-primary"><i class="fas fa-file-alt"></i> 보고서 보기</a>` : `<span class="text-sub text-sm">보고서 준비중</span>`}</div>
          </div>
        </div></div>
      `).join('');
    } catch (err) { console.error(err); Utils.toast('이력 조회에 실패했습니다.', 'danger'); }
    btn.disabled = false; btn.innerHTML = '<i class="fas fa-search"></i> 이력 조회';
  });
});
