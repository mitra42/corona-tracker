/*
  This file can be copied and then filled out for each importer

  Then please merge any changes back into here
 */


/**
 * This function should take a single record in the common format and convert to the wanted format
 * In the case of KML we will return a json-ized xml that can then be generically expandsed into XML/*
 * <Placemark>
 *   <name>台北市西門町</name>
 *   <address>台北市西門町</address>
 *   <styleUrl>#icon-1669-E65100-labelson-nodesc</styleUrl>
 *   <Point><coordinates>121.507299,25.042300,0</coordinates></Point>
 *   <TimeSpan><begin>2020-01-30T22:00:00.000Z</begin><end>2020-01-31T09:30:00.000Z</end></TimeSpan>
 *   </Placemark>
 */

/*
 * @param obj in common format.
 * @returns
 */

function convertOneCommonToExportFormat(obj) {
  const { name = '', place = {}, comments = '' } = obj;
  return {

  };
}

/**
 * This should take an object in the common data format, and convert to the required export format.
 * Typically it does it by converting each object with convertOneCommonToExportFormat but other techniques might be required.
 *
 * @param obj { positions, source }
 * @returns {{timelineObjects: {placeVisit: {duration: {startTimestampMs: *, endTimestampMs: *}, location: {longitudeE7: *, name: string, latitudeE7: *}}}[]}}
 */

function convertCommonToExportFormat(obj, { dataset} = {}) {
  return {
    xxx: obj.positions.map(o => convertOneCommonToExportFormat(o))
  };
}

exports = module.exports = { convertCommonToExportFormat };
