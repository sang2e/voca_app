export const Radio = ({
  checked = false,
  onChange = () => {},
  disabled = false,
  value,
  name,
  children,
  className = '',
  ...props
}) => {
  const handleChange = e => {
    onChange(e.target.value);
  };

  return (
    <label
      data-component='Radio'
      className={`flex h-fit w-fit items-center select-none ${className}`}
    >
      <div className='relative flex cursor-pointer'>
        <input
          {...props}
          type='radio'
          value={value}
          className='peer h-0 w-0 opacity-0'
          checked={checked}
          name={name}
          onChange={handleChange}
          disabled={disabled}
        />
        <div className='border-edu-gray-400 flex h-[20px] w-[20px] items-center justify-center rounded-full border-1 bg-white peer-focus-visible:ring-2 peer-focus-visible:ring-blue-500 peer-focus-visible:ring-offset-2'>
          {checked && <div className='bg-edu-gray-800 h-[12px] w-[12px] rounded-full'></div>}
        </div>
      </div>
      {children}
    </label>
  );
};
