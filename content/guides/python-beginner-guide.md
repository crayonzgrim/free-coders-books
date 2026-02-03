---
title: "Python 입문자를 위한 기초 가이드"
titleEn: "Python Basics Guide for Beginners"
description: "Python을 처음 배우는 분들을 위한 기초 문법 가이드입니다. 간단한 예제와 함께 Python의 기본을 익혀보세요."
descriptionEn: "A basic syntax guide for those new to Python. Learn the basics of Python with simple examples."
author: "Free Coders Books"
date: "2024-02-01"
category: "python"
tags: ["Python", "입문", "기초문법"]
readingTime: 12
---

# Python 입문자를 위한 기초 가이드

Python은 가장 배우기 쉬운 프로그래밍 언어 중 하나입니다. 간결한 문법과 풍부한 라이브러리 덕분에 초보자부터 전문가까지 널리 사용됩니다.

## Python이란?

Python은 1991년 귀도 반 로섬(Guido van Rossum)이 만든 프로그래밍 언어입니다. "읽기 쉬운 코드"를 철학으로 삼아 설계되었습니다.

### Python의 특징
- **간결한 문법**: 다른 언어보다 적은 코드로 같은 기능 구현
- **다목적 언어**: 웹, 데이터 분석, AI, 자동화 등 다양한 분야
- **풍부한 생태계**: 수많은 라이브러리와 프레임워크
- **커뮤니티**: 활발한 개발자 커뮤니티

## 기본 문법

### Hello, World!

```python
print("Hello, World!")
print("안녕하세요!")
```

### 변수

Python에서는 변수 타입을 명시하지 않아도 됩니다.

```python
# 숫자
age = 25
price = 19.99
count = 1_000_000  # 가독성을 위한 언더스코어

# 문자열
name = "홍길동"
message = '작은따옴표도 가능'
long_text = """
여러 줄
문자열
"""

# 불리언
is_active = True
is_completed = False

# None (값이 없음)
result = None
```

### 자료형 확인

```python
print(type(25))        # <class 'int'>
print(type(3.14))      # <class 'float'>
print(type("문자열"))   # <class 'str'>
print(type(True))      # <class 'bool'>
```

### 문자열 다루기

```python
name = "Python"

# 문자열 연결
greeting = "Hello, " + name + "!"
print(greeting)  # Hello, Python!

# f-string (권장)
message = f"Hello, {name}!"
print(message)  # Hello, Python!

# 문자열 메서드
text = "  Hello World  "
print(text.strip())      # "Hello World" (공백 제거)
print(text.lower())      # "  hello world  "
print(text.upper())      # "  HELLO WORLD  "
print(text.replace("World", "Python"))  # "  Hello Python  "
print(text.split())      # ['Hello', 'World']
```

### 리스트 (List)

```python
# 리스트 생성
fruits = ["사과", "바나나", "오렌지"]
numbers = [1, 2, 3, 4, 5]
mixed = [1, "문자", True, 3.14]

# 인덱싱
print(fruits[0])   # "사과" (첫 번째)
print(fruits[-1])  # "오렌지" (마지막)

# 슬라이싱
print(numbers[1:4])   # [2, 3, 4]
print(numbers[:3])    # [1, 2, 3]
print(numbers[2:])    # [3, 4, 5]

# 리스트 조작
fruits.append("포도")        # 끝에 추가
fruits.insert(1, "딸기")     # 인덱스 1에 삽입
fruits.remove("바나나")      # 값으로 제거
popped = fruits.pop()        # 마지막 요소 제거 후 반환

# 리스트 길이
print(len(fruits))
```

### 딕셔너리 (Dictionary)

```python
# 딕셔너리 생성
person = {
    "name": "홍길동",
    "age": 25,
    "city": "서울"
}

# 값 접근
print(person["name"])       # "홍길동"
print(person.get("age"))    # 25
print(person.get("job", "없음"))  # 키가 없으면 기본값 반환

# 값 수정/추가
person["age"] = 26
person["job"] = "개발자"

# 딕셔너리 순회
for key, value in person.items():
    print(f"{key}: {value}")
```

### 조건문

```python
score = 85

if score >= 90:
    print("A학점")
elif score >= 80:
    print("B학점")
elif score >= 70:
    print("C학점")
else:
    print("D학점")

# 한 줄 조건문
result = "합격" if score >= 60 else "불합격"
print(result)
```

### 반복문

```python
# for 문
fruits = ["사과", "바나나", "오렌지"]

for fruit in fruits:
    print(fruit)

# range 사용
for i in range(5):
    print(i)  # 0, 1, 2, 3, 4

for i in range(1, 6):
    print(i)  # 1, 2, 3, 4, 5

# enumerate (인덱스와 함께)
for index, fruit in enumerate(fruits):
    print(f"{index}: {fruit}")

# while 문
count = 0
while count < 3:
    print(count)
    count += 1
```

### 함수

```python
# 기본 함수
def greet(name):
    return f"안녕하세요, {name}님!"

print(greet("홍길동"))

# 기본값 매개변수
def greet_with_time(name, time="아침"):
    return f"{time}이에요, {name}님!"

print(greet_with_time("홍길동"))
print(greet_with_time("홍길동", "저녁"))

# 여러 값 반환
def get_stats(numbers):
    return min(numbers), max(numbers), sum(numbers)

minimum, maximum, total = get_stats([1, 2, 3, 4, 5])
print(f"최소: {minimum}, 최대: {maximum}, 합계: {total}")

# 람다 함수
square = lambda x: x ** 2
print(square(5))  # 25
```

### 리스트 컴프리헨션

```python
# 기본 형태
squares = [x ** 2 for x in range(10)]
print(squares)  # [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]

# 조건 포함
evens = [x for x in range(20) if x % 2 == 0]
print(evens)  # [0, 2, 4, 6, 8, 10, 12, 14, 16, 18]

# 딕셔너리 컴프리헨션
squared_dict = {x: x ** 2 for x in range(5)}
print(squared_dict)  # {0: 0, 1: 1, 2: 4, 3: 9, 4: 16}
```

## 실용적인 예제

### 예제 1: 성적 계산기

```python
def calculate_grade(scores):
    """성적을 계산하고 학점을 반환합니다."""
    average = sum(scores) / len(scores)

    if average >= 90:
        grade = "A"
    elif average >= 80:
        grade = "B"
    elif average >= 70:
        grade = "C"
    elif average >= 60:
        grade = "D"
    else:
        grade = "F"

    return average, grade

scores = [85, 90, 78, 92]
avg, grade = calculate_grade(scores)
print(f"평균: {avg:.2f}, 학점: {grade}")
```

### 예제 2: 단어 빈도수 계산

```python
def count_words(text):
    """텍스트에서 단어 빈도수를 계산합니다."""
    words = text.lower().split()
    word_count = {}

    for word in words:
        word_count[word] = word_count.get(word, 0) + 1

    return word_count

text = "Python is great Python is fun Python is easy"
result = count_words(text)
print(result)
# {'python': 3, 'is': 3, 'great': 1, 'fun': 1, 'easy': 1}
```

### 예제 3: 파일 읽고 쓰기

```python
# 파일 쓰기
with open("example.txt", "w", encoding="utf-8") as f:
    f.write("Hello, Python!\n")
    f.write("파이썬 학습 중입니다.\n")

# 파일 읽기
with open("example.txt", "r", encoding="utf-8") as f:
    content = f.read()
    print(content)
```

## 다음 단계

Python 기초를 익혔다면, 관심 분야에 따라 다음을 학습하세요:

| 분야 | 추천 라이브러리 |
|------|-----------------|
| 웹 개발 | Django, Flask, FastAPI |
| 데이터 분석 | pandas, numpy, matplotlib |
| 머신러닝 | scikit-learn, TensorFlow, PyTorch |
| 자동화 | selenium, requests, beautifulsoup |

## 마무리

Python은 배우기 쉽지만 마스터하기는 어렵습니다. 꾸준히 코드를 작성하고, 작은 프로젝트부터 시작해보세요.

이 사이트에서 Python 관련 무료 도서들을 찾아 더 깊이 학습해보세요!
