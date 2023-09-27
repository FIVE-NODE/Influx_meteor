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

function setDateTime (flag) {
    var dateGetDate = '';
    var dateGetTime = '';
    var dataSetFlag = '';

    switch(flag) {
        case 'ogStrDateTime':
            dataSetFlag = 'seltStr';
            dateGetDate = $( "#datepicker1" ).val();
            dateGetTime = $('#ogStrTime').val();
            break;
        case 'ogEndDateTime':
            dataSetFlag = 'seltEnd';
            dateGetDate = $( "#datepicker2" ).val();
            dateGetTime = $('#ogEndTime').val();
            break;
        case 'dtStrDateTime':
            dataSetFlag = 'dtSeltStr';
            dateGetDate = $( "#datepicker3" ).val();
            dateGetTime = $('#dtStrTime').val();
            break;
        default:
            dataSetFlag = 'dtSeltEnd';
            dateGetDate = $( "#datepicker4" ).val();
            dateGetTime = $('#dtEndTime').val();
            break;
    }

    if(dateGetDate == '' || dateGetTime == '') alert('날짜와 시간은 필수 입니다.');
    else {
        $(`span[name=${dataSetFlag}Date]`).text(moment(dateGetDate).format('YYYY.MM.DD'));
        $(`span[name=${dataSetFlag}Time]`).text(dateGetTime);

        $('.popup-close').click();
    }
}

Template.eventsCrDetail.onRendered(function() {
    $.datepicker.setDefaults({
        dateFormat: 'yymmdd',
        prevText: '이전 달',
        nextText: '다음 달',
        monthNames: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
        monthNamesShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
        /*dayNames: ['일', '월', '화', '수', '목', '금', '토'],
        dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
        dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'],*/
        showMonthAfterYear: true,
        yearSuffix: '년'
    });
    
    var today = moment(new Date()).format('YYYY.MM.DD');
    var toTime =  moment(new Date()).format('hh:mm A');

    $(function() {
        $( "#datepicker1" ).datepicker();
        $( "#datepicker2" ).datepicker();
        $('input.timepicker').timepicker();
    } );

    $('span[name=seltStrDate]').text(today);
    $('span[name=seltStrTime]').text(toTime);
    $('span[name=seltEndDate]').text(today);
    $('span[name=seltEndTime]').text(toTime);
});

Template.eventsCrDetail.events({
    'click button[name=allSeltCancel]'(evt, tmpl) {
        $('input[name=seltAtwrk]').prop('checked', false);
        $('input[name=seltAllChk]').prop('checked', false);
    },
    'change input[name=seltAllChk]'(evt, tmpl) {
        if($(evt.currentTarget).prop('checked')) {
            $('input[name=seltAtwrk]').prop('checked', true);
        } else {
            $('input[name=seltAtwrk]').prop('checked', false);
        }
    },
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

        var sellStrDt = moment($('span[name=seltStrDate]').text() + ' ' + $('span[name=seltStrTime]').text(), 'YYYYMMDD hh:mm A').format('YYYYMMDDHHmm');
        var sellEndDt = moment($('span[name=seltEndDate]').text() + ' ' + $('span[name=seltEndTime]').text(), 'YYYYMMDD hh:mm A').format('YYYYMMDDHHmm');

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
    'click button[name=ogStrDateTime]' (evt, tmpl) {
        var today = moment(new Date()).format('YYYY.MM.DD');
        var toTime =  moment(new Date()).format('hh:mm A');
        var seltDay = $('#datepicker1').val();

        var seltEndDay = moment($('#datepicker2').val()).format('YYYYMMDD');
        if(today > seltDay) {
            alert('전시회 시작일은 오늘이거나 오늘 이후 여야합니다.');
            $('span[name=seltStrDate]').text(today);
            $('span[name=seltStrTime]').text(toTime);
        } else setDateTime('ogStrDateTime');
    },
    'click button[name=ogEndDateTime]' (evt, tmpl) {
        var seltStrDay = moment($('span[name=seltStrDate]').text()).format('YYYYMMDD');
        var seltStrTime = moment($('span[name=seltStrTime]').text(), 'hh:mm A').format('HHmm');
        
        var seltDay = $('#datepicker2').val();

        if(seltStrDay > seltDay) {
            alert('시작 날짜와 동일하거나 적을수 없습니다.');
            // let setDate = moment(seltStrDay, 'YYYYMMDD').add(1, 'd').format('YYYY.MM.DD');
            // $('span[name=selEndDate]').text(setDate);
        } else if(seltStrDay == seltDay) {
            var seltEndDay = moment(seltDay).format('YYYYMMDD');

            var seltStrTime = moment(seltStrDay + ' ' + $('span[name=seltStrTime]').text(), 'YYYYMMDD hh:mm A');
            var seltEndTime = moment(seltEndDay + ' ' + $('#ogEndTime').val(), 'YYYYMMDD hh:mm A');

            var timeChk = moment.duration(seltEndTime.diff(seltStrTime)).asMinutes();
            
            if(timeChk > -1) setDateTime('ogEndDateTime');
            else alert('시작 날짜의 시간은 종료날짜의 시간보다 빠를수 없습니다.');
        } else setDateTime('ogEndDateTime');
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


