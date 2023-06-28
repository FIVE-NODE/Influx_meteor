import './zThre.html';

Template.zThre.onCreated(function() {

});

Template.zThre.onRendered(function() {
    var location = $('#move').offset().top;
    Meteor.commonUtils.scrollTop(location);
});

Template.zThre.events({

});

Template.zThre.helpers({
    
});
