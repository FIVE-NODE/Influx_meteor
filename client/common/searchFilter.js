import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

import './searchFilter.html';

Template.searchFilter.onCreated(function() {

    // 랜더링 플레그
    renderFlag = new ReactiveVar(false);

    rprsnAtst = new ReactiveVar();
    detail = new ReactiveVar();

    flagChk = FlowRouter.getParam('_id');

});

Template.searchFilter.onRendered(function() {
    renderFlag.set(true);
});

Template.searchFilter.events({
    'click button[name=rprsnAtst]'(evt, tmpl) {
        
    }
});

Template.searchFilter.helpers({
    rprsnAtst() {
        var res = false;

        if(flagChk != 'sch' && this.glryDetail.get() != undefined) {
            rprsnAtst.set(this.glryDetail.get().rprsnAtst);
            
            res = rprsnAtst.get().length != 0 ? rprsnAtst.get() : false; 
            
            detail.set(this.glryDetail.get());
        }

        return res;
    },
    renderFlag() {
        return renderFlag.get();
    }
});
