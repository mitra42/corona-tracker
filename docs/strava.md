# Use of Strava to get information

See https://developers.strava.com/ for strave developer docs.

Strava uses OAUTH2 to access API

A recorded thing is an activity.  Each activity has a number of streams associated with it.  Retriving a list of geocodes and 
and corresponding codes can be done by retrieving the **time** and **latlng** streams.  For example: 
https://www.strava.com/api/v3/activities/{ACTIVITY_ID}/streams?keys=time,latlng&key_by_type=true

To get the start time (and other meta information) for an activity: https://www.strava.com/api/v3/activities/{ACTIVITY_ID} and use the 
**start_time** field.

[Note that in my test the **elapsed_time** in the activity is different from the number of seconds in the stream.  This post
https://groups.google.com/forum/#!msg/strava-api/aPOiKCtHv6o/HC6-TJekG0EJ;context-place=forum/strava-api seems to imply
that the raw stream data is accurate]


