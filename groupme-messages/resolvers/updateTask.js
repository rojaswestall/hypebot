'use strict';

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports = (data) => {
	
	var params = {
		TableName: process.env.TABLE_NAME,
        Key: {"id": data.id},
		ExpressionAttributeNames: {
		    "#tsks" : "tasks"
		},
		ConditionExpression: "currentTasksNum > :zer and :ind < currentTasksNum",
		ExpressionAttributeValues: {
		    ":zer" : 0,
		    ":ind" : data.index
		},
		ReturnValues: "ALL_NEW"
	};

	if (data.dueDate) {
		params.UpdateExpression = "set #tsks[" + data.index + "].dueDate = :vari";
		params.ExpressionAttributeValues[":vari"] = data.dueDate;
	} else if (data.originalDueDate) {
		params.UpdateExpression = "set #tsks[" + data.index + "].originalDueDate = :vari";
		params.ExpressionAttributeValues[":vari"] = data.originalDueDate;
	} else if (data.description) {
		params.UpdateExpression = "set #tsks[" + data.index + "].description = :vari";
		params.ExpressionAttributeValues[":vari"] = data.description;
	} else if (data.partners) {
		params.UpdateExpression = "set #tsks[" + data.index + "].partners = :vari";
		params.ExpressionAttributeValues[":vari"] = data.partners;
	} else if (data.notes) {
		params.UpdateExpression = "set #tsks[" + data.index + "].notes = :vari";
		params.ExpressionAttributeValues[":vari"] = data.notes;
	} else {
		console.log("nothing is being updated and it will throw an error");
	}

    return dynamoDb.update(params).promise().then(result => {
    	return result.Item;
    });
};

// Updates the field of a task
// Right now can only update one at a time, should be changed so it can change two fields in one request