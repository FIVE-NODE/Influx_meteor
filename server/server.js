import { Meteor } from 'meteor/meteor';
import { Gallary, Atwrk, Pick, Evnt } from '../lib/collections.js';
import '../lib/common.js';
import '../lib/router.js';
import './publish.js';

import './mberServer.js';

const crypto = require('crypto');

Meteor.startup(() => {
  var smtp = {
    username: 'patrick@5node.co.kr',
    password: 'mltkvshdsjdxubnv',
    server: 'smtp.gmail.com',
    port: 587
    // ssl port: 465
  };

  process.env.MAIL_URL = 'smtp://' + smtp.username + ':' + smtp.password + '@' + smtp.server + ':' + smtp.port;

});

Meteor.onConnection(conn => {
  
});

Meteor.methods({
  // Pick 큐레이터 픽
  insertPick: function() {
    try {
      const uuid = Meteor.commonUtils.generateUUID();

      var data = {
        _id : uuid,
      };
      
      const result = Pick.insert(data);

      return data;
    } catch(e) {
      console.log('Error : ', e);
      throw new Meteor.Error(
        500,
        '서버 접속 오류가 발생하였습니다. <br /> 잠수 후 다시 시도해주세요.'
      )
    }
  },
  selectPick: function(req) {
    try {
      var res = Pick.findOne({thmTp : req});

      return res;
    } catch(e) {
      console.log('Error : ', e);
      throw new Meteor.Error(
        500,
        '서버 접속 오류가 발생하였습니다. <br /> 잠수 후 다시 시도해주세요.'
      )
    }
  },
  // Atwrk 작품
  selectAtwrk: function(req) {
    try {
      var res = Atwrk.find({});

      return res;
    } catch(e) {
      console.log('Error : ', e);
      throw new Meteor.Error(
        500,
        '서버 접속 오류가 발생하였습니다. <br /> 잠수 후 다시 시도해주세요.'
      )
    }
  },
  insertAtwrk: function(req) {
    try {
      const uuid = Meteor.commonUtils.generateUUID();
      
      var data = req;
      data._id = uuid;

      var res = Atwrk.insert(data);
      
      return res;
    } catch(e) {
      console.log('Error : ', e);
      throw new Meteor.Error(
        500,
        '서버 접속 오류가 발생하였습니다. <br /> 잠수 후 다시 시도해주세요.'
      )
    }
  },
  selectNewAtwrk: function() {
    try {
      let res = Atwrk.aggregate([
        {$sample : {size : 12}}
      ]);

      return res;
    } catch(e) {
      console.log('Error : ', e);
      throw new Meteor.Error(
        500,
        '서버 접속 오류가 발생하였습니다. <br /> 잠수 후 다시 시도해주세요.'
      )
    }
  },
  selectDtpHome: function() {
    try {
      let res = Atwrk.find({
        'dtPrt.atwrkNm' : { $exists : true }
      }, {sort : {'dtPrt.goodCnt' : -1}, limit : 20}).fetch();

      return res;
    } catch(e) {
      console.log('Error : ', e);
      throw new Meteor.Error(
        500,
        '서버 접속 오류가 발생하였습니다. <br /> 잠수 후 다시 시도해주세요.'
      )
    }
  },
  selectOgHome: function() {
    try {
      let res = Atwrk.find({
        'ogPrt.atwrkNm' : { $exists : true }
      }, {sort : {'ogPrt.goodCnt' : -1}, limit : 20}).fetch();

      return res;
    } catch(e) {
      console.log('Error : ', e);
      throw new Meteor.Error(
        500,
        '서버 접속 오류가 발생하였습니다. <br /> 잠수 후 다시 시도해주세요.'
      )
    }
  },
  // Evnt 전시 및 행사
  selectEvntHome: function() {
    try {
      let res = Evnt.find({}, {sort : { insDt : -1 }, limit : 12}).fetch();

      return res;
    } catch(e) {
      console.log('Error : ', e);
      throw new Meteor.Error(
        500,
        '서버 접속 오류가 발생하였습니다. <br /> 잠수 후 다시 시도해주세요.'
      )
    }
  },
  // Email 전송
  sendEmail: function(sendAttributes) {
    Email.send(sendAttributes);
  },
  // 암호화
  encrypt: text => {
    let encodeData;
    try {
      let key = 'tester1234567890tester1234567890';
      let iv  = 'tester1234567890';
      
      const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
      encodeData = cipher.update(text, 'utf8', 'base64');
      encodeData += cipher.final('base64');
    } catch(e) {
      console.log('Error : ', e);
      throw new Meteor.Error(
        500,
        '서버 접속 오류가 발생하였습니다. <br /> 잠수 후 다시 시도해주세요.'
      )
    }
    return encodeData;
  }
});
 