import './msgManage.html';

import { Atwrk, Cmmnc } from '../../lib/collections.js';

Template.msgManage.onCreated(function() {
    Meteor.subscribe('mangeMsg');

    msgList = new ReactiveVar();
    seltDelId = new ReactiveVar();

    // this.autorun(() => { 
    //     if(userData != undefined) {
    //         seltMsgList();
    //     }
    // });
});

// function seltMsgList() {
//     Meteor.call('seltMsgListForMber', {}, function(err, res) {
//         msgList.set(res);
//     });
// }

Template.msgManage.onRendered(function() {
});

Template.msgManage.events({
    'click button[name=sendToGlry]'(evt, tmpl) {
        var index = $(evt.currentTarget).attr('id');
        messagePopup('결제연동 준비중 입니다.');
    },
    'click button[name=delBtn]' (evt, tmpl) {
        var evtTarget = $(evt.currentTarget);
        var dataId = evtTarget.data('id');
        var msgId = evtTarget.val();

        $(`#${dataId}`).addClass('is-open');
        seltDelId.set(msgId);
    },
    'click button[name=delAcceptBtn]' (evt, tmpl) {
        Meteor.call('deleteCommnc', seltDelId.get(), function(err, res) {
            if(err) console.log(err);
            else {
                alert('메시지가 삭제되었습니다.');
                $('#confirm').removeClass('is-open');
                seltDelId.set();
            }
        });
        
    }
});

// 팝업 메시지 띄우기
function messagePopup(message) {
    $('#utilsPopUpMsg').text(message);
    $('#utilsPopUp').addClass('is-open');
}

Template.msgManage.helpers({
    msgList() {
        return Cmmnc.find({ cmmncID : Meteor.userId(), sttus : '002' }).fetch();
    },
    atwrkInfo(atwrkId) {
        return Atwrk.findOne({_id : atwrkId});
    },
    typeChk(type) {
        switch(type){
            case '001':
                return true;
            case '002':
                return false;
        }
    },
});


