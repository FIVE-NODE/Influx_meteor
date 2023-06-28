import './zOne.html';

Template.zOne.onCreated(function() {
    renderFlag = new ReactiveVar(false);
    this.autorun(() => {
        renderFlag.set(true);
    });

});

Template.zOne.onRendered(function() {
    var location = $('#move').offset().top;
    Meteor.commonUtils.scrollTop(location);
});

Template.zOne.events({

});

Template.zOne.helpers({
    renderChk: function() {
        return renderFlag.get();
    },
});
