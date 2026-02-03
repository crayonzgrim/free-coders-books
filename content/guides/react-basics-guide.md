---
title: "React 기초 완벽 가이드"
titleEn: "Complete React Basics Guide"
description: "React의 핵심 개념인 컴포넌트, JSX, State, Props를 단계별로 배워보세요."
descriptionEn: "Learn React core concepts step by step including components, JSX, State, and Props."
author: "Free Coders Books"
date: "2026-02-01"
category: "React"
tags: ["React", "JavaScript", "프론트엔드", "웹개발"]
readingTime: 12
---

# React 기초 완벽 가이드

React는 Facebook에서 개발한 사용자 인터페이스를 만들기 위한 JavaScript 라이브러리입니다. 이 가이드에서는 React의 핵심 개념을 처음부터 차근차근 배워봅니다.

## React란 무엇인가?

React는 **컴포넌트 기반**의 UI 라이브러리입니다. 웹 페이지를 작은 조각(컴포넌트)으로 나누어 개발하고, 이들을 조합해 완전한 애플리케이션을 만듭니다.

### React의 장점

1. **컴포넌트 재사용성**: 한 번 만든 컴포넌트를 여러 곳에서 사용
2. **Virtual DOM**: 빠른 렌더링 성능
3. **단방향 데이터 흐름**: 예측 가능한 상태 관리
4. **풍부한 생태계**: 수많은 라이브러리와 도구

## 첫 번째 React 컴포넌트

```jsx
function Welcome() {
  return <h1>안녕하세요, React!</h1>;
}
```

이것이 가장 간단한 React 컴포넌트입니다. 함수가 JSX를 반환하면 그것이 곧 컴포넌트입니다.

## JSX 이해하기

JSX는 JavaScript XML의 약자로, JavaScript 안에서 HTML과 유사한 문법을 사용할 수 있게 해줍니다.

```jsx
// JSX 예시
const element = (
  <div className="container">
    <h1>제목</h1>
    <p>내용입니다.</p>
  </div>
);
```

### JSX의 규칙

1. **하나의 루트 요소**: 여러 요소는 하나로 감싸야 함
2. **모든 태그 닫기**: `<img />` 처럼 self-closing 필수
3. **camelCase 속성**: `className`, `onClick` 등

## Props: 컴포넌트에 데이터 전달

Props는 부모 컴포넌트에서 자식 컴포넌트로 데이터를 전달하는 방법입니다.

```jsx
function Greeting({ name }) {
  return <h1>안녕하세요, {name}님!</h1>;
}

// 사용
<Greeting name="철수" />
```

## State: 컴포넌트의 상태 관리

State는 컴포넌트 내부에서 관리하는 변경 가능한 데이터입니다.

```jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>클릭 횟수: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        클릭
      </button>
    </div>
  );
}
```

### useState 훅

- `useState(초기값)`: 상태와 상태 변경 함수를 반환
- 상태가 변경되면 컴포넌트가 다시 렌더링됨

## 이벤트 처리

React에서 이벤트는 camelCase로 작성합니다.

```jsx
function Button() {
  const handleClick = () => {
    alert('버튼이 클릭됐습니다!');
  };

  return <button onClick={handleClick}>클릭</button>;
}
```

## 조건부 렌더링

```jsx
function LoginButton({ isLoggedIn }) {
  if (isLoggedIn) {
    return <button>로그아웃</button>;
  }
  return <button>로그인</button>;
}

// 또는 삼항 연산자 사용
function Status({ isOnline }) {
  return <span>{isOnline ? '온라인' : '오프라인'}</span>;
}
```

## 리스트 렌더링

```jsx
function TodoList({ todos }) {
  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.id}>{todo.text}</li>
      ))}
    </ul>
  );
}
```

> **중요**: 리스트를 렌더링할 때는 반드시 고유한 `key` 속성을 제공해야 합니다.

## useEffect: 사이드 이펙트 처리

useEffect는 컴포넌트가 렌더링된 후 실행되는 코드를 작성할 때 사용합니다.

```jsx
import { useState, useEffect } from 'react';

function DataFetcher() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(setData);
  }, []); // 빈 배열 = 마운트 시 한 번만 실행

  return <div>{data ? data.name : '로딩 중...'}</div>;
}
```

## 다음 단계

React 기초를 익혔다면 다음 주제들을 학습해보세요:

1. **React Router**: 페이지 라우팅
2. **상태 관리 라이브러리**: Redux, Zustand, Jotai
3. **스타일링**: Styled Components, Tailwind CSS
4. **서버 사이드 렌더링**: Next.js

## 마무리

React는 처음에는 낯설 수 있지만, 컴포넌트 사고방식에 익숙해지면 매우 생산적인 개발이 가능합니다. 작은 프로젝트부터 시작해서 점점 복잡한 애플리케이션을 만들어보세요!
