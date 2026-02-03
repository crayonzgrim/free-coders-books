---
title: "JavaScript 완전 초보자 가이드"
titleEn: "JavaScript Complete Beginner Guide"
description: "JavaScript를 처음 배우는 분들을 위한 기초 가이드입니다. 기본 문법부터 실용적인 예제까지 단계별로 설명합니다."
descriptionEn: "A basic guide for those learning JavaScript for the first time. Step-by-step explanations from basic syntax to practical examples."
author: "Free Coders Books"
date: "2024-02-01"
category: "javascript"
tags: ["JavaScript", "웹개발", "프론트엔드"]
readingTime: 15
---

# JavaScript 완전 초보자 가이드

JavaScript는 웹 개발의 핵심 언어입니다. 이 가이드에서는 JavaScript의 기초를 처음부터 차근차근 배워봅니다.

## JavaScript란?

JavaScript는 1995년 Brendan Eich가 단 10일 만에 만든 프로그래밍 언어입니다. 처음에는 웹 페이지에 간단한 상호작용을 추가하기 위해 만들어졌지만, 지금은 웹 개발의 필수 언어가 되었습니다.

### JavaScript로 할 수 있는 것들
- 웹 페이지 동적 제어
- 서버 개발 (Node.js)
- 모바일 앱 개발 (React Native)
- 데스크톱 앱 개발 (Electron)
- 게임 개발

## 기본 문법

### 변수 선언

```javascript
// let: 변경 가능한 변수
let name = "홍길동";
name = "김철수"; // 변경 가능

// const: 변경 불가능한 상수
const PI = 3.14159;
// PI = 3; // 에러 발생!

// var: 예전 방식 (사용 권장하지 않음)
var oldStyle = "옛날 방식";
```

### 자료형 (Data Types)

```javascript
// 숫자 (Number)
let age = 25;
let price = 19.99;

// 문자열 (String)
let greeting = "안녕하세요";
let message = '작은따옴표도 가능';
let template = `템플릿 리터럴: ${name}님`; // 백틱

// 불리언 (Boolean)
let isActive = true;
let isCompleted = false;

// 배열 (Array)
let fruits = ["사과", "바나나", "오렌지"];
console.log(fruits[0]); // "사과"

// 객체 (Object)
let person = {
  name: "홍길동",
  age: 25,
  city: "서울"
};
console.log(person.name); // "홍길동"
```

### 조건문

```javascript
let score = 85;

if (score >= 90) {
  console.log("A학점");
} else if (score >= 80) {
  console.log("B학점");
} else if (score >= 70) {
  console.log("C학점");
} else {
  console.log("D학점");
}

// 삼항 연산자
let result = score >= 60 ? "합격" : "불합격";
```

### 반복문

```javascript
// for 문
for (let i = 0; i < 5; i++) {
  console.log(i); // 0, 1, 2, 3, 4
}

// while 문
let count = 0;
while (count < 3) {
  console.log(count);
  count++;
}

// 배열 순회
let colors = ["빨강", "파랑", "초록"];

// forEach
colors.forEach(function(color) {
  console.log(color);
});

// for...of
for (let color of colors) {
  console.log(color);
}
```

### 함수

```javascript
// 함수 선언식
function greet(name) {
  return `안녕하세요, ${name}님!`;
}

// 함수 표현식
const add = function(a, b) {
  return a + b;
};

// 화살표 함수 (Arrow Function)
const multiply = (a, b) => a * b;

// 사용
console.log(greet("홍길동")); // "안녕하세요, 홍길동님!"
console.log(add(3, 5)); // 8
console.log(multiply(4, 6)); // 24
```

## 실용적인 예제

### 예제 1: 간단한 계산기

```javascript
function calculator(num1, num2, operator) {
  switch (operator) {
    case '+':
      return num1 + num2;
    case '-':
      return num1 - num2;
    case '*':
      return num1 * num2;
    case '/':
      return num2 !== 0 ? num1 / num2 : "0으로 나눌 수 없습니다";
    default:
      return "알 수 없는 연산자";
  }
}

console.log(calculator(10, 5, '+')); // 15
console.log(calculator(10, 5, '-')); // 5
```

### 예제 2: 배열 필터링

```javascript
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// 짝수만 필터링
const evenNumbers = numbers.filter(num => num % 2 === 0);
console.log(evenNumbers); // [2, 4, 6, 8, 10]

// 각 숫자를 2배로
const doubled = numbers.map(num => num * 2);
console.log(doubled); // [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]

// 모든 숫자의 합
const sum = numbers.reduce((acc, num) => acc + num, 0);
console.log(sum); // 55
```

### 예제 3: DOM 조작

```javascript
// HTML 요소 선택
const button = document.querySelector('#myButton');
const output = document.querySelector('#output');

// 클릭 이벤트 추가
button.addEventListener('click', function() {
  output.textContent = '버튼이 클릭되었습니다!';
  output.style.color = 'blue';
});
```

## 다음 단계

JavaScript 기초를 익혔다면, 다음 단계로 넘어가보세요:

1. **DOM 조작 심화**: 웹 페이지 동적 제어
2. **비동기 처리**: Promise, async/await
3. **프레임워크 학습**: React, Vue, Angular
4. **백엔드 개발**: Node.js, Express

## 추천 학습 자료

이 사이트에서 JavaScript 관련 무료 도서들을 찾아보세요. 기초부터 고급까지 다양한 자료가 준비되어 있습니다.

꾸준히 학습하고 직접 코드를 작성해보세요. 실습이 최고의 선생님입니다!
