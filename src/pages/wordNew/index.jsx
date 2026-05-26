import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { addWord } from '@/common/utils/wordStorage';

function getNavItemClass(isActive) {
  const base =
    'flex flex-1 flex-col items-center gap-1 py-3 text-xs font-semibold focus-visible:outline focus-visible:outline-2';
  return isActive ? `${base} text-main` : `${base} text-gray05`;
}

export const WordNewPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [word, setWord] = useState('');
  const [meaning, setMeaning] = useState('');

  const isDisabled = word.trim() === '' || meaning.trim() === '';

  const handleSave = () => {
    const saved = addWord(word.trim(), meaning.trim());
    console.log(saved);
    setWord('');
    setMeaning('');
  };

  return (
    <div className='flex min-h-dvh flex-col pb-20'>
      <header className='flex items-center px-5 py-4'>
        <h1 className='text-xl font-bold text-gray01'>단어 추가</h1>
      </header>

      <main className='mx-5 mt-2 flex flex-col gap-4'>
        <div className='flex flex-col gap-1.5'>
          <label htmlFor='word' className='text-xs font-semibold text-gray04'>
            단어
          </label>
          <input
            id='word'
            type='text'
            value={word}
            onChange={e => setWord(e.target.value)}
            placeholder='단어를 입력하세요'
            className='w-full rounded-xl bg-layer px-4 py-3.5 text-sm text-gray01 placeholder:text-gray05 focus:outline-none focus:ring-2 focus:ring-main'
          />
        </div>

        <div className='flex flex-col gap-1.5'>
          <label htmlFor='meaning' className='text-xs font-semibold text-gray04'>
            뜻
          </label>
          <input
            id='meaning'
            type='text'
            value={meaning}
            onChange={e => setMeaning(e.target.value)}
            placeholder='뜻을 입력하세요'
            className='w-full rounded-xl bg-layer px-4 py-3.5 text-sm text-gray01 placeholder:text-gray05 focus:outline-none focus:ring-2 focus:ring-main'
          />
        </div>

        <button
          type='button'
          disabled={isDisabled}
          onClick={handleSave}
          className='mt-2 w-full rounded-xl bg-main py-3.5 text-sm font-bold text-white transition-opacity focus-visible:outline focus-visible:outline-2 focus-visible:outline-main02 disabled:opacity-40'
        >
          저장
        </button>
      </main>

      <nav
        className='fixed bottom-0 left-1/2 w-full max-w-[430px] -translate-x-1/2 border-t border-layer bg-surface'
        aria-label='하단 내비게이션'
      >
        <div className='flex'>
          <button
            type='button'
            className={getNavItemClass(location.pathname === '/')}
            onClick={() => navigate('/')}
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

          <button
            type='button'
            className={getNavItemClass(location.pathname === '/words/new')}
            onClick={() => navigate('/words/new')}
          >
            <svg width='22' height='22' viewBox='0 0 24 24' fill='none' aria-hidden='true'>
              <path d='M12 20H21' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' />
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

          <button
            type='button'
            className={getNavItemClass(location.pathname === '/library')}
            onClick={() => navigate('/library')}
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
