import { Template } from 'meteor/templating';

import { Pick, Banr } from '../../lib/collections.js';
import { clientAtwrk, clientDtpHome, clientOgHome, clientEvntHome, clientBsnsMber, clientBanr } from '../lib/clientCollections.js';

import './aOne.html';

let pickCategory = new ReactiveVar('001');

function selectAtwrk() {
    Meteor.call('selectNewAtwrk', function(a, data) {
        if(data != undefined && clientAtwrk._collection._docs._map.size == 0) {
            data.forEach(function(map){
                map.ogPrt.pric = Meteor.commonUtils.priceComma(map.ogPrt.pric);
                clientAtwrk.insert(map);
            });
        }
    });   
}

function selectDtpHome() {
    clientDtpHome.remove();
    Meteor.call('selectDtpHome', function(a, data) {
        if(data != undefined && clientDtpHome._collection._docs._map.size == 0) {
            data.forEach(function(map){
                map.dtPrt.mPric = Meteor.commonUtils.priceComma(map.dtPrt.mPric);
                clientDtpHome.insert(map);
            });
        }
    });
}

function selectOgHome() {
    clientOgHome.remove();
    Meteor.call('selectOgHome', function(a, data) {
        if(data != undefined && clientOgHome._collection._docs._map.size == 0) {
            data.forEach(function(map){
                map.ogPrt.pric = Meteor.commonUtils.priceComma(map.ogPrt.pric);
                clientOgHome.insert(map);
            });
        }
    });
}

function selectEvntHome() {
    clientEvntHome.remove();
    Meteor.call('selectEvntHome', function(a, data) {
        if(data != undefined && clientEvntHome._collection._docs._map.size == 0) {
            data.forEach(function(map){
                clientEvntHome.insert(map);
            });
        }
    });
}

function selectGlry() {
    clientBsnsMber.remove();
    Meteor.call('clientBsnsMber', function(a, data) {
        if(data != undefined && clientBsnsMber._collection._docs._map.size == 0) {
            data.forEach(function(map){
                clientBsnsMber.insert(map);
            });
        }
    });
}

Template.aOne.onCreated(async function() {
    const instance = this;
    instance.connectoin = new ReactiveVar();

    console.log("test ", this);
    
    // selectAtwrk      작품
    selectAtwrk();

    // selectDtpHome    디지털 판화 에디션
    selectDtpHome();

    // selectOgHome     원화
    selectOgHome();

    // selectEventHome  전시 및 행사
    selectEvntHome();

    // selectGlry       갤러리
    selectGlry();

});

Template.aOne.onRendered(function() {

});

Template.aOne.events({
    'click button[name=pickOg]'(evt, tmpl) {
        // 큐레잍픽 원화
        selectPickCategory('pickOg');
        pickCategory.set('001');
    },
    'click button[name=pickDt]'(evt, tmpl) {
        // 큐레잍픽 디지털 에이션 판화
        selectPickCategory('pickDt');
        pickCategory.set('002');
    },
    'click button[name=pickAtst]'(evt, tmpl) {
        // 작가
        selectPickCategory('pickAtst');
        pickCategory.set('003');
    },

});

// 이벤트 용 함수   //

// 큐레이터 픽 카테고리
function selectPickCategory(category) {
    $('.is-active').removeClass('is-active');
    $(`[name=${category}]`).addClass('is-active');
}

// 이벤트 용 함수 끝//

Template.aOne.helpers({
    banr() {
        let data = Banr.find().fetch();
        return data;
    },
    pick() {
        let data = Pick.findOne({thmTp : pickCategory.get()});
        return data;
    },
    atwrk() {
        return clientAtwrk.find().fetch();
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
    }
});