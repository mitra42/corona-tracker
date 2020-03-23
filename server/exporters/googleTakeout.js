/*
  This is based on template.js
*/
const { addressFromCommon, longIntFromCommonLat, longIntFromCommonLng, timeMS } = require('./utils');

function convertOneCommonToExportFormat(obj) {
  const { name = '', place = {}, comments = '' } = obj;
  return {
    placeVisit: {
      location: {
        latitudeE7: longIntFromCommonLat(obj.lat),
        longitudeE7: longIntFromCommonLng(obj.lng),
        // place.address_name is in israeli and korea1; address and address_english in korea1, comments in israeli
        // province, city, place in korea2
        name: [name, addressFromCommon('\n'), comments].filter(s => !!s).join('\n')
      },
      duration: {
        startTimestampMs: timeMS(obj.start),
        endTimestampMs: timeMS(obj.end),
      },
    }
  };
}

function convertCommonToExportFormat(obj, { dataset } = {}, cb) {
  cb(null, {
    timelineObjects: obj.positions.map(o => convertOneCommonToExportFormat(o))
  });
}

const mimetype = 'application/json';

exports = module.exports = { mimetype, convertCommonToExportFormat };
