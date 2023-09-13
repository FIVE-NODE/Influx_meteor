import './myCollection.html';

import { Atwrk, Order } from '../../lib/collections.js';

Template.myCollection.onCreated(function() {
    Meteor.subscribe('Atwrk');
    Meteor.subscribe('Order');

    popUpList = new ReactiveVar();

    // this.autorun(function() {
        // if(popUpList.get() != undefined) {
        //     setTimeout(function(){
        //         const swiper = new Swiper('.swiper', {                
        //             loop: true,
        //             navigation:{
        //                 nextEl: '.my-button-next',
        //                 prevEl: '.my-button-prev',
        //             }
        //         });
        //     }, 100);
        // }
    // });
});

Template.myCollection.onRendered(function() {
});

Template.myCollection.events({
    'click button[name=allSelt]' (evt, tmpl) {
        $('input[name=chkMyCollect]').prop('checked', true);
    },
    'click button[name=noAllSelt]' (evt, tmpl) {
        $('input[name=chkMyCollect]').prop('checked', false);
    },
    'click button[name=seltAllShow]' (evt, tmpl) {
        var chkAtwrk = $('input:checkbox[name=chkMyCollect]:checked');
        var dataList = [];
        var outHtml = '';        

        // swiperLists
        for(i=0; i<chkAtwrk.length; i++) {
            var seltId = $(chkAtwrk[i]).val();
            var imgUrl = $(`#${seltId}`).attr('src');
            var detail = $(`span[name=${seltId}]`).html().split('<br>')[0];
            var atstNm = $(`p[name=${seltId}]`).text();

            dataList.push({
                imgUrl,
                atstNm,
                detail
            });

            var showData = 
            `   <div class="swiper-slide">
                    <span class="fullscreenView__img">
                        <img src="${imgUrl}" alt="">
                    </span>
                    <div class="fullscreenView__txt">
                        <p>${atstNm}</p>
                        <span>
                            ${detail}<br/>
                            (제목, 크기, 재료)
                        </span>
                    </div>
                </div>`;

            outHtml += showData;
        }

        // popUpList.set(dataList);
        $('#swiperLists').html(outHtml);

        const swiper = new Swiper('.swiper', {       
            navigation:{
                nextEl: '.my-button-next',
                prevEl: '.my-button-prev',
            },
            observer: true,
            observeParents: true
        });
    },
});

Template.myCollection.helpers({
    myCollect() {
        let data = Order.find({ mBerID : Meteor.userId(), sttus : '004' }).fetch();
        let res = [];
        
        data.forEach(function(val, idx) {
            var dataVal = val.odAtwrk;

            dataVal.forEach(function(value, index) {
                res.push(value);
            });
        });

        return res;
    },
    atwrkInfo(_id) {
        return Atwrk.findOne({ _id });
    },
    ogPrtChk(_id) {
        let data = Atwrk.findOne({ _id, 'ogPrt.atwrkNm' : { $exists : true } });
        return data != undefined;
    },
    popUpList() {
        if(popUpList.get() != undefined) {
            return popUpList.get();
        }
    }
});
