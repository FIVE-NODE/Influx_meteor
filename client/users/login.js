import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

import './login.html';
import '../popup/utilsPopUp.js';

Template.login.onCreated(function() {
    loginFlag = new ReactiveVar(true);
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
    'click button[name=loginBtn]'() {
        if(loginFlag.get()) {
            var email = $('input[name=loginEmail]').val();
            var pwd = $('input[name=loginPwd]').val();
            Meteor.call('selectMBer', { email: email, pwd: pwd } , function(err, res) {
                Meteor.commonUtils.logedIn(res);
                FlowRouter.go('aOne');
            });
        } else {

        }
    }
});

Template.login.helpers({
    loginFlag() {
        return loginFlag.get();
    },
});
