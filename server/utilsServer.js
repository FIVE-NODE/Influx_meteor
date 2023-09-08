import { Meteor } from 'meteor/meteor';
import { Atwrk, Quick, Inventory } from '../lib/collections.js';

// 좋아요, 구매하기, 장바구니, 소식받기, 조회수 등 공통으로 사용가능한 로직

Meteor.methods({
    // 좋아요 눌럿던 사용자 인지 체크
    likeChkMber: function(atwrkId, atwrkFlag) {
        try{
            let res = {};
            let userId = Meteor.userId();

            if(atwrkFlag === 'dtPrt') res = Meteor.users.findOne({_id : userId, 'profile.uInfos.dtPrtGood' : atwrkId});
            else res = Meteor.users.findOne({_id : userId, 'profile.uInfos.ogPrtGood' : atwrkId});

            return res;
        } catch(e) {
            console.log('Error : ', e);
            throw new Meteor.Error(
            500,
            '서버 접속 오류가 발생하였습니다. <br /> 잠수 후 다시 시도해주세요.'
            );
        }
    },
    // 좋아요 추가
    insertGood: function(atwrkId, atwrkFlag, bothFlag) {
        try {
            let res = {};
            let userId = Meteor.userId();

            if(bothFlag) {
                Meteor.users.update({ _id : userId }, { $addToSet : { 'profile.uInfos.dtPrtGood' : atwrkId }});
                Meteor.users.update({ _id : userId }, { $addToSet : { 'profile.uInfos.ogPrtGood' : atwrkId }});
            } else {
                if(atwrkFlag === 'dtPrt') res = Meteor.users.update({ _id : userId }, { $addToSet : { 'profile.uInfos.dtPrtGood' : atwrkId }});
                else res = Meteor.users.update({ _id : userId }, { $addToSet : { 'profile.uInfos.ogPrtGood' : atwrkId }});
            }

            return res;
        } catch(e) {
            console.log('Error : ', e);
            throw new Meteor.Error(
            500,
            '서버 접속 오류가 발생하였습니다. <br /> 잠수 후 다시 시도해주세요.'
            );
        }
    },
    // 사용자가 좋아요 취소할경우 지우기
    removeGood: function(atwrkId, atwrkFlag, bothFlag) {
        try {
            let res = {};
            let userId = Meteor.userId();

            if(bothFlag) {
                Meteor.users.update({ _id : userId }, { $pull : { 'profile.uInfos.dtPrtGood' : atwrkId }});
                Meteor.users.update({ _id : userId }, { $pull : { 'profile.uInfos.ogPrtGood' : atwrkId }});
            } else {
                if(atwrkFlag === 'dtPrt') res = Meteor.users.update({ _id : userId }, { $pull : { 'profile.uInfos.dtPrtGood' : atwrkId }});
                else res = Meteor.users.update({ _id : userId }, { $pull : { 'profile.uInfos.ogPrtGood' : atwrkId }});
            }

            return res;
        } catch(e) {
            console.log('Error : ', e);
            throw new Meteor.Error(
            500,
            '서버 접속 오류가 발생하였습니다. <br /> 잠수 후 다시 시도해주세요.'
            );
        }
    },
    // 작품 좋아요 증가
    atwrkAddGood: function(atwrkFlag, atwrkId, bothFlag) {
        try{
            var res = {};
            
            if(bothFlag) {
                Atwrk.update({_id : atwrkId}, { $inc : { 'dtPrt.goodCnt' : 1 }});
                Atwrk.update({_id : atwrkId}, { $inc : { 'ogPrt.goodCnt' : 1 }});
            } else {
                if(atwrkFlag === 'dtPrt') res = Atwrk.update({_id : atwrkId}, { $inc : { 'dtPrt.goodCnt' : 1 }});
                else res = Atwrk.update({_id : atwrkId}, { $inc : { 'ogPrt.goodCnt' : 1 }});
            }
            
            return res;
        } catch(e) {
            console.log('Error : ', e);
            throw new Meteor.Error(
            500,
            '서버 접속 오류가 발생하였습니다. <br /> 잠수 후 다시 시도해주세요.'
            );
        }
    },
    // 작품 좋아요 마이너스
    atwrkCancelGood: function(atwrkFlag, atwrkId, bothFlag) {
        try{
            var res = {};
            
            if(bothFlag) {
                Atwrk.update({_id : atwrkId}, { $inc : { 'ogPrt.goodCnt' : -1 }});
                Atwrk.update({_id : atwrkId}, { $inc : { 'dtPrt.goodCnt' : -1 }});
            } else {
                if(atwrkFlag === 'dtPrt') res = Atwrk.update({_id : atwrkId}, { $inc : { 'dtPrt.goodCnt' : -1 }});
                else res = Atwrk.update({_id : atwrkId}, { $inc : { 'ogPrt.goodCnt' : -1 }});
            }
            
            return res;
        } catch(e) {
            console.log('Error : ', e);
            throw new Meteor.Error(
            500,
            '서버 접속 오류가 발생하였습니다. <br /> 잠수 후 다시 시도해주세요.'
            );
        }
    },
    selectQuickMu: function() {
        try {
            let res = Quick.find({}, {sort : { sortNo : 1 }}).fetch();
            
            return res;
        } catch(e) {
            console.log('Error : ', e);
            throw new Meteor.Error(
            500,
            '서버 접속 오류가 발생하였습니다. <br /> 잠수 후 다시 시도해주세요.'
            );
        }
    },
    // 장바구니 추가
    insertBasket: function(setData) {
        try {
            let res = {};
            let userId = this.userId;
            
            if(Array.isArray(setData)) {
                for(idx in setData) res =  Meteor.users.update(
                    { _id : userId },
                    { $addToSet : { 'profile.uInfos.cart' : setData[idx] }}
                );
            } else {
                res =  Meteor.users.update(
                    { _id : userId },
                    { $addToSet : { 'profile.uInfos.cart' : setData }})
                ;
            }
        
            return res;
        } catch(e) {
            console.log('Error : ', e);
            throw new Meteor.Error(
            500,
            '서버 접속 오류가 발생하였습니다. <br /> 잠수 후 다시 시도해주세요.'
            );
        }
    },
    // 장바구니 삭제
    removeBasket: function(query) {
        try {
            let res = {};
            let userId = this.userId;
            
            res =  Meteor.users.update({ _id : userId }, { $pull : { 'profile.uInfos.cart' : { $in : query }}});
            
            return res
        } catch(e) {
            console.log('Error : ', e);
            throw new Meteor.Error(
            500,
            '서버 접속 오류가 발생하였습니다. <br /> 잠수 후 다시 시도해주세요.'
            );
        }
    },
    // 조회수 증가
    viewsUp: function(atwrkId, atwrkFlag, bothFlag) {
        try {
            if(bothFlag) {
                Atwrk.update({_id : atwrkId}, { $inc : { 'ogPrt.viewCnt' : 1 }});
                Atwrk.update({_id : atwrkId}, { $inc : { 'dtPrt.viewCnt' : 1 }});
            } else {
                if(atwrkFlag === 'ogPrt') Atwrk.update({_id : atwrkId}, { $inc : { 'ogPrt.viewCnt' : 1 }});
                else Atwrk.update({_id : atwrkId}, { $inc : { 'dtPrt.viewCnt' : 1 }})
            }
        }  catch(e) {
            console.log('Error : ', e);
            throw new Meteor.Error(
            500,
            '서버 접속 오류가 발생하였습니다. <br /> 잠수 후 다시 시도해주세요.'
            );
        }
    },
    // 로그인 유저 - 조회수 올린 기록 확인
    viewHeistory: function(atwrkId, atwrkFlag) {
        try {
            let res = {};
            let userId = Meteor.userId();

            if(atwrkFlag === 'ogPrt') res = Meteor.users.findOne({_id : userId, 'profile.uInfos.ogPrtView' : atwrkId});
            else  res =  Meteor.users.findOne({_id : userId, 'profile.uInfos.dtPrtView' : atwrkId});
            
            return res;
        }  catch(e) {
            console.log('Error : ', e);
            throw new Meteor.Error(
            500,
            '서버 접속 오류가 발생하였습니다. <br /> 잠수 후 다시 시도해주세요.'
            );
        }
    },
    // 사용자 정보 조회 카운트에 작품ID 추가
    insertViewCnt: function(atwrkId, atwrkFlag) {
        try {
            let res = {};
            let userId = Meteor.userId();

            if(atwrkFlag === 'ogPrt') res =  Meteor.users.update({ _id : userId }, { $addToSet : { 'profile.uInfos.ogPrtView' : atwrkId } });
            else  res =  Meteor.users.update({ _id : userId }, { $addToSet : { 'profile.uInfos.dtPrtView' : atwrkId } });

            return res;
        } catch(e) {
            console.log('Error : ', e);
            throw new Meteor.Error(
            500,
            '서버 접속 오류가 발생하였습니다. <br /> 잠수 후 다시 시도해주세요.'
            );
        }
    },
    // 인벤토리 모드 조회
    seltInventoryMode: function(query, options) {
        try {
            let res = {};
            
            var matchQuery = { 'glry.bsnsID' : this.userId };

            res.atstList = Atwrk.aggregate([
                {
                    $match : matchQuery
                },
                {
                    $project : {
                        atstNm : '$atstInfo.atstNm',
                    }
                },
                {
                    $group : {
                        _id : '$atstNm',
                    }
                },
                {
                    $sort : { _id : 1 }
                }
            ]);

            if(query.ATST != undefined) {
                matchQuery['atstInfo.atstNm'] = { $in : query.ATST };
            }

            res.data = Atwrk.aggregate([
                {
                    $match : matchQuery
                    // { 
                    //     'glry.bsnsID' : 'fc95aafc-747b-4c24-a4fa-ff816922a163',
                    //     'atstInfo.atstNm' : { $in : query.ATST} 
                    // }
                },
                {
                    $unwind : '$image'
                },
                {
                    $match : {
                        'image.rprsn' : 'Y'
                    }
                },
                {
                    $project : {
                        atwrkInfo : {
                            atstNm : '$atstInfo.atstNm',
                            image : '$image.imgID',
                            atwrkId : '$_id',
                            dtYY : '$dtPrt.mkYY',
                            dtDesc : '$dtPrt.atwrkDesc',
                            dtNm : '$dtPrt.atwrkNm',
                            dtBase : '$dtPrt.base',
                            dtPric : '$dtPrt.mPric',
                            dtSize : 'S, M, L',
                            ogYY : '$ogPrt.mkYY',
                            ogDesc : '$ogPrt.atwrkDesc',
                            ogNm : '$ogPrt.atwrkNm',
                            ogMet : '$ogPrt.metRias',
                            ogWSize : '$ogPrt.wSize',
                            ogHSize : '$ogPrt.hSize',
                            ogPric : '$ogPrt.pric',
                            atstDesc : '$atstInfo.atstDesc',
                            atstImage : '$atstInfo.atstImage',
                            show : 'Y'
                        },
                        atstNm : '$atstInfo.atstNm',
                    }
                },
                {
                    $group : {
                        _id : '$atstNm',
                        // _id : {
                        //     atstNm : '$atstNm',
                        // },
                        atwrkInfo : {
                            $addToSet : '$atwrkInfo'
                        }
                    }
                },
                {
                    $sort : { _id : 1 }
                }
            ]);

            return res;
        } catch(e) {
            console.log('Error : ', e);
            throw new Meteor.Error(
            500,
            '서버 접속 오류가 발생하였습니다. <br /> 잠수 후 다시 시도해주세요.'
            );
        }
    },
    // 인벤토리 모드 작품 삭제
    delInventoryAtwrk: function(query) {
        try {
            let res = {};

            res = Inventory.update({'glry.bsnsID' : this.userId}, { $pull : { 'atstInfo.atstAtwrk.atwrkID' : query.atwrkId } } );

            return res;
        } catch(e) {
            console.log('Error : ', e);
            throw new Meteor.Error(
            500,
            '서버 접속 오류가 발생하였습니다. <br /> 잠수 후 다시 시도해주세요.'
            );
        }
    }
});
