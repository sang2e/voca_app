import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useZuAudio } from '@/store/useZuAudio';

// url 변경 시 오디오 리셋
export const ZustandAudioReset = () => {
  const { pathname } = useLocation();
  const stopAudio = useZuAudio(state => state.stopAudio);

  useEffect(() => {
    stopAudio();
  }, [pathname, stopAudio]);

  return null;
};
