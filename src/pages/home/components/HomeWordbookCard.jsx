// 단어장 카드 컴포넌트 (홈 화면 리스트용)
export const HomeWordbookCard = ({ wordbook, onStudyClick }) => {
  // 학습 시작 핸들러
  const handleStudyClick = () => {
    onStudyClick(wordbook.id);
  };

  return (
    <div className='relative rounded-xl bg-card p-4'>
      {/* 카드 전체 클릭 overlay */}
      <button
        type='button'
        className='absolute inset-0 rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-main'
        aria-label={`${wordbook.title} 학습 시작`}
        onClick={handleStudyClick}
      />

      {/* 카드 콘텐츠 */}
      <div className='relative'>
        <div className='flex items-start justify-between'>
          <div>
            {/* 단어장 제목 */}
            <h3 className='font-bold text-gray01'>{wordbook.title}</h3>
            {/* 단어장 설명 */}
            <p className='mt-1 text-sm text-gray03'>{wordbook.description}</p>
          </div>

          {/* 단어 수 배지 */}
          <span className='ml-3 shrink-0 rounded-full bg-layer px-3 py-1 text-xs font-semibold text-main02'>
            {wordbook.wordCount}단어
          </span>
        </div>
      </div>
    </div>
  );
};
