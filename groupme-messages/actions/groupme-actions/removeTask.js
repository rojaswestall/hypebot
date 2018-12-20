'use strict';

const { graphql } = require('graphql');
const schema = require('../../schema');
const sendMessage = require('../sendMessage');
const getBrotherID = require('../getBrotherID');

const removeTaskGM = (indexes, brother, sender=null) => {
	
	if (sender && sender !== brother) {
		var message = "Sir " + brother + " removed task";
	} else {
		var message = "Removed task";
	}

	if (indexes.length > 1) {
		message = message + "s ";
	} else {
		message = message + " " + indexes[0] + " for Sir " + brother + "!";
	}

	getBrotherID(brother).then(id => {
		for (var i = indexes.length - 1; i >= 0; i--) {
			if (indexes.length === 2) {
				if (i === 0) {
					message = message + " and " + indexes[indexes.length - 1];
				} else {
					message = message + indexes[indexes.length - 1 - i];
				}
			} else if (indexes.length > 1) {
				if (i === 0) {
					message = message + "and " + indexes[indexes.length - 1];
				} else {
					message = message + indexes[indexes.length - 1 - i] + ", ";
				}
			}
			const query = "mutation { \
	    		removeTask(id: \"" + id + "\", index: " + (indexes[i] - 1) + ")  { \
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
	    if (indexes.length > 1) {
	    	message = message + " for Sir " + brother + "!";
	    }
	    sendMessage(message);
	}).catch(error => {
		console.log("there was an error : (", error);
		sendMessage("I couldn't find Sir " + brother + " in my system : ( Check your message and try again!");
	});
}

module.exports = removeTaskGM;