// ADD-IMPORTER - add line here to import
const takeout = require('./googleTakeout');
const gpx = require('./gpx');
const kml = require('./kml');

// ADD-IMPORTER - add import name here
exports = module.exports = { gpx, kml, takeout, googletakeout: takeout };
