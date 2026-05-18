import { useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';

import { useZuViewport } from '@/store/useZuViewport';

export const ZustandViewport = () => {
  const setIsMobile = useZuViewport(state => state.setIsMobile);
  const mobileWidth = useZuViewport(state => state.mobileWidth);

  const isMobileQuery = useMediaQuery({ maxWidth: mobileWidth });
  useEffect(() => {
    setIsMobile(isMobileQuery);
  }, [isMobileQuery, setIsMobile]);

  return null;
};
