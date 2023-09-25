import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

import './artistMenu.html';

Template.artistMenu.onCreated(function() {
    atstFilterHeader = new ReactiveVar();
});

Template.artistMenu.onRendered(function() {
});

Template.artistMenu.events({
    'click button[name=allCancel]'() {
        $('input[name=artistChk]').prop("checked", false);
    },
    'click button[name=schBtn]'(evt, tmpl) {
        var chked = $('input[name=artistChk]:checked');
        var atstNm = $('input[name=menuAtstNm]').val();

        // 검색조건 하나라도 선택했을때
        if(chked.length > 0 || atstNm != '') {
            var queryData = {};
            var dataList = [];
            var beforKind = '';

            queryData.ATSTNM = atstNm == '' ? undefined : [atstNm];

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

            FlowRouter.go('/originalAtwrk', {}, { data : encodeURIComponent(JSON.stringify(queryData)) });
            
            // location.reload();
        } else {
            // 검색조건 하나도 선택하지 않았을때.
        }

        $('#slideMenus').removeClass('is-open');
        $('#clickToArtist').removeClass('is-open');      
    }
});

Template.artistMenu.helpers({
    style1() {
        return Meteor.codes.STYLE_1();
    },
    style2() {
        return Meteor.codes.STYLE_2();
    },
    mkyy() {
        return Meteor.codes.MK_YEAR();
    },
    leftFilterChk(kind, code) {
        var selectCodes = agFilterHeader.get()[kind];
        for(idx in selectCodes) {
            if(typeof selectCodes[idx] === 'object') {
                if(selectCodes[idx].code === code) {
                    return 'checked';
                }
            } else {
                if(selectCodes[idx] === code) {
                    return 'checked';
                }
            }
        }
    },
});


