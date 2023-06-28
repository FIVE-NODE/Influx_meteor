import { Template } from 'meteor/templating';

import './header.html';
import './headerMenu/artMenu.js';
import './headerMenu/artistMenu.js';
import './headerMenu/galleryMenu.js';
import './headerMenu/myPageSimple.js';
// import '../../lib/code.js';

function selectQuickMu() {
    Meteor.call('selectQuickMu', function(e, data) {
        quickMenu.set(data);
    });   
}

Template.header.onCreated(function() {
    this.subscribe("header");

    menuFlag = new ReactiveVar(false);
    menuKind = new ReactiveVar('');

    quickMenu = new ReactiveVar();

    selectQuickMu();
});

Template.header.onRendered(function() {
});

Template.header.events({
    'click button[name=artMenu]'(evt, tmpl) {
        menuFun('artMenu');
    },
    'click button[name=galleryMenu]'(evt, tmpl) {
        menuFun('galleryMenu');
    },
    'click button[name=artistMenu]'(evt, tmpl) {
        menuFun('artistMenu');
    },
    'click button[name=myPage]'(evt, tmpl) {
        console.log(Session.get('art_session_user'));
    },
});

function menuFun(menu) {
    if(menuFlag.get() && menu === menuKind.get()) {
        $('div[name=headerMenu]').hide();
        menuFlag.set(false);
    } else if(!menuFlag.get() || menu != menuKind.get()){
        $('div[name=headerMenu]').show();
        menuFlag.set(true);
        menuKind.set(menu);
    }
}

Template.header.helpers({
    menuKind() {
        return menuKind.get();
    },
    logedInChk() {
        var logedIn = JSON.parse(sessionStorage.getItem('art_session_index'));
        if(logedIn != null) return logedIn.index === 0 ? true : false;
        else return false;
    },
    quickMu() {
        return quickMenu.get();
    }
});

