import './utilsPopUp.html';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

Template.utilsPopUp.onCreated(function() {
});

Template.utilsPopUp.onRendered(function() {
});

Template.utilsPopUp.events({
    'click .popup-chk'(evt, tmpl) {
        $(evt.target).parents('.popup-layout').removeClass('is-open');
    },
    'click .popup-close'() {
    }
});

Template.utilsPopUp.helpers({
    message() {
        return this.message;
    },
    btn() {
        return this.btn;
    },
    routeFlag(flag) {
        return flag === '';
    },
    divClassFlag() {
        var res = "justify-center";
        if(this.btn != undefined) res = "justify-between";
        return res;
        
    }

});
