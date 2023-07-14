import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

import './atwrkDetail.html';

// 팝업창
import '../popup/utilsPopUp.js';
import '../popup/buyPop/bidAmount.js';
import '../popup/buyPop/bargainingAccept.js';
import '../popup/buyPop/bargainingRate.js';
import '../popup/buyPop/bargainingRefuse.js';
import '../popup/buyPop/priceInquiryIns.js';
import '../popup/buyPop/priceInquiryAns.js';
import '../popup/buyPop/priceInquiryPay.js';

// 팝업 메시지 띄우기
function messagePopup(message) {
    popUpMessage.set(message);
    $('#utilsPopUp').addClass('is-open');
}

Template.atwrkDetail.onCreated(function() {

    detail = new ReactiveVar();
    images = new ReactiveVar();
    latestList = new ReactiveVar();

    // 디지털 판화 일 경우 갯수
    digitalCnt = new ReactiveVar(1);

    // 디지털 판화 제한 수량
    limitCnt = new ReactiveVar();

    // 샘플 인터리어 이미지 플레그
    sampleInterior = new ReactiveVar(false);

    // Tab Flag 사용자가 원화 탭, 디지털 판화 탭 선택할 때 마다 변경됨
    // ogPrt(원화)
    // dtPrt(디지털 판화)
    tabFlag = new ReactiveVar('ogPrt');

    // 원화, 디지털 판화 둘다 있을땐 true 하나만 있을 땐 false;
    bothFlag = new ReactiveVar(false);

    // 좋아요 눌른 작품인지 확인
    atwrkGoodChk = new ReactiveVar();

    // 조회수
    viewCnt = new ReactiveVar();

    // bid 금액 
    selectBidPrice = new ReactiveVar();

    // 흥정 금액
    bargainingPrice = new ReactiveVar();

    // 사용자 정보
    userInfos = new ReactiveVar({});

    if(sessionStorage.getItem('art_dex') != undefined) {
        Meteor.call('decrypt', sessionStorage.getItem('art_dex'), function(err, res) {
            var userData = JSON.parse(res);
            userInfos.set(userData);
        });
    }

    selectAtwrkDetail();

    function selectAtwrkDetail () {
        Meteor.call('selectAtwrkDetail', FlowRouter.getParam('_id'), function(err, res) {
            // 원화가 없는경우 dtPrt 디지털 판화로 셋팅

            if(res.ogPrt.atwrkNm === undefined) tabFlag.set('dtPrt');
            else if(res.dtPrt.atwrkNm != undefined) bothFlag.set(true);

            var userInfo = sessionStorage.getItem('art_dex');
            if(userInfo != undefined) {
                // 유저 정보가 있는 경우 조회수 기록 체크후 조회수 증가
                Meteor.clientCommonUtils.viewCntEvnt(userInfo, res._id, tabFlag.get());

                // 좋아요 눌럿던 사람인지 확인
                Meteor.call('decrypt', userInfo, function(err, userRes) {
                    var userData = JSON.parse(userRes);
                    var userTp = Object.keys(userRes).includes('snsTp') === false ? 'MBER' : 'SNSMBER';
                    Meteor.call('likeChkMber', userTp, userData._id, res._id, tabFlag.get(), function(err, res) {
                        atwrkGoodChk.set(res != undefined ? true : false);
                    });
                });
                
            } else {
                // 유저 정보가 없는경우 비 로그인 사용자
                if(localStorage.getItem(res._id) === undefined || localStorage.getItem(res._id) === null) {
                    viewsUp();
                    localStorage.setItem(res._id, true);
                }
                
            }

            detail.set(res);
            images.set(res.image);

            var bsnsID = res.glry.bsnsID;

            // 같은 갤럴리의 작품들
            selectLatestGlryList(bsnsID);

        });
    }

    function selectLatestGlryList(_id) {
        Meteor.call('selectLatestGlryList', _id, function(err, res) {
            latestList.set(res);
        });
    }

    function viewsUp() {
        Meteor.call('viewsUp', FlowRouter.getParam('_id'), tabFlag.get(), bothFlag.get());
    }

});

Template.atwrkDetail.onRendered(function() {
    interact('#target')
    .draggable({
        listeners: {
            max: {width: 650, height: 730},
            move: dragMoveListener
        }
    });

    let img = new Image();
    img.src = $('#target').attr('src');

    console.log(img.width);
    console.log(img.height);
});

Template.atwrkDetail.events({
    'click button[name=itemGood]'() {
        Meteor.call();
        var info = {
            _id : FlowRouter.get('_id'),
            prtType : type.get(),
        };
        Meteor.call('atwrkAddLike', info);
    },
    'click button[name=ogPrtTab]'(evt, tmpl) {
        tabBtn($(evt.target));
        tabFlag.set('ogPrt');
    },
    'click button[name=dtPrtTab]'(evt, tmpl) {
        tabBtn($(evt.target));
        tabFlag.set('dtPrt');
    },
    'click button[name=imgList]'(evt, tmpl) {
        if(sampleInterior.get()) sampleInterior.set(false);
        var imgSrc = evt.target.src;
        $('img[name=mainImg]').attr('src', imgSrc);
    },
    'click button[name=msCnt]'(evt, tmpl) {
        if(digitalCnt.get() === 1) ;
        else {
            digitalCnt.set(digitalCnt.get() - 1);
        }
    },
    'click button[name=psCnt]'(evt, tmpl) {
        if(digitalCnt.get() >= limitCnt.get()) {
            alert(`최대 구매 가능한 갯수는 ${limitCnt.get()}개 입니다.`);
        } else digitalCnt.set(digitalCnt.get() + 1);
    },
    // 장바구니
    'click a[name=shBasket]'(evt, tmpl) {
        var userInfo = sessionStorage.getItem('art_dex');

        if(userInfo != undefined) {
            var atwrkId = Object.keys(this).includes('atwrkID') ? this.atwrkID : this._id;

            Meteor.clientCommonUtils.basketBtnEvnt(userInfo, atwrkId);

            messagePopup({
                message : '장바구니 등록이 완료되었습니다.<br>장바구니로 이동 하시겠습니까?',
                btn : [{ name : "예", route : "/basket"}, { name : "아니요", route : "" }]
            });
        } else {
            messagePopup({message : '로그인 후 이용해주세요'});
        }
    },
    // 구매하기 원화
    'click button[name=ogPrtBuy]'(evt, tmpl) {
        console.log('ogPrt buy ======= ');
    },
    // 구매하기 디지털 판화
    'click button[name=dtPrtBuy]'(evt, tmpl) {
        console.log('dtPrt buy ======= ');
    },
    // 드래그 투 무브 이벤트
    'click button[name=imgInterior]'(evt, tmpl) {
        sampleInterior.set(true);
    },
    // 좋아요 버튼 이벤트
    'click button[name=goodBtn]'(evt, tmpl) {
        var target = $(evt.currentTarget);

        // 상세화면 좋아요 값 변경
        
        var ogGoodCnt = $('span[name=ogPrtGoodCnt]');
        var dtGoodCnt = $('span[name=dtPrtGoodCnt]');
        if(target.hasClass('is-click') === false) {
            if(bothFlag) {
                ogGoodCnt.text(ogGoodCnt.text() - 1);
                dtGoodCnt.text(dtGoodCnt.text() - 1);
            } else {
                if(tabFlag.get() === 'ogPrt') ogGoodCnt.text(ogGoodCnt.text() - 1);
                else dtGoodCnt.text(dtGoodCnt.text() - 1);
            }
        } else {
            if(bothFlag) {
                ogGoodCnt.text(parseInt(ogGoodCnt.text()) + 1);
                dtGoodCnt.text(parseInt(dtGoodCnt.text()) + 1);
            } else {
                if(tabFlag.get() === 'ogPrt') ogGoodCnt.text(parseInt(ogGoodCnt.text()) + 1);
                else dtGoodCnt.text(parseInt(dtGoodCnt.text()) + 1);
            }
        }
        
        // 좋아요 버튼 이미지 색깔 입히기
        // target.toggleClass('is-click');

        // 사용자 정보
        var userInfo = sessionStorage.getItem('art_dex');

        // 좋아요 로직
        if(userInfo != undefined) {
            var atwrkId = Object.keys(this).includes('atwrkID') ? this.atwrkID : this._id;
            var atwrkFlag = tabFlag.get();

            Meteor.clientCommonUtils.goodBtnEvnt(userInfo, atwrkId, atwrkFlag, bothFlag.get());
        } else {
            // 비 로그인 사용자는 팝업창
            messagePopup({message : '로그인 후 이용해주세요'});
        }
    },
    // 소식받기 이벤트
    'click button[name=getNews]'(evt, tmpl) {
        var userInfo = sessionStorage.getItem('art_dex');
        if(userInfo != undefined) {
            var bsnsID = this.glry.bsnsID;
            Meteor.call('decrypt', userInfo, function(err, res) {
                userInfo = JSON.parse(res);
                Meteor.call('insertNotice', userInfo._id, bsnsID, function(err, res) {
                    messagePopup({message : '소식받기 적용이 완료되었습니다.'});
                });
            });
        } else {
            // 비 로그인 사용자는 팝업창
            messagePopup({message : '로그인 후 이용해주세요'});
        }
    },
    // 비딩하기 버튼 이벤트
    'click a[name=bidBtn]'(evt, tmpl) {
        var userInfo = sessionStorage.getItem('art_dex');
        if(userInfo != undefined) {
            $('#bidAmount').addClass('is-open');
        } else {
            // 비 로그인 사용자는 팝업창
            messagePopup({message : '로그인 후 이용해주세요'});
        }
    },
    // 흥정하기 버튼 이벤트
    'click a[name=bargainingBtn]'(evt, tmpl) {
        var userInfo = sessionStorage.getItem('art_dex');
        if(userInfo != undefined) {
            $('#bargainingRate').addClass('is-open');
        } else {
            // 비 로그인 사용자는 팝업창
            messagePopup({message : '로그인 후 이용해주세요'});
        }
    },
    // 가격문의 버튼 이벤트
    'click a[name=priceInquiry]'(evt, tmpl) {
        if(userInfos.get() != undefined) {
            $('#priceInquiryIns').addClass('is-open');
        } else {
            // 비 로그인 사용자는 팝업창
            messagePopup({message : '로그인 후 이용해주세요'});
        }
    }
});

// Tab 변경시 이벤트
function tabBtn(targets) {
    var dataId = targets.data('id');
    var contId = $('#' + dataId);
    $('.tab-link button').removeClass('is-active');
    $('.tab-purchace .tab-cont').removeClass('is-open');
    $(targets).addClass('is-active');
    contId.addClass('is-open');
}

function isRprsn(element)  {
    if(element.rprsn === 'Y')  {
        return true;
    }
}

function dragMoveListener (event) {
    var target = event.target
    // keep the dragged position in the data-x/data-y attributes
    var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
    var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy

    // translate the element
    target.style.transform = 'translate(' + x + 'px, ' + y + 'px)'

    // update the posiion attributes
    target.setAttribute('data-x', x)
    target.setAttribute('data-y', y)
 }

 window.dragMoveListener = dragMoveListener

Template.atwrkDetail.helpers({
    atwrkDetail() {
        var res =  detail.get();

        if( res != undefined) {
            res.ogPrtActive = '';
            res.dtPrtActive = '';
            res.ogPrtOpen = '';
            res.dtPrtOpen = '';
            

            if(res.ogPrt.pric != undefined) {
                // res.ogPrt.pric = Meteor.commonUtils.priceComma(res.ogPrt.pric);
                res.ogPrtActive = 'is-active';
                res.ogPrtOpen = 'is-open';
            }
            
            if(res.dtPrt.sPric != undefined) {
                limitCnt.set(res.dtPrt.selCnt);
                res.dtPrt.sPric = Meteor.commonUtils.priceComma(res.dtPrt.sPric);
                res.dtPrt.mPric = Meteor.commonUtils.priceComma(res.dtPrt.mPric);
                res.dtPrt.lPric = Meteor.commonUtils.priceComma(res.dtPrt.lPric);
                if(res.ogPrt.pric === undefined) {
                    res.dtPrtActive = 'is-active';
                    res.dtPrtOpen = 'is-open';
                }
            }


            // 메인이미지
            // res.mainImage = images.get().find(isRprsn);
        
            return res;
        }
    },
    mainImage() {
        var res = images.get();
        if(res != undefined) {
            return res.find(isRprsn);;
        }
    },
    detailImages() {
        var res = images.get();
        if(res != undefined) return res.sort((a, b) => a.imgSortNo - b.imgSortNo);
    },
    atstInfo() {
        var res = detail.get();
        if(res != undefined) return res.atstInfo;
    },
    atwrkList() {
        var res = [];
        var info = latestList.get();
        if(res != undefined) {
            for(idx in info) {
                var resInfo = {};
                var images = info[idx].image;
                
                for(dx in images) {
                    if(images[dx].rprsn === 'Y'){
                        resInfo.imgInfo = images[dx];
                    }
                }

                var prtFlag = '';
                var pricFlag = 'pric';

                prtFlag = Object.keys(info[idx].ogPrt).includes('atwrkNm') ? 'ogPrt' : 'dtPrt'
                pricFlag = (prtFlag === 'ogPrt') ? 'pric' : 'sPric';

                resInfo._id = info[idx]._id;
                resInfo.pric = Meteor.commonUtils.priceComma(info[idx][prtFlag][pricFlag]);
                resInfo.numPric = info[idx][prtFlag][pricFlag];
                resInfo.atwrkNm = info[idx][prtFlag].atwrkNm;
                resInfo[prtFlag] = info[idx][prtFlag].metRias;
                resInfo.wSize = info[idx][prtFlag].wSize;
                resInfo.hSize = info[idx][prtFlag].hSize;
                resInfo.atstNm = info[idx].atstInfo.atstNm;
                resInfo.glryNm = info[idx].glry.glryNm;
                
                res.push(resInfo);
            }

            
            return res;
        };
    },
    loginChk() {
        var logChk = JSON.parse(sessionStorage.getItem('art_session_index'));
        return logChk.index == 0 ? true : false;
    },
    dataChk(data, kind) {
        if(data != undefined) {
            return (!$.isEmptyObject(data[kind]));
        }
    },
    // 구매 갯수
    digitalCnt() {
        return digitalCnt.get();
    },
    // 총 구매 금액
    totalPric(pric) {
        return digitalCnt.get() * pric;
    },
    // 금액에 콤마 붙이기
    // commaPric(pric) {
    //     return Meteor.commonUtils.priceComma(pric);
    // },
    sampleInterior() {
        return sampleInterior.get();
    },
    // 좋아요 Flag
    goodChk() {
        return atwrkGoodChk.get() ? 'is-click' : '';
    },  
    // 조회수 Flag
    // 정찰가 인지 아닌지 확인
    sellTpChk() {
        return !(this.ogPrt.sellTp === '001') ? 'disabled' : '';
    },
    // bid 체크 001 : 정찰가 / 002 : 비딩 / 003 : 흥정 / 004 : 가격문의
    bidChk() {
        return this.ogPrt.sellTp === '002';
    },
    // 판매 타입 체크
    bargainingChk() {
        return this.ogPrt.sellTp === '003';
    },
    priceChk() {
        return this.ogPrt.sellTp === '004';
    },
});
