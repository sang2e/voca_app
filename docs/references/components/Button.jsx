export const Button = ({
  label = 'button',
  isDisabled = false,
  isActivated = false,
  size = 'pc_m',
  type = 'primary',
  className,
  width = null,
  onClick = () => {},
  children,
}) => {
  // type : primary, secondary, outline ;
  // size : pc_l, pc_m, mo_l, mo_m, mo_s, xs ;

  const sizeClasses = {
    pc_l: 'h-[72px] px-[10px] rounded-[10px] text-nanum-body-2_2',
    pc_m: 'h-[54px] px-[10px] rounded-[10px] text-nanum-body-5_1',
    pc: 'h-[54px] px-[10px] rounded-[10px] text-nanum-body-5_1',
    mo_l: 'h-[54px] px-[16px] rounded-[6px] text-nanum-body-5_2',
    mo_m: 'h-[48px] px-[16px] rounded-[6px] text-nanum-caption-1_1',
    mo: 'h-[48px] px-[16px] rounded-[10px] text-nanum-caption-1_2',
    mo_s: 'h-[36px] px-[16px] rounded-[6px] text-nanum-caption-1_2',
    xs: 'h-[28px] px-[12px] rounded-[6px] text-nanum-caption-2_2',
  };

  const outlineClasses = {
    pc_l: 'rounded-[10px]',
    pc_m: 'rounded-[10px]',
    pc: 'rounded-[10px]',
    mo_l: 'rounded-[6px]',
    mo_m: 'rounded-[6px]',
    mo: 'rounded-[6px]',
    mo_s: 'rounded-[6px]',
    xs: 'rounded-[6px]',
  };

  const bgClasses = {
    primary: 'bg-white hover:bg-edu-gary-200 text-edu-gray-800 ',
    secondary: 'bg-main-primary-60 hover:bg-main-primary-80 text-white ',
    outline: `text-edu-gray-800 disabled:hover:bg-white ${isActivated ? 'bg-white' : 'hover:bg-edu-gray-200 bg-white'}`,
  };

  return (
    <button
      disabled={isDisabled}
      onClick={() => onClick()}
      className={`disabled:text-edu-gray-400 relative flex w-full items-center justify-center disabled:cursor-default ${sizeClasses[size]} ${bgClasses[type]} ${className}`}
      style={{ width: width ? `${width}px` : '', minWidth: width ? `${width}px` : '' }}
    >
      {children ? children : <span>{label}</span>}
      {type === 'outline' && (
        <div
          className={`pointer-events-none absolute top-0 left-0 h-full w-full border-1 ${isActivated ? 'border-edu-gray-700' : 'border-edu-gray-400'} ${outlineClasses[size]}`}
        ></div>
      )}
    </button>
  );
};
