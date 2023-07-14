import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { Session } from 'meteor/session';

// root 화면
FlowRouter.route('/', {
    action(params, queryParams) {
        sessionStorage.setItem('art_sessionId', Meteor.commonUtils.generateUUID());
        sessionStorage.setItem('art_session_index',  JSON.stringify({index: 0}));

        Session.set('art_session_user', { index : 0 });

        FlowRouter.go('aOne');
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
    // 회사소개
    name : 'zOne',
    action(params, queryParams) {
        BlazeLayout.render('zOne', { page : 'zOne' });
    }
});

FlowRouter.route('/zTwo', {
    // 공지사항
    name : 'zTwo',
    action(params, queryParams) {
        BlazeLayout.render('zTwo', { page : 'zTwo' });
    }
});

FlowRouter.route('/zTwoA', {
// FlowRouter.route('/zTwoA/:_id', {
    // 공지사항
    name : 'zTwoA',
    action(params, queryParams) {
        BlazeLayout.render('zTwoA', { page : 'zTwoA', noticeId : params._id});
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

// 갤러리 홈
FlowRouter.route('/glyHome', {
    name : 'glyHome',
    action(params, queryParams) {
        BlazeLayout.render('glyHome', { page : 'glyHome' });
    }
});
FlowRouter.route('/atwrkList/:_id', {
    // 작품리스트 화면
    name : 'atwrkList',
    action(params, queryParams) {
        BlazeLayout.render('atwrkList', {
            page : 'atwrkList',
            detailId : params._id,
            schQueryData : queryParams.data
        });
    }
});
FlowRouter.route('/atwrkDetail/:_id', {
    // 작품상세 화면
    name : 'atwrkDetail',
    action(params, queryParams) {
        BlazeLayout.render('atwrkDetail', {
            page : 'atwrkDetail',
            detailId : params._id
        });
    }
});
FlowRouter.route('/glyDipEvt/:_id', {
    // 갤러리 전시, 행사 화면
    name : 'glyDipEvt',
    action(params, queryParams) {
        BlazeLayout.render('glyDipEvt', { 
            page : 'glyDipEvt',
            detailId : params._id
        });
    }
});
FlowRouter.route('/glyHistoryDipEvt/:_id', {
    // 갤러리 지난전시 행사 화면
    name : 'glyHistoryDipEvt',
    action(params, queryParams) {
        BlazeLayout.render('glyHistoryDipEvt', { page : 'glyHistoryDipEvt' });
    }
});
// 갤러리 홈 끝

// 퀵 메뉴
FlowRouter.route('/originalAtwrk', {
    // 퀵 메뉴 원화 페이지
    name : 'originalAtwrk',
    action(params, queryParams) {
        BlazeLayout.render('originalAtwrk', { 
            page : 'originalAtwrk',
            schQueryData : queryParams.data
        });
    }
});
FlowRouter.route('/digitalAtwrk', {
    // 퀵 메뉴 디지털 에디션 판화 페이지
    name : 'digitalAtwrk',
    action(params, queryParams) {
        BlazeLayout.render('digitalAtwrk', { 
            page : 'digitalAtwrk',
            schQueryData : queryParams.data
        });
    }
});
FlowRouter.route('/exhibitionEvnt', {
    // 퀵 메뉴 전시/이벤트 화면
    name : 'exhibitionEvnt',
    action(params, queryParams) {
        BlazeLayout.render('exhibitionEvnt', {
            page : 'exhibitionEvnt',
            schQueryData : queryParams.data
        });
    }
});
// 퀵 메뉴 끝