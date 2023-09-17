import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

import { clientNotice } from '../../lib/clientCollections.js';

import './zTwo.html';

Template.zTwo.onCreated(function() {

    // 랜더링 확인
    renderFlag = new ReactiveVar(false);

    // page 정보
    curPage = new ReactiveVar(1);
    skip = new ReactiveVar(0);
    limit = new ReactiveVar(15);
    total = new ReactiveVar(0);

    // 공지사항정보
    noticeInfo = new ReactiveVar();

    this.selectNotice = function (query) {
        Meteor.call('selectNotice', query, function(err, res) {
            noticeInfo.set(res.list);
            total.set(res.total);
        });
    }
    
    this.selectNotice(Meteor.clientCommonUtils.setQuery(limit, skip));
});

Template.zTwo.onRendered(function() {
    renderFlag.set(true);

    // 스크롤 이동 
    var location = $('#move').offset().top;
    Meteor.commonUtils.scrollTop(location);
});

Template.zTwo.events({
    'click div[name=noticeDetail]' (evt, tmpl) {
        clientNotice.remove({});
        clientNotice.insert(this);
        // FlowRouter.go(`/zTwoA/${this._id}`);
        FlowRouter.go(`/zTwoA`);
    },
    'click a[name=prev]'(evt, tmpl) {
        if(Meteor.clientCommonUtils.prevPage(curPage, total.get(), limit, skip));
        else {
            Meteor.clientCommonUtils.prevPage(curPage, total.get(), limit, skip)
            tmpl.selectNotice(Meteor.clientCommonUtils.setQuery(limit, skip));
            Meteor.clientCommonUtils.scrollMove();
        }
    },
    'click a[name=next]'(evt, tmpl) {
        if(Meteor.clientCommonUtils.nextPage(curPage, total.get(), limit, skip)) ;
        else {
            Meteor.clientCommonUtils.nextPage(curPage, total.get(), limit, skip);
            tmpl.selectNotice(Meteor.clientCommonUtils.setQuery(limit, skip));
            Meteor.clientCommonUtils.scrollMove();
        }
    },
    'click a[name=pageNum]'(evt, tmpl) {
        if(Meteor.clientCommonUtils.pageNum(curPage, skip, limit, this.num));
        else {
            Meteor.clientCommonUtils.pageNum(curPage, skip, limit, this.num);
            tmpl.selectNotice(Meteor.clientCommonUtils.setQuery(limit, skip));
            Meteor.clientCommonUtils.scrollMove();
        }
    }
   
});

Template.zTwo.helpers({
    renderFlag() {
        return renderFlag.get();
    },
    noticeInfo() {
        var res = [];

        if(noticeInfo.get() != undefined) {
            var info = noticeInfo.get();
            
            info.forEach(function(map, idx) {
                var editDate = map.insDt;
                editDate = editDate.replace(/(\d{4})(\d{2})(\d{2})/g, '$1.$2.$3');
                map.insDt = editDate;
            });

            res = info;
        }

        return res;
    },
    page() {
        let res = Meteor.clientCommonUtils.setPage(limit.get(), total.get());
        return res;
    }
});


