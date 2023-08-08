import './curatorRegSch.html';

Template.curatorRegSch.onCreated(function() {
    // page 정보
    curPage = new ReactiveVar(1);
    skip = new ReactiveVar(0);
    limit = new ReactiveVar(10);
    total = new ReactiveVar(0);

    // 필터 정보
    filters = new ReactiveVar({});

    // sort 정보
    sortInfo = new ReactiveVar();

    // atwrkInfo
    atwrkInfo = new ReactiveVar();

    atstGlrySch = new ReactiveVar();

    query = {
        inAtwrkList : inAtwrkList.get()
    };

    options = {
        skip : skip.get(),
        limit: limit.get()
    };

    setTimeout(function() {
        query = {
            inAtwrkList : inAtwrkList.get()
        };
    
        if(tabFlag.get() == '002') seltAllDigAtwrk();
        else seltAllAtwrk();

    }, 585);
});

function seltAllAtwrk() {
    Meteor.call('selectOrgAtwrk', query, options, function(err, res) {
        atwrkInfo.set(res.list);
        total.set(res.total);
    });
}

function seltAllDigAtwrk() {
    Meteor.call('selectDigAtwrk', query, options, function(err, res) {
        atwrkInfo.set(res.list);
        total.set(res.total);
    });
}

Template.curatorRegSch.onRendered(function() {
});

Template.curatorRegSch.events({
    'change input[name=allSeltAtwrk]'(evt, tmpl) {
        // 전체 선택 및 해제
        if($(evt.currentTarget).is(':checked')) $('input[name=atwrkList]').prop('checked', true);
        else $('input[name=atwrkList]').prop('checked', false);
    },
    'click button[name=seltAllCancel]'(evt, tmpl) {
        // 전체 조건 해제
        $('input[name=filterPop]').prop('checked', false);
    },
    'click button[name=atwrksSchBtn]'(evt, tmpl) {
        atstGlrySch.set($('input[name=atstGlrySch]').val());

        Meteor.clientCommonUtils.pageNum(curPage, skip, limit, 1);

        setQuery();

        if(tabFlag.get() == '002') seltAllDigAtwrk();
        else seltAllAtwrk();
    },
    // 필터 이벤트
    'change input[name=filterPop]'(evt, tmpl) {
        var chked = $('input[name=filterPop]:checked');
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

        if(tabFlag.get() == '002') seltAllDigAtwrk();
        else seltAllAtwrk();

        $(`#${tabFlag.get()}`).addClass('is-active');
    },
    // 페이지
    'click a[name=prev]'(evt, tmpl) {
        if(Meteor.clientCommonUtils.prevPage(curPage, total.get(), limit, skip));
        else {
            setQuery();
            if(tabFlag.get() == '002') seltAllDigAtwrk();
            else seltAllAtwrk();            
        }
    },
    'click a[name=next]'(evt, tmpl) {
        if(Meteor.clientCommonUtils.nextPage(curPage, total.get(), limit, skip)) ;
        else {
            setQuery();
            if(tabFlag.get() == '002') seltAllDigAtwrk();
            else seltAllAtwrk();
        }
    },
    'click a[name=pageNum]'(evt, tmpl) {
        if(Meteor.clientCommonUtils.pageNum(curPage, skip, limit, this.num));
        else {
            setQuery();
            if(tabFlag.get() == '002') seltAllDigAtwrk();
            else seltAllAtwrk();
        }
    },
    'click button[name=atwrkUp]'(evt, tmpl) {
        var seltAtwrkList =  $('input[name=atwrkList]:checked');
        var atwrkList =  inAtwrkList.get();

        var atwrkInfoList = atwrkInfo.get();

        var newAtwrkInfo = pickData.get().atstAtwrk;

        for(i=0; i<seltAtwrkList.length; i++) {
            var atwrkID = $(seltAtwrkList[i]).attr('id');
            atwrkList.push(atwrkID);
            for(idx in atwrkInfoList) {
                if(atwrkInfoList[idx]._id == atwrkID) {
                    var info = atwrkInfoList[idx];

                    var atFlag = tabFlag.get() == '002' ? 'dtPrt' : 'ogPrt';

                    var setData = {
                        atwrkID : info._id,
                        testImage : info.image.filter(e => e.rprsn == 'Y')[0].imgID,
                        image : "",
                        atwrkNm : info[atFlag].atwrkNm,
                        atstNm : info.atstInfo.atstNm,
                        mkYY : info[atFlag].mkYY,
                        mkDt : info[atFlag].mkDt,
                        atwrkDesc : info[atFlag].atwrkDesc,
                        base : info[atFlag].base,
                        metRias : info[atFlag].metRias,
                        style1 : info[atFlag].style1,
                        style2 : info[atFlag].style2,
                        pric : info[atFlag].pric != undefined ? info[atFlag].pric : info[atFlag].sPric,
                        sellTp : info[atFlag].sellTp,
                        strDt : info[atFlag].selStrDt,
                        endDt : info[atFlag].selEndDt,
                        wSize : info[atFlag].wSize,
                        hSize : info[atFlag].hSize,
                        glryNm : info.glry.glryNm
                    };
                    
                    newAtwrkInfo.push(setData);
                } else continue;
            }
        }

        var queryData = {
            _id : pickData.get()._id,
            thmTp : tabFlag.get()
        }

        Meteor.call('updateCuratorPick', queryData, newAtwrkInfo, function(err, res) {
            if(tabFlag.get() == '002') seltAllDigAtwrk();
            else seltAllAtwrk();

            tmpl.data.seltPickSch();

            $(`#${tabFlag.get()}`).addClass('is-active');
        });

    }

});

// DB 검색조건 수정 및 옵션 설정
function setQuery() {
    query = {};
    query = filters.get();
    query.inAtwrkList = inAtwrkList.get();
    query.atstGlrySch = atstGlrySch.get() != undefined ? atstGlrySch.get() : undefined;
    options = {
        skip : skip.get(),
        limit: limit.get(),
        sort : sortInfo.get()
    };

    $(`#${tabFlag.get()}`).addClass('is-active');
    $('#pageNum1').addClass('is-active');
}

function callServer() {

}

Template.curatorRegSch.helpers({
    tabFlag() {
        setQuery();
        if(tabFlag.get() == '002') seltAllDigAtwrk();
        else seltAllAtwrk();
        return tabFlag.get();
    },
    dtChk() {
        return tabFlag.get() == '002' ? false : true;
    },
    atwrkInfo() {
        if(atwrkInfo.get() != undefined) {
            let resData = [];
            var atwrk = atwrkInfo.get();
            
            var flag = tabFlag.get() == '002' ? 'dtPrt' : 'ogPrt';
            
            for(idx in atwrk) {
                let res = {};
                res._id = atwrk[idx]._id;
                res.image = atwrk[idx].image;
                res.atwrkNm = atwrk[idx][flag].atwrkNm;
                res.atstNm = atwrk[idx].atstInfo.atstNm;
                res.mkDt = atwrk[idx][flag].mkDt;
                res.pric = flag == 'dtPrt' ? atwrk[idx][flag].sPric : atwrk[idx][flag].pric;
                res.stDt = atwrk[idx][flag].selStrDt == undefined ? '' : atwrk[idx][flag].selStrDt;
                res.edDt = atwrk[idx][flag].selEndDt == undefined ? '' : atwrk[idx][flag].selEndDt;
                res.sellTp = Meteor.codes.SELL_TYPE(atwrk[idx][flag].sellTp);
                res.glryNm = atwrk[idx].glry.glryNm;

                resData.push(res);
            }
            
            return resData;
        }
    },
    pageFirstChk(index) {
        return index == 0 ? true : false;
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
    pricedtPrt() {
        return Meteor.codes.ARTWORK_PRICE_DTPRT();
    },
    base() {
        return Meteor.codes.BASE();
    }
});

