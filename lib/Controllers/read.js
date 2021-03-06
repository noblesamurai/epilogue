var util = require('util');
var Base = require('./base');

var Read = function(args) {
	Read.super_.call(this, args);
};

util.inherits(Read, Base);

Read.prototype.action = 'read';
Read.prototype.method = 'get';
Read.prototype.plurality = 'singular';

Read.prototype.fetch = function(req, res, context) {

	var model = this.model;
	var endpoint = this.endpoint;

	var criteria = {};

	endpoint.attributes.forEach(function(attribute) {
		criteria[attribute] = req.params[attribute];
	});

	var options = {};
	
	if (Object.keys(criteria).length) {
		options.where = criteria;
	}

	model.find(options)
		.success(function(instance) {
			if (!instance) {
				res.json(404, { error: "not found" });
				return context.stop();
			} else {
				context.instance = instance;
				return context.continue();
			}
		})
		.error(function(err) {
			res.json(500, { error: err });
			return context.stop();
		});
};

module.exports = Read;

