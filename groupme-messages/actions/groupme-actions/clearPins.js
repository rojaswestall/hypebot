'use strict';

const { graphql } = require('graphql');
const schema = require('../../schema');
const sendMessage = require('../sendMessage');
const getBrotherID = require('../getBrotherID');

const clearPins = () => {

	var first = true;

	getBrotherID("pins").then(id => {

		async function loop() {
			const query = "mutation { \
	    		removeTask(id: \"" + id + "\", index: " + 0 + ")  { \
	    			tasks {\
	    				description \
	    				dueDate \
	    				dateAssigned \
	    			} \
	    		} \
	    	}";
	    	await graphql(schema, query).then(result => {
	    		if (result.errors && first) {
	    			sendMessage("Looks like there were no pins to begin with 🤷🏾‍♂️");
	    		} else if (result.errors) {
	    			sendMessage("Cleared all the pins!");
	    		} else {
	    			if (first) {
	    				first = false;
	    			}
	    			loop();
	    		}
	        }).catch((error) => {
	        	console.log("Something went wrong : (", error);
	        });
	    }

	    loop();

	}).catch(error => {
		console.log("there was an error clearing the pins 😕", error);
		sendMessage("There was an error clearing the pins 😕");
	});
}

module.exports = clearPins;