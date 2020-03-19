/*
  This file can be copied and then filled out for each importer

 */

/*
  This file imports the second Korean dataset to a common format

  Dataset is from https://github.com/jihoo-kim/Coronavirus-Dataset/
  Its based (heavily) on https://github.com/yjlou/2019-nCov/tree/master/countries/korea/coronavirus-dataset-converter.js from the https://pandemic.events site.
  If it breaks, we are in touch with them.
*/
const debug = require('debug')('corona-tracker:importers-korea2');
const DwebTransports = require('@internetarchive/dweb-transports');
const csvParse = require('csv-parse/lib/sync');
const { boundingBoxFromCommonArray, commonLatLngFromFloatString, commonTimeFromMS } = require('./utils');
// Utilities - candidates for importers/utils.js
const mimetype = 'text/csv';

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
  dataUrl: 'https://raw.githubusercontent.com/jihoo-kim/Coronavirus-Dataset/master/route.csv',
  TIME_OFFSET: 9 * 60 * 60 * 1000, // e.g. 9 for Korea which is GMT+9;
  siteShortName: 'Korea2',
  siteDescription: 'Coronavirus Dataset from Jihoo-Kim'
};

/**
 * Return an object of the internal format of the server.
 * TODO needs a test function
 *
 * @param cb(err, json obj in Korea2's format
 */
function fetchDataFromRemoteServer(cb) {
  DwebTransports.httptools.GET(config.dataUrl, {}, (err, inputText) => {
    if (err) {
      debug('%s.fetchDataFromRemoteServer failed %s', config.siteShortName, err.message);
      cb(err);
    } else {
      // Its a CSV file
      const records = csvParse(inputText, {
        bom: true, // currently the CSV doesn't have BOM, just in case.
        columns: true,
        skip_empty_lines: true,
      });
      cb(null, records);
    }
  });
}

/**
 * This function isn't required but its useful - it should convert one record in the incoming data
 * into one in the common format, or undefined if the data isn't valid.
 *
 * @returns {{comments: (*|string), lng: number, start: *, name: string | string, end: *, place: (*|string), lat: number}|undefined}
 */
function convertOnePointToCommonFormat(record) {
  // date is in format YYYY-MM-DD korean time.
  const timestamp = (new Date(record.date)).getTime() - config.TIME_OFFSET;
  return ({
    lat: commonLatLngFromFloatString(record.latitude),
    lng: commonLatLngFromFloatString(record.longitude),
    start: commonTimeFromMS(timestamp),
    end: commonTimeFromMS(timestamp + 24 * 60 * 60 * 1000),
    name: `Case${record.patient_id}`,
    place: {
      province: record.province,
      city: record.city,
      type: record.visit,
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
  const ii = imp; // Find the point array - its at the top for Korea2 since came from CSV
  const positions = ii.map(record => convertOnePointToCommonFormat(record)) // Convert each point
    .filter(o => !!o); // Strip any that are unconvertable.
  return { // Return in common format
    positions,
    bounding_box: boundingBoxFromCommonArray(positions), // Get a bounding box
    meta: { name: config.siteShortName, description: config.siteDescription, source: { name: `${config.siteShortName} infected data`, url: config.dataUrl, retrieved: (new Date()).getTime() } }
  };
}

exports = module.exports = { mimetype, fetchDataFromRemoteServer, convertImportToCommonFormat };
