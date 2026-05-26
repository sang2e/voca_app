const STORAGE_KEY = 'voca_words';

export function getWords() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
  } catch {
    return [];
  }
}

export function addWord(word, meaning) {
  const words = getWords();
  const next = { id: Date.now(), word, meaning };
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...words, next]));
  return next;
}

export function deleteWord(id) {
  const next = getWords().filter(w => w.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}

export function updateWord(id, word, meaning) {
  const next = getWords().map(w => (w.id === id ? { ...w, word, meaning } : w));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}
