/*
Generic outputer for KML
See https://developers.google.com/kml/documentation/kmlreference
*/


const { addressFromCommon, floatFromCommonLat, floatFromCommonLng, isoTimeFromCommonTime, xmlEncode } = require('./utils');

const mimetype = 'application/vnd.google-earth.kml+xml; charset=UTF-8';

/**
 * This function should take a single record in the common format and convert to the wanted format
 * In the case of KML we will return a json-ized xml that can then be generically expanded into XML/*
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
  const { name = '', lng, lat, start, end } = obj;
  const address = addressFromCommon(obj);
  // TODO-KML this <styleUrl> points back at something in the head, of the KML doc which we lose going to common
  return `      <Placemark>
        <name>${xmlEncode(name)}</name>
        <address>${xmlEncode(address)}</address>
        <styleUrl>#pushpin</styleUrl>
        <Point><coordinates>${floatFromCommonLng(lng)},${floatFromCommonLat(lat)},0</coordinates></Point>
        <TimeSpan><begin>${isoTimeFromCommonTime(start)}</begin><end>${isoTimeFromCommonTime(end)}</end></TimeSpan>
      </Placemark>`;
}

/**
 * This should take an object in the common data format, and convert to the required export format.
 * Typically it does it by converting each object with convertOneCommonToExportFormat but other techniques might be required.
 *
 * @param obj { positions, source }
 * @returns {{timelineObjects: {placeVisit: {duration: {startTimestampMs: *, endTimestampMs: *}, location: {longitudeE7: *, name: string, latitudeE7: *}}}[]}}
 */

function convertCommonToExportFormat(obj, { dataset } = {}, cb) {
  cb(null, `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2" xmlns:gx="http://www.google.com/kml/ext/2.2">
  <Document>
    <name>${obj.meta.name}</name>
    <description>${obj.meta.description}</description>
    <Style id="pushpin">
      <IconStyle id="mystyle">
        <Icon>
          <href>http://maps.google.com/mapfiles/kml/pushpin/ylw-pushpin.png</href>
          <scale>1.0</scale>
        </Icon>
      </IconStyle>
    </Style>
    <Folder>
      <name>Places</name>
${obj.positions.map(o => convertOneCommonToExportFormat(o)).join('\n')}
    </Folder>
  </Document>
  </kml>
`);
}

exports = module.exports = { mimetype, convertCommonToExportFormat };
