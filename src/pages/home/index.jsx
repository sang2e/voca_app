import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { getWordBooks } from '@/common/utils/wordStorage';

import { HomeWordbookCard } from './components/HomeWordbookCard';

function getNavItemClass(isActive) {
  const base = 'flex flex-1 flex-col items-center gap-1 py-3 text-xs font-semibold focus-visible:outline focus-visible:outline-2';
  if (isActive) return `${base} text-main`;
  return `${base} text-gray05`;
}

export const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [books, setBooks] = useState([]);

  useEffect(() => {
    setBooks(getWordBooks());
  }, []);

  const wordbookCount = books.length;
  const totalWordCount = books.reduce((sum, b) => sum + b.words.length, 0);

  const handleStudyStart = () => {
    if (books.length === 0) { navigate('/library'); return; }
    navigate(`/study/${books[0].id}`);
  };

  return (
    <div className='flex min-h-dvh flex-col pb-20'>
      <header className='flex items-center justify-between px-5 py-4'>
        <h1 className='text-xl font-bold text-main'>VocaApp</h1>
        <button
          type='button'
          className='flex h-9 w-9 items-center justify-center rounded-full bg-layer text-gray03 focus-visible:outline focus-visible:outline-2 focus-visible:outline-main'
          aria-label='마이페이지로 이동'
          onClick={() => navigate('/settings')}
        >
          <span aria-hidden='true'>&#9881;</span>
        </button>
      </header>

      <section className='mx-5 mt-1 rounded-2xl bg-card p-5'>
        <p className='text-xs font-semibold uppercase tracking-wider text-gray04'>학습 현황</p>
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

        <button
          type='button'
          className='mt-5 w-full rounded-xl bg-main py-3.5 text-sm font-bold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-main02'
          onClick={handleStudyStart}
        >
          학습 시작하기
        </button>
      </section>

      <div className='mx-5 mt-3 grid grid-cols-2 gap-3'>
        <button
          type='button'
          className='rounded-xl bg-layer py-4 text-sm font-semibold text-gray01 focus-visible:outline focus-visible:outline-2 focus-visible:outline-main'
          onClick={() => navigate('/words/new')}
        >
          단어 추가
        </button>
        <button
          type='button'
          className='rounded-xl bg-layer py-4 text-sm font-semibold text-gray01 focus-visible:outline focus-visible:outline-2 focus-visible:outline-main'
          onClick={() => navigate('/quiz/play')}
        >
          퀴즈 시작
        </button>
      </div>

      <section className='mx-5 mt-7'>
        <h2 className='mb-3 text-sm font-bold text-gray01'>나의 단어장</h2>
        {books.length === 0 ? (
          <div className='flex flex-col items-center gap-3 py-10 text-center'>
            <p className='text-sm text-gray04'>단어장이 없어요</p>
            <button type='button' onClick={() => navigate('/library')}
              className='rounded-xl bg-main px-5 py-2.5 text-sm font-bold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-main02'>
              단어장 만들기
            </button>
          </div>
        ) : (
          <ul className='flex flex-col gap-3'>
            {books.map(wordbook => (
              <li key={wordbook.id}>
                <HomeWordbookCard wordbook={wordbook} onStudyClick={id => navigate(`/study/${id}`)} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <nav
        className='fixed bottom-0 left-1/2 w-full max-w-[430px] -translate-x-1/2 border-t border-layer bg-surface'
        aria-label='하단 내비게이션'
      >
        <div className='flex'>
          <button type='button' className={getNavItemClass(location.pathname === '/')} onClick={() => navigate('/')}>
            <svg width='22' height='22' viewBox='0 0 24 24' fill='none' aria-hidden='true'>
              <path d='M3 12L12 3L21 12V21H15V15H9V21H3V12Z' stroke='currentColor' strokeWidth='1.8' strokeLinejoin='round' strokeLinecap='round' />
            </svg>
            홈
          </button>
          <button type='button' className={getNavItemClass(location.pathname === '/words/new')} onClick={() => navigate('/words/new')}>
            <svg width='22' height='22' viewBox='0 0 24 24' fill='none' aria-hidden='true'>
              <path d='M12 20H21' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' />
              <path d='M16.5 3.5L20.5 7.5L8 20H4V16L16.5 3.5Z' stroke='currentColor' strokeWidth='1.8' strokeLinejoin='round' strokeLinecap='round' />
            </svg>
            단어추가
          </button>
          <button type='button' className={getNavItemClass(location.pathname === '/library')} onClick={() => navigate('/library')}>
            <svg width='22' height='22' viewBox='0 0 24 24' fill='none' aria-hidden='true'>
              <rect x='4' y='3' width='4' height='18' rx='1' stroke='currentColor' strokeWidth='1.8' />
              <rect x='10' y='6' width='4' height='15' rx='1' stroke='currentColor' strokeWidth='1.8' />
              <path d='M16 9.5L20 8V21L16 19.5V9.5Z' stroke='currentColor' strokeWidth='1.8' strokeLinejoin='round' />
            </svg>
            라이브러리
          </button>
        </div>
      </nav>
    </div>
  );
};
