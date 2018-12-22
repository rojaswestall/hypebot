'use strict';

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports = (data) => {
    const params = {
        TableName: process.env.TABLE_NAME,
        Key: {"id": data.id},
        UpdateExpression: "remove #tsks[" + data.index + "] set currentTasksNum = currentTasksNum - :counter, totalTasks = totalTasks - :counter",
		ExpressionAttributeNames: {
		    "#tsks" : "tasks"
		},
		ConditionExpression: "currentTasksNum > :zer and :ind < currentTasksNum",
		ExpressionAttributeValues: {
		    ":counter" : 1,
		    ":zer" : 0,
		    ":ind" : data.index
		},
		ReturnValues: "ALL_NEW"
    };
    return dynamoDb.update(params).promise().then(result => {
    	return result.Attributes;
    });
};

// Removes the task
// Decrements the current number of tasks
// Decrements the total number of tasks