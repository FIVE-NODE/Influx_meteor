import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

import './login.html';
import '../popup/utilsPopUp.js';

Template.login.onCreated(function() {
    loginFlag = new ReactiveVar(true);

    popUpMessage = new ReactiveVar();
});

Template.login.onRendered(function() {

});

Template.login.events({
    // 로그인 옵션 1 가입회원
    'click a[name=user]'() {
        loginFlag.set(true);
    },
    // 로그인 옵션 2 비회원
    'click a[name=nouser]'() {
        loginFlag.set(false);
    },
    'click button[name=seltOrder]'(evt, tmpl) {
        // 비회원 주문내역 조회
        messagePopup({message : '화면 준비중 입니다.'});
    },
    'click a[name=idFind]'(evt, tmpl) {
        // 아이디 찾기
        messagePopup({message : '화면 준비중 입니다.'});
    },
    'click a[name=passFind]'(evt, tmpl) {
        // 비밀번호 찾기
        messagePopup({message : '화면 준비중 입니다.'});
    },
    'click button[name=kakaoLogin]'(evt, tmpl) {
        // 카카오 로그인
        messagePopup({message : '소셜로그인 준비중입니다.'});
    },
    'click button[name=naverLogin]'(evt, tmpl) {
        // 네이버 로그인
        messagePopup({message : '소셜로그인 준비중입니다.'});
    },
    'click button[name=loginBtn]'(evt, tmpl) {
        if(loginFlag.get()) {
            var email = $('input[name=loginEmail]').val();
            var pwd = $('input[name=loginPwd]').val();

            // 로그인
            Meteor.loginWithPassword(email, pwd, function(err, res) {
                if(err) {
                    console.log(err.reason);
                    messagePopup({message : '아이디 또는 비밀번호를 확인해주세요'});
                }
                else {
                    // Meteor.commonUtils.logedIn(res);
                    FlowRouter.go('aOne');
                    // location.reload();
                }
            });

        } else {

        }
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

Template.login.helpers({
    loginFlag() {
        return loginFlag.get();
    },
    popup() {
        return popUpMessage.get();
    }
});
