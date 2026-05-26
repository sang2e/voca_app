import { useLocation, useNavigate } from 'react-router-dom';

import { wordbookMockData,wordMockData } from '@/db/wordMockData';

import { HomeWordbookCard } from './components/HomeWordbookCard';

// 오늘 학습 완료 단어 수 (mock)
const MOCK_LEARNED_COUNT = 4;

// 학습 요약 수치 계산 (progressPercent는 derived value)
function getSummaryStats() {
  const totalWordCount = wordMockData.length;
  const learnedCount = MOCK_LEARNED_COUNT;
  const progressPercent = Math.round((learnedCount / totalWordCount) * 100);

  return {
    wordbookCount: wordbookMockData.length,
    totalWordCount,
    learnedCount,
    progressPercent,
  };
}

// 하단 탭 버튼 활성 상태에 따른 스타일
function getNavItemClass(isActive) {
  const base = 'flex flex-1 flex-col items-center gap-1 py-3 text-xs font-semibold focus-visible:outline focus-visible:outline-2';

  if (isActive) return `${base} text-main`;
  return `${base} text-gray05`;
}

export const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { wordbookCount, totalWordCount, learnedCount, progressPercent } = getSummaryStats();

  // 학습 시작: 첫 번째 단어장으로 이동
  const handleStudyStart = () => {
    navigate(`/study/${wordbookMockData[0].id}`);
  };

  // 단어 추가 페이지 이동
  const handleWordAdd = () => {
    navigate('/words/new');
  };

  // 퀴즈 시작 페이지 이동
  const handleQuizStart = () => {
    navigate('/quiz/play');
  };

  // 단어장 카드 클릭 → 해당 단어장 학습
  const handleWordbookStudy = (wordbookId) => {
    navigate(`/study/${wordbookId}`);
  };

  // 마이페이지/설정 페이지 이동
  const handleSettingsClick = () => {
    navigate('/settings');
  };

  // 하단 탭 내비게이션 핸들러
  const handleNavHome = () => navigate('/');
  const handleNavWordAdd = () => navigate('/words/new');
  const handleNavLibrary = () => navigate('/library');

  return (
    <div className='flex min-h-dvh flex-col pb-20'>
      {/* 상단 헤더 */}
      <header className='flex items-center justify-between px-5 py-4'>
        <h1 className='text-xl font-bold text-main'>VocaApp</h1>

        {/* 마이페이지 진입 버튼 */}
        <button
          type='button'
          className='flex h-9 w-9 items-center justify-center rounded-full bg-layer text-gray03 focus-visible:outline focus-visible:outline-2 focus-visible:outline-main'
          aria-label='마이페이지로 이동'
          onClick={handleSettingsClick}
        >
          <span aria-hidden='true'>&#9881;</span>
        </button>
      </header>

      {/* 학습 요약 카드 */}
      <section className='mx-5 mt-1 rounded-2xl bg-card p-5'>
        <p className='text-xs font-semibold uppercase tracking-wider text-gray04'>학습 현황</p>

        {/* 수치 요약 */}
        <div className='mt-3 flex gap-8'>
          <div>
            <span className='text-3xl font-bold text-gray01'>{wordbookCount}</span>
            <p className='mt-0.5 text-xs text-gray03'>단어장</p>
          </div>
          <div>
            <span className='text-3xl font-bold text-gray01'>{totalWordCount}</span>
            <p className='mt-0.5 text-xs text-gray03'>총 단어</p>
          </div>
        </div>

        {/* 진행률 영역 */}
        <div className='mt-5'>
          {/* 진행률 수치 */}
          <div className='mb-1.5 flex items-center justify-between'>
            <span className='text-xs text-gray03'>
              오늘 학습 진행률 &nbsp;
              <span className='font-semibold text-gray01'>
                {learnedCount} / {totalWordCount} 단어
              </span>
            </span>
            <span className='text-sm font-bold text-main'>{progressPercent}%</span>
          </div>

          {/* progress bar: 배경 bg-layer, 채움 bg-main — token 기반으로 theme 확장 가능 */}
          <div className='h-2 w-full overflow-hidden rounded-full bg-layer'>
            <div
              className='h-full rounded-full bg-main transition-all duration-300'
              style={{ width: `${progressPercent}%` }}
              role='progressbar'
              aria-valuenow={progressPercent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label='오늘 학습 진행률'
            />
          </div>
        </div>

        {/* 학습 시작 CTA */}
        <button
          type='button'
          className='mt-5 w-full rounded-xl bg-main py-3.5 text-sm font-bold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-main02'
          onClick={handleStudyStart}
        >
          학습 시작하기
        </button>
      </section>

      {/* 퀵 액션 버튼 영역 */}
      <div className='mx-5 mt-3 grid grid-cols-2 gap-3'>
        <button
          type='button'
          className='rounded-xl bg-layer py-4 text-sm font-semibold text-gray01 focus-visible:outline focus-visible:outline-2 focus-visible:outline-main'
          onClick={handleWordAdd}
        >
          단어 추가
        </button>
        <button
          type='button'
          className='rounded-xl bg-layer py-4 text-sm font-semibold text-gray01 focus-visible:outline focus-visible:outline-2 focus-visible:outline-main'
          onClick={handleQuizStart}
        >
          퀴즈 시작
        </button>
      </div>

      {/* 나의 단어장 섹션 */}
      <section className='mx-5 mt-7'>
        <h2 className='mb-3 text-sm font-bold text-gray01'>나의 단어장</h2>

        {/* 단어장 카드 리스트 */}
        <ul className='flex flex-col gap-3'>
          {wordbookMockData.map(wordbook => (
            <li key={wordbook.id}>
              <HomeWordbookCard wordbook={wordbook} onStudyClick={handleWordbookStudy} />
            </li>
          ))}
        </ul>
      </section>

      {/* 하단 탭 내비게이션 */}
      <nav
        className='fixed bottom-0 left-1/2 w-full max-w-[430px] -translate-x-1/2 border-t border-layer bg-surface'
        aria-label='하단 내비게이션'
      >
        <div className='flex'>
          {/* 홈 탭 */}
          <button
            type='button'
            className={getNavItemClass(location.pathname === '/')}
            onClick={handleNavHome}
          >
            <svg width='22' height='22' viewBox='0 0 24 24' fill='none' aria-hidden='true'>
              <path
                d='M3 12L12 3L21 12V21H15V15H9V21H3V12Z'
                stroke='currentColor'
                strokeWidth='1.8'
                strokeLinejoin='round'
                strokeLinecap='round'
              />
            </svg>
            홈
          </button>

          {/* 단어추가 탭 */}
          <button
            type='button'
            className={getNavItemClass(location.pathname === '/words/new')}
            onClick={handleNavWordAdd}
          >
            <svg width='22' height='22' viewBox='0 0 24 24' fill='none' aria-hidden='true'>
              <path
                d='M12 20H21'
                stroke='currentColor'
                strokeWidth='1.8'
                strokeLinecap='round'
              />
              <path
                d='M16.5 3.5L20.5 7.5L8 20H4V16L16.5 3.5Z'
                stroke='currentColor'
                strokeWidth='1.8'
                strokeLinejoin='round'
                strokeLinecap='round'
              />
            </svg>
            단어추가
          </button>

          {/* 라이브러리 탭 */}
          <button
            type='button'
            className={getNavItemClass(location.pathname === '/library')}
            onClick={handleNavLibrary}
          >
            <svg width='22' height='22' viewBox='0 0 24 24' fill='none' aria-hidden='true'>
              <rect x='4' y='3' width='4' height='18' rx='1' stroke='currentColor' strokeWidth='1.8' />
              <rect x='10' y='6' width='4' height='15' rx='1' stroke='currentColor' strokeWidth='1.8' />
              <path
                d='M16 9.5L20 8V21L16 19.5V9.5Z'
                stroke='currentColor'
                strokeWidth='1.8'
                strokeLinejoin='round'
              />
            </svg>
            라이브러리
          </button>
        </div>
      </nav>
    </div>
  );
};
