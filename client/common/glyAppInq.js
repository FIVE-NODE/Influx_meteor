import './glyAppInq.html';

Template.glyAppInq.onCreated(function() {
    glyAppInqNextFlag = new ReactiveVar(true);

});

Template.glyAppInq.onRendered(function() {

});

Template.glyAppInq.events({
    'click button[name=nextBtn]'() {
        $('input[name=emailAdd]').val();
        $('#check-partner--admit').is(':checked');
    },
});

Template.glyAppInq.helpers({
    glyAppInqNextFlag() {
        return glyAppInqNextFlag.get();
    }
});
