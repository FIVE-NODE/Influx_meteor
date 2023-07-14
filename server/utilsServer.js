import { Meteor } from 'meteor/meteor';
import { SnsMber, Mber, Atwrk, Quick } from '../lib/collections.js';

// 좋아요, 구매하기, 장바구니, 소식받기, 조회수 등 공통으로 사용가능한 로직

Meteor.methods({
    // 좋아요 눌럿던 사용자 인지 체크
    likeChkMber: function(userFlag, userId, atwrkId, atwrkFlag, bothFlag) {
        try{
            let res = {};

            // 유저 확인 MBER : 일반회원, SNSMBER : SNS회원
            if(userFlag === 'MBER') {
                // 원화, 디지털 판화 둘다 존재하는지 확인
                if(atwrkFlag === 'dtPrt') res = Mber.findOne({ _id : userId, dtPrtGood : atwrkId})
                else res =  Mber.findOne({ _id : userId,  ogPrtGood : atwrkId });
            } else {
                if(atwrkFlag === 'dtPrt') res = SnsMber.findOne({ _id : userId, dtPrtGood : atwrkId});
                else res =  SnsMber.findOne({ _id : userId,  ogPrtGood : atwrkId });
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
    // 좋아요 추가
    insertGood: function(userFlag, userId, atwrkId, atwrkFlag, bothFlag) {
        try {
            let res = {};

            if(userFlag === 'MBER') {
                if(bothFlag) {
                    Mber.update({ _id : userId }, { $addToSet : { dtPrtGood : atwrkId }});
                    Mber.update({ _id : userId }, { $addToSet : { ogPrtGood : atwrkId }});
                } else {
                    if(atwrkFlag === 'dtPrt') res = Mber.update({ _id : userId }, { $addToSet : { dtPrtGood : atwrkId }});
                    else res = Mber.update({ _id : userId }, { $addToSet : { ogPrtGood : atwrkId }});
                }
            } else {
                if(bothFlag) {
                    SnsMber.update({ _id : userId }, { $addToSet : { dtPrtGood : atwrkId }});
                    SnsMber.update({ _id : userId }, { $addToSet : { ogPrtGood : atwrkId }});
                } else {
                    if(atwrkFlag === 'dtPrt') res = SnsMber.update({ _id : userId }, { $addToSet : { dtPrtGood : atwrkId }});
                    else res = SnsMber.update({ _id : userId }, { $addToSet : { ogPrtGood : atwrkId }});
                }
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
    removeGood: function(userFlag, userId, atwrkId, atwrkFlag, bothFlag) {
        try {
            let res = {};

            if(userFlag === 'MBER') {
                if(bothFlag) {
                    Mber.update({ _id : userId }, { $pull : { dtPrtGood : atwrkId }});
                    Mber.update({ _id : userId }, { $pull : { ogPrtGood : atwrkId }});
                } else {
                    if(atwrkFlag === 'dtPrt') res = Mber.update({ _id : userId }, { $pull : { dtPrtGood : atwrkId }});
                    else res = Mber.update({ _id : userId }, { $pull : { ogPrtGood : atwrkId }});
                }
            } else {
                if(bothFlag) {
                    SnsMber.update({ _id : userId }, { $pull : { dtPrtGood : atwrkId }});
                    SnsMber.update({ _id : userId }, { $pull : { ogPrtGood : atwrkId }});
                } else {
                    if(atwrkFlag === 'dtPrt') res = SnsMber.update({ _id : userId }, { $pull : { dtPrtGood : atwrkId }});
                    else res = SnsMber.update({ _id : userId }, { $pull : { ogPrtGood : atwrkId }});
                }
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
            var res = Quick.find({}, {sort : { sortNo : 1 }}).fetch();
            
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
    insertBasket: function(userFlag, userId, atwrkId) {
        try {
            var res = {};

            if(userFlag === 'MBER') {
                res =  Mber.update({ _id : userId }, { $addToSet : { cart : atwrkId }});
            } else {
                res = SnsMber.update({ _id : userId }, { $addToSet : { cart : atwrkId }});
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
    removeBasket: function(userFlag, userId, atwrkId) {
        try {
            var res = {};

            if(userFlag === 'MBER') {
                res =  Mber.update({ _id : userId }, { $pull : { atwrkId }});
            } else {
                res = SnsMber.update({ _id : userId }, { $pull : { atwrkId }});
            }

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
    viewHeistory: function(userFlag, userId, atwrkId, atwrkFlag) {
        try {
            var res = {};

            if(userFlag === 'MBER') {
                if(atwrkFlag === 'ogPrt') res = Mber.findOne({_id : userId, ogPrtView : atwrkId});
                else  res =  Mber.findOne({_id : userId, dtPrtView : atwrkId});
            } else {
                if(atwrkFlag === 'ogPrt') res = SnsMber.findOne({_id : userId, ogPrtView : atwrkId});
                else res = SnsMber.findOne({_id : userId, dtPrtView : atwrkId});
            }

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
    insertViewCnt: function(userFlag, userId, atwrkId, atwrkFlag) {
        try {
            var res = {};

            if(userFlag === 'MBER') {
                if(atwrkFlag === 'ogPrt') res = Mber.update({ _id : userId }, { $addToSet : { ogPrtView : atwrkId } });
                else  res =  Mber.update({ _id : userId }, { $addToSet : { dtPrtView : atwrkId } });
            } else {
                if(atwrkFlag === 'ogPrt') res = SnsMber.update({_id : userId }, { $addToSet : { ogPrtView : atwrkId } });
                else res = SnsMber.update({ _id : userId }, { $addToSet : { dtPrtView : atwrkId } });
            }

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