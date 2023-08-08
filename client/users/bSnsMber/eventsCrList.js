import './eventsCrList.html';

Template.eventsCrList.onCreated(function() {
    eventsList = new ReactiveVar();

    uInfo = new ReactiveVar();

    seltEvntsForGlry();
});

function seltEvntsForGlry() {
    Meteor.call('seltEvntsForGlry', Meteor.userId(), function(err, res) {
        uInfo.get(Meteor.user().profile.uInfos);
        eventsList.set(res);
    });
}

Template.eventsCrList.onRendered(function() {
});

Template.eventsCrList.events({
});

Template.eventsCrList.helpers({
    eventsList() {
        if(eventsList.get() != undefined) {
            return eventsList.get();
        }
    },
});
