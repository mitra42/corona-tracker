/*
  Dummy output when we want the common format
*/

function convertCommonToExportFormat(obj, { dataset } = {}, cb) {
  cb(null, obj);
}

const mimetype = 'application/json';

exports = module.exports = { mimetype, convertCommonToExportFormat };
