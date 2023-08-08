import './pickCreate.html';

import './curatorPreview.js';
import './curatorRegSch.js';

Template.pickCreate.onCreated(function() {
    // page 정보
    // curPage = new ReactiveVar(1);
    // skip = new ReactiveVar(0);
    // limit = new ReactiveVar(10);
    // total = new ReactiveVar(0);

    // 001 : 원화, 002 : 디지털 파나화, 003 : 작가
    tabFlag = new ReactiveVar('001');

    pickData = new ReactiveVar();

    // 삭제 할 작품 _id
    delId = new ReactiveVar();

    // 등록되어 있는 작품 _id 들
    inAtwrkList = new ReactiveVar();

    imgUrl = new ReactiveVar();

    seltPickSch();

    this.data.seltPickSch = function() {
        seltPickSch();
    };

});

function seltPickSch() {
    Meteor.call('seltPickSch', tabFlag.get(), {}, function(err, res) {
        pickData.set(res)
        // total.set(res.atstAtwrk.length);

        var idLists = [];
        var atwrkList = res.atstAtwrk;
        for(idx in atwrkList) {
            idLists.push(atwrkList[idx].atwrkID);
        }

        inAtwrkList.set(idLists);

        $('#pageNum1').addClass('is-active');
    });
}

Template.pickCreate.onRendered(function() {
});

Template.pickCreate.events({
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
                    if(err) {
                        console.log(err);
                    } else {
                        imgUrl.set(res.fileName);
                    }
                });
            };
            fileReader.readAsBinaryString(file);
        } else {
            alert('이미지 파일만 업로드 해주세요'); 
        }
    
    },
    'click button[name=upload-btn]'(evt, tmpl) {
        $('#upload-input').click();
    },
    'click a[name=prt]'(evt, tmpl) {
        var evnt = $(evt.currentTarget);
        tabFlag.set(evnt.attr('id'));

        $('a.is-active').removeClass('is-active');
        evnt.addClass('is-active');

        seltPickSch();
    },
    'click button[name=seltDelete]'(evt, tmpl) {
        // 체크박스 선택한 것들 전부 삭제
        var checked = $('input[name=selt]:checked');

        var queryData = [];

        for(i=0; i<checked.length; i++) {
            queryData.push(checked[i].value);
        }

        delId.set(queryData);

        $('#confirm_popup').addClass('is-open');
    },
    'click button[name=delete]'(evt, tmpl) {
        // 삭제 버튼
        $('#confirm_popup').addClass('is-open');
        delId.set([$(evt.currentTarget).val()]);
    },
    'click button[name=yDelete]'(evt, tmpl) {
        // 컨펌 화면 삭제 버튼 이벤트
        Meteor.call('deletePickAtwrk', delId.get(), tabFlag.get(), function(err, res) {
            $('#confirm_popup').removeClass('is-open');
            messagePopup({message : '삭제가 완료되었습니다.'});
            delId.set('');
            
            seltPickSch();
        });
    },
    'change input[name=allSelt]'(evt, tmpl) {
        if($('input[name=allSelt]').is(':checked')) {
            $('input[name=selt]').attr('checked', true);
        } else {
            $('input[name=selt]').attr('checked', false);
        }
    },
    'click button[name=savePick]'(evt, tmpl) {        
        var title = $('input[name=pickTitle]').val();
        var desc = $('textarea[name=pickDesc]').val();

        var post = {
            title,
            desc
        };

        if(title == '' && desc == '' && imgUrl.get() == undefined) messagePopup({message : '하나라도 엽력하셔야 합니다.'});
        else {
            if(imgUrl.get() != undefined) post.image = imgUrl.get();
        
            Meteor.call('savePick', tabFlag.get(), post, function(err, res) {
                seltPickSch();

                $('input[name=pickTitle]').val('');
                $('textarea[name=pickDesc]').val('');
                imgUrl.set();
            });
        }
    }
});

// 팝업 메시지 띄우기
function messagePopup(message) {
    popUpMessage.set(message);
    $('#utilsPopUp').addClass('is-open');
}

// 선택해제 버튼 이벤트용 Func
function cancelCheckBox(name) {
    var input = $(`#artwork-${name} input`);
    input.prop('checked', false);
}

Template.pickCreate.helpers({
    seltPickSch() {
        return pickData.get();
    },
    atstAtwrkList() {

    },
    preViewImg() {
        if(imgUrl != undefined) {
            console.log(imgUrl.get());
            return imgUrl.get();
        }
    }
});
