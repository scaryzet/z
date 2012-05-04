module.exports.errorHandler = require('./lib/errorHandler.js');
module.exports.utils = require('./lib/utils.js');

/**
 * @constructor
 * @class Controller
 */
var Controller = function() {
	this.view = {};
};

module.exports.Controller = Controller;
