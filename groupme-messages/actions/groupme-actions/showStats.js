'use strict';

const { graphql } = require('graphql');
const schema = require('../../schema');
const sendMessage = require('../sendMessage');
const getBrotherID = require('../getBrotherID');

const showStatsGM = (brother=null) => {

	function displayStats(broData) {
		var str = "";
		str = str + "  Completed on time - " + Math.round(100 * (broData.tasksCompleted / (broData.totalTasks - broData.currentTasksNum))) + " percent\n";
		str = str + "  Total completed - " + broData.tasksCompleted + "\n";
		str = str + "  Total failed or late - " + broData.tasksFailed + "\n";
		str = str + "  Current # of tasks - " + broData.currentTasksNum + "\n";
		return str;
	}

	if (brother) {
		var message = "Sir " + brother + "'s Stats: \n";

		const query = "query { \
			viewBrother(sirName: \"" + brother + "\") { \
				id \
				totalTasks \
				tasksCompleted \
				tasksFailed \
				currentTasksNum \
			} \
		}";

		graphql(schema, query).then(result => {
			var messageStats = displayStats(result.data.viewBrother);
			sendMessage(message + messageStats);
		}).catch(error => {
			console.log("there was an error showing stats for a bro : (", error);
			sendMessage("I couldn't find Sir " + brother + " in my system 😕 Check your message and try again!");
		});
	} else {
		var message = "Chapter stats:\n"

		const query = "query { \
			listBrothers { \
				id \
				sirName \
				totalTasks \
				tasksCompleted \
				tasksFailed \
				currentTasksNum \
			} \
		}";

		graphql(schema, query).then(result => {
			for (var i = 0; i < result.data.listBrothers.length; i++) {
				var messageStats = displayStats(result.data.listBrothers[i]);
				message = message + "Sir " + result.data.listBrothers[i].sirName + " stats:\n"
				message = message + messageStats;
			}
			sendMessage(message);
		}).catch(error => {
			console.log("there was an error showing stats for a bro : (", error);
			sendMessage("There was an error 😕 Check your message and try again!");
		});
	}
}

module.exports = showStatsGM;