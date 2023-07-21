import './changeMberInfo.html';
import '../popup/utilsPopUp.js';

// 배송지 리스트 팝업
import './deliveryList.js';
import './deliveryReg.js';
import './deliveryEdit.js';
import '../popup/userPop/withDrawalUser.js';

Template.changeMberInfo.onCreated(function() {
    uInfo = new ReactiveVar();
    Meteor.commonUtils.uInfo(uInfo);
});

Template.changeMberInfo.onRendered(function() {
});

Template.changeMberInfo.events({
});

Template.changeMberInfo.helpers({
    uInfo() {        
        if(uInfo.get() != undefined) {
            return uInfo.get();
        }
    },
    nmChk(nm) {
        return nm != undefined ? true : false;
    },
    maskingEmail(email) {
        var originStr = email;

        var emId = "*".repeat(email.split("@")[0].length -2);
        
        var addr = originStr.toString().split('@')[1].split('.')[0];

        return email[0] + email[1] + emId + '@' + addr.replace(/[a-zA-Z0-9._-]/g, '*') + '.com';
    },
    emailChk(cert) {
        return cert === 'Y' ? true : false;
    },
    defDelivYn() {
        var res = false;
        if(uInfo.get() != undefined) {
            var deliv = uInfo.get().deliv;
            deliv.forEach(function(val, num) {
                if(val.defDelivYn === 'Y') res = val;
            });
            return res;
        }
    },
    mobMasking(data) {
        return  Meteor.clientCommonUtils.mobMasking(Meteor.clientCommonUtils.mobHyphen(data));
    }
});
