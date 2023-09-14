import './newEntryAtwrk.html';

import 'lazysizes';
import 'lazysizes/plugins/parent-fit/ls.parent-fit';

Template.newEntryAtwrk.onCreated(function() {
    // page 정보
    curPage = new ReactiveVar(1);
    skip = new ReactiveVar(0);
    limit = new ReactiveVar(2);
    total = new ReactiveVar(0);

    // 필터 정보
    filters = new ReactiveVar({});

    // sort 정보
    sortInfo = new ReactiveVar();

    atwrkInfo = new ReactiveVar();

    query = {
        newEntry : 'Y'
    };

    options = {
        skip : skip.get(),
        limit: limit.get()
    };

    Meteor.call('selectOrgAtwrk', query, options, function(err, res) {
        total.set(res.total);
        atwrkInfo.set(res.list);
    })
});

function selectOrgAtwrk() {
    Meteor.call('selectOrgAtwrk', query, options, function(err, res) {
        total.set(res.total);
        atwrkInfo.set(res.list);
    });
}

Template.newEntryAtwrk.onRendered(function()  {
});

// 선택해제 버튼 이벤트용 Func
function cancelCheckBox(name) {
    var input = $(`#artwork-${name} input`);
    input.prop('checked', false);
}

// DB 검색조건 수정 및 옵션 설정
function setQuery() {
    query = {};
    query = filters.get();
    query.newEntry = 'Y';
    options = {
        skip : skip.get(),
        limit: limit.get(),
        sort : sortInfo.get()
    };
}

// 스크롤 이동
function scrollMove() {
    var location = $('#move').offset().top;
    Meteor.commonUtils.scrollTop(location);
}

Template.newEntryAtwrk.events({
    'click button[name=allCancel]'(evt, tmpl) {
        $('input[name=filterChk]').prop('checked', false);
        seltSchFilters();
    },
    'click button[name=priceCancelBtn]'() {
        cancelCheckBox('price');
        seltSchFilters();
    },
    'click button[name=mediumCancelBtn]'() {
        cancelCheckBox('medium');
        seltSchFilters();
    },
    'click button[name=mkyyCancelBtn]'() {
        cancelCheckBox('mkyy');
        seltSchFilters();
    },
    'click button[name=style1CancelBtn]'() {
        cancelCheckBox('style1');
        seltSchFilters();
    },
    'click button[name=style2CancelBtn]'() {
        cancelCheckBox('style2');
        seltSchFilters();
    },
    'click button[name=materialCancelBtn]'() {
        cancelCheckBox('material');
        seltSchFilters();
    },
    // 정렬 이벤트
    'click button[name=sortList]'(evt, tmpl) {
        var sort = Meteor.clientCommonUtils.pageSort($(evt.currentTarget).val(), 'ogPrt');
        sortInfo.set(sort);
        setQuery();
        
        selectOrgAtwrk();
    },
    // 필터 이벤트
    'change input[name=filterChk]'(evt, tmpl) {
        seltSchFilters();
    },
    // 페이지
    'click a[name=prev]'(evt, tmpl) {
        if(Meteor.clientCommonUtils.prevPage(curPage, total.get(), limit, skip));
        else {
            setQuery();
            selectOrgAtwrk();
            scrollMove();
        }
    },
    'click a[name=next]'(evt, tmpl) {
        if(Meteor.clientCommonUtils.nextPage(curPage, total.get(), limit, skip)) ;
        else {
            setQuery();
            selectOrgAtwrk();
            scrollMove();
        }
    },
    'click a[name=pageNum]'(evt, tmpl) {
        if(Meteor.clientCommonUtils.pageNum(curPage, skip, limit, this.num));
        else {
            setQuery();
            selectOrgAtwrk();
            scrollMove();
        }
    }
});

function seltSchFilters() {
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

    filters.set(queryData);
    
    Meteor.clientCommonUtils.pageNum(curPage, skip, limit, 1);

    setQuery();
    selectOrgAtwrk();
}

Template.newEntryAtwrk.helpers({
    atwrkList() {
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
    priceOgPrt() {
        return Meteor.codes.ARTWORK_PRICE_OGPRT();
    },
    page() {
        let res = Meteor.clientCommonUtils.setPage(limit.get(), total.get());
        return res;
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
    }
});

