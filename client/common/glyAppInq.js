import fs from 'fs';

import './glyAppInq.html';

import '../popup/utilsPopUp.js';

var emailVal = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/;
var bnsNumVal = /^[0-9]{3}-[0-9]{2}-[0-9]{5}$/;

Template.glyAppInq.onCreated(function() {
    glyAppInqNextFlag   =   new ReactiveVar(true);   // 다음 버튼 눌럿는지 확인
    partnerStatus       =   new ReactiveVar('B 예비파트너');
    popUpMessage        =   new ReactiveVar('');      // 팝업 메시지
    inqType             =   new ReactiveVar('A 입점신청서 수정/취소'); // 문의 유형



});

Template.glyAppInq.onRendered(function() {
    Meteor.clientCommonUtils.scrollToClass('subTit__inner');
});

Template.glyAppInq.events({
    'click button[name=nextBtn]'() {
        var email = $('input[name=emailAdd]').val();
        var term = $('#check-partner--admit').is(':checked');
        if(!emailVal.test(email)) {
            messagePopup({message : '올바른 이메일 형식을 입력해주세요'});
        } else if(term) {
            glyAppInqNextFlag.set(false);
            Meteor.clientCommonUtils.scrollToClass('subTit__inner');
        } else {
            messagePopup({message : '개인정보 수집에 동의해주세요.'});
        }
    },
    'keyup input[name=emailAdd]'(evt, tmpl) {
        var evtTarget = $(evt.target);
        evtTarget.val(Meteor.clientCommonUtils.emailConsistency(evtTarget.val()));
    },
    'click button[name=partnerA]'() {
        $('button[name=partnerB]').removeClass('is-active');
        $('button[name=partnerA]').addClass('is-active');
        partnerStatus.set('A 파트너');
    },
    'click button[name=partnerB]'() {
        $('button[name=partnerA]').removeClass('is-active');
        $('button[name=partnerB]').addClass('is-active');
        partnerStatus.set('B 예비파트너');
    },
    'click button[name=inqType]'(evt, tmpl) {
        $('button[name=inqType]').removeClass('is-active');
        $(evt.target).addClass('is-active');
        inqType.set(evt.target.innerText);
    },
    'drop div[name=fileDrop]'(evt, tmpl) {
    },
    'keyup input[name=pnrBnsNum]'(evt, tmpl) {
        var evtTarget = $(evt.target);
        evtTarget.val(Meteor.clientCommonUtils.numberHyphen(evtTarget.val()));
    },
    'click button[name=submit]'() {
        var pnrName = $('input[name=pnrName]').val();
        var pnrBnsNum = $('input[name=pnrBnsNum]').val();
        var inqDetail = $('textarea[name=inqDetail]').val();
        
        if(pnrName == undefined || pnrName == '') messagePopup({message : '파트너사명을 입력해주세요.'});
        else if(!bnsNumVal.test(pnrBnsNum)) messagePopup({message : '사업자 등록번호를 정확하게 입력해주세요.'});
        else if(inqDetail == undefined || inqDetail == '') messagePopup({message : '문의 내용을 입력해주세요.'});
        else {
            emailSendToAdmin();
        }
    }
});

function emailSendToAdmin() {
    var email =  $('input[name=emailAdd]').val();
    var desc = $('input[name=inqDetail]').val();

    if(email != '') {
        Meteor.call('sendEmail', {
            to: 'patrick@5node.co.kr',
            from: email,
            subject: '[Influx] 파트너센터 문의',
            text: `${desc}\n\n${partnerStatus.get()}\n${inqType.get()}`,
            attachments : ''
        }, function() {
            messagePopup({message : '파트너센터 문의가 완료되었습니다.'});
        });    
    } else {
        // messagePopup({message : '이메일을 정확하게 입력해주세요.'});
    }
}



// 팝업 메시지 띄우기
function messagePopup(message) {
    popUpMessage.set(message);
    $('#utilsPopUp').addClass('is-open');
}

Template.glyAppInq.helpers({
    glyAppInqNextFlag() {
        return glyAppInqNextFlag.get();
    },
    popup() {
        return popUpMessage.get();
    }
});
