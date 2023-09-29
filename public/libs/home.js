// 스와이프 설정 셋팅
$(function() {
    
    const curatorBanr = new Swiper('.slide-wrap--banr .swiper', {
        spaceBetween:13,
        autoplay:{
            speed:1000,
            dealy:1000,
            disableOnInteraction: false,
        },
        navigation:{
            nextEl: '.slide-wrap--banr .swiper-button-next',
            prevEl: '.slide-wrap--banr .swiper-button-prev',
        },
        breakpoints:{
            320:{
                slidesPerView:1,
            },
            720:{
                slidesPerView:2,
            },
            1024:{
                slidesPerView:3,
            },
            1280:{
                slidesPerView:4,
            },
            1920:{
                slidesPerView:'auto',
            }
        }
    });
    const curatorSwiper = new Swiper('.slide-wrap--curator .swiper', {
      slidesPerView:'auto',
      spaceBetween:13,
      navigation:{
          nextEl: '.slide-wrap--curator .swiper-button-next',
          prevEl: '.slide-wrap--curator .swiper-button-prev',
      }
    });
    const newProductSwiper = new Swiper('.slide-wrap--newProduct .swiper', {
        slidesPerView:'auto',
        spaceBetween:13,
        navigation:{
            nextEl: '.slide-wrap--newProduct .swiper-button-next',
            prevEl: '.slide-wrap--newProduct .swiper-button-prev',
        }
    });
    const digitalSwiper = new Swiper('.slide-wrap--digital .swiper', {
        slidesPerView:'auto',
        spaceBetween:13,
        navigation:{
            nextEl: '.slide-wrap--digital .swiper-button-next',
            prevEl: '.slide-wrap--digital .swiper-button-prev',
        }
    });
    const originalSwiper = new Swiper('.slide-wrap--original .swiper', {
        slidesPerView:'auto',
        spaceBetween:13,
        navigation:{
            nextEl: '.slide-wrap--original .swiper-button-next',
            prevEl: '.slide-wrap--original .swiper-button-prev',
        }
    });
    const eventSwiper = new Swiper('.slide-wrap--event .swiper', {
        slidesPerView:'auto',
        spaceBetween:13,
        navigation:{
            nextEl: '.slide-wrap--event .swiper-button-next',
            prevEl: '.slide-wrap--event .swiper-button-prev',
        }
    });
    const gallerySwiper = new Swiper('.slide-wrap--gallery .swiper', {
        slidesPerView:4,
        spaceBetween:13,
        navigation:{
            nextEl: '.slide-wrap--gallery .swiper-button-next',
            prevEl: '.slide-wrap--gallery .swiper-button-prev',
        },
        breakpoints:{
            320:{
                slidesPerView:1,
            },
            720:{
                slidesPerView:2,
            },
            1024:{
                slidesPerView:3,
            },
            1280:{
                slidesPerView:4,
            }
        }
    });
  });