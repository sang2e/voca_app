import { NavLink } from 'react-router-dom';

export const SubPageTab = ({ linkData = [{ link: '', label: '' }] }) => {
  function getTabClassName(isActive) {
    if (isActive) {
      return 'text-nanum-caption-1_1 md:text-nanum-body-5_1 lg:text-nanum-body-4_1 text-edu-secondary-navy-100 bg-white';
    }

    return 'text-nanum-caption-1_2 md:text-nanum-body-5_2 lg:text-nanum-body-4_2 text-edu-secondary-navy-40';
  }

  return (
    <div
      data-component='SubPageTab'
      className='flex h-[72px] w-full items-center justify-center px-[16px] py-[12px] md:h-auto md:px-0 md:py-[10px] lg:py-[12px]'
    >
      <div className='bg-edu-bg_light-10 flex h-[48px] w-full items-center justify-center gap-[12px] rounded-[30px] p-[4px] md:h-[54px] md:py-[5px] lg:h-[64px]'>
        {linkData?.map(item => {
          return (
            <NavLink
              key={item?.link}
              to={item?.link}
              className={({ isActive }) =>
                `flex h-[40px] w-full items-center justify-center rounded-[100px] md:h-[44px] lg:h-[54px] ${getTabClassName(isActive)}`
              }
            >
              {item?.label}
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};
