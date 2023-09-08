import { Atwrk, Cmmnc } from '../../../lib/collections';
import './bMsgManage.html';

const numberChk = /[^0-9.]/g; 
const comma = /\B(?=(\d{3})+(?!\d))/g;

Template.bMsgManage.onCreated(function() {
    Meteor.subscribe('mangeMsg');

    strDate = new ReactiveVar();
    endDate = new ReactiveVar();
    seltAnsId = new ReactiveVar();
});

Template.bMsgManage.onRendered(function() {
    var toDate = moment(new Date());

    var today = toDate.format('YYYY-MM-DD');
    toDate.subtract(1, 'w').toDate();

    $('input[name=strDate]').val(toDate.format('YYYY-MM-DD'));
    $('input[name=endDate]').val(today);

    strDate.set(toDate.format('YYYYMMDD')+'000000');
    endDate.set(moment(today).format('YYYYMMDD')+'235959');
});

Template.bMsgManage.events({
    'blur input[name=endDate]' (evt, tmpl) {
        var today = moment(new Date()).format('YYYY-MM-DD');
        var strDay = moment($('input[name=strDate]').val()).format('YYYYMMDD');
        var seltDay = moment($(evt.currentTarget).val()).format('YYYYMMDD');

        if(seltDay < strDay) {
            $(evt.currentTarget).val(moment(today).format('YYYY-MM-DD'));
            alert('시작날짜 보다 종료날짜가 더 작습니다');
        }
    },
    'blur input[name=strDate]' (evt, tmpl) {
        var evtDay = $(evt.currentTarget).val();
        var today = moment(new Date()).format('YYYYMMDD');
        var seltDay = moment(evtDay).format('YYYYMMDD');

        if(seltDay > today) {
            $(evt.currentTarget).val(moment(today).format('YYYY-MM-DD'));
            alert('오늘날짜 이후는 선택하실수 없습니다.');
        }
    },
    'click button[name=seltDate]'(evt, tmpl) {
        var evtTarget = $(evt.currentTarget);
        $('button[name=seltDate].is-active').removeClass('is-active');
        evtTarget.addClass('is-active');

        var toDate = moment(new Date());
        var today = toDate.format('YYYY-MM-DD');

        switch(evtTarget.attr('id')) {
            case '1wek':
                toDate.subtract(1, 'w').toDate();
                break;
            case '1mon':
                toDate.subtract(1, 'M').toDate();
                break;
            case '3mon':
                toDate.subtract(3, 'M').toDate();
                break;
            default:
                break;
        }

        $('input[name=strDate]').val(toDate.format('YYYY-MM-DD'));
        $('input[name=endDate]').val(today);
    },
    'click button[name=schBtn]'(evt, tmpl) {
        var stDt = $('input[name=strDate]').val();
        var enDt = $('input[name=endDate]').val();
        strDate.set(moment(stDt).format('YYYYMMDD'));
        endDate.set(moment(enDt).format('YYYYMMDD'));
    },
    'keyup #entPric' (evt, tmpl) {
        inputComma($(evt.currentTarget));
    },
    'blur #entPric' (evt, tmpl) {
        var pric = Number($(evt.currentTarget).val().replace(/,/g, ""));
        pric = Math.floor(pric + (pric * 0.05));
        $('#totalPric').text(String(pric).replace(comma, ','));
    },
    // 구매의사 삭제 버튼
    'click button[name=buyDelBtn]'(evt, tmpl) {
        deleteMsg($(evt.currentTarget).val().split('_')[0]);
    },
    // 구매의사 답장보내기 버튼 (구매의사 메시지 (가격문의) 팝업여는 버튼)
    'click button[name=buyAnsBtn]'(evt, tmpl) {
        var evtTarget = $(evt.currentTarget);
        var dataId = evtTarget.data('id');
        var msgId = evtTarget.val().split('_')[0];

        $(`#${dataId}`).addClass('is-open');
        seltAnsId.set(msgId);
    },
    // 구매의사 팝업 보내기 버튼 실제로 사용자에게 메시지 보내는 버튼
    'click button[name=sendPricBtn]' (evt, tmpl) {
        var answ = $('#aResMsg').val();
        var totalPric = $('#totalPric').text();

        if(answ == '') alert('내용은 필수로 입력해주셔야 합니다.');
        else if(totalPric == '' || totalPric == '0') alert('금액을 입력해주세요');
        else {
            var ansData = { 
                _id : $(evt.currentTarget).val(),
                answ,
                ansPric : Number(totalPric.replace(/,/g, ""))
            };
            answerMsg(ansData);
        }  
    },
    // 흥정답장 버튼
    'click button[name=haingAnsBtn]'(evt, tmpl) {
        var ansData = { _id : $(evt.currentTarget).val().split('_')[0] };
        answerMsg(ansData);
    },
    // 흥정삭제 버튼
    'click button[name=haingDelBtn]'(evt, tmpl) {
        deleteMsg($(evt.currentTarget).val().split('_')[0]);
    }
});

// 메시지 답장용 Func
function answerMsg(ansData) {
    Meteor.call('answerCommnc', ansData, function(err, res) {
        if(err) console.log(err);
        else {
            alert('답장이 전송되었습니다.');
            if(undefined != ansData.ansPric) $('#priceInquiry-popup').removeClass('is-open');
        }
    });
}

// 메시지 삭제용 Func
function deleteMsg(commncId) {
    Meteor.call('deleteCommnc', commncId, function(err, res) {
        if(err) console.log(err);
        else {
            alert('삭제되었습니다.');
        }
    });
}

// 인풋 콤마 찍기
function inputComma(pric) {
    var pricVal = pric.val().toString();
    pric.val(pricVal.replace(numberChk, '').replace(comma, ','));
}

Template.bMsgManage.helpers({
    buyToMsg() {
        let res = Cmmnc.find({bsnsID : Meteor.userId(), sttus : '001', cmmncTp : '002', 'insDt' : { $gte : strDate.get(), $lte : endDate.get() }}).fetch();
        return res;
    },
    hagglingMsg() {
        let res = Cmmnc.find({bsnsID : Meteor.userId(), sttus : '001', cmmncTp : '001', 'insDt' : { $gte : strDate.get(), $lte : endDate.get() }}).fetch();
        return res;
    },
    atwrkInfo(atwrkId) {
        return Atwrk.findOne({_id : atwrkId});
    },
    popupHelpers() {
        if(seltAnsId.get() != undefined) {
            let res = Cmmnc.findOne({_id : seltAnsId.get()});
            return res;
        }
    },
});
