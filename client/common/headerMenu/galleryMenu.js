import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

import './galleryMenu.html';

Template.galleryMenu.onCreated(function() {
});

Template.galleryMenu.onRendered(function() {
});

Template.galleryMenu.events({
    'click button[name=allCancel]'() {
        $('input[name=chk]').prop("checked", false);
    },
    'click button[name=schBtn]'(evt, tmpl) {
        console.log('Gallery menu');
        console.log(evt);
        console.log(tmpl);
    }
});

Template.galleryMenu.helpers({
});

