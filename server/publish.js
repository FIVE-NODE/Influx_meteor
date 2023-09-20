import { Meteor } from 'meteor/meteor';
import { Pick, Atwrk, Mber, Inventory, StndPntReq, Cmmnc, Order, PageList } from '../lib/collections.js';

Meteor.publish('ArtStartPub', function() {
});

Meteor.publish('atwrkSch', function(data) {
    return data;
});

Meteor.publish('Pick', function() {
    return Pick.find();
});  

Meteor.publish('Atwrk', function() {
    return Atwrk.find();
});

Meteor.publish('User', function(_id) {
    return Mber.findOne({_id : _id});
});

Meteor.publish('Order', function() {
    return Order.find();
});

Meteor.publish('PageList', function() {
    return PageList.find();
});

Meteor.publish('userData', function() {
    if(this.userId) {
        return Meteor.users.find({ _id : this.userId});
    } else {
        this.ready();
    }
});

Meteor.publish('mangeMsg', function() { 
    if(this.userId) {
        return Cmmnc.find();
    } else {
        this.ready();
    }
});

Meteor.publish('glryAppMang', function() {
    // if(this.userId) {
        // return StndPntReq.find({}).fetch();
    // } else {
        // this.ready();
        return StndPntReq.find();
    // }
});

// Meteor.publish('inventory', function() {
//     if(this.userId) {
//         return Inventory.find();
//     } else {
//         this.ready();
//     }
// });