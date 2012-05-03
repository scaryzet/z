var utils = require('./utils.js');

/**
 * @class
 * @constructor
 */
var ErrorRenderer = function() {
	// If set, this path prefix will be cut from file paths for better readability.
	this._basePath = null;

	this.borderColor = '#b0b0b0';
	this.bgColor = '#f6f6f6';
	this.messageColor = '#000';
	this.hilightColor = '#0063be';
	this.lightColor = '#606060';

	this.render = function(data) {
		// data: { title, message, *trace }

		if (data.trace) {
			if (this._basePath) {
				// Cut path prefix from file paths within the trace.

				var re1 = new RegExp('^' + utils.escapeRegex(this._basePath), 'i');
				var r1 = '';

				data.trace.forEach(function(item) {
					if (item.file)
						item.file = item.file.replace(/\\/g, '/').replace(re1, r1);
				});
			}

			// Hilight file names.

			var re2 = /([^/\\\\]+)$/i;
			var r2 = '<b style="color: ' + this.hilightColor + ';">$1</b>';

			data.trace.forEach(function(item) {
				if (item.file)
					item.file = item.file.replace(/\\/g, '/').replace(re2, r2);
			});

			// TODO: Unshift the first item for the top message.
		}

		var html = '<div style="padding: 5px; font-family: tahoma, verdana, sans-serif; color: #202020;">'
			+ '<div style="padding: 10px; border: ' + this.borderColor + ' 1px solid;'
			+ ' background-color: ' + this.bgColor + '; border-radius: 7px; ">'
			+ '<div style="font-size: 22px;">'
			+ utils.escape(data.title) + ': '
			+ '<span style="color: ' + this.messageColor + ';">'
			+ utils.escape(data.message)
			+ '</span>'
			+ '</div>'
			+ '<div style="padding: 10px 0 3px 0; font-size: 18px; color: #707070;">'
			+ 'someFile.js'
			+ ', line <span style="font-weight: bold; color: ' + this.hilightColor + ';">'
			+ 123
			+ '</span>'
			+ '</div>';

		if(data.trace) {
			html += '<div style="max-height: 500px; overflow: auto;'
				+ ' margin: 15px 0 0 0; padding: 0 10px; font-size: 18px;'
				+ ' background-color: rgba(0, 0, 0, 0.045); border-radius: 5px;">';

			var lightColor = this.lightColor;

			data.trace.forEach(function(item) {
				// item: { what, *file, *line, *column }

				html += '<div style="margin: 10px 0;">'
					+ '<span style="color: ' + lightColor + ';">&rarr;</span> '
					+ utils.escape(item.what);

				if(item.file) {
					html += '<div style="margin: 3px 0 0 40px; font-size: 14px; color: ' + lightColor + ';">'
						+ item.file;

					if (item.line) {
						html += ', line <span style="font-weight: bold; color: #0063be;">'
							+ item.line
							+ '</span>';
					}

					if (item.column) {
						html += ', column <span style="font-weight: bold; color: #0063be;">'
							+ item.column
							+ '</span>';
					}

					html += '</div>';
				}

				html += '</div>';
			});

			html += '</div>';
		}

		html += '</div></div>';

		return html;
	};

	this.setBasePath = function(path) {
		this._basePath = path.replace(/\\/g, '/').replace(/\/?$/, '/');
	};
};

module.exports = new ErrorRenderer();
