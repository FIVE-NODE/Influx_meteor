import './deliveryList.html';

import '../popup/utilsPopUp.js';

Template.deliveryList.onCreated(function() {
    delivData = new ReactiveVar();
    selectDelivData = new ReactiveVar();
    editDelivData = new ReactiveVar();
});

Template.deliveryList.onRendered(function() {
});

Template.deliveryList.events({
    // 기본 배송지 선택 이벤트
    'click button[name=defDelivYn]'(evt, tmpl) {
        $('.is-active').removeClass('is-active');
        var evnt = $(evt.currentTarget);
        evnt.parent('div').addClass('is-active');
        
        selectDelivData.set(delivData.get()[evnt.parent('div').attr('id')]);

        Meteor.call('defaultDelivChg', selectDelivData.get());
    },
    // 배송지 수정
    'click button[name=delivEdit]'(evt, tmpl) {
        var evntId = $(evt.currentTarget).val();
        var seltPastDelivData = delivData.get()[evntId];
        var mobList = seltPastDelivData.mob.split(' ');
        var hPhoneList = seltPastDelivData.mob.split(' ');
        var delivEtc = seltPastDelivData.delivReqEtc != undefined ? seltPastDelivData.delivReqEtc : '';

        editDelivData.set(seltPastDelivData);

        $('input[name=editRecptnNm]').val(seltPastDelivData.recptnNm);
        $('input[name=editDelivNm]').val(seltPastDelivData.delivNm);
        $('input[name=editMob1]').val(mobList[0]);
        $('input[name=editMob2]').val(mobList[1]);
        $('input[name=editMob3]').val(mobList[2]);
        $('input[name=editHomePhone1]').val(hPhoneList[0]);
        $('input[name=editHomePhone2]').val(hPhoneList[1]);
        $('input[name=editHomePhone3]').val(hPhoneList[2]);
        $('input[name=editZipCode]').val(seltPastDelivData.zipCd);
        $('input[name=editAddress]').val(seltPastDelivData.addr1);
        $('input[name=editAddr2]').val(seltPastDelivData.addr2);
        $('input[name=editDelivReqEtc]').val(delivEtc);
        $('#check-addrWrite--default-edit').prop('checked', seltPastDelivData.defDelivYn == 'Y');
        $('#check-addrWrite--no-edit').prop('checked', hPhoneList.length != 0);
    },
    // 배송지 삭제
    'click button[name=delivDele]'(evt, tmpl) {
        var _id = userId.get();
        var delDta = delivData.get()[$(evt.currentTarget).val()];
        Meteor.call('deliveryDel', _id, delDta, function(err, res) {
            var info = uInfo.get();

            var setDelivData = delivData.get();
            delete setDelivData[$(evt.currentTarget).val()];
            delivData.set(setDelivData);

            info.deliv = delivData.get();
            uInfo.set(info);
        });
    }
});

Template.deliveryList.helpers({
    delivList() {
        if(uInfo.get() != undefined) {
            var info = uInfo.get();
            delivData.set(info.deliv.filter((x) => x.defDelivYn == 'Y').concat(info.deliv.filter((x) => x.defDelivYn != 'Y')));
            return delivData.get();
        }
    },
    activeChk(chk) {
        return chk === 'Y' ? 'is-active' : ''
    },
});
