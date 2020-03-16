/*
  This file imports the Israel data to a common format

  TODO - when working, backport to template.js with comments

  Its based (heavily) on https://github.com/yjlou/2019-nCov/tree/master/countries/israel from the https://pandemic.events site.
  If it breaks, we are in touch with them.
*/
const debug = require('debug')('corona-tracker:importers-israel');
const DwebTransports = require('@internetarchive/dweb-transports');
const { boundingBoxFromCommonArray, commonLatLngFromFloatString, commonTimeFromMS } = require('./utils');

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
      place,  Human readable name of location
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


const dataUrl = 'https://services5.arcgis.com/dlrDjz89gx9qyfev/arcgis/rest/services/Corona_Exposure_View/FeatureServer/0/query?f=json&where=1%3D1&returnGeometry=true&spatialRel=esriSpatialRelIntersects&outFields=*&maxRecordCountFactor=4&outSR=4326&resultOffset=0&resultRecordCount=8000&cacheHint=true';

const timeUtils = {
  TIME_OFFSET: 2 * 60 * 60 * 1000, // GMT+2 Israel time
};

/*
  Return an object of the internal format of the server.
  TODO needs a test function
 */
function fetchDataFromRemoteServer(cb) {
  DwebTransports.httptools.GET(dataUrl, {}, (err, res) => {
    if (err) {
      debug('israel.fetchDataFromRemoteServer failed %s', err.message);
      cb(err);
    } else {
      cb(null, typeof res === 'string' ? JSON.parse(res) : res); // Return object no matter if server gives us it or not
    }
  });
}

function convertOnePointToCommonFormat(record) {
  // record = {
  //   u'attributes': {
  //     u'Comments': u'...',
  //     u'Name': u'\u05d7\u05d5\u05dc\u05d4 15',
  //     u'OBJECTID': 1201,
  //     u'POINT_X': 34.80773124,
  //     u'POINT_Y': 32.11549963,
  //     u'Place': u'...',
  //     u'fromTime': 1583144100000,  // this is 10:15 Israel time
  //     u'sourceOID': 1,
  //     u'stayTimes': u'10:15-11:15',
  //     u'toTime': 1583147700000  // this is 11:15 Israel time
  //   },
  //   u'geometry': {u'x': 34.807731241000056, u'y': 32.115499628000066}}
  // }
  const { attributes, geometry } = record;
  const lat = commonLatLngFromFloatString(geometry.y);
  const lng = commonLatLngFromFloatString(geometry.x);

  // TODO(stimim): Should we add some margin before and after the record day? (check on 2019-nCovc.israel.converter.js in case changed)
  const start = commonTimeFromMS(attributes.fromTime - timeUtils.TIME_OFFSET);
  const end = commonTimeFromMS(attributes.toTime - timeUtils.TIME_OFFSET);

  // Sanity checks
  if (!start) {
    debug(`WARNING: Undefined start time for ${attributes.Name} : ${attributes.Comments}. Ignored.`);
    return undefined;
  }
  if (!end) {
    debug(`WARNING: Undefined end time for ${attributes.Name} : ${attributes.Comments}. Ignored.`);
    return undefined;
  }
  if (start > end) {
    debug(`WARNING: Start time is larger than the end time for ${attributes.Name} : ${attributes.Comments}. Ignored.`);
    return undefined;
  }
  if (!attributes.Name) {
    debug(`WARNING: Missing Name ${JSON.stringify(record)}`);
  }
  return ({
    lat,
    lng,
    start,
    end,
    name: attributes.Name || '',
    place: attributes.Place || '',
    comments: attributes.Comments || '',
  });
}

function convertImportToCommonFormat(imp) {
  // TODO Note - this is using the format from 2019-nCov, it might not be what we want for our common format
  const ii = imp.features;
  const positions = ii.map(record => convertOnePointToCommonFormat(record))
    .filter(o => !!o); // Strip any that are unconvertable.
  const bounding_box = boundingBoxFromCommonArray(positions);
  return {
    positions,
    bounding_box,
    meta: { source: { name: 'Israel infected data', url: dataUrl, retrieved: (new Date()).getTime() } }
  };
}

exports = module.exports = { fetchDataFromRemoteServer, convertImportToCommonFormat };
