
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

import './atwrkSalesReg.html';

const numberChk = /[^0-9.]/g; 
const comma = /\B(?=(\d{3})+(?!\d))/g;
const delComma = /,/g;

Template.atwrkSalesReg.onCreated(function() {

    //등록된 작품 정보
    atwrkInfo = new ReactiveVar();

    // 판매방식
    sellkindFlag = new ReactiveVar();

    // 디지털 판화 동시 판매 여부
    digitalBoth = new ReactiveVar(false);

    // 랜더링 완료 여부
    renderFlag = new ReactiveVar(false);

    // 원화 최종 만매 개시 금액
    ogTotalPric = new ReactiveVar(0);

    // 디지털 판화 최종 판매 개시 금액
    dtTotalPric = new ReactiveVar(0);

    // 흥정셋팅 저장용
    setBargain = new ReactiveDict();

    // 디지털판화면일때
    onlyDtpChk = new ReactiveVar(false);

    Meteor.call('seltAtwrkSellSet', this.data.atwrkId(), function(err, res) {
        atwrkInfo.set(res);
        if(Object.keys(res.ogPrt).length == 0) onlyDtpChk.set(true);
    });

    this.autorun(() => {
        if(atwrkInfo.get() != undefined) {
            renderFlag.set(true);
        }
        
    });
});

Template.atwrkSalesReg.onRendered(function() {
    $.datepicker.setDefaults({
        dateFormat: 'yymmdd',
        prevText: '이전 달',
        nextText: '다음 달',
        monthNames: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
        monthNamesShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
        /*dayNames: ['일', '월', '화', '수', '목', '금', '토'],
        dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
        dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'],*/
        showMonthAfterYear: true,
        yearSuffix: '년'
    });
    
    var today = moment(new Date()).format('YYYY.MM.DD');
    var toTime =  moment(new Date()).format('hh:mm A');

    $(function() {
        $( "#datepicker1" ).datepicker();
        $( "#datepicker2" ).datepicker();
        $( "#datepicker3" ).datepicker();
        $( "#datepicker4" ).datepicker();
        $('input.timepicker').timepicker();
    } );

    $('span[name=seltStrDate]').text(today);
    $('span[name=seltStrTime]').text(toTime);
    $('span[name=seltEndDate]').text(today);
    $('span[name=seltEndTime]').text(toTime);

    $('span[name=dtSeltStrDate]').text(today);
    $('span[name=dtSeltStrTime]').text(toTime);
    $('span[name=dtSeltEndDate]').text(today);
    $('span[name=dtSeltEndTime]').text(toTime);


    setTimeout(function() {
        if(onlyDtpChk.get()) {
            let dtSell = $('#check-saleCondition--permit01');
            dtSell.click();
            dtSell.attr('disabled', true);
        }
    }, 600);

});

// 인풋 콤마 찍기
function inputComma(pric) {
    var pricVal = pric.val().toString();
    pric.val(pricVal.replace(numberChk, '').replace(comma, ','));
}

function setPric(getPric) {
    var pric = getPric.replace(delComma, "");
    if(pric == '') ogTotalPric.set(0);
    else {
        pric = Number(pric);
        ogTotalPric.set(Math.round(pric + (pric * 0.05)));
    }
}

Template.atwrkSalesReg.events({
    'keyup input[name=strPric]'(evt, tmpl) {
        inputComma($(evt.currentTarget));
    },
    'keyup input[name=endPric]'(evt, tmpl) {
        inputComma($(evt.currentTarget));
    },
    'keyup input[name=pric]'(evt, tmpl) {
        inputComma($(evt.currentTarget));
    },
    'keyup input[name=dtPric]'(evt, tmpl) {
        inputComma($(evt.currentTarget));
    },
    'change input[name=pric]'(evt, tmpl) {
        var pric = $(evt.currentTarget).val().replace(delComma, "");
        if(pric == '') ogTotalPric.set(0);
        else {
            pric = Number(pric);
            ogTotalPric.set(Math.round(pric + (pric * 0.05)));
        }
    },
    'change input[name=endPric]'(evt, tmpl) {
        var pric = $(evt.currentTarget).val().replace(delComma, "");
        if(pric == '') ogTotalPric.set(0);
        else {
            pric = Number(pric);
            ogTotalPric.set(Math.round(pric + (pric * 0.05)));
        }
    },
    'change input[name=dtPric]'(evt, tmpl) {
        var pric = $(evt.currentTarget).val().replace(delComma, "");
        if(pric == '') dtTotalPric.set(0);
        else {
            pric = Number(pric);
            dtTotalPric.set(Math.round(pric + (pric * 0.05)));
        }
    },
    'change input[name=check-saleCondition--method]'(evt, tmpl) {
        sellkindFlag.set($(evt.currentTarget).val());
        ogTotalPric.set(0);
    },
    'change #check-saleCondition--permit01'(evt, tmpl) {
        var chk = $(evt.currentTarget).is(':checked');
        digitalBoth.set(chk);
        if(chk) $('div[name=digitalSell]').css({'display' : ''});
        else $('div[name=digitalSell]').css({'display' : 'none'});
    },
    'click button[name=ogStrDateTime]' (evt, tmpl) {
        var today = moment(new Date()).format('YYYYMMDD');
        var seltDay = $('#datepicker1').val();

        var seltEndDay = moment($('#datepicker2').val()).format('YYYYMMDD');
        if(today > seltDay) {
            alert('선택하신 날짜가 오늘 날짜보다 전 입니다.');
        } else setDateTime('ogStrDateTime');
    },
    'click button[name=ogEndDateTime]' (evt, tmpl) {
        var seltStrDay = moment($('span[name=seltStrDate]')).format('YYYYMMDD');
        var seltDay = $('#datepicker2').val();

        if(seltStrDay > seltDay) {
            alert('시작날짜 보다 종료날짜가 먼저일수 없습니다.');
        } else if(seltStrDay == seltDay) {
            var seltEndDay = moment(seltDay).format('YYYYMMDD');
            var seltStrTime = moment(seltStrDay + ' ' + $('#ogStrTime').val(), 'YYYYMMDD hh:mm A');
            var seltEndTime = moment(seltEndDay + ' ' + $('#ogEndTime').val(), 'YYYYMMDD hh:mm A');
            var timeChk = moment.duration(seltEndTime.diff(seltStrTime)).asMinutes();
            
            if(timeChk > -1) setDateTime('ogEndDateTime');
            else alert('시작 날짜의 시간은 종료날짜의 시간보다 빠를수 없습니다.');
        } else setDateTime('ogEndDateTime');
    },
    'click button[name=dtStrDateTime]' (evt, tmpl) {
        var today = moment(new Date()).format('YYYYMMDD');
        var seltDay = $('#datepicker3').val();

        var seltEndDay = moment($('#datepicker4').val()).format('YYYYMMDD');
        
        if(today > seltDay) {
            alert('선택하신 날짜가 오늘 날짜보다 전 입니다.');
        } else setDateTime('dtStrDateTime');
    },
    'click button[name=dtEndDateTime]' (evt, tmpl) {
        var seltStrDay = moment($('span[name=dtSeltStrDate]')).format('YYYYMMDD');
        var seltDay = $('#datepicker4').val();

        if(seltStrDay > seltDay) {
            alert('시작날짜 보다 종료날짜가 먼저일수 없습니다.');
        } else if(seltStrDay == seltDay) {
            var seltEndDay = moment(seltDay).format('YYYYMMDD');
            var seltStrTime = moment(seltStrDay + ' ' + $('#ogStrTime').val(), 'YYYYMMDD hh:mm A');
            var seltEndTime = moment(seltEndDay + ' ' + $('#ogEndTime').val(), 'YYYYMMDD hh:mm A');
            var timeChk = moment.duration(seltEndTime.diff(seltStrTime)).asMinutes();
            
            if(timeChk > -1) setDateTime('ogEndDateTime');
            else alert('시작 날짜의 시간은 종료날짜의 시간보다 빠를수 없습니다.');
        } else setDateTime('dtEndDateTime');
    },
    'click button[name=cancel]' (evt, tmpl) {
        history.back();
    },
    // 흥정용 가격 선택1, 선택2 셋팅
    'blur #bargain' (evt, tmpl) {
        var pric = Number($(evt.currentTarget).val().replace(delComma, ''));
        pric = pric + (pric * 0.05);

        var seltBargain1 = [
            { pric, detail : '현 판매 가격' },
            { pric : pric - (pric *0.05), detail : '판매 가격의 -5%'},
            { pric : pric - (pric *0.1), detail : '판매 가격의 -10%'},
            { pric : pric - (pric *0.15), detail : '판매 가격의 -15%'}
        ];

        var seltBargain2 = [
            { pric, detail : '현 판매 가격' },
            { pric : pric - (pric *0.1), detail : '판매 가격의 -10%'},
            { pric : pric - (pric *0.15), detail : '판매 가격의 -15%'},
            { pric : pric - (pric *0.2), detail : '판매 가격의 -20%'}
        ];

        setBargain.set('seltBargain1', seltBargain1);
        setBargain.set('seltBargain2', seltBargain2);
    },
    // 디지털 판화 작품 개수 선택
    'click button[name=seltDtCnt]'(evt, tmpl) {
        var cnt = $(evt.currentTarget).text();
        if(cnt == '직접입력') {
            $('input[name=dtSellCnt]').prop('disabled', false);
            $('input[name=dtSellCnt]').focus();
        } else {
            $('input[name=dtSellCnt]').prop('disabled', true);
            $('input[name=dtSellCnt]').val(cnt);
        }
    },
    'click button[name=salesRegBtn]' (evt, tmpl) {
        // kind 종류 001(정찰가) 002(비딩) 003(흥정) 004(가격문의)

        if(sellkindFlag.get() == undefined) alert('판매 방식을 선택해주세요');
        else {
            let atInfos = atwrkInfo.get();
            var today = moment(new Date()).format('YYYYMMDD hh:mm A');
            var ogValidation = false;
            var dtValidation = true;
            var pupMsg = '';

            var sellStrDt = moment($('span[name=seltStrDate]').text() + ' ' + $('span[name=seltStrTime]').text(), 'YYYYMMDD hh:mm A').format('YYYYMMDDHHmm');
            var sellEndDt = moment($('span[name=seltEndDate]').text() + ' ' + $('span[name=seltEndTime]').text(), 'YYYYMMDD hh:mm A').format('YYYYMMDDHHmm');

            // 판매방법에 따른 벨리데이션 체크
            switch(sellkindFlag.get()) {
                case '004':
                    ogValidation = true;
                    break;
                case '002':
                    var bidStrPric = Number($('input[name=strPric]').val().replace(delComma, ""));
                    var immdPurchPric = Number($('input[name=endPric]').val().replace(delComma, ""));

                    if(bidStrPric < 100000) {
                        pupMsg = '비딩 최소 시작 금액은 100,000 원 부터 입니다.';
                        break;
                    }

                    if(bidStrPric >= immdPurchPric) {
                        pupMsg = '즉시 구매 가격보다 비딩 시작 가격이 더 큽니다.';
                        break;
                    }

                    atInfos.ogPrt.pric =  bidStrPric;
                    atInfos.ogPrt.bid = {
                        strAmt : bidStrPric,
                        strDt : sellStrDt,
                        endDt : sellEndDt,
                        immdPurchPric,
                        nPric : bidStrPric
                    };

                    ogValidation = true;
                    break;
                default:
                    var pric = Number($('input[name=pric]').val().replace(delComma, ""));
                    if(pric == 0 || pric < 100000) {
                        pupMsg = '금액은 0이 될수 없으며 최소 100,000 원 이상이여야 합니다.';
                        break;
                    }

                    atInfos.ogPrt.pric =  ogTotalPric.get();

                    ogValidation = true;
                    break;
            }

            atInfos.ogPrt.selStrDt = sellStrDt;
            atInfos.ogPrt.selEndDt = sellEndDt;

            // 디지털 판화 동시판매에 따른 벨리데이션 체크
            if(digitalBoth.get()) {
                dtValidation = false;

                var selCnt = Number($('input[name=dtSellCnt]').val());

                if(dtTotalPric.get() == 0 || dtTotalPric.get() < 100000)  pupMsg = '금액은 0이 될수 없으며 최소 100,000 원 이상이여야 합니다.';
                else if(selCnt == 0) pupMsg = '허용작품수 를 선택/입력 해주세요.';
                else {
                    var dtSellStrDt = moment($('span[name=dtSeltStrDate]').text() + ' ' + $('span[name=dtSeltStrTime]').text(), 'YYYYMMDD hh:mm A').format('YYYYMMDDHHmm');
                    var dtSellEndDt = moment($('span[name=dtSeltEndDate]').text() + ' ' + $('span[name=dtSeltEndTime]').text(), 'YYYYMMDD hh:mm A').format('YYYYMMDDHHmm');

                    atInfos.dtPrt.selStrDt = dtSellStrDt;
                    atInfos.dtPrt.selEndDt = dtSellEndDt;
                    atInfos.dtPrt.sPric = dtTotalPric.get();
                    atInfos.dtPrt.mPric = (dtTotalPric.get() + 30000);
                    atInfos.dtPrt.lPric = (dtTotalPric.get() + 60000);
                    atInfos.dtPrt.leCnt = selCnt;
                    atInfos.dtPrt.selCnt = selCnt;
                    
                    dtValidation = true;
                }
            }

            // 모든 벨리데이션 통과시 판매등록 처리
            if(ogValidation && dtValidation) {
                $('button[name=salesRegBtn]').off('click');
                atInfos.ogPrt.sellTp = sellkindFlag.get();

                Meteor.call('updateSalesAtwrk', atInfos, function(err, res) {
                    if(err) console.log(err);
                    else {
                        if(res >= 1) {
                            alert('판매등록이 완료되었습니다.');
                        }
                        FlowRouter.go('/glryAtwrks');
                    }
                });
            } else alert(pupMsg);
        }   
    }
});


function setDateTime (flag) {
    var dateGetDate = '';
    var dateGetTime = '';
    var dataSetFlag = '';

    switch(flag) {
        case 'ogStrDateTime':
            dataSetFlag = 'seltStr';
            dateGetDate = $( "#datepicker1" ).val();
            dateGetTime = $('#ogStrTime').val();
            break;
        case 'ogEndDateTime':
            dataSetFlag = 'seltEnd';
            dateGetDate = $( "#datepicker2" ).val();
            dateGetTime = $('#ogEndTime').val();
            break;
        case 'dtStrDateTime':
            dataSetFlag = 'dtSeltStr';
            dateGetDate = $( "#datepicker3" ).val();
            dateGetTime = $('#dtStrTime').val();
            break;
        default:
            dataSetFlag = 'dtSeltEnd';
            dateGetDate = $( "#datepicker4" ).val();
            dateGetTime = $('#dtEndTime').val();
            break;
    }

    if(dateGetDate == '' || dateGetTime == '') alert('날짜와 시간은 필수 입니다.');
    else {
        $(`span[name=${dataSetFlag}Date]`).text(moment(dateGetDate).format('YYYY.MM.DD'));
        $(`span[name=${dataSetFlag}Time]`).text(dateGetTime);

        $('.popup-close').click();
    }
}

Template.atwrkSalesReg.helpers({
    atInfo() {
        if(atwrkInfo.get() != undefined && atwrkInfo.get() != null) {
            return atwrkInfo.get();
        }
    },
    sellkind() {

    },
    digitalBoth() {
        return digitalBoth.get();
    },
    renderFlag() {
        return renderFlag.get();
    },
    scout() {
        return sellkindFlag.get() == '001';
    },
    bid() {
        return sellkindFlag.get() == '002';
    },
    scoutBargain() {
        if(sellkindFlag.get() == '003') {
            
        }
        return sellkindFlag.get() == '003';
    },
    ogTotalPric() {
        return Meteor.commonUtils.priceComma(ogTotalPric.get());
    },
    dtTotalPric() {
        return Meteor.commonUtils.priceComma(dtTotalPric.get());
    },
    dtPrtChk() {
        if(atwrkInfo.get() != undefined) {
            return atwrkInfo.get().dtPrt.atwrkNm != undefined;
        }
    },
    seltBargain1() {
        if(setBargain.get('seltBargain1') != undefined)  {
            return setBargain.get('seltBargain1');
        }
    },
    seltBargain2() {
        if(setBargain.get('seltBargain2') != undefined)  {
            return setBargain.get('seltBargain2');
        }
    },
    onlyDtp() {
        return onlyDtpChk.get();
    }
    
});


