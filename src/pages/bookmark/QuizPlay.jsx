import { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBookmarks, addWrongNote } from '@/common/utils/wordStorage';

const TIMER_SEC = 10;
const MIN_BOOKMARKS = 4;

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function buildQuizzes(bookmarks) {
  return shuffle(bookmarks).map((bm) => {
    const distractors = shuffle(bookmarks.filter(b => b.wordId !== bm.wordId))
      .slice(0, 3)
      .map(b => b.word);
    return {
      wordId: bm.wordId,
      wordBookId: bm.wordBookId,
      wordBookTitle: bm.wordBookTitle ?? '단어장',
      meaning: bm.meaning,
      answer: bm.word,
      options: shuffle([bm.word, ...distractors]),
    };
  });
}

function BookmarkQuizPlay({ bookmarks, onDone, onBack }) {
  const quizzes = useMemo(() => buildQuizzes(bookmarks), [bookmarks]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [timedOut, setTimedOut] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIMER_SEC);
  const timerRef = useRef(null);
  const wrongWordsRef = useRef([]);
  const resultsRef = useRef([]);

  const isAnswered = selected !== null || timedOut;
  const quiz = quizzes[index];
  const isLast = index === quizzes.length - 1;
  const isWarning = timeLeft <= 3 && !isAnswered;
  const timerPct = (timeLeft / TIMER_SEC) * 100;

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          setTimedOut(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [index]);

  const addToWrong = (q) => {
    if (!wrongWordsRef.current.some(w => w.id === q.wordId)) {
      wrongWordsRef.current = [...wrongWordsRef.current, {
        id: q.wordId, word: q.answer, meaning: q.meaning,
        wordBookId: q.wordBookId, wordBookTitle: q.wordBookTitle,
      }];
    }
  };

  useEffect(() => {
    if (timedOut) {
      addToWrong(quiz);
      resultsRef.current = [...resultsRef.current, {
        wordId: quiz.wordId, wordBookId: quiz.wordBookId, wordBookTitle: quiz.wordBookTitle,
        meaning: quiz.meaning, answer: quiz.answer, userAnswer: null, isCorrect: false,
      }];
    }
  }, [timedOut, quiz]);

  const handleSelect = (option) => {
    if (isAnswered) return;
    clearInterval(timerRef.current);
    setSelected(option);
    const isCorrect = option === quiz.answer;
    if (isCorrect) {
      setCorrect(c => c + 1);
    } else {
      addToWrong(quiz);
    }
    resultsRef.current = [...resultsRef.current, {
      wordId: quiz.wordId, wordBookId: quiz.wordBookId, wordBookTitle: quiz.wordBookTitle,
      meaning: quiz.meaning, answer: quiz.answer, userAnswer: option, isCorrect,
    }];
  };

  const handleNext = () => {
    if (isLast) {
      onDone(quizzes.length, correct, wrongWordsRef.current, resultsRef.current);
    } else {
      clearInterval(timerRef.current);
      setTimeLeft(TIMER_SEC);
      setSelected(null);
      setTimedOut(false);
      setIndex(i => i + 1);
    }
  };

  const isCorrectAnswer = selected === quiz.answer;
  const feedbackMsg = timedOut
    ? `시간 초과! 정답: ${quiz.answer}`
    : isCorrectAnswer
      ? '정답입니다! 🎉'
      : `오답입니다. 정답: ${quiz.answer}`;
  const feedbackCls = isCorrectAnswer && !timedOut
    ? 'bg-correct/15 text-correct'
    : 'bg-incorrect/15 text-incorrect';

  return (
    <div className='flex flex-col min-h-dvh px-5 pt-10 pb-8'>
      <div className='flex items-center justify-between mb-2'>
        <div className='flex items-center gap-2'>
          <button type='button' onClick={onBack}
            className='rounded-lg p-1 text-gray03 focus-visible:outline focus-visible:outline-2 focus-visible:outline-main'>
            <svg width='20' height='20' viewBox='0 0 24 24' fill='none' aria-hidden='true'>
              <path d='M15 18L9 12L15 6' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' strokeLinejoin='round' />
            </svg>
          </button>
          <span className='text-gray03 text-sm'>{index + 1} / {quizzes.length}</span>
        </div>
        <span className={`text-sm font-medium ${isWarning ? 'text-incorrect' : 'text-gray03'}`}>
          {timedOut ? '시간 초과' : `남은 시간 ${timeLeft}초`}
        </span>
      </div>
      <div className='w-full h-1.5 bg-layer rounded-full mb-8 overflow-hidden'>
        <div
          className={`h-full rounded-full ${isWarning ? 'bg-incorrect' : 'bg-main'}`}
          style={{
            width: `${timerPct}%`,
            transition: timeLeft < TIMER_SEC && !isAnswered ? 'width 1s linear' : 'none',
          }}
        />
      </div>

      <p className='text-gray03 text-xs mb-3'>뜻을 보고 단어를 맞추세요</p>
      <p className='text-base-white text-xl font-semibold leading-snug mb-8'>{quiz.meaning}</p>

      <div className='flex flex-col gap-3'>
        {quiz.options.map((option) => {
          let cls = 'bg-card border border-layer text-base-white';
          if (isAnswered) {
            if (option === quiz.answer) cls = 'bg-correct/15 border border-correct text-correct';
            else if (option === selected) cls = 'bg-incorrect/15 border border-incorrect text-incorrect';
            else cls = 'bg-card border border-layer text-gray04';
          }
          return (
            <button key={option} onClick={() => handleSelect(option)}
              className={`w-full py-4 px-5 rounded-2xl text-left text-sm font-medium transition-all ${cls}`}>
              {option}
            </button>
          );
        })}
      </div>

      {isAnswered && (
        <div className='mt-auto pt-6'>
          <div className={`mb-4 py-3 px-4 rounded-xl text-sm font-medium ${feedbackCls}`}>
            {feedbackMsg}
          </div>
          <button onClick={handleNext} className='w-full py-4 bg-main rounded-2xl text-white font-semibold'>
            {isLast ? '결과 보기' : '다음 문제'}
          </button>
        </div>
      )}
    </div>
  );
}

export const BookmarkQuizPage = () => {
  const navigate = useNavigate();
  const bookmarks = useMemo(() => getBookmarks(), []);

  if (bookmarks.length < MIN_BOOKMARKS) {
    return (
      <div className='flex flex-col items-center justify-center min-h-dvh px-6 gap-3 text-center'>
        <svg width='40' height='40' viewBox='0 0 24 24' fill='none' className='text-gray05 mb-1' aria-hidden='true'>
          <path d='M5 3h14a1 1 0 0 1 1 1v17l-8-4-8 4V4a1 1 0 0 1 1-1z'
            stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
        </svg>
        <p className='text-gray03 text-sm'>북마크 단어가 부족해요</p>
        <p className='text-gray04 text-xs'>
          퀴즈를 위해 북마크 단어가 {MIN_BOOKMARKS}개 이상 필요해요 (현재 {bookmarks.length}개)
        </p>
        <button
          onClick={() => navigate(-1)}
          className='mt-4 px-6 py-3 bg-main rounded-2xl text-white text-sm font-semibold'
        >
          돌아가기
        </button>
      </div>
    );
  }

  return (
    <BookmarkQuizPlay
      bookmarks={bookmarks}
      onBack={() => navigate(-1)}
      onDone={(total, correct, wrongWords, results) => {
        wrongWords.forEach(w => addWrongNote(w));
        navigate('/quiz/result', { state: { total, correct, results }, replace: true });
      }}
    />
  );
};
