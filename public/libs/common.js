'use strict'

// jQuery
$(function(){
    popup();
    selectFn();
    fileUpload();
});

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
        $(".custom-select__options").toggle();
    });

    $(".custom-select__options li").click(function() {
        var selection = $(this).first().text();
        $(".custom-select__tit").html(selection);
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

// javascript