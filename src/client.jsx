/*
  Main client file for corona-tracker, keep it simple and call stuff from other files !

  This is just a framework currently (15Mar), being used for experiments.

 */
/* global coronaTrackerStart */
import React from 'react';
import ReactDOM from 'react-dom';
import { I18nSpan, currentISO, getLanguage } from '../languages/Languages';
// import { testPosition } from './browserlib';
process.env.DEBUG = 'corona-tracker:*';
// const debug = require('debug')('mitra.biz/blog-react');
// TODO-CT strip this down to just httptools as used by getLanguage etc
// const DwebTransports = require('@internetarchive/dweb-transports');

// TODO-I18N this needs to display the flag dropdown - steal it from dweb-archive
const Home = () => (
  <>
    <h1><I18nSpan en="_welcome1" /></h1>
    <p><I18nSpan en="_welcome2" /></p>
    <p>foo At the moment its just a data portal where data can be accessed in different formats.</p>
    <p>
      Please see our
      &nbsp;<a href="https://github.com/mitra42/corona-tracker">github repo</a>&nbsp;
      for a more frequently updated explanation
    </p>
    <h4>Quick links to data sets</h4>
    <table>
      <tbody>
        {
          [
            { name: 'Israel', key: 'israel' },
            { name: 'Korea 1', key: 'korea1' },
            { name: 'Korea 2', key: 'korea2' },
            { name: 'Diamond Princess tour of Taiwan', key: 'diamondtaiwan' },
          ].map(dataset => (
            <tr key={dataset.key}>
              <td>
                {dataset.name}
              </td>
              { [
                { name: 'Original', key: 'original' },
                { name: 'Internal', key: 'common' },
                { name: 'Google Takeout', key: 'takeout' },
                { name: 'GPX', key: 'gpx' },
                { name: 'KML', key: 'kml' },
              ].map(outp => (
                <td key={outp.key}>
                  <a href={`/data/${dataset.key}?output=${outp.key}`}>
                    {outp.name}
                  </a>
                </td>
              )) }
            </tr>
          ))
        }
      </tbody>
    </table>
  </>
);

// eslint-disable-next-line func-names, no-global-assign
window.coronaTrackerStart = function () {
  // TODO-I18N check for browser parameters for language
  getLanguage('en', () => {
    currentISO('en');
    // testPosition((pos)=> {}), //TODO-CT just for testing
    ReactDOM.render(<Home />,
      document.getElementById('root'));
  });
};
