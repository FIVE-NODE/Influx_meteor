import { Meteor } from 'meteor/meteor';
import { Notice, FAQ } from '../lib/collections.js';

// 좋아요, 구매하기, 장바구니, 소식받기, 조회수 등 공통으로 사용가능한 로직

Meteor.methods({
    // 공지사항 조회
    selectNotice: function(query) {
        try{
            let res = {};

            res.list = Notice.find({}, query).fetch();
            res.total = Notice.find().count();

            return res;
        } catch(e) {
            console.log('Error : ', e);
            throw new Meteor.Error(
            500,
            '서버 접속 오류가 발생하였습니다. <br /> 잠수 후 다시 시도해주세요.'
            );
        }
    },
    // 자주묻는 질문 조회
    selectFaq: function(code) {
        try{
            let res = FAQ.find({kind : code}).fetch();

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