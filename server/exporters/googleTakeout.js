/*
  This file can be copied and then filled out for each importer
*/
// TODO back merge this into template.js

function convertOneCommonToExportFormat(obj) {
  const { name = '', place = '', comments = '' } = obj;
  // TODO: move ${place} to 'address' field? (check on 2019-nCovc.israel.converter.js in case changed)
  return {
    placeVisit: {
      location: {
        latitudeE7: obj.lat,
        longitudeE7: obj.lng,
        name: `${name}\n${place}\n${comments}`
      },
      duration: {
        startTimestampMs: obj.start,
        endTimestampMs: obj.end,
      },
    }
  };
}

function convertCommonToExportFormat(obj) {
  return {
    timelineObjects: obj.positions.map(o => convertOneCommonToExportFormat(o))
  };
}

exports = module.exports = { convertCommonToExportFormat };
