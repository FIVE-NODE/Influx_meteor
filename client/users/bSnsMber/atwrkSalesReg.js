import './atwrkSalesReg.html';

const numberChk = /[^0-9.]/g; 
const comma = /\B(?=(\d{3})+(?!\d))/g

Template.atwrkSalesReg.onCreated(function() {

    //등록된 작품 정보
    atwrkInfo = new ReactiveVar();

    sellkindFlag = new ReactiveVar();

    digitalBoth = new ReactiveVar(false);

    renderFlag = new ReactiveVar(false);

    // 원화 최종 만매 개시 금액
    ogTotalPric = new ReactiveVar(0);

    // 디지털 판화 최종 판매 개시 금액
    dtTotalPric = new ReactiveVar(0);

    // 흥정 선택1
    seltHagg1 = new ReactiveVar();

    // 흥정 선택2
    seltHagg2 = new ReactiveVar();

    Meteor.call('selectAtwrkDetail', this.data.atwrkId(), function(err, res) {
        atwrkInfo.set(res);
        console.log(atwrkInfo.get());
    });

    this.autorun(() => {
        if(atwrkInfo.get() != undefined) {
            renderFlag.set(true);
        }
        
    });
});

Template.atwrkSalesReg.onRendered(function() {
});

// 인풋 콤마 찍기
function inputComma(pric) {
    var pricVal = pric.val().toString();
    pric.val(pricVal.replace(numberChk, '').replace(comma, ','));
}

Template.atwrkSalesReg.events({
    'keyup input[name=strPric]'(evt, tmpl) {
        inputComma($(evt.currentTarget));
    },
    'keyup input[name=endPric]'(evt, tmpl) {
        inputComma($(evt.currentTarget));
    },
    'keyup input[name=pric]'(evt, tmpl) {
        inputComma($(evt.currentTarget));
    },
    'change input[name=pric]'(evt, tmpl) {
        var pric = parseInt($(evt.currentTarget).val().replace(/,/g, ""));
        ogTotalPric.set(pric + (pric * 0.05));
        // if()
    },
    'change input[name=endPric]'(evt, tmpl) {
        var pric = parseInt($(evt.currentTarget).val().replace(/,/g, ""));
        ogTotalPric.set(pric + (pric * 0.05));
    },
    'change input[name=check-saleCondition--method]'(evt, tmpl) {
        sellkindFlag.set($(evt.currentTarget).val());
        ogTotalPric.set(0);
    },
    'change #check-saleCondition--permit01'(evt, tmpl) {
        var chk = $(evt.currentTarget).is(':checked');
        digitalBoth.set(chk);
        if(chk) $('div[name=digitalSell]').css({'display' : ''});
        else $('div[name=digitalSell]').css({'display' : 'none'});
    }
});

Template.atwrkSalesReg.helpers({
    atInfo() {
        if(atwrkInfo.get() != undefined && atwrkInfo.get() != null) {
            return atwrkInfo.get();
        }
    },
    sellkind() {

    },
    digitalBoth() {
        return digitalBoth.get();
    },
    renderFlag() {
        return renderFlag.get();
    },
    scout() {
        return sellkindFlag.get() == '001';
    },
    bid() {
        return sellkindFlag.get() == '002';
    },
    scoutBargain() {
        return sellkindFlag.get() == '003';
    },
    ogTotalPric() {
        return Meteor.commonUtils.priceComma(ogTotalPric.get());
    },
    dtTotalPric() {
        return Meteor.commonUtils.priceComma(dtTotalPric.get());
    },
});
