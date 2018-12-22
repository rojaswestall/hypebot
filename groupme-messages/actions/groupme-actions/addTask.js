'use strict';

const { graphql } = require('graphql');
const schema = require('../../schema');
const sendMessage = require('../sendMessage');
const getBrotherID = require('../getBrotherID');

const addTaskGM = (chapterDay, brother, description, assigner = null) => {
	var d = new Date();
	// Setting the date to be the next sunday from whatever today's date is
    d.setDate(d.getDate() + (chapterDay + (7 - d.getDay())) % 7);
	getBrotherID(brother).then(id => {
		const query = "mutation { \
    		addTask(id: \"" + id + "\", description: \"" + description + "\", dueDate: \"" + d.getTime() + "\", notes: \"added from groupme\") { \
    			tasks { \
	    			description \
	    			dueDate \
	    			dateAssigned \
	    			notes \
	    		} \
    		} \
    	}";
    	graphql(schema, query).then(result => {
    		// if we wanted we could return some new information?
    		if (assigner) {
    			sendMessage("A new task has been added for Sir " + brother + " by Sir " + assigner + "!");
    		} else {
    			sendMessage("A new task has been added for Sir " + brother + "!");
    		}
        }).catch((error) => {
        	console.log(error);
        	sendMessage("There was an error adding the task 😕 Check your message and try again!");
        });
    }).catch(error => {
    	console.log("there was an error : (", error);
    	sendMessage("I couldn't find Sir " + brother + " in my system 😕 Check your message and try again!");
    });
}

module.exports = addTaskGM;