'use strict';

const { graphql } = require('graphql');
const schema = require('../../schema');
const sendMessage = require('../sendMessage');
const getBrotherID = require('../getBrotherID');

const displayTasksGM = () => {

	var message = "Pins: \n";

	const query = "query { \
		viewBrother(sirName: \"pins\") { \
			id \
			tasks { \
				description \
			} \
		} \
	}";

	graphql(schema, query).then(result => {
		const tasks = result.data.viewBrother.tasks;

		if (tasks.length == 0) {
			sendMessage("There are no pins 🤷🏾‍♂️");
		} else {
			for (var i = 0; i < tasks.length; i++) {
				message = message + "  " + (i+1) + " - " + tasks[i].description + "\n";
			}

			sendMessage(message);
		}
	}).catch(error => {
		console.log("there was an error showing pins", error);
	});
}

module.exports = displayTasksGM;