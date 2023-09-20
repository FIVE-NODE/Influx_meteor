import { Meteor } from 'meteor/meteor';
import fs from 'fs';
import { Atwrk, Evnt, Pick, Order } from '../lib/collections.js';

// 원화 는 원화만, 디지털 판화는 판화만 특정 카테고리만 조회 하는 서버로직

const tempPath = Meteor.settings.tempPath;
const imagesPath = Meteor.settings.imagesPath;

Meteor.methods({
    // 원화작품만 조회 (필터 조건 or 전부)
    selectOrgAtwrk: function(data, option) {
        try {
            let res = {};
            
            // 원화 작품 있는 것만 셋팅
            var normal = {
              'ogPrt.atwrkNm' : { $exists: true },
              "delYn" : "N",
              "soldYn" : "N",
              "sellYn" : "Y"
            };

            if(!(Object.keys(data).length === 0)) {
              // 필터 조건이 있을경우 해당하는 조건 만 AND 로 조회한다.

              // 이벤트 전시 조회에서 들어온 경우 Atwrk._id 를 가지고 해당하는 것만 조회하는 로직 추가
              var evntAtwrk = data.EVNT_ATWRK_ID != undefined ?
              { _id : { $in : data.EVNT_ATWRK_ID} } : {};

              // 이벤트용 작가 이름 조회
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

              var ogCurator = data.atwrkIds != undefined ?
              { _id : { $in : data.atwrkIds } } : {};

              var atstSch = data.atstGlrySch != undefined ?
              { 'atstInfo.atstNm' : { $regex : new RegExp(data.atstGlrySch, 'i') }} : {};

              var glryNmSch = data.atstGlrySch != undefined ?
              { 'glry.glryNm' : { $regex : new RegExp(data.atstGlrySch, 'i') }} : {};

              var newEntry = data.newEntry;
              if(newEntry != undefined) {
                var toDate = new Date();
                var agoDate = new Date(toDate);
                agoDate.setMonth((toDate.getMonth() - 1));

                toDate = moment(toDate).format('YYYYMMDD');
                agoDate = moment(agoDate).format('YYYYMMDD');

                newEntry = { insDt : { $gte : agoDate, $lte : toDate }}
                
              } else newEntry = {};

              var inAtwrkList = data.inAtwrkList;
              if(inAtwrkList != undefined) inAtwrkList = { _id : { $nin : inAtwrkList}};
              else inAtwrkList = {};

              var queryData = { $and : [ atstNm, evntAtwrk, inAtwrkList, newEntry, normal, ogCurator, price, medium, mkYear, style1, style2, metRias ], $or : [atstSch, glryNmSch]};

              res.total = Atwrk.find(queryData).count();
              res.list = Atwrk.find(queryData, option).fetch();
            } else {
              // 필터 조건이 없을 경우 전부 조회한다
              res.total = Atwrk.find(normal, option).count();
              res.list = Atwrk.find(normal, option).fetch();
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
    // 디지털 에디션 판화 HOT 인기 작품 랭킹 10개 조회
    selectDigHotAtwrk: function() {
      try {
        // 디지털 판화 작품 있는 것만 셋팅
        var normal = {
          'dtPrt.atwrkNm' : { $exists: true },
          "delYn" : "N",
          "soldYn" : "N"
        };

        let res = Atwrk.find(normal, { limit: 10, sort : { 'dtPrt.goodCnt' : -1 }}).fetch();

        return res;
      } catch(e) {
        console.log(e);
        throw new Meteor.Error(
          500, 
          '서버 접속 오류가 발생하였습니다.  <br /> 잠수 후 다시 시도해주세요.'
        );
      }
    },
    // 디지털 에디션 판화 판화 작품만 조회 (필터 조건 or 전부)
    selectDigAtwrk: function(data, option) {
      try {
        let res = {};

        // 디지털 판화 작품 있는 것만 셋팅
        var normal = {
          'dtPrt.atwrkNm' : { $exists: true },
          "delYn" : "N",
          "soldYn" : "N"
        };

        if(!(Object.keys(data).length === 0)) {
          // 금액 범위에 맞게 설정
          var priceObjectChk = data.ARTWORK_PRICE_DTPRT != undefined;
          var minPrice = priceObjectChk ? Number(data.ARTWORK_PRICE_DTPRT[0].min) : '';
          var maxPrice = priceObjectChk ? Number(data.ARTWORK_PRICE_DTPRT[0].max) : '';
          var sPrice = priceObjectChk ? { "dtPrt.sPric" : {  $gte : minPrice, $lte : maxPrice } } : {};
          var mPrice = priceObjectChk ? { "dtPrt.mPric" : {  $gte : minPrice, $lte : maxPrice } } : {};
          var lPrice = priceObjectChk ? { "dtPrt.lPric" : {  $gte : minPrice, $lte : maxPrice } } : {};
           
          // 선택한 미디움 설정
          var base = data.BASE != undefined ? 
          { 'dtPrt.base' : { $in : data.BASE } } : {};

          var style1 = data.STYLE_1 != undefined ?
          { 'dtPrt.style1' : { $in : data.STYLE_1 } } : {};

          var style2 = data.STYLE_2 != undefined ?
          { 'dtPrt.style2' : { $in : data.STYLE_2 } } : {};

          var dtCurator = data.atwrkIds != undefined ?
          { _id : { $in : data.atwrkIds } } : {};

          var inAtwrkList = data.inAtwrkList;
          if(inAtwrkList != undefined) inAtwrkList = { _id : { $nin : inAtwrkList}};
          else inAtwrkList = {};

          var atstSch = data.atstGlrySch != undefined ?
          { 'atstInfo.atstNm' : { $regex : new RegExp(data.atstGlrySch, 'i') }} : {};

          var glryNmSch = data.atstGlrySch != undefined ?
          { 'glry.glryNm' : { $regex : new RegExp(data.atstGlrySch, 'i') }} : {};

          var queryData = { $and : [ inAtwrkList, normal, dtCurator,sPrice, mPrice, lPrice, base, style1, style2 ], $or : [ atstSch, glryNmSch ]};

          res.total = Atwrk.find(queryData).count();
          res.list = Atwrk.find(queryData, option).fetch();
        } else {
          // 필터 조건이 없을 경우 전부 조회한다
          res.total = Atwrk.find(normal).count();
          res.list = Atwrk.find(normal, option).fetch();
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
    // 이벤트 / 전시 베너 조회 오늘일자가 전시 시작일 -3일 전일때
    selectExhigitionEvntBanr: function(option) {
      try {
        var toDay = new Date();
        var evntStrDay = moment(toDay).add(3, 'd').format('YYYYMMDD');
        toDay = moment(toDay).format('YYYYMMDD');

        let res = Evnt.find({ strDt : { $gte : toDay, $lte : evntStrDay} }).fetch();

        return res;
      } catch(e) {
        console.log(e);
        throw new Meteor.Error(
          500, 
          '서버 접속 오류가 발생하였습니다.  <br /> 잠수 후 다시 시도해주세요.'
        );
      }
    },
    // 이벤트 / 전시 리스트 조회
    selectExhigitionEvntList: function(data, option) {
      try {
        let res = {};
        
        var toDay = new Date();
        var evntEndDay = moment(toDay).subtract(1, 'M').format('YYYYMMDD');
        var aftDay = moment(toDay).add(3, 'd').format('YYYYMMDD');
        toDay = moment(toDay).format('YYYYMMDD');

        option.sort = {
          'glry.glryNm' : 1
        };

        var normal = {
          $or: [
            { strDt : { $gte : toDay, $lte : aftDay} }
            ,{ endDt : { $gte : evntEndDay, $lte : toDay}}
          ]
      };
        
        if(!(Object.keys(data).length === 0)) {
          
          var glryNm = data.glryNm != '' ?
          { 'glry.glryNm' : { $regex : data.glryNm }} : {};

          var kindCode = data.kindCode != '' ? 
          { evntTp :  data.kindCode } : {};

          // 헤더의 검색으로 들어왔을 때만 사용하는 변수
          var areasSch = [];
          var areas = data.area;
          var area = {};
          
          if(Array.isArray(areas) || Array.isArray(kindCode.evntTp)) {
            // 검색으로 리스트로 넘어 왔을때

            if(Array.isArray(areas) != undefined) {
              for(idx in areas) {

                if(areas[idx].length != 2) {

                  var splitVal = areas[idx].split('.');

                  for(num in splitVal) {
                    areasSch.push({ 'glry.area' : { $regex : splitVal[num]} });  
                  }

                } else {
                  areasSch.push({ 'glry.area' : { $regex : areas[idx]} });
                }
              }
            }

            kindCode = Object.keys(data.kindCode).length > 0 ? { evntTp : { $in : data.kindCode }} : {};
          } else if(areas != undefined){
            // 퀵메뉴 통해 들어와서 검색을 이용했을때
            areas = areas.trim();
            if(areas != '') {
              if(areas.indexOf('구') > 0) {
                area = { 'glry.sigungu' : { $regex : areas } };
              } else if(areas.indexOf('동') > 0) {
                area = { 'glry.dong' : { $regex : areas } };
              } else {
                area = { 'glry.area' : { $regex : areas } };
              }
            } 
          }
          
          var queryData = areasSch.length == 0 ? 
            { $and : [normal, glryNm, kindCode, area ] } :
            { $and : [normal, glryNm, kindCode], $or : areasSch};
        
          res.total = Evnt.find(queryData).count();
          res.list = Evnt.find(queryData, option).fetch();
        } else {
          res.total = Evnt.find(normal).count();
          res.list = Evnt.find(normal, option).fetch();
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
    // 관심작품 조회 List
    sltInterestAtwrk: function(data, option) {
      try {
        let res = Atwrk.find({ _id : { $in : data } }).fetch();

        return res;
      } catch(e) {
        console.log(e);
        throw new Meteor.Error(
          500, 
          '서버 접속 오류가 발생하였습니다.  <br /> 잠수 후 다시 시도해주세요.'
        );
      }
    },
    // 관심작품 리스트 cnt
    sltInterestAtwrkCnt: function(data) {
      try {
        let res = Atwrk.find({ _id : { $in : data } }).count();

        return res;
      } catch(e) {
        console.log(e);
        throw new Meteor.Error(
          500, 
          '서버 접속 오류가 발생하였습니다.  <br /> 잠수 후 다시 시도해주세요.'
        );
      }
    },
    sltUserCart: function(data) {
      try {
        let res = Atwrk.find({ _id : { $in : data } }).fetch();

        return res;
      }  catch(e) {
        console.log(e);
        throw new Meteor.Error(
          500, 
          '서버 접속 오류가 발생하였습니다.  <br /> 잠수 후 다시 시도해주세요.'
        );
      }
    },
    // 큐레이터 픽 작품 삭제하기
    deletePickAtwrk: function(atwrkId, tabFlag) {
      try {
        let res = Pick.update({ 'atstAtwrk.atwrkID': { $in : atwrkId }, thmTp : tabFlag }, { $pull : { atstAtwrk : { atwrkID : { $in : atwrkId }}}});

        return res;
      } catch(e) {
        console.log(e);
        throw new Meteor.Error(
          500, 
          '서버 접속 오류가 발생하였습니다.  <br /> 잠수 후 다시 시도해주세요.'
        );
      }
    },
    // 특정 큐레이터 픽 작품 추가
    updateCuratorPick: function(query, update) {
      try {
        let res = Pick.update( { _id : query._id, thmTp : query.thmTp }, { $set :  { atstAtwrk : update }} );

        return res;
      }  catch(e) {
        console.log(e);
        throw new Meteor.Error(
          500, 
          '서버 접속 오류가 발생하였습니다.  <br /> 잠수 후 다시 시도해주세요.'
        );
      } 
    },
     // 갤러리 마이페이지 atwrkList
     glryAtwrkList: function(query, option) {
      try {
        let res = {};

        query._id = this.userId;

        var normal = { 'soldYn' : 'N', 'delYn' : 'N' };
        
        var sellTp = query.sellTp != undefined ? {'ogPrt.sellTp' : query.sellTp} : {};
        var bsnsid = { 'glry.bsnsID' : query._id };

        var atst = query.ATST != undefined ?
        { 'atstInfo.atstNm' : { $in : query.ATST } } : {};

        var kind = query.KIND != undefined ? query.KIND : {};
        var og = [];
        var dt = [];
        if(query.KIND != undefined) {
          for(i=0; i<kind.length; i++) {
            if(kind[i] == 'ogPrt') og.push('ogPrt');
            else if(kind[i] == 'dtPrt') dt.push('dtPrt');
          }
        }
        
        if(og.length > 0 && dt.length == 0) kind = {'ogPrt.atwrkNm' : { $exists: true }};
        else if(dt.length > 0 && og.length == 0) kind = {'dtPrt.atwrkNm' : { $exists: true }, 'ogPrt.atwrkNm' : { $exists: false }}
        else kind = {};

        var metRias = query.MATERIAL != undefined ?
        { 'ogPrt.metRias' : { $in : query.MATERIAL} } : {};
        
        var queryData = { $and : [ normal, sellTp, bsnsid, kind, atst, metRias ]};

        res.total = Atwrk.find(queryData).count();

        var options = []

        if(option.sort == undefined || option.sort == {}) options = { $skip : option.skip}, { $limit : option.limit};
        else options = { $sort : option.sort }, { $skip : option.skip}, { $limit : option.limit};

        res.list = Atwrk.aggregate([
          { $match : queryData },
          options
        ]);

        return res;
      } catch(e) {
        console.log(e);
        throw new Meteor.Error(
          500, 
          '서버 접속 오류가 발생하였습니다.  <br /> 잠수 후 다시 시도해주세요.'
        );
      } 
    },
    // 갤러리 마이페이지 Tab 변경시 조회
    seltTabAtwrk: function(query, option) {
      try {
        let res = {};

        query._id = this.userId;

        var normal = { 
          'ogPrt.selStrDt' : { $exists : true }, 
          'dtPrt.selStrDt' : { $exists : true },
          'soldYn' : 'N',
          'delYn' : 'N' 
         };
        
        var sellTp = query.sellTp != undefined ? {'ogPrt.sellTp' : query.sellTp} : {};
        var bsnsid = { 'glry.bsnsID' : query._id };

        var atst = query.ATST != undefined ?
        { 'atstInfo.atstNm' : { $in : query.ATST } } : {};

        var kind = query.KIND != undefined ? query.KIND : {};
        var og = [];
        var dt = [];
        if(query.KIND != undefined) {
          for(i=0; i<kind.length; i++) {
            if(kind[i] == 'ogPrt') og.push('ogPrt');
            else if(kind[i] == 'dtPrt') dt.push('dtPrt');
          }
        }
        
        if(og.length > 0 && dt.length == 0) kind = {'ogPrt.atwrkNm' : { $exists: true }};
        else if(dt.length > 0 && og.length == 0) kind = {'dtPrt.atwrkNm' : { $exists: true }, 'ogPrt.atwrkNm' : { $exists: false }}
        else kind = {};

        var metRias = query.MATERIAL != undefined ?
        { 'ogPrt.metRias' : { $in : query.MATERIAL} } : {};
        
        var queryData = { $and : [ sellTp, bsnsid, kind, atst, metRias, normal ]};

        res.total = Atwrk.find(queryData).count();

        var options = []

        if(option.sort == undefined || option.sort == {}) options = { $skip : option.skip}, { $limit : option.limit};
        else options = { $sort : option.sort }, { $skip : option.skip}, { $limit : option.limit};

        res.list = Atwrk.aggregate([
          { $match : queryData },
          {
            $addFields : {
              'str' : { $cond : [{ $ne : [ { $type :  "$ogPrt.selStrDt"}, 'missing' ] }, '$ogPrt.selStrDt', '$dtPrt.selStrDt'] },
              'end' : { $cond : [{ $ne : [ { $type :  "$ogPrt.selEndDt"}, 'missing' ] }, '$ogPrt.selEndDt', '$dtPrt.selEndDt'] },
            }
          },
          {
            $addFields : {
                "sortDateNum" : { $cond : [{ $ne : [ { $type : "$str" }, 'missing'] }, { $subtract : [ { $toDate : "$end"} , { $toDate : "$str"} ] },  '']},
            }
          },
          options
        ]);

        // res.total = Atwrk.find(queryData).count();
        // res.list = Atwrk.find(queryData, option).fetch();

        return res;
      } catch(e) {
        console.log(e);
        throw new Meteor.Error(
          500, 
          '서버 접속 오류가 발생하였습니다.  <br /> 잠수 후 다시 시도해주세요.'
        );
      } 
    },
    // Bsns 갤러리 사용자 작품 삭제
    deleteAtwrkForGlry: function(query) {
      try{
        // let res = Atwrk.remove(query);
        let res = Atwrk.update(query, { $set : { delYn : 'Y'}});
        let userId = this.userId;
        
        // 갤러리 대표 작품에서 삭제
        Meteor.users.update({_id : userId}, { $pull : { 'profile.uInfos.rprsnAtwrk' : { atwrkID : query._id }} });

        // 사용자 og좋아요 삭제
        Meteor.users.update({'profile.uInfos.ogPrtGood' : query._id}, { $pull : { 'profile.uInfos.ogPrtGood' : query._id }});

        // 사용자 dt좋아요 삭제
        Meteor.users.update({'profile.uInfos.dtPrtGood' : query._id}, { $pull : { 'profile.uInfos.dtPrtGood' : query._id }});

        // 사용자 ntcn 삭제
        Meteor.users.update({'profile.uInfos.ntcn' : query._id}, { $pull : { 'profile.uInfos.ntcn' : query._id }});

        // 사용자 cart삭제
        Meteor.users.update({'profile.uInfos.cart.atwrkId' : query._id}, { $pull : { 'profile.uInfos.cart.atwrkId' : query._id }});

        // 큐레이터 픽 에서 삭제
        Pick.update({'atstAtwrk.atwrkID' : query._id}, { $pull : { 'atstAtwrk.atwrkID' : query._id }});
        
        return res;
      } catch(e) {
        console.log(e);
        throw new Meteor.Error(
          500, 
          '서버 접속 오류가 발생하였습니다.  <br /> 잠수 후 다시 시도해주세요.'
        );
      } 
    },
    // Bsns 갤러리 사용자 작품 삭제
    updateAtwrkSellYn: function(query, data) {
      try{
        let res = Atwrk.update(query, { $set : { sellYn : data }});
        
        return res;
      } catch(e) {
        console.log(e);
        throw new Meteor.Error(
          500, 
          '서버 접속 오류가 발생하였습니다.  <br /> 잠수 후 다시 시도해주세요.'
        );
      } 
    },
    // 큐레이터 픽 저장
    savePick: function(thmTp, data) {
      try {
        let res = '';
        if(!data) {
          throw new Meteor.Error('입력 값이 없습니다.');
        }
        
        var findPick = Pick.findOne({ thmTp });

        if(data.image != undefined && data.image != '') {
          var tempDir = tempPath;
          var imageDir = imagesPath;

          var blob = Meteor.wrapAsync(fs.readFile)(tempDir + data.image);

          Meteor.wrapAsync(fs.writeFile)(imageDir + data.image, blob);

          data.url = "/images/" + data.image;
        }
        
        if(findPick != undefined) {
          var update = { $set : { } };

          if(data.image != undefined && data.image != '') update.$set.image = data.url;
          
          if(data.desc.trim() != '') update.$set.thmDesc = data.desc;
          
          if(data.title.trim() != '') update.$set.thmNm = data.title;

          Pick.update({ thmTp }, update );

        } else {
          var templePick = JSON.parse(Assets.getText('json/pick.json'));

          templePick._id = Meteor.commonUtils.generateUUID();
          templePick.thmDesc = data.desc;
          templePick.thmNm = data.title;
          templePick.image = data.url;

          Pick.insert(templePick);
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
    // 갤러리 별 이벤트 조회
    seltEvntsForGlry: function(bsnsId) {
      try {
        let res = Evnt.find({'glry.bsnsID' : bsnsId}).fetch();

        return res;
      } catch(e) {
        console.log(e);
        throw new Meteor.Error(
          500, 
          '서버 접속 오류가 발생하였습니다.  <br /> 잠수 후 다시 시도해주세요.'
        );
      } 
    },
    // 전시 및 작품 조회 업데이트용 단건 조회
    seltEvntDetail: function(evntId) {
      try {
        let res = Evnt.findOne({ _id : evntId });

        return res;
      } catch(e) {
        console.log(e);
        throw new Meteor.Error(
          500, 
          '서버 접속 오류가 발생하였습니다.  <br /> 잠수 후 다시 시도해주세요.'
        );
      } 
    },
    // 주문상세내역 조회
    seltOrderDetail: function(orderId) {
      try {
        let res = Order.findOne({ _id : orderId });

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


