import { Meteor } from 'meteor/meteor';
import { BsnsMber, SnsMber, Mber, Atwrk } from '../lib/collections.js';

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
            let res = BsnsMber.aggregate([
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
    // 신규 갤러리 조회
    selectNewGallery: function() {
      try {
        var queryData = {
          bsnsTp : '001'
        };

        var options = {
          limit : 10,
          sort : { insDt : -1 }
        };

        let res   = {};
        res.total = BsnsMber.find(queryData, options).count();
        res.list  = BsnsMber.find(queryData, options).fetch();

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
          bsnsTp  : '001',
          dong    : { $regex : query.dong },
          area    : { $regex : query.area },
          glryNm  : { $regex : query.glryNm }
        };

        var options = {
          limit : query.limit,
          skip  : query.skip,
          sort  : { bsnsNm : -1},
        };

        let res   = {};
        res.total = BsnsMber.find(queryData).count();
        res.list  = BsnsMber.find(queryData, options).fetch();

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
        let res = BsnsMber.findOne({_id : _id});

        return res;
      } catch(e) {
        console.log(e);
        throw new Meteor.Error(
          500, 
          '서버 접속 오류가 발생하였습니다.  <br /> 잠수 후 다시 시도해주세요.'
        );
      }
    },
    // 사업자 ID 로 작품조회
    selectAtwrkForBsns: function(_id) {
      try{
        let res = Atwrk.find({'glry.bsnsID' : _id}).fetch();

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
        let res = Atwrk.findOne({'_id' : _id});

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
        var price = data.ARTWORK_PRICE != undefined ? 
          { "ogPrt.pric" : { 
            $gte : Number(data.ARTWORK_PRICE[0].min),
            $lte : Number(data.ARTWORK_PRICE[0].max)
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

        var options = {
          limit : option.limit,
          skip  : option.skip,
        };

        var queryData = { $and : [ price, medium, mkYear, style1, style2, metRias ] }

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
        let res = Atwrk.find({'glry.bsnsID' : _id}, { limit : 10, sort : { insDt : -1 } }).fetch();

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
    },
    // 사업자 등록번호 조회
    companyRegNumChk: function(number) {
      try {
        var option = {
          headers: 'application/json',
          data :{ b_no : [number] }
        };

        // api ServiceKey
        var serviceKey = 'EQqsHgP1F345WdlW4iRVeUUvMNvp6WIuajklNiYDjR0zIIWlIcJOu3eNVTNxhsZosdO4PlPs0My8L4yj3gT9LA%3D%3D';
        // api URL
        var url = 'https://api.odcloud.kr/api/nts-businessman/v1/status?serviceKey='+serviceKey;

        let res = HTTP.call('POST', url, option).content;

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

        console.log(bsnsData);

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