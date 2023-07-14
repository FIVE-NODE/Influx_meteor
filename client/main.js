import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

import './main.html';

// 헤더 화면
import './common/header.js';              // 상단 화면

// footer 화면
import './common/footer.js';              // footer (하단 화면)
import './common/zOne.js';                // 회사소개
import './common/announcement/zTwo.js';   // 공지사항
import './common/announcement/zTwoA.js';  // 공지사항 상세
import './common/zThre.js';               // 이용약관
import './common/zFour.js';               // 개인정보처리방침
import './common/zFive.js';               // FAQ
import './common/glyAppEntry.js';         // 갤러리 입점 신청
import './common/glyAppFaq.js';           // 갤러리 FAQ
import './common/glyAppInq.js';           // 파트너센터 문의하기

// 퀵 메뉴 화면 (퀵메뉴와 연결되어 있는 화면들)
import './atwrk/originalAtwrk.js';        // 원화
import './atwrk/digitalAtwrk.js';         // 디지털 에디션 판화
import './atwrk/exhibitionEvnt.js';       // 전시/행사 화면

// 화면
import './home/aOne.js';                  // 메인화면
import './gallery/glyHome.js';            // 갤러리 홈
import './gallery/glyDipEvt.js';          // 갤러리 이벤트
import './gallery/glyHistoryDipEvt.js';   // 갤러리 지난 이벤트
import './atwrk/atwrkDetail.js';          // 작품 디테일
import './atwrk/atwrkList.js';            // 작품리스트

// 로그인, 회원가입
import './users/login.js';                // 로그인
import './users/signUp.js';               // 회원가입

// 스토어 관리센터
import './common/uploadRepWork.js';

// 우편번호 찾기
import './common/zipCode.js';

// 검색 필터
import './common/searchFilter.js';

// 공통 코드
import '../lib/code.js';

// 클라이언트 공통
import '../client/lib/clientCommonUtils.js';

// 서버
import '../lib/status.js';
import '../lib/common.js';
import '../lib/router.js';

// 공통 도우미
import './lib/helpers.js';

Template.body.onCreated(function() {

  // chPage = new ReactiveVar('aOne');

  Meteor.subscribe('Pick');
  Meteor.subscribe('Atwrk');

  // this.changePage = chPage;
  this.pickPub = this.subscribe('Pick');
  this.atwrkPub = this.subscribe('Atwrk');

  pageInfo = this;

  // this.autorun(() => {
  //   console.log("auto run");
  //   streamer.on(test, function(res) {
  //     console.log(test);
  //     console.log(res);
  //   });
  // });
});

Template.body.onRendered(function() {
});

Template.body.events({
  'click .popup'(evt, tmpl) {

  }

});

Template.body.helpers({
  // changePage() {
  //   return chPage.get();
  // },
  pageInfo() {
    return pageInfo;
  },
  changeCss(changeCss) {
    console.log('changeCss : ', changeCss);
    return true;
  },
  subFlag() {
    var chk = FlowRouter.getRouteName();
    return chk === 'aOne' ? true : false;
  },
});
