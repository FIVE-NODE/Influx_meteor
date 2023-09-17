import './zFive.html';

Template.zFive.onCreated(function() {
    
    renderFlag = new ReactiveVar(false);

    faqInfo = new ReactiveVar();

    Meteor.call('selectFaq', '001' ,function(err, res) {
        faqInfo.set(res);
    });
});

// 팝업 메시지 띄우기
function messagePopup(message) {
    popUpMessage.set(message);
    $('#utilsPopUp').addClass('is-open');
}

Template.zFive.onRendered(function() {
    renderFlag.set(true);

    var location = $('#move').offset().top;
    Meteor.commonUtils.scrollTop(location);
});

Template.zFive.events({
    'click .faq-item'(evt, tmpl) {
        $('.faq-cont').css({'display' : 'none'});
        $(evt.target).next().slideToggle();
    },
    'click .dropDown-tit button'(evt, tmpl) {
        var $this = $(evt.target),
        dropDownTit = $this.parent();
        dropDownTit.toggleClass('is-click').next().slideToggle();
    },
    'click button[name=sendEmail]' (evt, tmpl) {
        var contactNm = $('input[name=contactName').val();
        var contactEmail = $('input[name=contactEmail').val();
        var contactTitle = $('input[name=contactTitle').val();
        var contactDesc = $('textarea[name=contactDesc').val();
        var seltContactUs = $('#sysContactUs').text();
        var agre = $('#check-privateAdmit:checked');

        if(seltContactUs == '문의 유형') messagePopup({message : '문의 유형을 선택해주세요'});
        else if(contactNm == '') messagePopup({message : '이름을 입력해주세요'});
        else if(contactEmail == '') messagePopup({message : '이메일을 입력해주세요'});
        else if(contactTitle == '') messagePopup({message : '제목을 입력해주세요'});
        else if(contactDesc == '') messagePopup({message : '내용을 입력해주세요'});
        else if(agre.length == 0) messagePopup({message : '개인정보 동의는 필수 입니다.'});
        else {
            Meteor.call('sendEmail', {
                to: contactEmail,
                from: 'patrick@5node.co.kr',
                subject: `[SJLab/문의사항] ${contactTitle}`,
                text: contactDesc
            }, function(err, res) {
                if(err) console.log('send email : ', err);
                else {
                    alert('이메일을 전송하였습니다.');
                    $('#popup_askBy_email').removeClass('is-open');
                }
            });
        }

    }
});

Template.zFive.helpers({
    renderFlag() {
        return renderFlag.get();
    },
    faqInfo() {
        return faqInfo.get();
    },
});
