'use strict';

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports = (data) => {
    const params = {
        TableName: process.env.TABLE_NAME,
        Key: {"id": data.id},
        UpdateExpression: "remove #tsks[" + data.index + "] set currentTasksNum = currentTasksNum - :counter, tasksCompleted = tasksCompleted + :counter",
		ExpressionAttributeNames: {
		    "#tsks" : "tasks"
		},
		ConditionExpression: "currentTasksNum > :zer and :ind < currentTasksNum",
		ExpressionAttributeValues: {
		    ":counter" : 1,
		    ":zer" : 0,
		    ":ind" : data.index
		}
    };
    return dynamoDb.update(params).promise()
};

// Removes the task
// Decrements the current number of tasks
// Increments the number of tasks completed