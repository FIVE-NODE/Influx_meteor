import './zFive.html';

Template.zFive.onCreated(function() {

});

Template.zFive.onRendered(function() {
    var location = $('#move').offset().top;
    Meteor.commonUtils.scrollTop(location);
});

Template.zFive.events({
});

Template.zFive.helpers({
    
});
