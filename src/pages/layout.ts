// 공통 레이아웃 헬퍼
export function layout(title: string, activeNav: string, headExtra: string, bodyContent: string, scriptContent: string): string {
  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - AI워크코치</title>
  <meta name="description" content="반복 업무를 입력하면 AI가 최적의 도구와 자동화 방법을 추천합니다. 전문 코치의 맞춤형 코칭으로 업무 효율화를 시작하세요.">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css">
  <link rel="stylesheet" href="/static/style.css">
  ${headExtra}
</head>
<body>

<nav class="navbar">
  <div class="container">
    <a href="/" class="navbar-brand">
      <span class="logo-icon"><i class="fas fa-robot"></i></span>
      AI워크코치
    </a>
    <button class="navbar-toggle" aria-label="메뉴"><i class="fas fa-bars"></i></button>
    <ul class="navbar-nav">
      <li><a href="/"${activeNav === 'home' ? ' class="active"' : ''}>홈</a></li>
      <li><a href="/submit"${activeNav === 'submit' ? ' class="active"' : ''}>업무 입력</a></li>
      <li><a href="/tools"${activeNav === 'tools' ? ' class="active"' : ''}>AI 도구</a></li>
      <li><a href="/history"${activeNav === 'history' ? ' class="active"' : ''}>이력 조회</a></li>
      <li><a href="/admin" class="btn btn-sm btn-outline${activeNav === 'admin' ? ' active' : ''}" style="margin-left:0.5rem">관리자</a></li>
    </ul>
  </div>
</nav>

${bodyContent}

<footer class="footer">
  <div class="container">
    <div class="footer-brand">🤖 AI워크코치</div>
    <div class="footer-info">AI가 분석하고, 코치가 안내하는 업무 자동화 코칭 서비스</div>
    <div class="footer-info">코치: 오원석 박사 · 바른AI 대표 · 디지털융합교육원 지도교수</div>
    <div class="footer-copy">© 2026 AI워크코치. All rights reserved.</div>
  </div>
</footer>

<script src="/static/app.js"></script>
${scriptContent}
</body>
</html>`
}
