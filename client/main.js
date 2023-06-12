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

// 로그인, 회원가입
import './users/login.js';
import './users/signUp.js';

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
  }
});
