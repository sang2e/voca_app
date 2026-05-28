import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { getWordBooks, getStudyRecords } from '@/common/utils/wordStorage';
import { BottomNav } from '@/common/components/BottomNav';

import { HomeWordbookCard } from './components/HomeWordbookCard';

export const HomePage = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [studyRecords, setStudyRecords] = useState([]);

  useEffect(() => {
    setBooks(getWordBooks());
    setStudyRecords(getStudyRecords());
  }, []);

  const wordbookCount = books.length;
  const totalWordCount = books.reduce((sum, b) => sum + b.words.length, 0);

  const today = new Date().toDateString();
  const existingIds = new Set(books.map(b => b.id));
  const todayLearnedCount = studyRecords
    .filter(r => existingIds.has(r.wordBookId) && new Date(r.completedAt).toDateString() === today)
    .reduce((sum, r) => sum + r.learnedCount, 0);
  const progress = totalWordCount > 0 ? Math.min(100, Math.round((todayLearnedCount / totalWordCount) * 100)) : 0;

  const studyRecordMap = Object.fromEntries(studyRecords.map(r => [r.wordBookId, r]));

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

        <div className='mt-4'>
          <div className='mb-1.5 flex items-center justify-between'>
            <span className='text-xs text-gray03'>오늘 학습 진행률</span>
            <span className='text-xs font-semibold text-main'>{todayLearnedCount} / {totalWordCount} 단어 ({progress}%)</span>
          </div>
          <div className='h-2 w-full overflow-hidden rounded-full bg-layer'>
            <div className='h-full rounded-full bg-main transition-all' style={{ width: `${progress}%` }} />
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
                <HomeWordbookCard wordbook={wordbook} studyRecord={studyRecordMap[wordbook.id]} onStudyClick={id => navigate(`/study/${id}`)} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <BottomNav />
    </div>
  );
};
