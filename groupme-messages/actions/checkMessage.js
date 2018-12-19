'use strict';

const { graphql } = require('graphql');
const sendMessage = require('./sendMessage');
const schema = require('../schema');
const getBrotherID = require('./getBrotherID');

const checkMessage = function(data) {

	const messageText = data.text;
    const senderName = data.name;

	// Learn about regular expressions in JavaScript: 
    // https://developer.mozilla.org/docs/Web/JavaScript/Guide/Regular_Expressions

    // ^ - nothing before it
    // $ - nothing after it
    // i - Case insensitive


    ////////////////////////////////////////////////////////
    /////////////// INSTRUCTIONS FOR HYPEBOT ///////////////
    ////////////////////////////////////////////////////////

    const showinstructionsRegex = /^show instructions$/i;
    const instructionsRegex = /^instructions$/i;
    if (messageText && (instructionsRegex.test(messageText) || showinstructionsRegex.test(messageText))) {
        var message = "Possible commands for hypebot:\n\n"

        // HypeMe and other fun stuff
        message = message.concat("HYPE ME\n\n");

        // Task Management
        message = message.concat("For tasks:\n")
        message = message.concat("*Hypebot looks for - and ,*\n")
        message = message.concat("Add Task - <task>\n");
        message = message.concat("Remove Task - <task#, ...>\n");
        message = message.concat("Task Completed - <task#, ...>\n");
        message = message.concat("Task Failed - <task#, ...>\n");
        message = message.concat("\"\" - <task#, ...> - <knightname>\n");
        message = message.concat("Show Tasks\n");
        message = message.concat("Show Tasks - <knightname>\n");
        message = message.concat("Show Tasks - chapter\n");
        message = message.concat("Show Stats\n");
        message = message.concat("Show Stats - <knightname>\n");
        message = message.concat("Show Stats - chapter\n\n");

        // Pin Management
        message = message.concat("For pins:\n")
        message = message.concat("Add Pin - <pincontent>\n");
        message = message.concat("Remove Pin - <pin#>\n");
        message = message.concat("Show Pins\n");
        message = message.concat("Clear Pins\n\n");

        // Instructions
        message = message.concat("Show Instructions");

        sendMessage(message);
        return;
    }


	///////////////////////////////////////////////////////
    ///////////////////// DEFINITIONS /////////////////////
    ///////////////////////////////////////////////////////

    const hypeMeRegex = /HYPE ME/;
    const canisRegex = /Canis/i;
    const marchitarRegex = /Marchitar/i;
    const guajiroRegex = /Guajiro/i;
    const vagabundoRegex = /Vagabundo/i;
    const fabianRegex = /fabian/i;
    const gabeRegex = /gabe/i;
    const javierRegex = /javier/i;
    const alexRegex = /alex/i;
    const botRegex = /Hypebot2\.1/;
    const hypePhrases = Array(
    	"111119!!!!!",
    	"EIGHT SEVEN!",
    	"Too Hype Too Hype!",
    	"Too Proud Too Proud!",
    	"Who you wit!?!",
    	"ONE Culture, ANY Race!",
    	"We grow as Knights, we grow as Brothers, we grow as one!",
    	"The purpose of this Brotherhood shall be to promote and maintain the traditional values of UNITY, HONESTY, INTEGRITY, and LEADERSHIP!",
    	"Crescit Eundo, It Grows as it Goes!!",
    	"On November 25th, 1997, the Alpha Alpha chapter was founded by five young visionaries!",
    	"Our charter class was: JAIME MORENO!!!",
    	"On November 25th, 1987, Omega Delta Phi was founded at Texas Tech University in Lubbock, Texas, by seven Men of Vision!",
    	"Where are the Capri-Suns?!",
    	"Who’s gonna represent till they die?",
    	"Oh yeah we! Walk the walk! And yeah we! Talk the talk!",
    	"We’re the hypest of the hype and we’re hard as stone!",
    	"We don’t front! We just escalate!",
        "Alpha Beta Gamma Delta Epsilon Zeta Eta Theta Iota Kappa Lambda Mu Nu Xi Omicron Pi Rho Sigma Tau Upsilon Phi Chi Psi Omega Delta Phi!!!!",
        "Hype yourself.");


    ////////////////////////////////////////////////////////
    /////////////////// HYPE ME AND MORE ///////////////////
    ////////////////////////////////////////////////////////

    // HYPEME
    // we query the database for that user if we see HYPEME

    if (messageText && hypeMeRegex.test(messageText)) {
    	// do math and return normal response 87% of the time
    	if (Math.random() < 0.87) {
    		sendMessage(hypePhrases[Math.floor(Math.random()*hypePhrases.length)]);
    	} else {
    		const query = "query { \
	    		viewBrother(sirName: \"" + senderName + "\") { \
	    			phrases \
	    		} \
	    	}";

	    	graphql(schema, query).then(result => {
	    		const specialPhrases = result.data.viewBrother.phrases;
	        	sendMessage(specialPhrases[Math.floor(Math.random()*specialPhrases.length)]);
	        });
    	}
        return;
    }
    
    // AND MORE ...
    // here we could check against first names in the database
    // not trying to send a request to the database for every message though
    // SO, we are hardcoding in the definitions, each bro's name being there
    if (messageText && (fabianRegex.test(messageText)) || (gabeRegex.test(messageText)) || (javierRegex.test(messageText)) || (alexRegex.test(messageText))) {
    	// Has 19.87% chance of sending the message
    	if (fabianRegex.test(messageText) && Math.random() < 0.1987) {
    		sendMessage("fuck fabian");
    	}
    	if (gabeRegex.test(messageText) && Math.random() < 0.1987) {
    		sendMessage("fuck gabe");
    	}
    	if (javierRegex.test(messageText) && Math.random() < 0.1987) {
    		sendMessage("fuck javier");
    	}
    	if (alexRegex.test(messageText) && Math.random() < 0.1987) {
    		sendMessage("fuck alex");
    	}
    }

    /////////////////////////////////////////////////////////
    //////////////////// TASK MANAGEMENT ////////////////////
    /////////////////////////////////////////////////////////

    // Add a task for a knight
    
    const addTaskRegex = /^Add Task -/i;
    const brotherAddTaskRegex = /(-.*(?!-)) (-.*)/i;
    const taskRegex = /- .*/i;
    if (messageText && addTaskRegex.test(messageText)) {

    	// Setting the date to be the next sunday from whatever today's date is
    	var d = new Date();
    	d.setDate(d.getDate() + (7 - d.getDay()) % 7);

    	var brotherString = brotherAddTaskRegex.exec(messageText);
    	console.log(brotherString);
    	if (brotherString) {
    		var assignee = brotherString[2].substring(2).charAt(0).toUpperCase() + brotherString[2].substring(2).slice(1);
    		getBrotherID(assignee).then(id => {
    			const query = "mutation { \
		    		addTask(id: \"" + id + "\", description: \"" + brotherString[1].substring(2) + "\", dueDate: \"" + d.getTime() + "\", notes: \"added from groupme\") { \
		    			description \
		    			dueDate \
		    			dateAssigned \
		    			notes \
		    		} \
		    	}";
		    	graphql(schema, query).then(result => {
		    		// if we wanted we could return some new information?
		        	sendMessage("A new task has been added for Sir " + assignee + " by Sir " + senderName + "!");
		        	console.log(result);
		        }).catch((error) => {
		        	console.log(error);
		        	sendMessage("There was an error adding the task : ( Check your message and try again!");
		        });
		    }).catch(error => {
		    	console.log("there was an error : (", error);
		    });
    	} else {
    		getBrotherID(senderName).then(id => {
    			var task = taskRegex.exec(messageText)[0].substring(2); 
    			const query = "mutation { \
		    		addTask(id: \"" + id + "\", description: \"" + task + "\", dueDate: \"" + d.getTime() + "\", notes: \"added from groupme\") { \
		    			description \
		    			dueDate \
		    			dateAssigned \
		    			notes \
		    		} \
		    	}";
		    	graphql(schema, query).then(result => {
		    		// if we wanted we could return some new information?
		        	sendMessage("A new task has been added for Sir " + senderName + "!");
		        }).catch((error) => {
		        	console.log(error);
		        	sendMessage("There was an error adding the task : ( Check your message and try again!");
		        });
		    }).catch(error => {
		    	console.log(error);
		    });
    	}

        return;
    }
}

module.exports = checkMessage;


    /*
     * Called when the bot receives a message.
     *
     * @static
     * @param {Object} message The message data incoming from GroupMe
     * @return {string}
     */
//     static checkMessage(message) {

//         // Add a task for a knight
//         const addTaskRegex = /^Add Task - .*: .*/i;
//         const knightTaskRegex = /- .*:/i;
//         const taskRegex = /: .*/i;
//         if (messageText && addTaskRegex.test(messageText)) {
//             var knightString = knightTaskRegex.exec(messageText)[0];
//             var knight = knightString.substring(2, knightString.length - 1);
//             var task = taskRegex.exec(messageText)[0].substring(2);
//             TaskManager.newTask(knight, task);
//             return null;
//         }

//         // Remove a task for a knight
//         const removeTaskRegex = /^Remove Task - .*: .*/i;
//         if (messageText && removeTaskRegex.test(messageText)) {
//             var knightString = knightTaskRegex.exec(messageText)[0];
//             var knight = knightString.substring(2, knightString.length - 1);
//             var taskNumber = taskRegex.exec(messageText)[0].substring(2);

//             TaskManager.removeTask(knight, taskNumber);
//             return null;
//         }

//         // A knight completed a task
//         const completedTaskRegex = /^Task Completed - .*: .*/i;
//         if (messageText && completedTaskRegex.test(messageText)) {
//             var knightString = knightTaskRegex.exec(messageText)[0];
//             var knight = knightString.substring(2, knightString.length - 1);
//             var taskNumber = taskRegex.exec(messageText)[0].substring(2);

//             TaskManager.taskCompleted(knight, taskNumber);
//             return null;
//         }

//         // Show tasks for all the bros
//         const showTasksRegex = /^Show Tasks$/i;
//         if (messageText && showTasksRegex.test(messageText)) {
//             TaskManager.showTasks();
//             return null;
//         }

//         // Show tasks for one bro
//         const showTasksForRegex = /^Show Tasks - .*/i;
//         const knightRegex = /- .*/i;
//         if (messageText && showTasksForRegex.test(messageText)) {
//             var knightString = knightRegex.exec(messageText)[0];
//             var knight = knightString.substring(2, knightString.length);
//             TaskManager.showTasksFor(knight);
//             return null;
//         }

//         // Show stats for all bros
//         const showStatsRegex = /^Show Stats$/i;
//         if (messageText && showStatsRegex.test(messageText)) {
//             TaskManager.showStats();
//             return null;
//         }

//         // Show stats for one bro
//         const showStatsForRegex = /^Show Stats - .*/i;
//         if (messageText && showStatsForRegex.test(messageText)) {
//             var knightString = knightRegex.exec(messageText)[0];
//             var knight = knightString.substring(2, knightString.length);
//             TaskManager.showStatsFor(knight);
//             return null;
//         }

//         // Add a pin to the pinbook
//         const addPinRegex = /^Add Pin - .*/i;
//         const PinRegex = /- .*/i;
//         if (messageText && addPinRegex.test(messageText)) {
//             var pinString = PinRegex.exec(messageText)[0];
//             var content = pinString.substring(2, pinString.length);
//             PinBook.addPin(content);
//             return null;
//         }

//         // Remove pin from the pinbook
//         const removePinRegex = /^Remove Pin - .*/i;
//         if (messageText && removePinRegex.test(messageText)) {
//             var pinString = PinRegex.exec(messageText)[0];
//             var number = pinString.substring(2, pinString.length);
//             PinBook.removePin(number);
//             return null;
//         }

//         // Remove pin from the pinbook
//         const showPinsRegex = /^Show Pins/i;
//         if (messageText && showPinsRegex.test(messageText)) {
//             PinBook.showPins();
//             return null;
//         }

//         // Remove pin from the pinbook
//         const clearPinsRegex = /^Clear Pins/i;
//         if (messageText && clearPinsRegex.test(messageText)) {
//             PinBook.clearPinBook();
//             return null;
//         }

//         const hypeMeRegex = /HYPE ME/;
//         const lykaiosRegex = /Lykaios/;
//         const canisRegex = /Canis/;
//         const guajiroRegex = /Guajiro/;
//         const vagabundoRegex = /Vagabundo/;
//         const jaimeRegex = /Jaime/;
//         const sanoRegex = /Sano/;
//         const fabianRegex = /fabian/i;
//         const testbotRegex = /testbot!/;
//         const botRegex = /Hypebot2\.0/;

//         // Check if the GroupMe message has content and if the regex pattern is true

//         // lol the fuck fabian message
//         // Have to make sure the bot's name is either Hypebot2.0 or testbot! otherwise it will keep sending messages over and over
//         if (messageText && fabianRegex.test(messageText) && !(botRegex.test(senderName) || testbotRegex.test(senderName))) {
//             return "fuck fabian";
//         }

//         // JAIME -- ANGEL
//         if (messageText && senderName && jaimeRegex.test(senderName) && hypeMeRegex.test(messageText)) {
//             var jaimePhrases = Array(
//                 "111119!!!!!",
//                 "Too Hype Too Hype!",
//                 "Too Proud Too Proud!",
//                 "Who you wit!?!",
//                 "Hype yourself.",
//                 "wot in tarnation",
//                 "https://youtu.be/S15eSFlMXtk", //Upsilon probate
//                 "Hahah little mac. You have a little mac...",
//                 "IF you cross....");
//             return jaimePhrases[Math.floor(Math.random()*jaimePhrases.length)];
//         }
//         // You shouldn’t say “when you cross” because that means that you aren’t motivated since you already know you’re going to get in. Instead,  “if you cross” motivates you because you don’t know if you’ll get in or not.

//         // LYKAIOS -- JOHNNY
//         if (messageText && senderName && lykaiosRegex.test(senderName) && hypeMeRegex.test(messageText)) {
//             var lykaiosPhrases = Array(
//                 "You down to smoke???",
//                 "Hype yourself.",
//                 "You love your ne-hoes : ) ... and they love you",
//                 "Bish, what?",
//                 "You are greatness.",
//                 "Be strong enough to stand alone, be yourself enough to stand apart, but be wise enough to stand together when the time comes. Be Lykaios."
//                 );
//             return lykaiosPhrases[Math.floor(Math.random()*lykaiosPhrases.length)];
//         }

//         // CANIS -- FABIAN
//         if (messageText && senderName && canisRegex.test(senderName) && hypeMeRegex.test(messageText)) {
//             // return "lol fabian fuck u";
//             var canisPhrases = Array(
//                 "Hype yourself.",
//                 "Weeoooooooow",
//                 "No, you fuck. You're the reason Michael doesn't have a little",
//                 "lol fabes fuck u",
//                 "hahahahah angel beat you in smash",
//                 "津波",
//                 ".01",
//                 "Lol ... \"I know how to make hypejuice\"",
//                 "Kay-so");
//             return canisPhrases[Math.floor(Math.random()*canisPhrases.length)];
//         }

//         // GUAJIRO -- JAVIER
//         if (messageText && senderName && guajiroRegex.test(senderName) && hypeMeRegex.test(messageText)) {
//             var guajiroPhrases = Array(
//                 "Hype yourself.",
//                 "ΦΔΩ. Need I say more?",
//                 "Fuckin neo",
//                 "lol get back on line",
//                 "https://youtu.be/3NXBgSCSrIk",
//                 "that's racist",
//                 "that's at least slightly racist",
//                 "Your word is your bond. And your bond is shit.",
//                 "Fake friends"
//                 );
//             return guajiroPhrases[Math.floor(Math.random()*guajiroPhrases.length)];
//         }

//         // VAGABUNDO -- ALEX
//         if (messageText && senderName && vagabundoRegex.test(senderName) && hypeMeRegex.test(messageText)) {
//             var vagabundoPhrases = Array(
//                 "Hype yourself.",
//                 "ΦΔΩ. Need I say more?",
//                 "Fuckin neo",
//                 "lol get back on line",
//                 "https://youtu.be/3NXBgSCSrIk",
//                 "That's my fraaaand",
//                 "I'll swipe you in!",
//                 "mmmmmmmm i don't know",
//                 "You DON'T have a nice butt",
//                 "Lol \"pass me the everclear\""
//                 );
//             return vagabundoPhrases[Math.floor(Math.random()*vagabundoPhrases.length)];
//         }

//         // Just for the general member
//         if (messageText && hypeMeRegex.test(messageText) && !(botRegex.test(senderName) || testbotRegex.test(senderName))) {
//             var phrases = Array(
//                 "KAPPAS KAPPAS TILL WE DIE",
//                 "111119!!!!!",
//                 "Too Hype Too Hype!",
//                 "Too Proud Too Proud!",
//                 "Who you wit!?!",
//                 "Where are the Capri-Suns?!",
//                 "Who’s gonna represent till they die?",
//                 "Too Kute Too Kute",
//                 "Sigma what, Sigma who??",
//                 "Alpha Beta Gamma Delta Epsilon Zeta Eta Theta Iota Kappa Lambda Mu Nu Xi Omicron Pi Rho Sigma Tau Upsilon Phi Chi Psi Omega Delta Phi!!!!",
//                 "Hype yourself.");
//             // var phrases = Array(
//             //     "Hope you haven’t been naughty this year ; )",
//             //     "Twas the night before Christmas when all through the house, The A/C was running cause Fabes lives in the south",
//             //     "The tree better not be the only thing getting lit this year",
//             //     "Merry Christmas to Lykaios and his Ne - ho ho hoes!",
//             //     "Merry Kissmyass");
//             return phrases[Math.floor(Math.random()*phrases.length)];
//         }

//         return null;
//     };

//     /**
//      * Sends a message to GroupMe with a POST request.
//      *
//      * @static
//      * @param {string} messageText A message to send to chat
//      * @return {undefined}
//      */
//     static sendMessage(messageText) {
//         // Get the GroupMe bot id saved in `.env`
//         const botId = process.env.BOT_ID;

//         const options = {
//             hostname: 'api.groupme.com',
//             path: '/v3/bots/post',
//             method: 'POST'
//         };

//         const body = {
//             bot_id: botId,
//             text: messageText
//         };

//         // Make the POST request to GroupMe with the http module
//         const botRequest = https.request(options, function(response) {
//             if (response.statusCode !== 202) {
//                 console.log('Rejecting bad status code ' + response.statusCode);
//                 //console.log(response);
//             } else {
//                 //console.log(response);
//             }
//         });

//         // On error
//         botRequest.on('error', function(error) {
//             console.log('Error posting message ' + JSON.stringify(error));
//         });

//         // On timeout
//         botRequest.on('timeout', function(error) {
//             console.log('Timeout posting message ' + JSON.stringify(error));
//         });

//         // Finally, send the body to GroupMe as a string
//         botRequest.end(JSON.stringify(body));
//         console.log('Sending ' + JSON.stringify(body.text));
//     };
// };

