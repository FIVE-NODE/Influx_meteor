import './curatorPreview.html';

Template.curatorPreview.onCreated(function() {
});

Template.curatorPreview.onRendered(function() {

});

Template.curatorPreview.events({
    'click button[name=subMit]'(evt, tmpl) {
    }
});

Template.curatorPreview.helpers({
    preViewData() {
        return pickData.get();
    },
});
