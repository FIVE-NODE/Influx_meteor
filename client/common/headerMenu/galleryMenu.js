import './galleryMenu.html';

Template.galleryMenu.onCreated(function() {
});

Template.galleryMenu.onRendered(function() {
});

Template.galleryMenu.events({
    'click button[name=allCancel]'() {
        $('input[name=chk]').prop("checked", false);
    },
});

Template.galleryMenu.helpers({
});

