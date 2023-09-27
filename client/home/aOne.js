import { Template } from 'meteor/templating';

import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

import { Pick, PageList } from '../../lib/collections.js';
import { clientAtwrk, clientDtpHome, clientOgHome, clientEvntHome, clientBsnsMber, clientBanr } from '../lib/clientCollections.js';

import 'lazysizes';
import 'lazysizes/plugins/parent-fit/ls.parent-fit';

import './aOne.html';

import '../popup/utilsPopUp.js';

// 팝업 메시지 띄우기
function messagePopup(message) {
    popUpMessage.set(message);
    $('#utilsPopUp').addClass('is-open');
}

// 뉴입점작품 원화만
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
                map.profile.uInfos._id = map._id;
                clientBsnsMber.insert(map.profile.uInfos);
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
    Meteor.subscribe('Pick');
    Meteor.subscribe('PageList');

    const instance = this;
    instance.connectoin = new ReactiveVar();

    popUpMessage = new ReactiveVar();

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
        var atwrkId = Object.keys(this).includes('atwrkID') ? this.atwrkID : this._id;
        var atwrkFlag = $(evt.currentTarget).val();

        if(atwrkFlag == '') atwrkFlag = pickCategory.get() == '002' ? 'dtPrt' : 'ogPrt';
        
        // 로그인 체크
        if(Meteor.userId() == null) messagePopup({message : '로그인 후 이용해주세요'});
        else { 
            // 작품 원화 or 디지털 판화 체크
            if(Meteor.commonUtils.glryUserLimitEvt()) {
                if(atwrkFlag == 'dtPrt') messagePopup({message : '디지털 판화는 작품상세보기에서 옵션 선택후 추가해주세요'});
                else {
                    var setData = { atwrkId, atwrkFlag };
                    Meteor.call('insertBasket', setData, function(err, res) {
                        if(err) console.log(err);
                        else {
                            messagePopup({message : '장바구니 등록이 완료되었습니다.'});
                        }
                    });    
                }
            } else {
                messagePopup({message : '갤러리 회원은 좋아요를 등록할 수 없습니다.'});
            }
        }
    },
    // 좋아요 버튼 이벤트 설정
    'click button[name=goodBtn]' (evt, tmpl) {
        var atwrkId = Object.keys(this).includes('atwrkID') ? this.atwrkID : this._id;
        var atwrkFlag = $(evt.currentTarget).val();

        // 로그인 체크
        if(Meteor.userId() == null) messagePopup({message : '로그인 후 이용해주세요'});
        else {

            if(Meteor.commonUtils.glryUserLimitEvt()) {
                // 좋아요 등록
                Meteor.clientCommonUtils.goodBtnEvnt(atwrkId, atwrkFlag, false);
                messagePopup({message : '좋아요 등록이 완료되었습니다.'});   
            } else {
                messagePopup({message : '갤러리 회원은 좋아요를 등록할 수 없습니다.'});
            }
            
        }
    },
    'click a[name=atDetail]'(evt, tmpl) {
        var kind = pickCategory.get() == '002' ? 'dtPrt' : '';
        FlowRouter.go(`/atwrkDetail/${this.atwrkID}`, {} , { flag : encodeURIComponent(kind)});
    }

});

// 큐레이터 픽 카테고리
function selectPickCategory(category) {
    $('.is-active').removeClass('is-active');
    $(`[name=${category}]`).addClass('is-active');
}

// 이벤트 용 함수 끝//
Template.aOne.helpers({
    banr() {
        let data = clientBanr.find().fetch();
        
        return data;
    },
    pick() { 
        if(pickCategory.get() != undefined) {
            // let query = Meteor.commonUtils.normalSetQuy();
            let query = {};
            query.thmTp = pickCategory.get();
            let data = Pick.findOne(query);
            
            if(data != undefined) {
                var atstAtwrkList = data.atstAtwrk;
                atstAtwrkList.forEach(function(ele) {
                    ele.pric = Meteor.commonUtils.priceComma(ele.pric);
                });
                data.atstAtwrk = atstAtwrkList;

                return data.atstAtwrk;
            }
        }
    },
    atwrk() {
        let res = clientAtwrk.find(Meteor.commonUtils.normalSetQuy()).fetch();
        if(res != undefined) {    
            return res;
        }
    },
    dtpHome() {
        return clientDtpHome.find(Meteor.commonUtils.normalSetQuy()).fetch();
    },
    ogHome() {
        return clientOgHome.find(Meteor.commonUtils.normalSetQuy()).fetch();
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
    },
    popup() {
        return popUpMessage.get();
    },
});