#/languages
This directory is a copy from dweb-archive where its used to 
internationalize the UI.

## To add a string for developing

* Add it to `./google/_.txt` at the bottom
* Add same thing to `./google/english.txt` at the bottom - the line count must match
* If its a long string, you can pick a key (like `welcome1`)
* Make sure that in `./languagebuild.js` 
  the line `thisbuild = ['english'];` is uncommented
* run `./languagebuild.js`
* Include it either in one of the following ways 
  to include a <span> or a string.
```
<I18nSpan en="My new string" />
<I18nStr en="My new string" />
```

## To compile the languages

* On https://translate.google.com
* paste in english.txt
* translate to each language
* Cut and paste the result to files like `./google/french.txt`
* Comment out the line in `thisbuild = ['english'];` in `./languagebuild.js`
* run `./languagebuild.js`

## To improve translations

Edit in the files like `./manual/french.json`, 
use the same key as in `./json/french.json`

## To add a language

* Perform the translation in `compile` above, and create a new file like `./google/basque.txt`
* Create the file `manual/basque.json` containing just `{ }`
* Edit the structure `languagesconfig` in `./Languages.jsx`
* Edit the array `fulllanguages` in `./languagebuild.js`
