import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

export const ContentTab = ({
  value = 'id',
  label = 'label',
  contentList = [],
  buttonId = '',
  onClickButton,
}) => {
  function getButtonClassName(id) {
    const isActive = buttonId === id;

    if (isActive) {
      return 'text-edu-gray-700 border-b-[2px] border-black text-nanum-body-5_1 lg:text-nanum-body-4_1';
    }

    return 'text-edu-gray-500 text-nanum-body-5_2 lg:text-nanum-body-4_2';
  }

  return (
    <div className='w-full' data-component='ContentTab'>
      <Swiper spaceBetween={12} slidesPerView='auto' className='w-full'>
        {contentList?.map(item => {
          return (
            <SwiperSlide key={`mo_tab_${item[value]}`} className='!w-auto'>
              <button
                type='button'
                onClick={() => onClickButton(item[value])}
                className={`box-border h-[48px] w-fit px-[4px] py-[13px] whitespace-nowrap md:h-[50px] md:py-[17.5px] lg:h-[60px] ${getButtonClassName(item[value])}`}
              >
                {item[label]}
              </button>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};
