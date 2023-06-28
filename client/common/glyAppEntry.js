import './glyAppEntry.html';

import '../popup/utilsPopUp.js';

var regExpPhone = /^\d{2,3}\d{3,4}\d{4}$/;

Template.glyAppEntry.onCreated(function() {
    const instance = this;

    bnsNumChk = new ReactiveVar();
    bnsNumChk.set({chk : false});

    // 비즈니스 넘버 존재하는지 확인 여부
    bnsNumberVal = new ReactiveVar(false);
    bsnsID = new ReactiveVar('');

    // 팝업 메시지
    popUpMessage    = new ReactiveVar('');

});

Template.glyAppEntry.onRendered(function() {
});

Template.glyAppEntry.events({
    'click span[name=appEntryFaq]'() {
        
    },
    'click .popup-close'(evt, tmpl) {
        console.log(tmpl);
        console.log(this);
    },
    'click button[name=bsNumChk]' (evt, tmpl) {
        var bNum = $('input[name=bNum1]').val() + $('input[name=bNum2]').val() + $('input[name=bNum3]').val();
        Meteor.call('companyRegNumChk', bNum, function(err, res) {
            res = JSON.parse(res)
            if(res.status_code === 'OK') {
                var data = res.data[0];
                var resData = {
                    chk : true,
                    message : '사업자 확인이 완료 되었습니다.'
                };
                if(data.b_stt_cd === '01') {
                    bnsNumChk.set(resData);
                    bsnsID.set(data.b_no);
                    bnsNumberVal.set(true);
                } else {
                    resData.message = data.tax_type;
                    bnsNumChk.set(resData);
                }
            }
        });
    },
    'click button[name=bnsSubmit]'() {
        console.log(this);

        var companyNm   = $('input[name=companyNm]').val();
        var smaNm       = $('input[name=smaNm]').val();
        var smaPhone    = $('input[name=smaPhone]');
        var smaEmail    = $('input[name=smaEmail]').val();
        var glyNm       = $('input[name=glyNm]').val();
        var zipCode     = $('input[name=zipCode]').val();
        var address     = $('input[name=address]').val();
        var detail      = $('input[name=detail]').val();
        var homeUrl     = $('input[name=homeUrl]').val();
        smaPhone = smaPhone[0].value + smaPhone[1].value + smaPhone[2].value;

        if(companyNm === '') messagePopup({message : '회사이름을 입력해주세요'});
        else if(!bnsNumberVal.get()) messagePopup({message : '사업자번호를 확인해 주세요'});
        else if(smaNm === '') messagePopup({message : '담당자 이름을 입력해주세요'});
        else if(!regExpPhone.test(smaPhone)) messagePopup({message : '담당자 전화번호를 정확히 입력해주세요'});
        else if(smaEmail === '') messagePopup({message : '담당자 이메일을 입력해주세요'});
        else if(glyNm === '') messagePopup({message : '갤러리 이름을 입력해주세요'});
        else if(zipCode === '') messagePopup({message : '주소를 입력해주세요'});
        else if(address === '') messagePopup({message : '주소를 입력해주세요'});
        else {
            var bsnsData = {
                bsnsTP  : '001',
                bsnsID  : bsnsID.get(),
                bsnsNm  : companyNm,
                homeUrl : homeUrl,
                glryNm  : glyNm,
                addr1   : address,
                addr2   : detail,
                zipCd   : zipCode,
                dong    : this.addrs.bname,
                area    : this.addrs.sido,
                sigungu : this.addrs.sigungu,
                bsnsChagNm : smaNm,
                bsnsChagMob : smaPhone,
                bsnsChagEmail : smaEmail
            };
            Meteor.call('createBsnsMber', bsnsData, function(err, res) {
                if(res != undefined && res != '') {
                    messagePopup({
                        message : '신청이 완료되었습니다.\n관리자 검토 후 임시비밀번호가 전달됩니다.',
                        route : 'aOne',
                        type: ''
                    });
                }
            });
        }
    }
});

// 팝업 메시지 띄우기
function messagePopup(message) {
    popUpMessage.set(message);
    $('#utilsPopUp').addClass('is-open');
}

Template.glyAppEntry.helpers({
    addr: function() {
        return Template.instance().data;
    },
    bnsChk: function() {
        return bnsNumChk.get();
    },
    popup() {
        return popUpMessage.get();
    }
});
