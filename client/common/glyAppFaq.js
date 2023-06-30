import './glyAppFaq.html';

Template.glyAppFaq.onCreated(function() {

    renderFlag = new ReactiveVar(false);

    glryFaqInfo = new ReactiveVar();

    Meteor.call('selectFaq', '002', function(err, res) {
        glryFaqInfo.set(res);
    });
});

Template.glyAppFaq.onRendered(function() {
    renderFlag.set(true);

    var location = $('#move').offset().top;
    Meteor.commonUtils.scrollTop(location);
});

Template.glyAppFaq.events({
    'click .faq-item'(evt, tmpl) {
        $(evt.target).next().slideToggle();
    },
    'click .dropDown-tit button'(evt, tmpl) {
        var $this = $(evt.target),
        dropDownTit = $this.parent();
        dropDownTit.toggleClass('is-click').next().slideToggle();
    }
});

Template.glyAppFaq.helpers({
    renderFlag() {
        return renderFlag.get();
    },
    faqInfo() {
        return glryFaqInfo.get();
    }
});
