import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

import { Pick, Banr } from '../../lib/collections.js';
import { clientAtwrk, clientDtpHome, clientOgHome, clientEvntHome, clientBsnsMber, clientBanr } from '../lib/clientCollections.js';

import './aOne.html';

// 뉴임점작품 원화만
function selectAtwrk() {
    Meteor.call('selectNewAtwrk', function(e, data) {
        if(data != undefined && clientAtwrk._collection._docs._map.size == 0) {
        // if(data != undefined) {
            clientAtwrk.remove();
            data.forEach(function(map){
                map.ogPrt.pric = Meteor.commonUtils.priceComma(map.ogPrt.pric);
                clientAtwrk.insert(map);
            });
        }
    });   
}

// 디지털에디션 판화
function selectDtpHome() {
    clientDtpHome.remove();
    Meteor.call('selectDtpHome', function(e, data) {
        // if(data != undefined){
        if(data != undefined && clientDtpHome._collection._docs._map.size == 0) {
            data.forEach(function(map){
                map.dtPrt.mPric = Meteor.commonUtils.priceComma(map.dtPrt.mPric);
                clientDtpHome.insert(map);
            });
        }
    });
}

// 원화 작품 만 조회
function selectOgHome() {
    clientOgHome.remove();
    Meteor.call('selectOgHome', function(e, data) {
        // if(data != undefined) {
        if(data != undefined && clientOgHome._collection._docs._map.size == 0) {
            data.forEach(function(map){
                map.ogPrt.pric = Meteor.commonUtils.priceComma(map.ogPrt.pric);
                clientOgHome.insert(map);
            });
        }
    });
}

// 전시 및 행사 조회
function selectEvntList() {
    clientEvntHome.remove();
    Meteor.call('selectEvntList', function(e, data) {
        if(data != undefined && clientEvntHome._collection._docs._map.size == 0) {
            data.forEach(function(map){
                clientEvntHome.insert(map);
            });
        }
    });
}

function selectGlry() {
    clientBsnsMber.remove();
    Meteor.call('clientBsnsMber', function(e, data) {
        if(data != undefined && clientBsnsMber._collection._docs._map.size == 0) {
            data.forEach(function(map){
                clientBsnsMber.insert(map);
            });
        }
    });
}

function selectBanr() {
    clientBanr.remove();
    Meteor.call('selectBanr', function(e, data) {
        if(data != undefined && clientBanr._collection._docs._map.size == 0) {
            data.forEach(function(map) {
                clientBanr.insert(map);
            });
        }
    });
}

Template.aOne.onCreated(async function() {
    const instance = this;
    instance.connectoin = new ReactiveVar();

    pickCategory = new ReactiveVar('001');
    dataComplet = new ReactiveVar(false);

    //  selectBanr      배너
    selectBanr();
    
    // selectAtwrk      작품
    selectAtwrk();

    // selectDtpHome    디지털 판화 에디션
    selectDtpHome();

    // selectOgHome     원화
    selectOgHome();

    // selectEventHome  전시 및 행사
    selectEvntList();

    // selectGlry       갤러리
    selectGlry();



});

Template.aOne.onRendered(function() {
    setTimeout(function() {
        var location = $('#headerPs').offset().top;
        Meteor.commonUtils.scrollTop(location);
    }, 50);

    dataComplet.set(true);
});

Template.aOne.events({
    'click button[name=pickOg]'(evt, tmpl) {
        // 큐레잍픽 원화
        selectPickCategory('pickOg');
        pickCategory.set('001');
    },
    'click button[name=pickDt]'(evt, tmpl) {
        // 큐레잍픽 디지털 에디션 판화
        selectPickCategory('pickDt');
        pickCategory.set('002');
    },
    'click button[name=pickAtst]'(evt, tmpl) {
        // 작가
        selectPickCategory('pickAtst');
        pickCategory.set('003');
    },
    // 장바구니 버튼 이벤트 설정
    'click button[name=shBasket]'(evt, tmpl) {
        var userInfo = sessionStorage.getItem('art_dex');
        var atwrkId = Object.keys(this).includes('atwrkID') ? this.atwrkID : this._id;

        Meteor.clientCommonUtils.basketBtnEvnt(userInfo, atwrkId);
    },
    // 좋아요 버튼 이벤트 설정
    'click button[name=goodBtn]' (evt, tmpl) {
        var atwrkId = Object.keys(this).includes('atwrkID') ? this.atwrkID : this._id;
        var atwrkFlag = $(evt.currentTarget).val();
        var userInfo = sessionStorage.getItem('art_dex');

        Meteor.clientCommonUtils.goodBtnEvnt(userInfo, atwrkId, atwrkFlag);
    },
    'click a[name=atDetail]'(evt, tmpl) {
        // FlowRouter.go(`/atwrkDetail/${this.atwrkID}`);
    }

});

// 큐레이터 픽 카테고리
function selectPickCategory(category) {
    $('.is-active').removeClass('is-active');
    $(`[name=${category}]`).addClass('is-active');
}

// 이벤트 용 함수 끝//

Template.aOne.helpers({
    isComplet() {
        return dataComplet.get();
    },
    banr() {
        let data = clientBanr.find().fetch();
        return data;
    },
    pick() {
        let data = Pick.findOne({thmTp : pickCategory.get()});
        
        if(data != undefined) {
            var atstAtwrkList = data.atstAtwrk;
            atstAtwrkList.forEach(function(ele) {
                ele.pric = Meteor.commonUtils.priceComma(ele.pric);
            });
            data.atstAtwrk = atstAtwrkList;

            return data;
        }
        
    },
    atwrk() {
        let res = clientAtwrk.find().fetch();
        if(res != undefined) {
            return res;
        }
    },
    dtpHome() {
        return clientDtpHome.find().fetch();
    },
    ogHome() {
        return clientOgHome.find().fetch();
    },
    evntHome() {
        return clientEvntHome.find().fetch();
    },
    glryHome() {
        return clientBsnsMber.find().fetch();
    },
    mainImgChk(rprsn) {
        // 메인이미지 체크 여부
        return rprsn == 'Y' ? true : false;
    },
    chkDtp() {        
        return !(pickCategory.get() === '002');
    }

});