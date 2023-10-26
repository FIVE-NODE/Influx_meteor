

import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

import './header.html';
import './headerMenu/artMenu.js';
import './headerMenu/artistMenu.js';
import './headerMenu/galleryMenu.js';
import './headerMenu/myPageSimple.js';

function selectQuickMu() {
    Meteor.call('selectQuickMu', function(e, data) {
        quickMenu.set(data);
    });   
}

Template.header.onCreated(function() {
    Meteor.subscribe('User');

    uInfo = new ReactiveVar(Meteor.user());

    menuFlag = new ReactiveVar(false);
    menuKind = new ReactiveVar('');

    quickMenu = new ReactiveVar();

    interList = new ReactiveVar([]);

    likeAtwrkList = new ReactiveVar();

    cartAtwrkList= new ReactiveVar();

    selectQuickMu();

    this.autorun(function() {
        if(Meteor.user() != undefined) {
            if(Meteor.user().profile.uInfos.ogPrtGood != undefined) {
                let data = Meteor.user().profile.uInfos.ogPrtGood.concat(Meteor.user().profile.uInfos.dtPrtGood);
                sltInterestAtwrkCnt(data);
                let cartList = Meteor.user().profile.uInfos.cart;
                let listData = [];
                for(var idx in cartList) listData.push(cartList[idx].atwrkId);
                sltCartAtwrkCnt(listData);
            }
        }



    });

});

Template.header.onRendered(function() {
});

// 팝업 메시지 띄우기
function messagePopup(message) {
    popUpMessage.set(message);
    $('#utilsPopUp').addClass('is-open');
}

function sltInterestAtwrkCnt(data)  {
    Meteor.call('sltInterestAtwrkCnt', data, function(err, res) {
        likeAtwrkList.set(res);
    });
}

function sltCartAtwrkCnt(data) {
    Meteor.call('sltUserCart', data, function(err, res) {
        cartAtwrkList.set(res);
    });
}


Template.header.events({
    'click [name=headerBtnMenu]'(evt, tmpl) {
        console.log('headerBtnMenu');
        var link = $(evt.currentTarget).attr('value');

        var logedIn = Meteor.user();
        
        console.log('logedIn : ', logedIn);
        if(logedIn != null && logedIn != undefined) {
            if(link != '') {
                switch(link) {
                    case 'alarm':
                        if(logedIn.profile.uInfos.bsnsID != undefined) FlowRouter.go('/bMsgManage');
                        else FlowRouter.go('/msgManage');
                        break;
                    default:
                        FlowRouter.go(link);
                        break;
                }
            } else messagePopup({message : '화면 준비중 입니다.'});
        } else messagePopup({message : '로그인 후 이용해주세요'});
    },
    'click a[name=quickMu]'(evt, tmpl) {
        var kind = $(evt.currentTarget).children('h2').text();

        var queryData = {};
        switch(kind) {
            case '원화':
                FlowRouter.go('/originalAtwrk', {}, { data : {}});
                break;
            case '유화':
                queryData.MATERIAL = ['001'];
                FlowRouter.go('/originalAtwrk', {}, { data : encodeURIComponent(JSON.stringify(queryData)) });
                break;
            case '카툰/일러스트':
                queryData.BASE = ['003'];
                FlowRouter.go('/digitalAtwrk', {}, { data : encodeURIComponent(JSON.stringify(queryData)) });
                break;
            case '20만원 미만(디지털)':
                queryData.ARTWORK_PRICE_DTPRT = [{
                    code    : '004',
                    min     : 100000,
                    max     : 300000,
                    name    : '10~30 만원'
                }];
                FlowRouter.go('/digitalAtwrk', {}, { data : encodeURIComponent(JSON.stringify(queryData)) });
                break;
            case '500만원 이상(원화)':
                queryData.ARTWORK_PRICE_OGPRT = [{
                    code    : '004',
                    min     : 5000000,
                    max     : 10000000,
                    name    : "500~1,000 만원"
                }];
                FlowRouter.go('/originalAtwrk', {}, { data : encodeURIComponent(JSON.stringify(queryData)) });
                break;
        }
    },
    'click a[name=glryMenu]'(evt, tmpl) {
        var link = $(evt.currentTarget).attr('id');

        var logedIn = Meteor.userId();
        
        if(logedIn != undefined) {
            if(link != '') FlowRouter.go(link);
            else messagePopup({message : '화면 준비중 입니다.'});
        } else messagePopup({message : '로그인 후 이용해주세요'});
    },
    'click a[name=userMenu]'(evt, tmpl) {
        var link = $(evt.currentTarget).attr('id');

        var logedIn = Meteor.userId();
        
        if(logedIn != undefined) {
            if(link != '') FlowRouter.go(link);
            else messagePopup({message : '화면 준비중 입니다.'});
        } else messagePopup({message : '로그인 후 이용해주세요'});
    },
    'click button[name=artistMenu]'(evt, tmpl) {
        
    },
    'click button[name=myPage]'(evt, tmpl) {
    },
    'click a'(evt, tmpl) {
    }
});

Template.header.helpers({
    quickMu() {
        return quickMenu.get();
    },
    midHeader() {
        var res = false;
        var currentPageName = FlowRouter.getRouteName();
        if(currentPageName == 'interestAtwrk' || currentPageName == 'userCart' 
        || currentPageName == 'purchaseList' || currentPageName == 'msgManage'
        || currentPageName == 'myPageSelling' || currentPageName == 'ogAtwrkCr'
        || currentPageName == 'eventsCrList' || currentPageName == 'bMsgManage'
        || currentPageName == 'inventoryMode'|| currentPageName == 'glryAtwrks'
        || currentPageName == 'myCollection' || currentPageName == 'eventsCrDetail'
        || currentPageName == 'eventsUpDetail') res = true;
        return res;
    },
    glryMidHeaderChk() {
        // 갤러리 용 헤더 메뉴
        var res = false;
        var currentPageName = FlowRouter.getRouteName();
        if(currentPageName == 'myPageSelling' || currentPageName == 'ogAtwrkCr'
        || currentPageName == 'eventsCrList' || currentPageName == 'bMsgManage'
        || currentPageName == 'inventoryMode' || currentPageName == 'glryAtwrks'
        || currentPageName == 'eventsCrDetail' || currentPageName == 'eventsUpDetail') res = true;

        return res;
    },
    nmChk() {
        if(Meteor.user() != undefined) {
            var uInfos = Meteor.user().profile.uInfos;
            return uInfos.nm == '' ? uInfos.nicNm : nm;
        }
    },
    quickChk() {
        // 최상단 헤더 
        var res = true;
        var currentPageName = FlowRouter.getRouteName();
        if(currentPageName == 'pickCreate') res = false;
        return res;
    },
    quickMenuChk() {
        // 퀵메뉴 체크
        var res = true;
        var currentPageName = FlowRouter.getRouteName();
        if(currentPageName == 'myPageSelling' || currentPageName == 'ogAtwrkCr'
            || currentPageName == 'eventsCrList' || currentPageName == 'bMsgManage'
            || currentPageName == 'inventoryMode'|| currentPageName == 'glryAtwrks'
            || currentPageName == 'atwrkSalesReg' || currentPageName == 'eventsCrDetail'
            || currentPageName == 'eventsUpDetail') res = false;
        
        return res;
    },
    glryInfo() {
        if(Meteor.user() != undefined) {
            return Meteor.user().profile.uInfos;
        }
    },
    userChk() {
        if(Meteor.user() != undefined) {
            var bsnsNm = Meteor.user().profile.uInfos.bsnsNm;
            return bsnsNm == undefined;
        }
    },
    pageChk(page) {
        var currentPageName = FlowRouter.getRouteName();
        if(page === currentPageName) return 'is-active';
        else return '';
    },
    cartCount() {
        if(cartAtwrkList.get() != undefined) {
            return cartAtwrkList.get().length;
        }
    },
    likeCount() {
        if(Meteor.user() != undefined) {
            return likeAtwrkList.get();
        }
    },
    ntcnCount() {
        if(Meteor.user() != undefined) {
            var uInfos = Meteor.user().profile.uInfos;
            if(uInfos.getNtcn != undefined) return uInfos.getNtcn.length;
        }
    },
    loginChk() {
        return Meteor.userId() != undefined;
    },
    pfImgChk() {
        let uInfos = Meteor.user();
        if(uInfos != undefined) {
            return uInfos.profile.uInfos.pfImg == '' ? '/image/common/img-header__imd__img.png' : uInfos.profile.uInfos.pfImg
        }
    }
});

