import { Meteor } from 'meteor/meteor';
import { Pick, Atwrk, Mber, Inventory } from '../lib/collections.js';

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

Meteor.publish('userData', function() {
    if(this.userId) {
        return Meteor.users.find({ _id : this.userId});
    } else {
        this.ready();
    }
});

// Meteor.publish('inventory', function() {
//     if(this.userId) {
//         return Inventory.find();
//     } else {
//         this.ready();
//     }
// });