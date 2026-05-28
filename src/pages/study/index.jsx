import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { getWordBooks, saveStudyRecord } from '@/common/utils/wordStorage';

export const StudyPage = () => {
  const { wordbookId } = useParams();
  const navigate = useNavigate();

  const books = getWordBooks();
  const book = books.find(b => String(b.id) === String(wordbookId));

  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  if (!book) {
    return (
      <div className='flex min-h-dvh flex-col items-center justify-center gap-4 px-5 text-center'>
        <p className='text-sm text-gray04'>단어장을 찾을 수 없어요</p>
        <button
          type='button'
          onClick={() => navigate('/')}
          className='rounded-xl bg-main px-6 py-3 text-sm font-bold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-main02'
        >
          홈으로 이동
        </button>
      </div>
    );
  }

  if (book.words.length === 0) {
    return (
      <div className='flex min-h-dvh flex-col items-center justify-center gap-4 px-5 text-center'>
        <p className='text-sm text-gray04'>이 단어장에 단어가 없어요</p>
        <button
          type='button'
          onClick={() => navigate('/words/new')}
          className='rounded-xl bg-main px-6 py-3 text-sm font-bold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-main02'
        >
          단어 추가하기
        </button>
      </div>
    );
  }

  const total = book.words.length;
  const current = book.words[index];
  const isFirst = index === 0;
  const isLast = index === total - 1;

  function handlePrev() {
    setIndex(i => i - 1);
    setFlipped(false);
  }

  function handleNext() {
    setIndex(i => i + 1);
    setFlipped(false);
  }

  return (
    <div className='flex min-h-dvh flex-col'>
      <header className='flex items-center gap-3 px-5 py-4'>
        <button
          type='button'
          onClick={() => navigate(-1)}
          aria-label='뒤로가기'
          className='rounded-lg p-1 text-gray03 focus-visible:outline focus-visible:outline-2 focus-visible:outline-main'
        >
          <svg width='22' height='22' viewBox='0 0 24 24' fill='none' aria-hidden='true'>
            <path d='M15 18L9 12L15 6' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' strokeLinejoin='round' />
          </svg>
        </button>
        <h1 className='flex-1 truncate text-lg font-bold text-gray01'>{book.title}</h1>
        <span className='shrink-0 text-sm font-semibold text-gray04'>
          {index + 1} / {total}
        </span>
      </header>

      <main className='flex flex-1 flex-col items-center justify-center px-5 pb-10'>
        <button
          type='button'
          onClick={() => setFlipped(f => !f)}
          aria-label={flipped ? '단어 보기' : '뜻 보기'}
          className='flex h-56 w-full max-w-sm flex-col items-center justify-center rounded-2xl bg-card px-6 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-main active:scale-[0.98] transition-transform'
        >
          {flipped ? (
            <>
              <span className='mb-2 text-xs font-semibold uppercase tracking-wider text-gray04'>뜻</span>
              <span className='text-center text-xl font-bold text-main'>{current.meaning}</span>
            </>
          ) : (
            <>
              <span className='mb-2 text-xs font-semibold uppercase tracking-wider text-gray04'>단어</span>
              <span className='text-center text-2xl font-bold text-gray01'>{current.word}</span>
            </>
          )}
          <span className='mt-4 text-xs text-gray05'>탭하여 {flipped ? '단어' : '뜻'} 보기</span>
        </button>

        <div className='mt-8 flex w-full max-w-sm gap-3'>
          <button
            type='button'
            onClick={handlePrev}
            disabled={isFirst}
            className='flex-1 rounded-xl border border-layer py-3.5 text-sm font-bold text-gray02 disabled:opacity-30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-main'
          >
            이전
          </button>

          {isLast ? (
            <button
              type='button'
              onClick={() => { saveStudyRecord(book.id, total, total); navigate(-1); }}
              className='flex-1 rounded-xl bg-main py-3.5 text-sm font-bold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-main02'
            >
              학습 완료
            </button>
          ) : (
            <button
              type='button'
              onClick={handleNext}
              className='flex-1 rounded-xl bg-main py-3.5 text-sm font-bold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-main02'
            >
              다음
            </button>
          )}
        </div>
      </main>
    </div>
  );
};
