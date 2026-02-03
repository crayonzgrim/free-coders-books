---
title: "알고리즘 기초 입문"
titleEn: "Algorithm Basics Introduction"
description: "프로그래밍 면접과 문제 해결의 기초가 되는 알고리즘 개념을 배웁니다."
descriptionEn: "Learn fundamental algorithm concepts for programming interviews and problem solving."
author: "Free Coders Books"
date: "2026-02-02"
category: "Algorithms"
tags: ["알고리즘", "자료구조", "코딩테스트", "면접"]
readingTime: 18
---

# 알고리즘 기초 입문

알고리즘은 문제를 해결하는 절차입니다. 효율적인 알고리즘을 이해하면 더 빠르고 최적화된 코드를 작성할 수 있습니다.

## 시간 복잡도 (Big O)

알고리즘의 효율성을 측정하는 방법입니다.

### 주요 복잡도

| 표기 | 이름 | 예시 |
|------|------|------|
| O(1) | 상수 | 배열 인덱스 접근 |
| O(log n) | 로그 | 이진 탐색 |
| O(n) | 선형 | 단순 반복 |
| O(n log n) | 선형 로그 | 효율적 정렬 |
| O(n²) | 제곱 | 중첩 반복 |
| O(2ⁿ) | 지수 | 피보나치 재귀 |

### 복잡도 비교 (n=1000일 때)

```
O(1)       = 1
O(log n)   = 10
O(n)       = 1,000
O(n log n) = 10,000
O(n²)      = 1,000,000
O(2ⁿ)      = 끝이 없음...
```

## 기본 자료구조

### 배열 (Array)

```javascript
const arr = [1, 2, 3, 4, 5];

// O(1) - 인덱스 접근
arr[2];  // 3

// O(n) - 검색
arr.indexOf(3);  // 2

// O(n) - 삽입/삭제 (중간에)
arr.splice(2, 0, 10);  // [1, 2, 10, 3, 4, 5]
```

### 객체/해시 맵 (Object/Map)

```javascript
const map = new Map();

// O(1) - 삽입
map.set('key', 'value');

// O(1) - 조회
map.get('key');

// O(1) - 삭제
map.delete('key');

// 활용: 빈도수 세기
function countFrequency(arr) {
  const freq = new Map();
  for (const item of arr) {
    freq.set(item, (freq.get(item) || 0) + 1);
  }
  return freq;
}
```

### 스택 (Stack) - LIFO

```javascript
class Stack {
  constructor() {
    this.items = [];
  }

  push(item) {
    this.items.push(item);
  }

  pop() {
    return this.items.pop();
  }

  peek() {
    return this.items[this.items.length - 1];
  }

  isEmpty() {
    return this.items.length === 0;
  }
}

// 활용: 괄호 검증
function isValidParentheses(s) {
  const stack = [];
  const pairs = { ')': '(', '}': '{', ']': '[' };

  for (const char of s) {
    if ('({['.includes(char)) {
      stack.push(char);
    } else if (')}]'.includes(char)) {
      if (stack.pop() !== pairs[char]) return false;
    }
  }

  return stack.length === 0;
}
```

### 큐 (Queue) - FIFO

```javascript
class Queue {
  constructor() {
    this.items = [];
  }

  enqueue(item) {
    this.items.push(item);
  }

  dequeue() {
    return this.items.shift();
  }

  front() {
    return this.items[0];
  }

  isEmpty() {
    return this.items.length === 0;
  }
}
```

## 정렬 알고리즘

### 버블 정렬 - O(n²)

```javascript
function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}
```

### 퀵 정렬 - O(n log n)

```javascript
function quickSort(arr) {
  if (arr.length <= 1) return arr;

  const pivot = arr[Math.floor(arr.length / 2)];
  const left = arr.filter(x => x < pivot);
  const middle = arr.filter(x => x === pivot);
  const right = arr.filter(x => x > pivot);

  return [...quickSort(left), ...middle, ...quickSort(right)];
}
```

### JavaScript 내장 정렬

```javascript
// 숫자 정렬 (주의!)
[10, 2, 30].sort();           // [10, 2, 30] - 문자열 정렬
[10, 2, 30].sort((a, b) => a - b);  // [2, 10, 30] - 올바른 숫자 정렬

// 객체 정렬
const users = [
  { name: 'Alice', age: 30 },
  { name: 'Bob', age: 25 }
];
users.sort((a, b) => a.age - b.age);
```

## 검색 알고리즘

### 선형 검색 - O(n)

```javascript
function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i;
  }
  return -1;
}
```

### 이진 검색 - O(log n)

**정렬된 배열**에서만 사용 가능합니다.

```javascript
function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return -1;
}
```

## 재귀

자기 자신을 호출하는 함수입니다.

### 기본 구조

```javascript
function recursive(input) {
  // 1. 기저 조건 (종료 조건)
  if (종료조건) {
    return 결과;
  }

  // 2. 재귀 호출
  return recursive(더작은문제);
}
```

### 예제: 팩토리얼

```javascript
// 5! = 5 × 4 × 3 × 2 × 1 = 120
function factorial(n) {
  if (n <= 1) return 1;  // 기저 조건
  return n * factorial(n - 1);  // 재귀 호출
}
```

### 예제: 피보나치

```javascript
// 비효율적 - O(2ⁿ)
function fibRecursive(n) {
  if (n <= 1) return n;
  return fibRecursive(n - 1) + fibRecursive(n - 2);
}

// 효율적 - O(n) with 메모이제이션
function fibMemo(n, memo = {}) {
  if (n in memo) return memo[n];
  if (n <= 1) return n;

  memo[n] = fibMemo(n - 1, memo) + fibMemo(n - 2, memo);
  return memo[n];
}
```

## 자주 나오는 패턴

### Two Pointers

```javascript
// 정렬된 배열에서 합이 target인 두 수 찾기
function twoSum(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left < right) {
    const sum = arr[left] + arr[right];
    if (sum === target) {
      return [left, right];
    } else if (sum < target) {
      left++;
    } else {
      right--;
    }
  }

  return [-1, -1];
}
```

### Sliding Window

```javascript
// 크기 k인 연속 부분 배열의 최대 합
function maxSubarraySum(arr, k) {
  if (arr.length < k) return null;

  let windowSum = arr.slice(0, k).reduce((a, b) => a + b);
  let maxSum = windowSum;

  for (let i = k; i < arr.length; i++) {
    windowSum = windowSum - arr[i - k] + arr[i];
    maxSum = Math.max(maxSum, windowSum);
  }

  return maxSum;
}
```

### 빈도수 세기

```javascript
// 애너그램 검사
function isAnagram(s1, s2) {
  if (s1.length !== s2.length) return false;

  const count = {};

  for (const char of s1) {
    count[char] = (count[char] || 0) + 1;
  }

  for (const char of s2) {
    if (!count[char]) return false;
    count[char]--;
  }

  return true;
}
```

## 연습 문제 추천

### 입문
1. 배열에서 최댓값/최솟값 찾기
2. 배열 뒤집기
3. 팰린드롬 검사
4. 중복 제거

### 초급
1. Two Sum
2. 괄호 검증
3. 이진 검색 구현
4. 애너그램 검사

### 중급
1. 연속 부분 배열 최대 합
2. 이진 트리 순회
3. BFS/DFS
4. 동적 프로그래밍 입문

## 학습 팁

1. **손으로 먼저**: 코드 전에 종이에 과정 그려보기
2. **작은 예제로**: 간단한 입력으로 동작 확인
3. **시간 복잡도 분석**: 항상 효율성 생각하기
4. **꾸준한 연습**: 매일 1-2문제씩
5. **패턴 인식**: 비슷한 문제 유형 파악하기

## 추천 학습 사이트

- LeetCode
- 프로그래머스
- 백준 온라인 저지
- HackerRank

## 마무리

알고리즘은 처음에는 어렵지만, 패턴을 익히면 점점 쉬워집니다. 코딩 테스트뿐만 아니라 실무에서도 효율적인 코드를 작성하는 데 도움이 됩니다. 꾸준히 연습하세요!
