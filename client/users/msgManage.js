import './msgManage.html';

// 팝업창
import '../popup/utilsPopUp.js';

Template.msgManage.onCreated(function() {
    uInfo = new ReactiveVar();

    msgList = new ReactiveVar();

    this.autorun(() => {
        const userData = Meteor.user();
        if(userData != undefined && uInfo.get() == undefined) {
            uInfo.set(userData.profile.uInfos);
            seltMsgList();
        }
    });
});

function seltMsgList() {
    Meteor.call('seltMsgListForMber', {}, function(err, res) {
        msgList.set(res);
    });
}

Template.msgManage.onRendered(function() {
});

Template.msgManage.events({
    'click button[name=sendToGlry]'(evt, tmpl) {
        var index = $(evt.currentTarget).attr('id');

        var message = $(`#answ-${index}`).val();

        if(message != undefined && message != '' && message.trim() != '') {
            var userInfo = uInfo.get();

            // 저장 데이터 셋팅
            var inquiryInsInfo = {
                "_id" : Meteor.commonUtils.generateUUID(),
                "cmmncID": Meteor.userId(),
                "nm": userInfo.nm === '' ? userInfo.nicNm : userInfo.nm,
                "atwrkID": this.atwrkData._id,
                "cmmncTp": '002',
                "title": "",
                "cn": message,
                "bsnsID": this.atwrkData.glry.bsnsID,
                "answ": "",
                "sttus": "001"
            };

            //서버 콜
            Meteor.call('insertCommnc', inquiryInsInfo, function(err, res) {
                messagePopup({message : '가격문의 답장이 전송되었습니다.'});
            });
            
        } else {
            messagePopup({message : '메세지를 입력하세요'});    
        }
    }
});

// 팝업 메시지 띄우기
function messagePopup(message) {
    popUpMessage.set(message);
    $('#utilsPopUp').addClass('is-open');
}

Template.msgManage.helpers({
    msgList() {
        return msgList.get();
    },
    typeChk(type) {
        switch(type){
            case '001':
                return true;
            case '002':
                return false;
        }
    }
});


