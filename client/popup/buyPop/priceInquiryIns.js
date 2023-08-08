import './priceInquiryIns.html';

Template.priceInquiryIns.onCreated(function() {

});

Template.priceInquiryIns.onRendered(function() {
});

Template.priceInquiryIns.events({
    'click button[name=sendInquiry]'(evt, tmpl) {
        var message = $('#inquiryMsg').val();

        if(message != undefined && message != '' && message.trim() != '') {
            // 회원정보 가져오기
            var userInfo = userInfos.get();

            // 저장 데이터 셋팅
            var inquiryInsInfo = {
                "_id" : Meteor.commonUtils.generateUUID(),
                "cmmncID": Meteor.userId(),
                "nm": userInfo.nm === '' ? userInfo.nicNm : userInfo.nm,
                "atwrkID": this._id,
                "cmmncTp": '002',
                "title": "",
                "cn": message,
                "bsnsID": this.glry.bsnsID,
                "answ": "",
                "sttus": "001"
            };

            //서버 콜
            Meteor.call('insertCommnc', inquiryInsInfo, function(err, res) {
                $('#priceInquiryIns').removeClass('is-open');
                messagePopup({message : '가격문의가 전송 되었습니다.'});
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

Template.priceInquiryIns.helpers({
    
});
