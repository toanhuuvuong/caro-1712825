const systemConstant = require('../config/constant');
const genericDAO = require('./generic');

const collectionName = systemConstant.dbTableName.MATCH;

module.exports = {
	update: function(query, newValue) {
		return genericDAO.update(collectionName, query, newValue);
	},
	insertOne: function(newValue) {
		return genericDAO.insertOne(collectionName, newValue);
	},
	deleteOne: function(query) {
		return genericDAO.deleteOne(collectionName, query);
	},
	find: function(query, options = {}) {
		return genericDAO.find(collectionName, query, options);
	}
};