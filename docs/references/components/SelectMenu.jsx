import { useState, useRef, useEffect } from 'react';

export const SelectMenu = ({
  options = [],
  value = '',
  defaultLabel = '선택',
  arrowIcon = `${BASE_PATH}/assets/icons/edu/icon-arrow-bottom-gray.svg`,
  onChange,
  isDisabled = false,
  valueKey = 'value',
  labelKey = 'label',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  function handleToggle() {
    setIsOpen(prev => !prev);
  }

  function handleSelect(option) {
    setIsOpen(false);
    onChange(option);
  }

  function getSelectedLabel() {
    const selectedOption = options?.find(option => option?.[valueKey] === value);

    if (selectedOption) return selectedOption?.[labelKey];
    return defaultLabel;
  }
  // 선택 전 후 텍스트 색상 변경
  function getLabelClassName() {
    if (!value) return 'text-edu-gray-500';
    return 'text-edu-gray-800';
  }

  function handleClickOutside(event) {
    if (!selectRef.current) return;
    if (selectRef.current.contains(event.target)) return;

    setIsOpen(false);
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  function getArrowClassName() {
    if (isOpen) return 'rotate-180';
    return '';
  }
  // 선택된 옵션
  function isSelectedOption(option) {
    return option?.[valueKey] === value;
  }

  return (
    <div ref={selectRef} data-component='SelectMenuMo' className='relative h-full w-full'>
      <button
        type='button'
        onClick={handleToggle}
        disabled={isDisabled}
        className='flex h-[48px] w-full items-center justify-between rounded-[10px] bg-white p-[16px] pr-[12px] shadow-[inset_0_0_0_1px_#eee] focus:shadow-[inset_0_0_0_1px_#111] md:h-[54px] md:p-[15px] md:pr-[12px]'
      >
        <span
          className={`text-nanum-caption-1_3 md:text-nanum-body-5_3 truncate text-left ${getLabelClassName()} ${isDisabled ? '!bg-edu-bg_light-30 text-edu-gray-600' : ''}`}
        >
          {getSelectedLabel()}
        </span>
        <img
          src={arrowIcon}
          alt=''
          className={`h-[24px] w-[24px] transition-transform duration-200 ${getArrowClassName()}`}
        />
      </button>

      {isOpen && (
        <div className='absolute top-[52px] left-0 z-10 w-full rounded-[10px] bg-white py-[12px] pr-[2px] shadow-[inset_0_0_0_1px_#eee] md:top-[60px] md:py-[20px]'>
          <ul className='select-menu-scrollbar max-h-[240px] w-full overflow-y-auto pr-[10px] pl-[12px] md:max-h-[350px] md:pl-[16px]'>
            {options.map(option => (
              <li key={option?.[valueKey]}>
                <button
                  type='button'
                  onClick={() => handleSelect(option)}
                  className={`text-nanum-caption-1_2 md:text-nanum-body-5_2 text-edu-gray-800 flex min-h-[40px] w-full items-center rounded-[10px] p-[20px] text-left ${isSelectedOption(option) ? 'bg-[#f5f5f5]' : 'hover:bg-[#f5f5f5]'}`}
                >
                  {option?.[labelKey]}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
