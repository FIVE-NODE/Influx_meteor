import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

import { clientSchAtwrk } from '../lib/clientCollections.js';

import './searchFilter.html';

Template.searchFilter.onCreated(function() {

    atstListFilter = new ReactiveVar([]);

    // 랜더링 플레그
    renderFlag = new ReactiveVar(false);

    rprsnAtst = new ReactiveVar();
    detail = new ReactiveVar();

    flagChk = FlowRouter.getParam('_id');

    // 금액설정 검색과 금액 기준이 달라서 새로 만듬
    price = new ReactiveVar();

    var priceData = [
        { code : '001', min : 0, max : 499999, name : '50만원 미만'},
        { code : '002', min : 500000, max : 1000000, name : '50~100만원'},
        { code : '003', min : 1000000, max : 2000000, name : '100~200만원'},
        { code : '004', min : 2000000, max : 5000000, name : '200~500만원'},
        { code : '005', min : 5000000, max : 10000000, name : '500~1000만원'},
        { code : '006', min : 10000000, max : 50000000, name : '1000~5000만원'},
        { code : '007', min : 50000000, max : 9999999999999, name : '5000만원 이상'},
    ];

    price.set(priceData);

    if(flagChk === 'sch') console.log(JSON.parse(this.data.schQueryData()));

});

Template.searchFilter.onRendered(function() {
    renderFlag.set(true);
});

Template.searchFilter.events({
    'click button[name=rprsnAtst]'(evt, tmpl) {
        var tar = $(evt.target);
        if(tar.hasClass('is-active')) {
            tar.removeClass('is-active');
        } else {
            // var atstLists = atstListFilter.get();

            tar.addClass('is-active');

            // console.log(tmpl.data.schData.get());

            // var queryData = tmpl.data.schData.get();
            // atstLists.push(this);

            // queryData['FILTER'] = {
            //     'ATSTNM' : atstLists
            // }

            // console.log(queryData);

        }

    },
    'click button[name=atstAllDeSelect]'(evt, tmpl) {
        $('button[name=rprsnAtst]').removeClass('is-active');
    },
    'click button[name=styleAllDeSelect]'(evt, tmpl) {
        $('input[name=style]').prop('checked', false);
    },
    'click button[name=priceAllDeSelect]'(evt, tmpl) {
        $('input[name=product-price]').prop('checked', false);
    },
    'click button[name=materialsAllDeSelect]'(evt, tmpl) {
        $('input[name=materials]').prop('checked', false);
    },
    'click .uncheck-all'(evt, tmpl) {
        $('input[name=rprsnAtst]').prop('checked', false);
        $('input[name=style]').prop('checked', false);
        $('input[name=product-price]').prop('checked', false);
        $('input[name=materials]').prop('checked', false);
    },
    'change input'(evt, tmpl) {
        console.log($(evt.target));
        console.log(JSON.parse(tmpl.data.schQueryData()));
        console.log(' change input');
    }
    
});

Template.searchFilter.helpers({
    rprsnAtst() {
        var res = false;

        if(flagChk != 'sch' && this.atstInfoList.get() != undefined) {
            // 검색으로 들어왔을때
            rprsnAtst.set(this.atstInfoList.get().rprsnAtst);
            
            res = rprsnAtst.get().length != 0 ? rprsnAtst.get() : false; 
            
            detail.set(this.atstInfoList.get());
        } else {
            // 검색으로 들어온게 아닐 경우
            res = this.atstInfoList.get() != 0 ? this.atstInfoList.get() : false;
        }

        return res;
    },
    renderFlag() {
        return renderFlag.get();
    },
    style() {
        return Meteor.codes.STYLE_1();
    },
    price() {
        return price.get();
    },
    materials() {
        return Meteor.codes.MATERIAL();
    }
});
