'use strict';

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports = (data) => {
    const params = {
        TableName: process.env.TABLE_NAME,
        Key: {"id": data.id},
        UpdateExpression: "set #tsks[" + data.index + "].dueDate = :date",
		ExpressionAttributeNames: {
		    "#tsks" : "tasks"
		},
		ConditionExpression: "currentTasksNum > :zer and :ind < currentTasksNum",
		ExpressionAttributeValues: {
		    ":zer" : 0,
		    ":ind" : data.index,
		    ":date" : data.newDueDate
		}
    };
    return dynamoDb.update(params).promise().then(result => params.ExpressionAttributeValues[":date"])
};

// Updates the dueDate field of a task to a new date, leaves the originalDueDate untouched