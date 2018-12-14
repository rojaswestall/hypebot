'use strict';

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports = (data) => {
    const params = {
        TableName: process.env.TABLE_NAME,
        Key: {"id": data.id},
        UpdateExpression: "remove #tsks[" + data.index + "] set currentTasksNum = currentTasksNum - :counter, tasksFailed = tasksFailed + :counter",
		ExpressionAttributeNames: {
		    "#tsks" : "tasks"
		},
		ConditionExpression: "size(tasks) > :zer",
		ExpressionAttributeValues: {
		    ":counter" : 1,
		    ":zer" : 0
		}
    };
    return dynamoDb.update(params).promise()
};

// Removes the task
// Decrements the current number of tasks
// Increments the number of tasks failed