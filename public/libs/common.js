// jQuery
$(function(){
    popup();
    selectFn();
    fileUpload();
    // buttonCount();
    slideMenu();
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
    $('.popup').click(function(){
        const $this = $(this),
        dataId = $this.attr('data-id'),
        contId = $('#' + dataId);
        
        contId.addClass('is-open');
    });
    $('.popup-close').click(function(){
        $(this).parents('.popup-layout').removeClass('is-open');
    });
    $('.popup-chk').click(function() {
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

// javascript