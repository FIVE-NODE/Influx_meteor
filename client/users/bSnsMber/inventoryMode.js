import './inventoryMode.html';

import './inventoryPopup.js';

Template.inventoryMode.onCreated(function() {
    query = { 'glry.bsnsID' : Meteor.userId() };

    options = {};
  
    // 사용자 정보
    uInfo = new ReactiveVar();
  
    // 정렬
    sortInfo = new ReactiveVar();
  
    // 필터 정보
    filters = new ReactiveVar({});

    // 작품정보 리스트
    atstInfo = new ReactiveVar();

    // 삭제할 작품 _id
    delId = new ReactiveVar();

    renderFlag = new ReactiveVar(false);

    this.autorun(() => {
        const userData = Meteor.user();
        if(userData != undefined && uInfo.get() == undefined) {
            uInfo.set(userData.profile.uInfos);
            seltInventoryMode();
        }
    });
});

function setQuery() {
    query = {};
    query = filters.get();
    
    options = {};
}

function seltInventoryMode() {
    Meteor.call('seltInventoryMode', query, function(err, res) {
        renderFlag.set(false);
        if(err) console.log(err);
        else {
            atstInfo.set(res);
            setTimeout(function() {
                renderFlag.set(true);
            }, 200);
        }
    });
}

Template.inventoryMode.onRendered(function() {
});

Template.inventoryMode.events({
    // 메뉴 전체선택해제
    'click button[name=menuAllCancel]'(evt, tmpl) {
        filters.set({});
        $('input[name=menuSchChk]:checked').prop('checked', false);
    },
    // 작품 삭제 버튼
    'click button[name=delBtn]'(evt, tmpl) {
        var atwrkId = $(evt.currentTarget).val();

        delId.set(atwrkId);

        $('#del_confirm_popup').addClass('is-open');
    },
    // 작품삭제 컨펌 삭제 버튼 이벤트
    'click button[name=delConfirmBtn]'(evt, tmpl) {
        var atwrkId = delId.get();
        query.atwrkId = atwrkId;
        
        Meteor.call('delInventoryAtwrk', query, function(err, res) {
            if(err) console.log(err);
            else {
                delId.set();
            }
        });

        $('#del_confirm_popup').removeClass('is-open');
    },
    // 상단 메뉴 검색 버튼 이벤트
    'click button[name=menuSchBtn]'(evt, tmpl) {
        var schList = $('input[name=menuSchChk]:checked');
        
        if(schList.length > 0) {
            var schSet = {};
            var dataList = [];
            var beforKind = '';

            for(i=0; i<schList.length; i++) {
                var splitVal = schList[i].value.split('-');
                var kind = splitVal[0];
                var code = splitVal[1];

                if(beforKind != kind && beforKind != '') {
                    schSet[beforKind] = dataList;
                    dataList = [];
                }

                dataList.push(code);

                beforKind = kind;

                if(i === (schList.length -1)) schSet[beforKind] = dataList;
            }

            filters.set(schSet);

            setQuery();

            seltInventoryMode();

        } else {
            filters.set({});

            setQuery();

            seltInventoryMode();
        };
    },
});

Template.inventoryMode.helpers({
    bsnsInfo() {
        if(uInfo.get() != undefined) {
            return uInfo.get();
        }
    },
    invntChk() {
        if(atstInfo.get() != undefined) return true;
        else return false;
    },
    invntInfo() {
        if(atstInfo.get() != undefined) return atstInfo.get();
    },
    glryAtstList() {
        if(atstInfo.get() != undefined) {
            let res = uInfo.get().rprsnAtst;
            return res;
        }
    },
    materials() {
        return Meteor.codes.MATERIAL();
    },
    renderFlag() {
        return renderFlag.get();
    }
});
