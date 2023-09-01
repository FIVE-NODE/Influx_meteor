import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

import './approval.html';

import '../common/zipCode.js';
import '../lib/addresLib.js';

function maxLengthCheck(object){
    if (object.value.length > object.maxLength){
        object.value = object.value.slice(0, object.maxLength);
        var name = $(object).attr('name');
        var chName = name.replace(/[0-9]/g, "");
        switch(name){
            case `${chName}1`:
                $(`input[name=${chName}2]`).focus();
                break;
            case `${chName}2`:
                $(`input[name=${chName}3]`).focus();
                break;
            default:
                break;
        }
            
    }
}

// 팝업 메시지 띄우기
function messagePopup(message) {
    popUpMessage.set(message);
    $('#utilsPopUp').addClass('is-open');
}

// input disalbed 관리
function inputDisabledChk(data) {
    $('input[name=recptnNm]').attr('disabled', data);
    $('input[name=delivNm]').attr('disabled', data);
    $('input[name=mob1]').attr('disabled', data);
    $('input[name=mob2]').attr('disabled', data);
    $('input[name=mob3]').attr('disabled', data);
    $('input[name=homePhone1]').attr('disabled', data);
    $('input[name=homePhone2]').attr('disabled', data);
    $('input[name=homePhone3]').attr('disabled', data);
    $('input[name=zipCode]').attr('disabled', data);
    $('input[name=address]').attr('disabled', data);
    $('input[name=addr2]').attr('disabled', data);
    $('input[name=delivReqEtc]').attr('disabled', data);
    $('#check-addrWrite--no').attr('disabled', data);
    $('#check-addrWrite--default').attr('disabled', data);
    $('.custom-select__tit').attr('disabled', data);

    if(data) {
        $('#check-addrWrite--default').css('background-color', '#c4c4c4');
        $('#check-addrWrite--no').css('background-color', '#c4c4c4');
    } else {
        $('#check-addrWrite--default').css('background-color', '');
        $('#check-addrWrite--no').css('background-color', '');
    }
    
}

function setPricData(data) {
    var totalProPric = 0;
    var delivPric = 0;
    var salePric = 0;
    var totalPric = 0;

    for(idx in data) {
        var atInfo = data[idx];
        var flag = atInfo.atwrkFlag;

        if(flag == 'ogPrt') {
            totalProPric += atInfo.atwrkInfo[flag].pric;
        } else {
            var size = atInfo.option.size.toLowerCase();
            totalProPric += atInfo.atwrkInfo[flag][`${size}Pric`]
            delivPric += (6000 * parseInt(atInfo.cnt));
        }
    }

    totalPric = (totalProPric + delivPric) - salePric;

    priceData.set({
        totalProPric,
        delivPric,
        salePric,
        totalPric
    });
}

Template.approval.onCreated(function() {
    this.subscribe('userData');

    // 배송 요청사항 내용
    selectDeliv = new ReactiveVar('');

    selectDelivEtc = new ReactiveVar('');

    // 기본배송지 설정 
    defDelivYn = new ReactiveVar(false);

    // 전화번호 없음 유/무
    homePhChk = new ReactiveVar(false);

    // 페이먼트 플레그
    payFlag = new ReactiveVar();

    // 사용자 정보
    uInfo = new ReactiveVar();

    // 선택한 배송지 방법
    seltDeliv = new ReactiveVar();

    // 결재 작품 리스트
    approAtList = new ReactiveVar();

    // 금액 데이터
    priceData = new ReactiveVar();

    var ifba = localStorage.getItem('if.ba.to') == null ? '' : JSON.parse(localStorage.getItem('if.ba.to')).l;
    if(ifba == 'dir') {
        Meteor.call('decrypt', localStorage.getItem('crt_bundle'), function(err, res) {
            var data = JSON.parse(res);
            approAtList.set([data]);
            setPricData(data);
        })
    } else if(ifba == 'all') {
        Meteor.call('decrypt', localStorage.getItem('crt_bundle'), function(err, res) {
            var data = JSON.parse(res);
            approAtList.set(data);
            setPricData(data);
        })
    }
    

    this.autorun(() => {
        const userData = Meteor.users.findOne();
        if(userData != undefined && uInfo.get() == undefined) {
            uInfo.set(userData.profile.uInfos);
        }
    });
});

Template.approval.onRendered(function() {
    if(seltDeliv.get() == undefined) inputDisabledChk(true);
    setTimeout(function() {
        var location = $('#move').offset().top;
        window.scrollTo({top: location});
    }, 50);
});

Template.approval.events({
    'change #check-addrWrite--no'(evt, tmpl) {
        if($('#check-addrWrite--no').is(':checked')) {
            $('.homephones').attr('disabled', true);
            $('input[name=homePhone1]').val('');
            $('input[name=homePhone2]').val('');
            $('input[name=homePhone3]').val('');
            homePhChk.set(true);
        } else {
            $('.homephones').attr('disabled', false);
            homePhChk.set(false);
        }
    },
    'click button[name=selectDeliv]'(evt, tmpl) {
        var selection = $(evt.currentTarget).first().text();
        if(selection === '직접입력') $('input[name=delivReqEtc]').show();
        else $('input[name=delivReqEtc]').hide();        
        selectDeliv.set(selection);
    },
    'change #check-addrWrite--default'(evt, tmpl) {
        if($('#check-addrWrite--default').is(':checked')) {

            defDelivYn.set(true);
        } else {
            defDelivYn.set(false);
        }
    },
    'input input[name=mob1]'(evt, tmpl)  {
        maxLengthCheck(evt.currentTarget);
    },
    'input input[name=mob2]'(evt, tmpl)  {
        maxLengthCheck(evt.currentTarget);
    },
    'input input[name=mob3]'(evt, tmpl)  {
        maxLengthCheck(evt.currentTarget);
    },
    'input input[name=homePhone1]'(evt, tmpl)  {
        maxLengthCheck(evt.currentTarget);
    },
    'input input[name=homePhone2]'(evt, tmpl)  {
        maxLengthCheck(evt.currentTarget);
    },
    'input input[name=homePhone3]'(evt, tmpl)  {
        maxLengthCheck(evt.currentTarget);
    },
    'click button[name=addrsBtn]'(evt, tmpl) {
        addresLib.addres(tmpl);
    },
    'click input[name=radio-basket--method]'(evt, tmpl) {
        var flag = $(evt.currentTarget).val();
        payFlag.set(flag);
    },
    'click #radio-basket-area--default'(evt, tmpl) {
        inputDisabledChk(false);

        // 기존 배송지
        $('#check-addrWrite--default').css('background-color', '#c4c4c4');
        $('#check-addrWrite--default').attr('disabled', true);

        var info = uInfo.get();
        var defDeliv = info.deliv;

        if(defDeliv.length > 0) {
            for(idx in defDeliv) {
                if(defDeliv[idx].defDelivYn === 'Y') {
                    defDeliv = defDeliv[idx];
                    break;
                } else continue;
            }

            if(Object.keys(defDeliv).length != 0) {
                var mob = defDeliv.mob.split(' ');
                var phone = defDeliv.phone.split(' ');
                
                $('input[name=recptnNm]').val(defDeliv.recptnNm);
                $('input[name=delivNm]').val(defDeliv.delivNm);
                $('input[name=mob1]').val(mob[0]);
                $('input[name=mob2]').val(mob[1]);
                $('input[name=mob3]').val(mob[2]);
                if(phone.length > 0) {
                    $('input[name=homePhone1]').val(phone[0]);
                    $('input[name=homePhone2]').val(phone[1]);
                    $('input[name=homePhone3]').val(phone[2]);
                } else {
                    $('.homephones').attr('disabled', true);
                    $('input[name=homePhone1]').val('');
                    $('input[name=homePhone2]').val('');
                    $('input[name=homePhone3]').val('');
                }
                $('input[name=zipCode]').val(defDeliv.zipCd);
                $('input[name=address]').val(defDeliv.addr1);
                $('input[name=addr2]').val(defDeliv.addr2);
                $('input[name=delivReqEtc]').val(defDeliv.delivReqEtc);

            } else messagePopup({message : '등록된 기본 배송지 주소가 없습니다.'});

        } else messagePopup({message : '등록된 배송지 주소가 없습니다.'});
    },
    'click #radio-basket-area--new'(evt, tmpl) {
        inputDisabledChk(false);

        // 신규 배송지
        $('#check-addrWrite--default').css('background-color', '');
        $('#check-addrWrite--default').removeAttr('disabled');

        $('input[name=recptnNm]').val('');
        $('input[name=delivNm]').val('');
        $('input[name=mob1]').val('');
        $('input[name=mob2]').val('');
        $('input[name=mob3]').val('');
        $('input[name=homePhone1]').val('');
        $('input[name=homePhone2]').val('');
        $('input[name=homePhone3]').val('');
        $('input[name=zipCode]').val('');
        $('input[name=address]').val('');
        $('input[name=addr2]').val('');
        $('input[name=delivReqEtc]').val('');
    },
    'click #check-basket-all'(evt, tmpl) {
        var chk = $(evt.currentTarget).is(':checked');
        if(chk) {
            $('#check-basket-price01').prop('checked', true);
            $('#check-basket-price02').prop('checked', true);
        } else {
            $('#check-basket-price01').prop('checked', false);
            $('#check-basket-price02').prop('checked', false);
        }
    },
    'change input[name=terms]'(evt, tmpl) {
        var chk = $('input[name=terms]:checked');
        if(chk.length == 2) $('#check-basket-all').prop('checked', true);
        else $('#check-basket-all').prop('checked', false);
    },
    'click button[name=approvalBtn]'(evt, tmpl) {
        // 결재 약관
        var term1 = $('#check-basket-price01').is(':checked');
        var term2 = $('#check-basket-price02').is(':checked');

        // 배송지 정보
        var recptnNm = $('input[name=recptnNm]').val();
        var delivNm = $('input[name=delivNm]').val();
        var mob1 = $('input[name=mob1]').val();
        var mob2 = $('input[name=mob2]').val();
        var mob3 = $('input[name=mob3]').val();
        var homePhone1 = $('input[name=homePhone1]').val();
        var homePhone2 = $('input[name=homePhone2]').val();
        var homePhone3 = $('input[name=homePhone3]').val();
        var zipCode = $('input[name=zipCode]').val();
        var address = $('input[name=address]').val();
        var addr2 = $('input[name=addr2]').val();
        var delivReqEtc = $('input[name=delivReqEtc]').val();

        // 기본 배송지 설정 유/무
        var defDeli = defDelivYn.get();

        // 결재 수단
        var approValFlag = payFlag.get();

        // 배송시 요청사항
        var seltDeliv = selectDeliv.get();

        if(recptnNm == '')                              messagePopup({message : '수령인을 입랙해주세요'});
        else if(mob1 == '' || mob2 == '' || mob3 == '') messagePopup({message : '휴대전화를 정확하게 입력해주세요'});
        else if(!homePhChk.get()) if(homePhone1 == '' || homePhone2 == '' || homePhone3 == '') messagePopup({message : '전화번호를 입력해주세요'});
        else if(zipCode == '' || addr2 == '')           messagePopup({message : '주소를 입력해주세요'});
        else if(approValFlag == undefined)              messagePopup({message : '결재 수단을 선택해주세요'});
        else if(!term1 || !term2)                        messagePopup({message : '필수 약관을 모두 동의해주세요'});
        else {
            if(defDeli) {

            }
            messagePopup({message : '결재화면으로 이동'});
        }

    },
});

Template.approval.helpers({
    addr: function() {
        return Template.instance().data;
    },
    payType: function() {
        return Meteor.codes.PAY_TYPE();
    },
    usersData() {
        return Meteor.users.findOne();
    },
    emailGet() {
        return this.emails[0].address;
    },
    nmChk() {
        var nm = this.profile.uInfos.nm;
        return nm == '' ? this.profile.uInfos.nicNm : nm;
    },
    phoneMasking(data) {
        return Meteor.clientCommonUtils.mobMasking(Meteor.clientCommonUtils.mobHyphen(data));
    },
    approAtList() {
        if(approAtList.get() != undefined) return approAtList.get();
    },
    deliDtpChk() {
        if(this.atwrkFlag == 'dtPrt') {
            var delivFee = 6000;
            delivFee = delivFee * parseInt(this.cnt);
            return '배송비 ' + Meteor.commonUtils.priceComma(delivFee) + ' 원';
        } else {
            return '원화 배송은 상담사와 문의해주세요'; 
        }
        
    },
    nmDtpChk() {
        if(this.atwrkFlag == 'dtPrt') {
            return this.atwrkInfo.dtPrt.atwrkNm;
        } else {
            return this.atwrkInfo.ogPrt.atwrkNm;
        }
    },
    sizeDtpChk() {
        if(this.atwrkFlag == 'dtPrt') {
            return `${this.option.size} 사이즈`;
        } else {
            return `${this.atwrkInfo.ogPrt.wSize} x ${this.atwrkInfo.ogPrt.hSize}`;
        }
    },
    dtpChk() {
        return this.atwrkFlag == 'dtPrt';
    },
    priceData() {
        if(priceData.get() != undefined) return priceData.get();
    }
});