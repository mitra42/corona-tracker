/* Export to GPX
 * https://www.topografix.com/gpx_manual.asp
 */

const { floatFromCommonLng, floatFromCommonLat, isoTimeFromCommonTime } = require('./utils');

/**
 * This function should take a single record in the common format and convert to the wanted format
 *
 * @param obj in common format.
 * @returns {{placeVisit: {duration: {startTimestampMs: *, endTimestampMs: *}, location: {longitudeE7: *, name: string, latitudeE7: *}}}}
 */

function convertOneCommonToExportFormat(obj) {
  const lat = floatFromCommonLat(obj.lat);
  const lon = floatFromCommonLng(obj.lng);
  const t1 = isoTimeFromCommonTime(obj.start);
  const t2 = isoTimeFromCommonTime(obj.end);
  const name = obj.name.replace('\n', ' ');
  return [t1, t2].map(t => `        <trkpt lat="${lat}" lon="${lon}"><time>${t}</time><name>${name}</name></trkpt>`).join('\n');
}

function convertBounds(o) {
  return `<bounds minLat="${floatFromCommonLat(o.bottom)}" minLon="${floatFromCommonLng(o.left)}" maxLat="${floatFromCommonLat(o.top)}" maxLon="${floatFromCommonLng(o.right)}" />`;
}
/**
 * This should take an object in the common data format, and convert to the required export format.
 * Typically it does it by converting each object with convertOneCommonToExportFormat but other techniques might be required.
 *
 * @param obj { positions, source }
 * @returns {{timelineObjects: {placeVisit: {duration: {startTimestampMs: *, endTimestampMs: *}, location: {longitudeE7: *, name: string, latitudeE7: *}}}[]}}
 */

function convertCommonToExportFormat(obj) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.0">
  <name>${obj.meta.source.name}</name>
  <trk>
    <name>${obj.meta.source.name}</name>
    <number>1</number>
    <trkseg>
${obj.positions.map(o => convertOneCommonToExportFormat(o)).join('\n')}
    </trkseg>
  </trk>
  ${convertBounds(obj.bounding_box)}
</gpx>`;
}

const mimetype = 'application/gpx+xml';

exports = module.exports = { mimetype, convertCommonToExportFormat };
