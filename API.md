# Corona Virus API

This is a very drafty document, first looking at what APIs are needed, then defining them.

## API requirements

This, and probably each of the APIs will change, but each change will - at some point
need careful management.

- URL definition - how the client interacts with the server
- Database schema - what data is stored
- Database query API - the interface to a layer sitting on top of the data, so that data 
  storage can be changed without changing the code that uses it. 
- Local Storage - how data stored on the browser, possibly with its own data query API
- Interface to location tracking data via some plugins - see /server/tracers/template.js
- what else?

## URI definition

Straw-person idea, will edit as first cut is built

#### /checkin?... pinged when a user should be recorded
- loc  Location in the format browsers provide it
- arr  Time arrived this location
- dep  Time left this location
- userid Unique random id of person

#### /register?... voluntarily record information about a user
- userid    Unique random id of person
- email
- phone     Phone number in international format
- facebook  Facebook id
- whatsapp  Whatsapp id

#### /consents?... Information about what I consent to. 
This would align with any privacy statement, consent can be withdrawn at any time. 

## LOCATION PLUGINS

We need a consistent API that can be used with plugins 
