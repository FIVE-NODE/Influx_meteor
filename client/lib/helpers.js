import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

Template.registerHelper('subsFlag', function() {
    console.log(' ============ ');
    var flag = FlowRouter.getRouteName() === 'aOne' ? true : false;
    var res = '';
    if(flag) {
        res += '<script type="text/javascript" src="/libs/home.js"></script>'
            + '<link rel="stylesheet" href="/css/main.css">';
        return  res;
    } else {
        res += '<script type="text/javascript" src="/libs/sub.js"></script>'
            + '<link rel="stylesheet" href="/css/sub.css">';
        return res;
    }
    
});