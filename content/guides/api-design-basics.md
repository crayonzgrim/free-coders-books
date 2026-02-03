---
title: "REST API 설계 기초"
titleEn: "REST API Design Basics"
description: "좋은 REST API를 설계하기 위한 원칙과 모범 사례를 배웁니다."
descriptionEn: "Learn principles and best practices for designing good REST APIs."
author: "Free Coders Books"
date: "2026-02-01"
category: "Backend"
tags: ["API", "REST", "백엔드", "설계"]
readingTime: 16
---

# REST API 설계 기초

REST(Representational State Transfer) API는 웹 서비스의 표준 인터페이스입니다. 잘 설계된 API는 사용하기 쉽고, 유지보수가 용이하며, 확장 가능합니다.

## REST의 핵심 원칙

### 1. 리소스 중심 설계

API는 **명사(리소스)**를 중심으로 설계합니다.

```
좋은 예:
GET /users          - 사용자 목록
GET /users/123      - 특정 사용자
POST /users         - 사용자 생성
PUT /users/123      - 사용자 수정
DELETE /users/123   - 사용자 삭제

나쁜 예:
GET /getUsers
POST /createUser
POST /deleteUser
```

### 2. HTTP 메서드 활용

각 HTTP 메서드는 특정 동작을 의미합니다.

| 메서드 | 용도 | 예시 |
|--------|------|------|
| GET | 조회 | 사용자 정보 조회 |
| POST | 생성 | 새 사용자 등록 |
| PUT | 전체 수정 | 사용자 정보 전체 변경 |
| PATCH | 부분 수정 | 이메일만 변경 |
| DELETE | 삭제 | 사용자 삭제 |

### 3. 상태 없음 (Stateless)

각 요청은 독립적이어야 합니다. 서버는 클라이언트의 상태를 저장하지 않습니다.

```
# 좋은 예 - 요청에 필요한 정보 포함
GET /orders?user_id=123
Authorization: Bearer <token>

# 나쁜 예 - 이전 요청에 의존
GET /myOrders  # 누구의 주문인지 알 수 없음
```

## URL 설계 규칙

### 명명 규칙

```
# 소문자 사용
/users (O)
/Users (X)

# 복수형 사용
/users (O)
/user (X)

# 하이픈 사용 (띄어쓰기 대신)
/user-profiles (O)
/user_profiles (X)
/userProfiles (X)
```

### 계층 구조

관계를 URL로 표현합니다.

```
# 사용자의 주문 목록
GET /users/123/orders

# 사용자의 특정 주문
GET /users/123/orders/456

# 주문의 상품들
GET /orders/456/items
```

### 필터링, 정렬, 페이지네이션

쿼리 파라미터를 활용합니다.

```
# 필터링
GET /products?category=electronics&price_min=100

# 정렬
GET /products?sort=price&order=desc

# 페이지네이션
GET /products?page=2&limit=20

# 조합
GET /products?category=electronics&sort=price&page=1&limit=10
```

## HTTP 상태 코드

적절한 상태 코드는 API 사용성을 높입니다.

### 성공 (2xx)

```
200 OK          - 성공 (GET, PUT, PATCH)
201 Created     - 생성 성공 (POST)
204 No Content  - 성공, 응답 본문 없음 (DELETE)
```

### 클라이언트 오류 (4xx)

```
400 Bad Request      - 잘못된 요청
401 Unauthorized     - 인증 필요
403 Forbidden        - 권한 없음
404 Not Found        - 리소스 없음
409 Conflict         - 충돌 (중복 등)
422 Unprocessable    - 유효성 검사 실패
429 Too Many Requests - 요청 제한 초과
```

### 서버 오류 (5xx)

```
500 Internal Server Error - 서버 오류
502 Bad Gateway          - 게이트웨이 오류
503 Service Unavailable  - 서비스 불가
```

## 요청과 응답 형식

### 요청 예시

```http
POST /api/users HTTP/1.1
Host: api.example.com
Content-Type: application/json
Authorization: Bearer eyJhbGc...

{
  "name": "홍길동",
  "email": "hong@example.com",
  "password": "securePassword123"
}
```

### 응답 예시

```http
HTTP/1.1 201 Created
Content-Type: application/json

{
  "id": 123,
  "name": "홍길동",
  "email": "hong@example.com",
  "createdAt": "2026-02-01T12:00:00Z"
}
```

### 에러 응답

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "입력값이 올바르지 않습니다.",
    "details": [
      {
        "field": "email",
        "message": "이메일 형식이 올바르지 않습니다."
      }
    ]
  }
}
```

## API 버전 관리

API가 변경되면 버전을 관리해야 합니다.

### URL 버전 (추천)

```
/api/v1/users
/api/v2/users
```

### 헤더 버전

```http
GET /api/users
Accept: application/vnd.myapi.v1+json
```

## 인증과 보안

### Bearer Token (JWT)

```http
GET /api/users
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

### API Key

```http
GET /api/users
X-API-Key: your-api-key-here
```

### 보안 체크리스트

- [ ] HTTPS 필수 사용
- [ ] 인증/인가 구현
- [ ] Rate Limiting 적용
- [ ] 입력값 검증
- [ ] SQL Injection 방지
- [ ] 민감 정보 로깅 금지

## 문서화

좋은 API 문서는 다음을 포함합니다:

1. **엔드포인트 목록**: URL, 메서드, 설명
2. **요청 파라미터**: 필수/선택, 타입, 예시
3. **응답 형식**: 성공/실패 예시
4. **인증 방법**: 토큰 획득 방법
5. **에러 코드**: 에러 코드와 해결 방법
6. **예제 코드**: 다양한 언어로

### OpenAPI (Swagger)

```yaml
openapi: 3.0.0
info:
  title: User API
  version: 1.0.0
paths:
  /users:
    get:
      summary: 사용자 목록 조회
      responses:
        '200':
          description: 성공
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/User'
```

## 실전 예제: 블로그 API

```
# 글 관련
GET    /posts                 # 글 목록
GET    /posts/123             # 글 상세
POST   /posts                 # 글 작성
PUT    /posts/123             # 글 수정
DELETE /posts/123             # 글 삭제

# 댓글 관련
GET    /posts/123/comments    # 댓글 목록
POST   /posts/123/comments    # 댓글 작성
DELETE /comments/456          # 댓글 삭제

# 좋아요
POST   /posts/123/like        # 좋아요
DELETE /posts/123/like        # 좋아요 취소

# 검색
GET    /posts?search=keyword
GET    /posts?author=user123
GET    /posts?tag=javascript
```

## 마무리

좋은 API 설계는 다음을 기억하세요:

1. **일관성**: 모든 엔드포인트에서 같은 규칙
2. **직관성**: URL만 보고 기능 예측 가능
3. **확장성**: 새 기능 추가가 쉬운 구조
4. **문서화**: 명확하고 상세한 문서

API는 개발자가 사용하는 인터페이스입니다. 사용자 경험(DX, Developer Experience)을 생각하며 설계하세요!
