import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { Random } from 'meteor/random';

import './login.html';
import '../popup/utilsPopUp.js';

const emailChkVal = new RegExp('[a-z0-9]+@[a-z0-9]+\.[a-z]{2,3}');

Template.login.onCreated(function() {
    loginFlag = new ReactiveVar(true);

    popUpMessage = new ReactiveVar();

    emailSchMessage = new ReactiveVar();

    authMessage = new ReactiveVar('');

    emailAuthCode = new ReactiveVar();

    sendDoneEmail = new ReactiveVar(false);

    passAuthCode = new ReactiveVar();

    chkValus = new ReactiveVar();
});

Template.login.onRendered(function() {

});

Template.login.events({
    // 로그인 옵션 1 가입회원
    'click a[name=user]'() {
        loginFlag.set(true);
    },
    // 로그인 옵션 2 비회원
    'click a[name=nouser]'() {
        loginFlag.set(false);
    },
    'click button[name=seltOrder]'(evt, tmpl) {
        // 비회원 주문내역 조회
        messagePopup({message : '화면 준비중 입니다.'});
    },
    'click button[name=kakaoLogin]'(evt, tmpl) {
        // 카카오 로그인
        messagePopup({message : '소셜로그인 준비중입니다.'});
    },
    'click button[name=naverLogin]'(evt, tmpl) {
        // 네이버 로그인
        messagePopup({message : '소셜로그인 준비중입니다.'});
    },
    'click button[name=loginBtn]'(evt, tmpl) {
        if(loginFlag.get()) {
            var email = $('input[name=loginEmail]').val();
            var pwd = $('input[name=loginPwd]').val();

            // 로그인
            if(!emailChkVal.test(email) && !isNaN(email)) {
                Meteor.call('seltCompanyNum', email, function(err, res) {
                    if(err) console.log(err);
                    else {
                        if(res == undefined) messagePopup({message : '등록되지 않은 사업자 번호 입니다.'});
                        else {
                            var emailAddr = res.emails[0].address;
                            Meteor.loginWithPassword(emailAddr, pwd, function(err, res) {
                                if(err) messagePopup({message : '비밀번호를 확인해주세요'});
                                else FlowRouter.go('aOne');
                            });
                        }
                    }
                });
            } else {
                Meteor.loginWithPassword(email, pwd, function(err, res) {
                    if(err) {
                        console.log(err.reason);
                        messagePopup({message : '아이디 또는 비밀번호를 확인해주세요'});
                    }
                    else {
                        FlowRouter.go('aOne');
                    }
                });
            }

        } else {

        }
    },
    'keyup input[name=loginPwd]'(evt, tmpl) {
        if(evt.keyCode === 13) $('button[name=loginBtn]').click();
    },
    // 아이디 찾기 이메일 벨리데이션
    'input input[name=schEmail]'(evt, tmpl) {
        var inputVal = $(evt.currentTarget).val();
        var validation =  emailChkVal.test(inputVal);

        console.log('inputVal', validation);

        if(inputVal == '') {
            $('input[name=schEmail]').css({'border' : '1px solid red'});
            emailSchMessage.set('이메일을 입력해주세요');
        } else if(!validation) {
            $('input[name=schEmail]').css({'border' : '1px solid red'});
            emailSchMessage.set('정확한 이메일을 입력해주세요');
        } else {
            $('input[name=schEmail]').css({'border' : ''});
            emailSchMessage.set('');
        }
    },
    // 아이디 찾기 이메일 검증
    'change input[name=schEmail]'(evt, tmpl) {
        var email = $(evt.currentTarget).val();
        var validation =  emailChkVal.test(email);

        if(!validation) {
            $('input[name=schEmail]').css({'border' : '1px solid red'});
            emailSchMessage.set('올바른 이메일을 입력해주세요');
        }
    },
    // 인증요청 버튼 이벤트
    'click button[name=authReq]'(evt, tmpl) {
        var email =  $('input[name=schEmail]').val();

        var validation =  emailChkVal.test(email);
        
        if(validation) {
            Meteor.call('idSchEmailAuth', email, function(err, res) {
                if(err) console.log(err);
                else {
                    if(res != undefined) {
                        var btnSet = $('button[name=authReq]');
                        $('input[name=schEmail]').css({'border' : ''});
                        btnSet.prop('disabled', true);
                        btnSet.css({'background-color' : 'silver'});
                        $('img[name=loading]').css({'display' : ''});

                        emailSchMessage.set('');
                        chkValus.set(email);

                        var code = Random.hexString(6);


                        Meteor.call('sendEmail', {
                            to: email,
                            from: 'patrick@5node.co.kr',
                            subject: '[SJLab] 아이디찾기 인증코드 입니다.',
                            text: '아이디찾기 인증 코드 : ' + code
                        }, function() {
                            sendDoneEmail.set(true);
                            emailAuthCode.set(code);
                            
                            btnSet.css({'background-color' : ''});
                            btnSet.prop('disabled', false);
                            $('img[name=loading]').css({'display' : 'none'});

                            alert('메일을 전송하였습니다.');
                            
                            $('input[name=authSchId]').css({'display' : ''});
                            $('button[name=authChk]').css({'display' : ''});
                        });
                    } else {
                        $('input[name=schEmail]').css({'border' : '1px solid red'});
                        alert('등록되지 않은 사용자 입니다.');
                    }
                }
            });
        } else {
            $('input[name=schEmail]').focus();
        }
    },
    // 인증확인
    'click button[name=authChk]'(evt, tmpl) {
        var inputCode = $('input[name=authSchId]').val();
        var email =  $('input[name=schEmail]').val();
        if(inputCode == emailAuthCode.get() && email == chkValus.get()) {
            $('button[name=authReq]').css({'background-color' : 'silver'});
            $('button[name=authReq]').prop('disabled', true);
            $('button[name=authChk]').css({'background-color' : 'silver'});
            $('button[name=authChk]').prop('disabled', true);
            $('img[name=loadingCur]').css({'display' : ''});

            Meteor.call('idSchEmailAuth', email, function(err, res) {
                Meteor.call('sendEmail', {
                    to: email,
                    from: 'patrick@5node.co.kr',
                    subject: '[SJLab] 아이디찾기 아이디 입니다.',
                    text: '아이디 : ' + res.emails[0].address
                }, function() {
                    $('input[name=schEmail]').val('');
                    $('button[name=authReq]').css({'background-color' : ''});
                    $('button[name=authReq]').prop('disabled', false);
                    $('input[name=authSchId]').val('');
                    $('input[name=authSchId]').css({'display' : 'none'});
                    $('img[name=loadingCur]').css({'display' : 'none'});
                    $('button[name=authChk]').css({'display' : 'none'});
                    
                    chkValus.set();

                    alert('회원님의 계정을 메일로 전송하였습니다.');
                });
            });
        } else {
            alert('인증번호가 틀립니다.');
        }
    },
    // 비밀번호 찾기 인증요청
    'click button[name=schPassChk]'(evt, tmpl) {
        var passChInputVal = $('input[name=schPassId]').val();

        if(passChInputVal != '') {
            Meteor.call('emailOrBnumChk', passChInputVal, function(err, res) {
                if(err) console.log(err);
                else {
                    if(res != undefined) {
                        var btnSet = $('button[name=schPassChk]');
                        btnSet.prop('disabled', true);
                        btnSet.css({'background-color' : 'silver'});
                        $('img[name=loading]').css({'display' : ''});

                        var sendToEmail = res.profile.uInfos.email != undefined ? res.profile.uInfos.email : res.profile.uInfos.bsnsChagEmail;

                        var code = Random.hexString(6);

                        chkValus.set(passChInputVal);

                        Meteor.call('sendEmail', {
                            to: sendToEmail,
                            from: 'patrick@5node.co.kr',
                            subject: '[SJLab] 비밀번호찾기 인증코드 입니다.',
                            text: '비밀번호찾기 인증 코드 : ' + code
                        }, function() {
                            passAuthCode.set(code);
                            
                            btnSet.css({'background-color' : ''});
                            btnSet.prop('disabled', false);
                            $('img[name=loading]').css({'display' : 'none'});

                            alert('메일을 전송하였습니다.');
                            
                            $('input[name=authPassCode]').css({'display' : ''});
                            $('button[name=authPassCodeChk]').css({'display' : ''});
                        });
                    } else {
                        alert('등록되지 않은 이메일 입니다.');
                    }
                }
            });
        } else {
            alert('이메일 or 사업자 등록번호를 입력해주세요');
        }
    },
    'click button[name=authPassCodeChk]'(evt, tmpl) {
        var inputCode = $('input[name=authPassCode]').val();
        var email = $('input[name=schPassId]').val();

        if(inputCode == passAuthCode.get() && email == chkValus.get()) {
            $('button[name=schPassChk]').css({'background-color' : 'silver'});
            $('button[name=schPassChk]').prop('disabled', true);
            $('button[name=authPassCodeChk]').css({'background-color' : 'silver'});
            $('button[name=authPassCodeChk]').prop('disabled', true);
            $('img[name=loadingCur]').css({'display' : ''});

            Accounts.forgotPassword({email : email}, function(err, res) {
                if(err) console.log(err);
                else {
                    $('input[name=schPassId]').val('');
                    $('button[name=schPassChk]').css({'background-color' : ''});
                    $('button[name=schPassChk]').prop('disabled', false);
                    $('img[name=loadingCur]').css({'display' : 'none'});
                    $('input[name=authPassCode]').css({'display' : 'none'});
                    $('button[name=authPassCodeChk]').css({'display' : 'none'});
                    passAuthCode.set();
                    chkValus.set();

                  alert('회원님의 비밀번호 변경 URL을 메일로 전송하였습니다.');
                }
              });
        } else {
            alert('인증코드가 다릅니다.');
        }
    }
});

// 팝업 메시지 띄우기
function messagePopup(message) {
    popUpMessage.set(message);
    $('#utilsPopUp').addClass('is-open');
}

Template.login.helpers({
    loginFlag() {
        return loginFlag.get();
    },
    popup() {
        return popUpMessage.get();
    },
    schMsg() {
        return emailSchMessage.get();
    },
    subSchMsg() {
        return authMessage.get();
    }
});


