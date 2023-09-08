import './purchaseList.html';

import '../popup/userPop/deliveryTracking.js';

// 팝업창
import '../popup/utilsPopUp.js';

Template.purchaseList.onCreated(function() {
    uInfo = new ReactiveVar();

    orderList = new ReactiveVar();

    atwrkInfo = new ReactiveVar();

    seltOrderBtn = new ReactiveVar('1w');

    popUpData = new ReactiveVar();

    strSchDate = new ReactiveVar();

    endSchDate = new ReactiveVar();

    seltStatus = new ReactiveVar();

    this.autorun(() => {
        const userData = Meteor.user();
        if(userData != undefined) {
            uInfo.set(userData.profile.uInfos);
        } 
    });

    seltOrderList();
});

function seltOrderList() {
    query = {};

    query = {
        $gte : strSchDate.get(),
        $lte : endSchDate.get() 
    };

    var sttus = '';

    if(seltStatus.get() != undefined && seltStatus.get() != '000') sttus = seltStatus.get();

    Meteor.call('seltOrderList', query, sttus, function(err, res) {
        for(idx in res) {
            var resData = res[idx];
            var odList = resData.odAtwrk;
            for(dex in odList) {
                odList[dex].atwrkData = resData.atwrkData[dex];
            }
            res[idx].odAtwrk = odList;
        }

        orderList.set(res);
    });
}

Template.purchaseList.onRendered(function() {
    var toDate = moment(new Date());

    var today = toDate.format('YYYY-MM-DD');
    toDate.subtract(1, 'w').toDate();

    $('input[name=strDate]').val(toDate.format('YYYY-MM-DD'));
    $('input[name=endDate]').val(today);

    strSchDate.set(toDate.format('YYYYMMDD'));
    endSchDate.set(moment(today).format('YYYYMMDD'));
});

Template.purchaseList.events({
    'blur input[name=endDate]' (evt, tmpl) {
        var today = moment(new Date()).format('YYYY-MM-DD');
        var strDay = moment($('input[name=strDate]').val()).format('YYYYMMDD');
        var seltDay = moment($(evt.currentTarget).val()).format('YYYYMMDD');

        if(seltDay < strDay) {
            $(evt.currentTarget).val(moment(today).format('YYYY-MM-DD'));
            alert('시작날짜 보다 종료날짜가 더 작습니다');
        }
    },
    'blur input[name=strDate]' (evt, tmpl) {
        var evtDay = $(evt.currentTarget).val();
        var today = moment(new Date()).format('YYYYMMDD');
        var seltDay = moment(evtDay).format('YYYYMMDD');

        if(seltDay > today) {
            $(evt.currentTarget).val(moment(today).format('YYYY-MM-DD'));
            alert('오늘날짜 이후는 선택하실수 없습니다.');
        }
    },
    'click button[name=deliveryBtn]'(evt, tmpl) {
        $(evt.currentTarget).attr('data-id');

        const $this = $(evt.currentTarget);
        dataId = $this.attr('data-id');
        contId = $('#' + dataId);
        contId.addClass('is-open');

        var odList = orderList.get();

        for(idx in odList) {
            if(odList[idx]._id == $this.attr('id'))  {
                popUpData.set(odList[idx]);
                break;
            }
        }
    },
    'click button[name=seltDateBtn]'(evt, tmpl) {
        var evtTarget = $(evt.currentTarget);
        $('button.is-active').removeClass('is-active');
        evtTarget.addClass('is-active');

        var toDate = moment(new Date());
        var today = toDate.format('YYYY-MM-DD');

        seltOrderBtn.set(evtTarget.attr('id'));

        switch(evtTarget.attr('id')) {
            case '1wek':
                toDate.subtract(1, 'w').toDate();
                break;
            case '1mon':
                toDate.subtract(1, 'M').toDate();
                break;
            case '3mon':
                toDate.subtract(3, 'M').toDate();
                break;
            default:
                break;
        }

        $('input[name=strDate]').val(toDate.format('YYYY-MM-DD'));
        $('input[name=endDate]').val(today);
    },
    'click button[name=dateSchBtn]'(evt, tmpl) {
        var strDate = moment($('input[name=strDate]').val()).format('YYYYMMDD');
        var endDate = moment($('input[name=endDate]').val()).format('YYYYMMDD');

        var odTp = $('input[name=odTp]').val();

        strSchDate.set(strDate);
        endSchDate.set(endDate);

        seltOrderList();
    },
    'click button[name=delBtn]'(evt, tmpl) {
        console.log(' ===== !!!! del');

    },
    'click button[name=seltStatus]'(evt, tmpl) {
        seltStatus.set($(evt.currentTarget).val().split('-')[1]);
    }
});

// 팝업 메시지 띄우기
function messagePopup(message) {
    popUpMessage.set(message);
    $('#utilsPopUp').addClass('is-open');
}

Template.purchaseList.helpers({
    orderList() {
        if(orderList.get() != undefined) {
            return orderList.get();
        }
    },
    ordetStatus() {
        return Meteor.codes.ORDER_STATUS();
    }
});
