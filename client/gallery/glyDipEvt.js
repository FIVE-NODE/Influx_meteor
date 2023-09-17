import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

import './glyDipEvt.html';

Template.glyDipEvt.onCreated(function() {
    // page 정보
    curPage = new ReactiveVar(1);
    skip = new ReactiveVar(0);
    limit = new ReactiveVar(15);
    total = new ReactiveVar(0);

    // 작품 정보
    atwrkInfo   = new ReactiveVar();

    // 아티스트 정보 리스트
    atstInfoList = new ReactiveVar();

    // 검색용 query
    filterQuery = new ReactiveVar();
    
    renderFlag = new ReactiveVar(false);

    evntInfo = new ReactiveVar({});

    query = {};

    // 왼쪽 조건문 query 및 페이징 쿼리
    options = {
        skip : skip.get(),
        limit: limit.get()
    };

    selectEvnt();
});

// DB 검색조건 수정 및 옵션 설정
function setQuery() {
    query = {};
    query = filterQuery.get();
    options = {
        skip : skip.get(),
        limit: limit.get()
    };
}

// 작품검색
function selectOrgAtwrk() {
    setQuery();
    Meteor.call('selectOrgAtwrk', query, function(err, res) {
        atwrkInfo.set(res.list);
        total.set(res.total);
    });
}

// 이벤트 검색
function selectEvnt() {
    var evntId = FlowRouter.getParam('_id');
    Meteor.call('selectEvntDetail', evntId, function(err, res) {
        evntInfo.set(res);
        var atwrkList = res.atstAtwrk;
        var atwrkIdList = [];
        for(idx in atwrkList) {
            atwrkIdList.push(atwrkList[idx].atwrkID);
        }

        filterQuery.set({EVNT_ATWRK_ID : atwrkIdList});

        atstInfoList.set(res.atstAtwrk);

        selectOrgAtwrk();
    });
}

// 선택해제 버튼 이벤트용 Func
function cancelCheckBox(name) {
    var input = $(`#artwork-${name} input`);
    input.prop('checked', false);
}

Template.glyDipEvt.onRendered(function() {
    renderFlag.set(true);
});

Template.glyDipEvt.events({
    // 작품 클릭시 이벤트
    'click a[name=atwrkDetail]'() {
        FlowRouter.go(`/atwrkDetail/${this._id}`);
    },
    // 작가 클릭 이벤트
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

        selectOrgAtwrk();
    },
    // 필터 이벤트
    'change input[name=filterChk]'(evt, tmpl) {
        var chked = $('input[name=filterChk]:checked');
        var dataList = [];
        var beforKind = '';
        var queryData = filterQuery.get();

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

        selectOrgAtwrk();
    },
    // 작품 선택해제
    'click button[name=atstAllDeSelect]'(evt, tmpl) {
        $('button[name=rprsnAtst]').removeClass('is-active');
    },
    // 전체 선택해제
    'click button[name=allCancel]'() {
        $('input[name=filterChk]').prop('checked', false);
        $('button[name=rprsnAtst]').removeClass('is-active');
    },
    'click button[name=priceCancelBtn]'() {
        cancelCheckBox('price');
    },
    'click button[name=mediumCancelBtn]'() {
        cancelCheckBox('medium');
    },
    'click button[name=mkyyCancelBtn]'() {
        cancelCheckBox('mkyy');
    },
    'click button[name=style1CancelBtn]'() {
        cancelCheckBox('style1');
    },
    'click button[name=style2CancelBtn]'() {
        cancelCheckBox('style2');
    },
    'click button[name=materialCancelBtn]'() {
        cancelCheckBox('material');
    },
    'click a[name=prev]'(evt, tmpl) {
        if(Meteor.clientCommonUtils.prevPage(curPage, total.get(), limit, skip));
        else selectOrgAtwrk();
    },
    'click a[name=next]'(evt, tmpl) {
        if(Meteor.clientCommonUtils.nextPage(curPage, total.get(), limit, skip)) ;
        else selectOrgAtwrk();
    },
    'click a[name=pageNum]'(evt, tmpl) {
        if(Meteor.clientCommonUtils.pageNum(curPage, skip, limit, this.num));
        else selectOrgAtwrk();
    }
});

Template.glyDipEvt.helpers({
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
        if(atstInfoList.get() != undefined) return atstInfoList.get();
    },
    evntInfo()  {
        if(evntInfo.get() != undefined) {
            return evntInfo.get();
        }
    },
    dateFormat(date) {
        if(date != undefined) {
            return Meteor.clientCommonUtils.dateFormatChg(date);
        }
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
