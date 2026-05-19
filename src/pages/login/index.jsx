import { useNavigate } from 'react-router-dom';

import { LoginForm } from './components/LoginForm';

export const LoginPage = () => {
  const navigate = useNavigate();

  // 로그인 완료 시 홈으로 이동 (mock)
  const handleLogin = () => {
    navigate('/');
  };

  return (
    <div className='flex min-h-screen flex-col bg-surface px-6'>
      {/* 상단 브랜딩 영역 */}
      <div className='pb-14 pt-20'>
        <p className='mb-2 text-sm text-gray03'>영어 단어 학습 앱</p>
        <h1 className='text-5xl font-black tracking-tight text-main'>VOCA</h1>
      </div>

      {/* 로그인 폼 */}
      <LoginForm onLogin={handleLogin} />
    </div>
  );
};
