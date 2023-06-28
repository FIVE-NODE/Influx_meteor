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
        if((curPage.get() -  1) == 0) ;
        else {
            curPage.set(curPage.get() - 1);
            $('.is-active').removeClass('is-active');
            $(`#pageNum${curPage.get()}`).addClass('is-active');
            skip.set((curPage.get() - 1) * limit.get());
        }
    },
    nextPage : function(curPage, total, limit, skip) {
        if(total < (curPage.get() +  1)) ;
        else {
            curPage.set(curPage.get() + 1);
            $('.is-active').removeClass('is-active');
            $(`#pageNum${curPage.get()}`).addClass('is-active');
            skip.set((curPage.get() - 1) * limit.get());
        }
    },
    pageNum : function(curPage, skip, limit, num) {
        $('.is-active').removeClass('is-active');
        $(`#pageNum${num}`).addClass('is-active');
        curPage.set(num);
        skip.set((num - 1) * limit.get());
    }
}