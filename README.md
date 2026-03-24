# 🤖 AI워크코치 (AI Work Coach)

> **AI가 분석하고, 코치가 안내하는 업무 자동화 코칭 서비스**

직장인의 반복 업무를 입력하면 AI(ChatGPT GPT-4o-mini)가 최적의 AI 도구와 자동화 전략을 추천하고, 전문 코치의 맞춤형 조언을 제공합니다.

---

## 🎯 프로젝트 목표

- 직장인 대상 **AI 업무 자동화 진단 및 코칭** 서비스
- 업무 분석 → AI 도구 추천 → 자동화 전략 → 학습 로드맵까지 **원스톱 솔루션**
- PDF 보고서 자동 생성으로 **즉시 활용 가능한 가이드** 제공

---

## ✅ 구현 완료 기능 (v2.0 - Cloudflare Pages)

### 페이지 구성
| 페이지 | 경로 | 설명 |
|--------|------|------|
| 메인(홈) | `/` | 서비스 소개, 핵심 기능, 이용 방법, 카테고리 |
| 업무 입력 | `/submit` | 기본 정보 + 업무 정보 입력 → AI 분석 요청 |
| 분석 결과 | `/result?id={reportId}` | 종합 보고서 (KPI, 진단, 도구, 전략, ROI, 로드맵) |
| AI 도구 목록 | `/tools` | 카테고리별 필터, 검색, 도구 상세 정보 |
| 이력 조회 | `/history` | 이메일 + 비밀번호로 과거 보고서 조회 |
| 관리자 | `/admin` | 대시보드, 제출 이력, 코치 코멘트, 도구 관리, 설정 |
| 디버그 | `/debug` | API 키 확인 및 AI 호출 테스트 |

### 핵심 기능
- ✅ **AI 심층 분석** (GPT-4o-mini, max_tokens: 8000)
- ✅ **KPI 대시보드** (4개 핵심 수치 카드)
- ✅ **자동화 준비도 스코어링** (원형 게이지 차트)
- ✅ **차트 시각화** (Chart.js - 바 차트, 도넛 차트)
- ✅ **코치 코멘트** (500자+ 자동 생성, 관리자 수정 가능)
- ✅ **PDF 보고서 다운로드** (html2canvas + jsPDF)
- ✅ **요청사항 사전 AI 검토**
- ✅ **AI 도구 DB** (30개+ 도구, 13개 카테고리)
- ✅ **관리자 대시보드** (제출 이력, 코치 코멘트, 도구 CRUD, API 키 설정)
- ✅ **비밀번호 SHA-256 해싱** (Web Crypto API)

---

## 🔧 기술 스택

- **Backend**: Hono Framework (Edge-first)
- **Database**: Cloudflare D1 (SQLite)
- **Deployment**: Cloudflare Pages
- **AI Engine**: OpenAI GPT-4o-mini (직접 호출)
- **Charts**: Chart.js
- **PDF**: jsPDF + html2canvas
- **Icons**: Font Awesome 6.4
- **Font**: Noto Sans KR (결과 페이지), System UI (기타)

---

## 🗃️ 데이터 모델

### 테이블 스키마 (D1 SQLite)
| 테이블 | 용도 |
|--------|------|
| `tools` | AI 도구 정보 (30+ 항목) |
| `submissions` | 분석 요청 데이터 |
| `reports` | AI 분석 보고서 |
| `settings` | 시스템 설정 (API 키, 관리자 비밀번호 등) |

---

## ⚙️ 설정 정보

| 항목 | 기본값 | 설명 |
|------|--------|------|
| 관리자 비밀번호 | `admin1234` | `/admin` → 설정 탭에서 변경 |
| API 키 | (미설정) | `/admin` → 설정 탭에서 OpenAI API 키 입력 |
| AI 엔진 | ChatGPT (GPT-4o-mini) | OpenAI 직접 호출 |

---

## 🚀 배포 시 필수 설정

1. **관리자 페이지 접속** → `/admin`
2. **기본 비밀번호**(`admin1234`)로 로그인
3. **설정 탭** → OpenAI API 키 입력 (`sk-proj-...` 형식)
4. **비밀번호 변경** (보안)

---

## 📁 파일 구조

```
webapp/
├── src/
│   ├── index.tsx           # Hono 메인 앱 (API + 라우팅)
│   └── pages/
│       ├── layout.ts       # 공통 레이아웃
│       ├── index.ts        # 메인 페이지
│       ├── submit.ts       # 업무 입력 페이지
│       ├── result.ts       # 분석 결과 페이지
│       ├── tools.ts        # AI 도구 목록 페이지
│       ├── history.ts      # 이력 조회 페이지
│       ├── admin.ts        # 관리자 페이지
│       └── debug.ts        # 디버그 페이지
├── public/
│   ├── favicon.svg
│   └── static/
│       ├── style.css       # 글로벌 스타일
│       ├── result.css      # 결과 페이지 스타일
│       ├── app.js          # API + 유틸리티 모듈
│       ├── submit.js       # 업무 입력 로직
│       ├── result.js       # 결과 보고서 렌더링
│       ├── tools.js        # 도구 목록 로직
│       ├── history.js      # 이력 조회 로직
│       └── admin.js        # 관리자 로직
├── migrations/
│   └── 0001_initial_schema.sql
├── seed.sql                # 초기 데이터 (도구 30+, 설정)
├── wrangler.jsonc          # Cloudflare 설정
├── vite.config.ts          # Vite 빌드 설정
├── ecosystem.config.cjs    # PM2 설정
└── package.json
```

---

## 👨‍🏫 코치 정보

- **코치**: 오원석 박사
- **소속**: 바른AI 대표 · 디지털융합교육원 지도교수
- **전문**: 직장인 대상 생성형 AI 업무 효율화 강의

---

*© 2026 AI워크코치. All rights reserved.*
