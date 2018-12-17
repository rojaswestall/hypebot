'use strict';

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports = (data) => {
	if (data.firstName) {
		const params = {
	        TableName: process.env.TABLE_NAME,
	        IndexName: "first-name-index",
	        KeyConditionExpression: 'firstName = :hkey',
	        ExpressionAttributeValues: {
	        	":hkey": data.firstName
	        }
	    };
	    return dynamoDb.query(params).promise()
        	.then(result => result.Items[0]);
	} 
	else if (data.sirName) {
		const params = {
	        TableName: process.env.TABLE_NAME,
	        IndexName: "sir-name-index",
	        KeyConditionExpression: 'sirName = :hkey',
	        ExpressionAttributeValues: {
	        	":hkey": data.sirName
	        }
	    };
	    return dynamoDb.query(params).promise()
        	.then(result => result.Items[0]);
	} 
	else {
		const params = {
	        TableName: process.env.TABLE_NAME,
	        KeyConditionExpression: 'id = :hkey',
	        ExpressionAttributeValues: {
	        	":hkey": data.id
	        }
	    };
	    return dynamoDb.query(params).promise()
        	.then(result => result.Items[0]);
	}
};

/////// FOR SECONDARY INDEXES ///////
// data : { Items: 
// 		[ { addedAt: 1544971488036,
// 	       sirName: 'Vagabundo',
// 	       tasksFailed: 0,
// 	       lastName: 'Macedo',
// 	       tasks: [],
// 	       crossingDate: '4',
// 	       tasksCompleted: 0,
// 	       email: 'macedo@u.northwestern.edu',
// 	       firstName: 'Alex',
// 	       currentTasksNum: 0,
// 	       id: '22d44730-0141-11e9-8e9b-cd677176eb5d',
// 	       totalTasks: 0,
// 	       birthday: '4' } ],
// 	    Count: 1,
// 		ScannedCount: 1 }
