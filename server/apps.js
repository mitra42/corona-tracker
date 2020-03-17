/* Apps suitable for calling from Main.js
  signature is always either (req, res) => which should call one of the completion functions on res.json
  or (req, res, next) => which can also call next() to skip to next match; or next(err) to fail
 */
const debug = require('debug')('corona-tracker:apps');
const importers = require('./importers');
const exporters = require('./exporters');

function appDataset(req, res) {
  const { dataset } = req.params;
  const { output } = req.query;
  // TODO treat dataset: korea as korea1 + korea2 - handle "groups"
  // TODO treat output: common or output:original as expected
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
            if (typeof imported === "Object") {
              res.json(imported);
            } else {
              res.send(imported);
            }
          } else {
            const common = importer.convertImportToCommonFormat(imported);
            if (output === 'common') {
              res.json(common);
            } else {
              const exported = exporter.convertCommonToExportFormat(common);
              res.json(exported);
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
