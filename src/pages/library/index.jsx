import { useEffect, useState } from 'react';
import { useLocation,useNavigate } from 'react-router-dom';

import { BottomNav } from '@/common/components/BottomNav';
import { addWordBook, deleteWord, deleteWordBook, getBookmarks, getWordBooks, toggleBookmark, updateWord } from '@/common/utils/wordStorage';

function BookmarkIcon({ filled }) {
  return (
    <svg width='18' height='18' viewBox='0 0 24 24' fill={filled ? 'currentColor' : 'none'} aria-hidden='true'>
      <path d='M5 3h14a1 1 0 0 1 1 1v17l-8-4-8 4V4a1 1 0 0 1 1-1z'
        stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
  );
}

function WordCard({ wordbookId, id, word, meaning, bookmarked, onDelete, onUpdate, onToggleBookmark }) {
  const [editing, setEditing] = useState(false);
  const [editWord, setEditWord] = useState(word);
  const [editMeaning, setEditMeaning] = useState(meaning);

  const canSave = editWord.trim() !== '' && editMeaning.trim() !== '';

  function handleSave() {
    onUpdate(wordbookId, id, editWord.trim(), editMeaning.trim());
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
          <button type='button' onClick={handleSave} disabled={!canSave}
            className='flex-1 rounded-lg bg-main py-2 text-sm font-bold text-white disabled:opacity-40'>
            저장
          </button>
          <button type='button' onClick={handleCancel}
            className='flex-1 rounded-lg border border-layer py-2 text-sm font-bold text-gray03'>
            취소
          </button>
        </div>
      </li>
    );
  }

  return (
    <li className={`flex items-center justify-between rounded-xl px-5 py-4 ${bookmarked ? 'border border-main/30 bg-main/5' : 'bg-card'}`}>
      <div className='flex flex-col gap-0.5'>
        <span className='text-sm font-semibold text-gray01'>{word}</span>
        <span className='text-sm text-gray03'>{meaning}</span>
      </div>
      <div className='flex gap-1'>
        <button type='button' onClick={() => onToggleBookmark(wordbookId, id, word, meaning)}
          aria-label={bookmarked ? '북마크 해제' : '북마크 추가'}
          className={`rounded-lg p-1.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-main02 ${bookmarked ? 'text-main' : 'text-gray04 hover:text-main'}`}>
          <BookmarkIcon filled={bookmarked} />
        </button>
        <button type='button' onClick={() => setEditing(true)} aria-label='수정'
          className='rounded-lg p-1.5 text-gray04 hover:text-main focus-visible:outline focus-visible:outline-2 focus-visible:outline-main02'>
          <svg width='16' height='16' viewBox='0 0 24 24' fill='none' aria-hidden='true'>
            <path d='M16.5 3.5L20.5 7.5L8 20H4V16L16.5 3.5Z' stroke='currentColor' strokeWidth='1.8' strokeLinejoin='round' strokeLinecap='round' />
          </svg>
        </button>
        <button type='button' onClick={() => onDelete(wordbookId, id)} aria-label='삭제'
          className='rounded-lg p-1.5 text-gray04 hover:text-red-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-300'>
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
  const [books, setBooks] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [selectedBook, setSelectedBook] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarks, setBookmarks] = useState(() => getBookmarks());

  useEffect(() => {
    setBooks(getWordBooks());
    setSelectedBook(null);
    setSearchQuery('');
  }, [location.key]);

  function handleAddBook() {
    if (!newTitle.trim()) return;
    const updated = [...books, addWordBook(newTitle.trim())];
    setBooks(updated);
    setNewTitle('');
  }

  function handleDeleteBook(id) {
    setBooks(deleteWordBook(id));
  }

  function handleDeleteWord(wordbookId, wordId) {
    const updated = deleteWord(wordbookId, wordId);
    setBooks(updated);
    const refreshed = updated.find(b => b.id === wordbookId);
    if (refreshed) setSelectedBook(refreshed);
  }

  function handleUpdateWord(wordbookId, wordId, word, meaning) {
    const updated = updateWord(wordbookId, wordId, word, meaning);
    setBooks(updated);
    const refreshed = updated.find(b => b.id === wordbookId);
    if (refreshed) setSelectedBook(refreshed);
  }

  function handleToggleBookmark(wordbookId, wordId, word, meaning) {
    toggleBookmark({ wordBookId: wordbookId, wordId, word, meaning });
    setBookmarks(getBookmarks());
  }

  function checkBookmarked(wordbookId, wordId) {
    return bookmarks.some(b => b.wordBookId === wordbookId && b.wordId === wordId);
  }


  if (selectedBook) {
    const q = searchQuery.trim().toLowerCase();
    const filteredWords = q
      ? selectedBook.words.filter(
          w => w.word.toLowerCase().includes(q) || w.meaning.toLowerCase().includes(q)
        )
      : selectedBook.words;

    return (
      <div className='flex min-h-dvh flex-col pb-20'>
        <header className='flex items-center gap-3 px-5 py-4'>
          <button type='button' onClick={() => { setSelectedBook(null); setSearchQuery(''); }} aria-label='뒤로가기'
            className='rounded-lg p-1 text-gray03 focus-visible:outline focus-visible:outline-2 focus-visible:outline-main'>
            <svg width='22' height='22' viewBox='0 0 24 24' fill='none' aria-hidden='true'>
              <path d='M15 18L9 12L15 6' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' strokeLinejoin='round' />
            </svg>
          </button>
          <h1 className='flex-1 text-xl font-bold text-gray01'>{selectedBook.title}</h1>
          <div className='flex gap-2'>
            <button type='button' onClick={() => navigate(`/study/${selectedBook.id}`)}
              className='rounded-xl border border-main px-4 py-2 text-xs font-bold text-main focus-visible:outline focus-visible:outline-2 focus-visible:outline-main02'>
              학습하기
            </button>
            <button type='button' onClick={() => navigate('/words/new')}
              className='rounded-xl bg-main px-4 py-2 text-xs font-bold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-main02'>
              단어 추가
            </button>
          </div>
        </header>

        {selectedBook.words.length > 0 && (
          <div className='mx-5 mb-3 relative'>
            <input
              type='text'
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder='단어 또는 뜻 검색'
              className='w-full rounded-xl bg-layer px-4 py-3 pr-10 text-sm text-gray01 placeholder:text-gray05 focus:outline-none focus:ring-2 focus:ring-main'
            />
            {searchQuery && (
              <button
                type='button'
                onClick={() => setSearchQuery('')}
                aria-label='검색어 초기화'
                className='absolute right-3 top-1/2 -translate-y-1/2 text-gray04 hover:text-gray02'
              >
                <svg width='16' height='16' viewBox='0 0 24 24' fill='none' aria-hidden='true'>
                  <path d='M18 6L6 18M6 6L18 18' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' />
                </svg>
              </button>
            )}
          </div>
        )}

        <main className='mx-5 mt-2'>
          {selectedBook.words.length === 0 ? (
            <div className='flex flex-col items-center gap-4 pt-20 text-center'>
              <p className='text-sm text-gray04'>이 단어장에 단어가 없어요</p>
              <button type='button' onClick={() => navigate('/words/new')}
                className='rounded-xl bg-main px-6 py-3 text-sm font-bold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-main02'>
                단어 추가하기
              </button>
            </div>
          ) : (
            <>
              {q && (
                <p className='mb-3 text-xs text-gray04'>
                  검색 결과 <span className='font-semibold text-gray02'>{filteredWords.length}</span>개
                </p>
              )}
              {filteredWords.length === 0 ? (
                <div className='flex flex-col items-center gap-2 pt-20 text-center'>
                  <p className='text-sm text-gray04'>검색 결과가 없습니다</p>
                </div>
              ) : (
                <ul className='flex flex-col gap-3'>
                  {filteredWords.map(w => (
                    <WordCard key={w.id} wordbookId={selectedBook.id} id={w.id} word={w.word} meaning={w.meaning}
                      bookmarked={checkBookmarked(selectedBook.id, w.id)}
                      onDelete={handleDeleteWord} onUpdate={handleUpdateWord} onToggleBookmark={handleToggleBookmark} />
                  ))}
                </ul>
              )}
            </>
          )}
        </main>

        <BottomNav />
      </div>
    );
  }

  return (
    <div className='flex min-h-dvh flex-col pb-20'>
      <header className='flex items-center px-5 py-4'>
        <h1 className='text-xl font-bold text-gray01'>라이브러리</h1>
      </header>

      <main className='mx-5 mt-2 flex flex-col gap-5'>
        <div className='flex gap-2'>
          <input
            type='text'
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAddBook()}
            placeholder='새 단어장 이름'
            className='flex-1 rounded-xl bg-layer px-4 py-3 text-sm text-gray01 placeholder:text-gray05 focus:outline-none focus:ring-2 focus:ring-main'
          />
          <button type='button' onClick={handleAddBook} disabled={!newTitle.trim()}
            className='rounded-xl bg-main px-5 py-3 text-sm font-bold text-white disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-main02'>
            생성
          </button>
        </div>

        {books.length === 0 ? (
          <div className='flex flex-col items-center gap-3 pt-16 text-center'>
            <p className='text-sm text-gray04'>단어장이 없어요</p>
            <p className='text-xs text-gray05'>위에서 단어장을 만들어보세요</p>
          </div>
        ) : (
          <ul className='flex flex-col gap-3'>
            {books.map(book => (
              <li key={book.id}>
                <div className='cursor-pointer rounded-xl bg-card p-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-main'
                  role='button' tabIndex={0} aria-label={`${book.title} 단어 목록 보기`}
                  onClick={() => setSelectedBook(book)}
                  onKeyDown={e => e.key === 'Enter' && setSelectedBook(book)}>
                  <div className='flex items-center justify-between'>
                    <div>
                      <h3 className='font-bold text-gray01'>{book.title}</h3>
                      <p className='mt-0.5 text-xs text-gray04'>{book.words.length}단어</p>
                    </div>
                    <button type='button'
                      onClick={e => { e.stopPropagation(); handleDeleteBook(book.id); }}
                      aria-label='단어장 삭제'
                      className='rounded-lg p-1.5 text-gray04 hover:text-red-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-300'>
                      <svg width='16' height='16' viewBox='0 0 24 24' fill='none' aria-hidden='true'>
                        <path d='M3 6H21' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' />
                        <path d='M8 6V4H16V6' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' strokeLinejoin='round' />
                        <path d='M19 6L18 20H6L5 6' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' strokeLinejoin='round' />
                      </svg>
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>

      <BottomNav />
    </div>
  );
};
