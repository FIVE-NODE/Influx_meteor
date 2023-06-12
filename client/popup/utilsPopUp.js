import './utilsPopUp.html';

Template.utilsPopUp.onCreated(function() {
});

Template.utilsPopUp.onRendered(function() {
});

Template.utilsPopUp.events({
    'click .popup-chk'() {
        if(this.route != undefined) BlazeLayout.render('login', { page : 'login' });
    },
    'click .popup-close'() {
        if(this.route != undefined) BlazeLayout.render('login', { page : 'login' });
    }
});

Template.utilsPopUp.helpers({
    message() {
        return this.message;
    }
});
