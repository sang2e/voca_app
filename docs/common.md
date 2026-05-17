Common Guide
React 프로젝트에서 Claude Code가 일관된 구조와 규칙으로 작업하도록 하기 위한 공통 가이드 문서입니다.

1. 프로젝트 구조
1.1 기술 스택
구분
기술
Framework
React 18.3.1
Routing
React Router DOM v6
State Management
Zustand
Server State
React Query
Styling
Tailwind CSS
Build Tool
CRACO(Create React App Configuration Override)

1.2 기본 구조
src/
├── common/                 # 공통 모듈 및 유틸리티
│   ├── api/                # 공통 API 통신 함수
│   ├── context/            # React context provider
│   ├── helmet/             # SEO 및 meta tag 관리
│   ├── hooks/              # 공통 커스텀 훅
│   ├── utils/              # 유틸리티 함수
│   └── components/         # 공용 컴포넌트
│
├── db/                     # 정적 데이터 및 더미 데이터
├── images/                 # 이미지 리소스
├── layouts/                # 레이아웃 컴포넌트
│
├── pages/                  # 페이지 컴포넌트
│   └── ${pageName}/        # 페이지별 폴더
│       ├── components/     # 페이지 전용 컴포넌트
│       ├── hooks/          # 페이지 전용 hooks
│       └── index.jsx       # 페이지 엔트리
│
├── routers/                # 라우팅 설정
│
├── store/                  # 전역 상태 관리(Zustand)
│   ├── store.jsx           # 메인 스토어
│   └── useZustore.jsx      # 메인 스토어 hook
│
├── styles/                 # 전역 스타일 및 폰트
├── tracker/                # 트래킹 및 분석 도구
├── App.jsx                 # 루트 컴포넌트
└── index.jsx               # 진입점
기본 구조 원칙
	•	pages 중심으로 개발한다.
	•	공통 코드는 common에만 작성한다.
	•	도메인 분리는 최소화한다.
	•	페이지는 최대한 얇게 유지한다.

1.3 확장형 구조
프로젝트가 커질 경우 아래 구조를 사용할 수 있습니다.
src/
├── app/                    # 앱 엔트리, 라우터 설정
├── pages/                  # 라우팅 단위 페이지(Route Level)
├── features/               # 도메인 단위 기능 모듈
│   ├── user/
│   ├── auth/
│   └── game/
├── components/             # 공통 UI 컴포넌트
│   ├── ui/                 # Button, Modal 등 범용 UI
│   └── layout/
├── hooks/                  # 공통 커스텀 훅
├── store/                  # Zustand 전역 상태
├── services/               # API 모듈
├── styles/                 # 글로벌 스타일
├── utils/                  # 순수 유틸 함수
└── constants/              # 상수
확장형 구조 원칙
	•	도메인 중심으로 설계한다.
	•	도메인 API는 features 내부에서 관리한다.
	•	전역 store 사용은 최소화한다.

1.4 공통 네이밍 규칙
구분
규칙
예시
메인 파일
index.jsx
pages/login/index.jsx
컴포넌트 파일
PascalCase
TopBanner.jsx
컴포넌트 폴더
camelCase
userCard/
도메인 폴더
camelCase
features/user/

1.5 페이지 작성 원칙
페이지는 화면 조합만 담당하고, 비즈니스 로직은 hooks로 분리한다.
Bad
// pages/Login/Login.jsx

const Login = () => {
  const [user, setUser] = useState(null);

  const handleLogin = async () => {
    const res = await fetch('/api/login');
    const data = await res.json();
    setUser(data);
  };

  return <button onClick={handleLogin}>Login</button>;
};
Good
// pages/Login/Login.jsx

import { useLogin } from '@/features/auth/hooks/useLogin';

export const Login = () => {
  const { login } = useLogin();

  return <button onClick={login}>Login</button>;
};

1.6 공통 UI 원칙
공통 UI는 common/components에만 작성한다.
공통 컴포넌트는 특정 도메인에 의존하면 안 된다.
Bad
// common/components/Button.jsx

export const Button = ({ isAdmin }) => {
  if (isAdmin) {
    return <button>관리자 버튼</button>;
  }

  return <button>일반 버튼</button>;
};
Good
// common/components/Button.jsx

export const Button = ({ variant = 'primary', ...props }) => {
  return <button className={`btn-${variant}`} {...props} />;
};

1.7 Import 규칙
import depth는 3단계를 초과하지 않는다.
Bad
import { Button } from '../../../../common/components/Button';
Good
import { Button } from '@/common/components';
barrel export를 적극 사용한다.
// common/components/index.jsx
export { Button } from './Button';
export { Modal } from './Modal';

2. 컴포넌트 규칙
2.1 기본 원칙
	•	함수형 컴포넌트만 사용한다.
	•	default export를 금지한다.
	•	컴포넌트는 1파일 1컴포넌트를 원칙으로 한다.
	•	300줄 초과 시 분리를 검토한다.
	•	UI 컴포넌트와 도메인 로직을 분리한다.

2.2 Export 규칙
Bad
export default function UserCard() {}
Good
export const UserCard = () => {};
default export 금지 이유
	•	자동 import 시 이름이 꼬이는 문제를 방지한다.
	•	리팩토링 안정성이 증가한다.
	•	barrel export 관리가 쉬워진다.

2.3 파일/컴포넌트 네이밍
컴포넌트 파일과 컴포넌트명은 PascalCase를 사용한다.
이름에는 의미 있는 도메인 맥락을 포함한다.
Bad
Card.jsx
Panel.jsx
Item.jsx
Box.jsx
Good
UserListCard.jsx
GameTimerPanel.jsx
LoginFormSection.jsx
도메인 의미가 포함되어야 유지보수 시 맥락이 살아난다.

2.4 폴더 네이밍
폴더명은 camelCase를 사용한다.
features/user/
features/auth/
pages/login/

2.5 Props 규칙
필수 props는 명확히 정의한다
필수 props는 구조 분해 시 바로 명시하고, 선택 props는 기본값을 설정한다.
export const UserCard = ({
  user,
  isActive = false,
  onClick,
}) => {
  return <div onClick={onClick}>{user.name}</div>;
};

Boolean props prefix 규칙
boolean 값은 아래 prefix를 사용한다.
	•	is
	•	has
	•	can
	•	should
Bad
open
error
editable
flag
Good
isOpen
hasError
canEdit
shouldRender

이벤트 핸들러 규칙
이벤트 props는 on + 동사, 내부 함수는 handle + 동사를 사용한다.
onClick
onSubmit
handleClick
handleDelete

2.6 컴포넌트 구조 템플릿
// src/features/user/components/UserCard.jsx

import { memo } from 'react';

export const UserCard = memo(({ user, isActive = false, onClick }) => {
  // 1. hooks
  // 2. derived values
  // 3. event handlers
  // 4. render

  function getCardClassName() {
    if (isActive) return 'p-4 border rounded bg-blue-50';
    return 'p-4 border rounded';
  }

  return (
    <div className={getCardClassName()} onClick={onClick}>
      <h3 className="font-bold">{user.name}</h3>
    </div>
  );
});

2.7 로직 분리 규칙
페이지에 API 호출, mutation, 복잡한 비즈니스 로직을 직접 두지 않는다.
Bad
export const Login = () => {
  const mutation = useMutation(loginApi);

  return <button onClick={() => mutation.mutate()}>Login</button>;
};
Good
// features/auth/hooks/useLogin.js

export const useLogin = () => {
  return useMutation(loginApi);
};
// pages/Login/Login.jsx

export const Login = () => {
  const { mutate } = useLogin();

  return <button onClick={mutate}>Login</button>;
};
페이지는 조합만 담당하고, 도메인 로직은 hooks로 분리한다.

2.8 useEffect 규칙
useEffect는 동기화 용도로만 사용한다.
데이터 가공을 위해 useEffect와 setState를 조합하지 않는다.
Bad
useEffect(() => {
  const filtered = list.filter((item) => item.active);
  setFilteredList(filtered);
}, [list]);
Good
const filteredList = useMemo(() => {
  return list.filter((item) => item.active);
}, [list]);
Good: 외부 이벤트 동기화
useEffect(() => {
  const handleResize = () => setWidth(window.innerWidth);

  window.addEventListener('resize', handleResize);

  return () => {
    window.removeEventListener('resize', handleResize);
  };
}, []);

3. 상태 관리 가이드
3.1 상태 유형 구분
상태 유형
사용 기술
설명
전역 공유 상태
Zustand
앱 전역에서 공유되는 클라이언트 상태
서버 데이터
React Query
API로부터 받아오는 서버 상태
단순 UI 상태
useState
컴포넌트 내부에서만 사용하는 상태

3.2 Zustand 사용 기준
Zustand는 아래 경우에만 사용한다.
	•	로그인 세션
	◦	token
	◦	최소 사용자 정보
	•	UI 전역 상태
	◦	modal
	◦	toast
	◦	global loading
	•	테마 / 환경 설정

3.3 Zustand 사용 금지 대상
다음 데이터는 전역 store에 저장하지 않는다.
	•	UserList
	•	GameList
	•	상세 데이터
	•	API 응답 데이터
	•	페이지 전용 상태
서버 데이터는 반드시 React Query로 관리한다.

3.4 Store 구조
store/
├── store.jsx
├── uiStore.jsx
└── themeStore.jsx
Bad
store/
├── userListStore.jsx
└── gameDetailStore.jsx
도메인 API 데이터는 store에 저장하지 않는다.

3.5 Store 작성 원칙
서버 데이터 저장 금지
Bad
const useUserStore = create((set) => ({
  users: [],
  fetchUsers: async () => {
    const res = await fetch('/api/users');
    set({ users: await res.json() });
  },
}));
서버 데이터는 React Query로 관리한다.

set 내부에서 직접 비동기 처리 금지
Bad
set(async (state) => {
  const data = await fetch('/api/data');

  return { data };
});
비동기 처리는 외부에서 완료한 후 set을 호출한다.
Good
const login = async (payload) => {
  const data = await loginApi(payload);

  set({ token: data.token });
};

3.6 Server State vs Client State 구분
질문
사용 기술
이 데이터는 서버에서 오는가?
React Query
이 상태는 앱 전역 UI인가?
Zustand
이 상태는 해당 컴포넌트 내부에서만 쓰는가?
useState

3.7 Zustand 예제
sessionStore.jsx
// store/sessionStore.jsx

import { create } from 'zustand';

export const useSessionStore = create((set) => ({
  token: null,
  user: null,
  setSession: (session) => set(session),
  clearSession: () => set({ token: null, user: null }),
}));
uiStore.jsx
// store/uiStore.jsx

import { create } from 'zustand';

export const useUIStore = create((set) => ({
  isModalOpen: false,
  openModal: () => set({ isModalOpen: true }),
  closeModal: () => set({ isModalOpen: false }),
}));

3.8 상태 관리 체크리스트
	•	이 상태가 서버에서 오는 데이터인가? → React Query
	•	이 상태가 앱 전역 UI/세션인가? → Zustand
	•	이 상태가 특정 컴포넌트 전용인가? → useState
	•	store에 API 응답 데이터를 직접 저장하지 않았는가?
	•	set 내부에서 async/await를 사용하지 않았는가?

4. API 통신 가이드
4.1 한 줄 원칙
API 송신은 useGetQuery / useMutationHook에서 제공하는 request 또는 requestAsync로만 한다.
네트워크 호출은 useAxios().requestApi를 통해서만 한다.
금지
	•	페이지/컴포넌트에서 axios 직접 호출 금지
	•	useQuery / useMutation 직접 사용 금지
	•	common/service에서 useGetQuery / useMutationHook 사용 금지

4.2 폴더 구조
src/
├── common/
│   ├── hooks/
│   │   ├── useAxios.jsx
│   │   ├── useGetQuery.jsx
│   │   └── useMutationHook.jsx
│   │
│   ├── service/
│   │   ├── authApi.jsx
│   │   ├── userApi.jsx
│   │   └── commonApi.jsx
│   │
│   └── context/
│
├── pages/
│   └── ${pageName}/
│       ├── hooks/             # API 훅 권장 위치
│       ├── components/
│       └── index.jsx

4.3 레이어 책임
common/hooks/useAxios.jsx
역할:
	•	axios 인스턴스 단일화
	•	baseURL 환경변수 관리
	•	request interceptor에서 token 처리
	•	response interceptor에서 공통 에러 변환(normalize)
	•	requestApi(method, url, body, headers) 제공
금지:
	•	React import 금지
	•	useState / useEffect 금지
	•	UI 로직 금지

common/service/*.jsx
선택 사항이다.
역할:
	•	순수 엔드포인트 함수만 작성
	•	URL / Method / Body / Headers 조합만 관리
금지:
	•	useGetQuery / useMutationHook 사용 금지
	•	useAxios 사용 금지
	•	SpinnerContext, 쿠키 제거 등 UI 부수효과 금지
현재 구조 유지가 목표라면 service는 선택 사항으로 두고, 당장은 pages/hooks에만 둬도 된다.

pages/${pageName}/hooks/*
권장 실사용 레이어다.
역할:
	•	실제 사용하는 API 훅을 작성한다.
	•	useAxios().requestApi와 useGetQuery / useMutationHook을 조합한다.
	•	queryKey를 정의한다.
	•	callbacks를 정의한다.
	•	필요 시 invalidate를 처리한다.
금지:
	•	컴포넌트에서 API 훅 직접 작성 금지
	•	컴포넌트에서 requestApi 직접 호출 금지

4.4 API 송신 표준 흐름
GET 캐싱형
components → pages/hooks → useGetQuery → requestApi
CUD / POST / PUT / DELETE
components → pages/hooks → useMutationHook → requestApi
트리거형 GET
components → pages/hooks → useMutationHook → requestApi

4.5 GET 구분 규칙
캐싱형 GET
리스트, 상세, 페이지 진입 시 자동 로딩 데이터는 useGetQuery를 사용한다.
트리거형 GET
아래처럼 캐싱이 필요 없는 1회성 요청은 useMutationHook을 사용할 수 있다.
	•	토큰 발급
	•	토큰 검증
	•	1회성 확인 요청
	•	다운로드 요청
조건:
	•	캐싱 불필요
	•	자동 재요청 불필요
	•	부수효과 가능

4.6 useGetQuery 작성 규칙
	•	query.key는 반드시 작성한다.
	•	query.queryFn 내부에서만 requestApi를 호출한다.
	•	callbacks에는 UI/부수효과 처리만 작성한다.
	•	callback의 return 값으로 흐름을 제어하지 않는다.
Good
// pages/Common/hooks/useListModuleQuery.jsx

import useAxios from '@/common/hooks/useAxios';
import { useGetQuery } from '@/common/hooks/useGetQuery';

export const useListModuleQuery = (callbacks = {}) => {
  const { requestApi } = useAxios();

  return useGetQuery({
    query: {
      key: 'common.listModule',
      queryFn: () => requestApi('GET', `${API_PATH}/api/content/listModule`),
    },
    callbacks,
  });
};

4.7 useMutationHook 작성 규칙
	•	POST / PUT / DELETE 요청에 사용한다.
	•	트리거형 GET에 예외적으로 사용할 수 있다.
	•	query.queryFn 내부에서만 requestApi를 호출한다.
	•	callbacks.onError는 UI/부수효과 처리만 담당한다.
// pages/Play/hooks/useNonMemberTokenMutation.jsx

import useAxios from '@/common/hooks/useAxios';
import { useMutationHook } from '@/common/hooks/useMutationHook';

export const useNonMemberTokenMutation = (callbacks = {}) => {
  const { requestApi } = useAxios();

  return useMutationHook({
    query: {
      queryFn: (params) =>
        requestApi('POST', `${PLAY_API_PATH}/play/join/cardtalk`, {
          roomSeq: params?.roomSeq,
          playerId: params?.playerId,
          playerAuth: params?.playerAuth,
          gameId: params?.gameId,
          playMode: params?.playMode,
        }),
    },
    callbacks,
  });
};

4.8 컴포넌트에서 호출 규칙
API 송신은 request / requestAsync만 사용한다.
const nonMemberToken = useNonMemberTokenMutation({
  onSuccess: (data) => console.log('성공', data),
  onError: (error) => console.error('실패', error),
});

nonMemberToken.request({
  roomSeq,
  playerId,
  playerAuth,
  gameId,
  playMode,
});
await가 필요한 경우 requestAsync를 사용한다.
const data = await nonMemberToken.requestAsync({
  roomSeq,
  playerId,
  playerAuth,
  gameId,
  playMode,
});
GET도 동일하게 사용한다.
const listModule = useListModuleQuery();

listModule.request();

4.9 queryKey 규칙
	•	key는 페이지 단위로 관리한다.
	•	JSX 내부에서 문자열 하드코딩을 금지한다.
	•	컴포넌트에서 key 정의를 금지한다.
예시:
common.listModule
play.nonMemberToken
editor.content.add

4.10 API 체크리스트
	•	axios 직접 호출이 없는가?
	•	useQuery / useMutation 직접 사용이 없는가?
	•	requestApi는 pages/hooks 내부에서만 호출되는가?
	•	GET 요청에 query.key가 정의되어 있는가?
	•	API 송신은 request / requestAsync로만 했는가?
	•	트리거형 GET만 useMutationHook을 사용했는가?
	•	common/service에 React Query 훅이 들어가 있지 않은가?

4.11 API 금지 규칙 핵심 요약
	•	common/service에서 useGetQuery / useMutationHook 사용 금지
	•	컴포넌트에서 requestApi 직접 호출 금지
	•	callbacks에서 return 값으로 흐름 제어 금지

5. 라우팅 가이드
5.1 한 줄 원칙
	•	Route-Level 컴포넌트는 pages에만 둔다.
	•	최상위 라우팅은 routers/MainRouter.jsx에서 도메인 Router를 마운트한다.
	•	lazy loading을 기본 적용한다.
	•	권한 분기는 Layout / Guard 레벨에서 처리한다.
	•	404 / 500 전용 페이지는 필수다.

5.2 폴더/파일 위치 규칙
src/
├── routers/
│   ├── MainRouter.jsx
│   ├── guards.jsx
│   └── routes.const.js
│
├── layouts/
│   ├── AppLayout.jsx
│   ├── AuthLayout.jsx
│   └── AdminLayout.jsx
│
├── pages/
│   ├── Home/
│   │   └── HomeMain.jsx
│   ├── Login/
│   │   └── Login.jsx
│   ├── Error/
│   │   ├── NotFound.jsx
│   │   └── ServerError.jsx
│   └── ...
│
└── 도메인 Router 폴더
    ├── home/router/index.jsx
    ├── editor/router/index.jsx
    └── ...
HomeRouter, EditorRouter 등이 존재하는 구조는 유지한다.
단, pages에는 화면(Route-Level)만 두고, Router는 router 폴더로 분리한다.

5.3 MainRouter 책임
	•	앱 진입 라우트(/) 처리
	•	도메인 Router 마운트
	•	전역 공통 기능 적용
	•	404 fallback 처리
Good
<Routes>
  <Route path="/" element={<Navigate to="/home" replace />} />
  <Route path="/home/*" element={<HomeRouter />} />
  <Route path="*" element={<NotFound />} />
</Routes>

5.4 도메인 Router 책임
	•	도메인 내부 서브 라우트 정의
	•	도메인 레이아웃 적용
	•	도메인 단위 lazy loading 적용

5.5 Route 작성 규칙
Route는 pages 단위만 사용
<Route element={...}>에 들어가는 화면 컴포넌트는 pages의 Route-Level 컴포넌트만 사용한다.
components의 단순 UI를 Route에 직접 걸지 않는다.
Good: pages/Home/HomeMain.jsx
Bad: common/components/HomeMainCard.jsx

5.6 path 네이밍 규칙
path는 kebab-case를 권장한다.
/user-profile
/game-setting
도메인 라우트는 상위 prefix를 고정한다.
/home/*
/view/editor/*
/game/*
/admin/*

5.7 index route 사용
도메인 Router 내부에서 기본 화면은 index route로 둔다.
<Route element={<SomeLayout />}>
  <Route index element={<HomeMain />} />
  <Route path="detail" element={<HomeDetail />} />
</Route>

5.8 Lazy Loading 규칙
Route-Level 페이지는 React.lazy를 기본 적용한다.
<Suspense fallback={<Loading />}>로 감싼다.
MainRouter에서 한 번만 감싸는 방식 또는 도메인 Router에서 감싸는 방식 중 하나로 통일한다.
권장 방식:
	•	MainRouter는 도메인 Router만 마운트한다.
	•	각 도메인 Router에서 pages를 lazy 처리한다.

5.9 권한/세션 가드 규칙
권한 분기는 컴포넌트 내부가 아니라 Layout / Guard 레벨에서 처리한다.
if (!login) navigate(...) 패턴을 컴포넌트 내부에 반복 작성하지 않는다.
guards.jsx 권장 구성
routers/guards.jsx
├── RequireAuth
├── RequireAdmin
└── GuestOnly
적용 패턴
<Route element={<RequireAuth />}>
  <Route path="/mypage/*" element={<MyPageRouter />} />
</Route>

<Route element={<RequireAdmin />}>
  <Route path="/admin/*" element={<AdminRouter />} />
</Route>

<Route element={<GuestOnly />}>
  <Route path="/login/*" element={<LoginRouter />} />
</Route>

5.10 Layout 규칙
레이아웃은 layouts에만 작성한다.
레이아웃은 화면 틀을 담당한다.
	•	Header
	•	Footer
	•	Sidebar
	•	Outlet
레이아웃은 반드시 <Outlet />을 포함한다.
import { Outlet } from 'react-router-dom';

export const AppLayout = () => {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
};

5.11 404 / 500 규칙
404
path="*"는 MainRouter 최하단에 1개만 둔다.
도메인 Router에서 별도 404를 둘 경우, 도메인 내부만 처리한다.
500
/500 전용 페이지를 만든다.
API 공통 에러 처리에서 500 계열이면 /500으로 이동하는 정책을 선택할 수 있다.

5.12 Scroll / Navigation 규칙
ScrollRestoration 위치
MainRouter 최상단에 1회 적용한다.
<>
  <ScrollRestoration />
  <Routes>...</Routes>
</>
Navigate 사용 규칙
초기 라우트 리다이렉트 시 replace를 사용한다.
<Navigate to="/home/main" replace />

5.13 라우팅 체크리스트
	•	Route-Level 컴포넌트가 pages에 있는가?
	•	MainRouter는 도메인 Router 마운트만 담당하는가?
	•	lazy loading이 Route-Level에 적용되어 있는가?
	•	권한 체크가 컴포넌트 내부가 아니라 Guard/Layout에서 처리되는가?
	•	404 페이지가 존재하며 MainRouter 최하단에 path="*"가 있는가?
	•	500 페이지가 존재하는가?
	•	path 네이밍이 kebab-case인가?
	•	초기 리다이렉트에 replace를 사용했는가?

6. 스타일 가이드
6.1 스타일 파일 구조
src/styles/
├── global.css
├── fonts.css
├── animations.css
├── scrollbars.css
├── toast.css
└── calendar.css

src/pages/${pageName}/styles/
└── style.css
파일 역할
파일
역할
global.css
Tailwind import, theme token, base layer, 전역 유틸 클래스
fonts.css
@font-face 정의, 폰트 유틸 클래스
animations.css
@keyframes 정의, 애니메이션 유틸 클래스
scrollbars.css
컴포넌트별 커스텀 스크롤바 클래스
toast.css
React Toastify 스타일 override
calendar.css
react-calendar 스타일 override
pages/${pageName}/styles/style.css
페이지 전용 라이브러리 override

6.2 스타일 원칙
	•	새 CSS 파일 생성은 라이브러리 override 목적만 허용한다.
	•	일반 스타일은 Tailwind utility class로 작성한다.
	•	전역 공통 유틸이 필요하면 global.css의 @layer base에 추가한다.

6.3 컬러 토큰
global.css의 @theme에 정의된 값만 사용한다.
임의 hex값 직접 사용을 금지한다.
Good
<div className="bg-main text-gray05 border-base-white" />
Bad
<div style={{ backgroundColor: '#795df5' }} />
<div className="bg-[#795df5]" />

6.4 inline style 규칙
원칙적으로 inline style은 금지한다.
단, 아래 경우만 예외로 허용한다.
허용 케이스
예시
JS 런타임 동적 값
style={{ width: ${ratio * 100}% }}
CSS 변수 동적 주입
style={{ '--scrollbar-width': ${w}px }}
서드파티 라이브러리 강제 override
Toastify, react-calendar 등
Good
<div style={{ left: `${posX}px`, top: `${posY}px` }} />
<div style={{ '--card-count': count }} />
Bad
<div style={{ display: 'flex', gap: '8px' }} />

6.5 폰트 사용
fonts.css에 정의된 유틸 클래스를 사용한다.
font-family를 직접 작성하지 않는다.
클래스
폰트
용도
font-pre
Pretendard
기본 UI 폰트
font-nanum
NanumSquareRound
학습 콘텐츠

6.6 반응형 기준
구분
조건
Tailwind prefix
Mobile
max-width: 768px
기본(prefix 없음)
PC
min-width: 769px
md:
원칙은 mobile-first다.
Good
<div className="text-sm md:text-base" />
<div className="flex-col md:flex-row" />
전역 레이아웃 분기는 .mo-view / .pc-view 클래스를 사용한다.
<div className="mo-view">모바일 전용 화면</div>
<div className="pc-view">PC 전용 화면</div>
.mo-view / .pc-view는 global.css에 이미 정의되어 있어야 한다.
별도의 반응형 display를 반복 작성하지 않는다.

6.7 className 작성 순서
className은 아래 순서로 정렬한다.
layout → box-model → typography → visual
Good
<div
  className="
    flex items-center justify-between
    h-14 w-full px-4 py-2
    font-pre text-sm font-bold
    rounded-lg bg-main text-white
  "
/>

6.8 className이 길어질 때
className이 5줄 또는 토큰 10개를 초과하면 분리를 검토한다.
방법 1. 변수 추출
const baseClass = 'flex items-center h-14 w-full px-4';

function getActiveClassName() {
  if (isActive) return 'bg-main text-white';
  if (isDisabled) return 'bg-gray06 text-gray04 pointer-events-none';

  return 'bg-gray06 text-main03';
}

return <div className={`${baseClass} ${getActiveClassName()}`} />;
방법 2. 컴포넌트 추출
반복되는 긴 className은 컴포넌트로 추출한다.
Bad
<button className="flex h-10 w-10 items-center justify-center rounded-full bg-main text-white hover:bg-sub02">
  A
</button>
<button className="flex h-10 w-10 items-center justify-center rounded-full bg-main text-white hover:bg-sub02">
  B
</button>
Good
export const IconButton = ({ children }) => {
  return (
    <button className="flex h-10 w-10 items-center justify-center rounded-full bg-main text-white hover:bg-sub02">
      {children}
    </button>
  );
};
조건부 클래스 결합이 복잡해지면 우선 함수로 분리한다.
function getButtonClassName() {
  const classNames = ['flex items-center w-full'];

  if (isActive) classNames.push('bg-main text-white');
  if (isDisabled) classNames.push('opacity-50 pointer-events-none');

  return classNames.join(' ');
}

return <div className={getButtonClassName()} />;

6.9 애니메이션
애니메이션은 animations.css에 정의된 클래스를 사용한다.
커스텀 @keyframes 추가 시 animations.css에만 작성한다.
animate-fade-in
animate-fade-out
animate-fade-in-out
animate-fade-in-up

6.10 전역 공통 유틸 클래스
Tailwind로 표현이 어려운 CSS 조합에만 사용한다.
btn-press

game-container

perspective-1000
transform-style-preserve-3d
backface-hidden
rotate-y-0
rotate-y-180

inner-shadow-10
drop-shadow-6

resizing-container

6.11 스타일 체크리스트
	•	컬러값을 @theme 토큰으로 사용했는가?
	•	style={{ }}를 사용했다면 동적 값이나 CSS 변수 주입인가?
	•	className이 10개 토큰 초과 시 변수/컴포넌트로 분리했는가?
	•	폰트를 font-pre, font-nanum 등 유틸 클래스로 사용했는가?
	•	새 애니메이션은 animations.css에 추가했는가?
	•	새 스크롤바는 scrollbars.css에 추가했는가?
	•	반응형은 mobile-first로 작성했는가?
	•	라이브러리 스타일 override 외의 새 CSS 파일을 만들지 않았는가?

7. 성능 최적화 가이드
7.1 기본 원칙
	•	Route-Level에는 React.lazy를 적극 활용한다.
	•	memo는 근거 있을 때만 사용한다.
	•	useMemo / useCallback을 남발하지 않는다.
	•	최적화는 문제 발생 후 적용한다.
	•	선최적화를 금지한다.

7.2 이미지 규칙
기본 규칙
	•	이미지에는 loading="lazy"를 기본 적용한다.
	•	CDN 사용을 권장한다.
	•	1MB 초과 이미지는 금지한다.
	•	원본 업로드 시 압축한다.
	•	WebP 사용을 권장한다.
금지
	•	배너/리스트 썸네일에 원본 대형 이미지 사용 금지
	•	페이지 진입 시 필요 없는 이미지 preload 금지

7.3 코드 분리 & 빌드
Code Splitting
	•	Route-Level은 React.lazy를 기본 적용한다.
	•	도메인 단위 Router에도 lazy를 적용한다.
	•	큰 컴포넌트는 필요 시 dynamic import를 사용한다.
	◦	설정 페이지
	◦	에디터
	◦	대형 차트
빌드 정책
	•	chunk 분리를 유지한다.
	•	운영 배포 시 sourcemap을 제거한다.
GENERATE_SOURCEMAP=false
	•	운영 코드에서 console.log를 제거한다.

7.4 리스트 렌더링 규칙
key 규칙
key는 안정적인 고유값을 사용한다.
정렬/삭제/삽입이 가능한 리스트에서 index key 사용을 금지한다.
Bad
list.map((item, index) => <Row key={index} />);
Good
list.map((item) => <Row key={item.id} />);

7.5 대용량 리스트 기준
개수
기준
200개 이상
성능 확인
500개 이상
가상화 검토
1000개 이상
react-window 등 사용 권장

7.6 React.memo 사용 규칙
아래 3가지 조건을 모두 충족할 때만 사용한다.
	•	자식이 자주 렌더링된다.
	•	props가 자주 동일하다.
	•	렌더 비용이 크다.
사용 금지
	•	단순 UI 컴포넌트
	•	props가 매번 바뀌는 컴포넌트
	•	습관적인 memo 사용

7.7 useMemo 사용 규칙
사용 조건
	•	계산 비용이 높은 연산
	•	배열/객체 파생 연산
	•	정렬/필터/가공 로직
남발 금지 기준
	•	단순 boolean 계산
	•	단순 문자열 조합
	•	1~2줄 계산

7.8 useCallback 사용 규칙
사용 조건
	•	memo된 자식에게 함수 props를 전달할 때
	•	useEffect dependency 안정화 목적일 때
남발 금지 기준
	•	내부에서만 사용하는 함수
	•	렌더 비용이 거의 없는 컴포넌트

7.9 Effect 규칙
Effect는 동기화 용도로만 사용한다.
허용되는 사용 목적:
	•	서버 요청
	•	DOM 접근
	•	이벤트 등록/해제
	•	외부 상태 동기화
Bad
useEffect(() => {
  const filtered = list.filter((item) => item.active);
  setFiltered(filtered);
}, [list]);
Good
const filtered = useMemo(() => {
  return list.filter((item) => item.active);
}, [list]);

7.10 파생 상태 규칙
기존 state에서 계산 가능한 값은 state로 두지 않는다.
중복 상태 생성을 금지한다.
Bad
const [filteredList, setFilteredList] = useState([]);
Good
const filteredList = useMemo(() => {
  return list.filter((item) => item.active);
}, [list]);

7.11 측정 방법
React DevTools Profiler
	•	특정 컴포넌트 re-render 횟수를 확인한다.
	•	실제 문제가 있는 곳만 최적화한다.
간단 측정
console.time('render');
console.timeEnd('render');
또는 아래 API를 사용한다.
performance.mark('start');
performance.mark('end');
performance.measure('target', 'start', 'end');

7.12 최적화 적용 순서
	1	문제 발생을 확인한다.
	2	Profiler로 병목을 확인한다.
	3	최소 범위만 수정한다.
	4	다시 측정한다.
	5	필요 시 memo / useMemo / useCallback을 적용한다.
선최적화를 금지한다.

7.13 성능 체크리스트
	•	key가 index가 아닌가?
	•	500개 이상 리스트라면 가상화를 검토했는가?
	•	데이터 가공 때문에 useEffect를 사용하지 않았는가?
	•	memo / useMemo를 근거 없이 사용하지 않았는가?
	•	derived state를 state로 관리하고 있지 않은가?
	•	lazy loading이 Route-Level에 적용되어 있는가?
	•	운영 빌드에서 sourcemap을 제거했는가?
