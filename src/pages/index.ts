import { layout } from './layout'

export function indexPage(): string {
  return layout('AI가 분석하고, 코치가 안내하는 업무 자동화', 'home', '', `
<!-- Hero -->
<section class="hero">
  <div class="container">
    <h1>🤖 AI가 분석하고, 코치가 안내하는<br>업무 자동화</h1>
    <p>반복적인 업무를 입력하면, AI가 최적의 도구와 자동화 전략을 추천합니다.<br>전문 코치의 맞춤형 조언으로 스마트워크를 시작하세요.</p>
    <div style="display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;position:relative">
      <a href="/submit" class="btn btn-white btn-lg"><i class="fas fa-paper-plane"></i> 지금 시작하기</a>
      <a href="/tools" class="btn btn-lg" style="background:rgba(255,255,255,0.15);color:white;border:2px solid rgba(255,255,255,0.3)"><i class="fas fa-th-large"></i> AI 도구 둘러보기</a>
    </div>
  </div>
</section>

<!-- Features -->
<section class="section">
  <div class="container">
    <h2 class="section-title">핵심 기능</h2>
    <p class="section-desc">AI 분석부터 전문 코칭까지, 업무 자동화의 모든 것을 한 곳에서</p>
    <div class="grid grid-3">
      <div class="card"><div class="card-body" style="text-align:center;padding:2rem">
        <div style="width:64px;height:64px;background:linear-gradient(135deg,#7C3AED,#A78BFA);border-radius:16px;display:inline-flex;align-items:center;justify-content:center;margin-bottom:1rem"><i class="fas fa-magic" style="font-size:1.5rem;color:white"></i></div>
        <h3 style="font-size:1.15rem;margin-bottom:0.5rem">AI 도구 자동 추천</h3>
        <p class="text-sub text-sm">업무 내용을 AI가 분석하여 최적의 AI 도구를 자동으로 매칭합니다. 수십 개의 도구 중 당신에게 딱 맞는 도구를 찾아드려요.</p>
      </div></div>
      <div class="card"><div class="card-body" style="text-align:center;padding:2rem">
        <div style="width:64px;height:64px;background:linear-gradient(135deg,#3B82F6,#60A5FA);border-radius:16px;display:inline-flex;align-items:center;justify-content:center;margin-bottom:1rem"><i class="fas fa-file-alt" style="font-size:1.5rem;color:white"></i></div>
        <h3 style="font-size:1.15rem;margin-bottom:0.5rem">자가진단 보고서</h3>
        <p class="text-sub text-sm">업무 분석 결과를 PDF 보고서로 제공합니다. 시간 절감 예측, 자동화 전략, 학습 로드맵까지 한눈에 확인하세요.</p>
      </div></div>
      <div class="card"><div class="card-body" style="text-align:center;padding:2rem">
        <div style="width:64px;height:64px;background:linear-gradient(135deg,#10B981,#34D399);border-radius:16px;display:inline-flex;align-items:center;justify-content:center;margin-bottom:1rem"><i class="fas fa-user-tie" style="font-size:1.5rem;color:white"></i></div>
        <h3 style="font-size:1.15rem;margin-bottom:0.5rem">코치 코멘트</h3>
        <p class="text-sub text-sm">전문 코치의 맞춤형 조언과 학습 우선순위를 제공합니다. AI 분석에 사람의 통찰을 더해 실질적인 가이드를 드립니다.</p>
      </div></div>
    </div>
  </div>
</section>

<!-- How It Works -->
<section class="section" style="background:white">
  <div class="container">
    <h2 class="section-title">이용 방법</h2>
    <p class="section-desc">4단계로 간단하게 업무 자동화를 시작하세요</p>
    <div class="grid grid-4">
      <div style="text-align:center;padding:1rem"><div style="width:56px;height:56px;background:var(--gradient);border-radius:50%;display:inline-flex;align-items:center;justify-content:center;color:white;font-size:1.25rem;font-weight:700;margin-bottom:1rem">1</div><h4 style="font-size:1rem;margin-bottom:0.35rem">업무 입력</h4><p class="text-sub text-sm">자동화하고 싶은<br>반복 업무를 입력합니다</p></div>
      <div style="text-align:center;padding:1rem"><div style="width:56px;height:56px;background:var(--gradient);border-radius:50%;display:inline-flex;align-items:center;justify-content:center;color:white;font-size:1.25rem;font-weight:700;margin-bottom:1rem">2</div><h4 style="font-size:1rem;margin-bottom:0.35rem">AI 분석</h4><p class="text-sub text-sm">AI가 업무를 분석하고<br>최적의 도구를 매칭합니다</p></div>
      <div style="text-align:center;padding:1rem"><div style="width:56px;height:56px;background:var(--gradient);border-radius:50%;display:inline-flex;align-items:center;justify-content:center;color:white;font-size:1.25rem;font-weight:700;margin-bottom:1rem">3</div><h4 style="font-size:1rem;margin-bottom:0.35rem">보고서 확인</h4><p class="text-sub text-sm">추천 도구와 자동화 전략<br>보고서를 확인합니다</p></div>
      <div style="text-align:center;padding:1rem"><div style="width:56px;height:56px;background:var(--gradient);border-radius:50%;display:inline-flex;align-items:center;justify-content:center;color:white;font-size:1.25rem;font-weight:700;margin-bottom:1rem">4</div><h4 style="font-size:1rem;margin-bottom:0.35rem">PDF 다운로드</h4><p class="text-sub text-sm">전체 보고서를 PDF로<br>저장하고 활용합니다</p></div>
    </div>
  </div>
</section>

<!-- Tool Categories -->
<section class="section">
  <div class="container">
    <h2 class="section-title">AI 도구 카테고리</h2>
    <p class="section-desc">다양한 분야의 AI 도구를 카테고리별로 탐색하세요</p>
    <div class="grid grid-4" id="category-grid"></div>
  </div>
</section>

<!-- CTA -->
<section class="section" style="background:var(--gradient);color:white;text-align:center">
  <div class="container">
    <h2 style="font-size:2rem;font-weight:700;margin-bottom:0.75rem">지금 바로 업무 자동화를 시작하세요</h2>
    <p style="opacity:0.9;margin-bottom:2rem;font-size:1.05rem">AI가 분석하고, 전문 코치가 안내합니다</p>
    <div style="display:flex;gap:1rem;justify-content:center;flex-wrap:wrap">
      <a href="/submit" class="btn btn-white btn-lg"><i class="fas fa-paper-plane"></i> 업무 입력하기</a>
      <a href="/history" class="btn btn-lg" style="background:rgba(255,255,255,0.15);color:white;border:2px solid rgba(255,255,255,0.3)"><i class="fas fa-history"></i> 이력 조회</a>
      <a href="/tools" class="btn btn-lg" style="background:rgba(255,255,255,0.15);color:white;border:2px solid rgba(255,255,255,0.3)"><i class="fas fa-th-large"></i> AI 도구 보기</a>
    </div>
  </div>
</section>
`, `
<script>
document.addEventListener('DOMContentLoaded', async () => {
  const categories = [
    { name: '문서작성', icon: 'fa-file-alt', color: '#7C3AED' },
    { name: '이미지생성', icon: 'fa-image', color: '#EC4899' },
    { name: '업무자동화', icon: 'fa-robot', color: '#3B82F6' },
    { name: '데이터분석', icon: 'fa-chart-bar', color: '#10B981' },
    { name: '마케팅', icon: 'fa-bullhorn', color: '#F59E0B' },
    { name: '영상생성', icon: 'fa-video', color: '#EF4444' },
    { name: '영상편집', icon: 'fa-film', color: '#8B5CF6' },
    { name: '음성입력', icon: 'fa-microphone', color: '#06B6D4' },
    { name: '리서치', icon: 'fa-search', color: '#6366F1' },
    { name: '일정관리', icon: 'fa-calendar-alt', color: '#F97316' },
    { name: '회의', icon: 'fa-users', color: '#14B8A6' },
    { name: '고객서비스', icon: 'fa-headset', color: '#E11D48' },
    { name: '개발', icon: 'fa-code', color: '#1D4ED8' }
  ];
  try {
    const res = await API.getAll('tools', { limit: 200 });
    const tools = res.data || [];
    const counts = {};
    tools.forEach(t => { if (t.is_active !== 0) counts[t.category] = (counts[t.category] || 0) + 1; });
    const grid = document.getElementById('category-grid');
    grid.innerHTML = categories.map(c => \`
      <a href="/tools?category=\${encodeURIComponent(c.name)}" class="card" style="text-decoration:none">
        <div class="card-body" style="text-align:center;padding:1.5rem">
          <div style="width:48px;height:48px;background:\${c.color}15;border-radius:12px;display:inline-flex;align-items:center;justify-content:center;margin-bottom:0.75rem">
            <i class="fas \${c.icon}" style="font-size:1.2rem;color:\${c.color}"></i>
          </div>
          <h4 style="font-size:0.95rem;color:var(--text);margin-bottom:0.25rem">\${c.name}</h4>
          <p class="text-sub text-sm">\${counts[c.name] || 0}개 도구</p>
        </div>
      </a>
    \`).join('');
  } catch (e) { console.error('카테고리 로드 실패:', e); }
});
</script>
`)
}
