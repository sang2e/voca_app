export const CheckBox = ({
  checked = false,
  onChange = () => {},
  disabled = false,
  children,
  className = '',
  inputClassName = '',
  size = 'media', //media md sm
}) => {
  const handleChange = e => {
    onChange(e.target.checked);
  };

  const sizeClasses = {
    media: 'h-[20px] w-[20px] md:h-[24px] md:w-[24px]',
    md: 'h-[24px] w-[24px]',
    sm: 'h-[20px] w-[20px]',
  };

  return (
    <label data-component='CheckBox' className={`flex h-fit items-center select-none ${className}`}>
      <div className={`relative flex cursor-pointer ${inputClassName}`}>
        <input
          type='checkbox'
          className={`peer opacity-0 ${sizeClasses[size]}`}
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
        />
        <div
          className={`absolute top-0 left-0 peer-focus-visible:ring-2 peer-focus-visible:ring-blue-500 peer-focus-visible:ring-offset-2 print:hidden ${sizeClasses[size]}`}
        >
          <img
            src={`${BASE_PATH}/assets/icons/common/checkbox-default.svg`}
            alt=''
            className={`pointer-events-none absolute top-0 left-0 ${sizeClasses[size]} ${checked ? 'opacity-0' : ''}`}
          />
          <img
            src={`${BASE_PATH}/assets/icons/common/checkbox-checked.svg`}
            alt=''
            className={`pointer-events-none absolute top-0 left-0 ${sizeClasses[size]} ${checked ? '' : 'opacity-0'}`}
          />
        </div>
      </div>
      {children}
    </label>
  );
};
