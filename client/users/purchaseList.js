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

    this.autorun(() => {
        const userData = Meteor.user();
        if(userData != undefined) {
            uInfo.set(userData.profile.uInfos);
            seltOrderList();
        } 
    });
});

function seltOrderList() {
    query = {};

    if(strSchDate.get() != '' && endSchDate.get() != ''){
        query = {
            $gte : strSchDate.get(),
            $lte : endSchDate.get()
        };
    } else {
        var seltDate = seltOrderBtn.get();
        query = {
            seltDate
        };
    }

    console.log(query);

    Meteor.call('seltOrderList', query, function(err, res) {
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
});

Template.purchaseList.events({
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
        $('button.is-active').removeClass('is-active');
        var evtns = $(evt.currentTarget);
        var id = $(evt.currentTarget).attr('id');;

        evtns.addClass('is-active');

        seltOrderBtn.set(id);
    },
    'click button[name=dateSchBtn]'(evt, tmpl) {
        var strDate = moment($('input[name=strDate]').val()).format('YYYYMMDD');
        var endDate = moment($('input[name=endDate]').val()).format('YYYYMMDD');
        var toDate = new Date();
        toDate = moment(toDate).format('YYYYMMDD');
        var odTp = $('input[name=odTp]').val();

        if(strDate > endDate) messagePopup({message: '시작날짜가 더 큽니다.'});
        else if(toDate < endDate) messagePopup({message: '종료날짜가 오늘 날자보다 큽니다.'});
        else {
            strSchDate.set(strDate);
            endSchDate.set(endDate);

            seltOrderList();
        }
    },
    'click button[name=delBtn]'(evt, tmpl) {
        console.log(' ===== !!!! del');

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
    }
});
