import './eventsCrDetail.html';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

import '../../popup/utilsPopUp.js';

Template.eventsCrDetail.onCreated(function() {
    popUpMessage = new ReactiveVar();

    evntDetail = new ReactiveVar();

    detailId = new ReactiveVar();

    preViewList = new ReactiveVar();

    imgUrl = new ReactiveVar();
});

// 팝업 메시지 띄우기
function messagePopup(message) {
    popUpMessage.set(message);
    setTimeout(function() {
        $('#utilsPopUp').addClass('is-open');
    }, 250);
}

Template.eventsCrDetail.onRendered(function() {
});

Template.eventsCrDetail.events({
    'change input[name=img-upload]'(evt, tmpl) {
        var fileReader = new FileReader();
        var fileName = evt.currentTarget.files[0].name;
        var file = evt.currentTarget.files[0];
        
        fileReader.onload = (file) => {
            var image = {
                blob : file.srcElement.result,
                name : fileName,
                encoding : 'binary'
            };
            Meteor.call('saveFile', image, function(err, res) {
                if(err) {
                    console.log(err);
                } else {
                    imgUrl.set(res.fileName);
                }
            });
        };
        fileReader.readAsBinaryString(file);
    },
    'change input[name=check-eventKind]'(evt, tmpl) {
        var checked = $(evt.currentTarget).is(':checked');
        var code = $(evt.currentTarget).val();

        if(code == '005' && checked) $('input[name=etcInput]').removeAttr('disabled');
        else {
            $('input[name=etcInput]').val('');
            $('input[name=etcInput]').attr('disabled', true);
        }
        
    },
    'click button[name=upload-btn]'(evt, tmpl) {
        $('#upload-input').click();
    },
    'click button[name=saveInfo]'(evt, tmpl) {
        var code = $('input[name=check-eventKind]:checked').val();
        var title = $('input[name=title]').val();
        var desc = $('input[name=desc]').val();
        var areas = $('input[name=areas]').val();

        if(imgUrl.get() == undefined) messagePopup({message : '이미지를 올려주세요.'});
        else if(code == undefined) messagePopup({message : '전시 유형을 선택해주세요.'});
        else if(title == '') messagePopup({message : '제목을 입력해주세요.'});
        else if(desc == undefined) messagePopup({message : '설명을 입력해주세요.'});
        else if(areas == '') messagePopup({message : '세부정보를 입력해주세요'});
        else {
            if(imgUrl.get() != undefined) post.image = imgUrl.get();
        
            // Meteor.call('savePick', tabFlag.get(), post, function(err, res) {
            //     seltPickSch();

            //     $('input[name=pickTitle]').val('');
            //     $('textarea[name=pickDesc]').val('');
            //     imgUrl.set();
            // });
        }

        // FlowRouter.go();
    },
    'click button[name=cancel]'(evt, tmpl) {
        history.back();
    },
});

Template.eventsCrDetail.helpers({
    kinds() {
        return Meteor.codes.EVENT_TYPE();
    },
    etcChk(code) {
        return code == '005' ? true : false;
    },
    popup() {
        if(popUpMessage.get() != undefined) return popUpMessage.get();
    }
});

