import { useLocation, useNavigate } from 'react-router-dom';

function cls(isActive) {
  const base = 'flex flex-1 flex-col items-center gap-1 py-3 text-xs font-semibold focus-visible:outline focus-visible:outline-2';
  return isActive ? `${base} text-main` : `${base} text-gray05`;
}

export function BottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <nav
      className='fixed bottom-0 left-1/2 w-full max-w-[430px] -translate-x-1/2 border-t border-layer bg-surface'
      aria-label='하단 내비게이션'
    >
      <div className='flex'>
        <button type='button' className={cls(pathname === '/')} onClick={() => navigate('/')}>
          <svg width='22' height='22' viewBox='0 0 24 24' fill='none' aria-hidden='true'>
            <path d='M3 12L12 3L21 12V21H15V15H9V21H3V12Z' stroke='currentColor' strokeWidth='1.8' strokeLinejoin='round' strokeLinecap='round' />
          </svg>
          홈
        </button>

        <button type='button' className={cls(pathname === '/library')} onClick={() => navigate('/library')}>
          <svg width='22' height='22' viewBox='0 0 24 24' fill='none' aria-hidden='true'>
            <rect x='4' y='3' width='4' height='18' rx='1' stroke='currentColor' strokeWidth='1.8' />
            <rect x='10' y='6' width='4' height='15' rx='1' stroke='currentColor' strokeWidth='1.8' />
            <path d='M16 9.5L20 8V21L16 19.5V9.5Z' stroke='currentColor' strokeWidth='1.8' strokeLinejoin='round' />
          </svg>
          라이브러리
        </button>

        <button type='button' className={cls(pathname.startsWith('/quiz'))} onClick={() => navigate('/quiz/play')}>
          <svg width='22' height='22' viewBox='0 0 24 24' fill='none' aria-hidden='true'>
            <circle cx='12' cy='12' r='9' stroke='currentColor' strokeWidth='1.8' />
            <path d='M9.5 9C9.5 7.6 10.6 6.5 12 6.5s2.5 1.1 2.5 2.5c0 1.3-1.5 2-2 3' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' />
            <circle cx='12' cy='17' r='1' fill='currentColor' />
          </svg>
          퀴즈
        </button>

        <button type='button' className={cls(pathname === '/wrong-note')} onClick={() => navigate('/wrong-note')}>
          <svg width='22' height='22' viewBox='0 0 24 24' fill='none' aria-hidden='true'>
            <path d='M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2' stroke='currentColor' strokeWidth='1.8' strokeLinejoin='round' />
            <rect x='9' y='3' width='6' height='4' rx='1' stroke='currentColor' strokeWidth='1.8' />
            <path d='M9.5 13l1.5 1.5L15 11' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' strokeLinejoin='round' />
          </svg>
          오답노트
        </button>
      </div>
    </nav>
  );
}
