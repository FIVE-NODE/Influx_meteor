import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

import './galleryMenu.html';

Template.galleryMenu.onCreated(function() {
});

Template.galleryMenu.onRendered(function() {
});

Template.galleryMenu.events({
    'click button[name=allCancel]'() {
        $('input[name=glryChk]').prop("checked", false);
    },
    'click button[name=schBtn]'(evt, tmpl) {
        var chked = $('input[name=glryChk]:checked');
        var glryNm = $('input[name=glryNm]').val();
        
        if(chked.length > 0 || glryNm != '') {
            var queryData = {};
            var dataList = [];
            var beforKind = '';

            queryData.glryNm = glryNm;

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

                if(kind === 'REGION') {
                    dataList.push(splitVal[2]);
                }
                else dataList.push(codeData);

                beforKind = kind;

                if(i === (chked.length -1)) queryData[beforKind] = dataList;
            }
            // Session.set('data', queryData);

            FlowRouter.go('/exhibitionEvnt', {}, { data : encodeURIComponent(JSON.stringify(queryData)) });

            location.reload();
        } else {
            // 검색조건 하나도 선택하지 않았을때.
        }
    }
});

Template.galleryMenu.helpers({
    region() {
        return Meteor.codes.BY_REGION();
    },
    evnt() {
        return Meteor.codes.EVENT_TYPE();
    }
});

