import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

import './authSample.html';
import '../popup/utilsPopUp.js';

const only = "SJLab5n$";

Template.authSample.onCreated(function() {
    popUpMessage = new ReactiveVar();
});

Template.authSample.onRendered(function() {
});

Template.authSample.events({
    'click button[name=loginBtn]'(evt, tmpl) {
        var pwd =  $('input[name=loginPwd]').val();
        if(pwd === only) {
            sessionStorage.setItem('art_sample_sessionId', Meteor.commonUtils.generateUUID());
            FlowRouter.go('/aOne');
        }
    },
    'keyup button[name=loginBtn]'(evt, tmpl) {
        if(evt.keyCode === 13) $('button[name=loginBtn]').click();
    },  
    'keyup input[name=loginPwd]'(evt, tmpl) {
        if(evt.keyCode === 13) $('button[name=loginBtn]').click();
    },  
});

// 팝업 메시지 띄우기
function messagePopup(message) {
    popUpMessage.set(message);
    $('#utilsPopUp').addClass('is-open');
}

Template.authSample.helpers({
  
});
