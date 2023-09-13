import './inventoryMode.html';

import './inventoryPopup.js';

var prtContent = '<link rel="stylesheet" href="/css/sub.css">';

Template.inventoryMode.onCreated(function() {
    query = { 'glry.bsnsID' : Meteor.userId() };
  
    // 사용자 정보
    uInfo = new ReactiveVar();
  
    // 필터 정보
    filters = new ReactiveVar({});

    // 작품정보 리스트
    atstInfo = new ReactiveVar();

    // 작가이름 리스트
    atstList = new ReactiveVar();

    // 선택작품 저장
    seltAtstInfo = new ReactiveVar();

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
}

function seltInventoryMode() {
    Meteor.call('seltInventoryMode', query, function(err, res) {
        renderFlag.set(false);
        if(err) console.log(err);
        else {
            atstInfo.set(res.data);
            atstList.set(res.atstList);
            seltAtstInfo.set(res.data);
            setTimeout(function() {
                renderFlag.set(true);
            }, 200);
        }
    });
}

Template.inventoryMode.onRendered(function() {
});

Template.inventoryMode.events({
    // 선탯 checkbox
    'change input[name=atwrkChkBox]'(evt, tmpl) {
        var chkId = $(evt.currentTarget).val();
        if($(evt.currentTarget).prop('checked')) {
            $(`#${chkId}`).find('td').css('color', '');
            $(`#${chkId}`).find('img').css('filter', '');

            let seltAtList = seltAtstInfo.get();
            seltAtList.forEach(function(val, idx) {
                let atwrkList = val.atwrkInfo.findIndex(function(item) { return item.atwrkId == chkId})
                if (atwrkList > -1 && val.atwrkInfo[atwrkList].show == 'N') val.atwrkInfo[atwrkList].show = 'Y';
            });

            seltAtstInfo.set(seltAtList);
        } else {
            $(`#${chkId}`).find('td').css('color', '#B9B9B9');
            $(`#${chkId}`).find('img').css('filter', 'opacity(0.5)');

            let seltAtList = seltAtstInfo.get();
            seltAtList.forEach(function(val, idx) {
                let atwrkList = val.atwrkInfo.findIndex(function(item) { return item.atwrkId == chkId})
                
                if (atwrkList > -1) val.atwrkInfo[atwrkList].show = "N";
            });

            seltAtstInfo.set(seltAtList);
        }
    },
    // 메뉴 전체선택해제
    'click button[name=menuAllCancel]'(evt, tmpl) {
        filters.set({});
        $('input[name=menuSchChk]:checked').prop('checked', false);
    },
    'click button[name=printBtn]' (evt, tmpl) {
        // printAreas
        $('#printAreas').removeClass('overflowAutos');

        prtContent += document.getElementById('printAreas').innerHTML;
        
        document.body.innerHTML = prtContent;

        window.onbeforeprint = function(ev) {
            // document.getElementById('inventory_popup_preview"').innerHTML = prtContent;
        };

        // window.onafterprint = afterPrint;

        setTimeout(function() {
            window.print();

            location.reload();
        }, 250);
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

// 웹페이지 body 내용을 프린트하고 싶은 내용으로 교체
function beforePrint(){
	initBody = document.body.innerHTML;
	document.body.innerHTML = prtContent.innerHTML;
}

// 프린트 후, 웹페이지 body 복구
function afterPrint(){
	document.body.innerHTML = initBody;
}

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
        if(atstList.get() != undefined) {
            let res = atstList.get();
            return res;
        }
    },
    materials() {
        return Meteor.codes.MATERIAL();
    },
    renderFlag() {
        return renderFlag.get();
    },
    numbering(index) {
        return (index + 1);
    },
    ogChk(ogNm) {
        return ogNm == undefined;
    },
    bothChk(dtNm) {
        return dtNm != undefined;
    },
    atstInfos() {
        return this.atwrkInfo[0];
    },
    printShow() {
        if(seltAtstInfo.get() != undefined) {
            return seltAtstInfo.get();
        }
    },
    printShowChk(data) {
        switch(data.show) {
            case 'N':
                return false;
            default:
                return true;
        }
    }
});

