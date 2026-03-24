// admin.js - 관리자 페이지
let adminPassword = '';
let allSubmissions = [];
let allReports = [];
let allToolsAdmin = [];
let settingsMap = {};

document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const pw = document.getElementById('admin-pw').value;
  try {
    const storedPw = await API.getSetting('admin_password');
    if (pw === storedPw) {
      adminPassword = pw;
      document.getElementById('login-screen').classList.add('hidden');
      document.getElementById('admin-dashboard').classList.remove('hidden');
      loadDashboard();
    } else { document.getElementById('login-error').classList.remove('hidden'); }
  } catch { Utils.toast('설정을 불러올 수 없습니다.', 'danger'); }
});

document.getElementById('btn-logout').addEventListener('click', () => {
  adminPassword = '';
  document.getElementById('admin-dashboard').classList.add('hidden');
  document.getElementById('login-screen').classList.remove('hidden');
  document.getElementById('admin-pw').value = '';
  document.getElementById('login-error').classList.add('hidden');
});

document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.admin-panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(tab.dataset.panel).classList.add('active');
  });
});

async function loadDashboard() {
  try {
    const [subsRes, reportsRes, toolsRes] = await Promise.all([
      API.getAll('submissions', { limit: 500 }),
      API.getAll('reports', { limit: 500 }),
      API.getAll('tools', { limit: 500 })
    ]);
    settingsMap = await API.getSettings();
    allSubmissions = subsRes.data || [];
    allReports = reportsRes.data || [];
    allToolsAdmin = toolsRes.data || [];
    document.getElementById('stat-subs').textContent = allSubmissions.length;
    document.getElementById('stat-reports').textContent = allReports.length;
    document.getElementById('stat-tools').textContent = allToolsAdmin.filter(t => t.is_active !== 0).length;
    document.getElementById('stat-comments').textContent = allReports.filter(r => r.coach_comment).length;
    renderSubmissions(); renderComments(); renderToolsAdmin(); loadSettingsUI();
  } catch (err) { console.error(err); Utils.toast('데이터를 불러올 수 없습니다.', 'danger'); }
}

function renderSubmissions() {
  const tbody = document.getElementById('subs-tbody');
  const empty = document.getElementById('subs-empty');
  if (allSubmissions.length === 0) { tbody.closest('.table-wrap').classList.add('hidden'); empty.classList.remove('hidden'); return; }
  tbody.closest('.table-wrap').classList.remove('hidden'); empty.classList.add('hidden');
  const sorted = [...allSubmissions].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  tbody.innerHTML = sorted.map(sub => {
    const report = allReports.find(r => r.submission_id === sub.id);
    return `<tr><td class="text-sm">${Utils.formatDateTime(sub.created_at)}</td><td class="fw-semi">${Utils.escapeHTML(sub.name || '-')}</td><td class="text-sm">${Utils.escapeHTML(sub.organization || '')} / ${Utils.escapeHTML(sub.department || '')}</td><td class="text-sm" style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${Utils.escapeHTML(sub.automation_request || '')}">${Utils.escapeHTML(sub.automation_request || '-')}</td><td>${Utils.statusBadge(sub.status)}</td><td>${report ? `<a href="/result?id=${report.id}" target="_blank" class="btn btn-sm btn-ghost"><i class="fas fa-external-link-alt"></i></a>` : '-'}</td></tr>`;
  }).join('');
}

function renderComments() {
  const list = document.getElementById('comments-list');
  const empty = document.getElementById('comments-empty');
  if (allReports.length === 0) { list.classList.add('hidden'); empty.classList.remove('hidden'); return; }
  list.classList.remove('hidden'); empty.classList.add('hidden');
  const sorted = [...allReports].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  list.innerHTML = sorted.map(report => {
    const sub = allSubmissions.find(s => s.id === report.submission_id) || {};
    return `<div class="card mb-2"><div class="card-body" style="padding:1rem 1.25rem"><div style="display:flex;justify-content:space-between;align-items:flex-start;gap:1rem;flex-wrap:wrap"><div style="flex:1;min-width:200px"><div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.35rem"><span class="fw-semi">${Utils.escapeHTML(sub.name || '알 수 없음')}</span><span class="text-sub text-sm">${Utils.escapeHTML(sub.organization || '')} / ${Utils.escapeHTML(sub.department || '')}</span><span class="text-sub text-sm">| ${Utils.formatDateTime(report.created_at)}</span></div><div class="text-sub text-sm mb-1" style="display:-webkit-box;-webkit-line-clamp:1;-webkit-box-orient:vertical;overflow:hidden">요청: ${Utils.escapeHTML(sub.automation_request || '-')}</div><div class="text-sm" style="padding:0.5rem;background:var(--border-light);border-radius:var(--radius);margin-top:0.5rem;border-left:3px solid var(--primary)">${report.coach_comment ? Utils.escapeHTML(report.coach_comment) : '<span class="text-sub">코멘트 없음</span>'}</div>${report.coach_comment_by ? `<div class="text-sub" style="font-size:0.75rem;margin-top:0.25rem">— ${Utils.escapeHTML(report.coach_comment_by)}</div>` : ''}</div><button class="btn btn-sm btn-outline" onclick="openCommentModal('${report.id}')"><i class="fas fa-edit"></i> 수정</button></div></div></div>`;
  }).join('');
}

window.openCommentModal = function(reportId) {
  const report = allReports.find(r => r.id === reportId);
  const sub = allSubmissions.find(s => s.id === report?.submission_id) || {};
  document.getElementById('cm-report-id').value = reportId;
  document.getElementById('cm-comment').value = report?.coach_comment || '';
  document.getElementById('comment-context').innerHTML = `<div class="alert alert-info" style="margin:0"><i class="fas fa-user"></i><div><strong>${Utils.escapeHTML(sub.name || '-')}</strong> (${Utils.escapeHTML(sub.organization || '')})<div class="text-sm mt-1">${Utils.escapeHTML(sub.automation_request || '-')}</div></div></div>`;
  document.getElementById('comment-modal').classList.add('show');
};

document.getElementById('comment-modal-save').addEventListener('click', async () => {
  const reportId = document.getElementById('cm-report-id').value;
  const comment = document.getElementById('cm-comment').value.trim();
  const coachName = settingsMap.coach_name || '오원석 박사';
  try {
    await API.patch('reports', reportId, { coach_comment: comment, coach_comment_by: coachName, coach_comment_at: new Date().toISOString() });
    const idx = allReports.findIndex(r => r.id === reportId);
    if (idx >= 0) { allReports[idx].coach_comment = comment; allReports[idx].coach_comment_by = coachName; }
    renderComments();
    document.getElementById('stat-comments').textContent = allReports.filter(r => r.coach_comment).length;
    closeModal('comment-modal');
    Utils.toast('코치 코멘트가 저장되었습니다.', 'success');
  } catch (err) { Utils.toast('저장 실패: ' + err.message, 'danger'); }
});

function renderToolsAdmin() {
  const tbody = document.getElementById('tools-tbody');
  const sorted = [...allToolsAdmin].sort((a, b) => (a.name || '').localeCompare(b.name || '', 'ko'));
  tbody.innerHTML = sorted.map(t => `<tr><td class="fw-semi">${Utils.escapeHTML(t.name)}</td><td><span class="badge badge-category">${t.category}</span></td><td>${Utils.difficultyBadge(t.difficulty)}</td><td>${Utils.pricingBadge(t.pricing_type)}</td><td>${Utils.starsHTML(t.rating || 0)}</td><td>${t.is_active !== 0 ? '<span class="text-success text-sm fw-semi">활성</span>' : '<span class="text-sub text-sm">비활성</span>'}</td><td><button class="btn btn-sm btn-ghost" onclick="editTool('${t.id}')"><i class="fas fa-edit"></i></button><button class="btn btn-sm btn-ghost text-danger" onclick="deleteTool('${t.id}','${Utils.escapeHTML(t.name).replace(/'/g,"\\'")}')"><i class="fas fa-trash"></i></button></td></tr>`).join('');
}

document.getElementById('btn-add-tool').addEventListener('click', () => {
  document.getElementById('tool-modal-title').textContent = '새 도구 추가';
  document.getElementById('tool-form').reset();
  document.getElementById('tf-id').value = '';
  document.getElementById('tool-modal').classList.add('show');
});

window.editTool = function(id) {
  const t = allToolsAdmin.find(x => x.id === id);
  if (!t) return;
  document.getElementById('tool-modal-title').textContent = '도구 수정';
  document.getElementById('tf-id').value = t.id;
  document.getElementById('tf-name').value = t.name || '';
  document.getElementById('tf-category').value = t.category || '';
  document.getElementById('tf-subcategory').value = t.subcategory || '';
  document.getElementById('tf-url').value = t.website_url || '';
  document.getElementById('tf-desc').value = t.description || '';
  document.getElementById('tf-difficulty').value = t.difficulty || 'beginner';
  document.getElementById('tf-pricing').value = t.pricing_type || 'freemium';
  document.getElementById('tf-pricing-detail').value = t.pricing_detail || '';
  document.getElementById('tf-rating').value = t.rating || 4.0;
  document.getElementById('tf-automation').value = t.automation_level || 'semi';
  document.getElementById('tf-popularity').value = t.popularity || 70;
  document.getElementById('tf-usecases').value = pArr(t.use_cases).join(', ');
  document.getElementById('tf-keywords').value = pArr(t.keywords).join(', ');
  document.getElementById('tool-modal').classList.add('show');
};

document.getElementById('tool-modal-save').addEventListener('click', async () => {
  const name = document.getElementById('tf-name').value.trim();
  const category = document.getElementById('tf-category').value;
  if (!name || !category) { Utils.toast('도구명과 카테고리는 필수입니다.', 'warning'); return; }
  const data = {
    name, category,
    subcategory: document.getElementById('tf-subcategory').value.trim(),
    website_url: document.getElementById('tf-url').value.trim(),
    description: document.getElementById('tf-desc').value.trim(),
    difficulty: document.getElementById('tf-difficulty').value,
    pricing_type: document.getElementById('tf-pricing').value,
    pricing_detail: document.getElementById('tf-pricing-detail').value.trim(),
    rating: parseFloat(document.getElementById('tf-rating').value) || 4.0,
    automation_level: document.getElementById('tf-automation').value,
    popularity: parseInt(document.getElementById('tf-popularity').value) || 70,
    use_cases: JSON.stringify(document.getElementById('tf-usecases').value.split(',').map(s => s.trim()).filter(Boolean)),
    keywords: JSON.stringify(document.getElementById('tf-keywords').value.split(',').map(s => s.trim()).filter(Boolean)),
    is_active: 1
  };
  const existingId = document.getElementById('tf-id').value;
  try {
    if (existingId) {
      await API.update('tools', existingId, { ...data, id: existingId });
      Utils.toast('도구가 수정되었습니다.', 'success');
    } else {
      data.id = 'tool-' + String(Date.now()).slice(-6);
      await API.create('tools', data);
      Utils.toast('새 도구가 추가되었습니다.', 'success');
    }
    closeModal('tool-modal');
    const res = await API.getAll('tools', { limit: 500 });
    allToolsAdmin = res.data || [];
    renderToolsAdmin();
    document.getElementById('stat-tools').textContent = allToolsAdmin.filter(t => t.is_active !== 0).length;
  } catch (err) { Utils.toast('저장 실패: ' + err.message, 'danger'); }
});

window.deleteTool = async function(id, name) {
  if (!confirm(`"${name}" 도구를 삭제하시겠습니까?`)) return;
  try {
    await API.remove('tools', id);
    allToolsAdmin = allToolsAdmin.filter(t => t.id !== id);
    renderToolsAdmin();
    document.getElementById('stat-tools').textContent = allToolsAdmin.filter(t => t.is_active !== 0).length;
    Utils.toast('도구가 삭제되었습니다.', 'success');
  } catch (err) { Utils.toast('삭제 실패: ' + err.message, 'danger'); }
};

function loadSettingsUI() {
  document.getElementById('set-api-key').value = settingsMap.openrouter_api_key || '';
  document.getElementById('set-coach-name').value = settingsMap.coach_name || '';
  document.getElementById('set-coach-title').value = settingsMap.coach_title || '';
}

document.getElementById('btn-save-api').addEventListener('click', async () => {
  const apiKeyVal = document.getElementById('set-api-key').value.trim();
  if (!apiKeyVal) { Utils.toast('API 키를 입력해주세요.', 'warning'); return; }
  try { await saveSetting('openrouter_api_key', apiKeyVal); API.clearSettingsCache(); Utils.toast('API 설정이 저장되었습니다. ✅', 'success'); }
  catch(err) { Utils.toast('저장 실패: ' + err.message, 'danger'); }
});

document.getElementById('btn-save-coach').addEventListener('click', async () => {
  try { await saveSetting('coach_name', document.getElementById('set-coach-name').value.trim()); await saveSetting('coach_title', document.getElementById('set-coach-title').value.trim()); Utils.toast('코치 정보가 저장되었습니다.', 'success'); }
  catch { Utils.toast('저장 실패', 'danger'); }
});

document.getElementById('btn-save-pw').addEventListener('click', async () => {
  const pw1 = document.getElementById('set-new-pw').value;
  const pw2 = document.getElementById('set-new-pw2').value;
  if (!pw1 || pw1.length < 4) { Utils.toast('4자리 이상 비밀번호를 입력하세요.', 'warning'); return; }
  if (pw1 !== pw2) { Utils.toast('비밀번호가 일치하지 않습니다.', 'warning'); return; }
  try { await saveSetting('admin_password', pw1); adminPassword = pw1; document.getElementById('set-new-pw').value = ''; document.getElementById('set-new-pw2').value = ''; Utils.toast('비밀번호가 변경되었습니다.', 'success'); }
  catch { Utils.toast('저장 실패', 'danger'); }
});

async function saveSetting(key, value) {
  const res = await API.getAll('settings', { limit: 100 });
  const existing = (res.data || []).find(s => s.setting_key === key);
  if (existing) { await API.patch('settings', existing.id, { setting_value: value }); }
  else { await API.create('settings', { id: key, setting_key: key, setting_value: value, description: key }); }
  settingsMap[key] = value;
  API.clearSettingsCache();
}

function closeModal(id) { document.getElementById(id).classList.remove('show'); }
function pArr(str) { try { return JSON.parse(str) || []; } catch { return []; } }

['comment-modal-close','comment-modal-cancel'].forEach(id => document.getElementById(id).addEventListener('click', () => closeModal('comment-modal')));
['tool-modal-close','tool-modal-cancel'].forEach(id => document.getElementById(id).addEventListener('click', () => closeModal('tool-modal')));
['tool-modal','comment-modal'].forEach(id => document.getElementById(id).addEventListener('click', (e) => { if (e.target.classList.contains('modal-backdrop')) closeModal(id); }));
