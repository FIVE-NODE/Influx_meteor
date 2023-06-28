import { Meteor } from 'meteor/meteor';
import {  Atwrk, Pick, Evnt, Files, Chunk, Banr } from '../lib/collections.js';
import { FilesCollection } from 'meteor/ostrio:files';

import '../lib/common.js';
import '../lib/router.js';
import './publish.js';

import './mberServer.js';
import './utilsServer.js';

const crypto = require('crypto');
const key = 'tester1234567890tester1234567890';
const iv  = 'tester1234567890';


Meteor.startup(() => {
  var smtp = {
    username: 'patrick@5node.co.kr',
    password: 'mltkvshdsjdxubnv',
    server: 'smtp.gmail.com',
    port: 587
    // ssl port: 465
  };

  process.env.MAIL_URL = 'smtp://' + smtp.username + ':' + smtp.password + '@' + smtp.server + ':' + smtp.port;

  Meteor.call('fileFinds', '39f1db00-563e-4136-b10f-63a2b5da3285');


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
  // 작품 전부 조회
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
  // 홈화면에 배너 조회
  selectBanr: function(req) {
    try {
      var res = Banr.find({}, {sort: {sortNo : -1}}).fetch();

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
  // 뉴 입점 작품
  selectNewAtwrk: function() {
    // 한달이내 작품 원화만 랜덤 조회
    // 기간조회 수정해야함.
    try {
      var stDate = new Date();
      var edDate = new Date(stDate);
      edDate.setMonth((stDate.getMonth() - 1));

      // stDate = moment(stDate).format('YYYYMMDD');
      // edDate = moment(edDate).format('YYYYMMDD');

      let res = Atwrk.find(
        {
          'ogPrt.atwrkNm' : { $exists : true },
          // insDt : {
          //   $gte : new Date(stDate),
          //   $lte : new Date(edDate)
          // }
        },
        { 
          $sample : {size : 12},
          // sort : { insDt : -1 }
        }
      ).fetch();

      // console.log(stDate);
      // console.log(edDate);
      // console.log(res);

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
    // 디지털 에디션 판화
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
      // let key = 'tester1234567890tester1234567890';
      // let iv  = 'tester1234567890';
      
      const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
      encodeData = cipher.update(text, 'utf8', 'base64');
      encodeData += cipher.final('base64');
    } catch(e) {
      console.log('Error : ', e);
      throw new Meteor.Error(
        500,
        '서버 접속 오류가 발생하였습니다. <br /> 잠수 후 다시 시도해주세요.'
      );
    }
    return encodeData;
  },
  // 복호화
  decrypt: text => {
    let decipheredPlaintext;
    try {
      let decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
      decipheredPlaintext = decipher.update(text, 'base64', 'utf8');
      decipheredPlaintext += decipher.final('utf8');

    } catch (e) {
      console.log('decrypt ERROR : ', e);
    }
    return decipheredPlaintext;
  },
  fileFinds: function(filename) {
    try {
      let data =  Files.findOne({filename : filename});
      let file =  Chunk.findOne({files_id : data._id});

      var blob = new Uint8Array(file.data);
      // var base64String = btoa(String.fromCharCode.apply(null, blob));
      // var src = 'data:image/png;base64,' + base64String + '';
      

    } catch(e) {
      console.log('Error : ', e);
      throw new Meteor.Error(
        500,
        '서버 접속 오류가 발생하였습니다. <br /> 잠수 후 다시 시도해주세요.'
      );
    }
  }
});
 