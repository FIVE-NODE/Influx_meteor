import './bidAmtProcess.html';

Template.bidAmtProcess.onCreated(function() {
    vatPric = new ReactiveVar();
    totalPric = new ReactiveVar();

});

Template.bidAmtProcess.onRendered(function() {
});

Template.bidAmtProcess.events({
    'click button[name=mobileReq]'(evt, tmpl) {
    },
    'click button[name=mobileAuth]'(evt, tmpl) {
    },
    'click button[name=backPop]'(evt, tmpl) {
        $('#bidAmtProcess').removeClass('is-open');
        $('#bidAmount').addClass('is-open');
    },
    'click button[name=bidDone]'(evt, tmpl) {
        var atwrkId = this._id;
        var terms = $('input[name=term]:not(:checked)').length;
        if(terms === 0) {
            Meteor.call('insertAtwrkBid', Meteor.userId(), atwrkId, '', totalPric.get(), selectBidPrice.get(), function(err, res) {
                $('#bidAmtProcess').removeClass('is-open');
                messagePopup({message : '비딩 등록이 완료 되었습니다.'});
            });
        } else messagePopup({message : '약관 동의는 필수 입니다.'});
    },
    'click input[name=allChkTerm]'(evt, tmpl) {
        var chkList = $('input[name=term]');

        if($('input[name=allChkTerm]').is(':checked')) chkList.prop('checked', true);
        else chkList.prop('checked', false);
    }
});

function messagePopup(message) {
    popUpMessage.set(message);
    $('#utilsPopUp').addClass('is-open');
}

Template.bidAmtProcess.helpers({
    bidPirc() {
        if(selectBidPrice.get() != undefined) {
            return Meteor.commonUtils.priceComma(selectBidPrice.get());
        }
    },
    bidVat() {
        if(selectBidPrice.get() != undefined) {
            var selectBidPric = selectBidPrice.get();
            var bidVatPric = Math.floor((selectBidPric * 0.15));
            vatPric.set(bidVatPric);
            return Meteor.commonUtils.priceComma(bidVatPric);
        }
    },
    bidPuyPric() {
        if(selectBidPrice.get() != undefined) {
            var selectBidPric = selectBidPrice.get();
            var bidVatPric = Math.floor((selectBidPric * 0.15) + selectBidPric);
            totalPric.set(bidVatPric);
            return Meteor.commonUtils.priceComma(bidVatPric);
        }
    }
});
