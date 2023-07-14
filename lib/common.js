import { Meteor } from "meteor/meteor";

cl = function (msg) {
  console.log(msg)
};

Meteor.commonUtils = {
    userInfo: {},
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
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },
    // 로그인 완료한 사용자 정보 셋팅
    logedIn: function(userInfo) {
        // sessionStorage 셋팅
        var sessIndex = JSON.parse(sessionStorage.getItem('art_session_index'));

        sessIndex.index = 1;
        sessionStorage.setItem('art_session_index',  JSON.stringify(sessIndex));

        // Meteor session 셋팅
        Session.set('art_session_user', sessIndex);
        Session.set('userInfo', userInfo);
        
        Meteor.commonUtils.userInfo = userInfo;

        Meteor.call('encrypt', JSON.stringify(userInfo), function(err, res) {
            sessionStorage.setItem('art_dex', res)
        });
    },
    chkSearchFilterPrice: function() {

    },
    scrollTop: function(location) {
        setTimeout(function() {
            window.scrollTo({top: location, behavior: 'smooth'});
        }, 50);
    },
};