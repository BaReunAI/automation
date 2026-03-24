-- AI워크코치 시드 데이터
-- 초기 설정
INSERT OR IGNORE INTO settings (id, setting_key, setting_value, description) VALUES
  ('admin_password', 'admin_password', 'admin1234', '관리자 비밀번호'),
  ('openrouter_api_key', 'openrouter_api_key', '', 'OpenAI API Key'),
  ('default_ai_engine', 'default_ai_engine', 'chatgpt', '기본 AI 엔진'),
  ('coach_name', 'coach_name', '오원석 박사', '코치 이름'),
  ('coach_title', 'coach_title', '바른AI 대표 · 디지털융합교육원 지도교수', '코치 직함');

-- AI 도구 데이터 (28개+)
INSERT OR IGNORE INTO tools (id, name, category, subcategory, website_url, description, difficulty, pricing_type, pricing_detail, rating, automation_level, popularity, use_cases, keywords, is_active) VALUES
('tool-001','ChatGPT','문서작성','AI 채팅','https://chat.openai.com','OpenAI의 대화형 AI. 문서 작성, 요약, 번역, 코딩 등 다양한 업무를 자연어로 처리합니다.','beginner','freemium','무료 / Plus $20/월 / Pro $200/월',4.8,'semi',98,'["보고서 작성","이메일 초안","번역","코드 작성","브레인스토밍"]','["AI","챗봇","문서","작성","GPT"]',1),
('tool-002','Claude','문서작성','AI 채팅','https://claude.ai','Anthropic의 AI 어시스턴트. 긴 문서 분석, 창의적 글쓰기, 코딩에 강점이 있습니다.','beginner','freemium','무료 / Pro $20/월',4.7,'semi',92,'["문서 분석","긴 텍스트 요약","창의적 글쓰기","코드 리뷰"]','["AI","챗봇","문서","분석","Claude"]',1),
('tool-003','Notion AI','문서작성','노트/위키','https://notion.so','올인원 워크스페이스에 AI 기능 통합. 노트, 문서, 프로젝트 관리를 AI로 효율화합니다.','beginner','freemium','무료 / Plus $10/월 / AI $10/월 추가',4.6,'semi',90,'["회의록 정리","프로젝트 관리","문서 작성","지식 관리"]','["노션","문서","프로젝트","관리","위키"]',1),
('tool-004','Gamma','문서작성','프레젠테이션','https://gamma.app','AI 기반 프레젠테이션/문서 자동 생성 도구. 텍스트만 입력하면 디자인까지 완성됩니다.','beginner','freemium','무료(10크레딧) / Pro $10/월',4.5,'full',85,'["프레젠테이션 제작","보고서 디자인","제안서 작성"]','["PPT","프레젠테이션","슬라이드","디자인"]',1),
('tool-005','Midjourney','이미지생성','이미지 생성','https://midjourney.com','최고 품질의 AI 이미지 생성. 프롬프트 기반으로 고품질 이미지를 생성합니다.','intermediate','paid','Basic $10/월 / Standard $30/월',4.9,'full',95,'["마케팅 이미지","SNS 콘텐츠","디자인 시안","일러스트"]','["이미지","생성","AI아트","디자인"]',1),
('tool-006','DALL-E 3','이미지생성','이미지 생성','https://openai.com/dall-e-3','OpenAI의 이미지 생성 AI. ChatGPT와 통합되어 자연어로 이미지를 생성합니다.','beginner','freemium','ChatGPT Plus 포함 / API 별도',4.5,'full',88,'["이미지 생성","로고 디자인","광고 소재","일러스트"]','["이미지","생성","DALL-E","OpenAI"]',1),
('tool-007','Canva AI','이미지생성','디자인','https://canva.com','디자인 플랫폼 + AI. 템플릿 기반으로 누구나 전문적인 디자인을 만들 수 있습니다.','beginner','freemium','무료 / Pro $13/월',4.7,'semi',93,'["SNS 디자인","포스터","프레젠테이션","로고"]','["디자인","캔바","템플릿","그래픽"]',1),
('tool-008','Zapier','업무자동화','워크플로 자동화','https://zapier.com','7000+ 앱 간 자동화 연동. 코딩 없이 반복 업무를 자동화하는 워크플로를 구축합니다.','intermediate','freemium','무료(100작업/월) / Starter $20/월',4.6,'full',91,'["이메일 자동화","데이터 연동","알림 자동화","파일 관리"]','["자동화","워크플로","연동","노코드"]',1),
('tool-009','Make (Integromat)','업무자동화','워크플로 자동화','https://make.com','비주얼 자동화 빌더. 복잡한 워크플로를 드래그앤드롭으로 구축합니다.','intermediate','freemium','무료(1000작업/월) / Core $9/월',4.5,'full',86,'["복잡한 워크플로","데이터 변환","API 연동","스케줄 자동화"]','["자동화","Make","인테그로맷","워크플로"]',1),
('tool-010','Power Automate','업무자동화','MS 생태계','https://powerautomate.microsoft.com','Microsoft의 자동화 도구. Office 365 생태계와 완벽한 통합을 제공합니다.','intermediate','freemium','M365 포함 / Premium $15/월',4.4,'full',84,'["Excel 자동화","Outlook 자동화","SharePoint 연동","승인 프로세스"]','["마이크로소프트","자동화","오피스","파워"]',1),
('tool-011','Otter.ai','회의','회의록 자동화','https://otter.ai','AI 회의 녹음 및 자동 회의록 생성. 실시간 자막과 핵심 요약을 제공합니다.','beginner','freemium','무료(300분/월) / Pro $17/월',4.5,'full',87,'["회의록 자동 생성","실시간 자막","회의 요약","액션아이템 추출"]','["회의","녹음","회의록","자막","요약"]',1),
('tool-012','Fireflies.ai','회의','회의 녹화','https://fireflies.ai','AI 회의 비서. 자동 녹화, 전사, 요약 및 CRM 연동을 지원합니다.','beginner','freemium','무료 / Pro $18/월',4.4,'full',82,'["회의 녹화","자동 전사","CRM 연동","회의 분석"]','["회의","녹화","전사","분석"]',1),
('tool-013','Clova Note','회의','음성 기록','https://clovanote.naver.com','네이버의 AI 음성 기록 서비스. 한국어 인식 정확도가 높고 무료로 사용 가능합니다.','beginner','free','무료(월 300분)',4.3,'full',80,'["음성 녹음","한국어 전사","회의록","강의 정리"]','["네이버","클로바","음성","한국어","녹음"]',1),
('tool-014','Tableau','데이터분석','데이터 시각화','https://tableau.com','업계 최고의 데이터 시각화 도구. AI 기반 인사이트 자동 추출 기능을 제공합니다.','advanced','paid','Creator $75/월',4.7,'semi',88,'["데이터 시각화","대시보드","보고서","데이터 분석"]','["데이터","시각화","대시보드","분석","BI"]',1),
('tool-015','Power BI','데이터분석','데이터 시각화','https://powerbi.microsoft.com','Microsoft의 BI 도구. Excel 데이터를 쉽게 시각화하고 AI 인사이트를 제공합니다.','intermediate','freemium','무료 / Pro $10/월',4.5,'semi',85,'["Excel 시각화","대시보드","보고서","KPI 모니터링"]','["데이터","시각화","BI","마이크로소프트","엑셀"]',1),
('tool-016','Google Analytics','데이터분석','웹 분석','https://analytics.google.com','웹사이트 트래픽 분석. AI 기반 자동 인사이트 및 예측 분석을 제공합니다.','intermediate','free','무료 (GA4)',4.4,'semi',83,'["웹 분석","트래픽 분석","사용자 행동","전환율 추적"]','["구글","분석","웹","트래픽","GA"]',1),
('tool-017','Perplexity AI','리서치','AI 검색','https://perplexity.ai','AI 기반 검색 엔진. 출처 명시된 답변으로 빠르고 정확한 리서치를 지원합니다.','beginner','freemium','무료 / Pro $20/월',4.6,'semi',89,'["시장 조사","경쟁사 분석","트렌드 리서치","논문 검색"]','["검색","리서치","AI","퍼플렉시티"]',1),
('tool-018','Jasper','마케팅','AI 카피라이팅','https://jasper.ai','마케팅 AI 카피라이터. 광고 문구, 블로그, SNS 콘텐츠를 자동 생성합니다.','intermediate','paid','Creator $49/월 / Pro $69/월',4.4,'semi',82,'["광고 카피","블로그 작성","SNS 콘텐츠","이메일 마케팅"]','["마케팅","카피","콘텐츠","광고"]',1),
('tool-019','HubSpot AI','마케팅','CRM/마케팅','https://hubspot.com','올인원 마케팅/세일즈 플랫폼에 AI 기능이 통합. 리드 관리부터 콘텐츠 생성까지 지원합니다.','intermediate','freemium','무료 CRM / Starter $20/월',4.5,'semi',84,'["이메일 마케팅","리드 관리","콘텐츠 마케팅","영업 자동화"]','["마케팅","CRM","세일즈","허브스팟"]',1),
('tool-020','Runway ML','영상생성','AI 영상','https://runwayml.com','AI 영상 생성 및 편집. 텍스트/이미지로 영상을 생성하고 편집할 수 있습니다.','intermediate','freemium','무료(125크레딧) / Standard $12/월',4.5,'full',86,'["영상 생성","모션 그래픽","배경 제거","스타일 변환"]','["영상","AI","생성","편집","Runway"]',1),
('tool-021','Sora','영상생성','AI 영상','https://openai.com/sora','OpenAI의 AI 영상 생성. 텍스트 프롬프트로 고품질 영상을 생성합니다.','intermediate','paid','ChatGPT Pro 포함',4.6,'full',90,'["영상 생성","광고 제작","콘텐츠 제작","프로토타입"]','["영상","생성","OpenAI","소라"]',1),
('tool-022','CapCut','영상편집','영상 편집','https://capcut.com','TikTok 계열 무료 영상 편집기. AI 자막, 배경 제거 등 AI 기능이 풍부합니다.','beginner','freemium','무료 / Pro $8/월',4.6,'semi',91,'["영상 편집","자막 생성","배경 제거","SNS 영상"]','["영상","편집","캡컷","자막","틱톡"]',1),
('tool-023','Vrew','영상편집','AI 자막','https://vrew.voyagerx.com','AI 자막 자동 생성 영상 편집기. 한국어 자막 인식이 뛰어나고 사용이 간편합니다.','beginner','freemium','무료(120분/월) / Light $10/월',4.4,'full',83,'["자막 자동 생성","영상 편집","한국어 자막","유튜브 편집"]','["자막","영상","편집","한국어","보이저"]',1),
('tool-024','Whisper','음성입력','음성 인식','https://openai.com/research/whisper','OpenAI의 오픈소스 음성 인식 AI. 다국어 지원, 높은 정확도의 음성 텍스트 변환을 제공합니다.','intermediate','free','오픈소스 무료 / API 사용료 별도',4.5,'full',81,'["음성 텍스트 변환","녹취록","다국어 인식","자막 생성"]','["음성","인식","STT","Whisper","OpenAI"]',1),
('tool-025','Google Calendar AI','일정관리','캘린더','https://calendar.google.com','구글 캘린더의 AI 기능. 일정 추천, 충돌 감지, 스마트 일정 관리를 제공합니다.','beginner','free','무료 (Google Workspace 포함)',4.3,'semi',79,'["일정 관리","회의 예약","시간 관리","팀 캘린더"]','["일정","캘린더","구글","시간","관리"]',1),
('tool-026','Intercom','고객서비스','AI 챗봇','https://intercom.com','AI 고객 지원 플랫폼. 자동 답변, 챗봇, 지식 베이스로 고객 서비스를 자동화합니다.','intermediate','paid','Starter $74/월',4.4,'full',80,'["고객 지원","챗봇","FAQ 자동 답변","지식 베이스"]','["고객","서비스","챗봇","상담","인터콤"]',1),
('tool-027','GitHub Copilot','개발','코딩 AI','https://github.com/features/copilot','AI 코딩 어시스턴트. 코드 자동 완성, 문서 생성, 코드 설명 등을 제공합니다.','intermediate','paid','Individual $10/월 / Business $19/월',4.8,'semi',94,'["코드 자동 완성","코드 리뷰","문서 생성","테스트 코드"]','["코딩","개발","AI","깃허브","코파일럿"]',1),
('tool-028','Cursor','개발','AI IDE','https://cursor.com','AI 기반 코드 에디터. 코드 생성, 수정, 디버깅을 AI가 지원하는 차세대 IDE입니다.','intermediate','freemium','무료(2000회/월) / Pro $20/월',4.7,'semi',89,'["코드 생성","디버깅","리팩토링","AI 코딩"]','["코딩","IDE","AI","커서","에디터"]',1),
('tool-029','Grammarly','문서작성','문법 검사','https://grammarly.com','AI 영문 교정 도구. 문법, 스펠링, 톤, 명확성을 자동으로 교정합니다.','beginner','freemium','무료 / Premium $12/월',4.5,'semi',87,'["영문 교정","이메일 작성","문법 검사","톤 조절"]','["영어","문법","교정","그래머리"]',1),
('tool-030','Tally','데이터분석','설문/폼','https://tally.so','AI 기반 무료 폼/설문 도구. 깔끔한 인터페이스로 설문을 쉽게 만들 수 있습니다.','beginner','freemium','무료 / Pro $29/월',4.3,'semi',75,'["설문 조사","고객 피드백","데이터 수집","이벤트 등록"]','["설문","폼","데이터","수집","탈리"]',1);
