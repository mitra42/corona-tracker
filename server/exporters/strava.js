const debug = require('debug')('corona-tracker:strava');
const { httptools } = require('@internetarchive/dweb-transports');
const gpx = require('./gpx'); // Have to convert to GPX first

const FormData = require('form-data');

const oauthConfig = {
  name: 'Strava', // For debug messages etc
  domainOauthUrl: 'www.strava.com/oauth',
  clientId: '44623',
  clientSecret: '2b8f90e1995ea9699af363e140f5aeffb5f17939',
  external_id: 'upload_from_api', // Maybe should be random, or supplied in req.query
  protoHostPort: 'https://c19.mitra.biz', // Fiendishly hard to get in express;
};

function uploadToStrava({ dataset, authorization, str } = {}, cb) {
  debug('Uploading %s to Strava', dataset);
  const url = 'https://www.strava.com/api/v3/uploads';
  const dateStr = (new Date()).toISOString();
  const data = {
    'name': `${dataset} at ${dateStr} via corona-tracker api`, // TODO this should come from data set name
    'data_type': 'gpx',
    'external_id': `${dataset}-${dateStr}`
  };
  const form = new FormData();
  Object.entries(data)
    .forEach(kv => form.append(kv[0], kv[1]));
  form.append('file', str);
  // Alternative fetch(new Request(url, {method: 'post', headers, body: form}).then(res1 => res1.json()).then(j => res.send(`Success %{j.sid_str}`)).catch(...)
  httptools.POST(url, {
    headers: { Authorization: authorization, ...form.getHeaders() },
    data: form
  }, cb);
}


/**
 * This should take an object in the common data format, and convert to the required export format.
 * Typically it does it by converting each object with convertOneCommonToExportFormat but other techniques might be required.
 *
 * @param obj { positions, source }
 * @returns {{timelineObjects: {placeVisit: {duration: {startTimestampMs: *, endTimestampMs: *}, location: {longitudeE7: *, name: string, latitudeE7: *}}}[]}}
 */

function convertCommonToExportFormat(obj, { dataset, authorization } = {}, cb) {
  waterfall([
    cb1 => gpx.convertCommonToExportFormat(obj, {dataset}, cb1),
    (gpxStr, cb1) => { debug("XXX gpx convertion returned %s bytes", gpxStr.length); cb1(null, gpxStr); }
    (gpxStr, cb1) => uploadToStrava({dataset, authorization, str: Buffer.from(gpxStr, 'utf8') }, cb1)
    ], (err, res) => {
    debug('Strava upload returned %o', err || res);
    cb(err, res);
  });
}
const mimetype = 'application/json';

exports = module.exports = { mimetype, convertCommonToExportFormat, oauthConfig, uploadToStrava };

