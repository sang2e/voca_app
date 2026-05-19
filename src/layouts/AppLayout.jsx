import { Outlet } from 'react-router-dom';

export const AppLayout = () => {
  return (
    /* 바깥 배경: PC에서 어두운 여백 */
    <div className='flex min-h-dvh justify-center bg-gray07'>
      {/* 앱 컨테이너: 모바일 프레임 */}
      <div className='w-full max-w-[430px] bg-surface'>
        <Outlet />
      </div>
    </div>
  );
};
