import './utilsPopUp.html';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

Template.utilsPopUp.onCreated(function() {
});

Template.utilsPopUp.onRendered(function() {
});

Template.utilsPopUp.events({
    'click .popup-chk'() {
        if(this.route != undefined) FlowRouter.go(this.route);
    },
    'click .popup-close'() {
        if(this.route != undefined) FlowRouter.go(this.route);
    }
});

Template.utilsPopUp.helpers({
    message() {
        return this.message;
    }
});
