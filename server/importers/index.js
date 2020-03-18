// ADD-IMPORTER - add line here to import
// Data set from israel - its json exported from arcgis
const israel = require('./israel');
// Data set from Korea - its a .js file so currently just "required" but that means no live updating see https://github.com/mitra42/corona-tracker/issues/18
const korea1 = require('./korea1');
// Data set from Korea - its a CSV file importer could probably be genericized as it starts with parameters in top of CSV https://github.com/mitra42/corona-tracker/issues/25
const korea2 = require('./korea2');
// Data set from Diamond Princess visit to Taiwan
// its KML and importer could probably be genericized https://github.com/mitra42/corona-tracker/issues/26
const diamondtaiwan = require('./diamondtaiwan');

// ADD-IMPORTER - add import name here
exports = module.exports = { diamondtaiwan, israel, korea1, korea2 };
