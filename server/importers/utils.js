//const debug = require('corona-tracker:importers-utils');

// Converting various common formats (uncommon formats are in individual importers)
// Currently we use an integer which is latitude or longitude * 10^7
function commonLatLngFromFloatString(fl) {
  return Math.round(parseFloat(fl) * 1e7);
}
// Currently we use milliseconds since (WHEN?)
function commonTimeFromMS(ms) {
  return ms;
}


/** Class BoundingBox - stolen from 2019-nCov.meta.js
 *
 *  Given lat/lng pairs, this class populates a bounding box that contains all points.
 *  Returns {
 *    function insert(lat, lng)  Add a point, and expand bounding box to match
 *    function get() => { top, left, right, bottom }
 *  }
 */

function BoundingBox() {
  let top;
  let left;
  let right;
  let bottom;
  return {
    insert(lat, lng) {
      if (top === undefined || lat > top) { top = lat; }
      if (bottom === undefined || lat < bottom) { bottom = lat; }
      if (right === undefined || lng > right) { right = lng; }
      if (left === undefined || lng < left) { left = lng; }
    },

    get() {
      return {
        top, left, right, bottom
      };
    },
  };
};

/* TODO needs test framework
function testBoundingBox() {
  const bb = BoundingBox();
  bb.insert(1, 2);
  bb.insert(-3, -4);
  EXPECT_EQ({
    top: 1,
    left: -4,
    right: 2,
    bottom: -3,
  }, bb.get());
}
*/

function boundingBoxFromCommonArray(oo) {
  const box = BoundingBox();
  oo.forEach(o => box.insert(o.lat, o.lng));
  return box.get();
}
exports = module.exports = {
  BoundingBox, boundingBoxFromCommonArray, commonLatLngFromFloatString, commonTimeFromMS
}
