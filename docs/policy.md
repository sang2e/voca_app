Policy Guide
Claude Code가 작업할 때 반드시 지켜야 하는 강제 정책 문서입니다.
common.md는 프로젝트 구조와 개발 가이드 중심으로 관리하고, 이 문서는 반드시 지켜야 하는 규칙만 분리해서 관리합니다.

1. 기본 코드 원칙
1.1 JSX 안에 인라인 로직/인라인 함수 남용 금지
JSX 안에서는 복잡한 로직, 중첩 삼항 연산자, 인라인 함수를 남용하지 않는다.
Bad
<button onClick={() => onOpen(id)}>열기</button>
<span>{score > 80 ? 'A' : score > 60 ? 'B' : 'C'}</span>
Good
const handleOpen = () => {
  onOpen(id);
};

const grade = getGrade(score);

return (
  <>
    <button type="button" onClick={handleOpen}>열기</button>
    <span>{grade}</span>
  </>
);

1.2 클릭 가능한 요소는 button 또는 a만 사용
클릭, 이동, 실행 동작이 있는 요소는 반드시 button 또는 a를 사용한다.
Bad
<div onClick={onSave}>저장</div>
<span onClick={onClose}>닫기</span>
Good
<button type="button" onClick={onSave}>저장</button>
<button type="button" onClick={onClose}>닫기</button>

1.3 화살촉 코드 금지
조건이 늘어날수록 오른쪽으로 밀려 들어가는 구조를 금지한다.
Bad
function getBadge(user) {
  if (user.isAdmin) {
    return 'ADMIN';
  } else {
    if (user.isVip) {
      return 'VIP';
    } else {
      if (user.isNew) {
        return 'NEW';
      } else {
        return 'NORMAL';
      }
    }
  }
}
Bad: else if 체인 남용
function getBadge(user) {
  if (user.isAdmin) {
    return 'ADMIN';
  } else if (user.isVip) {
    return 'VIP';
  } else if (user.isNew) {
    return 'NEW';
  } else if (user.isTester) {
    return 'TESTER';
  } else {
    return 'NORMAL';
  }
}

1.4 조건 분기 권장 방식
조건 분기는 아래 방식 중 하나를 사용한다.
	•	Guard 패턴
	•	switch
	•	매핑 객체
	•	우선순위 규칙 배열
Good: Guard 패턴
function getBadge(user) {
  if (user.isAdmin) return 'ADMIN';
  if (user.isVip) return 'VIP';
  if (user.isNew) return 'NEW';

  return 'NORMAL';
}
Good: 우선순위 배열 기반
const BADGE_RULES = [
  { check: user => user.isAdmin, value: 'ADMIN' },
  { check: user => user.isVip, value: 'VIP' },
  { check: user => user.isNew, value: 'NEW' },
];

function getBadge(user) {
  const rule = BADGE_RULES.find(ruleItem => ruleItem.check(user));

  return rule?.value ?? 'NORMAL';
}

1.5 컴포넌트에서 비즈니스 로직 직접 처리 금지
컴포넌트는 UI 조합과 렌더링을 담당한다.
계산, 검증, 변환, 업무 규칙은 함수 또는 hook으로 분리한다.
Bad
export const Price = ({ price, grade }) => {
  const finalPrice = grade === 'VIP' ? Math.floor(price * 0.9) : price;

  return <span>{finalPrice}원</span>;
};
Good
function calcFinalPrice(price, grade) {
  if (grade === 'VIP') return Math.floor(price * 0.9);

  return price;
}

export const Price = ({ price, grade }) => {
  return <span>{calcFinalPrice(price, grade)}원</span>;
};

1.6 파생값을 state로 복제하지 않는다
기존 state 또는 props에서 계산 가능한 값은 state로 만들지 않는다.
Bad
const [total, setTotal] = useState(0);

useEffect(() => {
  setTotal(items.reduce((sum, item) => sum + item.price, 0));
}, [items]);
Good
const total = useMemo(() => {
  return items.reduce((sum, item) => sum + item.price, 0);
}, [items]);

1.7 useEffect 의존성 배열 무시 금지
react-hooks/exhaustive-deps 경고를 임의로 끄지 않는다.
Bad
useEffect(() => {
  fetchUser(userId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);
Good
useEffect(() => {
  fetchUser(userId);
}, [fetchUser, userId]);

2. 네이밍 정책
2.1 리소스 파일명 기본 원칙
이미지, 아이콘, 일러스트 등 리소스 파일명은 아래 규칙을 따른다.
	•	모든 파일명은 소문자를 사용한다.
	•	단어 구분은 하이픈(-)을 사용한다.
	•	공백, 한글, 특수문자는 사용하지 않는다.
	•	의미 기반으로 네이밍한다.
prefix-name-option.ext

2.2 아이콘 네이밍
icon-{name}-{direction}-{color}-{state}.svg
Good
icon-close.svg
icon-arrow-right.svg
icon-arrow-left.svg
icon-arrow-right-white.svg
icon-play-circle.svg
icon-check-disabled.svg

2.3 이미지 네이밍
img-{section}-{description}.png
Good
img-hero-banner.png
img-card-background.png
img-login-background.png
img-profile-default.png
img-empty-state.png

2.4 상태/옵션 네이밍
옵션
예시
방향
left, right, top, bottom
색상
white, black, primary
상태
active, disabled, hover
크기
sm, md, lg
Good
icon-arrow-right-white.svg
icon-check-active.svg
icon-arrow-left-sm.svg
Bad
IconClose.svg
icon_close.svg
closeIcon.svg
arrowRight.svg
Good
icon-close.svg
icon-arrow-right.svg

2.5 리소스 폴더 분리
assets/
├── icons/
│   ├── icon-close.svg
│   └── icon-arrow-right.svg
│
├── images/
│   ├── img-hero-banner.png
│   └── img-card-background.png
│
└── illustrations/
    └── illust-empty-box.svg

3. 코드 컨벤션
3.1 기본 원칙
	•	함수형 컴포넌트만 사용한다.
	•	default export를 금지한다.
	•	named export만 허용한다.
	•	페이지는 조합만 담당한다.
	•	비즈니스 로직은 hooks 또는 util 함수로 분리한다.
	•	공통 UI는 common/components에만 작성한다.
	•	Effect는 동기화 목적으로만 사용한다.

3.2 파일/코드 네이밍 규칙
대상
규칙
예시
컴포넌트
PascalCase
UserCard.jsx
hooks
camelCase + use prefix
useLogin.js
폴더
camelCase
userProfile/
상수
UPPER_SNAKE_CASE
API_PATH
boolean
is / has / can / should
isOpen, hasError

3.3 프로젝트 구조 규칙
src/
├── common/
│   ├── api/
│   ├── components/
│   ├── hooks/
│   └── utils/
│
├── pages/
│   └── Login/
│       ├── components/
│       ├── hooks/
│       └── index.jsx
│
├── routers/
├── store/
├── styles/
└── services/
구조 원칙:
	•	페이지는 최대한 얇게 유지한다.
	•	도메인 로직은 features 또는 page hooks 내부로 분리한다.
	•	공통 UI는 common에만 작성한다.
	•	import depth는 3단계를 초과하지 않는다.
	•	barrel export를 사용한다.

3.4 컴포넌트 작성 규칙
Bad
export default function UserCard() {}
Good
export const UserCard = ({ user, isActive = false, onClick }) => {
  return <div onClick={onClick}>{user.name}</div>;
};

3.5 컴포넌트 내부 순서
export const Example = ({ user, isActive, onSelect }) => {
  // 1. hooks
  const [isOpen, setIsOpen] = useState(false);

  // 2. derived values
  const displayName = useMemo(() => {
    return user.name.toUpperCase();
  }, [user.name]);

  // 3. event handlers
  const handleClick = () => {
    setIsOpen(prev => !prev);
    onSelect?.(user.id);
  };

  // 4. render
  return (
    <div className="rounded border p-4" onClick={handleClick}>
      <h3 className="font-bold">{displayName}</h3>
      {isOpen && <p className="text-sm text-gray-500">{user.email}</p>}
    </div>
  );
};

4. 스타일 정책
4.1 기본 원칙
	•	Tailwind utility class를 우선 사용한다.
	•	mobile-first로 작성한다.
	•	theme token만 사용한다.
	•	임의 hex 사용을 금지한다.
	•	inline style은 원칙적으로 금지한다.
	•	inline style은 동적 계산값 또는 CSS 변수 주입에만 허용한다.
Bad
<div style={{ backgroundColor: '#795df5' }} />
Good
<div className="bg-main text-gray05" />

4.2 className 작성 순서
layout → box-model → typography → visual
<div
  className="
    flex items-center justify-between
    h-14 w-full px-4
    text-sm font-bold
    rounded-lg bg-main text-white
  "
/>

5. 성능 최적화 정책
5.1 기본 원칙
	•	React.lazy는 Route-Level에 기본 적용한다.
	•	memo는 근거 있을 때만 사용한다.
	•	useMemo / useCallback은 남발하지 않는다.
	•	최적화는 문제 발생 후 적용한다.

5.2 리스트 렌더링
key는 반드시 안정적인 고유값을 사용한다.
Good
list.map(item => <Row key={item.id} />);
index key는 금지한다.
개수
규칙
200개 이상
성능 확인
500개 이상
가상화 검토
1000개 이상
react-window 권장

5.3 Effect 사용 정책
Effect는 동기화 용도일 때만 사용한다.
허용:
	•	서버 요청
	•	DOM 접근
	•	이벤트 등록/해제
	•	외부 상태 동기화
금지:
	•	데이터 가공
	•	단순 파생값 state 반영
Bad
useEffect(() => {
  setFiltered(list.filter(item => item.active));
}, [list]);
Good
const filtered = useMemo(() => {
  return list.filter(item => item.active);
}, [list]);

6. API / 서비스 정책
6.1 기본 원칙
	•	API 호출은 services 또는 hooks로 분리한다.
	•	페이지에서 직접 requestApi를 사용하지 않는다.
	•	useMutation / useQuery 사용 패턴은 프로젝트 규칙으로 통일한다.
	•	컴포넌트에서 API/에러 분기 로직을 작성하지 않는다.

7. 빌드 정책
7.1 기본 원칙
	•	chunk 분리를 유지한다.
	•	운영 배포 시 sourcemap을 제거한다.
	•	운영 환경에서 console.log를 제거한다.
GENERATE_SOURCEMAP=false

8. 포맷/린트 정책
8.1 Prettier 설정
{
  "tabWidth": 2,
  "endOfLine": "lf",
  "arrowParens": "avoid",
  "singleQuote": true,
  "trailingComma": "es5",
  "semi": true,
  "jsxSingleQuote": true,
  "printWidth": 100,
  "plugins": ["prettier-plugin-tailwindcss"]
}

8.2 ESLint 핵심 규칙
react-hooks/rules-of-hooks: error
react-hooks/exhaustive-deps: warn
no-unused-vars: off
react/prop-types: off
운영 console.log 금지는 custom rule 추가를 권장한다.
import 정렬
npm install eslint-plugin-simple-import-sort
'simple-import-sort/imports': 'error',
'simple-import-sort/exports': 'error',

8.3 EditorConfig
root = true

[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true

[*.{js,jsx,ts,tsx}]
indent_style = space
indent_size = 2

[*.json]
indent_style = space
indent_size = 2

[*.{css,scss}]
indent_style = space
indent_size = 2

[*.md]
trim_trailing_whitespace = false

9. 배포 정책
9.1 브랜치 전략
브랜치
역할
main
운영 배포 전용 브랜치
develop
개발/스테이징 통합 브랜치
feature/*
기능 개발 브랜치
hotfix/*
운영 긴급 수정 브랜치

9.2 브랜치 작업 흐름
feature/* → PR → develop

develop → PR → main

main → hotfix/* → PR → main
hotfix 반영 후 develop 동기화

9.3 브랜치 네이밍
feature/{ticket}-{short-desc}
hotfix/{date}-{short-desc}
hotfix/{ticket}-{short-desc}
예시
feature/CT-123-game-sound
hotfix/2026-03-03-login-500

9.4 배포 전 체크리스트
필수:
	•	npm run lint 통과
	•	npm run build 성공
	•	환경변수 검증
	•	API Base URL 확인
	•	Socket URL 확인
	•	CDN URL 확인
	•	운영 키/토큰이 개발/스테이징에 들어가지 않았는지 확인
권장:
	•	릴리즈 단위 식별 가능
	•	캐시/정적 파일 무효화 전략 확인
	•	라우팅/리다이렉트 스모크 테스트
	•	로그인 플로우 확인
	•	주요 기능 진입/종료 확인
	•	API 호출/에러 화면 확인

9.5 머지/배포 규칙
	•	운영 배포는 main만 허용한다.
	•	main, develop 직접 커밋을 금지한다.
	•	PR merge만 허용한다.
	•	PR은 최소 1명 리뷰를 권장한다.
	•	환경변수, 빌드 설정, 라우팅 변경은 PR 설명에 영향 범위를 명시한다.

10. API / 에러 처리 정책
10.1 응답 포맷
성공 응답
{
  "success": true,
  "error": null,
  "data": {}
}
실패 응답
{
  "success": false,
  "data": null,
  "error": {
    "type": "STRING_ENUM",
    "code": 0,
    "message": "사용자 노출 메시지"
  }
}
정책:
	•	success=true이면 업무 성공으로 간주한다.
	•	실패 케이스는 반드시 success=false로 내려야 한다.
	•	success=true인데 error로 실패 의미를 전달하는 설계를 금지한다.

10.2 에러 판단 우선순위
프론트 에러 처리는 아래 우선순위로 판단한다.
	1	HTTP Status
	2	error.type
	3	error.code
원칙:
	•	분기는 가능한 error.type 중심으로 한다.
	•	error.code는 상세 케이스/메시지 보정에만 사용한다.

10.3 HTTP Status 공통 정책
HTTP
의미
프론트 기본 처리
401
인증 만료/미인증
토큰 정리 → 로그인 이동
403
권한 없음
접근 거부 화면(/403)
404
리소스 없음
페이지: 404 / API: 빈 상태 또는 토스트
409
충돌
중복/상태 충돌 메시지
422
유효성 오류
필드별 검증 메시지
429
과도 요청
잠시 후 재시도 안내
500~599
서버 오류
공통 500 페이지(/500) 이동
정책:
	•	500 계열은 전역 공통 처리로 통일한다.
	•	인증/권한은 HTTP 401/403으로 표현한다.

10.4 error.type 정책
error.type은 의미가 명확한 문자열 enum으로 사용한다.
type
의미
기본 처리
AUTH_EXPIRED
로그인/세션 만료
토큰 정리 → 로그인
AUTH_INVALID
토큰 없음/비정상
토큰 정리 → 로그인/진입차단
FORBIDDEN
권한 없음
/403 이동
EXTERNAL_API_FAIL
외부 API 장애/실패
장애 안내 + 재시도 UX
VALIDATION_ERROR
검증 실패
폼 에러 표기
NOT_FOUND
없음
404 또는 빈 상태
UNKNOWN_ERROR
미분류
공통 토스트 + 필요 시 /500
도메인별 type은 공통 type 확장 형태로만 추가한다.

10.5 error.code 정책
error.code는 세부 원인 숫자 코드다.
rsCode 필드는 사용하지 않는다.
기존 숫자 코드는 error.code로 통일한다.
code
의미
권장 type
401
토큰/세션 만료
AUTH_EXPIRED
419
토큰 없음/비정상
AUTH_INVALID
442
외부 API 실패/오류
EXTERNAL_API_FAIL
200
정상(레거시)
성공은 success=true로만 표현
정책:
	•	숫자 분기보다 error.type을 우선한다.
	•	error.code는 상세 메시지/부수효과 보정에만 사용한다.
	•	success=false인데 error.type 없이 code만 내려오는 응답은 레거시로 간주한다.
	•	레거시는 프론트 normalize 단계에서 type을 보강한다.

10.6 레이어별 책임
common/hooks/useAxios
	•	네트워크 오류/타임아웃 처리
	•	에러 normalize
	•	500 계열 → /500 이동
	•	UI 토스트/모달 직접 호출 금지
pages/*/hooks
	•	onError / onSuccess에서 UI 부수효과 처리
	•	도메인별 예외 메시지/처리
	•	invalidate 등 흐름 제어
components
	•	API/에러 분기 로직 금지
	•	props 기반 UI 표시 전담

10.7 인증/권한 처리 정책
인증 계열 조건:
HTTP 401
또는
error.type in (AUTH_EXPIRED, AUTH_INVALID)
처리 순서:
	1	토큰/쿠키 정리
	2	세션 상태 초기화
	3	로그인으로 이동(/login, replace)
	4	안내 메시지 노출

10.8 외부 API 실패
error.type=EXTERNAL_API_FAIL 또는 error.code=442는 외부 의존 실패로 처리한다.
기본 메시지:
외부 시스템 오류로 요청을 처리할 수 없습니다. 잠시 후 다시 시도해주세요.
재시도 가능한 화면이면 페이지 hooks에서 재시도 버튼을 제공한다.

10.9 에러 메시지 정책
	•	사용자 메시지는 짧고 행동 지향적으로 작성한다.
	•	개발 로그/디버그 정보는 사용자 메시지에 포함하지 않는다.

10.10 레거시 호환
서버가 당장 error.type을 내려주지 못하는 경우, 프론트 normalize 단계에서 아래 규칙으로 보강한다.
조건
보강 type
code in (401, 441)
AUTH_EXPIRED
code = 419
AUTH_INVALID
code = 442
EXTERNAL_API_FAIL
그 외
UNKNOWN_ERROR

11. 보안 정책
11.1 환경변수 및 민감정보 관리
	•	모든 환경변수는 .env.* 파일 또는 배포 서버 환경변수로 관리한다.
	•	운영용 실제 키/토큰은 Git에 커밋하지 않는다.
	•	.env.example을 유지하여 필수 변수 목록을 명시한다.
	•	운영/개발/스테이징 환경을 명확히 분리한다.

11.2 민감정보 저장 금지 항목
프론트 코드 및 저장소에 다음 정보를 저장하지 않는다.
	•	API Secret Key
	•	DB 접속 정보
	•	외부 서비스 Secret Key
	•	JWT Secret
	•	Private Key
	•	내부 관리자 계정 정보
Secret 성격의 값은 반드시 서버에서만 관리한다.

11.3 인증/토큰 저장 정책
	•	Access Token의 localStorage 저장을 지양한다.
	•	가능하면 HttpOnly + Secure + SameSite Cookie 기반 인증을 사용한다.
	•	Refresh Token은 반드시 HttpOnly Cookie 사용을 권장한다.
	•	로그아웃 시 토큰을 완전히 삭제한다.
불가피하게 localStorage를 사용하는 경우:
	•	저장 기간 최소화
	•	자동 만료 로직 구현
	•	XSS 취약점 점검 필수
금지:
	•	토큰을 URL QueryString에 포함 금지
	•	콘솔에 토큰 출력 금지
	•	전역 상태에 평문 저장 후 외부 노출 금지

11.4 XSS 방지 정책
dangerouslySetInnerHTML 사용을 원칙적으로 금지한다.
불가피한 경우:
	•	서버단 Sanitizing 필수
	•	DOMPurify 등 검증된 라이브러리 사용
	•	보안 검토 승인 후 사용
사용자 입력값은 항상 신뢰하지 않는다.
HTML 삽입, 스크립트 실행 가능성이 있는 데이터는 렌더링 전 검증한다.
프론트 검증은 보조 수단이며, 서버에서도 반드시 검증한다.

11.5 외부 스크립트 및 라이브러리 정책
외부 CDN/스크립트:
	•	사용 목적 및 출처 검토 후 적용한다.
	•	공식 문서/공식 CDN만 사용한다.
	•	버전을 고정한다.
	•	가능하면 SRI를 적용한다.
npm 라이브러리:
	•	다운로드 수/유지관리 상태를 확인한다.
	•	최근 업데이트 여부를 확인한다.
	•	불필요한 라이브러리 도입을 금지한다.
	•	npm audit을 정기 실행한다.
	•	High/Critical 취약점은 배포 전 반드시 해결한다.

11.6 브라우저 보안 권장사항
	•	HTTPS 강제 적용
	•	Mixed Content 금지
	•	CSP 설정 권장
	•	iframe 사용 시 sandbox 옵션 검토
	•	window.open 사용 시 noopener, noreferrer 필수

11.7 로그 및 디버깅 정책
	•	운영 환경에서 console.log를 최소화한다.
	•	에러 로그에 개인정보/토큰을 포함하지 않는다.
	•	디버그 정보는 운영에서 노출하지 않는다.

11.8 배포 전 보안 체크리스트
	•	민감정보 하드코딩 여부 확인
	•	localStorage에 토큰 저장 여부 확인
	•	dangerouslySetInnerHTML 사용 여부 확인
	•	외부 스크립트 검토 완료
	•	npm audit High/Critical 0건 확인
	•	HTTPS 정상 동작 확인

12. 접근성 최소 기준
12.1 이미지 대체 텍스트
모든 img는 alt를 작성한다.
장식용 이미지는 alt=""와 필요 시 aria-hidden="true"를 사용한다.
Good
<img src={src} alt="학생 카드 이미지" />
<img src={icon} alt="" aria-hidden="true" />

12.2 버튼/인터랙션 라벨
모든 버튼은 접근 가능한 이름을 가져야 한다.
텍스트가 없으면 aria-label 또는 aria-labelledby를 제공한다.
Good
<button type="button">저장</button>

<button type="button" aria-label="닫기">
  <CloseIcon />
</button>
버튼처럼 동작하면 무조건 button을 사용한다.

12.3 카드 전체 클릭 패턴
카드 전체 클릭이 필요하면 overlay button 또는 a를 사용한다.
내부 버튼은 stopPropagation()으로 충돌을 방지한다.
button 중첩 구조는 만들지 않는다.
Good
<div className="relative rounded-xl border p-4">
  <button
    type="button"
    className="absolute inset-0"
    aria-label="카드 열기"
    onClick={handleOpen}
  />

  <div className="relative">
    <h3>제목</h3>

    <button type="button" onClick={handleFavorite} aria-label="즐겨찾기">
      <FavoriteIcon />
    </button>
  </div>
</div>

12.4 키보드 접근성 + 포커스
	•	모든 조작은 키보드만으로 가능해야 한다.
	•	Tab 이동이 가능해야 한다.
	•	Enter/Space 실행이 가능해야 한다.
	•	포커스 스타일 제거를 금지한다.
	•	outline: none 남용을 금지한다.
	•	Tailwind 사용 시 focus-visible 기반 스타일을 사용한다.
Good
<button className="focus-visible:outline focus-visible:outline-2">
  확인
</button>

12.5 모달/드롭다운 포커스 규칙
	•	열리면 내부 첫 포커스로 이동한다.
	•	닫히면 트리거로 포커스를 복귀한다.
	•	열려있는 동안 포커스 트랩을 유지한다.
	•	공용 Modal/Dropdown 컴포넌트에서 보장한다.

12.6 폼 접근성
	•	입력 요소는 label과 연결한다.
	•	label htmlFor + input id 사용을 권장한다.
	•	에러 메시지는 aria-describedby로 연결한다.
Good
<label htmlFor="email">이메일</label>
<input id="email" name="email" type="email" aria-describedby="email-error" />
<p id="email-error">이메일 형식이 올바르지 않습니다.</p>

12.7 상태 전달
상태는 ARIA/HTML 속성으로 전달한다.
상태
속성
펼침/닫힘
aria-expanded
선택
aria-selected
토글
aria-pressed
비활성
disabled 우선, 필요 시 aria-disabled
로딩
aria-busy 또는 로딩 텍스트
Good
<button type="button" aria-expanded={isOpen} aria-controls="menu">
  메뉴
</button>

12.8 접근성 강제 금지
	•	클릭 가능한 div/span 금지
	•	img alt 누락 금지
	•	아이콘 버튼 aria-label 누락 금지
	•	포커스 표시 제거 금지
	•	키보드 조작 불가 UI 금지

13. Figma → 이미지 추출 정책
13.1 SVG 사용 기준
SVG 사용 권장:
	•	아이콘
	•	로고
	•	단색 벡터
	•	선/도형 기반 그래픽
SVG 지양, PNG/WebP 권장:
	•	사진
	•	그라디언트가 많거나 복잡한 일러스트
	•	필터/마스크가 많은 그래픽

13.2 포맷/용량/배율
	•	일반 이미지는 PNG 또는 WebP를 사용한다.
	•	1MB 초과 이미지는 금지한다.
	•	웹 기본은 1x, 필요 시 2x만 추가한다.
	•	3x는 웹에서 지양한다.
권장:
대상
포맷
아이콘
SVG
일반 이미지
1x + 2x
배경 이미지
필요 시 2x

13.3 크기 원칙
	•	실제 표시 크기 기준으로 export한다.
	•	원본보다 크게 렌더링하지 않는다.
	•	CSS로 키워서 쓰지 않는다.

13.4 SVG 접근성
	•	의미 있는 인라인 SVG는 role + aria-label 또는 title을 제공한다.
	•	장식용 SVG는 aria-hidden="true"를 사용한다.

13.5 Figma Export 권장 옵션
SVG:
	•	Outline text ON
	•	Include id OFF
	•	Minify ON
WebP/PNG:
	•	Compression 80~90%
	•	투명/여백 불필요 영역 제거

14. 이미지 성능 정책
	•	LCP 후보 이미지는 lazy loading을 금지한다.
	•	그 외 이미지는 loading="lazy"를 기본 적용한다.
	•	1MB 초과 이미지는 금지한다.
	•	이미지가 크면 재압축/리사이즈를 우선한다.
	•	CDN 경로 사용을 권장한다.

15. 툴체인 정책
15.1 기본 툴체인
항목
기준
Node
LTS
React
프로젝트 기준 버전 사용
Vite/CRA/CRACO
프로젝트 기준 빌드 도구 사용
Tailwind
프로젝트 기준 버전 사용
패키지 매니저
npm 통일
상태관리
Zustand
데이터 패칭
React Query
코드 포맷터
Prettier
린트
ESLint
코드 에디터
VSCode 권장 / Cursor 사용 가능
API 테스트
Hoppscotch
DB Tool
DBeaver 또는 DataGrip
형상관리
GitHub

15.2 명령어
역할
React npm
Spring Gradle
린트 검사
npm run lint
./gradlew checkstyleMain
포맷 적용
npm run format
./gradlew spotlessApply
포맷 검사
npm run format:check
./gradlew spotlessCheck
빌드
npm run build
./gradlew build
개발 서버
npm run dev
./gradlew bootRun

15.3 코드 품질 도구
도구
역할
적용 시점
.editorconfig
에디터 기본 설정 통일
파일 저장 시
Prettier
코드 포맷 자동 정렬
npm run format
ESLint
코드 스타일 규칙 검사
npm run lint

15.4 ESLint 예시 설정
import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import react from 'eslint-plugin-react';
import prettierConfig from 'eslint-config-prettier';

export default [
  {
    ignores: ['dist'],
  },
  js.configs.recommended,
  {
    files: ['*.config.js', '*.config.cjs'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  {
    files: ['**/*.{js,jsx}'],
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        React: true,
        BASE_PATH: 'readonly',
        API_PATH: 'readonly',
        CDN_PATH: 'readonly',
        PLAY_API_PATH: 'readonly',
        MOCKUP_BOOL: 'readonly',
        MODE: 'readonly',
      },
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react/jsx-no-target-blank': 'off',
      'react/prop-types': 'off',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'no-unused-vars': 'off',
      'react/no-unknown-property': ['error', { ignore: ['webkitplaysinline'] }],
    },
  },
  prettierConfig,
];

16. 에디터 설정
16.1 VSCode 필수 확장
	•	ESLint
	•	Prettier
	•	EditorConfig
	•	Tailwind CSS IntelliSense
	•	PostCSS Language Support

16.2 VSCode 권장 설정
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "eslint.validate": ["javascript", "javascriptreact"],
  "eslint.alwaysShowStatus": true,
  "files.eol": "\n",
  "editor.tabSize": 2
}

17. 최종 강제 금지 요약
	•	JSX에 인라인 함수/복잡한 인라인 로직 남용 금지
	•	JSX에 중첩 삼항 연산자 금지
	•	클릭 가능한 div/span 금지
	•	if/else if 기반 화살촉 코드 금지
	•	파생값을 state로 복제 금지
	•	useEffect 의존성 배열 무시 금지
	•	컴포넌트에서 비즈니스 로직 직접 처리 금지
	•	컴포넌트에서 API/에러 분기 금지
	•	임의 hex 사용 금지
	•	inline style 남용 금지
	•	index key 사용 금지
	•	운영 console.log 금지
	•	민감정보 하드코딩 금지
	•	dangerouslySetInnerHTML 원칙적 금지
	•	img alt 누락 금지
	•	아이콘 버튼 aria-label 누락 금지
