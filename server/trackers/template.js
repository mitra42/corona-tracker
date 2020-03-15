/*
  This file can be copied and then filled out for each tracker
 */

/*
Common data structures used are:
  coordinates - where; see https://developer.mozilla.org/en-US/docs/Web/API/GeolocationCoordinates
  position - where + when; see https://developer.mozilla.org/en-US/docs/Web/API/GeolocationPosition
  timeSpan - {from, till} where from and till are https://developer.mozilla.org/en-US/docs/Web/API/DOMTimeStamp
  user - TODO define user structure - probably just their id
*/

/*
 In general any of the parameters should be able to be an array,
 Where possible a parameter could be null, in which case it would return all possible results.
 e.g. searchUserPositions(null, coordinates, {from: now, till: now-1hour}) might return all users who were at these coordinates in the last hour.
 the plugin should iterate over the parameters in the manner most efficient for the API (for example it might be able to
 provide an array of coordinates to search, but have to login separately for each user.

 TODO A standard set of iterators will be provided for APIs that cant support an array.
*/

function searchUserPositions({ user, coordinates, timeSpan }) {
  returns any data for the user for the timeSpan as an array of { user, position }
}

// TODO just an idea, is this concept common enough across APIs to warrant a defined helper function
function getCredentials({ user }) {
  returns credentials information specific to the user and the plugin,
    an API will be provided to allow these functions to store persistently (e.g. in the sqlite)
}

export { searchUserPositions };
