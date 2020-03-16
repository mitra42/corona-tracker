/* Apps suitable for calling from Main.js
  signature is always either (req, res) => which should call one of the completion functions on res.json
  or (req, res, next) => which can also call next() to skip to next match; or next(err) to fail
 */
const importers = require('./importers');
const exporters = require('./exporters');

// TODO parameterize this
function appIsrael2Takeout(req, res) {
  importers.israel.fetchDataFromRemoteServer( (err, imported) => {
    if (err) {
      res.status(500)
        .send(err.message);
    } else {
      try {
        const common = importers.israel.convertImportToCommonFormat(imported);
        const exported = exporters.googleTakeout.convertCommonToExportFormat(common);
        res.json(exported);
      } catch(err) {
        res.status(500).send(err.message);
      }
    }
  });
}
exports = module.exports = { appIsrael2Takeout };
