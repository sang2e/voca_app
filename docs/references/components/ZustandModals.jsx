import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useZuModal } from '@/store/useZuModal';

export const ZustandModals = () => {
  const modals = useZuModal(state => state.modals);
  const modalClose = useZuModal(state => state.modalClose);
  const modalCloseAll = useZuModal(state => state.modalCloseAll);

  const location = useLocation();

  // URL 경로가 바뀔 때마다 모든 모달 닫기
  useEffect(() => {
    if (modals.length > 0) {
      modalCloseAll();
    }
  }, [location.pathname, modalCloseAll]);

  return (
    <>
      {modals.map(({ id, Component, props }) => (
        <Component key={id} onClose={() => modalClose(id)} {...props} />
      ))}
    </>
  );
};
