import './digitalAtwrk.html';

Template.digitalAtwrk.onCreated(function() {
    // page 정보
    curPage = new ReactiveVar(1);
    skip = new ReactiveVar(0);
    limit = new ReactiveVar(10);
    total = new ReactiveVar(0);

    hotAtwrkInfo = new ReactiveVar();

    atwrkInfo = new ReactiveVar();

    // 필터 정보
    filters = new ReactiveVar({});

    // sort 정보
    sortInfo = new ReactiveVar();

    if(this.data.schQueryData() != undefined)  {
        filters.set(JSON.parse(this.data.schQueryData()));
    }

    query = {};

    options = {
        skip : skip.get(),
        limit: limit.get()
    };

    this.selectDigAtwrk = function() {
        if(filters.get() != undefined) setQuery();

        Meteor.call('selectDigAtwrk', query, options, function(err, res) {
            total.set(res.total);
            atwrkInfo.set(res.list);
        });
    };

    this.selectDigHotAtwrk = function() {
        Meteor.call('selectDigHotAtwrk', {}, function(err, res) {
            hotAtwrkInfo.set(res);
        });
    }

    
    this.selectDigHotAtwrk();
    
    this.selectDigAtwrk();
});

Template.digitalAtwrk.onRendered(function() {    
});

Template.digitalAtwrk.events({
    'click button[name=allCancel]'() {
        $('input[name=filterChk]').prop('checked', false);
    },
    'click button[name=priceCancelBtn]'() {
        cancelCheckBox('price');
    },
    'click button[name=baseCancelBtn]'() {
        cancelCheckBox('base');
    },
    'click button[name=style1CancelBtn]'() {
        cancelCheckBox('style1');
    },
    'click button[name=style2CancelBtn]'() {
        cancelCheckBox('style2');
    },
    // 정렬 이벤트
    'click button[name=sortList]'(evt, tmpl) {
        var sort = Meteor.clientCommonUtils.pageSort($(evt.currentTarget).val(), 'dtPrt');
        sortInfo.set(sort);
        setQuery();
        tmpl.selectDigAtwrk();
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
        tmpl.selectDigAtwrk();        
    },
    // 페이지
    'click a[name=prev]'(evt, tmpl) {
        if(Meteor.clientCommonUtils.prevPage(curPage, total.get(), limit, skip));
        else {
            setQuery();
            tmpl.selectDigAtwrk();
            scrollMove();
        }
    },
    'click a[name=next]'(evt, tmpl) {
        if(Meteor.clientCommonUtils.nextPage(curPage, total.get(), limit, skip)) ;
        else {
            setQuery();
            tmpl.selectDigAtwrk();
            scrollMove();
        }
    },
    'click a[name=pageNum]'(evt, tmpl) {
        if(Meteor.clientCommonUtils.pageNum(curPage, skip, limit, this.num));
        else {
            setQuery();
            tmpl.selectDigAtwrk();
            scrollMove();
        }
    }
});

// 선택해제 버튼 이벤트용 Func
function cancelCheckBox(name) {
    var input = $(`#artwork-${name} input`);
    input.prop('checked', false);
}

// DB 검색조건 수정 및 옵션 설정
function setQuery() {
    query = filters.get();
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

Template.digitalAtwrk.helpers({
    hotAtwrk() {
        return hotAtwrkInfo.get();
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

                prtFlag ='dtPrt';
                pricFlag = prtFlag === 'ogPrt' ? 'pric' : 'sPric';

                resInfo._id = info[idx]._id;
                resInfo.pric = info[idx][prtFlag][pricFlag];
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
    imgChk(info) {
        return info.rprsn === 'Y';
    },
    page() {
        let res = Meteor.clientCommonUtils.setPage(limit.get(), total.get());
        return res;
    },
    pricedtPrt() {
        return Meteor.codes.ARTWORK_PRICE_DTPRT();
    },
    base() {
        return Meteor.codes.BASE();
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
 