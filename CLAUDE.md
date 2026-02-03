# CLAUDE.md - Image Editor (무계운도)

> 불사자 시스템 통합 온라인 이미지 편집 도구 (Leafer.js 기반)

---

## 1. Project Overview

오픈소스 기반 온라인 이미지 디자인 도구로, 불사자 시스템에 통합되어 상품 이미지 편집 기능을 제공합니다.

### 핵심 기능

| 기능 | 설명 |
|------|------|
| 캔버스 편집 | Leafer.js 기반 벡터 그래픽 렌더링 |
| 멀티 페이지 | 여러 페이지 디자인 지원 |
| 레이어 관리 | 텍스트, 이미지, 그룹 레이어 |
| Undo/Redo | 실행 취소/재실행 |
| QR코드/바코드 | 플러그인 기반 코드 생성 |
| 이미지 크롭 | cropperjs 기반 이미지 자르기 |
| 다국어 | 한국어, 중국어, 영어 |
| SDK Export | Vue/React 임베딩 지원 |
| 불사자 연동 | 자동 로그인, 토큰 연동 |

---

## 2. Tech Stack

| 항목 | 기술 |
|------|------|
| 빌드 | Vite 4.4.4 |
| 프레임워크 | React 18.2.0 + TypeScript |
| 상태관리 | MobX 5.15.4 |
| 캔버스 엔진 | Leafer UI 1.0.0-rc.21 |
| UI 컴포넌트 | Semi Design 2.54.0 |
| 아이콘 | @icon-park/react |
| 스타일링 | LESS + CSS Modules |
| HTTP | Axios |
| 이미지 처리 | cropperjs, react-easy-crop |
| QR/바코드 | qrcode, jsbarcode |
| 드래그앤드롭 | react-beautiful-dnd |

---

## 3. Commands

```bash
yarn dev              # 개발 서버 (port 3004)
yarn build            # 프로덕션 빌드 (앱 + SDK)
yarn sdk              # SDK만 빌드
yarn build:sdk        # Plain JS SDK 빌드
yarn build:sdkreact   # React SDK 빌드
yarn server           # 백엔드 서버 실행
yarn preview          # 프로덕션 미리보기 (port 8080)
yarn lint             # ESLint 실행
yarn clean            # dist 폴더 삭제
```

---

## 4. Directory Structure

```
src/
├── assets/images/            # 정적 이미지 (로고, 배경)
├── components/               # 공통 컴포넌트
│   ├── error-boundary/       # 에러 핸들링
│   ├── login/                # 로그인/회원가입
│   ├── page-loading/         # 로딩 상태
│   └── water-full/           # Masonry 그리드
├── config/                   # 설정
├── language/                 # 다국어 (ko, zh, en)
├── layout/                   # 레이아웃
├── less/                     # 글로벌 스타일
├── pages/
│   ├── editor/               # 메인 에디터
│   │   ├── core/             # 코어 SDK (핵심!)
│   │   │   ├── coresdk.tsx   # SDK 진입점
│   │   │   ├── View.tsx      # 메인 렌더러
│   │   │   ├── Frame.tsx     # 캔버스 프레임
│   │   │   ├── Record.tsx    # Undo/Redo 관리
│   │   │   ├── layers/       # 레이어 (Text, Image, Group)
│   │   │   ├── stores/       # 중앙 상태 관리
│   │   │   ├── types/        # 타입 정의
│   │   │   ├── tools/        # 유틸리티
│   │   │   └── hooks/        # 커스텀 훅
│   │   ├── plugins/          # 플러그인
│   │   │   ├── qrcode/       # QR코드
│   │   │   └── barcode/      # 바코드
│   │   ├── components/       # 에디터 UI
│   │   │   ├── canvas/       # 캔버스 렌더러
│   │   │   ├── header/       # 상단 툴바
│   │   │   ├── sidebar/      # 좌측 도구
│   │   │   ├── sources/      # 에셋 패널
│   │   │   ├── options/      # 속성 패널
│   │   │   └── contextMenu/  # 우클릭 메뉴
│   │   ├── Editor.tsx        # 에디터 컨테이너
│   │   └── HotKeys.tsx       # 키보드 단축키
│   ├── home/                 # 홈/갤러리
│   └── manage/               # 관리 페이지
├── server/                   # API 서비스
│   ├── BasicService.ts       # HTTP 기본 클래스
│   ├── user.service.ts       # 인증 API
│   └── demo.service.ts       # 템플릿 API
├── stores/                   # MobX 스토어
│   ├── editor.ts             # 에디터 상태
│   ├── layout.ts             # 레이아웃 상태
│   └── user.ts               # 사용자 상태
├── utils/                    # 유틸리티
├── App.tsx                   # 루트 (불사자 연동)
├── main.tsx                  # 진입점
└── routes.config.ts          # 라우트 정의
```

---

## 5. Architecture

```
┌─────────────────────────────────────────┐
│           App (Router, MobX, i18n)      │
└────────────┬────────────────────────────┘
             │
             ├─── Home (갤러리)
             ├─── Editor (메인)
             │      ├── Header (툴바)
             │      ├── Sidebar (도구)
             │      ├── Canvas
             │      │   └── View.tsx (Core SDK)
             │      │       └── Leafer App (렌더링 엔진)
             │      ├── Sources (에셋)
             │      └── Options (속성)
             └─── Manage (관리)
```

### 데이터 모델

```
BaseLayer (추상)
  ├── TextData     (텍스트 레이어)
  ├── ImageData    (이미지 레이어)
  ├── GroupData    (그룹 레이어)
  └── PageData     (페이지 컨테이너)
```

---

## 6. SDK

독립적으로 사용 가능한 에디터 코어 SDK를 제공합니다.

### 빌드 출력

```
dist-sdk/
├── coresdk.es.js           # ES Module (Plain JS)
├── coresdk.umd.js          # UMD Module
├── coresdk.react.es.js     # ES Module (React)
├── coresdk.react.umd.js    # UMD Module (React)
└── coresdk.*.css           # 스타일
```

### 사용법

```typescript
// Plain JavaScript
const editor = new CoreSDK({
  data: pageData,
  target: document.getElementById('editor'),
  env: 'editor',
  resourceHost: 'https://...'
});
await editor.init();

// React
import { View } from '@core';
<View data={pageData} target={element} env="editor" resourceHost="" />
```

---

## 7. Vite 경로 별칭

```
@components → src/components
@core       → src/pages/editor/core
@plugins    → src/pages/editor/plugins
@pages      → src/pages
@stores     → src/stores
@utils      → src/utils
```

---

## 8. 불사자 연동

```typescript
// App.tsx, server/user.service.ts
autoLoginBulsaja()    // 저장된 토큰으로 자동 로그인
setToken()            // 불사자 JWT 저장
getUserDetail()       // 사용자 정보 조회
```

### 외부 API 프록시

```
/cgi-bin, /api → https://image.h5ds.com
/fonts         → https://cdn.h5ds.com/assets
```

---

## 9. 관련 레포

- 상위: `..` (bulsaja-issue)
- API 서버: `../bulsa_server` (이미지 에디터 라우트: `src/routes/api/imageEditor.ts`)
- 프론트: `../bulsaja-wep-app`
