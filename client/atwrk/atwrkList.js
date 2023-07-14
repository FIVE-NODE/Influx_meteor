import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

import './atwrkList.html';

Template.atwrkList.onCreated(function() {

    // page 정보
    curPage = new ReactiveVar(1);
    skip = new ReactiveVar(0);
    limit = new ReactiveVar(4);
    total = new ReactiveVar(0);
    
    // 왼쪽 조건문 query 및 페이징 쿼리
    query = {
        skip : skip.get(),
        limit: limit.get()
    };

    // 화면 렌더 조건
    renderFlag = new ReactiveVar(false);
    
    // 갤러리 정보
    glryDetail  = new ReactiveVar();

    // 갤러리 전시/행사 정보
    glryEvtInfo = new ReactiveVar();

    // 작품 정보
    atwrkInfo   = new ReactiveVar();

    // 왼쪽 필터링 정보 저장용
    this.data.filterQuery = new ReactiveVar({});

    // 검색으로 들어왔는지 여부 확인
    flagChk = new ReactiveVar(FlowRouter.getParam('_id'));

    // 검색한 정보
    if(flagChk.get() === 'sch') {
        this.data.schData =  new ReactiveVar(JSON.parse(this.data.schQueryData()));
    }

    // 아티스트 정보 리스트
    this.data.atstInfoList = ReactiveVar();

    // 검색전용 작품리스트 
    this.selectSchForAtwrk = function(schQueryData, atstInfoList) {
        Meteor.call('selectSchForAtwrk', schQueryData, query, function(err, res) {
            var resList = res.list;
            var atstList = [];
            resList.forEach(function(map) {
                // map['ogPrt']['pric'] = Meteor.commonUtils.priceComma(map['ogPrt']['pric']);
                // clientSchAtwrk.insert(map);
                atstList.push(map.atstInfo.atstNm);
            });

             // 아티스트 정보
            if(atstInfoList != undefined) atstInfoList.set([... new Set(atstList)]);

            atwrkInfo.set(res.list);    // 작품 정보

            total.set(res.total);       // 검색한 총 갯수
            return res;
        });
    };

     // 갤러리 정보 (특정 갤러리 작품 보기 전용)
     this.selectGlryDetail = function(atstInfoList) {
        Meteor.call('selectGlryDetail', FlowRouter.getParam("_id"), function(err, res) {
            glryDetail.set(res);
            atstInfoList.set(res);
            return res;
        });
    };

    // 갤러리 전시/행상 이벤트 관련 정보
    this.selectEvntHome = function() {
        Meteor.call('selectEvntHome', FlowRouter.getParam("_id"), function(err, res) {
            glryEvtInfo.set(res);
            return res;
        });
    }

    // 비즈니스에 등록되어 있는 작품 정보 (특정 갤러리 작품 보기 전용)  
    this.selectAtwrkForBsns = function() {
        Meteor.call('selectAtwrkForBsns', FlowRouter.getParam("_id"), query , function(err, res) {
            atwrkInfo.set(res.list);
            total.set(res.total);
            return res;
        });
    }

    if(flagChk.get() != 'sch') {
        // 갤러리 리스트를 통해 들어왔을때
        this.data.atstInfoList = new ReactiveVar();
        this.selectGlryDetail(this.data.atstInfoList);
        this.selectEvntHome();
        this.selectAtwrkForBsns();
    } else {
        // 검색으로 들어 왔을때.
        // schQueryData 검색용 데이터
        this.selectSchForAtwrk(this.data.schData.get(), this.data.atstInfoList);
    }
});

// DB 검색조건 수정 및 옵션 설정
function setQuery() {
    query = {
        skip : skip.get(),
        limit: limit.get()
    };

    return query;
}

// 스크롤 이동
function scrollMove() {
    var location = $('#move').offset().top;
    Meteor.commonUtils.scrollTop(location);
}

Template.atwrkList.onRendered(function() {
    // 랜더링 완료 후 화면 보여지게 설정
    renderFlag.set(true);

    setTimeout(function() {
        var location = $('#headerPs').offset().top;
        Meteor.commonUtils.scrollTop(location);
    }, 50);
});

Template.atwrkList.events({
    'click a[name=atwrkDetail]'() {
        FlowRouter.go(`/atwrkDetail/${this._id}`);
    },
    'click span[name=appEntryInq]'() {
        
    },
    'click a[name=prev]'(evt, tmpl) {
        if(Meteor.clientCommonUtils.prevPage(curPage, total.get(), limit, skip));
        else {
            setQuery();
            if(flagChk === 'sch') tmpl.selectSchForAtwrk(tmpl.data.schData.get());
            else tmpl.selectAtwrkForBsns();
            scrollMove();
        }
    },
    'click a[name=next]'(evt, tmpl) {
        if(Meteor.clientCommonUtils.nextPage(curPage, total.get(), limit, skip)) ;
        else {
            setQuery();
            if(flagChk === 'sch') tmpl.selectSchForAtwrk(tmpl.data.schData.get());
            else tmpl.selectAtwrkForBsns();
            scrollMove();
        }
    },
    'click a[name=pageNum]'(evt, tmpl) {
        if(Meteor.clientCommonUtils.pageNum(curPage, skip, limit, this.num));
        else {
            setQuery();
            if(flagChk === 'sch') tmpl.selectSchForAtwrk(tmpl.data.schData.get());
            else tmpl.selectAtwrkForBsns();
            scrollMove();
        }
    }
});

Template.atwrkList.helpers({
    atwrk() {
        var res = [];
        
        if(atwrkInfo.get() != undefined) {
            var info = atwrkInfo.get();

            for(idx in info) {
                var resInfo = {};
                var images = info[idx].image;
    
                for(dx in images) {
                    if(images[dx].rprsn === 'Y'){
                        resInfo.imgInfo = images[dx];
                    }
                }

                var prtFlag = '';
                var pricFlag = 'pric';

                prtFlag = Object.keys(info[idx].ogPrt).includes('atwrkNm') ? 'ogPrt' : 'dtPrt'
                pricFlag = prtFlag === 'ogPrt' ? 'pric' : 'mPric';

                resInfo._id = info[idx]._id;
                resInfo.pric = Meteor.commonUtils.priceComma(info[idx][prtFlag][pricFlag]);
                resInfo.atwrkNm = info[idx][prtFlag].atwrkNm;
                resInfo[prtFlag] = info[idx][prtFlag].metRias;
                resInfo.wSize = info[idx][prtFlag].wSize;
                resInfo.hSize = info[idx][prtFlag].hSize;
                resInfo.atstNm = info[idx].atstInfo.atstNm;
                resInfo.glryNm = info[idx].glry.glryNm;
    
                res.push(resInfo);
            }
        }

        return res.length === 0 ? false : res;
    },
    details() {
        var res = false;

        if(glryDetail.get() != undefined) res = glryDetail.get();

        return res;
    },
    glryEvtInfo() {
        var res = false;

        if(glryEvtInfo.get() != undefined) res = glryEvtInfo.get();

        return res;
    },
    renderFlag() {
        return renderFlag.get(); 
    },
    page() {
        let res = Meteor.clientCommonUtils.setPage(limit.get(), total.get());
        return res;
    },
    dateFormat(date) {
        return Meteor.clientCommonUtils.dateFormatChg(date);
    }
});