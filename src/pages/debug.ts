export function debugPage(): string {
  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>디버그 - Settings 확인</title>
  <style>body{font-family:system-ui;padding:2rem;background:#f9fafb}pre{background:#1f2937;color:#10b981;padding:1rem;border-radius:8px;overflow:auto;font-size:0.85rem}.btn{padding:0.5rem 1rem;background:#7c3aed;color:white;border:none;border-radius:8px;cursor:pointer;margin:0.25rem}h2{margin-top:1.5rem}</style>
</head>
<body>
  <h1>🔍 Settings 디버그</h1>
  <button class="btn" onclick="loadAll()">1. 전체 Settings 조회</button>
  <button class="btn" onclick="testApiKey()">2. API Key 조회 테스트</button>
  <button class="btn" onclick="testAICall()">3. AI 호출 테스트</button>
  <h2>결과:</h2>
  <pre id="output">버튼을 클릭하세요...</pre>
  <script src="/static/app.js"></script>
  <script>
    const out = document.getElementById('output');
    function log(msg) { out.textContent += '\\n' + msg; }
    async function loadAll() {
      out.textContent = '=== 전체 Settings 조회 ===\\n';
      try {
        const res = await fetch('/api/tables/settings?limit=100');
        const data = await res.json();
        log('응답 상태: ' + res.status);
        log('데이터 수: ' + (data.data?.length || 0));
        (data.data || []).forEach(s => {
          const val = s.setting_key === 'openrouter_api_key' ? (s.setting_value ? s.setting_value.substring(0,12)+'...' : 'EMPTY') : (s.setting_value || 'EMPTY');
          log('  ['+s.id+'] '+s.setting_key+' = '+val);
        });
      } catch(e) { log('에러: '+e.message); }
    }
    async function testApiKey() {
      out.textContent = '=== API Key 조회 테스트 ===\\n';
      try {
        API.clearSettingsCache();
        const all = await API._loadAllSettings();
        log('전체 설정 키: '+JSON.stringify(Object.keys(all)));
        log('openrouter_api_key: '+(all.openrouter_api_key ? all.openrouter_api_key.substring(0,12)+'...' : 'EMPTY'));
        API.clearSettingsCache();
        const key = await API.getSetting('openrouter_api_key');
        log('getSetting 결과: '+(key ? key.substring(0,12)+'...' : 'EMPTY'));
      } catch(e) { log('에러: '+e.message); }
    }
    async function testAICall() {
      out.textContent = '=== AI 호출 테스트 ===\\n';
      try {
        const apiKey = await API.getSetting('openrouter_api_key');
        log('API Key: '+(apiKey ? apiKey.substring(0,12)+'...' : 'EMPTY'));
        if (!apiKey||apiKey.trim()==='') { log('❌ API 키가 비어있습니다!'); return; }
        log('OpenAI 테스트 호출 중...');
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
          method:'POST', headers:{'Authorization':'Bearer '+apiKey,'Content-Type':'application/json'},
          body: JSON.stringify({model:'gpt-4o-mini',messages:[{role:'user',content:'Hello, say "test ok"'}],max_tokens:50})
        });
        log('응답 상태: '+res.status);
        const data = await res.json();
        if (res.ok) log('✅ 성공! '+data.choices?.[0]?.message?.content);
        else log('❌ 실패! '+JSON.stringify(data.error));
      } catch(e) { log('에러: '+e.message); }
    }
  </script>
</body>
</html>`
}
