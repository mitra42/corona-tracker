# corona-tracker - DEAD PROJECT

**We have dropped this project - feel free to use code but its not maintained**

Note the idea is evolving rapidly, faster than I can get around to update this README
so please check for updates! 

The data converter is now live on https://c19.mitra.biz/ 

The core idea is a simple, viral, way to improve tracking contacts. 

This involves comparing datasets of where infected people have been to tracks of users. 

We are exploring a variety of ways to work with user location data, 
but principle among them at the moment is to work with the free fitness trackers that work on most smartphones - e.g. Strava.

A key missing component has been data sets, we've found a few, all in different formats,
so as part of the project we are building an interchange to make any dataset we can find
available in multiple formats so that others can use it.  
Links to demonstrate are on http://c19.mitra.biz/
and at this point it can output in Google Takeout, GPX, and KML.

Critique of any part of this is very welcome - please post to an issue in 
the [https://github.com/mitra42/corona-tracker](Git repo).

#### APIs to trackers

Our prefered tracking method is to tie into something, like an exercise tracking app that is
already doing the tracking via its API. 

We are starting with Strava because its free, and widely used, but the intention is to
work with any of them which have a decent API. 
We are also looking to open conversations with these companies to figure out how to 
collaborate. 

In particular this handles some of the issues around battery consumption
of an always-on web page using the location chips. 

It may also allow us to offload the contact matching to the APIs of the tracker companies, 
by uploading patient traces and looking for overlaps. 

#### Patient data

We are starting with publically available sources, and then building on the work of the pandemic.events
team converting that via a common internal format into what formats people need.
We see this functionality as generally useful to other teams working on similar problems
and welcome such teams to collaborate. 

#### Requirements 

Some of these may be obvious from above or below, but some still need baking in ...

* Trivially easy to use
* Achieves appropriate balance between respecting privacy and supporting the fight on the virus
* Supports contact tracking when the person who tests positive is not on the system (hard). 
* Can spread easily, virally. 

### Getting it out there.

The tracker app API based versions have the advantage of using apps people probably 
already have, we need to figure out how to message this so that people start using it, 
and sharing their traces. 

### Technology

#### UX 

This design is still fairly fuzzy as we've focused till now on the underlying toolset.

The user accesses the website, identifies which exervise trackers they have, 
and can follow links to install one if they have none. 

After that point the system will access the data via the tracker's API, 
typically using OAUTH or similar to grant permission. 

At worst case we'd copy the data from the tracker's API and pre-process for searching.

Wherever possible we will avoid storing data, because of the privacy implications. 

At first use, we generate a unique id, 
and either store that in browser local storage or use a cookie.

The customer can optionally register, and add notification information. 
This is fully optional to allow for privacy concerns that may vary from place to place.

If the person isn't registered, then they can visit the webpage to get updates.

Matching contacts is a bit harder, we can start naive 
and add some AI once we find someone once we find people who know the epidemiology.

#### Challenges

I think the core tech is relatively easy, 
but I see (at least) the following challenges, 
and at this point I'm certain I've missed some.

* What the algorithm is for an "overlap" i.e. person A was in this location, 
  person B came later.
* Handling unregistered users.
* Human factors - like how to word notifications
* If it scales enough to be useful, the server side process has to be cheap,
  and scalable. 
* Should be internationalized - would probably get help with this. 
* Legal and privacy disclaimers (see "Privacy" below)

#### Technology choices

I think this starts off as a simple React website, 

* (I chose React simply because I know it, and we don't have time to go through 
a learning cycle). 
* Web components would be possible if someone has the skills.

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

It has to be zero cost to users, in order to generate the volume.

We would like to keep this very clean - i.e. no selling of data to anyonem, 
and no ads etc (display public health info and links instead of ads)

### Skills and Resources needed

* UI Design - who ?
* UI coding - React - Mitra can do initial part if dont have anyone
* App coding (if we need one) - React-native ? - need a volunteer.
* Server coding - Node - Mitra could do.
* API building - Dan 
* Server algorithms - Trivial to start, then AI (Alan)
* Server hosting - will ask IA to start, then possibly scale to AWS (Dan)
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
git clone "https://github.com/mitra42/corona-tracker.git"
cd corona-tracker
PORT=80 USESUPERVISOR=1 RUNUSER=mitra ./install.sh

# Apologies, but it requires root at the moment .... if you are happy to run on
# A non root port, and have already installed node, yarn, 
cd corona-tracker
yarn install
cd server 
./build.sh
node ./Main.js

# To open the browser based app - still very early explorations
open https://localhost:5000 

# To run a data converter for example to get the Korea2 dataset in Google Takeout format
open https://localhost:5000/data/korea2?output=takeout
```

## Development cycle
This will be improved, and may break, but at this early stage ... 

Make some edits then ....
```
# To rebuild any language strings
cd corona-tracker/languages
./languagebuild.js

# To rebuild the UI
cd corona-tracker
webpack --mode development

# If you've changed any batch processing on the server.
cd corona-tracker/server
./build.sh
```
Then reload the browser window
 
