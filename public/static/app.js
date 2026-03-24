/* ===================================
   AI워크코치 - API & Utility Module
   =================================== */

const API = {
  async getAll(table, params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`/api/tables/${table}${query ? '?' + query : ''}`);
    return res.json();
  },
  async getById(table, id) {
    const res = await fetch(`/api/tables/${table}/${id}`);
    return res.json();
  },
  async create(table, data) {
    const res = await fetch(`/api/tables/${table}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    return res.json();
  },
  async update(table, id, data) {
    const res = await fetch(`/api/tables/${table}/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    return res.json();
  },
  async patch(table, id, data) {
    const res = await fetch(`/api/tables/${table}/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    return res.json();
  },
  async remove(table, id) {
    await fetch(`/api/tables/${table}/${id}`, { method: 'DELETE' });
  },
  _settingsCache: null,
  _settingsCacheTime: 0,
  async _loadAllSettings() {
    const now = Date.now();
    if (this._settingsCache && (now - this._settingsCacheTime) < 30000) return this._settingsCache;
    try {
      const res = await this.getAll('settings', { limit: 100 });
      const map = {};
      (res.data || []).forEach(s => { if (s.setting_key) map[s.setting_key] = s.setting_value || ''; });
      this._settingsCache = map;
      this._settingsCacheTime = now;
      return map;
    } catch { return {}; }
  },
  async getSetting(key) { const all = await this._loadAllSettings(); return all[key] || ''; },
  async getSettings() { return await this._loadAllSettings(); },
  clearSettingsCache() { this._settingsCache = null; this._settingsCacheTime = 0; },
  async callAI(prompt, systemPrompt, engine = 'chatgpt') {
    const apiKey = await this.getSetting('openrouter_api_key');
    if (!apiKey || apiKey.trim() === '') throw new Error('API 키가 설정되지 않았습니다. 관리자 페이지 → 설정 탭에서 OpenAI API 키를 입력해주세요.');
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'gpt-4o-mini', messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: prompt }], temperature: 0.7, max_tokens: 8000 })
    });
    if (!res.ok) { const err = await res.json().catch(() => ({})); throw new Error(err.error?.message || `AI 호출 실패 (${res.status})`); }
    const data = await res.json();
    return data.choices?.[0]?.message?.content || '';
  }
};

const Utils = {
  uuid() { return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => { const r = Math.random() * 16 | 0; return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16); }); },
  async sha256(text) { const data = new TextEncoder().encode(text); const hash = await crypto.subtle.digest('SHA-256', data); return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join(''); },
  formatDate(ts) { if (!ts) return '-'; const d = new Date(ts); return d.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }); },
  formatDateTime(ts) { if (!ts) return '-'; const d = new Date(ts); return d.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }); },
  starsHTML(rating) { const full = Math.floor(rating); const half = rating % 1 >= 0.5 ? 1 : 0; const empty = 5 - full - half; let html = ''; for (let i = 0; i < full; i++) html += '<i class="fas fa-star"></i>'; if (half) html += '<i class="fas fa-star-half-alt"></i>'; for (let i = 0; i < empty; i++) html += '<i class="far fa-star empty"></i>'; return `<span class="stars">${html} <small>${rating}</small></span>`; },
  pricingBadge(type) { const map = { free: { label: '무료', cls: 'badge-free' }, freemium: { label: '부분무료', cls: 'badge-freemium' }, paid: { label: '유료', cls: 'badge-paid' } }; const info = map[type] || map.freemium; return `<span class="badge ${info.cls}">${info.label}</span>`; },
  difficultyBadge(level) { const map = { beginner: { label: '초급', cls: 'badge-beginner' }, intermediate: { label: '중급', cls: 'badge-intermediate' }, advanced: { label: '고급', cls: 'badge-advanced' } }; const info = map[level] || map.beginner; return `<span class="badge ${info.cls}">${info.label}</span>`; },
  statusBadge(status) { const map = { pending: { label: '대기중', cls: 'badge-status-pending' }, analyzing: { label: '분석중', cls: 'badge-status-analyzing' }, completed: { label: '완료', cls: 'badge-status-completed' }, failed: { label: '실패', cls: 'badge-status-failed' } }; const info = map[status] || map.pending; return `<span class="badge ${info.cls}">${info.label}</span>`; },
  toast(message, type = 'info') { const el = document.createElement('div'); el.className = `alert alert-${type}`; el.style.cssText = 'position:fixed;top:1rem;right:1rem;z-index:9999;max-width:400px;animation:slideIn .3s ease;'; el.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : type === 'danger' ? 'exclamation-circle' : 'info-circle'}"></i><span>${message}</span>`; document.body.appendChild(el); setTimeout(() => { el.style.opacity = '0'; setTimeout(() => el.remove(), 300); }, 3500); },
  showLoading(steps = []) { let overlay = document.getElementById('loading-overlay'); if (!overlay) { overlay = document.createElement('div'); overlay.id = 'loading-overlay'; overlay.className = 'loading-overlay'; document.body.appendChild(overlay); } overlay.innerHTML = `<div class="loading-spinner"></div><div class="loading-steps" id="loading-steps">${steps.map((s, i) => `<div class="loading-step${i === 0 ? ' active' : ''}" data-step="${i}">${s}</div>`).join('')}</div>`; overlay.style.display = 'flex'; return { setStep(index) { const allSteps = overlay.querySelectorAll('.loading-step'); allSteps.forEach((el, i) => { el.classList.remove('active', 'done'); if (i < index) el.classList.add('done'); if (i === index) el.classList.add('active'); }); }, hide() { overlay.style.display = 'none'; } }; },
  isEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); },
  parseJSON(str) { try { const match = str.match(/```json\s*([\s\S]*?)\s*```/); if (match) return JSON.parse(match[1]); return JSON.parse(str); } catch { const match2 = str.match(/\{[\s\S]*\}/); if (match2) { try { return JSON.parse(match2[0]); } catch { return null; } } return null; } },
  escapeHTML(str) { if (!str) return ''; const div = document.createElement('div'); div.textContent = str; return div.innerHTML; },
  categoryIcon(cat) { const map = { '개발': 'fa-code', '고객서비스': 'fa-headset', '데이터분석': 'fa-chart-bar', '리서치': 'fa-search', '마케팅': 'fa-bullhorn', '문서작성': 'fa-file-alt', '업무자동화': 'fa-robot', '영상생성': 'fa-video', '영상편집': 'fa-film', '음성입력': 'fa-microphone', '이미지생성': 'fa-image', '일정관리': 'fa-calendar-alt', '회의': 'fa-users' }; return map[cat] || 'fa-cube'; }
};

// Navbar Toggle
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.navbar-toggle');
  const nav = document.querySelector('.navbar-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => nav.classList.toggle('show'));
    document.addEventListener('click', (e) => { if (!e.target.closest('.navbar')) nav.classList.remove('show'); });
  }
});

// CSS Animation
const _style = document.createElement('style');
_style.textContent = `@keyframes slideIn{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}`;
document.head.appendChild(_style);
