import './phoneAuth.html';

// 팝업창
import '../popup/utilsPopUp.js';

Template.phoneAuth.onCreated(function() {
});

Template.phoneAuth.onRendered(function() {
});

Template.phoneAuth.events({
    'click button[name=phoneAuthBtn]'(evt, tmpl) {
        var chk = $('#check-inquire__cellphone').is(':checked');

        if(chk) {
            messagePopup({message : '동의가 완료되었습니다.'});
        } else {
            messagePopup({message : '동의합니다.를 눌러주세요.'});
        }
    }
});

// 팝업 메시지 띄우기
function messagePopup(message) {
    popUpMessage.set(message);
    $('#utilsPopUp').addClass('is-open');
}

Template.phoneAuth.helpers({
});
