/*
  This file can be copied and then filled out for each importer

  Then please merge any changes back into here
 */

/**
 * This function should take a single record in the common format and convert to the wanted format
 *
 * @param obj in common format.
 * @returns {{placeVisit: {duration: {startTimestampMs: *, endTimestampMs: *}, location: {longitudeE7: *, name: string, latitudeE7: *}}}}
 */
function convertOneCommonToExportFormat(obj) {
  const { name = '', place = {}, comments = '' } = obj; // Grab fields wanted out of object
  return {
      ... bunch of fields in an object
    }
  }
}

/**
 * This should take an object in the common data format, and convert to the required export format.
 * Typically it does it by converting each object with convertOneCommonToExportFormat but other techniques might be required.
 *
 * @param obj { positions, source }
 * @returns {{timelineObjects: {placeVisit: {duration: {startTimestampMs: *, endTimestampMs: *}, location: {longitudeE7: *, name: string, latitudeE7: *}}}[]}}
 */

function convertCommonToExportFormat(obj, { dataset } = {}, cb) {
  cb(null, {
    xxx: obj.positions.map(o => convertOneCommonToExportFormat(o))
  });
}

exports = module.exports = { convertCommonToExportFormat };
