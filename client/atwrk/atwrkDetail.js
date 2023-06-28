import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

import './atwrkDetail.html';

Template.atwrkDetail.onCreated(function() {

    Tracker.autorun(() => {
        console.log('is this first');
        
    });

    detail = new ReactiveVar();
    images = new ReactiveVar();
    latestList = new ReactiveVar();
    type = new ReactiveVar();

    console.log('art_session_user');
    console.log(Session.get('art_session_user'));

    console.log(this);

    selectAtwrkDetail();

    function selectAtwrkDetail() {
        Meteor.call('selectAtwrkDetail', FlowRouter.getParam('_id'), function(err, res) {
            detail.set(res);
            images.set(res.image);

            var bsnsID = res.glry.bsnsID;
            selectLatestGlryList(bsnsID);
        });
    }

    function selectLatestGlryList(_id) {
        Meteor.call('selectLatestGlryList', _id, function(err, res) {
            latestList.set(res);
        });
    }

    function viewsUp() {
        Meteor.call('viewsUp', FlowRouter.getParam('_id'));
    }

});

Template.atwrkDetail.onRendered(function() {

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
    'click button[name=ogPrtTab]'() {
        type.set('ogPrt');
    },
    'click button[name=dtPrtTab]'() {
        type.set('dtPrt');
    }
});

function isRprsn(element)  {
    if(element.rprsn === 'Y')  {
      return true;
    }
  }

Template.atwrkDetail.helpers({
    atwrkDetail() {
        var res =  detail.get();

        if( res != undefined) {
            if(res.ogPrt.pric != undefined) res.ogPrt.pric = Meteor.commonUtils.priceComma(res.ogPrt.pric);
            
            if(res.dtPrt.sPric != undefined) {
                res.dtPrt.sPric = Meteor.commonUtils.priceComma(res.dtPrt.sPric);
                res.dtPrt.mPric = Meteor.commonUtils.priceComma(res.dtPrt.mPric);
                res.dtPrt.lPric = Meteor.commonUtils.priceComma(res.dtPrt.lPric);
            }
            
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
    orgDtFlag() {
        // 탭 분류
        var res = detail.get();
        
        if(res != undefined) {
            res.both = false;
            console.log('sdfsf', res.dtPrt);
            type.set('ogPrt');
            if(res.ogPrt.atwrkNm == '' || res.ogPrt == undefined) {
                res.inboth = true;
                type.set('dtPrt');
                return res;
            } else if(res.dtPrt.atwrkNm == '' || res.dtPrt == {}) {
                res.inboth = false
                return res;
            } else {
                res.both = true
                return res;
            };
        }
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
    
                resInfo._id = info[idx]._id;
                resInfo.pric = Meteor.commonUtils.priceComma(info[idx].ogPrt.pric);
                resInfo.atwrkNm = info[idx].ogPrt.atwrkNm;
                resInfo.ogPrt = info[idx].ogPrt.metRias;
                resInfo.wSize = info[idx].ogPrt.wSize;
                resInfo.hSize = info[idx].ogPrt.hSize;
                resInfo.atstNm = info[idx].atstInfo.atstNm;
                resInfo.glryNm = info[idx].glry.glryNm;
    
                res.push(resInfo);
            }
            
            return res;
        };
    },
    loginChk() {
        var logChk = JSON.parse(sessionStorage.getItem('art_session_index'));
        console.log(logChk.index == 0 ? true : false);
        return logChk.index == 0 ? true : false;
    }
});
