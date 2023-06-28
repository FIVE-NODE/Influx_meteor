import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

import './artMenu.html';

Template.artMenu.onCreated(function() {
    
    // 원화 와 디지털 판화 변경시 바뀌는 플레그
    artKindFlag = new ReactiveVar('art');
});

Template.artMenu.onRendered(function() {
});

Template.artMenu.events({
    'click a[name=zOne]'() {
        this.changePage.set('zOne');
    },
    'click button[name=allCancel]'() {
        $('input[name=chk]').prop('checked', false);
    },
    'click button[name=art]'() {
        artKindFlag.set('art');
    },
    'click button[name=dtp]'() {
        artKindFlag.set('dtp');
    },
    'click button[name=schBtn]'(evt, tmpl) {
        var chked = $('input[name=chk]:checked');
        // var pricChked = $('input[name=radio-artwork--price]:checked');

        // 검색조건 하나라도 선택했을때
        if(chked.length > 0) {
            var queryData = {};
            var dataList = [];
            var beforKind = '';

            // query 데이터 설정
            for(var i=0; i < chked.length; i++) {
                var splitVal = chked[i].value.split('-');
                var kind = splitVal[0];
                var code = splitVal[1];
                var codeData = dataSet(kind, code);
                
                if(beforKind != kind && beforKind != '') {
                    queryData[beforKind] = dataList;
                    dataList = [];
                }

                dataList.push(codeData);

                beforKind = kind;

                if(i === (chked.length -1)) queryData[beforKind] = dataList;
            }
            
            FlowRouter.go(`/atwrkList/sch`, {}, { data : encodeURIComponent(JSON.stringify(queryData)) });
            location.reload();
        } else {
            // 검색조건 하나도 선택하지 않았을때.
        }
    }
    
});

// 검색 데이터 셋팅
function dataSet(kind, code) {
    var res;
    switch(kind) {
        case 'ARTWORK_PRICE':
            var price = Meteor.codes.ARTWORK_PRICE();
            price.forEach(function(val, idx) {
                if(code === val.code) {
                    res = val;
                }
            });
            break;
        case 'MK_YEAR':
            var mkyear = Meteor.codes.MK_YEAR();
            mkyear.forEach(function(val, idx) {
                if(code === val.code) {
                    res = val;
                }
            });
            break;
        default:
            res = code;
            break;
    }

    return res;
}

Template.artMenu.helpers({
    kindFlag() {
        return artKindFlag.get() === 'dtp' ? false : true;
    },
    price() {
        return Meteor.codes.ARTWORK_PRICE();
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
    }
});

