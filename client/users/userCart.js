import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

import './userCart.html';

import '../popup/utilsPopUp.js';

Template.userCart.onCreated(function() {
    uInfo = new ReactiveVar();
       
    atwrkList = new ReactiveVar();

    glryList = new ReactiveVar();

    cartLists = new ReactiveVar();

    seltDelFlag =  new ReactiveVar(false);

    seltDelPro = new ReactiveVar('');

    popUpMessage = new ReactiveVar('');

    pricDatas = new ReactiveDict();

    renderFlag = new ReactiveVar(false);

    totalProCnt = new ReactiveVar();

    this.autorun(() => {
        const userData = Meteor.user();
        if(userData != undefined && uInfo.get() == undefined) {
            uInfo.set(userData.profile.uInfos);
            sltUserCart();
        }
    });
});

function sltUserCart() {
    cartLists.set(Meteor.user().profile.uInfos.cart);
    var cartList = cartLists.get();
    var seltData = new Set();

    for(idx in cartList) seltData.add(cartList[idx].atwrkId);

    Meteor.call('sltUserCart', [...seltData], function(err, res) {
        var glry = [];
        
        var setData = [];

        cartList.forEach((cartVal, num) => {
            var atwrkInfo = res.filter(e => e._id == cartVal.atwrkId)[0];
            cartVal.atwrkInfo = atwrkInfo;
            setData.push(cartVal);
        });

        res.forEach((val, num) => {
            var delivFee = 0;
            var ogPlus = '';

            if(glry.length != 0) {
                var chk = false;
                glry.forEach((value, idx) => {
                    if(value.name == val.glry.glryNm) chk = true;
                });
                if(!chk) {
                    setData.forEach((cartData, cartNum) => {
                        if(cartData.atwrkInfo.glry.bsnsID == val.glry.bsnsID) {
                            if(cartData.atwrkFlag == 'dtPrt') delivFee += 6000;
                            else ogPlus = '원화 배송은 상담사에게 문의해주세요';
                        }
                    });
                    glry.push(
                        {
                            name : val.glry.glryNm,
                            bsnsID : val.glry.bsnsID,
                            delivFee,
                            ogPlus
                        }
                    );
                }
            } else {
                setData.forEach((cartData, cartNum) => {
                    if(cartData.atwrkInfo.glry.bsnsID == val.glry.bsnsID) {
                        if(cartData.atwrkFlag == 'dtPrt') delivFee += 6000;
                        else ogPlus = '원화 배송은 상담사에게 문의해주세요';
                    }
                });
                glry.push(
                    { 
                        name : val.glry.glryNm,
                        bsnsID : val.glry.bsnsID,
                        delivFee,
                        ogPlus
                    }
                );
            }
        });

        var proDuctPric = 0;
        var delivPric = 0;

        if(setData != undefined) {
            var atList = setData;
            for(idx in atList){
                var flag = atList[idx].atwrkFlag;
                var atInfo = atList[idx].atwrkInfo;
                if(flag == 'ogPrt') proDuctPric += atInfo[flag].pric;
                else {
                    var size = atList[idx].option.size;
                    size = size.toLowerCase();
                    proDuctPric += atInfo[flag][`${size}Pric`]
                    delivPric += 6000;
                }
            }

            pricDatas.set('proDuctPric', proDuctPric);
            pricDatas.set('delivPric', delivPric);
            pricDatas.set('salePric', 0);
            pricDatas.set('aprValPric', (proDuctPric + delivPric));
        } else {
            pricDatas.set('proDuctPric', 0);
            pricDatas.set('delivPric', 0);
            pricDatas.set('salePric', 0);
            pricDatas.set('aprValPric', 0);
        }

        atwrkList.set(setData);
        glryList.set(glry);
        totalProCnt.set(atwrkList.get().length);

        renderFlag.set(true);
    });
};

Template.userCart.onRendered(function() {
});

Template.userCart.events({
    'click button[name=delProduct]'(evt, tmpl) {
        $('#confirm').addClass('is-open');
        seltDelPro.set($(evt.currentTarget).attr('id').split('-')[1]);
    },
    'change input[name=seltAll]'(evt, tmpl) {
        var chk = $(evt.currentTarget).is(':checked');
        if(chk) $('input[name=seltPro]').prop('checked', true);
        else $('input[name=seltPro]').prop('checked', false);
        productPric();
    },
    'click button[name=seltCancel]'(evt, tmpl) {
        var seltPro = $('input[name=seltPro]:checked');
        if(seltPro.length > 0) {
            $('#confirm').addClass('is-open');
            seltDelFlag.set(true);
        } else messagePopup({message : '선택된 작품이 없습니다.'});
        
    },
    'click button[name=delete]'(evt, tmpl) {
        if(seltDelFlag.get()) {
            var chkdAt = $('input[name=seltPro]:checked');            
            var beAtwrkList = atwrkList.get();
            var delQueryIds = [];

            for(i=0; i<chkdAt.length; i++) {
                var cartId = $(chkdAt[i]).attr('id').split('-')[1];
                delete beAtwrkList[cartId].atwrkInfo;
                delQueryIds.push(beAtwrkList[cartId]);
                delete beAtwrkList[cartId];
            }

            Meteor.call('removeBasket', delQueryIds, function(err, res) {
                if(err) console.log(err);
                else {
                    $('#confirm').removeClass('is-open');
                    $('input[name=seltPro]').prop('checked', false);
                    $('input[name=seltAll]').prop('checked', false);
                    
                    uInfo.set(Meteor.user().profile.uInfos.cart);

                    sltUserCart();

                    seltDelFlag.set(false);
                }
            });
        } else {
            var seltDelData = atwrkList.get()[seltDelPro.get()];
            delete seltDelData.atwrkInfo;
            Meteor.call('removeBasket', [seltDelData], function(err, res) {
                $('#confirm').removeClass('is-open');
                seltDelPro.set('');
                sltUserCart();
            });
        }
    },
    'click button[name=dirBuy]'(evt, tmpl) {
        var btnVal = $(evt.currentTarget).attr('id').split('_');
        var sendData = atwrkList.get()[btnVal[1]];
        sendData.cnt = $(`button[name=MAINCNT_${btnVal[1]}_${btnVal[2]}]`).text();
        Meteor.call('encrypt', JSON.stringify(sendData), function(err, res){
            localStorage.setItem('if.ba.to', JSON.stringify({l : 'dir'}));
            localStorage.setItem('crt_bundle', res);
            FlowRouter.go('/approval');
        });
    },
    'click button[name=seltBuyBtn]'(evt, tmpl) {
        // 선택한 작품 결재 페이지로 이동
        var seltPrtChk = $('input[name=seltPro]:checked');
        var sendData = [];
        var setData = atwrkList.get();

        for(i=0; i<seltPrtChk.length; i++) {
            var chkVal = $(seltPrtChk[i]).attr('id').split('-');
            var data = setData[chkVal[1]];
            var getCnt = $(`button[name=MAINCNT_${chkVal[1]}_${data.atwrkId}]`).text();
            
            data.cnt = getCnt;
            sendData.push(data);
        }

        Meteor.call('encrypt', JSON.stringify(sendData), function(err, res){
            localStorage.setItem('if.ba.to', JSON.stringify({l : 'all'}));
            localStorage.setItem('crt_bundle', res);
            FlowRouter.go('/approval');
        });
    },
    'click button[name=chgCnt]'(evt, tmpl) {
        var seltCnt = parseInt($(evt.currentTarget).text());
        var ulVal = $(evt.currentTarget).parents('ul').attr('name').split('_');
        var proList = $(`div[name=dtPrt_${ulVal[2]}]`);
        var totalCnt = 0;
        var maxCnt = parseInt(atwrkList.get()[ulVal[1]].atwrkInfo.dtPrt.selCnt);

        for(i=0; i<proList.length; i++) {
            totalCnt += parseInt($(proList[i]).children('button').text());
        }

        var ogAtwrkList = atwrkList.get();

        if(totalCnt > maxCnt){
            var setCnt = seltCnt - (totalCnt - maxCnt);
            
            $(`button[name=MAINCNT_${ulVal[1]}_${ulVal[2]}]`).text(setCnt);
            $(evt.currentTarget).parents('li').removeClass('is-active');

            // ogAtwrkList[ulVal[1]].cnt = setCnt;
            // atwrkList.set(ogAtwrkList);

            messagePopup({message: `최대 구매 갯수를 초과했습니다. 구매가능한 갯수는 ${maxCnt} 입니다.`});
        } else {
            // $(`button[name=MAINCNT_${ulVal[1]}_${ulVal[2]}]`).val('');

            // ogAtwrkList[ulVal[1]].cnt = seltCnt;
            // atwrkList.set(ogAtwrkList);
        }
    },
    'change input[name=seltPro]'(evt, tmpl) {
        var seltPrtChk = $('input[name=seltPro]:checked');
        var setData = atwrkList.get();
        
        if(seltPrtChk.length == setData.length) $('#check-basket--all').prop('checked', true);
        else $('#check-basket--all').prop('checked', false);

        productPric(seltPrtChk);
    }
});

function productPric() {
    var setData = atwrkList.get();
    var seltPrtChk = $('input[name=seltPro]:checked');

    var proDuctPric = 0;
    var delivPric = 0;

    if(seltPrtChk.length > 0) {
        totalProCnt.set(seltPrtChk.length);
        for(i=0; i<seltPrtChk.length; i++) {
            var cartVal = $(seltPrtChk[i]).attr('id').split('-');
            var flag = setData[cartVal[1]].atwrkFlag;
            var atInfo = setData[cartVal[1]].atwrkInfo;

            
            if(flag == 'ogPrt') proDuctPric += atInfo[flag].pric;
            else {
                var size = setData[cartVal[1]].option.size;
                size = size.toLowerCase();
                proDuctPric += atInfo[flag][`${size}Pric`]
                delivPric += 6000;
            }
        }

        pricDatas.set('proDuctPric', proDuctPric);
        pricDatas.set('delivPric', delivPric);
        pricDatas.set('salePric', 0);
        pricDatas.set('aprValPric', (proDuctPric + delivPric));
    } else {
        totalProCnt.set(0);
        pricDatas.set('proDuctPric', 0);
        pricDatas.set('delivPric', 0);
        pricDatas.set('salePric', 0);
        pricDatas.set('aprValPric', 0);
    }
}

// 팝업 메시지 띄우기
function messagePopup(message) {
    popUpMessage.set(message);
    $('#utilsPopUp').addClass('is-open');
}

Template.userCart.helpers({
    glryIdChk(glryId, dataId) {
        return glryId == dataId;
    },
    glryList() {
        if(glryList.get() != undefined) {
            return glryList.get();
        }
    },
    atwrkList() {
        if(atwrkList.get() != undefined) {
            return atwrkList.get();
        }
    },
    cartLists() {
        if(cartLists.get() != undefined) {
            return cartLists.get();
        }
    },
    flagChk() {
        return this.atwrkFlag == 'ogPrt';
    },
    dtpPrice() {
        var size = this.option.size;
        var lower = size.toLowerCase();
        return Meteor.commonUtils.priceComma(this.atwrkInfo[this.atwrkFlag][`${lower}Pric`]);
    },
    maxDtpCnt() {
        var selCnt = this.atwrkInfo.dtPrt.selCnt;
        var seltCnt = this.cnt;
        var cntList = [];
        
        for(i=1; i<=selCnt; i++) {
            var reData = {
                number : i,
                active : ''
            }
            if(seltCnt == selCnt) reData.active = 'is-active';

            cntList.push(reData);
        }

        return cntList;
    },
    popMsg() {
        return popUpMessage.get();
    },
    approVal() {
        if(pricDatas.all() != undefined) return pricDatas.all();
    },
    proCnt() {
        if(totalProCnt.get() != undefined) return totalProCnt.get();
    },
    deliv() {
        if(pricDatas.all() != undefined) return Meteor.commonUtils.priceComma(pricDatas.get('delivPric'));
    },
    sale() {
        if(pricDatas.all() != undefined) return Meteor.commonUtils.priceComma(pricDatas.get('salePric'));
    },
    renderFlag() {
        return renderFlag.get();
    }
});


