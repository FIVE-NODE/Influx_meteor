import { Meteor } from 'meteor/meteor';
import { BSnsMber, SnsMber, Mber } from '../lib/collections.js';

const crypto = require('crypto');

// 회원관련 조회 및 서버 로직

Meteor.methods({
    // mBer 회원생성
    createMBer: function(userData) {
      try {
        var templeMber = {};
        templeMber = JSON.parse(Assets.getText('json/mBer.json'));

        templeMber._id = Meteor.commonUtils.generateUUID();
        templeMber.email = userData.email;
        templeMber.pwd = Meteor.call('encrypt', userData.pwd);
        templeMber.nicNm = userData.nicNm;

        var res = Mber.insert(templeMber);

        return res;
      } catch(e) {
        console.log('Error : ', e);
        throw new Meteor.Error(
          500,
          '서버 접속 오류가 발생하였습니다. <br /> 잠수 후 다시 시도해주세요.'
        );
      }
    },
    // mBer 회원조회
    selectMBer: function(data) {
      try {
        data.pwd = Meteor.call('encrypt', data.pwd);
      
        let res = Mber.findOne(data);

        return res;
      } catch(e) {
        console.log('Error : ', e);
        throw new Meteor.Error(
          500,
          '서버 접속 오류가 발생하였습니다. <br /> 잠수 후 다시 시도해주세요.'
        );
      }
    },
    // 갤러리 조회    
    clientBsnsMber: function() {
        try {
            let res = BSnsMber.aggregate([
                {$sample : {size : 12}}
            ]);

            return res;
        } catch(e) {
          console.log('Error : ', e);
          throw new Meteor.Error(
            500,
            '서버 접속 오류가 발생하였습니다. <br /> 잠수 후 다시 시도해주세요.'
          );
        }
    },
    // 이메일 중복 체크
    emailDuplicationChk: function(userEmail) {
      try {
        let res = Mber.findOne({email : userEmail})

        return res;
      } catch(e) {
        console.log(e);
        throw new Meteor.Error(
          500, 
          '서버 접속 오류가 발생하였습니다.  <br /> 잠수 후 다시 시도해주세요.'
        );
      }
    },
    // 닉네임 중복 체크
    nickNameDuplicationChk: function(nickName) {
      try {
        let res = Mber.findOne({nicNm : nickName});
        console.log(res);

        return res;
      } catch(e) {
        console.log(e);
        throw new Meteor.Error(
          500, 
          '서버 접속 오류가 발생하였습니다.  <br /> 잠수 후 다시 시도해주세요.'
        );
      }
    }
});