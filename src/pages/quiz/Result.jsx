import { useLocation, useNavigate } from 'react-router-dom';

export const QuizResultPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  if (!state) {
    navigate('/', { replace: true });
    return null;
  }

  const { total, correct } = state;
  const wrong = total - correct;
  const pct = Math.round((correct / total) * 100);

  return (
    <div className='flex flex-col items-center justify-center min-h-dvh px-6 text-center gap-6'>
      <p className='text-5xl'>{pct >= 80 ? '🏆' : pct >= 50 ? '👍' : '💪'}</p>
      <div>
        <p className='text-gray03 text-sm mb-1'>퀴즈 완료</p>
        <p className='text-base-white text-2xl font-bold'>{pct}점</p>
      </div>

      <div className='w-full bg-card rounded-2xl p-5 flex justify-around'>
        <div className='flex flex-col items-center gap-1'>
          <span className='text-gray03 text-xs'>총 문제</span>
          <span className='text-base-white text-2xl font-bold'>{total}</span>
        </div>
        <div className='w-px bg-layer' />
        <div className='flex flex-col items-center gap-1'>
          <span className='text-correct text-xs'>정답</span>
          <span className='text-correct text-2xl font-bold'>{correct}</span>
        </div>
        <div className='w-px bg-layer' />
        <div className='flex flex-col items-center gap-1'>
          <span className='text-incorrect text-xs'>오답</span>
          <span className='text-incorrect text-2xl font-bold'>{wrong}</span>
        </div>
      </div>

      <div className='flex flex-col gap-3 w-full'>
        <button
          onClick={() => navigate('/quiz/play', { replace: true })}
          className='w-full py-4 bg-main rounded-2xl text-white font-semibold'
        >
          다시 풀기
        </button>
        <button
          onClick={() => navigate('/')}
          className='w-full py-4 bg-layer rounded-2xl text-gray02 font-semibold'
        >
          홈으로
        </button>
      </div>
    </div>
  );
};
