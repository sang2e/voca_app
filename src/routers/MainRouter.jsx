import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

import { AppLayout } from '@/layouts/AppLayout';

/* 각 페이지를 named export → lazy default 변환 */
const LoginPage = lazy(() =>
  import('@/pages/login/index').then(m => ({ default: m.LoginPage }))
);
const HomePage = lazy(() =>
  import('@/pages/home/index').then(m => ({ default: m.HomePage }))
);
const LibraryPage = lazy(() =>
  import('@/pages/library/index').then(m => ({ default: m.LibraryPage }))
);
const StudyPage = lazy(() =>
  import('@/pages/study/index').then(m => ({ default: m.StudyPage }))
);
const WordNewPage = lazy(() =>
  import('@/pages/wordNew/index').then(m => ({ default: m.WordNewPage }))
);
const QuizPlayPage = lazy(() =>
  import('@/pages/quiz/Play').then(m => ({ default: m.QuizPlayPage }))
);
const QuizResultPage = lazy(() =>
  import('@/pages/quiz/Result').then(m => ({ default: m.QuizResultPage }))
);
const WrongNotePage = lazy(() =>
  import('@/pages/wrongNote/index').then(m => ({ default: m.WrongNotePage }))
);
const WrongNoteReviewPage = lazy(() =>
  import('@/pages/wrongNote/ReviewQuiz').then(m => ({ default: m.WrongNoteReviewPage }))
);
const BookmarkPage = lazy(() =>
  import('@/pages/bookmark/index').then(m => ({ default: m.BookmarkPage }))
);
const BookmarkQuizPage = lazy(() =>
  import('@/pages/bookmark/QuizPlay').then(m => ({ default: m.BookmarkQuizPage }))
);

export const MainRouter = () => {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path='/login' element={<LoginPage />} />
          <Route path='/' element={<HomePage />} />
          <Route path='/library' element={<LibraryPage />} />
          <Route path='/words/new' element={<WordNewPage />} />
          <Route path='/study/:wordbookId' element={<StudyPage />} />
          <Route path='/quiz/play' element={<QuizPlayPage />} />
          <Route path='/quiz/result' element={<QuizResultPage />} />
          <Route path='/wrong-note' element={<WrongNotePage />} />
          <Route path='/wrong-note/review' element={<WrongNoteReviewPage />} />
          <Route path='/bookmark' element={<BookmarkPage />} />
          <Route path='/bookmark/quiz' element={<BookmarkQuizPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
};
