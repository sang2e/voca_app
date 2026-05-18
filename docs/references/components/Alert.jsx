import FocusTrap from 'focus-trap-react';
import { useEffect,useState } from 'react';

import { useZuModal } from '@/store/useZuModal';

export const Alert = ({ title, sub, confirmText = '확인' }) => {
  const ZU_modal = useZuModal();

  const [isConfirm, setIsConfirm] = useState(false);

  // Esc 키 핸들러
  useEffect(() => {
    const handleEsc = e => {
      if (e.key === 'Escape') {
        ZU_modal.modalClose(Alert);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [ZU_modal.modalClose]);

  return (
    <FocusTrap>
      <div
        data-component='Alert'
        className='bg-edu-gray-800/60 fixed inset-0 z-[2000] flex items-center justify-center overflow-y-scroll overscroll-y-contain px-[20px] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
      >
        <button
          className='absolute inset-0 cursor-default'
          tabIndex={-1}
          onClick={() => ZU_modal.modalClose(Alert)}
        ></button>
        <div className='relative w-full max-w-[335px] rounded-[20px] bg-white px-[20px] pt-[30px] pb-[20px]'>
          <div className='mb-[24px] flex flex-col items-center gap-[8px]'>
            {title && (
              <p className='text-nanum-body-5_1 text-edu-gray-800 text-center whitespace-pre-line'>
                {title}
              </p>
            )}
            {sub && (
              <p className='text-edu-gray-600 text-nanum-caption-1_2 text-center whitespace-pre-line'>
                {sub}
              </p>
            )}
          </div>
          <div className='flex w-full gap-[12px]'>
            <button
              className='text-nanum-caption-1_1 bg-edu-gray-800 flex h-[48px] w-full items-center justify-center rounded-[8px] text-white'
              disabled={isConfirm}
              onClick={() => {
                setIsConfirm(true);
                ZU_modal.modalClose(Alert);
              }}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </FocusTrap>
  );
};
