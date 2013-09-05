var _ = require('underscore');
var util = require('util');

var Base = require('./base');

var Update = function(args) {
	Update.super_.call(this, args);
};

util.inherits(Update, Base);

Update.prototype.action = 'delete';
Update.prototype.method = 'delete';
Update.prototype.plurality = 'singular';

Update.prototype.fetch = function(req, res, context) {

	var model = this.model;
	var endpoint = this.endpoint;

	criteria = context.criteria;

	endpoint.attributes.forEach(function(attribute) {
		criteria[attribute] = req.params[attribute];
	});

	model.find({ where: criteria })
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

Update.prototype.write = function(req, res, context) {

	var instance = context.instance;

	instance.destroy(instance)
		.success(function(instance) {
			context.instance = instance;
			return context.continue();
		})
		.error(function(err) {
			res.json(500, { error: err });
			return context.stop();
		});
};

module.exports = Update;

