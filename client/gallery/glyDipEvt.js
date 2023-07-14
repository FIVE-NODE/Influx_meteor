import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

import './glyDipEvt.html';

function selectAtwrk(data) {
    Meteor('', data, function(err, res) {

    });
}

Template.glyDipEvt.onCreated(function() {

    
    renderFlag = new ReactiveVar(false);

    evntInfo = new ReactiveVar({});

    selectEvnt();

    function selectEvnt() {
        var evntId = FlowRouter.getParam('_id');
        Meteor.call('selectEvntDetail', evntId, function(err, res) {
            evntInfo.set(res);
        });
    }

});

Template.glyDipEvt.onRendered(function() {
    renderFlag.set(true);
});

Template.glyDipEvt.events({
});

Template.glyDipEvt.helpers({
    evntInfo()  {
        var res = evntInfo.get() !== undefined ? evntInfo.get() : false;
        return res
    },
    dateFormat(date) {
        return Meteor.clientCommonUtils.dateFormatChg(date);
    },
});
