import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { getWords, deleteWord, updateWord } from '@/common/utils/wordStorage';

function getNavItemClass(isActive) {
  const base =
    'flex flex-1 flex-col items-center gap-1 py-3 text-xs font-semibold focus-visible:outline focus-visible:outline-2';
  return isActive ? `${base} text-main` : `${base} text-gray05`;
}

function EmptyState({ onAdd }) {
  return (
    <div className='flex flex-col items-center gap-4 pt-20 text-center'>
      <svg width='48' height='48' viewBox='0 0 24 24' fill='none' aria-hidden='true' className='text-gray05'>
        <path d='M12 20H21' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' />
        <path
          d='M16.5 3.5L20.5 7.5L8 20H4V16L16.5 3.5Z'
          stroke='currentColor'
          strokeWidth='1.5'
          strokeLinejoin='round'
          strokeLinecap='round'
        />
      </svg>
      <p className='text-sm text-gray04'>저장된 단어가 없어요</p>
      <button
        type='button'
        onClick={onAdd}
        className='rounded-xl bg-main px-6 py-3 text-sm font-bold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-main02'
      >
        단어 추가하기
      </button>
    </div>
  );
}

function WordCard({ id, word, meaning, onDelete, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [editWord, setEditWord] = useState(word);
  const [editMeaning, setEditMeaning] = useState(meaning);

  const canSave = editWord.trim() !== '' && editMeaning.trim() !== '';

  function handleSave() {
    onUpdate(id, editWord.trim(), editMeaning.trim());
    setEditing(false);
  }

  function handleCancel() {
    setEditWord(word);
    setEditMeaning(meaning);
    setEditing(false);
  }

  if (editing) {
    return (
      <li className='flex flex-col gap-3 rounded-xl bg-card px-5 py-4'>
        <input
          className='rounded-lg border border-layer bg-surface px-3 py-2 text-sm text-gray01 focus:outline-none focus:ring-2 focus:ring-main'
          value={editWord}
          onChange={e => setEditWord(e.target.value)}
          placeholder='단어'
        />
        <input
          className='rounded-lg border border-layer bg-surface px-3 py-2 text-sm text-gray01 focus:outline-none focus:ring-2 focus:ring-main'
          value={editMeaning}
          onChange={e => setEditMeaning(e.target.value)}
          placeholder='뜻'
        />
        <div className='flex gap-2'>
          <button
            type='button'
            onClick={handleSave}
            disabled={!canSave}
            className='flex-1 rounded-lg bg-main py-2 text-sm font-bold text-white disabled:opacity-40'
          >
            저장
          </button>
          <button
            type='button'
            onClick={handleCancel}
            className='flex-1 rounded-lg border border-layer py-2 text-sm font-bold text-gray03'
          >
            취소
          </button>
        </div>
      </li>
    );
  }

  return (
    <li className='flex items-center justify-between rounded-xl bg-card px-5 py-4'>
      <div className='flex flex-col gap-0.5'>
        <span className='text-sm font-semibold text-gray01'>{word}</span>
        <span className='text-sm text-gray03'>{meaning}</span>
      </div>
      <div className='flex gap-2'>
        <button
          type='button'
          onClick={() => setEditing(true)}
          aria-label='수정'
          className='rounded-lg p-1.5 text-gray04 hover:text-main focus-visible:outline focus-visible:outline-2 focus-visible:outline-main02'
        >
          <svg width='16' height='16' viewBox='0 0 24 24' fill='none' aria-hidden='true'>
            <path d='M16.5 3.5L20.5 7.5L8 20H4V16L16.5 3.5Z' stroke='currentColor' strokeWidth='1.8' strokeLinejoin='round' strokeLinecap='round' />
          </svg>
        </button>
        <button
          type='button'
          onClick={() => onDelete(id)}
          aria-label='삭제'
          className='rounded-lg p-1.5 text-gray04 hover:text-red-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-300'
        >
          <svg width='16' height='16' viewBox='0 0 24 24' fill='none' aria-hidden='true'>
            <path d='M3 6H21' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' />
            <path d='M8 6V4H16V6' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' strokeLinejoin='round' />
            <path d='M19 6L18 20H6L5 6' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' strokeLinejoin='round' />
          </svg>
        </button>
      </div>
    </li>
  );
}

export const LibraryPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [words, setWords] = useState([]);

  useEffect(() => {
    setWords(getWords());
  }, []);

  function handleDelete(id) {
    setWords(deleteWord(id));
  }

  function handleUpdate(id, word, meaning) {
    setWords(updateWord(id, word, meaning));
  }

  return (
    <div className='flex min-h-dvh flex-col pb-20'>
      <header className='flex items-center px-5 py-4'>
        <h1 className='text-xl font-bold text-gray01'>라이브러리</h1>
      </header>

      <main className='mx-5 mt-2'>
        {words.length === 0 ? (
          <EmptyState onAdd={() => navigate('/words/new')} />
        ) : (
          <ul className='flex flex-col gap-3'>
            {words.map(w => (
              <WordCard key={w.id} id={w.id} word={w.word} meaning={w.meaning} onDelete={handleDelete} onUpdate={handleUpdate} />
            ))}
          </ul>
        )}
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
