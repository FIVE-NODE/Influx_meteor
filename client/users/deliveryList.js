import './deliveryList.html';

import '../popup/utilsPopUp.js';

Template.deliveryList.onCreated(function() {
    delivData = new ReactiveVar();
    selectDelivData = new ReactiveVar();
    editDelivData = new ReactiveVar();
});

Template.deliveryList.onRendered(function() {
});

function setDelivReq(delivReq) {
    let delReqList =  $('button[name=editSelectDeliv]');
    
    for(var i=0; i<delReqList.length; i++) {
        if(delReqList[i].innerText == delivReq) {
            $(delReqList[i]).click();
            break;
        }
    }
}

Template.deliveryList.events({
    // 기본 배송지 선택 이벤트
    'click button[name=defDelivYn]'(evt, tmpl) {
        var evnt = $(evt.currentTarget);
        
        selectDelivData.set(delivData.get()[evnt.parent('div').attr('id')]);

        Meteor.call('defaultDelivChg', selectDelivData.get());
    },
    // 배송지 등록
    'click button[name=delivRegBtn]'(evt, tmpl) {
        $('input[name=recptnNm]').val('');
        $('input[name=delivNm]').val('');
        $('input[name=mob1]').val('');
        $('input[name=mob2]').val('');
        $('input[name=mob3]').val('');
        $('input[name=homePhone1]').val('');
        $('input[name=homePhone2]').val('');
        $('input[name=homePhone3]').val('');
        $('input[name=zipCode]').val('');
        $('input[name=address]').val('');
        $('input[name=addr2]').val('');
        $('input[name=delivReqEtc]').val('');
        
        $('#check-addrWrite--default').prop('checked', false);
        $('#check-addrWrite--no').prop('checked', false);
    },
    // 배송지 수정
    'click button[name=delivEdit]'(evt, tmpl) {
        var evntId = $(evt.currentTarget).val();
        var seltPastDelivData = delivData.get()[evntId];
        var mobList = seltPastDelivData.mob.split(' ');
        var hPhoneList = seltPastDelivData.phone.split(' ');
        var delivEtc = seltPastDelivData.delivReqEtc != undefined ? seltPastDelivData.delivReqEtc : '';
        var delivReq = this.delivReq;

        editDelivData.set(seltPastDelivData);

        $('input[name=editRecptnNm]').val(seltPastDelivData.recptnNm);
        $('input[name=editDelivNm]').val(seltPastDelivData.delivNm);
        $('input[name=editMob1]').val(mobList[0]);
        $('input[name=editMob2]').val(mobList[1]);
        $('input[name=editMob3]').val(mobList[2]);

        if(hPhoneList[0] != '' && hPhoneList[1] != '' && hPhoneList[2] != '') {
            if($('#check-addrWrite--no-edit').is(':checked')) {
                $('#check-addrWrite--no-edit').click();
            }

            $('input[name=editHomePhone1]').val(hPhoneList[0]);
            $('input[name=editHomePhone2]').val(hPhoneList[1]);
            $('input[name=editHomePhone3]').val(hPhoneList[2]);
        } else {
            if(!$('#check-addrWrite--no-edit').is(':checked')) {
                $('#check-addrWrite--no-edit').click();
            } else homePhChk.set(true);
            $('input[name=editHomePhone1]').val('');
            $('input[name=editHomePhone2]').val('');
            $('input[name=editHomePhone3]').val('');
            
        }
        
        $('input[name=editZipCode]').val(seltPastDelivData.zipCd);
        $('input[name=editAddress]').val(seltPastDelivData.addr1);
        $('input[name=editAddr2]').val(seltPastDelivData.addr2);

        if(delivReq == '직접입력') {
            setDelivReq(delivReq);
            $('input[name=editDelivReqEtc]').val(delivEtc);

        } else if(delivReq == '') {
            setDelivReq('배송시 요청사항을 선택해주세요.');
        } else {
            setDelivReq(delivReq);
            $('input[name=editSelectDeliv]').val(delivReq);
        }
        

        if(this.defDelivYn == 'Y') {
            $('#check-addrWrite--default-edit').prop('checked', this.defDelivYn == 'Y');
            defDelivYn.set(true);
        } else {
            $('#check-addrWrite--default-edit').prop('checked', false);
            defDelivYn.set(false);
        }

    },
    // 배송지 삭제
    'click button[name=delivDele]'(evt, tmpl) {
        var _id = Meteor.userId();
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
