import { Meteor } from 'meteor/meteor';
import fs from 'fs';
import {  Atwrk, Pick, Evnt, Files, Chunk, Banr, BsnsMber, Mber } from '../lib/collections.js';

import '../lib/common.js';
import '../lib/router.js';
import './publish.js';

import './mberServer.js';
import './utilsServer.js';
import './noticeServer.js';
import './categoryServer.js';

import './rest.js';

const crypto = require('crypto');
const key = 'tester1234567890tester1234567890';
const iv  = 'tester1234567890';
const tempPath = Meteor.settings.tempPath;
const imagesPath = Meteor.settings.imagesPath;
const deletePath = Meteor.settings.delPath;

Meteor.startup(() => {
  var smtp = {
    username: 'patrick@5node.co.kr',
    password: 'mltkvshdsjdxubnv',
    server: 'smtp.gmail.com',
    port: 587
    // ssl port: 465
  };

  process.env.MAIL_URL = 'smtp://' + smtp.username + ':' + smtp.password + '@' + smtp.server + ':' + smtp.port;

  // Accounts.emailTemplates.resetPassword.from = () => {

  //   // Accounts.onResetPasswordLink
  //   console.log(' ===== >>> ');
  //   var answer = '안녕하세요 사용자의 비밀번호 초기화 링크는 입니다. \n';
  //   return answer;
  // }

  

  // Meteor.call('fileFinds', '39f1db00-563e-4136-b10f-63a2b5da3285');

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
  // 큐레이터 픽 전부 조회
  selectAllPick: function() {
    try {
      var res = Pick.find().fetch();

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
  updateAtwrk: function(data) {
    try {
      var _id = data._id;

      let oldData =  Atwrk.findOne({ _id });

      var image = [];
      var imgAll = data.imgAll;
      
      var tempDir = tempPath;
      var imageDir = imagesPath;
      for(val in imgAll) {
        var imgUrl = '';

        var tempChk = imgAll[val].split('/');

        if(tempChk.length == 1) {
          var blob = Meteor.wrapAsync(fs.readFile)(tempDir + imgAll[val]);

          Meteor.wrapAsync(fs.writeFile)(imageDir + imgAll[val], blob);

          imgUrl = "/images/" + imgAll[val];
        } else imgUrl = imgAll[val];

        var imgObj = {
          atwrkTp   : data.atwrkTp,
          imgID     : imgUrl,
          imgSortNo : 0,
          rprsn     : "",
        };

        if(val == 'mainUploadImg') {
          imgObj.rprsn = "Y";
          imgObj.size = data.mainImgSize;
          imgObj.imgSortNo = 0;
        } else {
          var sortNum = parseInt(val.split('_')[1]);
          imgObj.rprsn = "N";
          imgObj.imgSortNo = (sortNum);
        }

        image.push(imgObj);
      }

      if(data.atstImage != '' && data.atstImage != undefined) {
        var tempChk = data.atstImage.split('/');
        if(tempChk.length == 1) {
          var blob = Meteor.wrapAsync(fs.readFile)(tempDir + data.atstImage);

          Meteor.wrapAsync(fs.writeFile)(imageDir + data.atstImage, blob);

          data.atstImage = "/images/" + data.atstImage;
        }
      }

      var glryInfo = Meteor.users.findOne({_id : this.userId});

      var glry = {
        bsnsID: glryInfo._id,
        glryNm: glryInfo.profile.uInfos.glryNm,
        area: glryInfo.profile.uInfos.area,
        dong: glryInfo.profile.uInfos.dong,
        sigungu: glryInfo.profile.uInfos.sigungu
      }
      var atstInfo = {
        atstNm      : data.atstNm,
        atstDesc    : data.atstDesc,
        atstAddDesc : data.atstAddDesc,
        atstImage   : data.atstImage,
        invNm : '',
      }

      var dtPrt = {};
      if(data.atwrkTp != '001') {
        var dtPric = parseInt(data.dtPric.replace(/,/g, ''));
        dtPrt = {
          atwrkNm    : data.atwrkNm,
          mkYY      : data.mkYY,
          base      : data.base == undefined ? '' : data.base,
          style1    : data.style1,
          style2    : data.style2,
          leCnt     : 0,
          selCnt    : 0,
          selStrDt  : "",
          selEndDt  : "",
          viewCnt   : 0,
          goodCnt   : 0,
          sPric     : dtPric,
          mPric     : dtPric,
          lPric     : dtPric
        };
      }

      var ogPric = parseInt(data.ogPric.replace(/,/g, ''));
      var ogPrt = {
        atwrkNm : data.atwrkNm,
        mkYY    : data.mkYY,
        medium  : data.medium,
        metRias : data.metRias,
        style1  : data.style1,
        style2  : data.style1,
        pric    : ogPric,
        sellTp  : "",
        wartyYn : data.guarant,
        catgYn  : data.catlog,
        viewCnt : 0,
        goodCnt : 0,
        bid     : {},
        wSize   : data.wSize,
        hSize   : data.hSize,
        dSize   : data.dSize
      };

      if(data.atwrkTp == '001') dtPrt = {};
      else if(data.atwrkTp == '002') ogPrt = {};

      var toDate = moment(new Date()).format('YYYYMMDD');

      oldData.image = image;
      oldData.atstInfo = atstInfo;
      oldData.glry = glry;
      oldData.dtPrt = dtPrt;
      oldData.ogPrt = ogPrt;
      oldData.sngl = data.sngl;
      oldData.updDt = toDate;
      oldData.atwrkTp = data.atwrkTp;

      let res = Atwrk.update({_id : _id}, { $set : oldData });

      var delList = data.deleteList;
      var delPath = deletePath;
      for(idx in delList) {
        fs.unlinkSync(delPath + delList[idx]);
      }

      return res;
    } catch(e) {
      console.log('Error : ', e);
      throw new Meteor.Error(
        500,
        '서버 접속 오류가 발생하였습니다. <br /> 잠수 후 다시 시도해주세요.'
      )
    }
  },
  // 판매등록
  updateSalesAtwrk: function(data) {
    try {
      let res;
    
      if(data.dtPrt.sellStrDt == undefined) {
        // 원화만 있을 경우
        res = Atwrk.update({ _id : data._id}, {  $set : { ogPrt : data.ogPrt } });
      } else {
        if(data.sellStrDt == undefined) {
          // 디지털 판화만 있을 경우
          res = Atwrk.update({ _id }, { $set : {  dtPrt : data.dtPrt }});
        } else {
          // 원화 + 디지털 판화
          res = Atwrk.update({ _id }, { $set : { ogPrt : data.ogPrt, dtPrt : data.dtPrt } });
        }
      }

      return res;
    } catch(e) {
      console.log('Error : ', e);
      throw new Meteor.Error(
        500,
        '서버 접속 오류가 발생하였습니다. <br /> 잠수 후 다시 시도해주세요.'
      )
    }
  },
  insertAtwrk: function(data) {
    try {
      const _id = Meteor.commonUtils.generateUUID();

      // 이미지 처리 Temp -> 메인 폴더로 이동 및 img insert 셋팅
      var image = [];
      var imgAll = data.imgAll;
      var tempDir = tempPath;
      var imageDir = imagesPath;

      for(val in imgAll) {
        var imgUrl = '';

        var blob = Meteor.wrapAsync(fs.readFile)(tempDir + imgAll[val]);

        Meteor.wrapAsync(fs.writeFile)(imageDir + imgAll[val], blob);

        imgUrl = "/images/" + imgAll[val];

        var imgObj = {
          atwrkTp   : data.atwrkTp,
          imgID     : imgUrl,
          imgSortNo : 0,
          rprsn     : "",
        };

        if(val == 'mainUploadImg') {
          imgObj.rprsn = "Y";
          imgObj.size = data.mainImgSize;
          imgObj.imgSortNo = 1;
        } else {
          var sortNum = parseFloat(val.split('_')[1]);
          imgObj.rprsn = "N";
          imgObj.imgSortNo = (sortNum + 1);
        }
        image.push(imgObj);
      }
      
      if(data.atstImage != undefined && data.atstImage != '') {
        var blob = Meteor.wrapAsync(fs.readFile)(tempDir + data.atstImage);

        Meteor.wrapAsync(fs.writeFile)(imageDir + data.atstImage, blob);

        data.atstImage = "/images/" + data.atstImage;
      }

      var glryInfo = Meteor.users.findOne({_id : this.userId});

      var glry = {
        bsnsID: glryInfo._id,
        glryNm: glryInfo.profile.uInfos.glryNm,
        area: glryInfo.profile.uInfos.area,
        dong: glryInfo.profile.uInfos.dong,
        sigungu: glryInfo.profile.uInfos.sigungu
      }
      var atstInfo = {
        atstNm      : data.atstNm,
        atstDesc    : data.atstDesc,
        atstAddDesc : data.atstAddDesc,
        atstImage   : data.atstImage,
        invNm : '',
      }

      var dtPrt = {};
      if(data.atwrkTp != '001') {
        var dtPric = parseInt(data.dtPric.replace(/,/g, ''));
        var dtPrt = {
          atwrkNm    : data.atwrkNm,
          mkYY      : data.mkYY,
          base      : data.base == undefined ? '' : data.base,
          style1    : data.style1,
          style2    : data.style2,
          leCnt     : 0,
          selCnt    : 0,
          // selStrDt  : "",
          // selEndDt  : "",
          viewCnt   : 0,
          goodCnt   : 0,
          sPric     : dtPric,
          mPric     : dtPric,
          lPric     : dtPric
        };
      }

      var ogPric = parseInt(data.ogPric.replace(/,/g, ''));
      var ogPrt = {
        atwrkNm : data.atwrkNm,
        mkYY    : data.mkYY,
        medium  : data.medium,
        metRias : data.metRias,
        style1  : data.style1,
        style2  : data.style1,
        pric    : ogPric,
        sellTp  : "",
        wartyYn : data.guarant,
        catgYn  : data.catlog,
        viewCnt : 0,
        goodCnt : 0,
        bid     : {},
        wSize   : data.wSize,
        hSize   : data.hSize,
        dSize   : data.dSize
      };

      if(data.atwrkTp == '001') dtPrt = {};
      else if(data.atwrkTp == '002') ogPrt = {};

      var toDate = moment(new Date()).format('YYYYMMDD');
  
      var createData = {
        _id,
        atwrkTp : data.atwrkTp,
        image,
        atstInfo,
        glry,
        dtPrt,
        ogPrt,
        sellYn: "N",
        sngl: data.sngl,
        updDt: "",
        insDt: toDate,
        soldYn : 'N',                       // 원화 팔렸거나 디지털판화 전부 팔렸을때 
        delYn : 'N'                         // 이미 팔린 작품 삭제여부 확인
      };

      var res = Atwrk.insert(createData);
      
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
      var toDate = new Date();
      var agoDate = new Date(toDate);
      agoDate.setMonth((toDate.getMonth() - 1));

      toDate = moment(toDate).format('YYYYMMDD');
      agoDate = moment(agoDate).format('YYYYMMDD');

      var normal = {
        'ogPrt.atwrkNm' : { $exists: true },
        "delYn" : "N",
        "soldYn" : "N",
        "sellYn" : "Y",
        insDt : {$gte : agoDate, $lte : toDate},
      };

      let res = Atwrk.find(normal, { $sample : { size : 12 }, sort : { insDt : -1 } }).fetch();

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
      
      let res = Atwrk.find({'ogPrt.atwrkNm' : { $exists : true }}, {sort : {'ogPrt.goodCnt' : -1}, limit : 20}).fetch();

      return res;
    } catch(e) {
      console.log('Error : ', e);
      throw new Meteor.Error(
        500,
        '서버 접속 오류가 발생하였습니다. <br /> 잠수 후 다시 시도해주세요.'
      )
    }
  },
  // 홈화면 이벤트 여러건 조회
  selectEvntList: function() {
    try {
      let res = Evnt.find({}, { limit : 12, sort : { insDt : -1 }}).fetch();

      return res;
    } catch(e) {
      console.log('Error : ', e);
      throw new Meteor.Error(
        500,
        '서버 접속 오류가 발생하였습니다. <br /> 잠수 후 다시 시도해주세요.'
      )
    }
  },
  // Evnt 전시 및 행사 종료날짜가 끝나지 않은 이벤트로 단건만 조회
  selectEvntHome: function(bsnsId) {
    try {
      var endDt = new Date();
      endDt = moment(endDt).format('YYYYMMDD');

      let res = Evnt.findOne({ 
        'glry.bsnsID' : bsnsId,
        endDt : {
          $gte : endDt
        }
      }, { limit : 12})

      return res;
    } catch(e) {
      console.log('Error : ', e);
      throw new Meteor.Error(
        500,
        '서버 접속 오류가 발생하였습니다. <br /> 잠수 후 다시 시도해주세요.'
      )
    }
  },
  // Evnt 상세 조회
  selectEvntDetail: function(_id) {
    try {
      let res = Evnt.findOne({ '_id' : _id });

      return res;
    } catch(e) {
      console.log('Error : ', e);
      throw new Meteor.Error(
        500,
        '서버 접속 오류가 발생하였습니다. <br /> 잠수 후 다시 시도해주세요.'
      )
    }
  },
  // 지난 전시/행사 조회
  selectGlryHistEvt: function(bsnsId) {
    try {
      var endDt = new Date();
      endDt = moment(endDt).format('YYYYMMDD');

      let res = Evnt.find({
        'glry.bsnsID' : bsnsId,
        endDt : {
          $lt : endDt
        }
      }, { limit : 12}).fetch();

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
  // 파일 업로드
  saveFile(image = {blob: "", name: "", encoding: ""}) {
    var path = tempPath;
    
    var date = new Date();
    date = moment(date).format('YYYYMMDDHHmmss');
    var fileName = 'img_' + Meteor.commonUtils.generateUUID() + `_${date}`;

    var fsWriteFile = Meteor.wrapAsync(fs.writeFile);

    fsWriteFile(path + fileName, image.blob, image.encoding);

    return {fileName:fileName, name:image.name};
  }
  // fileFinds: function(filename) {
  //   try {
  //     let data =  Files.findOne({filename : filename});
  //     let file =  Chunk.findOne({files_id : data._id});

  //     var blob = new Uint8Array(file.data);
  //     // var base64String = btoa(String.fromCharCode.apply(null, blob));
  //     // var src = 'data:image/png;base64,' + base64String + '';
      

  //   } catch(e) {
  //     console.log('Error : ', e);
  //     throw new Meteor.Error(
  //       500,
  //       '서버 접속 오류가 발생하였습니다. <br /> 잠수 후 다시 시도해주세요.'
  //     );
  //   }
  // }
});
 