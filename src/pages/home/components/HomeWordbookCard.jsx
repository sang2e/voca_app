export const HomeWordbookCard = ({ wordbook, onStudyClick }) => {
  return (
    <div className='relative rounded-xl bg-card p-4'>
      <button
        type='button'
        className='absolute inset-0 rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-main'
        aria-label={`${wordbook.title} 학습 시작`}
        onClick={() => onStudyClick(wordbook.id)}
      />
      <div className='relative flex items-start justify-between'>
        <h3 className='font-bold text-gray01'>{wordbook.title}</h3>
        <span className='ml-3 shrink-0 rounded-full bg-layer px-3 py-1 text-xs font-semibold text-main02'>
          {wordbook.words.length}단어
        </span>
      </div>
    </div>
  );
};
