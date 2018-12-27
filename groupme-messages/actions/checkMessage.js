'use strict';

const { graphql } = require('graphql');
const sendMessage = require('./sendMessage');
const schema = require('../schema');
const getBrotherID = require('./getBrotherID');
const addTask = require('./groupme-actions/addTask');
const completeTasks = require('./groupme-actions/completeTask');
const removeTasks = require('./groupme-actions/removeTask');
const tasksFailed = require('./groupme-actions/failTask');
const displayTasks = require('./groupme-actions/displayTasks');
const displayStats = require('./groupme-actions/showStats');
const displayPins = require('./groupme-actions/displayPins');
const clearPins = require('./groupme-actions/clearPins');

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

    // Could do matching by name in the database, BUT then an extra request needs to be made for every message. Since we're
    // trying to keep hypebot free, we're going to hardcode these definitions so we only sometimes query the database.
    // That is, basically we query the database whenever we want to send a message back to the gm becaise 
    // we performed an action to change something in it. Don't want to perform a query for every message sent in the gm

    // Chapter day can be 0-6, 0 being Sunday
    const chapterDay = 0;
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
    const brotherSpecificRegex = /(-.*(?!-)) (-.*)/i;
    const indexRegex = /-\s*(?:\s*\d\s*,\s*)*\s*\d/i;
    const brotherRegex = /-\s*.*/i;
    const chapterRegex = /chapter/i;
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

    // ADD TASK
    const addTaskRegex = /^Add Task\s*-/i;
    const taskRegex = /-\s*.*/i;
    if (messageText && addTaskRegex.test(messageText)) {

    	var brotherString = brotherSpecificRegex.exec(messageText);
    	var taskString = taskRegex.exec(messageText);

    	if (brotherString) {
    		addTask(chapterDay, brotherString[2].substring(1).trim().charAt(0).toUpperCase() + brotherString[2].substring(1).trim().slice(1), brotherString[1].substring(2), senderName);
    	} else if (taskString) {
    		addTask(chapterDay, senderName, taskString[0].substring(1).trim());
    	} else {
    		sendMessage("It looks like you didn't specify a task 😕 Check your message and try again!");
    	}

        return;
    }

    // COMPLETE TASK(S)
    const completedTaskRegex = /^Completed Task\s*-/i;
    const taskCompletedRegex = /^Task Completed\s*-/i;
    const completedTasksRegex = /^Completed Tasks\s*-/i;
    const tasksCompletedRegex = /^Tasks Completed\s*-/i;
    const taskCompleteRegex = /^Task Complete\s*-/i;
    const tasksCompleteRegex = /^Tasks Complete\s*-/i;
    const completeTaskRegex = /^Complete Task\s*-/i;
    const completeTasksRegex = /^Complete Tasks\s*-/i;
    if (messageText && (completedTaskRegex.test(messageText) || taskCompletedRegex.test(messageText) || completedTasksRegex.test(messageText) || tasksCompletedRegex.test(messageText) || taskCompleteRegex.test(messageText) || tasksCompleteRegex.test(messageText) || completeTaskRegex.test(messageText) || completeTasksRegex.test(messageText))) {

    	var brotherString = brotherSpecificRegex.exec(messageText);
    	var indexes = indexRegex.exec(messageText);

    	if (brotherString && indexes) {
    		completeTasks([ ...new Set(indexes[0].substring(1).split(",").map(str => str.trim()).sort()) ], brotherString[2].substring(1).trim().charAt(0).toUpperCase() + brotherString[2].substring(1).trim().slice(1));
    	} else if (indexes) {
    		completeTasks([ ...new Set(indexes[0].substring(1).split(",").map(str => str.trim()).sort()) ], senderName);
    	} else {
    		sendMessage("It looks like you didn't specify any tasks 😕 Check your message and try again!");
    	}

        return;
    }

    // REMOVE TASK(S)
    const removeTaskRegex = /^Remove Task\s*-/i;
    const removeTasksRegex = /^Remove Tasks\s*-/i;
    if (messageText && (removeTaskRegex.test(messageText) || removeTasksRegex.test(messageText))) {

    	var brotherString = brotherSpecificRegex.exec(messageText);
    	var indexes = indexRegex.exec(messageText);

    	if (brotherString && indexes) {
    		removeTasks([ ...new Set(indexes[0].substring(1).split(",").map(str => str.trim()).sort()) ], brotherString[2].substring(1).trim().charAt(0).toUpperCase() + brotherString[2].substring(1).trim().slice(1), senderName);
    	} else if (indexes) {
    		removeTasks([ ...new Set(indexes[0].substring(1).split(",").map(str => str.trim()).sort()) ], senderName);
    	} else {
    		sendMessage("It looks like you didn't specify any tasks 😕 Check your message and try again!");
    	}

        return;
    }

    // FAIL TASK(S)
    const failTaskRegex = /^Fail Task\s*-/i;
    const failTasksRegex = /^Fail Tasks\s*-/i;
    const failedTaskRegex = /^Failed Task\s*-/i;
    const failedTasksRegex = /^Failed Tasks\s*-/i;
    const taskFailedRegex = /^Task Failed\s*-/i;
    const tasksFailedRegex = /^Tasks Failed\s*-/i;
    const taskFailRegex = /^Task Fail\s*-/i;
    const tasksFailRegex = /^Tasks Fail\s*-/i;
    if (messageText && (failTaskRegex.test(messageText) || failTasksRegex.test(messageText) || failedTaskRegex.test(messageText) || failedTasksRegex.test(messageText) || taskFailedRegex.test(messageText) || tasksFailedRegex.test(messageText) || taskFailRegex.test(messageText) || tasksFailRegex.test(messageText))) {

    	var brotherString = brotherSpecificRegex.exec(messageText);
    	var indexes = indexRegex.exec(messageText);

    	if (brotherString && indexes) {
    		tasksFailed([ ...new Set(indexes[0].substring(1).split(",").map(str => str.trim()).sort()) ], brotherString[2].substring(1).trim().charAt(0).toUpperCase() + brotherString[2].substring(1).trim().slice(1));
    	} else if (indexes) {
    		tasksFailed([ ...new Set(indexes[0].substring(1).split(",").map(str => str.trim()).sort()) ], senderName);
    	} else {
    		sendMessage("It looks like you didn't specify any tasks 😕 Check your message and try again!");
    	}

        return;
    }

    // SHOW TASKS
    const showTasksPersonRegex = /^Show Tasks\s*-/i;
    const showTasksRegex = /^Show Tasks$/i;
    const displayTasksPersonRegex = /^Display Tasks\s*-/i;
    const displayTasksRegex = /^Display Tasks$/i;
    if (messageText && (showTasksPersonRegex.test(messageText) || showTasksRegex.test(messageText) || displayTasksPersonRegex.test(messageText) || displayTasksRegex.test(messageText))) {

    	var brotherString = brotherRegex.exec(messageText);

    	if (brotherString && chapterRegex.exec(brotherString[0].substring(1).trim())) {
    		displayTasks();
    	} else if (brotherString) {
    		displayTasks(brotherString[0].substring(1).trim().charAt(0).toUpperCase() + brotherString[0].substring(1).trim().slice(1));
    	} else {
    		displayTasks(senderName);
    	}

        return;
    }

    // SHOW STATS
    const showStatsPersonRegex = /^Show Stats\s*-/i;
    const showStatsRegex = /^Show Stats$/i;
    const displayStatsPersonRegex = /^Display Stats\s*-/i;
    const displayStatsRegex = /^Display Stats$/i;
    if (messageText && (showStatsPersonRegex.test(messageText) || showStatsRegex.test(messageText) || displayStatsPersonRegex.test(messageText) || displayStatsRegex.test(messageText))) {

    	var brotherString = brotherRegex.exec(messageText);

    	if (brotherString && chapterRegex.exec(brotherString[0].substring(1).trim())) {
    		displayStats();
    	} else if (brotherString) {
    		displayStats(brotherString[0].substring(1).trim().charAt(0).toUpperCase() + brotherString[0].substring(1).trim().slice(1));
    	} else {
    		displayStats(senderName);
    	}

        return;
    }


    //////////////////////////////////////////////////////////
    ///////////////////// PIN MANAGEMENT /////////////////////
    //////////////////////////////////////////////////////////

    // Pins are just another brother whose names are all "pins". Pretty much only the tasks field of this "brother" is used.
    // A new function was made for show pins and clear pins. Small adjustments were made to addTask and removeTask to also
    // function for pins 

    // SHOW PINS
    // WE MAY NEED A SPECIAL FUNCTION FOR THIS SO WE DON'T SHOW DUE DATES AND SIR NAME
    const showPinsRegex = /^Show Pins$/i;
    const displayPinsRegex = /^Display Pins$/i;
    if (messageText && (showPinsRegex.test(messageText) || displayPinsRegex.test(messageText))) {

        displayPins();

        return;
    }

    // ADD PIN
    const addPinRegex = /^Add Pin\s*-/i;
    const pinRegex = /-\s*.*/i;
    if (messageText && (addPinRegex.test(messageText))) {

        var pinString = pinRegex.exec(messageText);

        if (pinString) {
            addTask(chapterDay, "pins", pinString[0].substring(1).trim());
        } else {
            sendMessage("It looks like you didn't specify a pin 😕 Check your message and try again!");
        }
        
        return;
    }

    // REMOVE PIN(S)
    const removePinRegex = /^Remove Pin\s*-/i;
    const removePinsRegex = /^Remove Pins\s*-/i;
    if (messageText && (removePinRegex.test(messageText) || removePinsRegex.test(messageText))) {

        var indexes = indexRegex.exec(messageText);

        if (indexes) {
            removeTasks([ ...new Set(indexes[0].substring(1).split(",").map(str => str.trim()).sort()) ], "pins");
        } else {
            sendMessage("It looks like you didn't specify any pins 😕 Check your message and try again!");
        }

        return;
    }

    // CLEAR PINS
    // NEED TO WRITE A NEW FUNCTION FOR THIS TOO
    const clearPinsRegex = /^Clear Pins$/i;
    if (messageText && clearPinsRegex.test(messageText)) {

        clearPins();

        return;
    }



}

module.exports = checkMessage;