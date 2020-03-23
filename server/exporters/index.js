// ADD-IMPORTER - add line here to import
const takeout = require('./googleTakeout');
const gpx = require('./gpx');
const kml = require('./kml');
const common = require('./common');
const strava = require('./strava');

// ADD-IMPORTER - add import name here
exports = module.exports = { common, gpx, kml, strava, takeout, googletakeout: takeout };
