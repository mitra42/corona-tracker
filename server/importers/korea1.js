/*
  This file can be copied and then filled out for each importer
 */

/*
  This file imports the first Korean dataset to a common format

  Its based (heavily) on https://github.com/yjlou/2019-nCov/tree/master/countries/korea from the https://pandemic.events site.
  If it breaks, we are in touch with them.
*/
//const debug = require('debug')('corona-tracker:importers-korea1');
const DwebTransports = require('@internetarchive/dweb-transports');
const { boundingBoxFromCommonArray, commonLatLngFromFloatString, commonTimeFromMS } = require('./utils');
// TODO - this is temporary
const inp = require('./korea1/coronamap.site-input');
// Utilities - candidates for importers/utils.js
const mimetype = 'application/json';

// End of possible utilities

/* Common formats:
  time is represented (in 2019-nCov as MS since (WHEN?) (this is as used in Google Takeout, Javascript and the Israeli data
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
  dataUrl: 'https://coronamap.site/javascripts/ndata.js',
  TIME_OFFSET: 9 * 60 * 60 * 1000, // e.g. 9 for Korea which is GMT+9;
  siteShortName: 'Korea1'
};

/**
 * Return an object of the internal format of the server.
 * TODO needs a test function
 *
 * @param cb(err, json obj in Korea1's format
 */
function fetchDataFromRemoteServer(cb) {
  /* TODO we need the data in json, but currently only available in javascript so including via the require above
  DwebTransports.httptools.GET(config.dataUrl, {}, (err, res) => {
    if (err) {
      debug('%s.fetchDataFromRemoteServer failed %s', config.siteShortName, err.message);
      cb(err);
    } else {
      cb(null, typeof res === 'string' ? JSON.parse(res) : res); // Return object no matter if server gives us it or not
    }
  });
   */
  cb(null, inp);
}

/**
 * This function isn't required but its useful - it should convert one record in the incoming data
 * into one in the common format, or undefined if the data isn't valid.
 *
 * @param record {  {
 *    solo: true,
 *    profile: "-",
 *    tag: "#안동 확진자",
 *    month: 2,
 *    day: 23,
 *    name: "안동",
 *    full: "안동 확진자",
 *    address: "GS수퍼마켓 안동용상점",
 *    address_name: "경북 안동시 용상동 600-12",
 *    address_english: "GS Supermarket Andong Yongshop",
 *    latlng: "36.5547110600951, 128.76207056041446"
 *  },
 * @returns {{comments: (*|string), lng: number, start: *, name: string | string, end: *, place: (*|string), lat: number}|undefined}
 */
function KrDateToTimestampMs(year, month, day) {
  return (new Date(year, month - 1, day)).getTime() - config.TIME_OFFSET;
}

function convertOnePointToCommonFormat(record) {
  // latlng is string "37.47700115295818, 126.96292928072465"  (some versions previously had naver.maps.LatLng())
  const [lat, lng] = record.latlng.split(',').map(l => commonLatLngFromFloatString(l));

  // Year is not specified in data source, should be 2020.
  const timestamp = KrDateToTimestampMs(2020, record.month, record.day);
  return ({
    lat,
    lng,
    start: commonTimeFromMS(timestamp),
    end: commonTimeFromMS(timestamp + 24 * 60 * 60 * 1000),
    name: record.name,
    place: {
      address: record.address,
      address_name: record.address_name,
      address_english: record.address_english,
    }
  });
}

/**
 *
 * @param import data in the format provided by the site
 * @returns {{bounding_box: ({top: *, left: *, bottom: *, right: *}|{top: *, left: *, bottom: *, right: *}), meta: {source: {name: string, retrieved: number, url: string}}, positions: *}}
 */
function convertImportToCommonFormat(imp) {
  // This is just an example
  const ii = imp.position; // Find the point array
  const positions = ii.map(record => convertOnePointToCommonFormat(record)) // Convert each point
    .filter(o => !!o); // Strip any that are unconvertable.
  return { // Return in common format
    positions,
    bounding_box: boundingBoxFromCommonArray(positions), // Get a bounding box
    meta: { source: { name: `${config.siteShortName} infected data`, url: config.dataUrl, retrieved: (new Date()).getTime() } }
  };
}

exports = module.exports = { mimetype, fetchDataFromRemoteServer, convertImportToCommonFormat };
