import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getBookmarks, toggleBookmark } from '@/common/utils/wordStorage';

function BookmarkIcon({ filled }) {
  return (
    <svg width='18' height='18' viewBox='0 0 24 24' fill={filled ? 'currentColor' : 'none'} aria-hidden='true'>
      <path d='M5 3h14a1 1 0 0 1 1 1v17l-8-4-8 4V4a1 1 0 0 1 1-1z'
        stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
  );
}

export const QuizResultPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [showWrongOnly, setShowWrongOnly] = useState(false);
  const [bookmarks, setBookmarks] = useState(() => getBookmarks());

  if (!state) {
    navigate('/', { replace: true });
    return null;
  }

  const { total, correct, results = [] } = state;
  const wrong = total - correct;
  const pct = Math.round((correct / total) * 100);
  const filtered = showWrongOnly ? results.filter(r => !r.isCorrect) : results;

  const checkBookmarked = (r) =>
    bookmarks.some(b => b.wordBookId === r.wordBookId && b.wordId === r.wordId);

  const handleToggleBookmark = (r) => {
    toggleBookmark({ wordBookId: r.wordBookId, wordId: r.wordId, word: r.answer, meaning: r.meaning, wordBookTitle: r.wordBookTitle });
    setBookmarks(getBookmarks());
  };

  return (
    <div className='flex flex-col min-h-dvh'>
      <div className='flex-1 overflow-y-auto px-5 pt-10 pb-48'>
        {/* 점수 요약 */}
        <div className='flex flex-col items-center mb-6'>
          <p className='text-4xl mb-3'>{pct >= 80 ? '🏆' : pct >= 50 ? '👍' : '💪'}</p>
          <p className='text-gray03 text-sm mb-1'>퀴즈 완료</p>
          <p className='text-base-white text-3xl font-bold'>{pct}점</p>
        </div>

        <div className='bg-card rounded-2xl p-5 flex justify-around mb-6'>
          <div className='flex flex-col items-center gap-1'>
            <span className='text-gray03 text-xs'>총 문제</span>
            <span className='text-base-white text-2xl font-bold'>{total}</span>
          </div>
          <div className='w-px bg-layer' />
          <div className='flex flex-col items-center gap-1'>
            <span className='text-correct text-xs'>정답</span>
            <span className='text-correct text-2xl font-bold'>{correct}</span>
          </div>
          <div className='w-px bg-layer' />
          <div className='flex flex-col items-center gap-1'>
            <span className='text-incorrect text-xs'>오답</span>
            <span className='text-incorrect text-2xl font-bold'>{wrong}</span>
          </div>
        </div>

        {/* 상세 결과 */}
        {results.length > 0 && (
          <>
            {/* 필터 토글 */}
            <div className='flex bg-card rounded-xl p-1 mb-4'>
              <button
                type='button'
                onClick={() => setShowWrongOnly(false)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                  !showWrongOnly ? 'bg-main text-white' : 'text-gray03'
                }`}
              >
                전체 보기
              </button>
              <button
                type='button'
                onClick={() => setShowWrongOnly(true)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                  showWrongOnly ? 'bg-incorrect text-white' : 'text-gray03'
                }`}
              >
                오답만 ({wrong})
              </button>
            </div>

            {filtered.length === 0 ? (
              <p className='text-center text-gray04 text-sm py-8'>오답이 없어요 🎉</p>
            ) : (
              <ul className='flex flex-col gap-3'>
                {filtered.map((r, i) => (
                  <li
                    key={i}
                    className={`rounded-2xl p-4 border ${
                      r.isCorrect
                        ? 'bg-correct/10 border-correct/30'
                        : 'bg-incorrect/10 border-incorrect/30'
                    }`}
                  >
                    <div className='flex items-center justify-between mb-2'>
                      <span className='text-xs text-gray04'>
                        {results.indexOf(r) + 1}번
                      </span>
                      <div className='flex items-center gap-2'>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          r.isCorrect
                            ? 'bg-correct/20 text-correct'
                            : 'bg-incorrect/20 text-incorrect'
                        }`}>
                          {r.isCorrect ? '정답' : '오답'}
                        </span>
                        {r.wordId != null && (
                          <button
                            type='button'
                            onClick={() => handleToggleBookmark(r)}
                            className={`p-1 rounded-lg transition-colors ${
                              checkBookmarked(r) ? 'text-main' : 'text-gray04'
                            }`}
                            aria-label={checkBookmarked(r) ? '북마크 해제' : '북마크 추가'}
                          >
                            <BookmarkIcon filled={checkBookmarked(r)} />
                          </button>
                        )}
                      </div>
                    </div>
                    <p className='text-base-white text-sm font-semibold mb-2 break-all'>{r.answer}</p>
                    <p className='text-gray03 text-xs mb-2'>뜻: {r.meaning}</p>
                    {!r.isCorrect && (
                      <div className='flex flex-col gap-1 pt-2 border-t border-layer'>
                        <p className='text-xs'>
                          <span className='text-gray04'>내 답: </span>
                          <span className='text-incorrect font-medium break-all'>
                            {r.userAnswer ?? '시간 초과'}
                          </span>
                        </p>
                        <p className='text-xs'>
                          <span className='text-gray04'>정답: </span>
                          <span className='text-correct font-medium break-all'>{r.answer}</span>
                        </p>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>

      {/* 하단 액션 버튼 */}
      <div className='fixed bottom-0 left-0 right-0'
        style={{ background: 'linear-gradient(to top, var(--color-bg, #0f0f13) 70%, transparent)' }}>
        <div className='mx-auto w-full max-w-[430px] px-5 pb-8 pt-4'>
        <div className='flex flex-col gap-2'>
          <button
            onClick={() => navigate('/quiz/play', { replace: true })}
            className='w-full py-4 bg-main rounded-2xl text-white font-semibold text-sm'
          >
            다시 풀기
          </button>
          <div className='flex gap-2'>
            {wrong > 0 && (
              <button
                onClick={() => navigate('/wrong-note')}
                className='flex-1 py-3 bg-incorrect/15 rounded-2xl text-incorrect font-semibold text-sm'
              >
                오답노트
              </button>
            )}
            <button
              onClick={() => navigate('/bookmark')}
              className='flex-1 py-3 bg-layer rounded-2xl text-main font-semibold text-sm'
            >
              북마크
            </button>
            <button
              onClick={() => navigate('/')}
              className='flex-1 py-3 bg-layer rounded-2xl text-gray02 font-semibold text-sm'
            >
              홈으로
            </button>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};
