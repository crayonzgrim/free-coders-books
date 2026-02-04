# Free Coders Books

A modern web application for browsing free programming books and resources, powered by the [free-programming-books](https://github.com/EbookFoundation/free-programming-books) project - one of the most starred repositories on GitHub with 350k+ stars.

**[Live Demo](https://free-coders-books.vercel.app)** | **[한국어](#한국어)**

![Next.js](https://img.shields.io/badge/Next.js-16.1-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=flat-square&logo=tailwindcss)

## Features

- **4,300+ Free Books** - Curated collection of free programming books
- **330+ Categories** - Organized by programming languages, frameworks, and topics
- **40+ Languages** - Multi-language support for global accessibility
- **Dark/Light Theme** - System-aware theme switching
- **Internationalization** - UI available in English, Korean, and Spanish
- **User Authentication** - GitHub OAuth integration
- **Bookmarks & Likes** - Save and like your favorite resources
- **Full-text Search** - Quick search across all books
- **SEO Optimized** - Dynamic sitemap, Open Graph images, and meta tags
- **Mobile Responsive** - Optimized for all screen sizes

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | [Next.js 16](https://nextjs.org/) (App Router) |
| Language | [TypeScript](https://www.typescriptlang.org/) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com/) |
| Database | [Turso](https://turso.tech/) (SQLite edge database) |
| ORM | [Drizzle ORM](https://orm.drizzle.team/) |
| Authentication | [NextAuth.js v5](https://authjs.dev/) |
| State Management | [TanStack Query](https://tanstack.com/query) |
| i18n | [next-intl](https://next-intl-docs.vercel.app/) |
| Testing | [Vitest](https://vitest.dev/) |
| Deployment | [Vercel](https://vercel.com/) |

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/free-coders-books.git
cd free-coders-books
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Configure your `.env.local`:
```env
# Site URL (required for SEO)
NEXT_PUBLIC_SITE_URL="http://localhost:3000"

# NextAuth (required for authentication)
AUTH_SECRET="your-secret-here"  # Generate with: openssl rand -base64 32

# GitHub OAuth (required for login)
AUTH_GITHUB_ID="your-github-client-id"
AUTH_GITHUB_SECRET="your-github-client-secret"

# Turso Database (optional - for bookmarks, likes, stats)
TURSO_DATABASE_URL="libsql://your-database.turso.io"
TURSO_AUTH_TOKEN="your-auth-token"
```

> **Note**: The app works without Turso configured. Book browsing uses the free-programming-books data directly.

5. Run the development server:
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm test` | Run tests in watch mode |
| `pnpm test:run` | Run tests once |
| `pnpm test:coverage` | Run tests with coverage |
| `pnpm db:generate` | Generate database migrations |
| `pnpm db:migrate` | Run database migrations |
| `pnpm db:push` | Push schema to database |
| `pnpm db:studio` | Open Drizzle Studio |

## Project Structure

```
free-coders-books/
├── app/
│   ├── [locale]/          # Internationalized pages
│   │   ├── books/         # Book listing and detail pages
│   │   ├── categories/    # Category pages
│   │   ├── bookmarks/     # User bookmarks
│   │   └── ...
│   ├── api/               # API routes
│   │   ├── bookmarks/     # Bookmark endpoints
│   │   ├── likes/         # Like endpoints
│   │   └── visits/        # Visit tracking
│   └── layout.tsx         # Root layout
├── components/
│   ├── books/             # Book-related components
│   ├── home/              # Homepage components
│   ├── layout/            # Layout components
│   └── ui/                # UI primitives
├── lib/
│   ├── books/             # Book data fetching
│   ├── db/                # Database schema and queries
│   ├── i18n/              # Internationalization config
│   ├── validations/       # Input validation schemas
│   └── rate-limit.ts      # Rate limiting
├── messages/              # Translation files (en, ko, es)
└── content/               # Markdown content (articles, guides)
```

## Security

- **Rate Limiting** - API endpoints are rate-limited to prevent abuse
- **Input Validation** - All inputs validated with Zod schemas
- **XSS Protection** - Markdown rendering sanitized with DOMPurify
- **CSRF Protection** - Built-in NextAuth.js CSRF protection

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgements

- [EbookFoundation/free-programming-books](https://github.com/EbookFoundation/free-programming-books) - The amazing community-maintained list of free programming resources
- All the contributors who maintain the free-programming-books repository

---

# 한국어

프로그래밍 무료 도서와 자료를 탐색할 수 있는 모던 웹 애플리케이션입니다. GitHub에서 35만+ 스타를 받은 [free-programming-books](https://github.com/EbookFoundation/free-programming-books) 프로젝트를 기반으로 합니다.

**[라이브 데모](https://free-coders-books.vercel.app)**

## 주요 기능

- **4,300+ 무료 도서** - 엄선된 무료 프로그래밍 도서 컬렉션
- **330+ 카테고리** - 프로그래밍 언어, 프레임워크, 주제별 분류
- **40+ 언어 지원** - 전 세계 사용자를 위한 다국어 자료
- **다크/라이트 테마** - 시스템 설정에 따른 테마 자동 전환
- **다국어 UI** - 영어, 한국어, 스페인어 지원
- **사용자 인증** - GitHub OAuth 연동
- **북마크 & 좋아요** - 좋아하는 자료 저장
- **전체 검색** - 모든 도서에서 빠른 검색
- **SEO 최적화** - 동적 사이트맵, Open Graph 이미지, 메타 태그
- **모바일 반응형** - 모든 화면 크기에 최적화

## 기술 스택

| 분류 | 기술 |
|------|------|
| 프레임워크 | [Next.js 16](https://nextjs.org/) (App Router) |
| 언어 | [TypeScript](https://www.typescriptlang.org/) |
| 스타일링 | [Tailwind CSS 4](https://tailwindcss.com/) |
| 데이터베이스 | [Turso](https://turso.tech/) (SQLite 엣지 데이터베이스) |
| ORM | [Drizzle ORM](https://orm.drizzle.team/) |
| 인증 | [NextAuth.js v5](https://authjs.dev/) |
| 상태 관리 | [TanStack Query](https://tanstack.com/query) |
| 국제화 | [next-intl](https://next-intl-docs.vercel.app/) |
| 테스트 | [Vitest](https://vitest.dev/) |
| 배포 | [Vercel](https://vercel.com/) |

## 시작하기

### 사전 요구사항

- Node.js 18 이상
- pnpm (권장) 또는 npm

### 설치

1. 저장소 클론:
```bash
git clone https://github.com/yourusername/free-coders-books.git
cd free-coders-books
```

2. 의존성 설치:
```bash
pnpm install
```

3. 환경 변수 설정:
```bash
cp .env.example .env.local
```

4. `.env.local` 설정:
```env
# 사이트 URL (SEO용)
NEXT_PUBLIC_SITE_URL="http://localhost:3000"

# NextAuth (인증용)
AUTH_SECRET="your-secret-here"  # 생성: openssl rand -base64 32

# GitHub OAuth (로그인용)
AUTH_GITHUB_ID="your-github-client-id"
AUTH_GITHUB_SECRET="your-github-client-secret"

# Turso 데이터베이스 (선택 - 북마크, 좋아요, 통계용)
TURSO_DATABASE_URL="libsql://your-database.turso.io"
TURSO_AUTH_TOKEN="your-auth-token"
```

> **참고**: Turso 설정 없이도 앱이 작동합니다. 도서 탐색은 free-programming-books 데이터를 직접 사용합니다.

5. 개발 서버 실행:
```bash
pnpm dev
```

[http://localhost:3000](http://localhost:3000)에서 앱을 확인하세요.

## 스크립트

| 명령어 | 설명 |
|--------|------|
| `pnpm dev` | 개발 서버 시작 |
| `pnpm build` | 프로덕션 빌드 |
| `pnpm start` | 프로덕션 서버 시작 |
| `pnpm lint` | ESLint 실행 |
| `pnpm test` | 테스트 실행 (watch 모드) |
| `pnpm test:run` | 테스트 1회 실행 |
| `pnpm test:coverage` | 커버리지 포함 테스트 |
| `pnpm db:generate` | 데이터베이스 마이그레이션 생성 |
| `pnpm db:migrate` | 마이그레이션 실행 |
| `pnpm db:push` | 스키마를 데이터베이스에 푸시 |
| `pnpm db:studio` | Drizzle Studio 열기 |

## 보안

- **Rate Limiting** - API 엔드포인트에 요청 제한 적용
- **입력 검증** - Zod 스키마로 모든 입력 검증
- **XSS 방지** - DOMPurify로 마크다운 렌더링 살균
- **CSRF 보호** - NextAuth.js 내장 CSRF 보호

## 기여하기

기여를 환영합니다! Pull Request를 자유롭게 제출해 주세요.

## 라이선스

이 프로젝트는 [MIT 라이선스](LICENSE) 하에 오픈 소스로 제공됩니다.

## 감사의 말

- [EbookFoundation/free-programming-books](https://github.com/EbookFoundation/free-programming-books) - 무료 프로그래밍 자료의 커뮤니티 관리 목록
- free-programming-books 저장소를 유지 관리하는 모든 기여자들
