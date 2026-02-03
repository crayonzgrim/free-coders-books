---
title: "클린 코드 원칙"
titleEn: "Clean Code Principles"
description: "읽기 쉽고 유지보수하기 좋은 코드를 작성하는 방법을 배웁니다."
descriptionEn: "Learn how to write readable and maintainable code."
author: "Free Coders Books"
date: "2026-02-01"
category: "Best Practices"
tags: ["클린코드", "리팩토링", "개발문화", "모범사례"]
readingTime: 13
---

# 클린 코드 원칙

좋은 코드는 컴퓨터만 이해하는 것이 아니라 **사람도 쉽게 이해**할 수 있어야 합니다. 클린 코드는 읽기 쉽고, 수정하기 쉬우며, 확장하기 쉬운 코드입니다.

## 의미 있는 이름

### 변수명

```javascript
// 나쁜 예
const d = new Date();
const y = d.getFullYear();
const arr = users.filter(u => u.a > 18);

// 좋은 예
const currentDate = new Date();
const currentYear = currentDate.getFullYear();
const adultUsers = users.filter(user => user.age > 18);
```

### 함수명

동사로 시작하고, 하는 일을 명확히 표현합니다.

```javascript
// 나쁜 예
function data() { ... }
function process() { ... }

// 좋은 예
function fetchUserData() { ... }
function calculateTotalPrice() { ... }
function validateEmail() { ... }
```

### 불리언 변수

is, has, can 등의 접두사를 사용합니다.

```javascript
// 나쁜 예
const login = true;
const admin = user.role === 'admin';

// 좋은 예
const isLoggedIn = true;
const isAdmin = user.role === 'admin';
const hasPermission = checkPermission(user);
const canEdit = isAdmin && hasPermission;
```

## 함수 설계

### 작은 함수

함수는 **한 가지 일만** 해야 합니다.

```javascript
// 나쁜 예 - 여러 가지 일을 함
function processUser(user) {
  // 유효성 검사
  if (!user.email || !user.name) throw new Error();

  // 데이터 정규화
  user.email = user.email.toLowerCase();

  // 데이터베이스 저장
  database.save(user);

  // 이메일 발송
  sendWelcomeEmail(user.email);
}

// 좋은 예 - 각 함수가 한 가지 일만 함
function processUser(user) {
  validateUser(user);
  const normalizedUser = normalizeUser(user);
  saveUser(normalizedUser);
  sendWelcomeEmail(normalizedUser.email);
}

function validateUser(user) {
  if (!user.email || !user.name) {
    throw new ValidationError('Email and name are required');
  }
}

function normalizeUser(user) {
  return {
    ...user,
    email: user.email.toLowerCase()
  };
}
```

### 매개변수 개수

매개변수는 **3개 이하**가 이상적입니다.

```javascript
// 나쁜 예
function createUser(name, email, age, address, phone, role) { ... }

// 좋은 예 - 객체로 묶기
function createUser({ name, email, age, address, phone, role }) { ... }

// 호출
createUser({
  name: '홍길동',
  email: 'hong@example.com',
  age: 25
});
```

### 사이드 이펙트 피하기

```javascript
// 나쁜 예 - 외부 상태 변경
let totalPrice = 0;
function addPrice(price) {
  totalPrice += price;  // 외부 변수 변경
}

// 좋은 예 - 순수 함수
function addPrice(currentTotal, price) {
  return currentTotal + price;
}
```

## 주석

### 좋은 주석

```javascript
// TODO: 성능 최적화 필요
// FIXME: 엣지 케이스 처리 필요
// 정규표현식: 이메일 형식 검증 (RFC 5322)
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
```

### 나쁜 주석

```javascript
// 나쁜 예 - 코드가 하는 일을 그대로 설명
// i를 1 증가
i++;

// 사용자를 가져옴
const user = getUser();

// 좋은 예 - 코드 자체가 설명이 됨
const nextIndex = currentIndex + 1;
const currentUser = fetchUserById(userId);
```

### 코드로 의도를 표현하세요

```javascript
// 나쁜 예
// 18세 이상이고 프리미엄 회원인 경우 할인 적용
if (user.age >= 18 && user.membership === 'premium') { ... }

// 좋은 예
const isAdult = user.age >= 18;
const isPremiumMember = user.membership === 'premium';
const isEligibleForDiscount = isAdult && isPremiumMember;

if (isEligibleForDiscount) { ... }
```

## 에러 처리

### 구체적인 에러

```javascript
// 나쁜 예
throw new Error('Error');

// 좋은 예
throw new ValidationError('Email format is invalid');
throw new NotFoundError(`User with id ${userId} not found`);
throw new AuthenticationError('Invalid credentials');
```

### 에러 처리 분리

```javascript
// 나쁜 예
function processPayment(order) {
  try {
    validateOrder(order);
    chargeCard(order);
    sendConfirmation(order);
    updateInventory(order);
  } catch (e) {
    console.log(e);
  }
}

// 좋은 예
async function processPayment(order) {
  try {
    await executePaymentFlow(order);
  } catch (error) {
    await handlePaymentError(error, order);
  }
}

async function executePaymentFlow(order) {
  validateOrder(order);
  await chargeCard(order);
  await sendConfirmation(order);
  await updateInventory(order);
}
```

## 조건문 단순화

### Early Return

```javascript
// 나쁜 예
function getDiscount(user) {
  let discount = 0;
  if (user) {
    if (user.membership === 'premium') {
      if (user.yearsActive > 2) {
        discount = 20;
      } else {
        discount = 10;
      }
    }
  }
  return discount;
}

// 좋은 예
function getDiscount(user) {
  if (!user) return 0;
  if (user.membership !== 'premium') return 0;
  if (user.yearsActive > 2) return 20;
  return 10;
}
```

### 조건문을 함수로

```javascript
// 나쁜 예
if (user.age >= 18 && user.hasLicense && !user.isSuspended) {
  allowDriving();
}

// 좋은 예
if (canDrive(user)) {
  allowDriving();
}

function canDrive(user) {
  return user.age >= 18 && user.hasLicense && !user.isSuspended;
}
```

## DRY (Don't Repeat Yourself)

```javascript
// 나쁜 예
function validateUsername(username) {
  if (username.length < 3) throw new Error('Too short');
  if (username.length > 20) throw new Error('Too long');
}

function validatePassword(password) {
  if (password.length < 3) throw new Error('Too short');
  if (password.length > 20) throw new Error('Too long');
}

// 좋은 예
function validateLength(value, min, max, fieldName) {
  if (value.length < min) {
    throw new Error(`${fieldName} is too short (min: ${min})`);
  }
  if (value.length > max) {
    throw new Error(`${fieldName} is too long (max: ${max})`);
  }
}

function validateUsername(username) {
  validateLength(username, 3, 20, 'Username');
}

function validatePassword(password) {
  validateLength(password, 8, 100, 'Password');
}
```

## 포맷팅

### 일관성

팀에서 정한 스타일을 일관되게 따릅니다.

```javascript
// Prettier, ESLint 설정 사용
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}
```

### 수직 정렬

관련된 코드는 가깝게, 다른 개념은 빈 줄로 분리합니다.

```javascript
// 좋은 예
import React from 'react';
import { useState } from 'react';

import { Button } from './components';
import { api } from './services';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, [userId]);

  async function fetchUser() {
    setIsLoading(true);
    const data = await api.getUser(userId);
    setUser(data);
    setIsLoading(false);
  }

  if (isLoading) return <Loading />;
  if (!user) return <NotFound />;

  return <UserCard user={user} />;
}
```

## 리팩토링 시점

다음 상황에서 리팩토링을 고려하세요:

1. **새 기능 추가 전**: 구조를 개선하면 추가가 쉬워짐
2. **버그 수정 시**: 원인을 찾으며 개선점 발견
3. **코드 리뷰 후**: 피드백 반영
4. **"나쁜 냄새" 발견 시**: 중복, 긴 함수, 복잡한 조건문 등

## 마무리

> "어떤 바보도 컴퓨터가 이해할 수 있는 코드를 작성할 수 있다. 좋은 프로그래머는 사람이 이해할 수 있는 코드를 작성한다." - 마틴 파울러

클린 코드는 하루아침에 되지 않습니다. 매일 조금씩 더 나은 코드를 작성하려고 노력하세요. 그리고 기억하세요: **코드는 쓰는 것보다 읽히는 횟수가 훨씬 많습니다.**
