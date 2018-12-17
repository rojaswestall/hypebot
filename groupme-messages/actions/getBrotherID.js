'use strict';

const { graphql } = require('graphql');
const schema = require('../schema');

const getBrotherId = (sirName) => {
	return new Promise(function(resolve, reject) {
		const query = "query { \
			viewBrother(sirName: \"" + sirName + "\") { \
				id \
			} \
		}";
		graphql(schema, query).then(result => {
			const id = result.data.viewBrother.id;
			resolve(id);
		}).catch(error => {
			reject(error);
		});
	});
};

module.exports = getBrotherId;