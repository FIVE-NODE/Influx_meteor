import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

import './atwrkList.html';

Template.atwrkList.onCreated(function() {
    // page 정보
    curPage = new ReactiveVar(1);
    skip = new ReactiveVar(0);
    limit = new ReactiveVar(4);
    total = new ReactiveVar(0);

    // 화면 렌더 조건
    renderFlag = new ReactiveVar(false);
    
    // 갤러리 정보
    glryDetail  = new ReactiveVar();

    // 갤러리 전시/행사 정보
    glryEvtInfo = new ReactiveVar();

    // 작품 정보
    atwrkInfo   = new ReactiveVar();

    // 아티스트 정보 리스트
    atstInfoList = new ReactiveVar();

    // 검색용 query
    filterQuery = new ReactiveVar();

    query = {};

    // 왼쪽 조건문 query 및 페이징 쿼리
    options = {
        skip : skip.get(),
        limit: limit.get()
    };

     // 갤러리 정보 (특정 갤러리 작품 보기 전용)
     this.selectGlryDetail = function() {
        Meteor.call('selectGlryDetail', FlowRouter.getParam("_id"), function(err, res) {
            glryDetail.set(res);
            atstInfoList.set(res.rprsnAtst);
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
        Meteor.call('selectAtwrkForBsns', FlowRouter.getParam("_id"), query, options , function(err, res) {
            atwrkInfo.set(res.list);
            total.set(res.total);
            return res;
        });
    }

    this.selectGlryDetail();
    this.selectEvntHome();
    this.selectAtwrkForBsns();
    
});

// 선택해제 버튼 이벤트용 Func
function cancelCheckBox(name) {
    var input = $(`#artwork-${name} input`);
    input.prop('checked', false);
}

// DB 검색조건 수정 및 옵션 설정
function setQuery() {
    query = filterQuery.get();
    options = {
        skip : skip.get(),
        limit: limit.get()
    };
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
    'click button[name=rprsnAtst]'(evt, tmpl) {
        var tar = $(evt.target);
        if(tar.hasClass('is-active')) {
            tar.removeClass('is-active');
        } else {
            tar.addClass('is-active');
        }

        var atsts = $('button[name=rprsnAtst]');
            
        var atstList = [];
        $.each(atsts, function(idx, val) {
            if($(val).hasClass('is-active')) {
                atstList.push(val.value);
            }
        });

        var filterList = filterQuery.get() != undefined ? filterQuery.get() : {};
        if(atstList.length > 0) {
            filterList.ATSTNM = atstList;
            filterQuery.set(filterList);
        } else {
            delete filterList.ATSTNM;
            filterQuery.set(filterList);
        }

        setQuery();

        tmpl.selectAtwrkForBsns();
    },
    'click button[name=atstAllDeSelect]'(evt, tmpl) {
        $('button[name=rprsnAtst]').removeClass('is-active');

        filterSchFunc();
        tmpl.selectAtwrkForBsns();
    },
    'click button[name=allCancel]'(evt, tmpl) {
        $('input[name=filterChk]').prop('checked', false);
        $('button[name=rprsnAtst]').removeClass('is-active');

        filterSchFunc();
        tmpl.selectAtwrkForBsns();
    },
    'click button[name=priceCancelBtn]'(evt, tmpl) {
        cancelCheckBox('price');

        filterSchFunc();
        tmpl.selectAtwrkForBsns();
    },
    'click button[name=mediumCancelBtn]'(evt, tmpl) {
        cancelCheckBox('medium');

        filterSchFunc();
        tmpl.selectAtwrkForBsns();
    },
    'click button[name=mkyyCancelBtn]'(evt, tmpl) {
        cancelCheckBox('mkyy');

        filterSchFunc();
        tmpl.selectAtwrkForBsns();
    },
    'click button[name=style1CancelBtn]'(evt, tmpl) {
        cancelCheckBox('style1');

        filterSchFunc();
        tmpl.selectAtwrkForBsns();
    },
    'click button[name=style2CancelBtn]'(evt, tmpl) {
        cancelCheckBox('style2');

        filterSchFunc();
        tmpl.selectAtwrkForBsns();
    },
    'click button[name=materialCancelBtn]'(evt, tmpl) {
        cancelCheckBox('material');

        filterSchFunc();
        tmpl.selectAtwrkForBsns();
    },
    // 필터 이벤트
    'change input[name=filterChk]'(evt, tmpl) {
        filterSchFunc();
        tmpl.selectAtwrkForBsns();
    },
    'click a[name=prev]'(evt, tmpl) {
        if(Meteor.clientCommonUtils.prevPage(curPage, total.get(), limit, skip));
        else {
            setQuery();
            tmpl.selectAtwrkForBsns();
            scrollMove();
        }
    },
    'click a[name=next]'(evt, tmpl) {
        if(Meteor.clientCommonUtils.nextPage(curPage, total.get(), limit, skip)) ;
        else {
            setQuery();
            tmpl.selectAtwrkForBsns();
            scrollMove();
        }
    },
    'click a[name=pageNum]'(evt, tmpl) {
        if(Meteor.clientCommonUtils.pageNum(curPage, skip, limit, this.num));
        else {
            setQuery();
            tmpl.selectAtwrkForBsns();
            scrollMove();
        }
    }
});

function filterSchFunc() {
    var chked = $('input[name=filterChk]:checked');
    var dataList = [];
    var beforKind = '';
    var queryData = {};

    for(var i=0; i < chked.length; i++) {
        var splitVal = chked[i].value.split('-');
        var kind = splitVal[0];
        var code = splitVal[1];
        var codeData = Meteor.clientCommonUtils.dataSet(kind, code);

        if(beforKind != kind && beforKind != '') {
            queryData[beforKind] = dataList;
            dataList = [];
        }

        dataList.push(codeData);

        beforKind = kind;

        if(i === (chked.length -1)) queryData[beforKind] = dataList;
    }

    filterQuery.set(queryData);

    Meteor.clientCommonUtils.pageNum(curPage, skip, limit, 1);

    setQuery();
}

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
    rprsnAtst() {
        var res = false;

        if(atstInfoList.get() != undefined) res = atstInfoList.get().length != 0 ? atstInfoList.get() : false;

        return res;
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
    priceOgPrt() {
        return Meteor.codes.ARTWORK_PRICE_OGPRT();
    },
    medium() {
        return Meteor.codes.MEDIUM();
    },
    mkyy() {
        return Meteor.codes.MK_YEAR();
    },
    style1() {
        return Meteor.codes.STYLE_1();
    },
    style2() {
        return Meteor.codes.STYLE_2();
    },
    materials() {
        return Meteor.codes.MATERIAL();
    },
    page() {
        let res = Meteor.clientCommonUtils.setPage(limit.get(), total.get());
        return res;
    }
});