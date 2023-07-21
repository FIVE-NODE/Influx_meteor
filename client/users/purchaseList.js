import './purchaseList.html';

import '../popup/userPop/deliveryTracking.js';

// 팝업창
import '../popup/utilsPopUp.js';

Template.purchaseList.onCreated(function() {
    uInfo = new ReactiveVar();

    orderList = new ReactiveVar();

    atwrkInfo = new ReactiveVar();

    seltOrderBtn = new ReactiveVar();

    popUpData = new ReactiveVar();

    if(sessionStorage.getItem('art_dex') != undefined) {
        Meteor.call('decrypt', sessionStorage.getItem('art_dex'), function(err, res) {
            var userData = JSON.parse(res);
            Meteor.call('selectMberForId', userData._id, function(err, res) {
                uInfo.set(res);

                seltOrderList();
            });

        });
    }
});

function seltOrderList() {
    Meteor.call('seltOrderList', uInfo.get()._id, function(err, res) {
        var lists = [];
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
        console.log('dateSchBtn');
        var strDate = $('input[name=strDate]').val();
        var endDate = $('input[name=endDate]').val();
        var odTp = $('input[name=odTp]').val();

        if(parseInt(strDate) > parseInt(endDate)) messagePopup({message: '시작날짜가 더 큽니다.'});
        else {
            var seltOrder = seltOrderBtn.get();

            Meteor.call('', { strDate, endDate, odTp, seltOrder }, function(err, res) {
                console.log(res);
            });
        }
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