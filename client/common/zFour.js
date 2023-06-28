import './zFour.html';

Template.zFour.onCreated(function() {

});

Template.zFour.onRendered(function() {
    var location = $('#move').offset().top;
    Meteor.commonUtils.scrollTop(location);
});

Template.zFour.events({

});

Template.zFour.helpers({
    
});
