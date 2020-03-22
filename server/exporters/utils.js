// const debug = require('debug')('corona-tracker:exporters-utils');

// These functions to convert from common format are the opposite of functions in importers/utils.js, so make sure to keep in line.
function floatFromCommonLat(lat) {
  return ((lat > 900000000) ? (lat - 4294967296) : lat) / 1E7;
}
function floatFromCommonLng(lng) {
  return ((lng > 1800000000) ? (lng - 4294967296) : lng) / 1E7;
}
function isoTimeFromCommonTime(ms) {
  return (new Date(ms)).toISOString();
}

// longInt is the format we use in common for lat and lng so these are easy.
const longIntFromCommonLat = (lat) => lat;
const longIntFromCommonLng = (lng) => lng;
// Time in Milliseconds is what we use for time so also easy
const timeMS = (t) => t;

/**
 * Convert a common data item into a address as a one-line string, it should handle different combination of address fields.
 * @param obj
 * @returns {string}
 */
function addressFromCommon(obj, sep) {
  const { place } = obj;
  return [place.address_name, place.type, place.address, place.address_english, place.city, place.province].filter(s => !!s).join(sep);
}

exports = module.exports = {
  floatFromCommonLat, floatFromCommonLng, isoTimeFromCommonTime, longIntFromCommonLat, longIntFromCommonLng, timeMS, addressFromCommon };

