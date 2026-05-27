import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getWrongNotes, removeWrongNote } from '@/common/utils/wordStorage';

export const WrongNotePage = () => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState(() => getWrongNotes());

  const handleDelete = (id) => {
    setNotes(removeWrongNote(id));
  };

  return (
    <div className='flex flex-col min-h-dvh px-5 pt-10 pb-8'>
      <div className='flex items-center gap-3 mb-6'>
        <button onClick={() => navigate(-1)} className='text-gray03 text-lg leading-none'>←</button>
        <h1 className='text-xl font-bold text-gray01'>오답노트</h1>
      </div>

      {notes.length === 0 ? (
        <div className='flex flex-col items-center justify-center flex-1 gap-2 text-center mt-20'>
          <p className='text-gray03 text-sm'>오답이 없어요</p>
          <p className='text-gray04 text-xs'>퀴즈를 풀면 틀린 단어가 여기에 쌓여요</p>
        </div>
      ) : (
        <ul className='flex flex-col gap-3'>
          {notes.map(note => (
            <li key={note.id} className='bg-card rounded-2xl px-5 py-4 flex items-start justify-between gap-3'>
              <div className='flex flex-col gap-1 flex-1 min-w-0'>
                <span className='text-base-white font-semibold text-sm'>{note.word}</span>
                <span className='text-gray03 text-xs'>{note.meaning}</span>
                <div className='flex items-center gap-2 mt-1'>
                  <span className='text-xs text-gray04'>{note.wordBookTitle}</span>
                  <span className='text-xs text-incorrect'>틀린 횟수 {note.wrongCount}회</span>
                </div>
              </div>
              <button
                onClick={() => handleDelete(note.id)}
                className='text-gray04 text-xs shrink-0 mt-0.5 px-2 py-1 rounded-lg bg-layer'
              >
                삭제
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
