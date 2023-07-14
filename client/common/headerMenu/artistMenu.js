import './artistMenu.html';

Template.artistMenu.onCreated(function() {
});

Template.artistMenu.onRendered(function() {
});

Template.artistMenu.events({
    'click button[name=allCancel]'() {
        $('input[name=artistChk]').prop("checked", false);
    },
    'click button[name=schBtn]'(evt, tmpl) {
    }
});

Template.artistMenu.helpers({
    style1() {
        return Meteor.codes.STYLE_1();
    },
    style2() {
        return Meteor.codes.STYLE_2();
    },
    mkyy() {
        return Meteor.codes.MK_YEAR();
    },
});

