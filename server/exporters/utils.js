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
exports = module.exports = { floatFromCommonLat, floatFromCommonLng, isoTimeFromCommonTime };
