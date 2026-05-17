export const Toast = ({ text = '', type = 'default' }) => {
  // default
  // success
  // error
  // info
  // warning
  // type 상태 필요시 추가예정
  return (
    <div
      data-component='Toast'
      className='bg-edu-gray-700 flex h-[48px] w-full items-center justify-center rounded-[8px]'
    >
      <p className='text-nanum-caption-1_1 whitespace-pre-line text-white'>{text}</p>
    </div>
  );
};
