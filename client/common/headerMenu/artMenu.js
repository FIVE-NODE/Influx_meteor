import './artMenu.html';

Template.artMenu.onCreated(function() {
    artKindFlag = new ReactiveVar('art');
});

Template.artMenu.onRendered(function() {
});

Template.artMenu.events({
    'click a[name=zOne]'() {
        this.changePage.set('zOne');
    },
    'click button[name=allCancel]'() {
        $('input[name=chk]').prop("checked", false);
    },
    'click button[name=art]'() {
        artKindFlag.set('art');
    },
    'click button[name=dtp]'() {
        artKindFlag.set('dtp');
    }
});

Template.artMenu.helpers({
    kindFlag() {
        return artKindFlag.get() === 'dtp' ? false : true;
    }
});

