'use strict';
const sendMessage = require('./actions/sendMessage');
const checkMessage = require('./actions/checkMessage');
const { graphql } = require('graphql');
const schema = require('./schema');

module.exports.handleMessage = (event, context, callback) => {
	var body = JSON.parse(event.body);

  // Making sure the bot isn't the one sending the message
  if (body.name !== "Sample Bot" && body.name !== process.env.BOT_NAME) {
    // Check message will send a message if it sees something 
    checkMessage(body);
  }

  callback(null);
};

module.exports.sendMessage = (event, context, callback) => {
  // as input to sendMessage put in the text we want to send. This is so people can send messages as hypebot
  // to the group straight from the web app 
  sendMessage(JSON.parse(event.body).text);
  callback(null);
}

// body:{  
//    "attachments":[  

//    ],
//    "avatar_url":"https://i.groupme.com/291x343.png.9fa2fa3c4e3e4d939812f389a7bca9a7",
//    "created_at":1544800744,
//    "group_id":"36851875",
//    "id":"154480074426237014",
//    "name":"Sample Bot",
//    "sender_id":"719152",
//    "sender_type":"bot",
//    "source_guid":"841ae790e1e10136b14722000a96548a",
//    "system":false,
//    "text":"a test message from the server",
//    "user_id":"719152"
// }

// This allows us to make graphql requests directly to this endpoint (not through groupme messages)
module.exports.queryBrothers = (event, context, callback) => {
    graphql(schema, event.body)
        .then(result => callback(null, {statusCode: 200, body: JSON.stringify(result)}))
        .catch(callback);
};