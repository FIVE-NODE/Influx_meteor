import './withDrawalUser.html';

// 팝업창
import '../../popup/utilsPopUp.js';

Template.withDrawalUser.onCreated(function() {
    inconvenience = new ReactiveVar(0);
});

Template.withDrawalUser.onRendered(function() {
});

Template.withDrawalUser.events({
    'click button[name=withDrawal]'(evt, tmpl) {
        var term = $('#check-memberOut--allCheck').is(':checked');
        var some = $('input[name=some]:checked');
        if(!term) messagePopup({message : '탈퇴 동의는 필수 입니다.'});
        else if(!(some.length > 0)) messagePopup({message : '탈퇴 사유 한가지는 필수 입니다.'});
        else {
            var dataSet = {};
            var someList = [];
            var areaText = $('#areaText').val();

            for(idx in [some]) {
                someList.push(some[idx].defaultValue);
            }

            dataSet.secsnTp = someList;
            dataSet.secsnRsn = areaText;
            
            Meteor.call('delWithDrawalUser', dataSet, function(err, res) {
                $('#withDrawalUser_popup').removeClass('is-open');
                messagePopup({message : '탈퇴 처리가 완료되었습니다.'});
            });
        }
    },
    'input #areaText'(evt, tmpl) {
        inconvenience.set($(evt.currentTarget).val().length);
    }
});

// 팝업 메시지 띄우기
function messagePopup(message) {
    popUpMessage.set(message);
    $('#utilsPopUp').addClass('is-open');
}

Template.withDrawalUser.helpers({
    inconvenience() {
        return inconvenience.get();
    }
});