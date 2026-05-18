import { BrowserRouter } from 'react-router-dom';

import { MainRouter } from '@/routers/MainRouter';

export const App = () => {
  return (
    <BrowserRouter>
      <MainRouter />
    </BrowserRouter>
  );
};
