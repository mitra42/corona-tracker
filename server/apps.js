/* Apps suitable for calling from Main.js
  signature is always either (req, res) => which should call one of the completion functions on res.json
  or (req, res, next) => which can also call next() to skip to next match; or next(err) to fail
 */
const debug = require('debug')('corona-tracker:apps');
const importers = require('./importers');
const exporters = require('./exporters');
const { oauthGetCode, oauthGetToken } = require('./oauth');
const { stravaOauthConfig, uploadToStrava } = require('./exporters/strava'); //TODO-STRAVA this will be an exporter (probably)

function sendIt(res, mimetype, exported) {
  if (mimetype === 'application/json') { // exported should be an object
    res.json(exported);
  } else {
    res.set('Content-type', mimetype);
    res.send(exported);
  }
}

function appDataset(req, res) {
  const { dataset } = req.params;
  const { output } = req.query;
  // TODO treat dataset: korea as korea1 + korea2 - handle "groups"
  const specialExport = ['common', 'original'].includes(output);
  const importer = importers[dataset];
  const exporter = !specialExport && exporters[output];
  if (!importer) {
    res.status(500).send(`No importer for dataset ${dataset}`);
  } else if (!exporter && !specialExport) {
    res.status(500).send(`No export format ${output}`);
  } else {
    importer.fetchDataFromRemoteServer((err, imported) => {
      if (err) {
        res.status(500)
          .send(err.message);
      } else {
        try {
          if (output === 'original') {
            sendIt(res, importer.mimetype, imported);
          } else {
            const common = importer.convertImportToCommonFormat(imported);
            if (output === 'common') {
              sendIt(res, 'application/json', common);
            } else {
              const exported = exporter.convertCommonToExportFormat(common, { dataset });
              sendIt(res, exporter.mimetype, exported);
            }
          }
        } catch (err0) {
          debug('500 - %s', err0.message);
          res.status(500)
            .send(err0.message);
        }
      }
    });
  }
}

/*
 * This is an upload authenticated via OAUTH so it has 3 phases to it
 * A:             request code
 * B: ?code=xxx   request token (json)
 * C: have token  do the (upload) function.
 */
// TODO-STRAVA hook the sending to a file selected from url - i.e. output=strava

const fs = require('fs');

function appUploadToStrava(req, res) {
  // See https://developers.strava.com/docs/reference/#api-Uploads-createUpload
  try {
    if (!req.query.code) {
      // Stage 1 - get authorization by human and then get code
      oauthGetCode(req, res, stravaOauthConfig);
    } else {
      // Stage 2 - get token
      oauthGetToken(req, res, stravaOauthConfig, (err, authorization) => { // Error handled inside oauthGetToken
        if (!err) {
          // Stage 3 - have token
          //Used for testing: debug("File uploading %O", fs.statSync('./exporters/strava/israel.gpx'));
          // TODO STRAVA - get the data from COmmon, convert to GPX put in buffer and add to form
          // formdata.append('file', req.body) // See http://expressjs.com/en/4x/api.html#req will need middleware to get uploaded file, but maybe handle elsewhere
          uploadToStrava({
            name: config.name,
            authorization,
            str: fs.createReadStream('./exporters/strava/israel.gpx')
          }, (err, obj) => {
            debug('%s Upload returned %o', stravaOauthConfig.name, err || obj);
            if (err) {
              res.status(err.response.status)
                .send(`${stravaOauthConfig.name}: ${err.response.statusText}`)
            } else {
              res.status(200)
                .send(`${stravaOauthConfig.name} Upload activity id: ${obj.id_str}`);
            }
          });
        }
      });
    }
  } catch(err) {
    debug("Uncaught error in Strava upload %O", err)
  }
}
exports = module.exports = { appDataset, appUploadToStrava };
