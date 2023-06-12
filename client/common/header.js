import { Template } from 'meteor/templating';

import './header.html';
import './headerMenu/artMenu.js';
import './headerMenu/artistMenu.js';
import './headerMenu/galleryMenu.js';
import './headerMenu/myPageSimple.js';

Template.header.onCreated(function() {
    this.subscribe("header");

    menuFlag = new ReactiveVar(false);
    menuKind = new ReactiveVar('');
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
    }

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
        return JSON.parse(sessionStorage.getItem('art_session_index')).index === 0 ? true : false;
    }
});

