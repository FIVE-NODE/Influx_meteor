import './interestAtwrk.html';

Template.interestAtwrk.onCreated(function() {
    Meteor.subscribe('userData');

    uInfo = new ReactiveVar();
       
    atwrkList = new ReactiveVar();

    heartVal = new ReactiveVar();

    interList = new ReactiveVar([]);

    this.autorun(() => {
        const userData = Meteor.user();
        if(userData != undefined && uInfo.get() == undefined) {
            uInfo.set(userData.profile.uInfos);
            sltInterestAtrk();
        }
    });
});

function sltInterestAtrk()  {
    if(interList.get().length == 0) interList.set(uInfo.get().ogPrtGood.concat(uInfo.get().dtPrtGood));
    Meteor.call('sltInterestAtwrk', interList.get(), function(err, res) {
        atwrkList.set(res);
    });
};

Template.interestAtwrk.onRendered(function() {
});

Template.interestAtwrk.events({
    'click button[name=heartBtn]'(evt, tmpl) {
        heartVal.set($(evt.currentTarget).val());

        const $this = $(evt.currentTarget);
        dataId = $this.attr('data-id');
        contId = $('#' + dataId);
        contId.addClass('is-open');
    },
    'click button[name=delete]'(evt, tmpl) {
        var atwrkFlag = '';
        var bothFlag = '';
        var list = atwrkList.get();

        var interest = interList.get();
        let filtered = interest.filter((element) => element !== heartVal.get());
        
        interList.set(filtered);
        
        for(idx in list) {
            if(list[idx]._id == heartVal.get()) {
                atwrkFlag = Object.keys(list[idx].ogPrt).length == 0 ? 'dtPrt' : 'ogPrt';
                
                if(atwrkFlag == 'dtPrt') bothFlag = Object.keys(list[idx].ogPrt).length == 0 ? false : true;
                else bothFlag = Object.keys(list[idx].dtPrt).length == 0 ? false : true;
                
                Meteor.clientCommonUtils.goodBtnEvnt(heartVal.get(), atwrkFlag, bothFlag);
            } else continue;
        }

       heartVal.set();

       $('#confirm').removeClass('is-open');

       sltInterestAtrk();
    }
});

Template.interestAtwrk.helpers({
    atwrkList() {
        if(uInfo.get() != undefined) {
            return atwrkList.get();
        }
    },
    dtPrtChk() {
        var res = true;
        if(Object.keys(this.ogPrt).length == 0 ) res = false;
        return res;
    }
});
 