---
title: "CSS 레이아웃 마스터하기"
titleEn: "Mastering CSS Layout"
description: "Flexbox와 Grid를 활용한 현대적인 CSS 레이아웃 기법을 배워보세요."
descriptionEn: "Learn modern CSS layout techniques with Flexbox and Grid."
author: "Free Coders Books"
date: "2026-02-01"
category: "CSS"
tags: ["CSS", "Flexbox", "Grid", "웹디자인"]
readingTime: 15
---

# CSS 레이아웃 마스터하기

웹 페이지의 레이아웃을 구성하는 것은 프론트엔드 개발의 핵심입니다. 현대 CSS에서는 **Flexbox**와 **Grid**가 레이아웃의 양대 산맥입니다.

## 전통적인 레이아웃의 문제점

과거에는 `float`, `position`, `table` 등을 조합해 레이아웃을 만들었습니다. 하지만 이 방법들은:

- 코드가 복잡해짐
- 반응형 디자인이 어려움
- 수직 중앙 정렬이 까다로움

## Flexbox: 1차원 레이아웃

Flexbox는 한 방향(가로 또는 세로)으로 요소를 배치할 때 최적입니다.

### 기본 사용법

```css
.container {
  display: flex;
}
```

이것만으로 자식 요소들이 가로로 나란히 배치됩니다.

### 주요 속성

#### 컨테이너 속성

```css
.container {
  display: flex;

  /* 주축 방향 */
  flex-direction: row | column;

  /* 주축 정렬 */
  justify-content: flex-start | center | space-between | space-around;

  /* 교차축 정렬 */
  align-items: stretch | flex-start | center | flex-end;

  /* 줄바꿈 */
  flex-wrap: nowrap | wrap;

  /* 요소 간 간격 */
  gap: 20px;
}
```

#### 아이템 속성

```css
.item {
  /* 늘어나는 비율 */
  flex-grow: 1;

  /* 줄어드는 비율 */
  flex-shrink: 0;

  /* 기본 크기 */
  flex-basis: 200px;

  /* 단축 속성 */
  flex: 1 0 200px;
}
```

### 실용적인 예제

#### 네비게이션 바

```css
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
}

.nav-links {
  display: flex;
  gap: 2rem;
}
```

#### 카드 레이아웃

```css
.card-container {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.card {
  flex: 1 1 300px; /* 최소 300px, 균등 분배 */
}
```

#### 수직 수평 중앙 정렬

```css
.center-box {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
```

## CSS Grid: 2차원 레이아웃

Grid는 행과 열을 동시에 다루는 2차원 레이아웃에 적합합니다.

### 기본 사용법

```css
.grid-container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 20px;
}
```

### 주요 속성

```css
.grid-container {
  display: grid;

  /* 열 정의 */
  grid-template-columns: 200px 1fr 2fr;
  grid-template-columns: repeat(3, 1fr);
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));

  /* 행 정의 */
  grid-template-rows: 100px auto 100px;

  /* 간격 */
  gap: 20px;
  column-gap: 20px;
  row-gap: 10px;
}
```

### 아이템 배치

```css
.item {
  /* 특정 위치 지정 */
  grid-column: 1 / 3; /* 1번부터 3번 열까지 */
  grid-row: 2 / 4;    /* 2번부터 4번 행까지 */

  /* 단축 */
  grid-area: 2 / 1 / 4 / 3;
}
```

### 실용적인 예제

#### 반응형 그리드

```css
.responsive-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}
```

#### 대시보드 레이아웃

```css
.dashboard {
  display: grid;
  grid-template-columns: 250px 1fr;
  grid-template-rows: 60px 1fr;
  min-height: 100vh;
}

.sidebar {
  grid-row: 1 / 3;
}

.header {
  grid-column: 2;
}

.main {
  grid-column: 2;
}
```

#### Named Grid Areas

```css
.layout {
  display: grid;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
  grid-template-columns: 200px 1fr;
  grid-template-rows: auto 1fr auto;
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main { grid-area: main; }
.footer { grid-area: footer; }
```

## Flexbox vs Grid: 언제 무엇을?

| 상황 | 추천 |
|------|------|
| 네비게이션, 버튼 그룹 | Flexbox |
| 단일 행/열 정렬 | Flexbox |
| 카드 그리드 | Grid |
| 복잡한 페이지 레이아웃 | Grid |
| 아이템 크기가 콘텐츠에 따라 다름 | Flexbox |
| 정확한 그리드가 필요함 | Grid |

## 반응형 디자인 팁

### 미디어 쿼리와 함께 사용

```css
.container {
  display: grid;
  grid-template-columns: 1fr;
}

@media (min-width: 768px) {
  .container {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .container {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

### 자동 반응형 그리드

```css
/* 미디어 쿼리 없이 반응형! */
.auto-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}
```

## 연습 과제

1. Flexbox로 헤더 만들기: 로고 왼쪽, 메뉴 오른쪽
2. Grid로 이미지 갤러리 만들기
3. 전체 페이지 레이아웃 구성하기

## 마무리

Flexbox와 Grid는 현대 CSS의 핵심입니다. 처음에는 속성이 많아 헷갈릴 수 있지만, 실제로 레이아웃을 만들어보면서 익히면 금방 자연스러워집니다. 두 기술을 적절히 조합하면 어떤 레이아웃도 구현할 수 있습니다!
