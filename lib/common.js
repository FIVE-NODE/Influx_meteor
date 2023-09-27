import { Meteor } from "meteor/meteor";

cl = function (msg) {
  console.log(msg)
};

Meteor.commonUtils = {
    // 허용 PageList 들
    pageList: {
        "user" : [
            "interestAtwrk",
            "purchaseList",
            "msgManage",
            "userCart",
            "myCollection",
            "changeMberInfo"
        ],
        "gallery" : [
            "myPageSelling",
            "glryAtwrks",
            "inventoryMode",
            "ogAtwrkCr",
            "eventsCrList",
            "bMsgManage",
            "atwrkSalesReg",
            "pickCreate"
        ]
    },
    userInfo: function() {
      return Meteor.user();
    },
    // uuid 생성
    generateUUID: function() {
        var d = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(
            c,
        ) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16);
        });
        return uuid;
    },
    // 금액에 콤마
    priceComma: function(price) {
        if(price != undefined) return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },
    // 이메일 정합성 체크
    emailRegex: function(email) {
        return /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i.test(email);
    },
    // 로그인 완료한 사용자 정보 셋팅
    logedIn: function(userInfo) {
        // sessionStorage 셋팅
        sessionStorage.setItem('art_session_index',  JSON.stringify({index: 0}));

        var sessIndex = JSON.parse(sessionStorage.getItem('art_session_index'));

        sessIndex.index = 1;
        sessionStorage.setItem('art_session_index',  JSON.stringify(sessIndex));
        
        Meteor.commonUtils.userInfo = userInfo;

        Meteor.call('encrypt', JSON.stringify(userInfo), function(err, res) {
            sessionStorage.setItem('art_dex', res)
        });
    },
    // 사용자 정보 리턴
    uInfo: async function(userId) {
        var userInfo = {};
        if(sessionStorage.getItem('art_dex') != undefined) {
            await Meteor.call('decrypt', sessionStorage.getItem('art_dex'), function(err, res) {
                var userData = JSON.parse(res);
                Meteor.call('selectMberForId', userData._id, function(err, res) {
                    userInfo = res;
                    userId.set(userInfo);
                    return Object.keys(userInfo).length == 0 ? {} : userInfo;
                });

            });
        }
    },
    scrollTop: function(location) {
        setTimeout(function() {
            window.scrollTo({top: location});
        }, 50);
    },
    commonOriginalAtwrk: function(query, options) {
        Meteor.call('selectOrgAtwrk', query, options, function(err, res) {
            total.set(res.total);
            atwrkInfo.set(res.list)
        });
    },
    // 기본적으로 포함되어야 하는 쿼리
    normalSetQuy: function() {
        return {
            "delYn" : "N",
            "soldYn" : "N",
            "sellYn" : "Y"
        };
    },
    // 관리자 회원 좋아요 등등 막기
    glryUserLimitEvt: function() {
        let userInfo = Meteor.user();

        if(userInfo.profile.uInfos.bsnsID) return false;
        else return true;
        
    }
};
