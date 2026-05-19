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
        </Route>
      </Routes>
    </Suspense>
  );
};
