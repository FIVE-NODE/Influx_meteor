import { Meteor } from 'meteor/meteor';
import { Pick, Atwrk, Mber } from '../lib/collections.js';

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
    return Mber.find({});
});