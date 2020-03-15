/*
 * Library of tools for interacting with the browser.
 */
const debug = require('debug')('corona-tracker:browserlib');

function testPosition(cb) {
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      debug("getCurrentPosition changed %O", pos);
      cb(pos);
    },
    err => {
      debug("getCurrentPosition failing %s", err.message)
    });
  navigator.geolocation.watchPosition(
    (pos) => {
      debug("watchPosition changed %O", pos);
      cb(pos);
    },
    err => {
      debug("watchPosition failing %s", err.message)
    });
}


export { testPosition };
