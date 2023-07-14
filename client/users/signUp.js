import { Random } from 'meteor/random';

// 메인 회원가입 화면
import './signUp.html';

// 팝업창
import '../popup/termMarketing.js';
import '../popup/termPersonal.js';
import '../popup/termUse.js';
import '../popup/utilsPopUp.js';

var passChk = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,25}$/; // 비밀번호 정규표현식 8자리 영문, 숫자 포함
var nikChk = /([^가-힣a-z\x20])/i;                  // 한글 모음, 자음만 있을때 체크

Template.signUp.onCreated(function() {
    sendToEmail     = new ReactiveVar(false);   // 이메일 보낸는지 확인 여부
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
});

Template.signUp.onRendered(function() {
});

Template.signUp.events({
    // 회원가입 버튼 누를경우 유효성 검사 및 가입시키기
    'click button[name=sginUp]'() {
        var terms = $('input[name=essChk]:checked').length;
        if(!emailChk.get())         messagePopup({message : '이메일을 확인하세요.'});
        else if(!passwordChk.get()) messagePopup({message : '비밀번호를 확인하세요'});
        else if(!nikNameChk.get())  messagePopup({message : '닉네임을 확인하세요'});
        else if(terms < 3)          messagePopup({message : '약관(필수) 항목을 전부 동의해주세요'});
        else {
            Meteor.call('createMBer', {
                email   : emailValue.get(), 
                pwd     : passwordValue.get(),
                nicNm   : nicNmValue.get(),
            }, function(err, res) {
                if(res != undefined) {
                    messagePopup({
                        message : '회원가입이 완료 되었습니다.',
                        route : 'login',
                        type: ''
                    });
                }
            });
        }
    },
    //  이메일
    'click button[name=emailSend]'() {
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
            emailValue.set(email + '@' + address);
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
        }
    },
    // 닉네임
    'change input[name=nickName]'() {
        // 닉네임 체크
        var nickName = $('input[name=nickName]').val();
        if(nikChk.test(nickName) || (nickName.length < 2 || nickName.length > 15)) {
            messagePopup({message : '닉네임 형식이 올바르지 않습니다.'});
        } else {
            Meteor.call('nickNameDuplicationChk', nickName, function(err, res) {
                if(res != undefined) {
                    messagePopup({message : '중복된 닉네임이 있습니다.'});
                } else {
                    nikNameChk.set(true);
                    nicNmValue.set(nickName);
                }
            });
        }
    },
    // 약관
    'click input[name=allCheck]'() {
        // 전체동의
        $('input[name=chk]').prop("checked", $('input[name=allCheck]').prop("checked"));
        $('input[name=essChk]').prop("checked", $('input[name=allCheck]').prop("checked"));
    }

});

function emailSendToUser() {
    var email =  $('input[name=email]').val();
    var address = $('select[name=emailSelect]').val();
    if(email != '' && address != '') {
        var code = Random.hexString(6);
        Meteor.call('sendEmail', {
            to: email + '@' + address,
            from: 'patrick@5node.co.kr',
            subject: '[Influx] 회원가입 이메일 인증 코드 입니다.',
            text: '이메일 인증 코드 : ' + code
        }, function() {
            messagePopup({message : '이메일이 전송되었습니다.'});
            emailAuthCode.set(code);
            sendToEmail.set(true);
            emailTimeChk();
        });    
    } else {
        messagePopup({message : '이메일을 정확하게 입력해주세요.'});
    }
}

function emailTimeChk(reSendFlag) {
    if(reSendFlag) {
        Meteor.clearInterval(x);
        timeValue.set();
    }

    var time = 180;
    var min = '';
    var sec = '';
    var result = '';

    var x = Meteor.setInterval(function() {
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
    }
});
