import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

import 'lazysizes';
import 'lazysizes/plugins/parent-fit/ls.parent-fit';

import './glyHome.html';

// DB 조회
// ethodNm  - Meteor.call URL
// query    - 조회 조건문
// datas    - ReactiveDict 상태 값 저장용
function findDBs(methodNm, query, datas, total) {
    Meteor.call(methodNm, query, function(err, data) {
        if(data != undefined) {
            datas.set(methodNm, data.list);
            total.set(data.total);
        }
    }); 
}

// query 셋팅
function setQuery() {
    var addr = $('input[name=addr]').val();
    var area = '';
    var dong = '';

    if(addr != '' && addr != undefined) {
        addr = addr.trim();
        if(addr != '') {
            if(addr.indexOf('동') > 0) {
                dong = addr;
            } else {
                area = addr;
            }
        } 
    }    
    
    var glryNm = $('#for-input__label').val();
    
    query = {
        area : area,
        dong : dong,
        glryNm : glryNm,
        skip : skip.get(),
        limit : limit.get()
    };
    
    return query;
}

Template.glyHome.onCreated(function() {
    this.filterCriteria = new ReactiveVar('');

    datas = new ReactiveDict();
    
    // pageing 처리를 위한 변수
    curPage = new ReactiveVar(1);
    skip = new ReactiveVar(0);
    limit = new ReactiveVar(1);
    total = new ReactiveVar(0);

    query = {
        dong : '',
        area : '',
        glryNm : '',
        skip : skip.get(),
        limit: limit.get()
    };

    findDBs('selectNewGallery', query, datas, total);

    findDBs('selectGallery', query, datas, total);
    
});

Template.glyHome.onRendered(function() {
});

Template.glyHome.events({
    'click button[name=searchBtn]'() {
        Meteor.clientCommonUtils.prevPage(curPage, total.get(), limit, skip);
        findDBs('selectGallery', setQuery(), datas, total);
    },
    'click a[name=detail]'() {
        FlowRouter.go(`/atwrkList/${this._id}`);
        document.location.reload(true);
    },
    'click a[name=prev]'() {
        Meteor.clientCommonUtils.prevPage(curPage, total.get(), limit, skip);
        findDBs('selectGallery', setQuery(), datas, total);
    },
    'click a[name=next]'() {
        Meteor.clientCommonUtils.nextPage(curPage, total.get(), limit, skip);
        findDBs('selectGallery', setQuery(), datas, total);
    },
    'click a[name=pageNum]'() {
        if(Meteor.clientCommonUtils.pageNum(curPage, skip, limit, this.num));
        else {
            findDBs('selectGallery', setQuery(), datas, total);
        }
        // Meteor.clientCommonUtils.pageNum(curPage, skip, limit, this.num);
        
    },
    'keyup input[name=addr]'(evt, tmpl) {
        if(evt.keyCode === 13) $('button[name=searchBtn]').click();
    },
    'keyup input[name=glryNm]'(evt, tmpl) {
        if(evt.keyCode === 13) $('button[name=searchBtn]').click();
    },
});

Template.glyHome.helpers({
    newGallery() {
        return datas.get('selectNewGallery');
    },
    searchGallery() {
        return datas.get('selectGallery');
    },
    page() {
        let res = Meteor.clientCommonUtils.setPage(limit.get(), total.get());
        return res;
    }
    
});
