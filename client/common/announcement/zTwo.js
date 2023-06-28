import './zTwo.html';

Template.zTwo.onCreated(function() {
});

Template.zTwo.onRendered(function() {
    var location = $('#move').offset().top;
    Meteor.commonUtils.scrollTop(location);
});

Template.zTwo.events({
   
});

Template.zTwo.helpers({
    subFlag() {
        return false;
    },
});


