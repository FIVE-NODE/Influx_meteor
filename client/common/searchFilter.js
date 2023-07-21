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

    options ={
        skip : skip.get(),
        limit: limit.get()
    }

    if(flagChk === 'sch') console.log(JSON.parse(this.data.schQueryData()));

});

Template.searchFilter.onRendered(function() {
    renderFlag.set(true);
});

// DB 검색조건 수정 및 옵션 설정
function setQuery() {
    console.log(Template.instance().data.filterQuery.get());
    query = Template.instance().data.filterQuery.get();
    options = {
        skip : skip.get(),
        limit: limit.get()
    };

    return query;
}

// 선택해제 버튼 이벤트용 Func
function cancelCheckBox(name) {
    var input = $(`#artwork-${name} input`);
    input.prop('checked', false);
}

// 아티스트 필터 해제 버튼용 Func
function cancelCheckAtst() {
    var rprAtst = $('button[name=rprsnAtst]');
    rprAtst.removeClass('is-active');
}

Template.searchFilter.events({
    'click button[name=rprsnAtst]'(evt, tmpl) {
        var tar = $(evt.target);
        if(tar.hasClass('is-active')) {
            tar.removeClass('is-active');
        } else {
            tar.addClass('is-active');
        }
    },
    'click button[name=atstAllDeSelect]'(evt, tmpl) {
        cancelCheckAtst();
    },
    'click button[name=allCancel]'() {
        $('input[name=filterChk]').prop('checked', false);
        cancelCheckAtst();
    },
    'click button[name=priceCancelBtn]'() {
        cancelCheckBox('price');
    },
    'click button[name=mediumCancelBtn]'() {
        cancelCheckBox('medium');
    },
    'click button[name=mkyyCancelBtn]'() {
        cancelCheckBox('mkyy');
    },
    'click button[name=style1CancelBtn]'() {
        cancelCheckBox('style1');
    },
    'click button[name=style2CancelBtn]'() {
        cancelCheckBox('style2');
    },
    'click button[name=materialCancelBtn]'() {
        cancelCheckBox('material');
    },
    // 필터 이벤트
    'change input[name=filterChk]'(evt, tmpl) {
        var chked = $('input[name=filterChk]:checked');
        var dataList = [];
        var beforKind = '';
        var queryData = {};

        for(var i=0; i < chked.length; i++) {
            var splitVal = chked[i].value.split('-');
            var kind = splitVal[0];
            var code = splitVal[1];
            var codeData = Meteor.clientCommonUtils.dataSet(kind, code);

            if(beforKind != kind && beforKind != '') {
                queryData[beforKind] = dataList;
                dataList = [];
            }

            dataList.push(codeData);

            beforKind = kind;

            if(i === (chked.length -1)) queryData[beforKind] = dataList;
        }

        tmpl.data.filterQuery.set(queryData);
        

        setQuery();
    },
    
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
    priceOgPrt() {
        return Meteor.codes.ARTWORK_PRICE_OGPRT();
    },
    medium() {
        return Meteor.codes.MEDIUM();
    },
    mkyy() {
        return Meteor.codes.MK_YEAR();
    },
    style1() {
        return Meteor.codes.STYLE_1();
    },
    style2() {
        return Meteor.codes.STYLE_2();
    },
    materials() {
        return Meteor.codes.MATERIAL();
    },
});
