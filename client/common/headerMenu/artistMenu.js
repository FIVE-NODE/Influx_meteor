import './artistMenu.html';

Template.artistMenu.onCreated(function() {
});

Template.artistMenu.onRendered(function() {
});

Template.artistMenu.events({
    'click button[name=allCancel]'() {
        $('input[name=chk]').prop("checked", false);
    },
    'click button[name=schBtn]'(evt, tmpl) {
        console.log('Artist menu');
        console.log(evt);
        console.log(tmpl);
    }
});

Template.artistMenu.helpers({
});

