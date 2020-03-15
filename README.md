# corona-tracker

The core idea is a simple, viral, way to track contacts. 

This idea is still half-baked, it may be a terrible idea, 
or someone else might be doing it, or there may be a gotcha we've missed. 

Critique is very welcome - post to an issue in Git.

### How it works 

We will collect data by a variety of means, these will include:

* interfacing to tracking data collected by, for example, exercise trackers.
* a webpage that can be kept open,
* (possibly) QR codes that could be scanned at a particular venue. 

#### APIs to trackers

Our prefered tracking method is to tie into something already doing 
the tracking via its API. 
In particular this handles some of the issues around battery consumption
of an always-on web page using the location chips. 

TODO More details to come here

#### Web page loction tracking

* A participant opens a webpage
* The security dialog asks if they want to share contact info
* As long as the web page is running, it sends location info if 
  - the person has moved some reasonable distance - maybe 10 meters ?
  - they have been at that new location for at least 5 minutes
  - it sends time they left the prev location, and time arrived at new one

#### QR Code checkins

The is probably the least useful way, but might be an entry point or
server the specific need of getting all the people (participants and non participants) 
at an event. 

Once its up and running, a participant might: 
* enter an event, a store or a train carriage.
* see a visibly posted sign with a QR code
* scan that code into their browser


#### When someone is positive

Another link should be used if you test positive.

At this point the system figures out:
* where you've been
* who else was there (after you) 
* it sends them notifications. 

#### Requirements 

Some of these may be obvious from above or below, but some still need baking in ...

* Trivially easy to use
* Achieves appropriate balance between respecting privacy and supporting the fight on the virus
* Supports contact tracking when the person who tests positive is not on the system (hard). 
* Can spread easily, virally. 

### Getting it out there.

The QR version is intended to be viral - i.e.
* as a business owner, transit driver, meeting organizer, 
  you can print out the QR code - which attracts attention of users
* as a user, you can click even if the business has no visible QR code
* Its useful even if its only one event with 50 people. 

The location-tracker version doesnt have the virality, but its easy of participation
and saturation of Covid news may make it easy to get out there. 

The API based versions have the advantage of using apps people probably already have.

### Technology

#### API version
The user accesses the website, identifies which exervise trackers they have, 
and can follow links to install one if they have none. 
After that point the system will access the data via the tracker's API.
At worst case we'd copy the data from the tracker's API and pre-process for searching.

#### Location tracking version
A web page runs a Javascript loop, which fetches location from the browser.
It runs a quick algorithm to see if its a "new" location, and if so sends a single
packet to the backend. 

#### QR version
QR code gets a URL - URL contains a random number for the code. 
Location is tracked at same time, giving us two ways to get a place.

#### Both

At first use, we generate a unique id, 
and either store that in browser local storage or use a cookie.

The customer can optionally register, and add notification information. 
This is fully optional to allow for privacy concerns that may vary from place to place.

If the person isn't registered, then they can visit the webpage to get updates.

Matching contacts is a bit harder, can start naive 
and add some AI once we find someone once we find people who know what they are 
doing. 

#### Challenges

I think the core tech is relatively easy, 
but I see (at least) the following challenges, 
and at this point I'm certain I've missed some.

* What the algorithm is for an "overlap" i.e. person A was in this location, 
  person B came later.
* Handling unregistered users (cookie &/or browser fingerprinting)
* Human factors - like how to word notifications
* I'm Not sure how well QR scanning works on iPhones,
  may need to go to a bookmark then scan
* If it scales enough to be useful, the server side process has to be cheap,
  and scalable. 
* Should be internationalized - would probably get help with this. 
* Legal and privacy disclaimers (see "Privacy" below)

#### Technology choices

I think this starts off as a simple React website, 
(I chose React simply because I know it, and we don't have time to go through 
a learning cycle). 
Web components would be possible if someone has the skills.

Because of potential issues getting it to scan QR codes on iPhone it could
possibly go to a React-Native app, but I've never used that and I'm not sure
how slow the approval process is to get it up and running. 
I also don't know if you can put a download on the site to do this. 

For stored data, the back end could either be
* sqlite, then scaling to another SQL DB.
* simple text file since 90% is adding something to a list - 
  but as it scales searching this could bring scaling issues.

Ideally we wont have to store much data, because it will scale through apps 
that themselves hold data. 

#### Money

In terms of cost, I think we can cover any initial costs by volunteers
and use of servers etc we already have access to.  
If it scales that could be an issue.

Zero cost to users, it needs volume.

I'd like to keep this clean - no selling of data to anyone, 
and ideally no ads etc (display public health info and links instead of ads)

### Skills and Resources needed

* UI Design - who ?
* UI coding - React - I could do initial part if dont have anyone
* App coding - React-native ? - need a volunteer.
* Server coding - Node - I could do.
* Server algorithms - Trivial to start, then AI (approach Alan)
* Server hosting - will ask IA to start, then possibly scale to AWS (approach Dan A)
* Getting the word out - who ?

#### Privacy

Privacy is going to be super important to this 
- both to do the right thing and not support invasive surveillance and 
- because bad privacy will cause many people to avoid it. 

We will need 
* a strong set of privacy rules - what we will and won't do with the data
* a privacy policy that puts into plain language those rules
* translations of the above
* some kind of oversight group that checks

Note there is no money involved, no plan to sell data so the balance is between:
- keeping people's private lives private
- doing whatever we can to support people trying to slow spread of the virus.

## Installation

To install the Proof Of Concept (not even close to a MVP!). 
Assuming you have git and node.
```
git clone "https://github.com/mitra42/corona-tracker"
cd corona-tracker
yarn install
cd src 
node ./Main.js
open https://localhost:5000 # Should open in your browser
```

## Development cycle
This will be improved, and may break, but at this early stage ... 

Make some edits then ....
```
cd corona-tracker/languages
./languagebuild.js
cd ../src
./webpack --mode development
```
Then reload the browser window
 
