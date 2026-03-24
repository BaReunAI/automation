import { layout } from './layout'

export function toolsPage(): string {
  return layout('AI 도구 목록', 'tools', '', `
<section class="hero" style="padding:2.5rem 0">
  <div class="container">
    <h1 style="font-size:2rem">🧰 AI 도구 목록</h1>
    <p>다양한 AI 도구를 카테고리별로 탐색하고, 업무에 맞는 도구를 찾아보세요</p>
    <div style="position:relative;font-size:1.1rem;margin-top:0.5rem" id="tools-count"></div>
  </div>
</section>

<section class="section" style="padding-top:2rem">
  <div class="container">
    <div class="search-bar"><i class="fas fa-search"></i><input type="text" class="form-input" id="search-input" placeholder="도구명 또는 키워드로 검색..." style="padding-left:2.75rem"></div>
    <div class="filter-group" id="filter-group"><button class="filter-btn active" data-category="전체">전체</button></div>
    <div class="grid grid-3" id="tools-grid"></div>
    <div class="empty-state hidden" id="empty-state"><i class="fas fa-search"></i><p>검색 결과가 없습니다</p></div>
  </div>
</section>
`, `<script src="/static/tools.js"></script>`)
}
