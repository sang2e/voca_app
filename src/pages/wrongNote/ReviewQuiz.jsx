import { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getWrongNotes, addWrongNote, removeWrongNote } from '@/common/utils/wordStorage';

const TIMER_SEC = 10;
const MIN_NOTES = 2;

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function buildQuizzes(notes) {
  return shuffle(notes).map((note) => {
    const distractors = shuffle(notes.filter(n => n.id !== note.id))
      .slice(0, 3)
      .map(n => n.word);
    return {
      noteId: note.id,
      word: note.word,
      meaning: note.meaning,
      wordBookId: note.wordBookId,
      wordBookTitle: note.wordBookTitle,
      answer: note.word,
      options: shuffle([note.word, ...distractors]),
    };
  });
}

function ReviewPlay({ notes, onDone }) {
  const quizzes = useMemo(() => buildQuizzes(notes), [notes]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [timedOut, setTimedOut] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIMER_SEC);
  const timerRef = useRef(null);
  const correctIdsRef = useRef([]);
  const wrongIdsRef = useRef([]);

  const quiz = quizzes[index];
  const isAnswered = selected !== null || timedOut;
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

  useEffect(() => {
    if (timedOut && !wrongIdsRef.current.includes(quiz.noteId)) {
      wrongIdsRef.current = [...wrongIdsRef.current, quiz.noteId];
    }
  }, [timedOut, quiz]);

  const handleSelect = (option) => {
    if (isAnswered) return;
    clearInterval(timerRef.current);
    setSelected(option);
    if (option === quiz.answer) {
      if (!correctIdsRef.current.includes(quiz.noteId)) {
        correctIdsRef.current = [...correctIdsRef.current, quiz.noteId];
      }
    } else {
      if (!wrongIdsRef.current.includes(quiz.noteId)) {
        wrongIdsRef.current = [...wrongIdsRef.current, quiz.noteId];
      }
    }
  };

  const handleNext = () => {
    if (isLast) {
      onDone(quizzes.length, correctIdsRef.current.length, correctIdsRef.current, wrongIdsRef.current);
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
      ? '정답입니다!'
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

function ReviewResult({ total, correctCount }) {
  const navigate = useNavigate();
  return (
    <div className='flex flex-col items-center justify-center min-h-dvh px-6 gap-4 text-center'>
      <h2 className='text-xl font-bold text-gray01'>복습 완료!</h2>
      <p className='text-gray03 text-sm'>
        {total}문제 중 <span className='text-main font-semibold'>{correctCount}개</span> 정답
      </p>
      {correctCount > 0 && (
        <p className='text-xs text-correct'>
          정답 맞힌 단어 {correctCount}개가 오답노트에서 제거됐어요
        </p>
      )}
      <button
        onClick={() => navigate('/wrong-note', { replace: true })}
        className='mt-4 w-full py-4 bg-main rounded-2xl text-white font-semibold text-sm'
      >
        오답노트로 돌아가기
      </button>
    </div>
  );
}

export const WrongNoteReviewPage = () => {
  const navigate = useNavigate();
  const notes = useMemo(() => getWrongNotes(), []);
  const [result, setResult] = useState(null);

  if (notes.length < MIN_NOTES) {
    return (
      <div className='flex flex-col items-center justify-center min-h-dvh px-6 gap-3 text-center'>
        <p className='text-gray03 text-sm'>복습할 단어가 부족해요</p>
        <p className='text-gray04 text-xs'>
          오답노트에 단어가 {MIN_NOTES}개 이상 필요해요 (현재 {notes.length}개)
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

  if (result) {
    return <ReviewResult total={result.total} correctCount={result.correctCount} />;
  }

  return (
    <ReviewPlay
      notes={notes}
      onDone={(total, correctCount, correctIds, wrongIds) => {
        correctIds.forEach(id => removeWrongNote(id));
        const notesMap = Object.fromEntries(notes.map(n => [n.id, n]));
        wrongIds.forEach(id => {
          const note = notesMap[id];
          if (note) addWrongNote({
            id: note.id,
            word: note.word,
            meaning: note.meaning,
            wordBookId: note.wordBookId,
            wordBookTitle: note.wordBookTitle,
          });
        });
        setResult({ total, correctCount });
      }}
    />
  );
};
