import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

import './glryAtwrks.html';

Template.glryAtwrks.onCreated(function() {
    // page 정보
    curPage = new ReactiveVar(1);
    skip = new ReactiveVar(0);
    limit = new ReactiveVar(15);
    total = new ReactiveVar(0);
 
    query = {};

    options = {
        skip : skip.get(),
        limit: limit.get()
    };
  
    // 사용자 정보
    uInfo = new ReactiveVar();
  
    // 정렬
    sortInfo = new ReactiveVar();
  
    // 필터 정보
    filters = new ReactiveVar({});

    // 작품정보 리스트
    atwrkInfo = new ReactiveVar();

    // 삭제할 작품 _id
    delId = new ReactiveVar();

    this.autorun(() => {
        const userData = Meteor.user();
        if(userData != undefined && uInfo.get() == undefined) {
            uInfo.set(userData.profile.uInfos);
            seltTabAtwrk();
        }
    });
});

function seltTabAtwrk() {
    Meteor.call('seltTabAtwrk', query, options, function(err, res) {
        total.set(res.total);
        atwrkInfo.set(res.list);
    });
}

function setQuery() {
    query = {};
    query = filters.get();

    options = {
        skip : skip.get(),
        limit: limit.get(),
        // sort : sortInfo.get()
    };
}

// 스크롤 이동
function scrollMove() {
    var location = $('#move').offset().top;
    Meteor.commonUtils.scrollTop(location);
}

Template.glryAtwrks.onRendered(function() {
        
});

Template.glryAtwrks.events({
    'click a[name=salesReg]'(evt, tmpl) {
        var atwrkId = $(evt.currentTarget).attr('id');
        FlowRouter.go('/atwrkSalesReg', {}, {atwrkId});
    },
    'click a[name=atwrkEditBtn]'(evt, tmpl) {
        var atwrkId = $(evt.currentTarget).attr('id').split('_')[1];
        FlowRouter.go('/ogAtwrkCr', {}, {atwrkId});
    },
    'click button[name=inventory]'(evt, tmpl) {
        console.log('inventory');
        FlowRouter.go('/inventoryMode');
    },
    'click button[name=crAtwrk]'(evt, tmpl) {
        var flag = $(evt.currentTarget).val();
        FlowRouter.go('/ogAtwrkCr', {}, { flag });
    },
    'change input[name=allChkBox]'(evt, tmpl) {
        // 작품 전체 선택
        var curChk = $(evt.currentTarget).is(':checked');

        if(curChk) $('input[name=atwrkChkBox]').prop('checked', true);
        else $('input[name=atwrkChkBox]').prop('checked', false);
    },
    'change input[name=atwrkChkBox]'(evt, tmpl) {
        // 각각의 작품 선택 및 해제 이벤트
        var seltAtChLen = $('input[name=atwrkChkBox]:checked').length;
        var atwrkLtLen = atwrkInfo.get().length

        if(seltAtChLen == atwrkLtLen) $('input[name=allChkBox]').prop('checked', true);
        else $('input[name=allChkBox]').prop('checked', false);
    },
    // 작품 선택 전체해제
    'click button[name=atwrkAllCancel]'(evt, tmpl) {
        $('input[name=atwrkChkBox]').prop('checked', false);
        if($('input[name=allChkBox]').is(':checked')) $('input[name=allChkBox]').prop('checked', false);
    },
    // 메뉴 전체선택해제
    'click button[name=menuAllCancel]'(evt, tmpl) {
        filters.set({});
        $('input[name=menuSchChk]:checked').prop('checked', false);
    },
    // 선택항목 일괄 삭제
    'click button[name=seltDelAtwrk]'(evt, tmpl) {
        var atwrChkList = $('input[name=atwrkChkBox]:checked');

        if(atwrChkList.length > 0) {
            var atwrkIdList = [];
            for(i=0; i<atwrChkList.length; i++) {
                atwrkIdList.push(atwrChkList[i].value);
            }

            delId.set(atwrkIdList);

            $('#del_confirm_popup').addClass('is-open');
        } else alert('선택된 작품이 없습니다.');
        
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

            Meteor.clientCommonUtils.pageNum(curPage, skip, limit, 1);

            setQuery();
            
            seltTabAtwrk();
        } else {
            setQuery();

            seltTabAtwrk();
        };
    },
    // 작품 삭제 버튼
    'click button[name=delBtn]'(evt, tmpl) {
        var atwrkId = $(evt.currentTarget).val();

        delId.set(atwrkId);

        $('#del_confirm_popup').addClass('is-open');
    },
    // 작품삭제 컨펌 삭제 버튼 이벤트
    'click button[name=delConfirmBtn]'(evt, tmpl) {
        var querySet = {};

        if(Array.isArray(delId.get())) querySet = { _id : { $in : delId.get() } };
        else querySet = { _id : delId.get() };

        Meteor.call('deleteAtwrkForGlry', querySet, function(err, res) {
            if(err) {
            } else {
                setQuery();
                seltTabAtwrk();
            }
        });

        $('#del_confirm_popup').removeClass('is-open');
    },
    //page 갯수 변경
    'click button[name=setPageNum]'(evt, tmpl) {
        limit.set(parseInt($(evt.currentTarget).val()));
        setQuery();
        seltTabAtwrk();
    },
     // 페이지
    'click a[name=prev]'(evt, tmpl) {
        if(Meteor.clientCommonUtils.prevPage(curPage, total.get(), limit, skip));
        else {
            setQuery();
        }
    },
    'click a[name=next]'(evt, tmpl) {
        if(Meteor.clientCommonUtils.nextPage(curPage, total.get(), limit, skip)) ;
        else {
            setQuery();
        }
    },
    'click a[name=pageNum]'(evt, tmpl) {
        if(Meteor.clientCommonUtils.pageNum(curPage, skip, limit, this.num));
        else {
            setQuery();
        }
    }
});

Template.glryAtwrks.helpers({
    glryAtstList() {
        if(atwrkInfo.get() != undefined) {
            let res = uInfo.get().rprsnAtst;
            return res;
        }
    },
    tableInfo() {
        if(atwrkInfo.get() != undefined) {
            return atwrkInfo.get();
        }
    },
    page() {
        let res = Meteor.clientCommonUtils.setPage(limit.get(), total.get());
        return res;
    },
    materials() {
        return Meteor.codes.MATERIAL();
    },
    dtpChkAtwrkNm() {
        if(Object.keys(this.ogPrt).length > 0) return this.ogPrt.atwrkNm;
        else return this.dtPrt.atwrkNm;
    },
    dtpChkAtwrkSize() {
        if(Object.keys(this.ogPrt).length > 0) {
            return this.ogPrt.wSize + ' x ' + this.ogPrt.hSize; 
        }
        else { 
            return 'S, M, L';
        }
    },
    dtpChkAtwrkMaterials() {
        if(Object.keys(this.ogPrt).length > 0) {
            return Meteor.codes.MATERIAL(this.ogPrt.metRias).name;
        } else {
            return  Meteor.codes.BASE(this.dtPrt.base).name + '(디지털 판화 베이스)';
        }
    },
    dtpChkMkYY() {
        if(Object.keys(this.ogPrt).length > 0) return this.ogPrt.mkYY;
        else return this.dtPrt.mkYY;
    },
    dtpChkPric() {
        if(Object.keys(this.ogPrt).length > 0) return Meteor.commonUtils.priceComma(this.ogPrt.pric);
        else return Meteor.commonUtils.priceComma(this.dtPrt.sPric);
    },
    dtpFlag() {
        if(Object.keys(this.ogPrt).length > 0) return '원화';
        else return '디지털 판화';
    },
    pageHeaderCount() {
        if(atwrkInfo.get() != undefined) {
            let res = {};
            res.total = total.get();
            res.selling = (atwrkInfo.get().filter(e => e.sellYn == 'Y')).length;
            res.notSelling = (res.total - res.selling);

            return res;
        }
    },
});
