import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { Session } from 'meteor/session';

// root 화면
FlowRouter.route('/', {
    action(params, queryParams) {
        sessionStorage.setItem('art_sessionId', Meteor.commonUtils.generateUUID());
        sessionStorage.setItem('art_session_index',  JSON.stringify({index: 0}));

        Session.set('art_session_user', { index : 0 });

        FlowRouter.go('aOne');
        // BlazeLayout.render('aOne', { page : 'aOne' });
    }
});

// 홈(메인화면)
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
    // 회사소개
    name : 'zTwo',
    action(params, queryParams) {
        BlazeLayout.render('zTwo', { page : 'zTwo' });
    }
});

FlowRouter.route('/zThre', {
    // 공지사항
    name : 'zThre',
    action(params, queryParams) {
        BlazeLayout.render('zThre', { page : 'zThre' });
    }
});

FlowRouter.route('/zFour', {
    // 이용약관
    name : 'zFour',
    action(params, queryParams) {
        BlazeLayout.render('zFour', { page : 'zFour' });
    }
});

FlowRouter.route('/zFive', {
    // 개인정보처리방침
    name : 'zFive',
    action(params, queryParams) {
        BlazeLayout.render('zFive', { page : 'zFive' });
    }
});

FlowRouter.route('/glyAppEntry', {
    // 갤러리 입점기업 신청
    name : 'glyAppEntry',
    action(params, queryParams) {
        BlazeLayout.render('glyAppEntry', { page : 'glyAppEntry' });
    }
});

FlowRouter.route('/glyAppFaq', {
    // 갤러리 입점기업 FAQ
    name : 'glyAppFaq',
    action(params, queryParams) {
        BlazeLayout.render('glyAppFaq', { page : 'glyAppFaq' });
    }
});

FlowRouter.route('/glyAppInq', {
    // 갤러리 문의하기
    name : 'glyAppInq',
    action(params, queryParams) {
        BlazeLayout.render('glyAppInq', { page : 'glyAppInq' });
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

// 스토어 관리센터
FlowRouter.route('/uploadRepWork', {
    name : 'uploadRepWork',
    action(params, queryParams) {
        BlazeLayout.render('uploadRepWork', { page : 'uploadRepWork' });
    }
});
// 스토어 관리센터 끝