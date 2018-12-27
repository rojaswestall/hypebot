'use strict';

const { graphql } = require('graphql');
const schema = require('../../schema');
const sendMessage = require('../sendMessage');
const getBrotherID = require('../getBrotherID');

const displayTasks = (brother=null) => {

	var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

	function getFormattedDate(date) {
		var dayArray = date.toLocaleDateString().substring(5).split("-");
		var mon = months[Number(dayArray[0]) - 1];
		var day = dayArray[1];
		return "(" + mon + " " + day + ")";
	}

	if (brother) {
		var message = "Sir " + brother + "'s Tasks: \n";

		const query = "query { \
			viewBrother(sirName: \"" + brother + "\") { \
				id \
				tasks { \
					description \
					dueDate \
				} \
			} \
		}";

		graphql(schema, query).then(result => {
			const tasks = result.data.viewBrother.tasks;

			if (tasks.length == 0) {
				sendMessage("There are no tasks for Sir " + brother + " ☺️");
			} else {
				for (var i = 0; i < tasks.length; i++) {
					var d = new Date(Number(tasks[i].dueDate));
					message = message + "  " + (i+1) + " - " + tasks[i].description + " " + getFormattedDate(d) + "\n";
				}

				sendMessage(message);
			}
		}).catch(error => {
			console.log("there was an error showing tasks for a bro : (", error);
			sendMessage("I couldn't find Sir " + brother + " in my system 😕 Check your message and try again!");
		});
	} else {
		var message = "Chapter tasks:\n"

		const query = "query { \
			listBrothers { \
				id \
				sirName \
				tasks { \
					description \
					dueDate \
				} \
			} \
		}";
		graphql(schema, query).then(result => {
			for (var i = 0; i < result.data.listBrothers.length; i++) {
				var tasks = result.data.listBrothers[i].tasks;
				if (tasks.length !== 0 && result.data.listBrothers[i].sirName !== "pins") {
					message = message + "Sir " + result.data.listBrothers[i].sirName + ":\n";
					for (var j = 0; j < tasks.length; j++) {
						var d = new Date(Number(tasks[j].dueDate));
						message = message + "  " + (j+1) + " - " + tasks[j].description + " " + getFormattedDate(d) + "\n"
					}
				}
			}
			if (message === "Chapter tasks:\n") {
				message = "🎊🎉 The chapter(🔥) doesn't have any tasks! ⚔️🛡";
			}
			sendMessage(message);
		}).catch(error => {
			console.log("there was an error showing tasks for a bro : (", error);
			sendMessage("There was an error 😕 Check your message and try again!");
		});
	}
}

module.exports = displayTasks;