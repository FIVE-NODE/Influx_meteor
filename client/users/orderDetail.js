import './orderDetail.html';

import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { Atwrk } from '../../lib/collections';

Template.orderDetail.onCreated(function() {
    Meteor.subscribe('Atwrk');

    orderDetilInfo = new ReactiveVar();


    seltOrderDetail();
});

function seltOrderDetail() {
    Meteor.call('seltOrderDetail', FlowRouter.getParam('_id'),function(err, res) {
        orderDetilInfo.set(res);
    });
}

Template.orderDetail.onRendered(function() {
});

Template.orderDetail.events({
    'click button[name=popOpen]'(evt, tmpl) {
        let popId = $(evt.currentTarget).attr('data-id');
        $(`#${popId}`).addClass('is-open');
    },
    'click button[name=popClose]'(evt, tmpl) {
        let popId = $(evt.currentTarget).attr('data-id');
        $(`#${popId}`).removeClass('is-open');
    }
});

Template.orderDetail.helpers({
    orderDetilInfo() {
        if(orderDetilInfo.get() != undefined) {
            return orderDetilInfo.get();
        }
    },
    dateFormat() {
        return moment(this.insDt, 'YYYYMMDD').format('YYYY.MM.DD');
    },
    totalPric() {
        let odAtwrk = this.odAtwrk;
        let totalPric = 0;
        odAtwrk.forEach(function(val, idx) {
            totalPric += val.amt;
        });

        return totalPric;
    },
    atwrkInfos() {
        let info = Atwrk.findOne({_id : this.atwrkID});
        return info;
    },
    confirmPurch(insDt) {
        let confirmDate = moment(insDt, 'YYYYMMDD').add(3, 'w').format('YYYY.MM.DD');
        return confirmDate;
    }


});
