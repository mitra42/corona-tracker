/* global DwebTransports */
import waterfall from 'async/waterfall';
import React from 'react';

const debug = require('debug')('corona-tracker:languages');
const DwebTransports = require('@internetarchive/dweb-transports');

// utilities - also duplicated in dweb-archivecontroller/Util and ia-components/util
function ObjectFromEntries(arr) { return arr.reduce((res, kv) => (res[kv[0]] = kv[1], res), {}); } // [[ k0, v0],[k1,v1] => {k0:v0, k1:v1}
function ObjectFilter(obj, f) { return ObjectFromEntries(Object.entries(obj).filter(kv => f(kv[0], kv[1]))); }


/*
  Implements a first cut at internationalization (I18n) with language files in json, built by languagebuild.
 */

const languages = { };

// SEE-OTHER-ADDLANGUAGE
const languageConfig = { // Note the flags are dragged out of the Mac Emoji and Symbol viewer
  en: { inEnglish: 'English', inLocal: 'English', flag: '🇬🇧' },
  fr: { inEnglish: 'French', inLocal: 'Française', flag: '🇫🇷' },
  /*
  de: { inEnglish: 'German', inLocal: 'Deutsche ', flag: '🇩🇪' },
  es: { inEnglish: 'Spanish', inLocal: 'Española', flag: '🇪🇸' },
  hi: { inEnglish: 'Hindi', inLocal: 'हिंदी', flag: '🇮🇳' },
  id: { inEnglish: 'Indonesian', inLocal: 'Bahasa', flag: '🇮🇩' },
  it: { inEnglish: 'Italian', inLocal: 'Italiana', flag: '🇮🇹' },
  ja: { inEnglish: 'Japanese', inLocal: '日本語', flag: '🇯🇵' },
  mr: { inEnglish: 'Marathi', inLocal: 'मराठी', flag: '🇮🇳' },
  my: { inEnglish: 'Myanmar', inLocal: 'မြန်မာ', flag: '🇲🇲' },
  pt: { inEnglish: 'Portugese', inLocal: 'Portuguesa', flag: '🇵🇹' },
   */
};
if (!currentISO()) currentISO('en');

/**
 * Fetch a supported language
 * @param lang
 * @param cb(err)
 */
function getLanguage(lang, cb) {
  if (!languageConfig[lang]) {
    cb(new Error('Do not support language: ' + lang));
  } else if (languages[lang]) {
    cb(null); // Already gotten
  } else {
    const url = ['/languages', languageConfig[lang].inEnglish.toLowerCase() + '.json'].join('/');
    DwebTransports.httptools.p_GET(url, {}, (err, languageObj) => {
      if (!err) languages[lang] = languageObj;
      cb(err);
    });
  }
}

/**
 *
 * @param iso if defined will set global.language to this value
 * @returns {*} new state of global.language
 */
function currentISO(iso = undefined) {
  // Note where we store this might change, so use this if want to set or get the code
  if (iso) {
    global.language = iso;
  }
  return global.language;
}

/**
 * Set to a supported language, displaying messages on UI and fetching file if needed
 * @param lang
 */
function setLanguage(lang) {
  //TODO-I18N const olditem = DwebArchive.page.state.item; // Should be an item, not a message

  // Fetch the language file, and while doing so tell the user we are doing so in english and new languages
  DwebArchive.page.setState({
    message: <I18nSpan en="Changing language from">
      {' '}
      {languageConfig[currentISO()].inEnglish}
    </I18nSpan>
  });
  waterfall([
    (cb) => {
      if (languages[lang]) {
        setTimeout(cb, 300);
      } else {
        //TODO-I18N replace this with appropriate code for corona-tracker
        /*
          DwebArchive.page.setState({
            message: <I18nSpan en="Fetching language file for">
              {' '}
              {languageConfig[lang].inEnglish}
            </I18nSpan>
          });
         */
          getLanguage(lang, cb);
        }
      },
      (cb) => {
        //TODO-I18N replace this with appropriate code for corona-tracker
        /*
        DwebArchive.page.setState({
          message: <I18nSpan en="Changing language to">
            {' '}
            {languageConfig[lang].inEnglish}
          </I18nSpan>
        });
        */
      setTimeout(cb, 300);
    },
    (cb) => {
      currentISO(lang);
      //TODO-I18N replace this with appropriate code for corona-tracker
      //DwebArchive.page.setState({ message: <I18nSpan en="Changing language to">{languageConfig[lang].inLocal}</I18nSpan> });
      cb(); // No delay here as will also delay after err message
    },
  ], (err) => {
    if (err) {
      // If fails, tell them
      currentISO('en');
      //TODO-I18N replace this with appropriate code for corona-tracker
      /*
      DwebArchive.page.setState({ message: <I18nSpan en="Failed to set language to">{languageConfig[lang].inEnglish}</I18nSpan> });
       */
    }
    //TODO-I18N replace this with appropriate code for corona-tracker
    // In both cases wait a short while then redisplay old page
    // setTimeout(() => DwebArchive.page.setState({ item: olditem, message: undefined }), 1000);
  });
}

function I18n(messageEnglish) {
  let l = currentISO();
  let s = languages[currentISO()][messageEnglish];
  if (!s) {
    l = 'en';
    s = languages.en[messageEnglish];
    debug('%s missing %s', currentISO(), messageEnglish);
    if (!s) {
      s = messageEnglish; // Render key, its probably right
      debug('en missing %s', messageEnglish);
    }
  }
  return { s, l };
}
function I18nStr(messageEnglish) {
  return I18n(messageEnglish).s;
}
class I18nSpan extends React.Component {
  /**
   * <I18nSpan en="Yes" ... />
   */
  render() {
    const { s, l } = I18n(this.props.en);
    const spanProps = ObjectFilter(this.props, (k, v) => (k !== 'en'));
    return (
      <span lang={l} {...spanProps}>
        {s}
        {this.props.children}
      </span>
    );
  }
}
class I18nIcon extends React.Component {
  /**
   * <I18nIcon
   *    className="iconochive-xxxx"
   *    style={}
   *    iconref=function to use as ref for icon - this is used in NavWebDiv to set a hideable element in the search
   *    en=ENSTRING
   *    xs=ENSTRING
   * >
   *    optional children of span (already translated) and sr-only
   * </I18nIcon>
   */
  render() {
    return (
      <>
        <span className={this.props.className} style={this.props.style} ref={this.props.iconref} aria-hidden="true" />
        <I18nSpan className="sr-only" en={this.props.en}>{this.props.children}</I18nSpan>
        {!this.props.xs ? null
          : (
            <>
        &nbsp;
              <I18nSpan className="hidden-xs-span" en={this.props.xs} />
            </>
          )
      }
      </>
    );
  }
}

export {
  languages, languageConfig, currentISO, getLanguage, I18nSpan, setLanguage, I18n, I18nStr, I18nIcon
};
