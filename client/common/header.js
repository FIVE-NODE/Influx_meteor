import { Template } from 'meteor/templating';

import './header.html';
import './headerMenu/artMenu.js';
import './headerMenu/artistMenu.js';
import './headerMenu/galleryMenu.js';
import './headerMenu/myPageSimple.js';

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

    logedInChk = new ReactiveVar(true);

    var logedIn = JSON.parse(sessionStorage.getItem('art_session_index'));
    if(logedIn != null) logedInChk.set(logedIn.index === 0 ? true : false);

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
    },
    'click a'(evt, tmpl) {
        setTimeout(function(){
            location.reload();
        }, 50);
        
    }
});

function menuFun(menu) {
}

Template.header.helpers({
    logedInChk() {
        return logedInChk.get();
    },
    quickMu() {
        return quickMenu.get();
    }
});

