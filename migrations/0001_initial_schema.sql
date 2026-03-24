-- AI워크코치 - 초기 DB 스키마
-- tools: AI 도구 정보
CREATE TABLE IF NOT EXISTS tools (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  subcategory TEXT DEFAULT '',
  website_url TEXT DEFAULT '',
  description TEXT DEFAULT '',
  difficulty TEXT DEFAULT 'beginner',
  pricing_type TEXT DEFAULT 'freemium',
  pricing_detail TEXT DEFAULT '',
  rating REAL DEFAULT 4.0,
  automation_level TEXT DEFAULT 'semi',
  popularity INTEGER DEFAULT 70,
  use_cases TEXT DEFAULT '[]',
  keywords TEXT DEFAULT '[]',
  is_active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now'))
);

-- submissions: 분석 요청 데이터
CREATE TABLE IF NOT EXISTS submissions (
  id TEXT PRIMARY KEY,
  organization TEXT DEFAULT '',
  department TEXT DEFAULT '',
  name TEXT DEFAULT '',
  email TEXT DEFAULT '',
  password_hash TEXT DEFAULT '',
  job_description TEXT DEFAULT '',
  automation_request TEXT DEFAULT '',
  frequency TEXT DEFAULT '',
  estimated_hours REAL DEFAULT 0,
  current_tools TEXT DEFAULT '',
  ai_engine TEXT DEFAULT 'chatgpt',
  status TEXT DEFAULT 'pending',
  created_at TEXT DEFAULT (datetime('now'))
);

-- reports: AI 분석 보고서
CREATE TABLE IF NOT EXISTS reports (
  id TEXT PRIMARY KEY,
  submission_id TEXT DEFAULT '',
  ai_engine_used TEXT DEFAULT '',
  analysis_result TEXT DEFAULT '',
  recommended_tools TEXT DEFAULT '',
  time_saving_estimate TEXT DEFAULT '',
  coach_comment TEXT DEFAULT '',
  coach_comment_by TEXT DEFAULT '',
  coach_comment_at TEXT DEFAULT '',
  created_at TEXT DEFAULT (datetime('now'))
);

-- settings: 시스템 설정
CREATE TABLE IF NOT EXISTS settings (
  id TEXT PRIMARY KEY,
  setting_key TEXT UNIQUE NOT NULL,
  setting_value TEXT DEFAULT '',
  description TEXT DEFAULT '',
  created_at TEXT DEFAULT (datetime('now'))
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_tools_category ON tools(category);
CREATE INDEX IF NOT EXISTS idx_tools_is_active ON tools(is_active);
CREATE INDEX IF NOT EXISTS idx_submissions_email ON submissions(email);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status);
CREATE INDEX IF NOT EXISTS idx_reports_submission_id ON reports(submission_id);
CREATE INDEX IF NOT EXISTS idx_settings_key ON settings(setting_key);
