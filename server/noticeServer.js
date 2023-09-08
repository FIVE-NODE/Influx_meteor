import { remove } from 'cheerio/lib/api/manipulation.js';
import { Meteor } from 'meteor/meteor';
import { Notice, FAQ, Cmmnc, Order, Atwrk, Pick, StndPntReq} from '../lib/collections.js';

// 좋아요, 구매하기, 장바구니, 소식받기, 조회수 등 공통으로 사용가능한 로직

Meteor.methods({
    // 공지사항 조회
    selectNotice: function(query) {
        try{
            let res = {};
            query.sort = { insDt : -1 };

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
    },
    // 커뮤니케이션 DB insert
    insertCommnc: function(bargainInfo) {
        try {
            var today = moment(new Date()).format('YYYYMMDDHHmmss');
            console.log(today);
            bargainInfo.insDt = today;
            let res = Cmmnc.insert(bargainInfo);

            // templeCmmnc = JSON.parse(Assets.getText('json/cmmnc.json'));

            return res;
        } catch(e) {
            console.log('Error : ', e);
            throw new Meteor.Error(
            500,
            '서버 접속 오류가 발생하였습니다. <br /> 잠수 후 다시 시도해주세요.'
            );
        }
    },
    // 커뮤니케이션 DB delete
    deleteCommnc: function(commncId) {
        try {
            let res = Cmmnc.remove({_id : commncId});

            return res;
        } catch(e) {
            console.log('Error : ', e);
            throw new Meteor.Error(
            500,
            '서버 접속 오류가 발생하였습니다. <br /> 잠수 후 다시 시도해주세요.'
            );
        }
    },
    // 커뮤니케이션 답장(관리자)
    answerCommnc: function(data) {
        try {
            var toDay = moment(new Date()).format('YYYYMMDDhhmmss');
            var _id = data._id;
            delete data._id;
            data.answerDt = toDay;
            data.sttus = '002';

            let res = Cmmnc.update({ _id : _id }, { $set : data });

            return res;
        } catch(e) {
            console.log('Error : ', e);
            throw new Meteor.Error(
            500,
            '서버 접속 오류가 발생하였습니다. <br /> 잠수 후 다시 시도해주세요.'
            );
        }
    },
    // 주문내역조회
    seltOrderList: function(query, sttus) {
        try {
            var match = { $match : { mBerID : this.userId, insDt : query } };

            if(sttus == '') match = { $match : { mBerID : this.userId, insDt : query} };
            else match = { $match : { mBerID : this.userId, insDt : query, sttus : sttus} };

            let res = Order.aggregate([
                match,
                {
                    $lookup: {
                        from: "ATWRK",
                        localField: "odAtwrk.atwrkID",
                        foreignField: "_id",
                        as: "atwrkData"
                    }
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
    // 작품 _id 리스트로 리스트 조회
    seltAtwrkList: function(data) {
        try {
            let res = Atwrk.find({_id : { $in : data}});

            return res;
        } catch(e) {
            console.log('Error : ', e);
            throw new Meteor.Error(
            500,
            '서버 접속 오류가 발생하였습니다. <br /> 잠수 후 다시 시도해주세요.'
            );
        }
    },
    // 메시지 관리 For 사용자 조회
    seltMsgListForMber: function() {
        try {
            let userId = Meteor.userId();
            let res = Cmmnc.aggregate([
                { $match : { cmmncID : userId, sttus : '002' } },
                { 
                    $lookup : {
                        from: "ATWRK",
                        localField: "atwrkID",
                        foreignField: "_id",
                        as : "atwrkData"
                    }
                },
                { $unwind : "$atwrkData"}
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
    // 메시지 관리 For 비즈니스 사용자 조회
    seltMsgListForBMer: function(bsnsID) {
        try {
            let res = Cmmnc.aggregate([ 
                { $match : {  bsnsID, sttus: '001' } }
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
    // 큐레이터 픽 등록시 선택 화면
    seltPickSch: function(thmTp, options) {
        try {
            let res = Pick.findOne(
                { thmTp },
                options
                // {
                //     $lookup : {
                //         from : 'ATWRK',
                //         localField : 'atstAtwrk.atwrkID',
                //         foreignField : '_id',
                //         as : 'atwrkData'
                //     }
                // }
            );

            return res;
        }  catch(e) {
            console.log('Error : ', e);
            throw new Meteor.Error(
            500,
            '서버 접속 오류가 발생하였습니다. <br /> 잠수 후 다시 시도해주세요.'
            );
        }
    }, 
    createStndPntReq: function(bsnsData) {
        try {
            bsnsData._id = bsnsData.stndPntReqID;

            let res = StndPntReq.insert(bsnsData);

            return res;
        } catch(e) {
            console.log('Error : ', e);
            throw new Meteor.Error(
            500,
            '서버 접속 오류가 발생하였습니다. <br /> 잠수 후 다시 시도해주세요.'
            );
        }
    },
    seltStndPntReqForbId: function(bsnsID) {
        try {
            let res = StndPntReq.findOne({_id : bsnsID});

            return res;
        } catch(e) {
            console.log('Error : ', e);
            throw new Meteor.Error(
            500,
            '서버 접속 오류가 발생하였습니다. <br /> 잠수 후 다시 시도해주세요.'
            );
        } 
    },
    allSeltStndPntReq: function() {
        try {
            let res = StndPntReq.find({}).fetch();

            return res;
        } catch(e) {
            console.log('Error : ', e);
            throw new Meteor.Error(
            500,
            '서버 접속 오류가 발생하였습니다. <br /> 잠수 후 다시 시도해주세요.'
            );
        } 
    },
    passSendUpdStndPntReq: function(id) {
        try {
            var toDayhour = moment(new Date()).format('YYYY.MM.DD. hh:mm:ss');
            let res = StndPntReq.update({_id : id}, { $set : { 'passSendTime' : toDayhour}});
            
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