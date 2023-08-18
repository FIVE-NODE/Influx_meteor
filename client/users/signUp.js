import { Random } from 'meteor/random';
import { Accounts } from 'meteor/accounts-base';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

// 메인 회원가입 화면
import './signUp.html';

// 팝업창
import '../popup/termMarketing.js';
import '../popup/termPersonal.js';
import '../popup/termUse.js';
import '../popup/utilsPopUp.js';

var passChk = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,25}$/; // 비밀번호 정규표현식 8자리 영문, 숫자 포함
var nikChk = /([^가-힣a-z\x20])/i;                  // 한글 모음, 자음만 있을때 체크
var emailChkVal = new RegExp('[a-z0-9]+@[a-z0-9]+\.[a-z]{2,3}');

Template.signUp.onCreated(function() {
    sendToEmail     = new ReactiveVar(true);    // 이메일 버튼 
    sendDoneEmail   = new ReactiveVar(false);   // 이메일 보냈다면 true
    sendToEmail     = new ReactiveVar(true);    // 이메일 보낸는지 확인 여부
    emailCodeChk    = new ReactiveVar(true);    // 이메일 확인 버튼 활성/비활성 용
    emailAuthCode   = new ReactiveVar();        // 확인용 코드 저장
    timeValue       = new ReactiveVar();        // 리밋 시간초

    emailValue      = new ReactiveVar('');      // 이메일 저장용
    passwordValue   = new ReactiveVar('');      // 비밀번호 확인시 저장용
    nicNmValue      = new ReactiveVar('');      // 닉네임 저장용

    popUpMessage    = new ReactiveVar('');      // 팝업 메시지

    emailChk        = new ReactiveVar(false);   // 이메일 확인 체크
    passwordChk     = new ReactiveVar(false);   // 비밀번호 벨리데이션 및 재확인 결과 체크
    nikNameChk      = new ReactiveVar(false);   // 닉네임 최종 결과 체크
    termChk         = new ReactiveVar(false);   // 약관(필수) 동의 체크

    emailSelf       = new ReactiveVar(false);   // 이메일 직접 입력 선택

    timerId         = new ReactiveVar();        // 인터벌 Id

    Meteor.subscribe('userData');
});

Template.signUp.onRendered(function() {
});

Template.signUp.events({
    'click a[name=naverSig]'(evt, tmpl) {
        messagePopup({message : '네이버 연동 준비중 입니다.'});
    },
    'click a[name=kakaoSig]'(evt, tmpl) {
        messagePopup({message : '카카오 연동 준비중 입니다.'});
    },
    // 회원가입 버튼 누를경우 유효성 검사 및 가입시키기
    'click button[name=sginUp]'() {
        var terms = $('input[name=essChk]:checked').length;

        if(!emailChk.get())         messagePopup({message : '이메일을 확인하세요.'});
        else if(!passwordChk.get()) messagePopup({message : '비밀번호를 확인하세요'});
        else if(!nikNameChk.get())  messagePopup({message : '닉네임을 확인하세요'});
        else if(terms < 3)          messagePopup({message : '약관(필수) 항목을 전부 동의해주세요'});
        else {
            Accounts.createUser({
                _id : Meteor.commonUtils.generateUUID(),
                email : emailValue.get(),
                password : passwordValue.get(),
                profile : {
                    uInfos : {
                        "nicNmChgMM": "",
                        "pwChgDt": "",
                        "mob": "",
                        "ntcn": [
                        ],
                        "addr2": "",
                        "recptnYn": "",
                        "addr1": "",
                        "memYn": "",
                        "secsnTp": "",
                        "deliv": [
                        ],
                        "zipCd": "",
                        "dtPrtGood": [
                        ],
                        "ogPrtGood": [
                        ],
                        "dtPrtView" : [
                        ],
                        "ogPrtView" : [
                        ],
                        "cart": [
                        ],
                        "nicNmChgCnt": 0,
                        "secsnDt": "",
                        "pfImg": "",
                        "secsnRsn": "",
                        "nicNm": nicNmValue.get(),
                        "nm": "",
                        "cid": ""
                    }
                }
            }, function(err, res) {
                if(err) console.log(err);
                else {
                    Meteor.logout(function(error) {
                        if(error) console.log(error);
                        else {
                            sessionStorage.removeItem('art_dex');
                            sessionStorage.removeItem('art_session_index');
                            FlowRouter.go('/login');
                            alert('회원가입이 완료되었습니다.');
                        }
                    });
                }
            });
        }
    },
    //  이메일
    'click button[name=emailSend]'(evt, tmpl) {
        // 이메일 전송
        emailSendToUser();
    },
    'click button[name=emailAuthChk]'() {
        // 이메일 코드 확인
        var userEmailCode = $('input[name=userEmailCode]').val();

        if(emailAuthCode.get() === userEmailCode && timeValue.get() != '시간초과') {
            var email =  $('input[name=email]').val();
            var address = $('select[name=emailSelect]').val();


            emailChk.set(true);
            if(emailSelf.get()) emailValue.set(email + '@' + $('#selfEmAdrs').val());
            else emailValue.set(email + '@' + address);

            console.log(emailValue.get());

            $('select[name=emailSelect]').attr('disabled', true);
            $('#selfEmAdrs').attr('disabled', true);
            $('input[name=email]').attr('disabled', true);
            $('button[name=emailAuthChk]').attr('disabled', true);
            $('input[name=userEmailCode]').attr('disabled', true);
            $('input[name=emailAuthChk]').css({'background-color' : 'rgba(24, 104, 183, 0.5)'});

            messagePopup({message : '인증되었습니다.'});
        } else {
            messagePopup({
                message : timeValue.get() != '시간초과' ? '코드가 올바르지 않습니다.' : '코드입력 시간이 초과하였습니다.'
            });
        }
    },
    'click a[name=emailReSend]'() {
        // 이메일 코드 재전송
        emailSendToUser(true);
    },
    // 비밀번호
    'change input[name=password]'() {
        // 입력한 비밀번호
        var pass = $('input[name=password]').val();
        if(!passChk.test(pass)) {
            messagePopup({message : '비밀번호는 영문, 숫자 8자리 입니다.'});
        } else {
            var passReChk = $('input[name=passwordChk]').val();
            if(passReChk != '') {
                if(passReChk === pass) {
                    passwordChk.set(true);
                    messagePopup({message : '비밀번호가 일치 합니다.'});
                }
                else {
                    passwordChk.set(false);
                    messagePopup({message : '비밀번호가 일치 하지 않습니다.'});
                }
            }   
            passwordValue.set(pass);
        }
    },
    'change input[name=passwordChk]'() {
        // 재입력 비밀번호
        var pass = $('input[name=passwordChk]').val();
        if(pass === passwordValue.get()) {
            messagePopup({message : '비밀번호가 일치 합니다.'});
            passwordChk.set(true);
        } else {
            messagePopup({message : '비밀번호가 일치 하지 않습니다.'});
            passwordChk.set(false);
        }
    },
    // 닉네임
    'change input[name=nickName]'() {
        // 닉네임 체크
        var nickName = $('input[name=nickName]').val();
        if(nikChk.test(nickName) || (nickName.length < 2 || nickName.length > 15)) {
            messagePopup({message : '닉네임 형식이 올바르지 않습니다.'});
        } else {
            Meteor.call('nicNmChk', nickName, function(err, res) {
                if(res != undefined) {
                    messagePopup({message : '중복된 닉네임이 있습니다.'});
                } else {
                    nikNameChk.set(true);
                    nicNmValue.set(nickName);
                }
            });
        }
    },
    'change select[name=emailSelect]'(evt, tmpl) {
        // 이메일 주소 직접입력 이벤트
        var address = $(evt.currentTarget).val();
        var uEmail = $('input[name=email]').val();
        
        if(address == '직접입력') {
            emailSelf.set(true);
            emailBtnChg(false);
            setTimeout(function() { $("#selfEmAdrs").focus(); }, 100);
        } else {
            let emlChk = emailChkVal.test(uEmail + '@' + address);
            emailBtnChg(emlChk);
            emailSelf.set(false);
        }
    },
    'keyup input[name=email]'(evt, tmpl) {
        if (!(evt.keyCode >=37 && evt.keyCode<=40)) {     
            var inputVal = $(evt.currentTarget).val();
            $(evt.currentTarget).val(inputVal.replace(/[^a-z0-9-_.]/gi,''));

            var address = $('select[name=emailSelect]').val() != undefined ? 
            $('select[name=emailSelect]').val() : $('input[name=emailSelect]').val();
            var uEmail = $(evt.currentTarget).val();
            let emlChk = emailChkVal.test(uEmail + '@' + address);
            emailBtnChg(emlChk);
        }
    },
    'keyup input[name=emailSelect]'(evt, tmpl) {
        if (!(evt.keyCode >=37 && evt.keyCode<=40)) {     
            var inputVal = $(evt.currentTarget).val();
            $(evt.currentTarget).val(inputVal.replace(/[^a-z0-9-_.]/gi,''));

            var address = $(evt.currentTarget).val(); 
            var uEmail = $('input[name=email]').val();
            let emlChk = emailChkVal.test(uEmail + '@' + address);
            emailBtnChg(emlChk);
        }
    },
    // 약관
    'click input[name=allCheck]'() {
        // 전체동의
        $('input[name=chk]').prop("checked", $('input[name=allCheck]').prop("checked"));
        $('input[name=essChk]').prop("checked", $('input[name=allCheck]').prop("checked"));
    }
});

// 이메일 인증 버튼 활성/비활성
function emailBtnChg(emlChk) {
    var eamilBtn = $('button[name=emailSend]');
    if(emlChk) {
        eamilBtn.removeClass('btn--gray');
        eamilBtn.addClass('btn--blue');
        $('button[name=emailSend]').css({'color' : '#fff'});
        sendToEmail.set(false);
    } else {
        eamilBtn.removeClass('btn--blue');
        eamilBtn.addClass('btn--gray');
        $('button[name=emailSend]').css({'color' : '#b9b9b9'});
        sendToEmail.set(true);
    }
}

function emailSendToUser() {
    var email =  $('input[name=email]').val();   
    var address = $('select[name=emailSelect]').val() == undefined ?
    $('input[name=emailSelect]').val() : $('select[name=emailSelect]').val();

    if(email != '' && address != '') {
        // 등록된 이메일인지 확인
        Meteor.call('seltEmailChk', email + '@' + address, function(err, res) {
            if(res == undefined) {
                var code = Random.hexString(6);
                sendToEmail.set(true);

                var eamilBtn = $('button[name=emailSend]');
                eamilBtn.removeClass('btn--blue');
                eamilBtn.addClass('btn--gray');
                $('button[name=emailSend]').css({'color' : '#b9b9b9'});

                emailTimeChk();
                $('button[name=emailAuthChk]').css({'background-color' : '#1868B7'});
                emailCodeChk.set(false);

                Meteor.call('sendEmail', {
                    to: email + '@' + address,
                    from: 'patrick@5node.co.kr',
                    subject: '[SJLab] 회원가입 이메일 인증 코드 입니다.',
                    text: '이메일 인증 코드 : ' + code
                }, function() {
                    sendDoneEmail.set(true);
                    emailAuthCode.set(code);
                });
                messagePopup({message : '이메일이 전송되었습니다.'});
            } else {
                messagePopup({message : '이미 등록된 이메일 입니다.'});
                // setTimeout(function() { $('input[name=email]').focus(); }, 200);
            }
        });
    } else {
        messagePopup({message : '이메일을 정확하게 입력해주세요.'});
    }
}

function emailTimeChk(reSendFlag) {
    if(reSendFlag) {
        Meteor.clearInterval(timerId.get());
        timeValue.set();
    }

    var time = 180;
    var min = '';
    var sec = ''; 
    var result = '';

    var x = Meteor.setInterval(function() {
        timerId.set(x);
        
        min = parseInt(time / 60);
        sec = time % 60;
        
        result = min + ':' + (sec < 10 ? '0' + sec : sec);
        time--;

        if(time < 0) {
            Meteor.clearInterval(x);
            result = '시간초과';
        }
        timeValue.set(result);
    }, 1000); 

    return result;
}

// 팝업 메시지 띄우기
function messagePopup(message) {
    popUpMessage.set(message);
    $('#utilsPopUp').addClass('is-open');
}

Template.signUp.helpers({
    emailSendFlag() {
        return sendToEmail.get();
    },
    emailTimer() {
        return timeValue.get();
    },
    emailChk() {
        return emailChk.get();
    },
    popup() {
        return popUpMessage.get();
    },
    emailSelfChk() {
        return emailSelf.get();
    },
    emailCodeChk() {
        return emailCodeChk.get();
    },
    sendDoneEmail() {
        return sendDoneEmail.get();
    }
});
