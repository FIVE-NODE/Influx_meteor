import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

import './main.html';

// 헤더 화면
import './common/header.js';

// footer 화면
import './common/footer.js';
import './common/zOne.js';
import './common/announcement/zTwo.js';
import './common/zThre.js';
import './common/zFour.js';
import './common/zFive.js';
import './common/glyAppEntry.js';
import './common/glyAppFaq.js';
import './common/glyAppInq.js';

// 화면
import './home/aOne.js';
import './gallery/glyHome.js';
import './gallery/glyDipEvt.js';
import './gallery/glyHistoryDipEvt.js';
import './atwrk/atwrkDetail.js';
import './atwrk/atwrkList.js';

// 로그인, 회원가입
import './users/login.js';
import './users/signUp.js';

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

Template.body.onCreated(function() {

  // chPage = new ReactiveVar('aOne');

  Meteor.subscribe('Pick');
  Meteor.subscribe('Atwrk');

  // this.changePage = chPage;
  this.pickPub = this.subscribe('Pick');
  this.atwrkPub = this.subscribe('Atwrk');

  pageInfo = this;

  console.log("main.js start", this);

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
    console.log(" ============== ");
    console.log(evt);
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
    return FlowRouter.getRouteName() === 'aOne' ? true : false;
  },
});
