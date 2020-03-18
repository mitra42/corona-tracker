/*
  This file can be copied and then filled out for each importer

  Then please merge any changes back into here
 */

exports = module.exports = { xxx };
/**
 * This function should take a single record in the common format and convert to the wanted format
 *
 * @param obj in common format.
 * @returns {{placeVisit: {duration: {startTimestampMs: *, endTimestampMs: *}, location: {longitudeE7: *, name: string, latitudeE7: *}}}}
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

/**
 * This should take an object in the common data format, and convert to the required export format.
 * Typically it does it by converting each object with convertOneCommonToExportFormat but other techniques might be required.
 *
 * @param obj { positions, source }
 * @returns {{timelineObjects: {placeVisit: {duration: {startTimestampMs: *, endTimestampMs: *}, location: {longitudeE7: *, name: string, latitudeE7: *}}}[]}}
 */

function convertCommonToExportFormat(obj) {
  return {
    xxx: obj.positions.map(o => convertOneCommonToExportFormat(o))
  };
}

exports = module.exports = { convertCommonToExportFormat };
