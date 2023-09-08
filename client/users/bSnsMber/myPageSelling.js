import './myPageSelling.html';

import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

Template.myPageSelling.onCreated(function() {
    // page 정보
    curPage = new ReactiveVar(1);
    skip = new ReactiveVar(0);
    limit = new ReactiveVar(15);
    total = new ReactiveVar(0);

    query = {};

    options = {
        skip : skip.get(),
        limit: limit.get()
    };

    // 사용자 정보
    uInfo = new ReactiveVar();

    // 정렬
    sortInfo = new ReactiveVar();

    // 필터 정보
    filters = new ReactiveVar({});

    // 000 : 판매작품전체, 001: 정찰가, 003: 정찰가(가격흥정허용), 002: 비딩(옥션), 004: 구입문의
    tabFlag = new ReactiveVar('000');

    // 작품정보 리스트
    atwrkInfo = new ReactiveVar();

    // 삭제할 작품 _id
    delId = new ReactiveVar();

    this.autorun(() => {
        const userData = Meteor.user();
        if(userData != undefined && uInfo.get() == undefined) {
            uInfo.set(userData.profile.uInfos);
            seltTabAtwrk();
        }
    });
});

function seltTabAtwrk() {
    Meteor.call('seltTabAtwrk', query, options, function(err, res) {
        total.set(res.total);
        // const moment = require('moment'); require('moment-timezone');
        // const t1 = moment('20000201');
        // const t2 = moment('20000301');
        // console.log(moment.duration(t2.diff(t1)).asDays());
        atwrkInfo.set(res.list);
    });
}

function setQuery() {
    query = {};
    query = filters.get();
    if(tabFlag.get() != '000') query.sellTp = tabFlag.get();
    else delete query.sellTp;

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

Template.myPageSelling.onRendered(function() {
    
});

Template.myPageSelling.events({
    'change input[name=allChkBox]'(evt, tmpl) {
        // 작품 전체 선택
        var curChk = $(evt.currentTarget).is(':checked');

        if(curChk) $('input[name=atwrkChkBox]').prop('checked', true);
        else $('input[name=atwrkChkBox]').prop('checked', false);
    },
    'click a[name=tabMenu]'(evt, tmpl) {
        var sellTp = $(evt.currentTarget).attr('id');
        $('a[name=tabMenu].is-active').removeClass('is-active');
        $(evt.currentTarget).addClass('is-active');
        tabFlag.set(sellTp);

        setQuery();

        seltTabAtwrk();
    },
    'change input[name=sellChgYn]'(evt, tmpl) {
        var idVal = $(evt.currentTarget).val();
        var chk = $(evt.currentTarget).is(':checked');

        if(chk) chk = 'Y';
        else    chk = 'N';
        
        Meteor.call('updateAtwrkSellYn', idVal, chk);
    },    
    // 작품 선택 전체해제
    'click button[name=atwrkAllCancel]'(evt, tmpl) {
        $('input[name=atwrkChkBox]').prop('checked', false);
        if($('input[name=allChkBox]').is(':checked')) $('input[name=allChkBox]').prop('checked', false);
    },
    // 메뉴 전체선택해제
    'click button[name=menuAllCancel]'(evt, tmpl) {
        filters.set({});
        $('input[name=menuSchChk]:checked').prop('checked', false);
    },
    //page 갯수 변경
    'click button[name=setPageNum]'(evt, tmpl) {
        limit.set(parseInt($(evt.currentTarget).val()));
        setQuery();
        seltTabAtwrk();
    },
    // 선택항목 일괄 삭제
    'click button[name=seltDelAtwrk]'(evt, tmpl) {
        var atwrChkList = $('input[name=atwrkChkBox]:checked');

        if(atwrChkList.length > 0) {
            var atwrkIdList = [];
            for(i=0; i<atwrChkList.length; i++) {
                atwrkIdList.push(atwrChkList[i].value);
            }

            delId.set(atwrkIdList);

            $('#del_confirm_popup').addClass('is-open');
        } else alert('선택된 작품이 없습니다.');
    },
    // 작품 삭제 버튼
    'click button[name=delBtn]'(evt, tmpl) {
        var atwrkId = $(evt.currentTarget).val();

        delId.set(atwrkId);

        $('#del_confirm_popup').addClass('is-open');
    },
    // 작품삭제 컨펌 삭제 버튼 이벤트
    'click button[name=delConfirmBtn]'(evt, tmpl) {
        var querySet = {};

        if(Array.isArray(delId.get())) querySet = { _id : { $in : delId.get() } };
        else querySet = { _id : delId.get() };

        Meteor.call('deleteAtwrkForGlry', querySet, function(err, res) {
            if(err) {
            } else {
                setQuery();
                seltTabAtwrk();
            }
        });

        $('#del_confirm_popup').removeClass('is-open');
    },
    // 상단 메뉴 검색 버튼 이벤트
    'click button[name=menuSchBtn]'(evt, tmpl) {
        var schList = $('input[name=menuSchChk]:checked');
        
        var schSet = {};
        var dataList = [];
        var beforKind = '';

        for(i=0; i<schList.length; i++) {
            var splitVal = schList[i].value.split('-');
            var kind = splitVal[0];
            var code = splitVal[1];

            if(beforKind != kind && beforKind != '') {
                schSet[beforKind] = dataList;
                dataList = [];
            }

            dataList.push(code);

            beforKind = kind;

            if(i === (schList.length -1)) schSet[beforKind] = dataList;
        }

        filters.set(schSet);

        Meteor.clientCommonUtils.pageNum(curPage, skip, limit, 1);

        setQuery();
        
        seltTabAtwrk();

        $(`#${tabFlag.get()}`).addClass('is-active');
    },
    'click button[name=atwrkSort]'(evt, tmpl) {
        var targetVal = $(evt.currentTarget).val();
        var sort = Meteor.clientCommonUtils.adSellingPageSort(targetVal);
        sortInfo.set(sort);

        setQuery();
        seltTabAtwrk();
    },
    'click button[name=inventBtn]'(evt, tmpl) {
        FlowRouter.go('/inventoryMode');
    },
     // 페이지
    'click a[name=prev]'(evt, tmpl) {
        if(Meteor.clientCommonUtils.prevPage(curPage, total.get(), limit, skip));
        else {
            setQuery();
            seltTabAtwrk();
            scrollMove();
        }
    },
    'click a[name=next]'(evt, tmpl) {
        if(Meteor.clientCommonUtils.nextPage(curPage, total.get(), limit, skip)) ;
        else {
            setQuery();
            seltTabAtwrk();
            scrollMove();
        }
    },
    'click a[name=pageNum]'(evt, tmpl) {
        if(Meteor.clientCommonUtils.pageNum(curPage, skip, limit, this.num));
        else {
            setQuery();
            seltTabAtwrk();
            scrollMove();
        }
    }

});

Template.myPageSelling.helpers({
    tableSizeSet() {
        return tableSizeSet();
    },
    tableHeader() {
        return tableHeaderSet();
    },
    tableInfo() {
        if(atwrkInfo.get() != undefined) {
            return atwrkInfo.get();
        }
    },
    tableDesc(data) {
        if(atwrkInfo.get() != undefined) {
           return tdDataSet(data);
        }
    },
    page() {
        let res = Meteor.clientCommonUtils.setPage(limit.get(), total.get());
        return res;
    },
    sellChk(data) {
        return data.sellYn == 'Y' ? 'checked' : '';
    },
    atwrkNmOgDtChk(data) {
        return data.ogPrt.atwrkNm != undefined ? data.ogPrt.atwrkNm : data.dtPrt.atwrkNm;
    },
    pageHeaderCount() {
        if(atwrkInfo.get() != undefined) {
            let res = {};
            res.total = total.get();
            res.selling = (atwrkInfo.get().filter(e => e.sellYn == 'Y')).length;
            res.notSelling = (res.total - res.selling);

            return res;
        }
    },
    glryAtstList() {
        if(atwrkInfo.get() != undefined) {
            let res = uInfo.get().rprsnAtst;
            return res;
        }
    },
    materials() {
        return Meteor.codes.MATERIAL();
    },
    atwrkDtpChk() {
        return this.ogPrt.atwrkNm != undefined ? true : false;
    }
});


function tableSizeSet() {
    switch(tabFlag.get()) {
        case '000':
            return `
                <col style="width:5%">
                <col style="width:auto">
                <col style="width:8%">
                <col style="width:8%">
                <col style="width:10%">
                <col style="width:10%">
                <col style="width:8%">
                <col style="width:13%">
                <col style="width:8%">
                <col style="width:5%">
            `;
        case '002':
            return `
                <col style="width:5%">
                <col style="width:auto">
                <col style="width:8%">
                <col style="width:5%">
                <col style="width:10%">
                <col style="width:10%">
                <col style="width:10%">
                <col style="width:5%">
                <col style="width:15%">
                <col style="width:8%">
                <col style="width:5%">
            `;
        case '003':
            return `
            <col style="width:5%">
            <col style="width:auto">
            <col style="width:8%">
            <col style="width:8%">
            <col style="width:10%">
            <col style="width:10%">
            <col style="width:8%">
            <col style="width:13%">
            <col style="width:8%">
            <col style="width:5%">
        `;
        default:
            return `
                <col style="width:5%">
                <col style="width:auto">
                <col style="width:10%">
                <col style="width:10%">
                <col style="width:12%">
                <col style="width:12%">
                <col style="width:15%">
                <col style="width:10%">
                <col style="width:5%">
            `;
    }
}

function tableHeaderSet() {
    switch(tabFlag.get()) {
        case '000':
            return `
                <th scope="col">작품</th>
                <th scope="col">아티스트</th>
                <th scope="col">제작연도</th>
                <th scope="col">가격(원화)</th>
                <th scope="col">가격 (디지털판화)</th>
                <th scope="col">구 분</th>
                <th scope="col">판매기간</th>
                <th scope="col">판매개시</th>
                <th scope="col">삭 제</th>
            `;
        case '001':
            return `
                <th scope="col">작품</th>
                <th scope="col">아티스트</th>
                <th scope="col">제작연도</th>
                <th scope="col">판매가격<br/>(디지털판화 가격)</th>
                <th scope="col">작품구분</th>
                <th scope="col">판매기간</th>
                <th scope="col">판매개시</th>
                <th scope="col">삭 제</th>
            `;
        case '002':
            return `
                <th scope="col">작품</th>
                <th scope="col">아티스트</th>
                <th scope="col">제작연도</th>
                <th scope="col">판매(시작)가격<br/>(디지털판화 가격)</th>
                <th scope="col">즉시구매가</th>
                <th scope="col">현재최고가</th>
                <th scope="col">(참여인원)</th>
                <th scope="col">판매기간</th>
                <th scope="col">판매개시</th>
                <th scope="col">삭 제</th>
            `;
        case '003':
            return `
                <th scope="col">작품</th>
                <th scope="col">아티스트</th>
                <th scope="col">제작연도</th>
                <th scope="col">가격(원화)</th>
                <th scope="col">가격 (디지털판화)</th>
                <th scope="col">구 분</th>
                <th scope="col">판매기간</th>
                <th scope="col">판매개시</th>
                <th scope="col">삭 제</th>
            `;
        default:
            return `
                <th scope="col">작품</th>
                <th scope="col">아티스트</th>
                <th scope="col">제작연도</th>
                <th scope="col">등록가격<br/>(디지털판화 가격)</th>
                <th scope="col">작품구분</th>
                <th scope="col">판매기간</th>
                <th scope="col">판매개시</th>
                <th scope="col">삭 제</th>
            `;
    }
}

function tdDataSet(data) {
    var dtPrtPric = '--';
    if(data.dtPrt.atwrkNm != undefined) dtPrtPric = Meteor.commonUtils.priceComma(data.dtPrt.sPric) + ' 원';

    var ogPrtPric = '--';
    if(data.ogPrt.atwrkNm != undefined) ogPrtPric = Meteor.commonUtils.priceComma(data.ogPrt.pric) + ' 원';

    var sellTp = Meteor.codes.SELL_TYPE(data.ogPrt.sellTp);

    var sellDate = '~';
    if(data.dtPrt.atwrkNm != undefined) {
        sellDate = Meteor.clientCommonUtils.dateFormatChg(data.dtPrt.selStrDt) +
                   ' ~ ' + Meteor.clientCommonUtils.dateFormatChg(data.dtPrt.selEndDt);
    }

    switch(tabFlag.get()) {
        case '000':
            let res = `
                <td>${ogPrtPric}</td>
                <td>${dtPrtPric}</td>
                <td>${sellTp.name == undefined ? '--' : sellTp.name}</td>
                <td>${sellDate}</td>
            `;
            return res;
        case '002':
            var bidLen = 0;
            if(data.ogPrt.bid.bidInfo != undefined) {
                bidLen = data.ogPrt.bid.bidInfo.length;
            }
             

            let res3 = `
                <td>${Meteor.commonUtils.priceComma(data.ogPrt.bid.strAmt) + ' 원'}<br/>(${dtPrtPric})</td>
                <td>${Meteor.commonUtils.priceComma(data.ogPrt.pric) + ' 원'}</td>
                <td>${Meteor.commonUtils.priceComma(data.ogPrt.bid.nPric) + ' 원'}</td>
                <td>(${bidLen})</td>
                <td>${sellDate}</td>
            `;
            return res3;
        case '003':
            let res4 = `
                <td>${ogPrtPric}</td>
                <td>${dtPrtPric}</td>
                <td>${sellTp.name == undefined ? '--' : sellTp.name}</td>
                <td>${sellDate}</td>
            `;

            return res4;
        default:
            var type = '원화 + 디지털 판화';
            if(data.ogPrt.atwrkNm == undefined ) type = '디지털 판화';
            else if(data.dtPrt.atwrkNm == undefined) type = '원화';

            let res2 = `
                <td>${ogPrtPric}<br/>(${dtPrtPric})</td>
                <td>${type}</td>
                <td>${sellDate}</td>
            `;

            return res2;
    }
}