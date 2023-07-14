import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

import './glyHistoryDipEvt.html';



Template.glyHistoryDipEvt.onCreated(function() {

    historyInfo = new ReactiveVar();

    glryInfo = new ReactiveVar();

    glryName = new ReactiveVar('');

    // 지난 전시/행사 조회
    function selectGlryHistEvt() {
        Meteor.call('selectGlryHistEvt', FlowRouter.getParam('_id'), function(err, res) {
            historyInfo.set(res);
            // glryName.set(res[0].glry.glryNm);
        });
    }

    function selectGlryDetail() {
        Meteor.call('selectGlryDetail', FlowRouter.getParam('_id'), function(err, res) {
            glryInfo.set(res);
        });
    }

    selectGlryHistEvt();
    selectGlryDetail();

});

Template.glyHistoryDipEvt.onRendered(function() {
});

Template.glyHistoryDipEvt.events({
});

Template.glyHistoryDipEvt.helpers({
    glryInfo() {
        return glryInfo.get().glryNm;
    },
    historyInfo() {
        return historyInfo.get();
    },
    glryNm() {
        return glryName.get();
    },
    dateFormat(date) {
        return Meteor.clientCommonUtils.dateFormatChg(date);
    }
});
 