import { Template } from 'meteor/templating';

import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

import './ogCurator.html';

Template.ogCurator.onCreated(function() {
     // page 정보
     curPage = new ReactiveVar(1);
     skip = new ReactiveVar(0);
     limit = new ReactiveVar(3);
     total = new ReactiveVar(0);

    // 필터 정보
    filters = new ReactiveVar({});

    // sort 정보
    sortInfo = new ReactiveVar();

    ogCurData = new ReactiveVar();

    atwrkInfo = new ReactiveVar();

    atwrkIdList = new ReactiveVar();

    query = {};

    options = {
        skip : skip.get(),
        limit: limit.get()
    };

    if(this.data.schQueryData() != undefined)  {
        filters.set(JSON.parse(this.data.schQueryData()));
    }

    function seltCurOgList() {
        Meteor.call('selectPick', '001', function(err, res) {
            ogCurData.set(res);

            var atwrkList = res.atstAtwrk;
            var atwrkIds = [];
            for(idx in atwrkList) atwrkIds.push(atwrkList[idx].atwrkID);

            query = {
                atwrkIds
            };

            atwrkIdList.set(atwrkIds);
            selectOrgAtwrk();
        });
    }

    seltCurOgList();

});

function selectOrgAtwrk() {
    if(filters.get() != undefined) setQuery();
    Meteor.call('selectOrgAtwrk', query, options, function(err, res) {
        total.set(res.total);
        atwrkInfo.set(res.list);
    });
}

// 선택해제 버튼 이벤트용 Func
function cancelCheckBox(name) {
    var input = $(`#artwork-${name} input`);
    input.prop('checked', false);
}

// DB 검색조건 수정 및 옵션 설정
function setQuery() {
    query = {};
    query = filters.get();
    query.atwrkIds = atwrkIdList.get();
    options = {
        skip : skip.get(),
        limit: limit.get(),
        sort : sortInfo.get()
    };

    FlowRouter.go('/ogCurator', {}, { data : encodeURIComponent(JSON.stringify(query)) });
}

// 스크롤 이동
function scrollMove() {
    var location = $('#move').offset().top;
    Meteor.commonUtils.scrollTop(location);
}


Template.ogCurator.onRendered(function() {
});

Template.ogCurator.events({
    'click button[name=allCancel]'() {
        $('input[name=filterChk]').prop('checked', false);
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
    // 정렬 이벤트
    'click button[name=sortList]'(evt, tmpl) {
        var sort = Meteor.clientCommonUtils.pageSort($(evt.currentTarget).val(), 'ogPrt');
        sortInfo.set(sort);
        setQuery();
        
        selectOrgAtwrk();
    },
    // 필터 이벤트
    'change input[name=filterChk]'(evt, tmpl) {
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

Template.ogCurator.helpers({
    ogCurData() {
        return ogCurData.get();
    },
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
    },
    leftFilterChk(kind, code) {
        var selectCodes = filters.get()[kind];
        for(idx in selectCodes) {
            if(typeof selectCodes[idx] === 'object') {
                if(selectCodes[idx].code === code) {
                    return 'checked';
                }
            } else {
                if(selectCodes[idx] === code) {
                    return 'checked';
                }
            }
        }
    }
});
