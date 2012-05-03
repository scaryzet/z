/**
 * @class
 * @constructor
 */
var ErrorHandler = function() {
	this._errorRenderer = require('./errorRenderer.js');
	this._errorRenderer.bgColor = '#fcf3f2';
	this._errorRenderer.borderColor = '#ff828c';
	this._errorRenderer.messageColor = '#ba3030';
//	this._errorRenderer.bgColor = '#fffaf0';
//	this._errorRenderer.borderColor = '#f96';
//	this._errorRenderer.messageColor = '#fa5000';

	this._parseErrorStack = function(stack) {
		var items = [];
		var lines = stack.match(/^\s+at.*$/mg);

		lines.forEach(function(line) {
			line = line.replace(/^\s*at\s*/, '');
			var m = line.match(/^(.*?)\s+\(([^)]+):(\d+):(\d+)\)$/);

			if (!m) {
				m = line.match(/^(.*?):(\d+):(\d+)$/);

				if (m)
					m.splice(1, 0, '[unknown]');
			}

			if (m) {
				// m: [ match, what, file, line, column ]
				items.push({
					what: m[1],
					file: m[2],
					line: m[3],
					column: m[4]
				});
			} else {
				items.push({
					what: line
				});
			}
		});

		return items;
	};

	this.handle = function(err, req, res, next) {
		if (err.status)
			res.statusCode = err.status;

		if (res.statusCode < 400)
			res.statusCode = 500;

		res.setHeader('Content-Type', 'text/html; charset=utf-8');

		var html;

		if (!this._errorRenderer) {
			html = 'Failed to render error - error renderer is not set.';
		} else {
			html = this._errorRenderer.render({
				title: err.name || 'Error',
				message: err.message || '[no description]',
				trace: err.stack ? this._parseErrorStack(err.stack) : null
			});
		}

		res.end(html);
	};

	this.setBasePath = function(path) {
		this._errorRenderer.setBasePath(path);
	};
};

module.exports = new ErrorHandler();
