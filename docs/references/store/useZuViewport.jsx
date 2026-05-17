import { createStore } from './store';

const MOBILE_WIDTH = 767;

export const useZuViewport = createStore(
  set => ({
    isMobile: typeof window !== 'undefined' ? window.innerWidth <= MOBILE_WIDTH : false,
    mobileWidth: MOBILE_WIDTH,

    setIsMobile: isMobile =>
      set(
        state => {
          state.isMobile = isMobile;
        },
        false,
        '뷰포트 변경 (setIsMobile)'
      ),
  }),
  '뷰포트 정보'
);
