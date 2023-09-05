import './atwrkSalesReg.html';

const numberChk = /[^0-9.]/g; 
const comma = /\B(?=(\d{3})+(?!\d))/g;

Template.atwrkSalesReg.onCreated(function() {

    //등록된 작품 정보
    atwrkInfo = new ReactiveVar();

    sellkindFlag = new ReactiveVar();

    digitalBoth = new ReactiveVar(false);

    renderFlag = new ReactiveVar(false);

    // 원화 최종 만매 개시 금액
    ogTotalPric = new ReactiveVar(0);

    // 디지털 판화 최종 판매 개시 금액
    dtTotalPric = new ReactiveVar(0);

    // 흥정 선택1
    seltHagg1 = new ReactiveVar();

    // 흥정 선택2
    seltHagg2 = new ReactiveVar();

    Meteor.call('selectAtwrkDetail', this.data.atwrkId(), function(err, res) {
        atwrkInfo.set(res);
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

});

// 인풋 콤마 찍기
function inputComma(pric) {
    var pricVal = pric.val().toString();
    pric.val(pricVal.replace(numberChk, '').replace(comma, ','));
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
    'change input[name=pric]'(evt, tmpl) {
        var pric = parseInt($(evt.currentTarget).val().replace(/,/g, ""));
        ogTotalPric.set(pric + (pric * 0.05));        
    },
    'change input[name=endPric]'(evt, tmpl) {
        var pric = parseInt($(evt.currentTarget).val().replace(/,/g, ""));
        ogTotalPric.set(pric + (pric * 0.05));
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
            console.log(timeChk);
            if(timeChk > -1) setDateTime('ogEndDateTime');
            else alert('시작 날짜의 시간은 종료날짜의 시간보다 빠를수 없습니다.');
        } else setDateTime('ogEndDateTime');
    },
    'click button[name=dtStrDateTime]' (evt, tmpl) {
        var today = moment(new Date()).format('YYYYMMDD');
        var seltDay = $('#datepicker3').val();

        var seltEndDay = moment($('#datepicker4').val()).format('YYYYMMDD');
        console.log(seltEndDay);
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
            console.log(timeChk);
            if(timeChk > -1) setDateTime('ogEndDateTime');
            else alert('시작 날짜의 시간은 종료날짜의 시간보다 빠를수 없습니다.');
        } else setDateTime('dtEndDateTime');
    },
    'click button[name=cancel]' (evt, tmpl) {
        history.back();
    },
    'click button[name=sellDone]' (evt, tmpl) {

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
});
