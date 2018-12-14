'use strict';

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const uuid = require('uuid');

// Resolver to create a brother

module.exports = (data) => {
    const params = {
        TableName: process.env.TABLE_NAME,
        Item: {
            firstName: data.firstName,
            lastName: data.lastName,
            sirName: data.sirName,
            birthday: data.birthday,
            crossingDate: data.crossingDate,
            tasks: [],
            tasksCompleted: 0,
            tasksFailed: 0,
            currentTasksNum: 0,
            totalTasks: 0,
            id: uuid.v1(),
            addedAt: Date.now(),
        }
    };
    return dynamoDb.put(params).promise()
        .then(result => params.Item)
};