// jQuery
$(function(){
    popup();
    selectFn();
    fileUpload();
    // buttonCount();
    slideMenu();
    mobileMenu();
    
    const gnbSwiper = new Swiper('.gnb.swiper', {
        slidesPerView:'auto',
        breakpoints:{
            320:{
                allowTouchMove:true,
                spaceBetween:30,
            },
            720:{
                spaceBetween:40,
            },
            1400:{
                allowTouchMove:false,
                spaceBetween:60,
            }
        }
    });

});


function slideMenu(){
    const slideMenuBtn = $('.slideMenu__btn'),
    slideContWrap = $('.slideMenu-cont-wrap');
    slideMenuBtn.click(function(){
        const $this = $(this),
        dataId = $this.attr('data-id'),
        contId = $('#' + dataId);

        slideContWrap.addClass('is-open');
        $(this).addClass('is-click');
        contId.addClass('is-open');
    });
    $(document).mouseup(function (e){
        const slideBtn = $(".slideMenu__btn"),
        slideCont = slideBtn.parent().find('.slideMenu-cont article.is-open');

        if(slideCont.has(e.target).length === 0){
            slideContWrap.removeClass("is-open");
            slideBtn.removeClass('is-click');
            slideCont.removeClass("is-open");
        }
    });

    const artworkBtn = $('.artwork-tit__btn');
    const artworkBtnParent = artworkBtn.parent();
    const artworkSblings = artworkBtnParent.siblings();
    artworkBtn.click(function(){
        const $this = $(this),
        dataId = $this.attr('data-id'),
        contId = $('#' + dataId);

        $('.artwork-tit__btn').removeClass('is-active');
        $(this).addClass('is-active');

        artworkSblings.removeClass('is-open');
        contId.addClass('is-open');
    });
}

function popup(){
    $('.popup, .js-popup').click(function(){
        $('body').attr('style', 'overflow:hidden')
        const $this = $(this),
        dataId = $this.attr('data-id'),
        contId = $('#' + dataId);
        contId.addClass('is-open');
    });

    $('.popup-mypage').mouseenter(function(){
        const $this = $(this),
        dataId = $this.attr('data-id'),
        contId = $('#' + dataId);
        contId.addClass('is-open');
    });

    $('.popup-mypage').mouseleave(function(){
        setTimeout(function(){
            var hoverChk = $('#myPageSimple_popup:hover').length;
            if(hoverChk == 0) {
                const myPageId = $('#myPageSimple_popup');
                myPageId.removeClass('is-open');
            }
        }, 50);
    });

    $('#myPageSimple_popup').mouseleave(function() {
        const myPageId = $('#myPageSimple_popup');
        myPageId.removeClass('is-open');
    });

    $('.popup-close').click(function(){
        $('body').attr('style', 'overflow:initial')
        $(this).parents('.popup-layout').removeClass('is-open');
    });
    $('.popup-chk').click(function() {
        $('body').attr('style', 'overflow:initial')
        $(this).parents('.popup-layout').removeClass('is-open');
    });
}

function selectFn(){
    $(".custom-select__tit").click(function() {
        var parents = $(this).parents('.form-block');
        var siblings = parents.siblings();
        var siblingsSelect = siblings.find('.custom-select__options');
        
        $(this).next().toggle();
        siblingsSelect.hide();
    });

    $(".custom-select__options li").click(function() {
        var selection = $(this).first().text();
        $(this).parent().prev().html(selection);
        $(".custom-select__options").hide();
        $(".custom-select__options li").removeClass('is-active');
        $(this).addClass('is-active');
    });
    $(document).bind('click', function(e) {
        var $clicked = $(e.target);
        if(! $clicked.parents().hasClass("form-select-custom")) {
            $(".custom-select__options").hide();
        }      
    });
}

function fileUpload(){
    $("#file-upload").on('change',function(){
        var fileName = $("#file-upload").val();
        $(".upload-name").val(fileName);
    });
}

function buttonCount(){
    var num;

    $('.button-count:first-child').click(function(){
        num = parseInt($('.number-product').val());
        if (num > 1) {
            $('.number-product').val(num - 1);
        }
        if (num == 2) {
            $('.button-count:first-child').prop('disabled', true);
        }
        if (num == 100) {
            $('.button-count:last-child').prop('disabled', false);
        }
    });

    $('.button-count:last-child').click(function(){
    num = parseInt($('.number-product').val());
    if (num < 100) {
        $('.number-product').val(num + 1);
    }
    if (num > 0) {
        $('.button-count:first-child').prop('disabled', false);
    }
    if (num == 99) {
        $('.button-count:last-child').prop('disabled', true);
    }
    });
}

function mobileMenu(){
    $('.btn-mobile').on('click', function(){
        $('.sideMenu-mo').addClass('is-open');
        $('body').css('overflow', 'hidden');
    })
    $('.btn-sideMenu__close').on('click', function(){
        $('.sideMenu-mo').removeClass('is-open');
        $('body').css('overflow', 'initial');
    })
}

$(window).on('scroll', function(){
    var scrollTop = $(window).scrollTop();
    let winWh = $(window).width();
    if( winWh <= 1280){
        if ( scrollTop > 1) {
            $('.header__top').addClass('solid');
            $('.header__bottom').addClass('move-down');
            $('.container').addClass('move-down');
        } else {
            $('.header__top').removeClass('solid');
            $('.header__bottom').removeClass('move-down');
            $('.container').removeClass('move-down');
        };
        if ( scrollTop > 180) {
            $('.sort-group').addClass('solid');
            $('.lnb-wrap').addClass('move-dowm');
            $('.product-group').addClass('move-dowm');
        }else{
            $('.sort-group').removeClass('solid');
            $('.lnb-wrap').removeClass('move-dowm');
            $('.product-group').removeClass('move-dowm');
        }
    }else{
        $('.header__top').removeClass('solid');
        $('.header__bottom').removeClass('move-down');
        $('.container').removeClass('move-down');
        $('.sort-group').removeClass('solid');
        $('.lnb-wrap').removeClass('move-dowm');
        $('.product-group').removeClass('move-dowm');
    }
}).trigger('scroll');


// javascript