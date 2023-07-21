import './bargainingRate.html';

Template.bargainingRate.onCreated(function() {
    selectRate =  new ReactiveVar();
});

Template.bargainingRate.onRendered(function() {
});

Template.bargainingRate.events({
    'click button[name=sendInquiry]'(evt, tmpl) {
        var rate = $('input[type=radio]:checked').val();
        var pric = this.ogPrt.pric;
        if(rate != undefined) {
            selectRate.set((rate * 100));
            bargainingPrice.set(pric - (pric * rate));

            // 회원정보 가져오기
            var userInfo = userInfos.get();

            // 저장 데이터 셋팅
            var bargainInfo = {
                "_id" : Meteor.commonUtils.generateUUID(),
                "cmmncID": userInfo._id,
                "nm": userInfo.nm === '' ? userInfo.nicNm : userInfo.nm,
                "atwrkID": this._id,
                "cmmncTp": '001',
                "title": "",
                "cn": `이 작품 판매가격 -${selectRate.get()}%인 ${Meteor.commonUtils.priceComma(bargainingPrice.get())}원에 구매 의사가 있습니다.`,
                "bsnsID": this.glry.bsnsID,
                "answ": "",
                "sttus": "001"
            };

            // 서버 콜
            Meteor.call('insertCommnc', bargainInfo, function(err, res) {
                $('#bargainingRate').removeClass('is-open');
                messagePopup({message : '흥정 제안이 전송 되었습니다.'});
            });
        } else {
            messagePopup({message : '흥정 금액을 선택해주세요'});    
        }
    },
    'change input[name=radio-deal]'(evt, tmpl) {
        var rate = $(evt.currentTarget).val();
        var pric = this.ogPrt.pric;

        selectRate.set((rate * 100));
        bargainingPrice.set(pric - (pric * rate));
    }
});

// 팝업 메시지 띄우기
function messagePopup(message) {
    popUpMessage.set(message);
    $('#utilsPopUp').addClass('is-open');
}

Template.bargainingRate.helpers({
    salePrice(rate) {
        var pric = this.ogPrt.pric;
        var salePric = pric - (pric * rate);
        return salePric;
    },
    seltPrice() {
        if(selectRate.get() != undefined && bargainingPrice.get() != undefined) {
            let res = {};
            res.chk = true;
            res.rate = selectRate.get();
            res.pric = bargainingPrice.get();
            return res;
        }
    }
});
