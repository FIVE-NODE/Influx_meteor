import { Meteor } from 'meteor/meteor';
import { Pick, Atwrk } from '../lib/collections.js';

Meteor.publish('ArtStartPub', function() {

});

Meteor.publish('Pick', function() {
    return Pick.find();
});

Meteor.publish('Atwrk', function() {
    return Atwrk.find();
});