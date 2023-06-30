import './zFive.html';

Template.zFive.onCreated(function() {
    
    renderFlag = new ReactiveVar(false);

    faqInfo = new ReactiveVar();

    Meteor.call('selectFaq', '001' ,function(err, res) {
        faqInfo.set(res);
    });
});

Template.zFive.onRendered(function() {
    renderFlag.set(true);

    var location = $('#move').offset().top;
    Meteor.commonUtils.scrollTop(location);
});

Template.zFive.events({
    'click .faq-item'(evt, tmpl) {
        $(evt.target).next().slideToggle();
    },
    'click .dropDown-tit button'(evt, tmpl) {
        var $this = $(evt.target),
        dropDownTit = $this.parent();
        dropDownTit.toggleClass('is-click').next().slideToggle();
    }
});

Template.zFive.helpers({
    renderFlag() {
        return renderFlag.get();
    },
    faqInfo() {
        return faqInfo.get();
    },
});