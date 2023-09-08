import './inventoryPopup.html';

Template.inventoryPopup.onCreated(function() {
    this.autorun(() => {
        console.log(seltAtstInfo.get());
    });
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


