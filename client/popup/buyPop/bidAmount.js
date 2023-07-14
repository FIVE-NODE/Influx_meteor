import './bidAmount.html';

import './bidAmtProcess.js';

Template.bidAmount.onCreated(function() {
    // selectBidPric = new ReactiveVar();
});

Template.bidAmount.onRendered(function() {
});

Template.bidAmount.events({
    'click button[name=autoPric]'(evt, tmpl) {
        var selectPric = $(evt.currentTarget).val();
        $('input[name=bidPric]').val(Meteor.commonUtils.priceComma(selectPric));
    },
    'change input[name=bidPric]'(evt, tmpl) {
        var pric = $(evt.currentTarget).val();
        $('input[name=bidPric]').val(Meteor.commonUtils.priceComma(pric));
    },
    'click button[name=nextBtn]'(evt, tmpl) {
        var selectPric = $('input[name=bidPric]').val();
        selectPric = parseInt(selectPric.replace(/,/g, ""));
        Template.parentData().selectBidPric = selectPric;

        selectBidPrice.set(selectPric);

        $('#bidAmount').removeClass('is-open');
        $('#bidAmtProcess').addClass('is-open');
    }
});

Template.bidAmount.helpers({
    nowBidPric() {
    },
    directPric() {
    },
    bidLength() {
        return this.ogPrt.bid.bidInfo.length;
    },
    autoPricBid(perSent) {
        var nPric = this.ogPrt.bid.nPric;
        var chPric = Math.floor((nPric * perSent) + nPric);
        return chPric;
    },
});
