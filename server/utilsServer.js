import { Meteor } from 'meteor/meteor';
import { BsnsMber, SnsMber, Mber, Atwrk, Quick } from '../lib/collections.js';

// 좋아요, 구매하기, 장바구니, 소식받기, 조회수 등 공통으로 사용가능한 로직

Meteor.methods({
    // 좋아요 눌럿던 사용자 인지 체크
    likeChkMber: function(_id) {
        try{
            let res = Mber.findOne({});

            return res;
        } catch(e) {
            console.log('Error : ', e);
            throw new Meteor.Error(
            500,
            '서버 접속 오류가 발생하였습니다. <br /> 잠수 후 다시 시도해주세요.'
            );
        }
    },
    // 좋아요 증가
    atwrkAddLike: function(info) {
        try {
            var type = info.type;

            if(type === 'ogPrt') Atwrk.update({ $inc: { 'ogPrt.goodCnt' : 1}});
            else Atwrk.update({ $inc: { 'dtPrt.goodCnt' : 1}}); 

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
});