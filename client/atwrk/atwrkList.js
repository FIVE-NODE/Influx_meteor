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

    // 작품 정보
    atwrkInfo   = new ReactiveVar();

    // 검색한 정보
    schData =  new ReactiveVar();
    schData.set(JSON.parse(this.data.schQueryData()));

    // 검색으로 들어왔는지 여부 확인
    var flagChk = FlowRouter.getParam('_id');

    // 검색전용 작품리스트 
    this.selectSchForAtwrk = function(queryData) {
        Meteor.call('selectSchForAtwrk', queryData, query, function(err, res) {
            atwrkInfo.set(res.list);
            total.set(res.total);
            return res;
        });
    };

    if(flagChk != 'sch') {
        // 갤러리 리스트를 통해 들어왔을때
        this.data.glryDetail = new ReactiveVar();
        selectGlryDetail(this.data.glryDetail);
        selectAtwrkForBsns();
    } else {
        // 검색으로 들어 왔을때.
        // schQueryData 검색용 데이터
        this.selectSchForAtwrk(schData.get());
    }
    
    // 갤러리 정보 (특정 갤러리 작품 보기 전용)
    function selectGlryDetail(sample) {
        Meteor.call('selectGlryDetail', FlowRouter.getParam("_id"), function(err, res) {
            glryDetail.set(res);
            sample.set(res);
            return res;
        });
    };

    // 비즈니스에 등록되어 있는 작품 정보 (특정 갤러리 작품 보기 전용)  
    function selectAtwrkForBsns() {
        Meteor.call('selectAtwrkForBsns', FlowRouter.getParam("_id"), function(err, res) {
            atwrkInfo.set(res);
            return res;
        });
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
});

Template.atwrkList.events({
    'click a[name=atwrkDetail]'() {
        FlowRouter.go(`/atwrkDetail/${this._id}`);
    },
    'click span[name=appEntryInq]'() {
        
    },
    'click a[name=prev]'(evt, tmpl) {
        Meteor.clientCommonUtils.prevPage(curPage, total.get(), limit, skip);
        setQuery();
        tmpl.selectSchForAtwrk(schData.get());
        scrollMove();
    },
    'click a[name=next]'(evt, tmpl) {
        Meteor.clientCommonUtils.nextPage(curPage, total.get(), limit, skip);
        setQuery();
        tmpl.selectSchForAtwrk(schData.get());
        // selectSchForAtwrk(schData.get());
        scrollMove();
    },
    'click a[name=pageNum]'(evt, tmpl) {
        Meteor.clientCommonUtils.pageNum(curPage, skip, limit, this.num);
        setQuery();
        tmpl.selectSchForAtwrk(schData.get());
        scrollMove();
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
    
                resInfo._id = info[idx]._id;
                resInfo.pric = Meteor.commonUtils.priceComma(info[idx].ogPrt.pric);
                resInfo.atwrkNm = info[idx].ogPrt.atwrkNm;
                resInfo.ogPrt = info[idx].ogPrt.metRias;
                resInfo.wSize = info[idx].ogPrt.wSize;
                resInfo.hSize = info[idx].ogPrt.hSize;
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
    renderFlag() {
        return renderFlag.get();
    },
    page() {
        let res = Meteor.clientCommonUtils.setPage(limit.get(), total.get());
        return res;
    }
});