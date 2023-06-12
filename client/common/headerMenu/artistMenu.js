import './artistMenu.html';

Template.artistMenu.onCreated(function() {
});

Template.artistMenu.onRendered(function() {
});

Template.artistMenu.events({
    'click button[name=allCancel]'() {
        $('input[name=chk]').prop("checked", false);
    },
});

Template.artistMenu.helpers({
});

