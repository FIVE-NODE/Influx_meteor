import { clientNotice } from '../../lib/clientCollections.js';

import './zTwoA.html';

Template.zTwoA.onCreated(function() {
});

Template.zTwoA.onRendered(function() {

});

Template.zTwoA.events({
    'click button[name=backBtn]'() {
        window.history.back();
    },
   
});

Template.zTwoA.helpers({
    subFlag() {
        return false;
    },
    noticeInfo() {
        return clientNotice.findOne();
    }
});


