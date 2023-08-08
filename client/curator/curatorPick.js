import './curatorPick.html';

Template.curatorPick.onCreated(function() {
    pick = new ReactiveVar();

    function pickData() {
        Meteor.call('selectAllPick', {}, function(err, res) {
            pick.set(res.sort(function(a, b) {
                return a.thmTp - b.thmTp;
            }));
        });
    }
    
    pickData();
});

Template.curatorPick.onRendered(function() {
});

Template.curatorPick.events({
});

Template.curatorPick.helpers({
    pickList() {
        return pick.get();
    },
    codeToEngSub(code) {
        switch(code) {
            case '001':
                return 'Original Artworks';
            case '002':
                return 'Digital Edition printmaking';
        }
    },
    codeToUrl(code) {
        switch(code) {
            case '001':
                return 'ogCurator';
            case '002':
                return 'dtCurator';
            default:
                return 'atstCurator';
        }
    }
});
