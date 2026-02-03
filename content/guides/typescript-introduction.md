---
title: "TypeScript 입문 가이드"
titleEn: "TypeScript Introduction Guide"
description: "JavaScript에 타입을 더해 더 안전하고 생산적인 개발을 시작하세요."
descriptionEn: "Add types to JavaScript for safer and more productive development."
author: "Free Coders Books"
date: "2026-02-01"
category: "TypeScript"
tags: ["TypeScript", "JavaScript", "타입", "프론트엔드"]
readingTime: 14
---

# TypeScript 입문 가이드

TypeScript는 JavaScript에 정적 타입을 추가한 언어입니다. 코드 작성 시점에 오류를 발견하고, 더 나은 개발 경험을 제공합니다.

## TypeScript를 사용해야 하는 이유

### JavaScript의 문제점

```javascript
// JavaScript - 런타임에야 오류 발견
function add(a, b) {
  return a + b;
}

add("1", 2); // "12" - 의도한 결과가 아님!
```

### TypeScript의 해결책

```typescript
// TypeScript - 작성 시점에 오류 발견
function add(a: number, b: number): number {
  return a + b;
}

add("1", 2); // 에러! Argument of type 'string' is not assignable
```

### 주요 장점

1. **컴파일 타임 오류 검출**: 실행 전에 버그 발견
2. **IDE 지원**: 자동완성, 리팩토링, 문서화
3. **코드 가독성**: 타입이 곧 문서
4. **대규모 프로젝트**: 유지보수성 향상

## 기본 타입

### 원시 타입

```typescript
// 문자열
let name: string = "홍길동";

// 숫자
let age: number = 25;

// 불리언
let isStudent: boolean = true;

// null과 undefined
let nothing: null = null;
let notDefined: undefined = undefined;
```

### 배열

```typescript
// 배열 표기법
let numbers: number[] = [1, 2, 3];
let names: string[] = ["Alice", "Bob"];

// 제네릭 표기법
let scores: Array<number> = [90, 85, 92];
```

### 객체

```typescript
// 인라인 타입
let user: { name: string; age: number } = {
  name: "홍길동",
  age: 25
};

// 인터페이스 사용
interface User {
  name: string;
  age: number;
  email?: string; // 선택적 속성
}

let member: User = {
  name: "김철수",
  age: 30
};
```

## 타입 별칭과 인터페이스

### Type Alias

```typescript
type Point = {
  x: number;
  y: number;
};

type ID = string | number;

const point: Point = { x: 10, y: 20 };
const userId: ID = "user123";
```

### Interface

```typescript
interface Animal {
  name: string;
  speak(): void;
}

interface Dog extends Animal {
  breed: string;
}

const myDog: Dog = {
  name: "멍멍이",
  breed: "골든 리트리버",
  speak() {
    console.log("왈왈!");
  }
};
```

### Type vs Interface

| 기능 | Type | Interface |
|------|------|-----------|
| 객체 타입 정의 | O | O |
| 유니온 타입 | O | X |
| 확장 | & (intersection) | extends |
| 선언 병합 | X | O |
| 추천 사용 | 유니온, 튜플 등 | 객체 구조 정의 |

## 유니온 타입

여러 타입 중 하나일 수 있음을 표현합니다.

```typescript
type Status = "pending" | "approved" | "rejected";

function setStatus(status: Status) {
  console.log(`상태: ${status}`);
}

setStatus("approved"); // OK
setStatus("unknown");  // 에러!

// 타입 좁히기
function printId(id: number | string) {
  if (typeof id === "string") {
    console.log(id.toUpperCase()); // string으로 좁혀짐
  } else {
    console.log(id.toFixed(2)); // number로 좁혀짐
  }
}
```

## 제네릭

타입을 매개변수처럼 사용합니다.

```typescript
// 제네릭 함수
function identity<T>(arg: T): T {
  return arg;
}

const num = identity<number>(42);
const str = identity<string>("hello");

// 제네릭 인터페이스
interface Box<T> {
  value: T;
}

const numberBox: Box<number> = { value: 123 };
const stringBox: Box<string> = { value: "hello" };

// 제네릭 제약
interface HasLength {
  length: number;
}

function logLength<T extends HasLength>(arg: T): void {
  console.log(arg.length);
}

logLength("hello"); // OK - string has length
logLength([1, 2]); // OK - array has length
logLength(123);    // Error - number doesn't have length
```

## 함수 타입

```typescript
// 함수 타입 정의
type MathOperation = (a: number, b: number) => number;

const add: MathOperation = (a, b) => a + b;
const multiply: MathOperation = (a, b) => a * b;

// 선택적 매개변수
function greet(name: string, greeting?: string): string {
  return `${greeting || "안녕하세요"}, ${name}!`;
}

// 기본값
function greet2(name: string, greeting: string = "안녕하세요"): string {
  return `${greeting}, ${name}!`;
}

// 나머지 매개변수
function sum(...numbers: number[]): number {
  return numbers.reduce((acc, n) => acc + n, 0);
}
```

## 실전 예제: API 응답 타입

```typescript
// API 응답 타입 정의
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

interface User {
  id: number;
  name: string;
  email: string;
}

interface Post {
  id: number;
  title: string;
  content: string;
  authorId: number;
}

// 타입 안전한 API 함수
async function fetchUser(id: number): Promise<ApiResponse<User>> {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
}

async function fetchPosts(): Promise<ApiResponse<Post[]>> {
  const response = await fetch('/api/posts');
  return response.json();
}

// 사용
const userResponse = await fetchUser(1);
console.log(userResponse.data.name); // 자동완성 지원!
```

## 유틸리티 타입

TypeScript가 제공하는 내장 유틸리티 타입입니다.

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

// Partial - 모든 속성을 선택적으로
type PartialUser = Partial<User>;

// Required - 모든 속성을 필수로
type RequiredUser = Required<Partial<User>>;

// Pick - 특정 속성만 선택
type UserBasic = Pick<User, "id" | "name">;

// Omit - 특정 속성 제외
type UserWithoutEmail = Omit<User, "email">;

// Readonly - 모든 속성을 읽기 전용으로
type ReadonlyUser = Readonly<User>;
```

## 프로젝트 설정

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "outDir": "./dist"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

## 다음 단계

1. **고급 타입**: Mapped Types, Conditional Types
2. **타입 가드**: 커스텀 타입 좁히기
3. **데코레이터**: 메타프로그래밍
4. **프레임워크와 함께**: React + TypeScript, Node + TypeScript

## 마무리

TypeScript는 JavaScript 생태계의 표준이 되어가고 있습니다. 처음에는 타입 작성이 번거로울 수 있지만, 프로젝트 규모가 커질수록 그 가치가 빛납니다. 작은 프로젝트부터 TypeScript를 적용해보세요!
