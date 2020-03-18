/* global DwebTransports */
/**
 * Convert a KML file into Takeout timeline JSON format.
 * Copied and adapted from https://github.com/yjlou/2019-nCov/tree/master/kml
 * This dataset is the Diamond Princess visit to Taiwan
 *
 * This file imports the Diamond.kml data to a common format
 *
 * TODO split this file into a common KML importer plus any parameterization
 * TODO carry enough info into the "common" format to allow a KML exporter to rebuild the head and foot of the KML file.
*/

const debug = require('debug')('corona-tracker:importers-diamondtaiwan');
const DwebTransports = require('@internetarchive/dweb-transports');
const { boundingBoxFromCommonArray, commonLatLngFromFloatString, commonLatLngFromFloat, commonTimeFromMS } = require('./utils');
const kmlParser = require('./diamond/parsers.js');

// Utilities - candidates for importers/utils.js


// End of possible utilities

/* Common formats:
  time is represented (in 2019-nCov as MS since (WHEN?)
  lat and lng are represented as integers lat*10^7
  for now we'll use the same, but use the conversion functions in ./util.js
{
  positions: [
    {
      lat,    integer - lat * 10^7
      lng,    integer - lng * 10^7
      start,  MS since (when) (same as Google Takeout format, and Israel timestamp when adjusted for GMT
      end,    MS since (when) (same as Google Takeout format, and Israel timestamp when adjusted for GMT
      name,   Of patient as provided by country
      place { address, address_name, address_english, province, city, type},  Human readable names of location
      comments  Any comments from the data
    }
  ]
  bounding_box: {
    top, left, right, bottom
  }
  meta: {
  }
}
 */

const config = {
  dataUrl: 'https://raw.githubusercontent.com/yjlou/2019-nCov/master/kml/Diamond.kml',
  TIME_OFFSET: 0 * 60 * 60 * 1000, // e.g. 2 for Israel which is GMT+2
  siteShortName: 'Diamond'
}

/**
 * Return an object of the internal format of the server.
 * TODO needs a test function
 *
 * @param cb(err, json obj in Xxx's format
 */
function fetchDataFromRemoteServer(cb) {
  DwebTransports.httptools.GET(config.dataUrl, {}, (err, res) => {
    if (err) {
      debug('%s.fetchDataFromRemoteServer failed %s', config.siteShortName, err.message);
      cb(err);
    } else {
      cb(null, res);
    }
  });
}

/**
 * This function isn't required but its useful - it should convert one record in the incoming data
 * into one in the common format, or undefined if the data isn't valid.
 *
 * @param record {
 *  u'attributes': {
 *    u'Comments': u'...',
 *    u'Name': u'\u05d7\u05d5\u05dc\u05d4 15',
 *    u'OBJECTID': 1201,
 *    u'POINT_X': 34.80773124,
 *    u'POINT_Y': 32.11549963,
 *    u'Place': u'...',
 *    u'fromTime': 1583144100000,  // this is 10:15 Israel time
 *    u'sourceOID': 1,
 *    u'stayTimes': u'10:15-11:15',
 *    u'toTime': 1583147700000  // this is 11:15 Israel time
 *  },
 *  u'geometry': {u'x': 34.807731241000056, u'y': 32.115499628000066}
 * }
 * @returns {{comments: (*|string), lng: number, start: *, name: string | string, end: *, place: (*|string), lat: number}|undefined}
 */
function convertOnePointToCommonFormat(record) {
  const start = commonTimeFromMS(record.begin * 1000 - config.TIME_OFFSET);
  const end = commonTimeFromMS(record.begin * 1000 - config.TIME_OFFSET);
  const lat = commonLatLngFromFloat(record.lat);
  const lng = commonLatLngFromFloat(record.lng);
  const name = [record.name, record.description && record.description.split('#!metadata')[0]].filter(o=>!!o).join(' ');
  const place = { address: record.address };
  return {
    lat, lng, start, end, name, place
  };
}

/**
 *
 * @param import data in the format provided by the site
 * @returns {{bounding_box: ({top: *, left: *, bottom: *, right: *}|{top: *, left: *, bottom: *, right: *}), meta: {source: {name: string, retrieved: number, url: string}}, positions: *}}
 */
function convertImportToCommonFormat(imp) {
  // This is just an example
  const ii = kmlParser.parseKml(imp);
  debug('Loaded %s points from %s', ii.length, config.siteShortName);

  const positions = ii.map(record => convertOnePointToCommonFormat(record)) // Convert each point
    .filter(o => !!o); // Strip any that are unconvertable.
  const bounding_box = boundingBoxFromCommonArray(positions); // Get a bounding box
  return { // Return in common format
    positions,
    bounding_box,
    meta: { source: { name: `${config.siteShortName} infected data`, url: config.dataUrl, retrieved: (new Date()).getTime() } }
  };
}

exports = module.exports = { fetchDataFromRemoteServer, convertImportToCommonFormat };
