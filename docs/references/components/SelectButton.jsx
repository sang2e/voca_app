export const SelectButton = ({ text = '', onClick, disabled = false, value, selectedValue }) => {
  // 버튼 선택
  const isSelected = selectedValue === value;
  const hasSelectedValue =
    selectedValue !== undefined && selectedValue !== null && selectedValue !== '';
  const isUnselected = hasSelectedValue && selectedValue !== value;

  function getButtonClassName() {
    if (disabled) {
      return 'bg-edu-gray-200 text-edu-gray-400';
    }

    if (isSelected) {
      return 'bg-white text-edu-gray-800';
    }

    if (isUnselected) {
      return 'bg-edu-gray-200 text-edu-gray-400 hover:bg-edu-gray-200 hover:text-edu-gray-800';
    }

    return 'bg-white text-edu-gray-800 hover:bg-edu-gray-200';
  }

  function getCheckIconSrc() {
    if (disabled) return `${BASE_PATH}/assets/icons/edu/icon-check-circle-gray-gray.svg`;
    if (isSelected) return `${BASE_PATH}/assets/icons/edu/icon-check-circle-black-gray.svg`;
    if (!hasSelectedValue) return `${BASE_PATH}/assets/icons/edu/icon-check-circle-gray-gray.svg`;

    return `${BASE_PATH}/assets/icons/edu/icon-check-circle-gray-white.svg`;
  }
  function isShowHoverIcon() {
    if (disabled) return false;
    if (isSelected) return false;

    return true;
  }
  function getCheckIconClassName() {
    if (isShowHoverIcon()) {
      return 'absolute top-0 left-0 h-[20px] w-[20px] group-hover:opacity-0';
    }

    return 'absolute top-0 left-0 h-[20px] w-[20px]';
  }
  function handleClick() {
    if (disabled) return;
    onClick(value);
  }

  return (
    <button
      data-component='SelectButton'
      type='button'
      disabled={disabled}
      onClick={handleClick}
      className={`group flex h-[48px] min-w-[82px] flex-row items-center justify-center gap-[4px] rounded-[10px] p-[14px] shadow-[inset_0_0_0_1px_#aaa] ${getButtonClassName()}`}
    >
      <span className='relative h-[20px] w-[20px]'>
        <img src={getCheckIconSrc()} alt='' className={getCheckIconClassName()} />

        {isShowHoverIcon() && (
          <img
            src={`${BASE_PATH}/assets/icons/edu/icon-check-circle-black-white.svg`}
            alt=''
            className='absolute top-0 left-0 h-[20px] w-[20px] opacity-0 group-hover:opacity-100'
          />
        )}
      </span>
      <span className='text-nanum-caption-1_1'>{text}</span>
    </button>
  );
};
