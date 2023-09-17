import { Meteor } from 'meteor/meteor';
import fs from 'fs';
import { BsnsMber, SnsMber, Mber, Atwrk } from '../lib/collections.js';

// 회원관련 조회 및 서버 로직

const tempPath = Meteor.settings.tempPath;
const imagesPath = Meteor.settings.imagesPath;

// 리턴 용 함수
function setRetData(list) { 
  var retList = [];
  for(idx in list) {
    list[idx].profile.uInfos._id = list[idx]._id;
    retList.push(list[idx].profile.uInfos);
  }
  return retList;
}

Meteor.methods({
    // 사용자 비밀번호 초기화 url 전송
    forgetPassword: function(email) {
      try {
        Accounts.forgotPassword(email, function(err, res) {
          if(err) console.log(err);
          else {
            console.log(res);
          }
        });
      } catch(e) {
        console.log('Error : ', e);
        throw new Meteor.Error(
          500,
          '서버 접속 오류가 발생하였습니다. <br /> 잠수 후 다시 시도해주세요.'
        );
      }
    },
    // 이메일 or 사업자등록 번호로 사용자 조회
    emailOrBnumChk: function(id) {
      try {
        let res = Meteor.users.findOne({
          $or : [
            { 'emails.address' : id },
            { 'profile.uInfos.bsnsID' : id}
          ]
        });

        return res;
      } catch(e) {
        console.log('Error : ', e);
        throw new Meteor.Error(
          500,
          '서버 접속 오류가 발생하였습니다. <br /> 잠수 후 다시 시도해주세요.'
        );
      }
    },
    // 아이디 찾기 사용자 정보에 이메일 존재 확인
    idSchEmailAuth: function(email) {
      try {
        let res = Meteor.users.findOne({
          $or : [
            { 'profile.uInfos.bsnsChagEmail' : email },
            { 'profile.uInfos.email' : email }
          ]
        });

        return res;
      } catch(e) {
        console.log('Error : ', e);
        throw new Meteor.Error(
          500,
          '서버 접속 오류가 발생하였습니다. <br /> 잠수 후 다시 시도해주세요.'
        );
      }
    },
    // 이메일 인증전 등록된 이메일 인지 확인
    seltEmailChk: function(email) {
      try {
        let res = Meteor.users.findOne({ 'emails.address' : email });

        return res;
      } catch(e) {
        console.log('Error : ', e);
        throw new Meteor.Error(
          500,
          '서버 접속 오류가 발생하였습니다. <br /> 잠수 후 다시 시도해주세요.'
        );
      }
    },
    // 닉네임 중복체크
    nicNmChk: function(nicNm) {
      try {
        let res = Meteor.users.findOne({ 'profile.uInfos.nicNm' : nicNm});

        return res;
      } catch(e) {
        console.log('Error : ', e);
        throw new Meteor.Error(
          500,
          '서버 접속 오류가 발생하였습니다. <br /> 잠수 후 다시 시도해주세요.'
        );
      }
    },
    // 닉네임 변경
    nicNmUpdate: function(nicNm) {
      try {
        let res = {};
        let userId = this.userId;
        
        var toDate = moment(new Date()).format('YYYYMM');

        var uData = Meteor.users.findOne({_id : userId});

        var nicNmChgCnt = uData.profile.uInfos.nicNmChgCnt;
        var nicNmChgMM = uData.profile.uInfos.nicNmChgMM;

        if(toDate == nicNmChgMM) {
          if(nicNmChgCnt == 4) {
            res.message = '이번달 최대 변경횟수입니다.';
          } else res = Meteor.users.update({_id : userId}, { $inc : { 'profile.uInfos.nicNmChgCnt' : 1 }, $set : { 'profile.uInfos.nicNm' : nicNm } });
        } else res = Meteor.users.update({_id : userId}, { $set : { 'profile.uInfos.nicNmChgCnt' : 1 }, $set : { 'profile.uInfos.nicNm' : nicNm, 'profile.uInfos.nicNmChgMM' : toDate}});

        return res;
      } catch(e) {
        console.log('Error : ', e);
        throw new Meteor.Error(
          500,
          '서버 접속 오류가 발생하였습니다. <br /> 잠수 후 다시 시도해주세요.'
        );
      }
    },
    // 회원정보 이메일 인증 확인
    chgEmailChk: function(email) {
      try {
        let res = Meteor.users.findOne({'profile.uInfos.email' : email});

        return res;
      } catch(e) {
        console.log('Error : ', e);
        throw new Meteor.Error(
          500,
          '서버 접속 오류가 발생하였습니다. <br /> 잠수 후 다시 시도해주세요.'
        );
      }
    },
    // 회원정보 이메일 인증 완료 후 변경 작업
    uEmailUpd: function(email) {
      try {
        let userId = this.userId;
        let res = Meteor.users.update({_id : userId}, { $set : { 'profile.uInfos.email' : email } });

        return res;
      } catch(e) {
        console.log('Error : ', e);
        throw new Meteor.Error(
          500,
          '서버 접속 오류가 발생하였습니다. <br /> 잠수 후 다시 시도해주세요.'
        );
      }
    },
    // 회원정보 프로필 사진 변경
    uProfileImgChg: function(image) {
      try {
        let userId = this.userId;
        var update = { $set : {}};
        if(image != undefined && image != '') {
          var tempDir = tempPath;
          var imageDir = imagesPath;

          var blob = Meteor.wrapAsync(fs.readFile)(tempDir + image);

          Meteor.wrapAsync(fs.writeFile)(imageDir + image, blob);

          var url = "/images/" + image;

          update.$set['profile.uInfos.pfImg'] = url;
        }

        let res = Meteor.users.update({_id : userId}, update);

        return res;
      } catch(e) {
        console.log('Error : ', e);
        throw new Meteor.Error(
          500,
          '서버 접속 오류가 발생하였습니다. <br /> 잠수 후 다시 시도해주세요.'
        );
      }
    },
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
    // mBer 회원조회(로그인)
    selectMBer: function(data) {
      try {
        data.pwd = Meteor.call('encrypt', data.pwd);
      
        let res = Mber.findOne(data);
        
        if(res == undefined) {
          var bSnsData = {
            bsnsChagEmail : data.email,
            pwd : data.pwd
          };

          res = BsnsMber.findOne(bSnsData);
        }

        return res;
      } catch(e) {
        console.log('Error : ', e);
        throw new Meteor.Error(
          500,
          '서버 접속 오류가 발생하였습니다. <br /> 잠수 후 다시 시도해주세요.'
        );
      }
    },
    // 갤러리 조회 수정필요
    clientBsnsMber: function() {
        try {
            let res = Meteor.users.aggregate([
                { $match :  { 'profile.uInfos.bsnsNm' : { $exists: true }} },
                { $sample : { size : 12 }}
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
    // 신규 갤러리 조회
    selectNewGallery: function() {
      try {
        let res   = {};

        var queryData = {
          'profile.uInfos.bsnsTp' : '001',
          'profile.uInfos.glryNm' : { $exists : true }
        };

        var options = {
          limit : 10,
          sort : { insDt : -1 }
        };

        res.total = Meteor.users.find(queryData, options).count();
        res.list  = Meteor.users.find(queryData, options).fetch();

        res.list = setRetData(res.list);

        return res;
      } catch(e) {
        console.log('Error : ', e);
        throw new Meteor.Error(
          500,
          '서버 접속 오류가 발생하였습니다. <br /> 잠수 후 다시 시도해주세요.'
        );
      }
    },
    // 갤러리 조회 가나다 순
    selectGallery: function(query) {
      try{

        var queryData = {
          'profile.uInfos.bsnsTp'  : '001',
          'profile.uInfos.glryNm'  : { $regex : query.glryNm },
          'profile.uInfos.dong' : { $regex : query.dong },
          'profile.uInfos.area' : { $regex : query.area }
        };

        var options = {
          skip  : query.skip,
          limit : query.limit,
          sort  : { 'profile.uInfos.glryNm' : 1 },
        };

        let res   = {};

        res.total = Meteor.users.find(queryData).count();
        res.list  = Meteor.users.find(queryData, options).fetch();

        res.list = setRetData(res.list);

        return res
      } catch(e) {
        console.log('Error : ', e);
        throw new Meteor.Error(
          500,
          '서버 접속 오류가 발생하였습니다. <br /> 잠수 후 다시 시도해주세요.'
        );
      }
    },
    // 갤러리 정보 조회 (단건)
    selectGlryDetail: function(_id) {
      try{
        let res = Meteor.users.findOne({_id : _id});

        return res.profile.uInfos;
      } catch(e) {
        console.log(e);
        throw new Meteor.Error(
          500, 
          '서버 접속 오류가 발생하였습니다.  <br /> 잠수 후 다시 시도해주세요.'
        );
      }
    },
    // 사업자 ID 로 작품조회
    selectAtwrkForBsns: function(_id, data ,options) {
      try{
        let res = {};
        var normal = {
          'glry.bsnsID' : _id,
          "delYn" : "N",
          "soldYn" : "N"
      };

        if(Object.keys(data).length > 0) {

          var atstNm = data.ATSTNM != undefined ?
          { 'atstInfo.atstNm' : { $in : data.ATSTNM }} : {};

          // 금액 범위에 맞게 설정
          var price = data.ARTWORK_PRICE_OGPRT != undefined ? 
          { "ogPrt.pric" : { 
              $gte : Number(data.ARTWORK_PRICE_OGPRT[0].min),
              $lte : Number(data.ARTWORK_PRICE_OGPRT[0].max)
          }} : {};
          
          // 선택한 미디움 설정
          var medium = data.MEDIUM != undefined ? 
          { 'ogPrt.medium' : { $in : data.MEDIUM } } : {};

          // 선택한 연도 설정
          var mkYearList = [];
          if(data.MK_YEAR != undefined) {
          data.MK_YEAR.forEach(ele => {
              mkYearList.push({
              "ogPrt.mkYY" : { $gte : ele.min, $lte : ele.max},
              });
          });
          }
          var mkYear = mkYearList.length > 0 ? { $or : mkYearList } : {};

          var style1 = data.STYLE_1 != undefined ?
          { 'ogPrt.style1' : { $in : data.STYLE_1 } } : {};

          var style2 = data.STYLE_2 != undefined ?
          { 'ogPrt.style2' : { $in : data.STYLE_2 } } : {};

          var metRias = data.MATERIAL != undefined ?
          { 'ogPrt.metRias' : { $in : data.MATERIAL} } : {};

          var queryData = { $and : [ normal, atstNm ,price, medium, mkYear, style1, style2, metRias ] }

          res.list = Atwrk.find(queryData, options).fetch();
          res.total = Atwrk.find(queryData).count();
        } else {
          res.list = Atwrk.find(normal, options).fetch();
          res.total = Atwrk.find(normal).count();
        }

        return res;
      } catch(e) {
        console.log(e);
        throw new Meteor.Error(
          500, 
          '서버 접속 오류가 발생하였습니다.  <br /> 잠수 후 다시 시도해주세요.'
        );
      }
    },
    // 작품 ID 로 작품 조회
    selectAtwrkDetail: function(_id) {
      try{
        let normal = {
          '_id' : _id,
          "delYn" : "N",
          "soldYn" : "N",
          "sellYn" : "Y"
        };

        let res = Atwrk.findOne(normal);

        return res;
      } catch(e) {
        console.log(e);
        throw new Meteor.Error(
          500, 
          '서버 접속 오류가 발생하였습니다.  <br /> 잠수 후 다시 시도해주세요.'
        );
      }
    },
    // 작품 검색
    selectSchForAtwrk: function(data, option) {
      try {
        var price = data.ARTWORK_PRICE_OGPRT != undefined ? 
          { "ogPrt.pric" : { 
            $gte : Number(data.ARTWORK_PRICE_OGPRT[0].min),
            $lte : Number(data.ARTWORK_PRICE_OGPRT[0].max)
          }} : {};
        
        var medium = data.MEDIUM != undefined ? 
          { 'ogPrt.medium' : { $in : data.MEDIUM } } : {};

        var mkYearList = [];
        if(data.MK_YEAR != undefined) {
          data.MK_YEAR.forEach(ele => {
            mkYearList.push({
               "ogPrt.mkYY" : { $gte : ele.min, $lte : ele.max},
            });
          });
        }
        var mkYear = mkYearList.length > 0 ? { $or : mkYearList } : {};

        var style1 = data.STYLE_1 != undefined ?
          { 'ogPrt.style1' : { $in : data.STYLE_1 } } : {};

        var style2 = data.STYLE_2 != undefined ?
          { 'ogPrt.style2' : { $in : data.STYLE_2 } } : {};

        var metRias = data.MATERIAL != undefined ?
          { 'ogPrt.metRias' : { $in : data.MATERIAL} } : {};

        var filter = data.FILTER != undefined ?
          {} : {};

        var options = {
          limit : option.limit,
          skip  : option.skip,
        };

        var queryData = { $and : [ price, medium, mkYear, style1, style2, metRias, filter ] }

        let res = {};
        res.total = Atwrk.find(queryData).count();
        res.list = Atwrk.find(queryData, options).fetch();

        return res;
      } catch(e) {
        console.log(e);
        throw new Meteor.Error(
          500, 
          '서버 접속 오류가 발생하였습니다.  <br /> 잠수 후 다시 시도해주세요.'
        );
      }
    },
    // 갤러리 ID(사업자 ID) 로 최신작 10개 조회
    selectLatestGlryList: function(_id) {
      try{
        let normal = {
          'glry.bsnsID' : _id,
          "delYn" : "N",
          "soldYn" : "N",
          "sellYn" : "Y"
        };


        let res = Atwrk.find(normal, { limit : 10, sort : { insDt : -1 } }).fetch();

        return res;
      } catch(e) {
        console.log(e);
        throw new Meteor.Error(
          500, 
          '서버 접속 오류가 발생하였습니다.  <br /> 잠수 후 다시 시도해주세요.'
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
    // 사업자 회원번호로 사업자 회원 조회
    seltCompanyNum: function(bsnsID) {
      try {
        let res = Meteor.users.findOne({'profile.uInfos.bsnsID' : bsnsID});

        return res;
      } catch(e) {
        console.log(e);
        throw new Meteor.Error(
          500, 
          '서버 접속 오류가 발생하였습니다.  <br /> 잠수 후 다시 시도해주세요.'
        );
      }
    },
    // 사업자 등록번호 조회
    companyRegNumChk: function(number) {
      try {

        let seltCompanyUser = Meteor.call('seltCompanyNum', number);

        let res= {};

        if(seltCompanyUser == undefined) {
          var option = {
            headers: 'application/json',
            data :{ b_no : [number] }
          };
  
          // api ServiceKey
          var serviceKey = 'EQqsHgP1F345WdlW4iRVeUUvMNvp6WIuajklNiYDjR0zIIWlIcJOu3eNVTNxhsZosdO4PlPs0My8L4yj3gT9LA%3D%3D';
          // api URL
          var url = 'https://api.odcloud.kr/api/nts-businessman/v1/status?serviceKey='+serviceKey;
  
          res = JSON.parse(HTTP.call('POST', url, option).content);
        } else {
          res.status_code = 'HAVE';
        }


        return res;
      } catch(e) {
        console.log(e);
        throw new Meteor.Error(
          500, 
          '서버 접속 오류가 발생하였습니다.  <br /> 잠수 후 다시 시도해주세요.'
        );
      } 
    },
    // 기업회원 가입
    createBsnsMber: function(bsnsData) {
      try {
        var templeBsnsMber = {};
        templeBsnsMber = JSON.parse(Assets.getText('json/bsnsMber.json'));

        templeBsnsMber._id = Meteor.commonUtils.generateUUID();
        templeBsnsMber.bsnsTP = bsnsData.bsnsTP;
        templeBsnsMber.bsnsID = bsnsData.bsnsID;
        templeBsnsMber.bsnsNm = bsnsData.bsnsNm;
        templeBsnsMber.homeUrl = bsnsData.homeUrl;
        templeBsnsMber.glryNm = bsnsData.glryNm;
        templeBsnsMber.addr1 = bsnsData.addr1;
        templeBsnsMber.addr2 = bsnsData.addr2;
        templeBsnsMber.zipCd = bsnsData.zipCd;
        templeBsnsMber.dong = bsnsData.dong;
        templeBsnsMber.sigungu = bsnsData.sigungu;
        templeBsnsMber.bsnsMber = 'N';
        templeBsnsMber.bsnsChagNm = bsnsData.bsnsChagNm;
        templeBsnsMber.bsnsChagMob = bsnsData.bsnsChagMob;
        templeBsnsMber.bsnsChagEmail = bsnsData.bsnsChagEmail;
        
        // templeBsnsMber.pwd = Meteor.call('encrypt', userData.pwd);

        let res = BsnsMber.insert(templeBsnsMber);

        return res;
      } catch(e) {
        console.log(e);
        throw new Meteor.Error(
          500, 
          '서버 접속 오류가 발생하였습니다.  <br /> 잠수 후 다시 시도해주세요.'
        );
      } 
    },
     // 알림등록 / 소식받기 삭제
     deleteNotice: function(_id, bsnsId) {
      try {
        let res = {};

        res = Meteor.users.update({ _id }, { $pull : { 'profile.uInfos.ntcn' : bsnsId }});

        return res;
      } catch(e) {
        console.log(e);
        throw new Meteor.Error(
          500, 
          '서버 접속 오류가 발생하였습니다.  <br /> 잠수 후 다시 시도해주세요.'
        );
      }
    },
    // 알림등록 / 소식받기 클릭 시 비즈니스 회원 알림 등록
    insertNotice: function(_id, bsnsId) {
      try {
        let res = {};

        res = Meteor.users.update({ _id }, { $addToSet : { 'profile.uInfos.ntcn' : bsnsId }});

        return res;
      } catch(e) {
        console.log(e);
        throw new Meteor.Error(
          500, 
          '서버 접속 오류가 발생하였습니다.  <br /> 잠수 후 다시 시도해주세요.'
        );
      }
    },
    // 비딩 완료 프로세스
    insertAtwrkBid: function(userId, atwrkId, mob, totalPric, selectBidPrice) {
      try {
        let res = {};

        var date = new Date();
        date = moment(date).format('YYYYMMDDHHmmss');

        res =  Atwrk.update({_id : atwrkId}, { 
          $addToSet : {
            'ogPrt.bid.bidInfo' : {
              bidInfoID : userId,   // userId - Mber _id or BsnsMber _id
              bidInboMob : mob,     // 휴대폰 인증한 휴대폰번호
              bidInfoAmt : totalPric,     // 비딩한 금액 
              bidInfoDt : date      // 입찰시간
            }
          },
          $set : {
            'ogPrt.bid.nPric' : selectBidPrice
          }
        });

        return res;
      } catch(e) {
        console.log(e);
        throw new Meteor.Error(
          500, 
          '서버 접속 오류가 발생하였습니다.  <br /> 잠수 후 다시 시도해주세요.'
        );
      }
    },
    // 신규 배송지 등록
    deliveryIns: function(data) {
      try {
        let res = {};
        let userId = Meteor.userId();

        if(data.defDelivYn == 'Y') {
          Meteor.users.update({ _id : userId, 'profile.uInfos.deliv.defDelivYn' : 'Y'}, { $set : { 'profile.uInfos.deliv.$.defDelivYn' : 'N'}});
          res = Meteor.users.update({_id : userId}, { $addToSet : { 'profile.uInfos.deliv' : data }});
        } else {
          res = Meteor.users.update({_id : userId}, { $addToSet : { 'profile.uInfos.deliv' : data }});
        }

        return res;
      } catch(e) {
        console.log(e);
        throw new Meteor.Error(
          500, 
          '서버 접속 오류가 발생하였습니다.  <br /> 잠수 후 다시 시도해주세요.'
        );
      }
    },
    // 배송지 삭제
    deliveryDel: function(_id, data) {
      try {

        let res = Meteor.users.update({
          _id
        }, {
          $pull : { 'profile.uInfos.deliv' : {
            addr1 : data.addr1,
            addr2 : data.addr2,
            zipCd : data.zipCd,
            defDelivYn : data.defDelivYn,
            mob : data.mob,
            recptnNm : data.recptnNm,
            delivNm : data.delivNm
          }}
        });

        return res;
      } catch(e) {
        console.log(e);
        throw new Meteor.Error(
          500, 
          '서버 접속 오류가 발생하였습니다.  <br /> 잠수 후 다시 시도해주세요.'
        );
      }
    },
    // 기본 배송지 변경
    defaultDelivChg: function(data) {
      try {
        let res = {};
        let userId = this.userId;

        // 기존 기본 배송지 변경 Y -> N
        Meteor.users.update(
          { _id : userId, 'profile.uInfos.deliv.defDelivYn' : 'Y' },
          { $set : { 'profile.uInfos.deliv.$.defDelivYn' : 'N' } }
        );

        // 신규 기본배송지 설정 N -> Y
        res = Meteor.users.update(
            {  _id : userId,  'profile.uInfos.deliv' : data },
            { $set : { 'profile.uInfos.deliv.$.defDelivYn' : 'Y' } }
        );

        return res;
      } catch(e) {
        console.log(e);
        throw new Meteor.Error(
          500, 
          '서버 접속 오류가 발생하였습니다.  <br /> 잠수 후 다시 시도해주세요.'
        );
      }
    },
    // 배송지 수정
    editDeliv: function(pastData, newData) {
      try {
        let res = {};
        let userId = Meteor.userId();

        res = Meteor.users.update(
          { _id : userId, 'profile.uInfos.deliv' : pastData },
          { $set : { 'profile.uInfos.deliv.$' : newData} }
        );

        return res;
      } catch(e) {
        console.log(e);
        throw new Meteor.Error(
          500, 
          '서버 접속 오류가 발생하였습니다.  <br /> 잠수 후 다시 시도해주세요.'
        );
      }
    },
    // 회원탈퇴
    delWithDrawalUser: function(data) {
      try {
        let res = {};
        let userId = Meteor.userId();

        var date = new Date();
        date = moment(date).format('YYYYMMDDHHmmss');

        res = Mber.update({_id : userId}, { $set : { secsnRsn : data.secsnRsn, secsnTp : data.secsnTp, secsnDt : date } });

        return res;
      }  catch(e) {
        console.log(e);
        throw new Meteor.Error(
          500, 
          '서버 접속 오류가 발생하였습니다.  <br /> 잠수 후 다시 시도해주세요.'
        );
      }
    }
}); 