import { Random } from 'meteor/random'; 

import './changeMberInfo.html';
import '../popup/utilsPopUp.js';

// 배송지 리스트 팝업
import './deliveryList.js';
import './deliveryReg.js';
import './deliveryEdit.js';
import '../popup/userPop/withDrawalUser.js';
import '../popup/utilsPopUp.js';

const nikChk = /([^가-힣a-z\x20])/i;      // 한글 모음, 자음만 있을때 체크
const reg = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi;
const emailChkVal = new RegExp('[a-z0-9]+@[a-z0-9]+\.[a-z]{2,3}');

// 팝업 메시지 띄우기
function messagePopup(message) {
    popUpMessage.set(message);
    $('#utilsPopUp').addClass('is-open');
}

Template.changeMberInfo.onCreated(function() {
    uProfile = new ReactiveVar();

    uInfo = new ReactiveVar();

    // 프로필 변경 플래그
    imageChgFlag = new ReactiveVar(false);

    // 비밀번호 변경 플래그
    passChgFlag = new ReactiveVar(false);

    // 닉네임 변경 플래그
    nicNmChgFlag = new ReactiveVar(false);

    // 이메일 변경 플래그
    emailChgFlag = new ReactiveVar(false);

    // 닉네임 보조설명
    nicSubDesc = new ReactiveVar('');

    // 이메일 인증코드 전송시 true
    sendDoneEmail = new ReactiveVar(false);

    // 확인용 인증코드 저장
    emailAuthCode = new ReactiveVar();

    // 인증하기 버튼 클릭시 true 로 변경
    emailSend = new ReactiveVar(false);

    // 리밋 시간초
    timeValue = new ReactiveVar();

    // 인터벌 Id
    timerId = new ReactiveVar();

    // 프로필 이미지 URL
    imgUrl = new ReactiveVar();
    
    this.autorun(() => {
        const userData = Meteor.user();
        if(userData != undefined) {
            uProfile.set(userData);
            uInfo.set(userData.profile.uInfos);
            nicSubDesc.set('현재 닉네임 : ' + uInfo.get().nicNm);
        }
    });
});

Template.changeMberInfo.onRendered(function() {
});

Template.changeMberInfo.events({
    'click button[name=passChg]'(evt, tmpl) {
        var nowPass = $('input[name=nowPass]').val();
        var newPass = $('input[name=newPass]').val();
        var newRePass = $('input[name=newRePass]').val();

        if(nowPass == '' || newPass == '' || newRePass == '') messagePopup({message : '비밀번호를 입력해주세요'});
        else {
            if(newPass === newRePass) {
                Accounts.changePassword(nowPass, newPass, function(error) {
                    if(error) {
                        console.log(error);
                        messagePopup({message : '현재 비밀번호를 잘못 입력하셨습니다.'});
                    } else {
                        $('button[name=passChgCancel]').click();
                        messagePopup({message : '비밀번호가 변경되었습니다.'});
                    }
                });
            } else messagePopup({message : '신규 비밀번호가 다릅니다.'});
        }
    },
    'keyup input[name=nicNmInput]'(evt, tmpl) {
        var nickName = $(evt.currentTarget);
        nickName.val(nickName.val().trim());
        nickName.val(nickName.val().replace(reg, ''));

        var nickNmVal = nickName.val();

        var cnt = uInfo.get().nicNmChgCnt;
        
        var nicChk = '';

        if(cnt == 4) {
            redColors();
            btnSetting(true);
            nicSubDesc.set('이번달은 닉네임 변경이 불가합니다.');
        } else {
            Meteor.call('nicNmChk', nickNmVal, function(err, res){
                nicChk = res;
                if(nickNmVal == '') {
                    redColors();
                    btnSetting(true);
                    nicSubDesc.set('닉네임을 입력해주세요');
                } else if(nickNmVal.length < 2) {
                    redColors();
                    btnSetting(true);
                    nicSubDesc.set('2글자 이상이여야 합니다.');
                } else if(nickNmVal.length > 15) {
                    redColors();
                    btnSetting(true);
                    nicSubDesc.set('15글자 초과하였습니다.');
                }  else if(nicChk) {
                    redColors();
                    btnSetting(true);
                    nicSubDesc.set('중복된 닉네임이 있습니다.');
                } else {
                    $('#subNicDesc').css({'color' : '#007aff'});
                    nicSubDesc.set('사용가능한 닉네임 입니다.');
                    btnSetting(false);
                }
            });
        }
    },
    'click button[name=nicNmChg]'(evt, tmpl) {
        var nicNm = $('input[name=nicNmInput]').val();
        Meteor.call('nicNmUpdate', nicNm, function(err, res) {
            if(err) console.log(err);
            else {
                console.log(res);
                messagePopup({message : '닉네임 변경이 완료되었습니다.'});
                $('button[name=passChgCancel]').click();
            }
        });
    },
    'click button[name=imgChgBtn]' (evt, tmpl) {
        imageChgFlag.set(true);
    },
    'click button[name=passChgBtn]' (evt, tmpl) {
        passChgFlag.set(true);
    },
    'click button[name=nicNmChgBtn]' (evt, tmpl) {
        nicNmChgFlag.set(true);
        $('input[name=nicNmInput]').focus();
    },
    'click button[name=emailChgBtn]' (evt, tmpl) {
        emailChgFlag.set(true);
    },
    'click button[name=phChgBtn]' (evt, tmpl) {
        messagePopup({message : '화면 준비중 입니다.'});
    },
    'click button[name=kakaoLogin]' (evt, tmpl) {
        messagePopup({message : '소셜 로그인 연동 준비중입니다.'});
    },
    'click button[name=imgChgCancel]' (evt, tmpl) {
        // 프로필 이미지 변경 취소
        imageChgFlag.set(false);
    },
    'click button[name=passChgCancel]' (evt, tmpl) {
        // 비밀번호 변경 취소
        passChgFlag.set(false);
    },
    'click button[name=nicNmChgCancel]' (evt, tmpl) {
        // 닉네임 변경 취소
        nicNmChgFlag.set(false);
        nicSubDesc.set('현재 닉네임 : ' + uInfo.get().nicNm);
    },
    'click button[name=defDeliEdit]'(evt, tmpl) {
        $('#deliveryEdit_popup').addClass('is-open');

        var defadres = {};
        var deliv = uInfo.get().deliv;
        deliv.forEach(function(val, num) {
            if(val.defDelivYn === 'Y') defadres = val;
        });

        var mobList = defadres.mob.split(' ');
        var hPhoneList = defadres.mob.split(' ');
        var delivEtc = defadres.delivReqEtc != undefined ? defadres.delivReqEtc : '';

        editDelivData.set(defadres);

        $('input[name=editRecptnNm]').val(defadres.recptnNm);
        $('input[name=editDelivNm]').val(defadres.delivNm);
        $('input[name=editMob1]').val(mobList[0]);
        $('input[name=editMob2]').val(mobList[1]);
        $('input[name=editMob3]').val(mobList[2]);
        $('input[name=editHomePhone1]').val(hPhoneList[0]);
        $('input[name=editHomePhone2]').val(hPhoneList[1]);
        $('input[name=editHomePhone3]').val(hPhoneList[2]);
        $('input[name=editZipCode]').val(defadres.zipCd);
        $('input[name=editAddress]').val(defadres.addr1);
        $('input[name=editAddr2]').val(defadres.addr2);
        $('input[name=editDelivReqEtc]').val(delivEtc);

        if(defadres.defDelivYn == 'Y') {
            $('#check-addrWrite--default-edit').prop('checked', defadres.defDelivYn == 'Y');
            defDelivYn.set(true);
        } else {
            $('#check-addrWrite--default-edit').prop('checked', false);
            defDelivYn.set(false);
        }

        if(hPhoneList.length == 0) {
            $('#check-addrWrite--no-edit').prop('checked', hPhoneList.length == 0);
            $('#check-addrWrite--no-edit').prop('disabled', ture);
        } else $('#check-addrWrite--no-edit').prop('checked', false);
    },
    // 이메일 주소 입력폼
    'keyup input[name=email]'(evt, tmpl) {
        if (!(evt.keyCode >=37 && evt.keyCode<=40)) {     
            var inputVal = $(evt.currentTarget).val();
            $(evt.currentTarget).val(inputVal.replace(/[^a-z0-9-_.@]/gi,''));
            let emlChk = emailChkVal.test(inputVal);
            emailBtnChg(emlChk);
        }
    },
    // 이메일 인증하기 버튼
    'click button[name=emailSendBtn]' (evt, tmpl) {
        var inputVal = $('input[name=email]').val();
        Meteor.call('chgEmailChk', inputVal, function(err, res) {
            if(res != undefined) messagePopup({message : '이미 존재하는 이메일입니다.'});
            else {
                var code = Random.hexString(6);

                var email = $('input[name=email]');
                email.prop('disabled', true);

                emailBtnChg(false);

                emailTimeChk();

                Meteor.call('sendEmail', {
                    to: inputVal,
                    from: 'patrick@5node.co.kr',
                    subject: '[SJLab] 이메일 변경 인증 코드 입니다.',
                    text: '이메일 인증 코드 : ' + code
                }, function() {
                    sendDoneEmail.set(true);
                    emailAuthCode.set(code);
                    $('button[name=emailAuthChk]').css({'background-color' : '#007aff;'});
                    $('button[name=emailAuthChk]').prop('disabled', false);
                });

                messagePopup({message : '이메일이 전송되었습니다.'});
            }
        });
    },
    // 이메일 코드 재전송
    'click a[name=reSendEmail]'(evt, tmpl) {
        if(emailAuthCode.get() != undefined) {
                var inputVal = $('input[name=email]').val();

                var code = Random.hexString(6);

                emailTimeChk(true);

                Meteor.call('sendEmail', {
                    to: inputVal,
                    from: 'patrick@5node.co.kr',
                    subject: '[SJLab] 이메일 변경 인증 코드 입니다.',
                    text: '이메일 인증 코드 : ' + code
                }, function() {
                    sendDoneEmail.set(true);
                    emailAuthCode.set(code);
                    $('button[name=emailAuthChk]').css({'background-color' : '#007aff;'});
                    $('button[name=emailAuthChk]').prop('disabled', false);
                });
        } else messagePopup({message : '이메일 전송 후 클릭해주세요'});
    },
    // 이메일 코드 확인
    'click button[name=emailAuthChk]'(evt, tmpl) {
        var userEmailCode = $('input[name=emailCode]').val();

        if(emailAuthCode.get() === userEmailCode && timeValue.get() != '시간초과') {
            emailSend.set(true);

            var email = $('input[name=email]').val();

            Meteor.call('uEmailUpd', email, function(err, res) {
                if(err) console.log(err);
                else {
                    messagePopup({message : '인증되었습니다. \n 이메일이 변경되었습니다.'});
                    emailChgFlag.set(false);
                    emailAuthCode.set();
                }
            });
        } else {
            messagePopup({
                message : timeValue.get() != '시간초과' ? '코드가 올바르지 않습니다.' : '코드입력 시간이 초과하였습니다.'
            });
        }
    },
    // 프로필 사진선택 버튼 이벤트
    'click button[name=seltImg]'(evt, tmpl) {
        $('input[name=img-upload]').click();
    },
    // 이미지 업로드 이벤트
    'change input[name=img-upload]'(evt, tmpl) {
        var fileReader = new FileReader();
        var fileName = evt.currentTarget.files[0].name;
        var type = evt.currentTarget.files[0].type;
        

        var pathPoint = evt.currentTarget.value.lastIndexOf('.');
        var pointFile = evt.currentTarget.value.substring(pathPoint + 1, evt.currentTarget.value.length);
        var fileType = pointFile.toLowerCase();

        var file = evt.currentTarget.files[0];

        if(type.indexOf('image/') > -1) {
            fileReader.onload = (file) => {
                var image = {
                    blob : file.srcElement.result,
                    name : fileName,
                    encoding : 'binary'
                };
                Meteor.call('saveFile', image, function(err, res) {
                    if(err) console.log(err);
                    else imgUrl.set(res.fileName);
                    Meteor.call('uProfileImgChg', imgUrl.get(), function(err, res) {
                        if(err) console.log(err);
                        else console.log(res);
                    })
                });
            };
            fileReader.readAsBinaryString(file);
        } else {
            alert('이미지 파일만 업로드 해주세요'); 
        }
    
    },
});

// 이메일 코드 입력시간 체크
function emailTimeChk(reSendFlag) {
    if(reSendFlag) {
        clearInterval(timerId.get());
        // Meteor.clearInterval(x);
        timeValue.set();
    }

    var time = 180;
    var min = '';
    var sec = ''; 
    var result = '';

    var x = setInterval(() => {
        timerId.set(x);
        min = parseInt(time / 60);
        sec = time % 60;
        
        result = min + ':' + (sec < 10 ? '0' + sec : sec);
        time--;

        if(time < 0) {
            clearInterval(x);
            result = '시간초과';
        }
        timeValue.set(result);
    }, 1000); 

    return result;
}

function redColors() {
    // $('input[name=nicNmInput]').css({'border-color' : 'red'});
    $('#subNicDesc').css({'color' : 'red'});
}

// 닉네임 버튼 활성/비활성
function btnSetting(flag) {
    if(flag) {
        $('button[name=nicNmChg]').prop('disabled', flag);
        $('button[name=nicNmChg]').css({'background-color': '#D9D9D9', 'color' : '#585858', 'border' : '1px solid #b9b9b9'});
    } else {
        $('button[name=nicNmChg]').prop('disabled', flag);
        $('button[name=nicNmChg]').css({'background-color': '#007aff', 'color' : '#FFF', 'border' : '0px'});
    }
}

// 이메일 인증 버튼 활성/비활성
function emailBtnChg(emlChk) {
    var eamilBtn = $('button[name=emailSendBtn]');
    if(emlChk) {
        eamilBtn.removeClass('bg--silver');
        eamilBtn.css({'background-color': '#007aff'});
        eamilBtn.prop('disabled', false);
    } else {
        eamilBtn.css({'background-color': ''});
        eamilBtn.addClass('bg--silver');
        eamilBtn.prop('disabled', true);
    }
}

Template.changeMberInfo.helpers({
    uInfo() {
        if(uInfo.get() != undefined) {
            var res = uInfo.get();
            res.ID = uProfile.get().emails[0].address;
            console.log(res);
            return res;
        }
    },
    nmChk(nm) {
        return nm != undefined ? true : false;
    },
    maskingEmail(email) {
        var originStr = email;

        var emId = "*".repeat(email.split("@")[0].length -2);
        
        var addr = originStr.toString().split('@')[1].split('.')[0];

        return email[0] + email[1] + emId + '@' + addr.replace(/[a-zA-Z0-9._-]/g, '*') + '.com';
    },
    emailChk(cert) {
        return cert === 'Y' ? true : false;
    },
    emailSend() {
        return emailSend.get();
    },
    defDelivYn() {
        var res = false;
        if(uInfo.get() != undefined) {
            var deliv = uInfo.get().deliv;
            deliv.forEach(function(val, num) {
                if(val.defDelivYn === 'Y') res = val;
            });
            return res;
        }
    },
    mobMasking(data) {
        return  Meteor.clientCommonUtils.mobMasking(Meteor.clientCommonUtils.mobHyphen(data));
    },
    imageChgFlag() {
        return imageChgFlag.get();
    },
    passChgFlag() {
        return passChgFlag.get();
    },
    nicNmChgFlag() {
        return nicNmChgFlag.get();
    },
    emailChgFlag() {
        return emailChgFlag.get();
    },
    nicSubDesc() {
        return nicSubDesc.get();
    },
    thisMChgNic() {
        return (4 - uInfo.get().nicNmChgCnt);
    },
    emailTimer() {
        return timeValue.get();
    },
});