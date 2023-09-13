import { Meteor } from "meteor/meteor";

Meteor.clientCommonUtils = {
    setPage : function(size, total) {
        var page = Math.ceil(total / size);
        var resPage = [];
        for(var i=1; i<=page; i++) {
            var pages = {};
            pages.num = i;
            if(i == 1) pages.active = 'is-active';
            else pages.active = '';
            resPage.push(pages);
        }
        return resPage;
    },
    prevPage : function(curPage, total, limit, skip) {
        var res = true;
        if((curPage.get() -  1) == 0) ;
        else {
            curPage.set(curPage.get() - 1);
            $('.is-active').removeClass('is-active');
            $(`#pageNum${curPage.get()}`).addClass('is-active');
            skip.set((curPage.get() - 1) * limit.get());
            res = false;
        }
        return res
    },
    nextPage : function(curPage, total, limit, skip) {
        var res = true;
        if(total < (curPage.get() *  limit.get())) ;
        else {
            curPage.set(curPage.get() + 1);
            $('.is-active').removeClass('is-active');
            $(`#pageNum${curPage.get()}`).addClass('is-active');
            skip.set((curPage.get() - 1) * limit.get());
            res = false;
        }
        return res
    },
    pageNum : function(curPage, skip, limit, num) {
        $('a[name=pageNum].is-active').removeClass('is-active');
        $(`#pageNum${num}`).addClass('is-active');
        curPage.set(num);
        skip.set((num - 1) * limit.get());
    },
    setQuery : function(limit, skip) {
        // 단순 페이징 용 query
        var query = {
            skip : skip.get(),
            limit : limit.get()
        };
    
        return query;
    },
    // 스크롤 이동
    scrollMove : function() {
        var location = $('#move').offset().top;
        Meteor.commonUtils.scrollTop(location);
    },
    // 스크롤이동 네임
    scrollToName : function(name) {
        var location = $(`input[name=${name}]`).offset().top;
        Meteor.commonUtils.scrollTop(location);
    },
    // 스크롤이동 클레스
    scrollToClass : function(name) {
        var location = $(`.${name}`).offset().top;
        Meteor.commonUtils.scrollTop(location);
    },
    // 숫자와 하이픈만 입력 가능
    numberHyphen : function(str) {
        var chk = /[^0123456789-]/g;
        return str.replace(chk, '');
    },
    // 사업자 등록번호 정합성 체크
    bsnsNumConsistency : function(str) {
        var chk = /^[0-9]{3}-[0-9]{2}-[0-9]{5}$/;
        return chk.test(str);
    },
    // 이메일 벨리데이션
    emailConsistency : function(email) {
        var emailChk = /[^a-z0-9@_.-]/gi;
        return email.replace(emailChk, '');
    },
    // 날짜 포맷
    dateFormatChg : function(date) {
        var format = /(\d{4})(\d{2})(\d{2})/g;
        return date.replace(format, '$1.$2.$3');
    },
    // 휴대폰 하이픈 포맷
    mobHyphen : function(data) {
        var format = /(\d{2,3})(\d{3,4})(\d{3,4})/gi;
        return data.replace(format, '$1-$2-$3');
    },
    // 마스킹 처리 (대쉬)
    mobMasking : function(data) {
        maskingStr = data.toString().replace(/-[0-9]{4}-/g, "-****-");
        return maskingStr;
    },
    // 좋아요 버튼 이벤트
    goodBtnEvnt: function(atwrkId, atwrkFlag, bothFlag) {
        Meteor.call('likeChkMber', atwrkId, atwrkFlag, function(err, res) {
            if(res != undefined && res != null) {                    
                Meteor.call('removeGood', atwrkId, atwrkFlag, bothFlag);
                Meteor.call('atwrkCancelGood', atwrkFlag, atwrkId, bothFlag);
            } else {
                Meteor.call('insertGood', atwrkId, atwrkFlag, bothFlag);
                Meteor.call('atwrkAddGood', atwrkFlag, atwrkId, bothFlag)
            }
        });
    },
    // 조회수 이벤트
    viewCntEvnt: function(atwrkId, atwrkFlag) {
        Meteor.call('viewHeistory', atwrkId, atwrkFlag, function(err, res) {
            if(res != undefined && res != null) {
            } else {
                Meteor.call('insertViewCnt', atwrkId, atwrkFlag);
                Meteor.call('viewsUp', atwrkId, atwrkFlag);
            }
        });
    },
    // 필터 또는 검색 데이터 셋팅
    dataSet: function(kind, code) {
        var res;

        switch(kind) {
            case 'ARTWORK_PRICE_OGPRT':
                var price = Meteor.codes.ARTWORK_PRICE_OGPRT();
                price.forEach(function(val, idx) {
                    if(code === val.code) {
                        res = val;
                    }
                });
                break;
            case 'ARTWORK_PRICE_DTPRT':
                var price = Meteor.codes.ARTWORK_PRICE_DTPRT();
                price.forEach(function(val, idx) {
                    if(code === val.code) {
                        res = val;
                    }
                });
                break;
            case 'MK_YEAR':
                var mkyear = Meteor.codes.MK_YEAR();
                mkyear.forEach(function(val, idx) {
                    if(code === val.code) {
                        res = val;
                    }
                });
                break;
            default:
                res = code;
                break;
        }

        return res;
    },
    // sort 정렬
    pageSort: function(kind, flag) {
        var res = {};
        var key = '';

        switch(kind) {
            case 'date':
                res = { insDt : -1 };
                break;
            case 'highPric':
                key = flag === 'ogPrt' ? `${flag}.pric` : `${flag}.sPric`;
                res = { [key] : -1 };
                break;
            case 'lowPric':
                key = flag === 'ogPrt' ? `${flag}.pric` : `${flag}.sPric`;
                res = { [key] : 1 };
                break;
            case 'good':
                res = { [`${flag}.goodCnt`] : -1 };
                break;
            default:
                res = { [`${flag}.viewCnt`] : -1 };
                break;
        }

        return res;
    },
     // 관리자 페이지 용 sort 정렬
     adminPageSort: function(kind) {
        var res = {};

        switch(kind) {
            case 'name':
                res = { 'dtPrt.atwrkNm': 1 , 'ogPrt.atwrkNm' : 1 };
                break;
            case 'highPric':
                res = { 'ogPrt.pric' : -1, 'dtPrt.sPric' : -1 };
                break;
            case 'lowPric':
                res = { 'ogPrt.pric' : 1, 'dtPrt.sPric' : 1 };
                break;
            case 'newMkyy':
                res = {'ogPrt.mkYY' : -1, 'dtPrt.mkYY' : -1}
                break;
            default:
                res = {'ogPrt.mkDt' : 1, 'dtPrt.mkDt' : 1}
                break;
        }

        return res;
    },
    // 관리자 페이지 용 sort 정렬
    adSellingPageSort: function(kind) {
        var res = {};

        switch(kind) {
            case 'lowDate':
                res = { sortDateNum : -1 };
                break;
            case 'highDate':
                res = { sortDateNum : 1 };
                break;
            case 'highPric':
                res = { 'ogPrt.pric' : -1, 'dtPrt.sPric' : -1 };
                break;
            case 'lowPric':
                res = {'ogPrt.pric' : 1, 'dtPrt.sPric' : 1 }
                break;
            case 'name':
                res = { 'atstInfo.atstNm' : 1 };
                break;
            case 'revName':
                res = { 'atstInfo.atstNm' : -1 };
                break;
            case 'newMkdt':
                // res = {'ogPrt.mkDt' : -1, 'dtPrt.mkDt' : -1 }
                res = {'dtPrt.mkDt' : -1 , 'ogPrt.mkDt' : -1}
                break;
            case 'oldMkdt':
                res = { 'dtPrt.mkDt' : 1, 'ogPrt.mkDt' : 1 }
                break;
            default:
                break;
        }

        return res;
    },

}
