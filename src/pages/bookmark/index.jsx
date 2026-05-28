import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBookmarks, toggleBookmark } from '@/common/utils/wordStorage';

const MIN_QUIZ_WORDS = 4;

export const BookmarkPage = () => {
  const navigate = useNavigate();
  const [bookmarks, setBookmarks] = useState(() => getBookmarks());

  const handleRemove = (b) => {
    toggleBookmark(b);
    setBookmarks(getBookmarks());
  };

  // wordBookId 기준으로 그룹핑
  const groups = bookmarks.reduce((acc, b) => {
    const key = b.wordBookId;
    if (!acc[key]) acc[key] = { wordBookId: b.wordBookId, title: b.wordBookTitle ?? '단어장', items: [] };
    acc[key].items.push(b);
    return acc;
  }, {});
  const groupList = Object.values(groups);

  return (
    <div className='flex flex-col min-h-dvh px-5 pt-10 pb-32'>
      <div className='flex items-center gap-3 mb-6'>
        <button
          type='button'
          onClick={() => navigate(-1)}
          className='rounded-lg p-1 text-gray03 focus-visible:outline focus-visible:outline-2 focus-visible:outline-main'
        >
          <svg width='22' height='22' viewBox='0 0 24 24' fill='none' aria-hidden='true'>
            <path d='M15 18L9 12L15 6' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' strokeLinejoin='round' />
          </svg>
        </button>
        <h1 className='text-xl font-bold text-gray01'>북마크</h1>
        {bookmarks.length > 0 && (
          <span className='ml-auto text-xs text-gray04'>{bookmarks.length}개</span>
        )}
      </div>

      {bookmarks.length === 0 ? (
        <div className='flex flex-col items-center justify-center flex-1 gap-2 text-center mt-20'>
          <svg width='40' height='40' viewBox='0 0 24 24' fill='none' className='text-gray05 mb-1' aria-hidden='true'>
            <path d='M5 3h14a1 1 0 0 1 1 1v17l-8-4-8 4V4a1 1 0 0 1 1-1z'
              stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
          </svg>
          <p className='text-gray03 text-sm'>북마크한 단어가 없어요</p>
          <p className='text-gray04 text-xs'>퀴즈 결과 화면에서 단어를 북마크할 수 있어요</p>
        </div>
      ) : (
        <ul className='flex flex-col gap-4'>
          {groupList.map(group => (
            <li key={group.wordBookId}>
              <p className='text-xs text-gray04 font-medium mb-2 px-1'>{group.title ?? '단어장'}</p>
              <ul className='flex flex-col gap-2'>
                {group.items.map(b => (
                  <li
                    key={`${b.wordBookId}_${b.wordId}`}
                    className='bg-card rounded-2xl px-5 py-4 flex items-center justify-between gap-3'
                  >
                    <div className='flex flex-col gap-1 flex-1 min-w-0'>
                      <span className='text-base-white font-semibold text-sm break-all'>{b.word}</span>
                      <span className='text-gray03 text-xs break-all'>{b.meaning}</span>
                    </div>
                    <button
                      type='button'
                      onClick={() => handleRemove(b)}
                      className='text-main shrink-0'
                      aria-label='북마크 해제'
                    >
                      <svg width='18' height='18' viewBox='0 0 24 24' fill='currentColor' aria-hidden='true'>
                        <path d='M5 3h14a1 1 0 0 1 1 1v17l-8-4-8 4V4a1 1 0 0 1 1-1z'
                          stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' strokeLinejoin='round' />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
      <div className='fixed bottom-0 left-0 right-0'
        style={{ background: 'linear-gradient(to top, var(--color-bg, #0f0f13) 70%, transparent)' }}>
        <div className='mx-auto w-full max-w-[430px] px-5 pb-8 pt-4'>
          <button
            type='button'
            disabled={bookmarks.length < MIN_QUIZ_WORDS}
            onClick={() => navigate('/bookmark/quiz')}
            className='w-full py-4 bg-main rounded-2xl text-white font-semibold text-sm disabled:opacity-40'
          >
            북마크 복습하기
          </button>
          {bookmarks.length > 0 && bookmarks.length < MIN_QUIZ_WORDS && (
            <p className='mt-2 text-xs text-gray04 text-center'>
              퀴즈를 위해 {MIN_QUIZ_WORDS}개 이상 필요해요 (현재 {bookmarks.length}개)
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
