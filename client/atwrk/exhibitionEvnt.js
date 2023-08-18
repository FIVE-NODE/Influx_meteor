import './exhibitionEvnt.html';

Template.exhibitionEvnt.onCreated(function() {
    // page 정보
    curPage = new ReactiveVar(1);
    skip = new ReactiveVar(0);
    limit = new ReactiveVar(10);
    total = new ReactiveVar(0);

    // 검색조건 변수
    kind = new ReactiveVar();

    // 전시/이벤트 베너
    evntBanr = new ReactiveVar();

    // 전시/이벤트 리스트
    evntList = new ReactiveVar();

    // 헤더 검색으로 왔을때
    headerSch = new ReactiveVar();


    if(this.data.schQueryData() != undefined)  {
        headerSch.set(JSON.parse(this.data.schQueryData()));
    }

    query = {};

    options = {
        skip : skip.get(),
        limit: limit.get()
    };

    this.selectExhigitionEvntBanr = function() {
        Meteor.call('selectExhigitionEvntBanr', query, options, function(err, res) {
            evntBanr.set(res);
        });
    }

    this.selectExhigitionEvntList = function() {
        if(headerSch.get() != undefined) {
            query = {
                kindCode : headerSch.get().EVNT,
                area : headerSch.get().REGION,
                glryNm : headerSch.get().glryNm,
            }
        }
        
        Meteor.call('selectExhigitionEvntList', query, options, function(err, res) {
            total.set(res.total);
            evntList.set(res.list);
        });
    }

    this.selectExhigitionEvntBanr();

    this.selectExhigitionEvntList();
});

Template.exhibitionEvnt.onRendered(function() {
});

// DB 검색조건 수정 및 옵션 설정
function setQuery() {
    // query = queryData;
    options = {
        skip : skip.get(),
        limit: limit.get(),
    };
}

// 스크롤 이동
function scrollMove() {
    var location = $('#move').offset().top;
    Meteor.commonUtils.scrollTop(location);
}

Template.exhibitionEvnt.events({
    // page당 갯수 이벤트
    'click button[name=pageVal]'(evt, tmpl) {
        limit.set(parseInt($(evt.currentTarget).text()));
        setQuery();
        tmpl.selectExhigitionEvntList();
        setTimeout(function() { $('#pageNum1').click(); }, 50);
    },
    'click button[name=kind]'(evt, tmpl) {
        kind.set($(evt.currentTarget).val());
    },
    // 검색 이벤트
    'click button[name=schBtn]'(evt, tmpl) {
        var kindCode = kind.get();
        var area = $('input[name=area]').val();
        var glryNm = $('#glryNm').val();
        var queryData = { kindCode, area, glryNm };

        query = queryData;

        setQuery();

        tmpl.selectExhigitionEvntList();
    },
    // 페이지
    'click a[name=prev]'(evt, tmpl) {
        if(Meteor.clientCommonUtils.prevPage(curPage, total.get(), limit, skip));
        else {
            setQuery();
            tmpl.selectExhigitionEvntList();
            scrollMove();
        } 
    },
    'click a[name=next]'(evt, tmpl) {
        if(Meteor.clientCommonUtils.nextPage(curPage, total.get(), limit, skip)) ;
        else {
            setQuery();
            tmpl.selectExhigitionEvntList();
            scrollMove();
        }
    },
    'click a[name=pageNum]'(evt, tmpl) {
        if(Meteor.clientCommonUtils.pageNum(curPage, skip, limit, this.num));
        else {
            setQuery();
            tmpl.selectExhigitionEvntList();
            scrollMove();
        }
    }
});

Template.exhibitionEvnt.helpers({
    banr() {
        return evntBanr.get();
    },
    kinds() {
        return Meteor.codes.EVENT_TYPE();
    },
    evntList() {
        return evntList.get();
    },
    page() {
        let res = Meteor.clientCommonUtils.setPage(limit.get(), total.get());
        return res;
    },
});
