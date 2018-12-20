'use strict';

const { graphql } = require('graphql');
const schema = require('../../schema');
const sendMessage = require('../sendMessage');
const getBrotherID = require('../getBrotherID');

const failTaskGM = (indexes, brother) => {

	var message = "Sir " + brother + " failed";
	if (indexes.length > 1) {
		message = message + " tasks ";
	} else {
		message = message + " task " + indexes[0] + "!";
	}
	getBrotherID(brother).then(id => {
		for (var i = indexes.length - 1; i >= 0; i--) {
			if (indexes.length === 2) {
				if (i === 0) {
					message = message + " and " + indexes[indexes.length - 1] + "!";
				} else {
					message = message + indexes[indexes.length - 1 - i];
				}
			} else if (indexes.length > 1) {
				if (i === 0) {
					message = message + "and " + indexes[indexes.length - 1] + "!";
				} else {
					message = message + indexes[indexes.length - 1 - i] + ", ";
				}
			}
			const query = "mutation { \
	    		failTask(id: \"" + id + "\", index: " + (indexes[i] - 1) + ")  { \
	    			tasks {\
	    				description \
	    				dueDate \
	    				dateAssigned \
	    			} \
	    		} \
	    	}";
	    	graphql(schema, query).then(result => {			        	
	        	console.log(result);
	        }).catch((error) => {
	        	console.log(error);
	        });
	    }
	    sendMessage(message);
	}).catch(error => {
		console.log("there was an error : (", error);
		sendMessage("I couldn't find Sir " + brother + " in my system : ( Check your message and try again!");
	});
}

module.exports = failTaskGM;