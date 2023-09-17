import { Template } from 'meteor/templating';

import './footer.html';

import '../popup/utilsPopUp.js';

// 팝업 메시지 띄우기
function messagePopup(message) {
    popUpMessage.set(message);
    $('#utilsPopUp').addClass('is-open');
}

Template.footer.onCreated(function() {
    popUpMessage    = new ReactiveVar('');      // 팝업 메시지
    footerRenderFlags = new ReactiveVar(false);
});

Template.footer.onRendered(function() {
    setTimeout(function() {
        footerRenderFlags.set(true);
        $('.footer').css('background-color', '#1868B7');
    }, 1000);
});

Template.footer.events({
    'click a[name=facebook]'() {
        messagePopup({message: '페이스북 연동 준비중입니다.'});
    },
    'click a[name=insta]'() {
        messagePopup({message: '인스타그램 연동 준비중입니다.'});
    },
    'click a[name=twitter]'() {
        messagePopup({message: '트위터 연동 준비중입니다.'});
    },
});

Template.footer.helpers({
    popup() {
        return popUpMessage.get();
    },
    oneSec() {
        return footerRenderFlags.get();
    }
});

