/* Apps suitable for calling from Main.js
  signature is always either (req, res) => which should call one of the completion functions on res.json
  or (req, res, next) => which can also call next() to skip to next match; or next(err) to fail
 */
const debug = require('debug')('corona-tracker:apps');
const waterfall = require('async/waterfall');
const importers = require('./importers');
const exporters = require('./exporters');
const { oauthGetCode, oauthGetToken } = require('./oauth');

function sendIt(res, mimetype, exported) {
  if (mimetype === 'application/json') { // exported should be an object
    res.json(exported);
  } else {
    res.set('Content-type', mimetype);
    res.send(exported);
  }
}
function sendErr(res, err) {
  debug('500 - %s', err.message);
  res.status(500).send(err.message);
}
function appDataset(req, res) {
  const { dataset } = req.params;
  const { output } = req.query;
  // TODO treat dataset: korea as korea1 + korea2 - handle "groups"
  const specialExport = ['original'].includes(output);
  const importer = importers[dataset];
  const exporter = !specialExport && exporters[output];
  if (!importer) {
    res.status(500).send(`No importer for dataset ${dataset}`);
  } else if (!exporter && !specialExport) {
    res.status(500)
      .send(`No export format ${output}`);
  } else if (exporter.oauthConfig && !req.query.code) { // If specified Oauth, but no code then redirect
    oauthGetCode(req, res, exporter.oauthConfig);
  } else {
    let authorization;
    waterfall([
      // If there is oauthConfig required then do it, (skips over if none)
      cb => {
        if (exporter.oauthConfig) {
          oauthGetToken(req, res, exporter.oauthConfig,
            (err, auth) => {
              authorization = auth;
              cb(err);
            });
        } else {
          cb(null);
        }
      },
      cb => importer.fetchDataFromRemoteServer(cb),
      (imported, cb) => {
        if (output === 'original') {
          cb(null, [importer.mimetype, imported]);
        } else {
          const common = importer.convertImportToCommonFormat(imported);
          exporter.convertCommonToExportFormat(common, { dataset, authorization },
            (err, exported) => cb(err, [exporter.mimetype, exported]));
        }
      }
    ],
    (err, mimetypeData) => {
      if (err) {
        sendErr(res, err);
      } else {
        sendIt(res, mimetypeData[0], mimetypeData[1]);
      }
    });
  }
}

exports = module.exports = { appDataset, appUploadToStrava };
