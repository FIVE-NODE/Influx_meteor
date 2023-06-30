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
        $('.is-active').removeClass('is-active');
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
    }
}
