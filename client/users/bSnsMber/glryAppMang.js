import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { StndPntReq } from '../../../lib/collections';
import { Random } from 'meteor/random';

import './glryAppMang.html';
import '../../popup/utilsPopUp.js';

Template.glryAppMang.onCreated(function() {
    Meteor.subscribe('glryAppMang');
    
    popUpMessage = new ReactiveVar();

});

Template.glryAppMang.onRendered(function() {
});

Template.glryAppMang.events({
    'click button[name=sendPass]'(evt, tmpl) {
        var rendomPass = Random.hexString(13);
        var toDate = moment(new Date()).format('YYYYMMDD');

        var bsnsData = {
            uInfos : {
                bsnsTp  : '001',
                bsnsID  : this.stndPntReqID,
                bsnsNm  : this.bsnsNm,
                pwChgYn : '',
                pwChgDt : '',
                homeUrl : this.homeUrl,
                glryNm  : this.glryNm,
                area : this.area,
                dong : this.dong,
                sigungu : this.sigungu,
                zipCd : this.zipCd,
                addr1 : this.addr1,
                addr2 : this.addr2,
                bsnsChagNm : this.bsnsChagNm,
                bsnsChagMob : this.bsnsChagMob,
                bsnsChagEmail : this.bsnsChagEmail,
                insDt : '',
                ctrt : {
                    stndPntReqID : this._id,
                    ctrtInfo : ''
                },
                rprsnAtwrk: [],
                rprsnAtst: [],
                ntcn: [],
                insDt : toDate
            }
        };

        var uEmail = this.bsnsChagEmail;
        var id = this._id;

        Accounts.createUser({
            email : this.bsnsChagEmail,
            password : rendomPass,
            profile : bsnsData
        }, function(error) {
            if(error) {
                console.log(error);
                if(error.error == 403) {
                    console.log('here');
                }
            }
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
                    subject: "[SJLab] 갤러리(관리자) 비밀번호 송부",
                    text: '계정 : ' + uEmail + '\n'
                    + '임시 비밀번호 :' + rendomPass
                }, function(err, res) {
                    if(err) console.log('send email : ', err);
                    else {
                        alert('이메일이 전송되었습다.');
                    }
                });
            }
        });
    }
});

// 팝업 메시지 띄우기
function messagePopup(message) {
    popUpMessage.set(message);
    $('#utilsPopUp').addClass('is-open');
}

Template.glryAppMang.helpers({
    glryList() {
        return StndPntReq.find({}).fetch();
    },
    sendToPassChk(passChk) {
        return passChk == '' ? '' : 'is-active';
    },
    popup() {
        return popUpMessage.get();
    }
});
