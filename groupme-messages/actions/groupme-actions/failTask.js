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
		message = message + " task " + indexes[0] + " 😕";
	}
	getBrotherID(brother).then(id => {

		async function loop(i, loopMessage) {
			if (indexes.length === 2) {
				if (i === 0) {
					loopMessage = loopMessage + " and " + indexes[indexes.length - 1] + " 😕";
				} else {
					loopMessage = loopMessage + indexes[indexes.length - 1 - i];
				}
			} else if (indexes.length > 1) {
				if (i === 0) {
					loopMessage = loopMessage + "and " + indexes[indexes.length - 1] + " 😕";
				} else {
					loopMessage = loopMessage + indexes[indexes.length - 1 - i] + ", ";
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
	    	await graphql(schema, query).then(result => {
	    		if (result.errors) {
	    			sendMessage("There was an error finding task " + indexes[i] + " 😕 Please make sure it's in the system. Try show tasks");
	    		} else if (i === 0) {
	    			sendMessage(loopMessage);
	    		} else {
	    			loop(i - 1, loopMessage);
	    		}
	        }).catch((error) => {
	        	console.log("Something went wrong : (", error);
	        });
		}

		loop(indexes.length - 1, message);

	}).catch(error => {
		console.log("there was an error : (", error);
		sendMessage("I couldn't find Sir " + brother + " in my system 😕 Check your message and try again!");
	});
}

module.exports = failTaskGM;