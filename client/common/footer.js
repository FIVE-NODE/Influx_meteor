import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

import './footer.html';

Template.footer.onCreated(function() {
    this.subscribe("footer");
});

Template.footer.onRendered(function() {

});

Template.footer.events({
    'click a[name=zOne]'() {
        FlowRouter.go('zOne');
        // this.changePage.set('zOne');
    },
    'click a[name=zTwo]'() {
        FlowRouter.go('zTwo');
        // this.changePage.set('zTwo');
    },
    'click a[name=zThre]'() {
        FlowRouter.go('zThre');
        // this.changePage.set('zThre');
    },
    'click a[name=zFour]'() {
        FlowRouter.go('zFour');
        // this.changePage.set('zFour');
    },
    'click a[name=zFive]'() {
        FlowRouter.go('zFive');
        // this.changePage.set('zFour');
    },
    'click button[name=glyAppEntry]'() {
        FlowRouter.go('glyAppEntry');
    }
});

Template.footer.helpers({

});

