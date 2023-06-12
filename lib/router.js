import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { Session } from 'meteor/session';

// 홈(메인화면)
FlowRouter.route('/', {
    action(params, queryParams) {
        sessionStorage.setItem('art_sessionId', Meteor.commonUtils.generateUUID());
        sessionStorage.setItem('art_session_index',  JSON.stringify({index: 0}));

        Session.set('art_session_user', { index : 0 });

        FlowRouter.go('aOne');
        // BlazeLayout.render('aOne', { page : 'aOne' });
    }
});

FlowRouter.route('/aOne', {
    name : 'aOne',
    action(params, queryParams) {
        BlazeLayout.render('aOne', { page : 'aOne' });
    }
}) 

// Footer 화면
FlowRouter.route('/zOne', {
    name : 'zOne',
    action(params, queryParams) {
        BlazeLayout.render('zOne', { page : 'zOne' });
    }
});

FlowRouter.route('/zTwo', {
    name : 'zTwo',
    action(params, queryParams) {
        BlazeLayout.render('zTwo', { page : 'zTwo' });
    }
});

FlowRouter.route('/zThre', {
    name : 'zThre',
    action(params, queryParams) {
        BlazeLayout.render('zThre', { page : 'zThre' });
    }
});

FlowRouter.route('/zFour', {
    name : 'zFour',
    action(params, queryParams) {
        BlazeLayout.render('zFour', { page : 'zFour' });
    }
});

FlowRouter.route('/zFive', {
    name : 'zFive',
    action(params, queryParams) {
        BlazeLayout.render('zFive', { page : 'zFive' });
    }
});
// Footer 화면 끝

// 로그인 화면
FlowRouter.route('/login', {
    name : 'login',
    action(params, queryParams) {
        BlazeLayout.render('login', { page : 'login' });
    }
});
// 로그인 화면 끝

// 회원가입
FlowRouter.route('/signUp', {
    name : 'signUp',
    action(params, queryParams) {
        BlazeLayout.render('signUp', { page : 'signUp' });
    }
});

// 회원가입 끝

// 갤러리 입점기업 신청 
FlowRouter.route('/glyAppEntry', {
    name : 'glyAppEntry',
    action(params, queryParams) {
        BlazeLayout.render('glyAppEntry', { page : 'glyAppEntry' });
    }
});

FlowRouter.route('/glyAppFaq', {
    name : 'glyAppFaq',
    action(params, queryParams) {
        BlazeLayout.render('glyAppFaq', { page : 'glyAppFaq' });
    }
});

FlowRouter.route('/glyAppInq', {
    name : 'glyAppInq',
    action(params, queryParams) {
        BlazeLayout.render('glyAppInq', { page : 'glyAppInq' });
    }
});
// 갤러리 입점기업 신청 끝