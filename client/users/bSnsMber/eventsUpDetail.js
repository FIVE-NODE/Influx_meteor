import './eventsUpDetail.html';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

Template.eventsUpDetail.onCreated(function() {
    evntDetail = new ReactiveVar();

    detailId = new ReactiveVar(FlowRouter.getParam("_id"));

    seltEvntDetail();
});

function seltEvntDetail() {
    Meteor.call('seltEvntDetail', detailId.get(), function(err, res) {
        evntDetail.set(res);
    });
}

Template.eventsUpDetail.onRendered(function() {
});

Template.eventsUpDetail.events({
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
        // FlowRouter.go();
    },
    'click button[name=cancel]'(evt, tmpl) {
        history.back();
    },
});

Template.eventsUpDetail.helpers({
    evntDetail() {
        return evntDetail.get();
    },
    kinds() {
        return Meteor.codes.EVENT_TYPE();
    },
    etcChk(code) {
        return code == '005' ? true : false;
    }
});
