import { Meteor } from 'meteor/meteor';
import { Atwrk, Evnt } from '../lib/collections.js';

// 원화 는 원화만, 디지털 판화는 판화만 특정 카테고리만 조회 하는 서버로직

Meteor.methods({
    // 원화작품만 조회 (필터 조건 or 전부)
    selectOrgAtwrk: function(data, option) {
        try {
            let res = {};

            // 원화 작품 있는 것만 셋팅
            var normal = {
              'ogPrt.atwrkNm' : { $exists: true }
            };
            
            if(!(Object.keys(data).length === 0)) {
              // 필터 조건이 있을경우 해당하는 조건 만 AND 로 조회한다.

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

              var queryData = { $and : [ normal, price, medium, mkYear, style1, style2, metRias ] }

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
          'dtPrt.atwrkNm' : { $exists: true }
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
          'dtPrt.atwrkNm' : { $exists: true }
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

          var queryData = { $and : [ normal, sPrice, mPrice, lPrice, base, style1, style2 ] }

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
        var evntStrDay = moment(toDay).subtract(1, 'M').format('YYYYMMDD');
        toDay = moment(toDay).format('YYYYMMDD');

        option.sort = {
          'glry.glryNm' : 1
        };

        var normal = { strDt : { $gte : evntStrDay, $lte : toDay} };
        
        if(!(Object.keys(data).length === 0)) {
          
          var glryNm = data.glryNm != '' ?
          { 'glry.glryNm' : { $regex : data.glryNm }} : {};

          var kindCode = data.kindCode != '' ? 
          { evntTp : data.kindCode } : {};

          // 헤더의 검색으로 들어왔을 때만 사용하는 변수
          var areasSch = [];

          var areas = data.area
          var area = {};
          if(Array.isArray(areas)) {
            // 검색으로 리스트로 넘어 왔을때
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
          } else {
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
          
          var queryData = areasSch.length === 0 ? 
            { $and : [normal, glryNm, kindCode, area ] } :
            { $and : [normal, glryNm, kindCode ], $or : areasSch};

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
    }
});
