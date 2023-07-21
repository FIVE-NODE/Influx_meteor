

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
    this.subscribe("header");

    menuFlag = new ReactiveVar(false);
    menuKind = new ReactiveVar('');

    quickMenu = new ReactiveVar();

    logedInChk = new ReactiveVar(true);

    uInfo = new ReactiveVar();

    var logedIn = JSON.parse(sessionStorage.getItem('art_session_index'));
    if(logedIn != null) logedInChk.set(logedIn.index === 0 ? true : false);

    Meteor.commonUtils.uInfo(uInfo);

    selectQuickMu();
});

Template.header.onRendered(function() {
    var logedIn = JSON.parse(sessionStorage.getItem('art_session_index'));
    if(logedIn != null) logedInChk.set(logedIn.index === 0 ? true : false);
});

Template.header.events({
    'click button[name=artMenu]'(evt, tmpl) {
        
    },
    'click button[name=galleryMenu]'(evt, tmpl) {
        
    },
    'click button[name=artistMenu]'(evt, tmpl) {
        
    },
    'click button[name=myPage]'(evt, tmpl) {
    },
    'click a'(evt, tmpl) {
        // setTimeout(function(){
        //     location.reload();
        // }, 50);
        
    }
});

Template.header.helpers({
    logedInChk() {
        return logedInChk.get();
    },
    quickMu() {
        return quickMenu.get();
    },
    midHeader() {
        var res = false;
        var currentPageName = FlowRouter.getRouteName();;
        if(currentPageName == 'interestAtwrk' || currentPageName == 'userCart' 
        || currentPageName == 'purchaseList' || currentPageName == 'msgManage') res = true;
        return res;
    },
    userInfo() {
        if(uInfo.get() != undefined) {
            console.log(uInfo.get());
            return uInfo.get();
        }
    },
    nmChk(nm) {
        return nm == '' ? uInfo.get().nicNm : nm;
    }
});

