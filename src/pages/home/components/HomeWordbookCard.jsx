const today = new Date().toDateString();

export const HomeWordbookCard = ({ wordbook, studyRecord, onStudyClick }) => {
  let statusLabel = '아직 학습 전';
  if (studyRecord?.completedAt) {
    statusLabel = new Date(studyRecord.completedAt).toDateString() === today
      ? '오늘 학습완료'
      : '최근 학습완료';
  }

  return (
    <button
      type='button'
      className='w-full rounded-xl bg-card p-4 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-main'
      aria-label={`${wordbook.title} 학습 시작`}
      onClick={() => onStudyClick(wordbook.id)}
    >
      <div className='flex items-start justify-between'>
        <h3 className='font-bold text-gray01'>{wordbook.title}</h3>
        <span className='ml-3 shrink-0 rounded-full bg-layer px-3 py-1 text-xs font-semibold text-main02'>
          {wordbook.words.length}단어
        </span>
      </div>
      <p className='mt-1.5 text-xs text-gray04'>{statusLabel}</p>
    </button>
  );
};
