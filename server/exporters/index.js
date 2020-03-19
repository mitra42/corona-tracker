// ADD-IMPORTER - add line here to import
const takeout = require('./googleTakeout');
const gpx = require('./gpx');

// ADD-IMPORTER - add import name here
exports = module.exports = { takeout, googletakeout: takeout, gpx };
