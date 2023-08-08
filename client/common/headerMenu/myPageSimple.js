import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

import './myPageSimple.html';

Template.myPageSimple.onCreated(function() {
});

Template.myPageSimple.onRendered(function()  {
});

Template.myPageSimple.events({
    'click a[name=linkMenu]'(evt, tmpl) {
        var link = $(evt.currentTarget).attr('id');

        var logedIn = Meteor.userId();
        
        if(logedIn != undefined) {
            if(link != '') FlowRouter.go(link);
            else messagePopup({message : '화면 준비중 입니다.'});
        } else messagePopup({message : '로그인 후 이용해주세요'});
    },
    'click a[name=logout]'(evt, tmpl) {
        Meteor.logout(function(error) {
            if(error) console.log(error);
            else {
                sessionStorage.removeItem('art_dex');
                sessionStorage.removeItem('art_session_index');
                FlowRouter.go('/aOne');
            }
        });
    },
});

// 팝업 메시지 띄우기
function messagePopup(message) {
    popUpMessage.set(message);
    $('#utilsPopUp').addClass('is-open');
}

Template.myPageSimple.helpers({
    userChk() {
        if(Meteor.user() != undefined) {
            var uInfos = Meteor.user().profile.uInfos;
            return uInfos.bsnsNm == null || uInfos.bsnsNm == undefined || uInfos.bsnsNm == '';
        } else return true;
        
    },
    userInfo() {
        if(Meteor.user() != undefined) return Meteor.user().profile.uInfos;
    },
    nmChk(nm) {
        if(Meteor.user() != undefined) return nm == '' ? Meteor.user().profile.uInfos.nicNm : nm;
    },
});

