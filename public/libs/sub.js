$(document).ready(function(){
    gallerySlide();
    lnbFn();
    imgSwitch();
    subTab();
    productOthers();
    dropDown();
    dealBox();
    datepickerFn();
    tableSwiper();
    filterFn();
});

var $win = $(window);
var $doc = $(document);

function gallerySlide(){
    var gallerySlide = new Swiper('.gallery-mainSlide .swiper', {
        slidesPerView: 2,
        spaceBetween:14,
        navigation: {
            nextEl: '.gallery-mainSlide .swiper-button-next',
            prevEl: '.gallery-mainSlide .swiper-button-prev',
        },
        breakpoints:{
            320:{
                slidesPerView: 1,
            },
            1024:{
                slidesPerView: 2,
            }
        }
    })
}

function lnbFn(){
    $('.lnb-tit').click(function(){
        $(this).toggleClass('is-close');
        if($(this).hasClass('is-close')){
            $(this).next().slideDown();
        }else{
            $(this).next().slideUp();
        }
    })
    $('.lnb-cont--artist .lnb-cont__list button').on('click',function(){
        $('.lnb-cont--artist .lnb-cont__list button').removeClass('is-active');
        $(this).addClass('is-active');
    })
}
function filterFn(){
    $('.btn-filter').on('click', function(){
        $('.lnb-wrap').toggleClass('is-open');
    })
}

function imgSwitch(){
    // $('.imgGroup-detail__favor').click(function() {
    //     $(this).toggleClass('is-click');
    // });
    // $('a[name=aTagoodBtn]').click(function() {
    //     $('.imgGroup-detail__favor').toggleClass('is-click');
    // });
}

function subTab(){
    $('.tab-link button').click(function(){
        const $this = $(this);
        $dataId = $this.data('id');
        $contId = $('#' + $dataId);
        $('.tab-link button').removeClass('is-active');
        $('.tab-purchace .tab-cont').removeClass('is-open');
        $(this).addClass('is-active');
        $contId.addClass('is-open');
    })
}

function productOthers(){
    var othersSlide = new Swiper('.product-others .swiper', {
        slidesPerView : 'auto',
        spaceBetween:43,
        navigation:{
            nextEl: '.product-others .swiper-button-next',
            prevEl: '.product-others .swiper-button-prev',
        }
    });
}

function tableSwiper(){
    var tableSlide = new Swiper('.table-swiper', {
        slidesPerGroup : 1,
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
    });
}

function dropDown(){
    $('.faq-item').click(function(){
        $(this).next().slideToggle();
    })
    $('.dropDown-tit button').click(function(){
        var $this = $(this),
        dropDownTit = $this.parent();
        dropDownTit.toggleClass('is-click').next().slideToggle();
    })
}

function dealBox(){
    $('.deal-box .form-row').click(function(){
        $('.deal-box .form-row').removeClass('is-click');
        $(this).addClass('is-click');
    })
}

function uiDatePicker($root) {
    if (!$root) {
        $root = $doc;
    }
    $root.find('.js-datepicker-range').each(function () {
        var $this = $(this);
        var $min = $this.find('.js-datepicker-range__min');
        var $max = $this.find('.js-datepicker-range__max');
        $min.datetimepicker({
            locale: 'ko',
            format: 'YYYY-MM-DD',
            dayViewHeaderFormat: 'YYYY년 MMMM',
        });
        $max.datetimepicker({
            locale: 'ko',
            format: 'YYYY-MM-DD',
            dayViewHeaderFormat: 'YYYY년 MMMM',
            useCurrent: false,
        });
        $min.off('dp.change.uiJSDatepickerRange').on('dp.change.uiJSDatepickerRange', function (e) {
            $max.data('DateTimePicker').minDate(e.date);
        });
        $max.off('dp.change.uiJSDatepickerRange').on('dp.change.uiJSDatepickerRange', function (e) {
            $min.data('DateTimePicker').maxDate(e.date);
        });
    });
    $root.find('.js-datepicker').datetimepicker({
        locale: 'ko',
        format: 'YYYY-MM-DD',
        dayViewHeaderFormat: 'YYYY년 MMMM'
    });
    $root.find('.js-monthpicker').datetimepicker({
        locale: 'ko',
        viewMode: 'years',
        format: 'YYYY년 M월'
    });
}

function datepickerFn($root){
    if (!$root) {
        $root = $doc;
    }
    uiDatePicker($root);
}

window.datepickerFn = datepickerFn;