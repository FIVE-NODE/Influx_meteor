// import { Meteor } from 'meteor/meteor';
// import fs from 'fs';

// const tempPath = Meteor.settings.tempPath;
// const imagesPath = Meteor.settings.imagesPath;

// WebApp.connectHandlers.use('/temps', (req, res, next) => {
//     var filename = req.originalUrl.split("/")[2];
//     filename = tempPath + filename;
//     var fsReadFile = Meteor.wrapAsync(fs.readFile);
//     var img = fsReadFile(filename);

//     res.writeHead(200);
//     res.end(img, 'binary');
// });

// WebApp.connectHandlers.use('/images', (req, res, next) => {
//     var filename = imagesPath + req.originalUrl.split("/")[2];
    
//     var img = Meteor.wrapAsync(fs.readFile)(filename);

//     res.writeHead(200);
//     res.end(img, 'binary');
// });