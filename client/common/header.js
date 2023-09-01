

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
    menuFlag = new ReactiveVar(false);
    menuKind = new ReactiveVar('');

    quickMenu = new ReactiveVar();

    selectQuickMu();
});

Template.header.onRendered(function() {
});

// 팝업 메시지 띄우기
function messagePopup(message) {
    popUpMessage.set(message);
    $('#utilsPopUp').addClass('is-open');
}

Template.header.events({
    'click button[name=headerBtnMenu]'(evt, tmpl) {
        var link = $(evt.currentTarget).val();

        var logedIn = Meteor.user();

        if(logedIn != null && logedIn != undefined) {
            if(link != '') FlowRouter.go(link);
            else messagePopup({message : '화면 준비중 입니다.'});
        }
        else messagePopup({message : '로그인 후 이용해주세요'});
    },
    'click a[name=quickMu]'(evt, tmpl) {
        var kind = $(evt.currentTarget).children('h2').text();
        var href = $(evt.currentTarget).prop('href');

        var queryData = {};
        if(kind == '유화') {
            queryData.MATERIAL = ['001'];
            FlowRouter.go('/originalAtwrk', {}, { data : encodeURIComponent(JSON.stringify(queryData)) });
        } else if(kind =='카툰/일러스트') {
            queryData.BASE = ['003'];
            FlowRouter.go('/digitalAtwrk', {}, { data : encodeURIComponent(JSON.stringify(queryData)) });
        } else if(kind == '20만원 미만(디지털)') {
            queryData.ARTWORK_PRICE_DTPRT = [{
                code    : '004',
                min     : 100000,
                max     : 300000,
                name    : '10~30 만원'
            }];
            FlowRouter.go('/digitalAtwrk', {}, { data : encodeURIComponent(JSON.stringify(queryData)) });
        } else if(kind == '500만원 이상(원화)'){
            queryData.ARTWORK_PRICE_OGPRT = [{
                code    : '004',
                min     : 5000000,
                max     : 10000000,
                name    : "500~1,000 만원"
            }];
            FlowRouter.go('/originalAtwrk', {}, { data : encodeURIComponent(JSON.stringify(queryData)) });
        }
        
        // 같은 페이지 일경우 새로고침
        var pageName = FlowRouter.getRouteName();
        if(href.indexOf(pageName) > -1) {
            setTimeout(function() {
                location.reload();
            }, 50);
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
        // setTimeout(function(){
        //     location.reload();
        // }, 100);
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
        || currentPageName == 'myCollection') res = true;
        return res;
    },
    glryMidHeaderChk() {
        // 갤러리 용 헤더 메뉴
        var res = false;
        var currentPageName = FlowRouter.getRouteName();
        if(currentPageName == 'myPageSelling' || currentPageName == 'ogAtwrkCr'
        || currentPageName == 'eventsCrList' || currentPageName == 'bMsgManage'
        || currentPageName == 'inventoryMode' || currentPageName == 'glryAtwrks') res = true;

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
            || currentPageName == 'inventoryMode'|| currentPageName == 'glryAtwrks') res = false;
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
    }
});

