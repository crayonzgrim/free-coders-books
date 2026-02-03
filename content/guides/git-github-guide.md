---
title: "Git과 GitHub 실전 가이드"
titleEn: "Practical Git and GitHub Guide"
description: "버전 관리의 기초부터 협업 워크플로우까지, Git과 GitHub를 실무에서 활용하는 방법을 배웁니다."
descriptionEn: "Learn Git and GitHub from basics to collaboration workflows for real-world projects."
author: "Free Coders Books"
date: "2026-02-01"
category: "DevOps"
tags: ["Git", "GitHub", "버전관리", "협업"]
readingTime: 18
---

# Git과 GitHub 실전 가이드

Git은 코드의 변경 이력을 관리하는 버전 관리 시스템이고, GitHub는 Git 저장소를 호스팅하고 협업할 수 있는 플랫폼입니다.

## Git을 배워야 하는 이유

1. **변경 이력 추적**: 누가, 언제, 왜 코드를 변경했는지 기록
2. **실수 복구**: 언제든 이전 버전으로 되돌릴 수 있음
3. **협업**: 여러 개발자가 동시에 작업 가능
4. **필수 역량**: 모든 개발 회사에서 Git 사용

## Git 기초 명령어

### 저장소 초기화

```bash
# 새 저장소 생성
git init

# 기존 저장소 복제
git clone https://github.com/user/repo.git
```

### 기본 워크플로우

```bash
# 1. 파일 상태 확인
git status

# 2. 변경 사항 스테이징
git add filename.js     # 특정 파일
git add .               # 모든 변경 파일

# 3. 커밋 생성
git commit -m "변경 내용 설명"

# 4. 원격 저장소에 푸시
git push origin main
```

### 브랜치 작업

```bash
# 브랜치 목록 확인
git branch

# 새 브랜치 생성 및 전환
git checkout -b feature/new-feature

# 브랜치 전환
git checkout main

# 브랜치 병합
git merge feature/new-feature

# 브랜치 삭제
git branch -d feature/new-feature
```

## 커밋 메시지 작성법

좋은 커밋 메시지는 협업과 유지보수에 매우 중요합니다.

### 커밋 메시지 구조

```
<타입>: <제목>

<본문>

<꼬리말>
```

### 타입 예시

- `feat`: 새로운 기능
- `fix`: 버그 수정
- `docs`: 문서 변경
- `style`: 코드 포맷팅
- `refactor`: 리팩토링
- `test`: 테스트 추가/수정
- `chore`: 빌드, 설정 변경

### 좋은 커밋 메시지 예시

```bash
git commit -m "feat: 사용자 로그인 기능 추가"
git commit -m "fix: 장바구니 총액 계산 오류 수정"
git commit -m "docs: API 문서에 인증 섹션 추가"
```

## GitHub 협업 워크플로우

### Fork & Pull Request 방식

1. **Fork**: 원본 저장소를 내 계정으로 복사
2. **Clone**: Fork한 저장소를 로컬로 복제
3. **Branch**: 기능 브랜치 생성
4. **Commit**: 변경 사항 커밋
5. **Push**: Fork한 저장소에 푸시
6. **Pull Request**: 원본 저장소에 병합 요청

### 실전 예시

```bash
# 1. Fork한 저장소 클론
git clone https://github.com/myusername/project.git
cd project

# 2. 원본 저장소 추가
git remote add upstream https://github.com/original/project.git

# 3. 기능 브랜치 생성
git checkout -b feature/awesome-feature

# 4. 작업 후 커밋
git add .
git commit -m "feat: 멋진 기능 추가"

# 5. 내 저장소에 푸시
git push origin feature/awesome-feature

# 6. GitHub에서 Pull Request 생성
```

### 원본 저장소와 동기화

```bash
# 원본의 최신 변경사항 가져오기
git fetch upstream

# main 브랜치에 병합
git checkout main
git merge upstream/main

# 내 저장소에 반영
git push origin main
```

## 충돌 해결하기

두 브랜치에서 같은 부분을 수정하면 충돌이 발생합니다.

### 충돌 발생 시

```bash
git merge feature-branch
# Auto-merging file.js
# CONFLICT (content): Merge conflict in file.js
```

### 충돌 파일 내용

```javascript
<<<<<<< HEAD
const message = "현재 브랜치의 코드";
=======
const message = "병합하려는 브랜치의 코드";
>>>>>>> feature-branch
```

### 해결 방법

1. 충돌 마커(<<<, ===, >>>)를 찾아서
2. 원하는 코드를 선택하거나 조합
3. 충돌 마커 삭제
4. 저장 후 커밋

```bash
git add file.js
git commit -m "merge: feature-branch 병합 충돌 해결"
```

## 유용한 Git 명령어

### 변경 사항 확인

```bash
# 변경된 내용 보기
git diff

# 스테이징된 변경 보기
git diff --staged

# 커밋 로그 보기
git log --oneline --graph
```

### 실수 되돌리기

```bash
# 스테이징 취소
git reset HEAD filename

# 마지막 커밋 수정
git commit --amend

# 특정 커밋으로 되돌리기 (이력 유지)
git revert <commit-hash>

# 강제로 이전 상태로 (주의!)
git reset --hard <commit-hash>
```

### 임시 저장

```bash
# 현재 변경사항 임시 저장
git stash

# 임시 저장 목록
git stash list

# 복원
git stash pop
```

## .gitignore 설정

버전 관리에서 제외할 파일들을 지정합니다.

```
# .gitignore 예시

# 의존성
node_modules/
vendor/

# 빌드 결과물
dist/
build/

# 환경 변수
.env
.env.local

# IDE 설정
.vscode/
.idea/

# 로그
*.log

# OS 파일
.DS_Store
Thumbs.db
```

## GitHub 기능 활용

### Issues

- 버그 리포트
- 기능 요청
- 작업 관리

### Projects

- 칸반 보드
- 작업 진행 상황 추적

### Actions

- CI/CD 자동화
- 테스트 자동 실행
- 배포 자동화

## 실무 팁

1. **자주 커밋하기**: 작은 단위로 커밋하면 문제 추적이 쉬움
2. **브랜치 전략 정하기**: Git Flow, GitHub Flow 등
3. **PR 리뷰 문화**: 코드 품질 향상
4. **의미 있는 커밋 메시지**: 나중에 볼 사람을 위해

## 마무리

Git은 처음에는 복잡해 보이지만, 기본 명령어 몇 개만 익히면 일상적인 개발에는 충분합니다. 협업 프로젝트에 참여하면서 자연스럽게 고급 기능도 익히게 됩니다. 실수해도 대부분 복구할 수 있으니 두려워하지 말고 사용해보세요!
