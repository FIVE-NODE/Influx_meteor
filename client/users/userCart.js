import './userCart.html';

Template.userCart.onCreated(function() {
    uInfo = new ReactiveVar();
       
    atwrkList = new ReactiveVar();

    glryList = new ReactiveVar();

    function sltUserCart()  {
        var cartList = uInfo.get().cart;
        Meteor.call('sltUserCart', cartList, function(err, res) {
            var glry = [];

            res.forEach((val, num) => {
                if(glry.length != 0) {
                    var chk = false;
                    glry.forEach((value, idx) => {
                        if(value.name == val.glry.glryNm) chk = true;
                    });
                    if(!chk)glry.push({name : val.glry.glryNm});
                } else glry.push({name : val.glry.glryNm});
            });

            atwrkList.set(res);
            glryList.set(glry);
        });
    };

    if(sessionStorage.getItem('art_dex') != undefined) {
        Meteor.call('decrypt', sessionStorage.getItem('art_dex'), function(err, res) {
            var userData = JSON.parse(res);
            uInfo.set(userData);

            sltUserCart();
        });
    }

});

Template.userCart.onRendered(function() {
    
});

Template.userCart.events({
    'change #check-basket--all'(evt, tmpl) {
        $('#check-basket--all').is(':checked');
    }
});

Template.userCart.helpers({
    glryNmChk(glryNm, dataNm) {
        return glryNm === dataNm;
    },
    glryList() {
        return glryList.get();
    },
    atwrkList() {
        if(uInfo.get() != undefined) {
            return atwrkList.get();
        }
    },
    dtPrtChk() {
        var res = true;
        if(Object.keys(this.ogPrt).length === 0 ) res = false;
        return res;
    }
});
