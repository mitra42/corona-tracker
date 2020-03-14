# corona-tracker

The core idea is a simple, viral, way to track contacts. 

This idea isn't even half-baked yet, it may be a terrible idea, 
or someone else might be doing it, or there may be a gotcha I've missed. 

Critique is very welcome - mitra@mitra.biz or post to an issue in Git.

NOTE - THIS IS GOING TO GET AN UPDATE AFTER THE MEETING WITH Ric ESP RELATING TO LOCATION DAA

### How it works 
There are two versions of the thinking currently. I'm leaning to option B

#### Option A "check-in"

Once its up and running, a participant might: 
* enter an event, a store or a train carriage.
* see a visibly posted sign with a QR code
* scan that code into their browser

No further action is required, but the page offers options to:
* Download a QR code to post somewhere else
* Register - if a first time user - can enter email (or SMS) for notifications.
* Check for anywhere else you've been in case of reports

If there is no QR code, we'll suggest nearby ones (maybe in same business);
and if there are node we'll just use location, 
and suggest they printout a QR code, or suggest it to the business/venue.

#### Option B "continual tracking"

* A participant opens a webpage
* The security dialog asks if they want to share contact info
* As long as the web page is running, it sends location info if 
  - the person has moved some reasonable distance - maybe 10 meters ?
  - they have been at that new location for at least 5 minutes
  - it sends time they left the prev location, and time arrived at new one

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

### Technology

#### QR version
QR code gets a URL - URL contains a random number for the code. 
Location is tracked at same time, giving us two ways to get a place.

#### Location tracking version
A web page runs a Javascript loop, which fetches location from the browser.
It runs a quick algorithm to see if its a "new" location, and if so sends a single
packet to the backend. 

#### Both
We can use registration, cookies, 
or browser fingerprinting to identify a person. 
We encourage registration to allow for notifications, but don't require it
in order to reduce privacy concerns (especially in oppressive regimes)

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

Back end could either be
* sqlite, then scaling to another SQL DB.
* simple text file since 90% is adding something to a list - 
  but as it scales searching this could bring scaling issues.

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

