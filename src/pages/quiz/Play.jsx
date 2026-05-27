import { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getWordBooks } from '@/common/utils/wordStorage';

const TIMER_SEC = 10;
const MIN_WORDS = 4;

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function buildQuizzes(words) {
  return shuffle(words).map((word) => {
    const distractors = shuffle(words.filter(w => w.id !== word.id)).slice(0, 3).map(w => w.word);
    return { meaning: word.meaning, answer: word.word, options: shuffle([word.word, ...distractors]) };
  });
}

function BookSelectStep({ books, onStart }) {
  const [selectedId, setSelectedId] = useState(null);
  const navigate = useNavigate();
  const selected = books.find(b => b.id === selectedId);
  const canStart = selected && selected.words.length >= MIN_WORDS;

  if (books.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center min-h-dvh px-6 gap-3 text-center'>
        <p className='text-gray03 text-sm'>단어장이 없어요</p>
        <p className='text-gray04 text-xs'>먼저 단어장을 만들고 단어를 추가해 주세요</p>
        <button onClick={() => navigate('/library')}
          className='mt-4 px-6 py-3 bg-main rounded-2xl text-white text-sm font-semibold'>
          단어장 만들기
        </button>
      </div>
    );
  }

  return (
    <div className='flex flex-col min-h-dvh px-5 pt-10 pb-8'>
      <h1 className='text-xl font-bold text-gray01 mb-1'>퀴즈</h1>
      <p className='text-sm text-gray03 mb-6'>단어장을 선택하세요</p>

      <ul className='flex flex-col gap-3'>
        {books.map(b => (
          <li key={b.id}>
            <button type='button' onClick={() => setSelectedId(b.id)}
              className={`w-full flex items-center justify-between rounded-xl px-5 py-4 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-main ${
                selectedId === b.id
                  ? 'bg-main/15 border border-main'
                  : 'bg-card border border-transparent'
              }`}>
              <span className={`font-semibold text-sm ${selectedId === b.id ? 'text-main' : 'text-gray01'}`}>
                {b.title}
              </span>
              <span className='text-xs text-gray04'>{b.words.length}단어</span>
            </button>
          </li>
        ))}
      </ul>

      {selected && selected.words.length < MIN_WORDS && (
        <p className='mt-4 text-xs text-incorrect text-center'>
          단어가 {MIN_WORDS}개 이상 필요해요 (현재 {selected.words.length}개)
        </p>
      )}

      <div className='mt-auto pt-6'>
        <button type='button' disabled={!canStart} onClick={() => onStart(selected.words)}
          className='w-full py-4 bg-main rounded-2xl text-white font-semibold text-sm disabled:opacity-40'>
          퀴즈 시작
        </button>
      </div>
    </div>
  );
}

function QuizPlay({ words, onDone }) {
  const quizzes = useMemo(() => buildQuizzes(words), [words]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [timedOut, setTimedOut] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIMER_SEC);
  const timerRef = useRef(null);

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

  const handleSelect = (option) => {
    if (isAnswered) return;
    clearInterval(timerRef.current);
    setSelected(option);
    if (option === quiz.answer) setCorrect(c => c + 1);
  };

  const handleNext = () => {
    if (isLast) {
      onDone(quizzes.length, correct);
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
        <span className='text-gray03 text-sm'>{index + 1} / {quizzes.length}</span>
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

export const QuizPlayPage = () => {
  const navigate = useNavigate();
  const [books] = useState(() => getWordBooks());
  const [words, setWords] = useState(null);

  if (!words) {
    return <BookSelectStep books={books} onStart={setWords} />;
  }

  return (
    <QuizPlay
      words={words}
      onDone={(total, correct) =>
        navigate('/quiz/result', { state: { total, correct }, replace: true })
      }
    />
  );
};
