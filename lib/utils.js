module.exports.escape = function(string) {
	return String(string)
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
};

module.exports.escapeRegex = function(string) {
	return String(string).replace(/([\^\$\(\)\[\]\{\}\*\.\+\?\|\\])/g, "\\$1");
};
