const homeHandler = require('./home');
const catHandler = require('./cat');
const breedHandler = require('./breed');
const staticFiles = require('./static-files');
module.exports = [homeHandler, catHandler, breedHandler, staticFiles];