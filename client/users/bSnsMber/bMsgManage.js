import { Atwrk, Cmmnc } from '../../../lib/collections';
import './bMsgManage.html';

Template.bMsgManage.onCreated(function() {
    Meteor.subscribe('mangeMsg');

    strDate = new ReactiveVar();
    endDate = new ReactiveVar();
});

Template.bMsgManage.onRendered(function() {
    var toDate = moment(new Date());

    var today = toDate.format('YYYY-MM-DD');
    toDate.subtract(1, 'w').toDate();

    $('input[name=strDate]').val(toDate.format('YYYY-MM-DD'));
    $('input[name=endDate]').val(today);

    strDate.set(toDate.format('YYYYMMDD'));
    endDate.set(moment(today).format('YYYYMMDD'));
});

Template.bMsgManage.events({
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
    // 구매의사 삭제 버튼
    'click button[name=buyDelBtn]'(evt, tmpl) {
        var commncId = $(evt.currentTarget).val();
    },
    // 구매의사 답장 버튼
    'click button[name=buyAnsBtn]'(evt, tmpl) {
        var commncId = $(evt.currentTarget).val();
    },
    // 흥정삭제 버튼
    'click button[name=haingDelBtn]'(evt, tmpl) {
        var commncId = $(evt.currentTarget).val();
    },
    // 흥정답장 버튼
    'click button[name=haingAnsBtn]'(evt, tmpl) {
        var commncId = $(evt.currentTarget).val();
    },
});

Template.bMsgManage.helpers({
    buyToMsg() {
        let res = Cmmnc.find({bsnsID : Meteor.userId(), sttus : '001', cmmncTp : '001', 'insDt' : { $gte : strDate.get(), $lte : endDate.get() }}).fetch();
        return res;
    },
    hagglingMsg() {
        let res = Cmmnc.find({bsnsID : Meteor.userId(), sttus : '001', cmmncTp : '002', 'insDt' : { $gte : strDate.get(), $lte : endDate.get() }}).fetch();
        return res;
    },
    atwrkInfo(atwrkId) {
        return Atwrk.findOne({_id : atwrkId});
    }
});
