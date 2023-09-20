import { Meteor } from 'meteor/meteor';

if(Meteor.isClient) {
    // const pageList = JSON.parse(Assets.getText('json/pageList.json'));
    // Session.set('pageList', pageList);
    
    // Meteor.call('pageList', function(err, res) {
    //     Session.set('pageList', res);
    //     console.log(Session.get('pageList'));
    // });
    // Meteor.startup(function() {
    //     Meteor.call('pageSet', function(err, res) {
    //         Session.set('pageList', res);
    //     });
    //     // $('head').append('<script type="text/javascript" src="/libs/jquery/jquery-3.6.1.min.js"></script>');
    //     // $('head').append('<script type="text/javascript" src="/libs/jquery-ui.min.js"></script>');
    //     // $('head').append('<script type="text/javascript" src="/libs/swiper.min.js"></script>');
    //     // $('head').append('<script type="text/javascript" src="/libs/tweenmax.min.js"></script>');
    //     // $('head').append('<link rel="stylesheet" href="/css/lib/swiper.min.css">');
    //     // $('head').append('<link rel="stylesheet" href="/css/ux-common.css">');
    //     // $('head').append('<link rel="stylesheet" href="/css/main.css">');
    // });
}
