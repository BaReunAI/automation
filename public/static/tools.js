// tools.js - AI 도구 목록 페이지
let allTools = [];
let currentCategory = '전체';
const categories = ['전체','개발','고객서비스','데이터분석','리서치','마케팅','문서작성','업무자동화','영상생성','영상편집','음성입력','이미지생성','일정관리','회의'];

document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const paramCat = urlParams.get('category');
  if (paramCat && categories.includes(paramCat)) currentCategory = paramCat;

  const filterGroup = document.getElementById('filter-group');
  filterGroup.innerHTML = categories.map(c => `<button class="filter-btn${c === currentCategory ? ' active' : ''}" data-category="${c}">${c}</button>`).join('');
  filterGroup.addEventListener('click', (e) => {
    if (e.target.classList.contains('filter-btn')) {
      currentCategory = e.target.dataset.category;
      filterGroup.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      renderTools();
    }
  });
  document.getElementById('search-input').addEventListener('input', () => renderTools());

  try {
    const res = await API.getAll('tools', { limit: 200 });
    allTools = (res.data || []).filter(t => t.is_active !== 0);
    allTools.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
    renderTools();
  } catch (err) { console.error(err); Utils.toast('도구 목록을 불러올 수 없습니다.', 'danger'); }
});

function renderTools() {
  const query = document.getElementById('search-input').value.toLowerCase().trim();
  let filtered = allTools;
  if (currentCategory !== '전체') filtered = filtered.filter(t => t.category === currentCategory);
  if (query) filtered = filtered.filter(t => `${t.name} ${t.category} ${t.subcategory} ${t.description} ${t.keywords}`.toLowerCase().includes(query));

  document.getElementById('tools-count').textContent = `총 ${filtered.length}개 도구`;
  const grid = document.getElementById('tools-grid');
  const empty = document.getElementById('empty-state');

  if (filtered.length === 0) { grid.classList.add('hidden'); empty.classList.remove('hidden'); return; }
  grid.classList.remove('hidden'); empty.classList.add('hidden');

  grid.innerHTML = filtered.map(tool => {
    const useCases = parseJSONSafe(tool.use_cases);
    return `<div class="card"><div class="card-body">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.75rem">
        <div style="display:flex;align-items:center;gap:0.5rem">
          <div style="width:36px;height:36px;background:rgba(124,58,237,0.08);border-radius:10px;display:flex;align-items:center;justify-content:center"><i class="fas ${Utils.categoryIcon(tool.category)}" style="color:var(--primary);font-size:0.9rem"></i></div>
          <div><h4 style="font-size:1rem;margin-bottom:0">${Utils.escapeHTML(tool.name)}</h4><span class="badge badge-category" style="font-size:0.65rem">${tool.category}</span></div>
        </div>${Utils.pricingBadge(tool.pricing_type)}
      </div>
      <p class="text-sub text-sm" style="margin-bottom:0.75rem;line-height:1.5">${Utils.escapeHTML(tool.description)}</p>
      ${useCases.length ? `<div style="display:flex;flex-wrap:wrap;gap:0.3rem;margin-bottom:0.75rem">${useCases.slice(0,3).map(uc => `<span style="font-size:0.7rem;padding:0.15rem 0.5rem;background:var(--border-light);border-radius:var(--radius-full);color:var(--text-sub)">${uc}</span>`).join('')}${useCases.length > 3 ? `<span style="font-size:0.7rem;padding:0.15rem 0.5rem;color:var(--text-light)">+${useCases.length-3}개</span>` : ''}</div>` : ''}
      <div style="display:flex;align-items:center;justify-content:space-between">
        <div style="display:flex;align-items:center;gap:0.5rem">${Utils.starsHTML(tool.rating || 0)}${Utils.difficultyBadge(tool.difficulty)}</div>
        ${tool.website_url ? `<a href="${tool.website_url}" target="_blank" rel="noopener" class="btn btn-sm btn-ghost" style="font-size:0.8rem"><i class="fas fa-external-link-alt"></i> 방문</a>` : ''}
      </div>
      ${tool.pricing_detail ? `<div class="text-sub" style="font-size:0.75rem;margin-top:0.5rem">💰 ${Utils.escapeHTML(tool.pricing_detail)}</div>` : ''}
    </div></div>`;
  }).join('');
}
function parseJSONSafe(str) { try { return JSON.parse(str); } catch { return []; } }
