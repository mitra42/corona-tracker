/*
  This is based on template.js
*/

function convertOneCommonToExportFormat(obj) {
  const { name = '', place = {}, comments = '' } = obj;
  // TODO: move ${place} to 'address' field? (check on 2019-nCovc.israel.converter.js in case changed)
  return {
    placeVisit: {
      location: {
        latitudeE7: obj.lat,
        longitudeE7: obj.lng,
        // place.address_name is in israeli and korea1; address and address_english in korea1, comments in israeli
        // province, city, place in korea2
        name: [name, place.address_name, place.type, place.address, place.address_english, place.province, place.city, comments].filter(s=>!!s).join('\n')
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
