import './inventoryPopup.html';

Template.inventoryPopup.onCreated(function() {
});

Template.inventoryPopup.onRendered(function() {
});

Template.inventoryPopup.events({
});

Template.inventoryPopup.helpers({
    printShow() {
        if(seltAtstInfo.get() != undefined) {
            return seltAtstInfo.get();
        }
    }
});


