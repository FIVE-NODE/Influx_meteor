import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { Random } from 'meteor/random';

import './glyAppEntry.html';

import '../popup/utilsPopUp.js';

var regExpPhone = /^\d{2,3}\d{3,4}\d{4}$/;
var regExpEmail = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');;

Template.glyAppEntry.onCreated(function() {
    const instance = this;

    bnsNumChk = new ReactiveVar();
    bnsNumChk.set({chk : false});

    // 비즈니스 넘버 존재하는지 확인 여부
    bnsNumberVal = new ReactiveVar(false);
    bsnsID = new ReactiveVar('');

    // 팝업 메시지
    popUpMessage    = new ReactiveVar('');

    flag = new ReactiveVar(false);
});

Template.glyAppEntry.onRendered(function() {

    Meteor.clientCommonUtils.scrollToClass('subTit__inner');
});

Template.glyAppEntry.events({
    'keyup input[name=homeUrl]'(evt, tmpl) {
        var evtTarget = $(evt.target);
        evtTarget.val(Meteor.clientCommonUtils.emailConsistency(evtTarget.val()));
    },
    'keyup input[name=smaEmail]'(evt, tmpl) {
        var evtTarget = $(evt.target);
        evtTarget.val(Meteor.clientCommonUtils.emailConsistency(evtTarget.val()));
    },
    'input input[name=smaPhone1]'(evt, tmpl) {
        maxLengthCheck(evt.currentTarget);
    },
    'input input[name=smaPhone2]'(evt, tmpl) {
        maxLengthCheck(evt.currentTarget);
    },
    'input input[name=smaPhone3]'(evt, tmpl) {
        maxLengthCheck(evt.currentTarget);
    },
    'click .popup-close'(evt, tmpl) {
    },
    'click button[name=bsNumChk]' (evt, tmpl) {
        var bNum = $('input[name=bNum1]').val() + $('input[name=bNum2]').val() + $('input[name=bNum3]').val();
        Meteor.call('companyRegNumChk', bNum, function(err, res) {
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
            } else {
                var resData = {
                    chk : true,
                    message : '이미 등롱된 사업자 번호 입니다.'
                };
                bnsNumChk.set(resData);
            }
        });
    },
    'click button[name=bnsSubmit]'() {
        var companyNm   = $('input[name=companyNm]').val();
        var smaNm       = $('input[name=smaNm]').val();
        var smaPhone1   = $('input[name=smaPhone1]').val();
        var smaPhone2   = $('input[name=smaPhone2]').val();
        var smaPhone3   = $('input[name=smaPhone3]').val();
        var smaPhone    = '';
        var smaEmail    = $('input[name=smaEmail]').val();
        var glyNm       = $('input[name=glyNm]').val();
        var zipCode     = $('input[name=zipCode]').val();
        var address     = $('input[name=address]').val();
        var detail      = $('input[name=detail]').val();
        var homeUrl     = $('input[name=homeUrl]').val();
        smaPhone = smaPhone1 + smaPhone2 + smaPhone3;

        if(companyNm === '') {
            messagePopup({message : '회사이름을 입력해주세요'}); Meteor.clientCommonUtils.scrollToName('companyNm');
        } else if(!bnsNumberVal.get()) {
            messagePopup({message : '사업자번호를 확인해 주세요'});
            Meteor.clientCommonUtils.scrollToName('companyNm');
        } else if(smaNm === '') {
            messagePopup({message : '담당자 이름을 입력해주세요'});
            Meteor.clientCommonUtils.scrollToName('smaNm');
        } else if(!regExpPhone.test(smaPhone)) {
            messagePopup({message : '담당자 전화번호를 정확히 입력해주세요'});
            Meteor.clientCommonUtils.scrollToName('smaPhone');
        } else if(smaEmail === '') {
            messagePopup({message : '담당자 이메일을 입력해주세요'});
            Meteor.clientCommonUtils.scrollToName('smaEmail');
        } else if(!regExpEmail.test(smaEmail)) {
            messagePopup({message : '이메일을 정확하게 입력해주세요'});
            Meteor.clientCommonUtils.scrollToName('smaEmail');
        } else if(glyNm === '') {
            messagePopup({message : '갤러리 이름을 입력해주세요'});
            Meteor.clientCommonUtils.scrollToName('glyNm');
        } else if(zipCode === '') {
            messagePopup({message : '주소를 입력해주세요'});
            Meteor.clientCommonUtils.scrollToName('zipCode');
        } else if(address === '') {
            messagePopup({message : '주소를 입력해주세요'});
            Meteor.clientCommonUtils.scrollToName('address');
        } else {
            var _id = Meteor.commonUtils.generateUUID();
            
            var rendomPass = Random.hexString(13);
            var toDate = moment(new Date()).format('YYYYMMDD');

            var bsnsData = {
                uInfos : {
                    bsnsTp  : '001',
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
                    bsnsChagEmail : smaEmail,
                    glryImage : "/image/main/img-mainSlide--gallery--0101.png",
                    insDt : toDate,
                    ctrt : {
                        stndPntReqID : '',
                        ctrtInfo : ''
                    },
                    rprsnAtwrk: [],
                    rprsnAtst: [],
                    ntcn: [],
                    getNtcn : []
                }
            };
    
            var uEmail = smaEmail;
            var id = bsnsID.get();
    
            Accounts.createUser({
                email : smaEmail,
                password : rendomPass,
                profile : bsnsData
            }, function(error) {
                if(error) console.log(error);
                else {
                    // messagePopup({message : '계정 생성 및 메시지 전송까지 3초정도 소요됩니다.'});
    
                    Meteor.logout(function(err) {
                        if(err) console.log(err) 
                        else {
                            sessionStorage.removeItem('art_dex');
                            sessionStorage.removeItem('art_session_index');
                        }
                    });
    
                    Meteor.call('passSendUpdStndPntReq', id);
    
                    Meteor.call('sendEmail', {
                        to: uEmail,
                        from: 'patrick@5node.co.kr',
                        subject: "[SJLab] 갤러리(관리자) 임시 비밀번호 입니다.",
                        text: '계정 : ' + uEmail + '\n'
                        + '임시 비밀번호 :' + rendomPass
                    }, function(err, res) {
                        if(err) console.log('send email : ', err);
                        else {
                            FlowRouter.go('/login');
                            alert('임시 비밀번호를 메일로 전송하였습니다.');
                        }
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
