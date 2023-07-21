import './deliveryList.html';

import '../popup/utilsPopUp.js';

Template.deliveryList.onCreated(function() {
    delivData = new ReactiveVar();
    selectDelivData = new ReactiveVar();
    editDelivData = new ReactiveVar();
});

Template.deliveryList.onRendered(function() {
    console.log(uInfo.get());
});

Template.deliveryList.events({
    // 기본 배송지 선택 이벤트
    'click button[name=defDelivYn]'(evt, tmpl) {
        $('.is-active').removeClass('is-active');
        var evnt = $(evt.currentTarget);
        evnt.parent('div').addClass('is-active');
        
        selectDelivData.set(delivData.get()[evnt.parent('div').attr('id')]);
    },
    // 배송지 수정
    'click button[name=delivEdit]'(evt, tmpl) {
        console.log(' ===== !');
        var evntId = $(evt.currentTarget).val();
        console.log(evntId);
        console.log(' ===== ', delivData.get()[evntId]);
        editDelivData.set(delivData.get()[evntId]);
    },
    // 배송지 삭제
    'click button[name=delivDele]'(evt, tmpl) {
        var _id = uInfo.get()._id;
        var delDta = delivData.get()[$(evt.currentTarget).val()];
        Meteor.call('deliveryDel', _id, delDta, function(err, res) {
            var info = uInfo.get();

            var setDelivData = delivData.get();
            delete setDelivData[$(evt.currentTarget).val()];
            delivData.set(setDelivData);

            info.deliv = delivData.get();
            uInfo.set(info);

            console.log(uInfo.get());
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
