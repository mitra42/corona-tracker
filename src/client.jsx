/*
  Main client file for corona-tracker, keep it simple and call stuff from other files !

  This is just a framework currently (15Mar), being used for experiments.

 */
process.env.DEBUG="corona-tracker:*";
import React from 'react';
import ReactDOM from 'react-dom';
const debug = require('debug')('mitra.biz/blog-react');
//TODO-CT strip this down to just httptools as used by getLanguage etc
if (!window.DWebTransports) {
  require('@internetarchive/dweb-transports');
}
import { I18nSpan, currentISO, getLanguage } from '../languages/Languages.jsx';
import { testPosition } from "./browserlib";

//TODO-I18N this needs to display the flag dropdown - steal it from dweb-archive
const Home = (props) => (
  <>
    <p><I18nSpan en="_welcome1"/></p>
    <p><I18nSpan en="_welcome2"/></p>
  </>
)

global.coronaTrackerStart = function() {
  //TODO-I18N check for browser parameters for language
  getLanguage('en',(err, res) => {
    currentISO("en")
    testPosition((pos)=> {}), //TODO-CT just for testing
    ReactDOM.render( <Home/>,
      document.getElementById('root')
    );
  })
}
