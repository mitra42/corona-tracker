/* Apps suitable for calling from Main.js
  signature is always either (req, res) => which should call one of the completion functions on res.json
  or (req, res, next) => which can also call next() to skip to next match; or next(err) to fail
 */
const debug = require('debug')('corona-tracker:apps');
const importers = require('./importers');
const exporters = require('./exporters');

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
              const exported = exporter.convertCommonToExportFormat(common);
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
exports = module.exports = {
  appDataset,
};
