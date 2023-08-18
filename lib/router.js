import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { Session } from 'meteor/session';


const requireLogin = (context, redirect) => {
    if(!sessionStorage.getItem('art_sample_sessionId')) {
    // if (!Meteor.loggingIn()) {
        FlowRouter.go('authSample');
    }
};

FlowRouter.triggers.enter([requireLogin], { except: ['public'] });

// root 화면
FlowRouter.route('/', {
    action(params, queryParams) {
        sessionStorage.setItem('art_sessionId', Meteor.commonUtils.generateUUID());
        sessionStorage.setItem('art_session_index',  JSON.stringify({index: 0}));

        let check = Meteor.loggingIn();

        console.log(check);

        // 임시
        FlowRouter.go('authSample');
        // FlowRouter.go('aOne');
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

// 회원정보 수정
FlowRouter.route('/changeMberInfo', {
    name : 'changeMberInfo',
    action(params, queryParams) {
        BlazeLayout.render('changeMberInfo', { 
            page : 'changeMberInfo',
            uInfo : queryParams.data
        });
    }
});
FlowRouter.route('/interestAtwrk', {
    // 관심있는 작품 보기
    name : 'interestAtwrk',
    action(params, queryParams) {
        BlazeLayout.render('interestAtwrk', { page : 'interestAtwrk' });
    }
});
FlowRouter.route('/userCart', {
    // 사용자 장바구니
    name : 'userCart',
    action(params, queryParams) {
        BlazeLayout.render('userCart', { page : 'userCart' });
    }
});
FlowRouter.route('/approval', {
    // 결재하기
    name : 'approval',
    action(params, queryParams) {
        BlazeLayout.render('approval', { 
            page : 'approval',
            buyData : queryParams.query
        });
    }
});
FlowRouter.route('/purchaseList', {
    // 결재하기
    name : 'purchaseList',
    action(params, queryParams) {
        BlazeLayout.render('purchaseList', { page : 'purchaseList' });
    }
});
FlowRouter.route('/msgManage', {
    // 메시지 관리 페이지
    name : 'msgManage',
    action(params, queryParams) {
        BlazeLayout.render('msgManage', { page : 'msgManage' });
    }
});
FlowRouter.route('/myCollection', {
    // 메시지 관리 페이지
    name : 'myCollection',
    action(params, queryParams) {
        BlazeLayout.render('myCollection', { page : 'myCollection' });
    }
});

// 관리자
FlowRouter.route('/myPageSelling', {
    // 마이페이지 판매중 작품
    name : 'myPageSelling',
    action(params, queryParams) {
        BlazeLayout.render('myPageSelling', { page : 'myPageSelling' });
    }
});
FlowRouter.route('/inventoryMode', {
    // 인벤토리 모드 화면
    name : 'inventoryMode',
    action(params, queryParams) {
        BlazeLayout.render('inventoryMode', { page : 'inventoryMode' });
    }
});
FlowRouter.route('/eventsCrList', {
    // 전시 및 행사 등록 화면
    name : 'eventsCrList',
    action(params, queryParams) {
        BlazeLayout.render('eventsCrList', { page : 'eventsCrList' });
    }
});
FlowRouter.route('/eventsCrDetail', {
    // 전시 및 행사 등록 상세 등록화면
    name : 'eventsCrDetail',
    action(params, queryParams) {
        BlazeLayout.render('eventsCrDetail', { page : 'eventsCrDetail' });
    }
});
FlowRouter.route('/eventsUpDetail/:_id', {
    // 전시 및 행사 등록 상세 업데이트화면
    name : 'eventsUpDetail',
    action(params, queryParams) {
        BlazeLayout.render('eventsUpDetail', {
            page : 'eventsUpDetail',
            detailId : params._id,
        });
    }
});
FlowRouter.route('/glryAtwrks', {
    // 갤러리 Atwrks 화면
    name : 'glryAtwrks',
    action(params, queryParams) {
        BlazeLayout.render('glryAtwrks', {
            page : 'glryAtwrks'
        });
    }
});
FlowRouter.route('/ogAtwrkCr', {
    // 원화 작품 등록 화면
    name : 'ogAtwrkCr',
    action(params, queryParams) {
        BlazeLayout.render('ogAtwrkCr', {
            page : 'ogAtwrkCr',
            flag : queryParams.flag,
            atwrkId : queryParams.atwrkId
        });
    }
});
FlowRouter.route('/atwrkSalesReg', {
    // 판매등록 화면
    name : 'atwrkSalesReg',
    action(params, queryParams) {
        BlazeLayout.render('atwrkSalesReg', {
            page : 'atwrkSalesReg',
            atwrkId : queryParams.atwrkId
        });
    }
});
FlowRouter.route('/bMsgManage', {
    // 갤러리 메시지 관리 페이지
    name : 'bMsgManage',
    action(params, queryParams) {
        BlazeLayout.render('bMsgManage', { page : 'bMsgManage' });
    }
});
FlowRouter.route('/glryAppMang', {
    // 갤러리 사업자 입점신청 관리
    name : 'glryAppMang',
    action(params, queryParams) {
        BlazeLayout.render('glryAppMang', { page : 'glryAppMang' });
    }
});

// 회원
// 회원정보 수정 끝

// 큐레이터
FlowRouter.route('/curatorPick', {
    // 큐레이터 픽
    name : 'curatorPick',
    action(params, queryParams) {
        BlazeLayout.render('curatorPick', { page : 'curatorPick' });
    }
});
FlowRouter.route('/ogCurator', {
    // 큐레이터 원화
    name : 'ogCurator',
    action(params, queryParams) {
        BlazeLayout.render('ogCurator', { 
            page : 'ogCurator',
            schQueryData : queryParams.data
        });
    }
});
FlowRouter.route('/dtCurator', {
    // 큐레이터 디지털 판화
    name : 'dtCurator',
    action(params, queryParams) {
        BlazeLayout.render('dtCurator', { 
            page : 'dtCurator',
            schQueryData : queryParams.data
        });
    }
});
FlowRouter.route('/atstCurator', {
    // 큐레이터 작가
    name : 'atstCurator',
    action(params, queryParams) {
        BlazeLayout.render('atstCurator', { 
            page : 'atstCurator',
            schQueryData : queryParams.data
        });
    }
});
FlowRouter.route('/pickCreate', {
    // 큐레이터 픽 등록
    name : 'pickCreate',
    action(params, queryParams) {
        BlazeLayout.render('pickCreate', { 
            page : 'pickCreate',
            schQueryData : queryParams.data
        });
    }
});
// 큐레이터

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
FlowRouter.route('/newEntryAtwrk', {
    // New 입점작품
    name : 'newEntryAtwrk',
    action(params, queryParams) {
        BlazeLayout.render('newEntryAtwrk', {
            page : 'newEntryAtwrk',
            schQueryData : queryParams.data
        });
    }
});
// 퀵 메뉴 끝


// 샘플 패스워드 라우터
FlowRouter.route('/authSample', {
    // New 입점작품
    name : 'authSample',
    action(params, queryParams) {
        BlazeLayout.render('authSample', {
            page : 'authSample',
            schQueryData : queryParams.data
        });
    }
});