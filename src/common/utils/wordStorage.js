const KEY = 'voca_wordbooks';
const LEGACY_KEY = 'voca_words';

function migrate() {
  if (localStorage.getItem(KEY) !== null) return;
  try {
    const legacy = JSON.parse(localStorage.getItem(LEGACY_KEY));
    if (Array.isArray(legacy) && legacy.length > 0) {
      localStorage.setItem(KEY, JSON.stringify([{ id: Date.now(), title: '기본 단어장', words: legacy }]));
      return;
    }
  } catch {}
  localStorage.setItem(KEY, JSON.stringify([]));
}

export function getWordBooks() {
  migrate();
  try {
    return JSON.parse(localStorage.getItem(KEY)) ?? [];
  } catch {
    return [];
  }
}

function save(books) {
  localStorage.setItem(KEY, JSON.stringify(books));
}

export function addWordBook(title) {
  const books = getWordBooks();
  const book = { id: Date.now(), title, words: [] };
  save([...books, book]);
  return book;
}

export function deleteWordBook(id) {
  const books = getWordBooks().filter(b => b.id !== id);
  save(books);
  return books;
}

export function addWord(wordbookId, word, meaning) {
  const entry = { id: Date.now(), word, meaning };
  save(getWordBooks().map(b => b.id === wordbookId ? { ...b, words: [...b.words, entry] } : b));
  return entry;
}

export function deleteWord(wordbookId, wordId) {
  const books = getWordBooks().map(b =>
    b.id === wordbookId ? { ...b, words: b.words.filter(w => w.id !== wordId) } : b
  );
  save(books);
  return books;
}

export function updateWord(wordbookId, wordId, word, meaning) {
  const books = getWordBooks().map(b =>
    b.id === wordbookId
      ? { ...b, words: b.words.map(w => w.id === wordId ? { ...w, word, meaning } : w) }
      : b
  );
  save(books);
  return books;
}
