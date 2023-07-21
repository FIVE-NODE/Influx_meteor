import './myPageSimple.html';

Template.myPageSimple.onCreated(function() {
});

Template.myPageSimple.onRendered(function()  {
});

Template.myPageSimple.events({
    'click a[name=logout]'() {
        sessionStorage.removeItem('art_dex');
        sessionStorage.removeItem('art_session_index');
    }
});

Template.myPageSimple.helpers({
});

