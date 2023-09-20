import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

Template.registerHelper('subsFlag', function() {
    // var flag = FlowRouter.getRouteName() === 'aOne' ? true : false;
    // var res = '';
    // if(flag) {
    //     res += '<script type="text/javascript" src="/libs/home.js"></script>'
    //         + '<link rel="stylesheet" href="/css/main.css">';
    //     return  res;
    // } else {
    //     res += '<script type="text/javascript" src="/libs/sub.js"></script>'
    //         + '<link rel="stylesheet" href="/css/sub.css">';
    //     return res;
    // }
    
});

Template.registerHelper('commaPric', function(pric) {
    if(pric != undefined && pric != '') {
        return pric == 0 ? 0 : Meteor.commonUtils.priceComma(pric);    
    } else {
        return '';
    }
});

// 코드를 항목명으로 변경해줌
Template.registerHelper('codeToName', function(code, named) {
    var codeMap = Meteor.codes.ALLCODE();

    codeMap = codeMap[named];

    var res = {};
    
    Object.keys(codeMap).find(name => {
        if(codeMap[name].code === code) res = codeMap[name];
    });

    return res.name;
});

// 메인 이미지만 가져온다
Template.registerHelper('selectMainImage', function(data) {
    var mainImage = '';
    var images = data.image;
    for(idx in images) {
        console.log('sel', images[idx].rprsn);
        if(images[idx].rprsn == 'Y'){
            mainImage = images[idx].imgID;
            return mainImage;
        }
    }
});

// 날짜를 포멧 형식에 맞게 리턴 한다.
Template.registerHelper('dateFormatChg', function(date, form) {
    if(date == undefined || date == null || date == '') return '';
    var format = /(\d{4})(\d{2})(\d{2})/g;
    return date.replace(format, `$1${form}$2${form}$3`);
});


Template.registerHelper('filterRes', function() {
    
});

// 기본 로딩 화면 셋팅
Template.registerHelper('loadingScr', function(clsNm) {
        return `
        <div class="swiper-slide">
            <div class="banner-item">
                <span class="banner-item__img">
                    <div class="testSample ${clsNm}"></div>
                </span>
            </div>
        </div>
        <div class="swiper-slide">
            <div class="banner-item">
                <span class="banner-item__img">
                    <div class="testSample ${clsNm}"></div>
                </span>
            </div>
        </div>
        <div class="swiper-slide">
            <div class="banner-item">
                <span class="banner-item__img">
                    <div class="testSample ${clsNm}"></div>
                </span>
            </div>
        </div>
        <div class="swiper-slide">
            <div class="banner-item">
                <span class="banner-item__img">
                    <div class="testSample ${clsNm}"></div>
                </span>
            </div>
        </div>
        <div class="swiper-slide">
            <div class="banner-item">
                <span class="banner-item__img">
                    <div class="testSample ${clsNm}"></div>
                </span>
            </div>
        </div>
        <div class="swiper-slide">
            <div class="banner-item">
                <span class="banner-item__img">
                    <div class="testSample ${clsNm}"></div>
                </span>
            </div>
        </div>
        `;
});

// height 크기가 다르게 나오는 로딩 화면
Template.registerHelper('atwrkLoading', function(clsNm) {
    return `
        <div class="product-item product-itemM">
            <span class="product-item__img">
                <div class="testSample"></div>
            </span>
        </div>
        <div class="product-item product-itemM">
            <span class="product-item__img">
                <div class="testSample"></div>
            </span>
        </div>
        <div class="product-item product-itemM">
            <span class="product-item__img">
                <div class="testSample"></div>
            </span>
        </div>
        <div class="product-item product-itemM">
            <span class="product-item__img">
                <div class="testSample"></div>
            </span>
        </div>
    `;
});

// height 크기가 다르게 나오는 로딩 화면
Template.registerHelper('loadingHotDigital', function(clsNm) {
    return `
        <div class="hot-item" style="margin-bottom: 3rem;">
            <span class="hot-item__img">
                <div class="testSample ${clsNm}"></div>
            </span>
            <span class="testSample hot-item__price"></span>
            <span class="testSample hot-item__comp"></span>
        </div>
        <div class="hot-item" style="margin-bottom: 3rem;">
            <span class="hot-item__img">
                <div class="testSample ${clsNm}"></div>
            </span>
            <span class="testSample hot-item__price"></span>
            <span class="testSample hot-item__comp"></span>
        </div>
        <div class="hot-item" style="margin-bottom: 3rem;">
            <span class="hot-item__img">
                <div class="testSample ${clsNm}"></div>
            </span>
            <span class="testSample hot-item__price"></span>
            <span class="testSample hot-item__comp"></span>
        </div>
        <div class="hot-item" style="margin-bottom: 3rem;">
            <span class="hot-item__img">
                <div class="testSample ${clsNm}"></div>
            </span>
            <span class="testSample hot-item__price"></span>
            <span class="testSample hot-item__comp"></span>
        </div>
            <div class="hot-item" style="margin-bottom: 3rem;">
            <span class="hot-item__img">
                <div class="testSample ${clsNm}"></div>
            </span>
            <span class="testSample hot-item__price"></span>
            <span class="testSample hot-item__comp"></span>
        </div>
        <div class="hot-item" style="margin-bottom: 3rem;">
            <span class="hot-item__img">
                <div class="testSample ${clsNm}"></div>
            </span>
            <span class="testSample hot-item__price"></span>
            <span class="testSample hot-item__comp"></span>
        </div>
        <div class="hot-item" style="margin-bottom: 3rem;">
            <span class="hot-item__img">
                <div class="testSample ${clsNm}"></div>
            </span>
            <span class="testSample hot-item__price"></span>
            <span class="testSample hot-item__comp"></span>
        </div>
        <div class="hot-item" style="margin-bottom: 3rem;">
            <span class="hot-item__img">
                <div class="testSample ${clsNm}"></div>
            </span>
            <span class="testSample hot-item__price"></span>
            <span class="testSample hot-item__comp"></span>
        </div>
        <div class="hot-item" style="margin-bottom: 3rem;">
            <span class="hot-item__img">
                <div class="testSample ${clsNm}"></div>
            </span>
            <span class="testSample hot-item__price"></span>
            <span class="testSample hot-item__comp"></span>
        </div>
        <div class="hot-item" style="margin-bottom: 3rem;">
            <span class="hot-item__img">
                <div class="testSample ${clsNm}"></div>
            </span>
            <span class="testSample hot-item__price"></span>
            <span class="testSample hot-item__comp"></span>
        </div>
    `;
});

Template.registerHelper('customLoading', function(wSize, hSize, clsNm, count) {
    return `<div class="${clsNm} testSample" style="width:${wSize}px; height:${hSize}px;"></div>`;
});

Template.registerHelper('dataChk', function() {
    if(atwrkInfo.get() == undefined){
        setTimeout(function(){ 
            return false;
        }, 600);
    } else {
        return true;
    }
});

// 메인 화면 데이터 없는지 있는지 확인
Template.registerHelper('dataSetChk', function(data) {
    if(data == undefined)  {
        setTimeout(function(){ 
            return false;
        }, 600);
    } else {
        return true;
    }
});