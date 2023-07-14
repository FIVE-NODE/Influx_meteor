import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

import './artMenu.html';

Template.artMenu.onCreated(function() {
    
    // 원화 와 디지털 판화 변경시 바뀌는 플레그
    artKindFlag = new ReactiveVar('ogPrt');
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
        artKindFlag.set('ogPrt');
        $('input[name=chk]').prop('checked', false);
    },
    'click button[name=dtp]'() {
        artKindFlag.set('dtPrt');
        $('input[name=chk]').prop('checked', false);
    },
    'click button[name=schBtn]'(evt, tmpl) {
        var chked = $('input[name=chk]:checked');

        // 검색조건 하나라도 선택했을때
        if(chked.length > 0) {
            var queryData = {};
            var dataList = [];
            var beforKind = '';

            queryData.kind = artKindFlag.get();

            // query 데이터 설정
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
            // Session.set('data', queryData);

            console.log('queryData', queryData);

            if(artKindFlag.get() === 'ogPrt') {
                FlowRouter.go('/originalAtwrk', {}, { data : encodeURIComponent(JSON.stringify(queryData)) });
            } else {
                FlowRouter.go('/digitalAtwrk', {}, { data : encodeURIComponent(JSON.stringify(queryData)) });
            }
            
            location.reload();
        } else {
            // 검색조건 하나도 선택하지 않았을때.
        }
    }
    
});

Template.artMenu.helpers({
    kindFlag() {
        return artKindFlag.get() === 'dtPrt' ? false : true;
    },
    priceOgPrt() {
        return Meteor.codes.ARTWORK_PRICE_OGPRT();
    },
    priceOgDtp() {
        return Meteor.codes.ARTWORK_PRICE_DTPRT();
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
    base() {
        return Meteor.codes.BASE();
    }
});

