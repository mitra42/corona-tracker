/*
  Main client file for corona-tracker, keep it simple and call stuff from other files !
 */
import React from 'react';
import ReactDOM from 'react-dom';
const debug = require('debug')('mitra.biz/blog-react');
//TODO-CT strip this down to just httptools as used by getLanguage etc
if (!window.DWebTransports) {
  require('@internetarchive/dweb-transports');
}
import { I18nSpan, currentISO, getLanguage } from '../languages/Languages.jsx';

const Home = (props) => (
  <>
    <p><I18nSpan en="_welcome1"/></p>
    <p><I18nSpan en="_welcome2"/></p>
  </>
)
global.coronaTrackerStart = function() {
  getLanguage('en',(err, res) => {
    currentISO("en")
    ReactDOM.render( <Home/>,
      document.getElementById('root')
    );
  })
}
