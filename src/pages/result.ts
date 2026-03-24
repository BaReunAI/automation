import { layout } from './layout'

export function resultPage(): string {
  return layout('분석 결과', '', `
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
  <link rel="stylesheet" href="/static/result.css">
`, `
<div id="result-content">
  <div class="loading-overlay" id="page-loading" style="display:flex">
    <div class="loading-spinner"></div>
    <p style="color:var(--text-sub)">보고서를 불러오는 중...</p>
  </div>
</div>
`, `<script src="/static/result.js"></script>`)
}
