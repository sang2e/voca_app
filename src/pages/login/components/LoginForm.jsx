import { useState } from 'react';

// 이메일 입력 아이콘
function PersonIcon() {
  return (
    <svg width='18' height='18' viewBox='0 0 20 20' fill='none' aria-hidden='true'>
      <circle cx='10' cy='6' r='4' stroke='currentColor' strokeWidth='1.5' />
      <path
        d='M2 18c0-4.418 3.582-8 8-8s8 3.582 8 8'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
      />
    </svg>
  );
}

// 비밀번호 입력 아이콘
function LockIcon() {
  return (
    <svg width='18' height='18' viewBox='0 0 20 20' fill='none' aria-hidden='true'>
      <rect x='3' y='9' width='14' height='9' rx='2' stroke='currentColor' strokeWidth='1.5' />
      <path
        d='M6.5 9V6.5a3.5 3.5 0 0 1 7 0V9'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
      />
    </svg>
  );
}

export const LoginForm = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 이메일 입력 핸들러
  const handleEmailChange = e => {
    setEmail(e.target.value);
  };

  // 비밀번호 입력 핸들러
  const handlePasswordChange = e => {
    setPassword(e.target.value);
  };

  // 로그인 버튼 클릭 → 홈으로 이동 (mock)
  const handleLoginClick = () => {
    onLogin();
  };

  return (
    <div className='flex flex-col gap-8'>
      {/* 입력 필드 영역 */}
      <div className='flex flex-col gap-6'>
        {/* 이메일 입력 */}
        <div className='flex items-center gap-3 border-b border-gray05 pb-3'>
          <span className='shrink-0 text-gray03'>
            <PersonIcon />
          </span>
          <input
            id='email'
            type='email'
            value={email}
            onChange={handleEmailChange}
            placeholder='이메일 입력'
            className='flex-1 bg-transparent text-sm text-gray01 placeholder:text-gray04 focus:outline-none'
          />
        </div>

        {/* 비밀번호 입력 */}
        <div className='flex items-center gap-3 border-b border-gray05 pb-3'>
          <span className='shrink-0 text-gray03'>
            <LockIcon />
          </span>
          <input
            id='password'
            type='password'
            value={password}
            onChange={handlePasswordChange}
            placeholder='비밀번호 입력'
            className='flex-1 bg-transparent text-sm text-gray01 placeholder:text-gray04 focus:outline-none'
          />
        </div>
      </div>

      {/* 로그인 버튼 */}
      <button
        type='button'
        onClick={handleLoginClick}
        className='flex h-14 w-full items-center justify-center rounded-xl bg-main text-base font-bold text-base-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-main'
      >
        로그인
      </button>

      {/* 소셜 로그인 구분선 */}
      <div className='flex items-center gap-3'>
        <div className='h-px flex-1 bg-gray05' />
        <span className='text-xs text-gray04'>또는</span>
        <div className='h-px flex-1 bg-gray05' />
      </div>

      {/* 소셜 로그인 버튼 영역 (mock) */}
      <div className='flex items-center justify-center gap-5'>
        <button
          type='button'
          aria-label='카카오로 로그인'
          className='flex h-12 w-12 items-center justify-center rounded-full border border-gray05 bg-layer text-xs font-bold text-gray02 focus-visible:outline focus-visible:outline-2'
        >
          K
        </button>
        <button
          type='button'
          aria-label='구글로 로그인'
          className='flex h-12 w-12 items-center justify-center rounded-full border border-gray05 bg-layer text-xs font-bold text-gray02 focus-visible:outline focus-visible:outline-2'
        >
          G
        </button>
        <button
          type='button'
          aria-label='애플로 로그인'
          className='flex h-12 w-12 items-center justify-center rounded-full border border-gray05 bg-layer text-xs font-bold text-gray02 focus-visible:outline focus-visible:outline-2'
        >
          A
        </button>
      </div>
    </div>
  );
};
