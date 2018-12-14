'use strict';

const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull,
    GraphQLBoolean
} = require('graphql');
const addBrother = require('./resolvers/create');
const viewBrother = require('./resolvers/view');
const listBrothers = require('./resolvers/list');
const removeBrother = require('./resolvers/remove');
const addTask = require('./resolvers/addTask');
const removeTask = require('./resolvers/removeTask');
const failTask = require('./resolvers/failTask');
const completeTask = require('./resolvers/completeTask');

const taskType = new GraphQLObjectType({
    name: 'Task',
    fields: {
        description: { type: new GraphQLNonNull(GraphQLString) },
        originalDueDate: { type: new GraphQLNonNull(GraphQLString) },
        dueDate: { type: new GraphQLNonNull(GraphQLString) },
        dataAssigned: { type: new GraphQLNonNull(GraphQLString) },
        partners: { type: new GraphQLNonNull(GraphQLString) },
        notes: { type: new GraphQLNonNull(GraphQLString) }
    }
});

const brotherType = new GraphQLObjectType({
    name: 'Brother',
    fields: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        firstName: { type: new GraphQLNonNull(GraphQLString) },
        lastName: { type: new GraphQLNonNull(GraphQLString) },
        sirName: { type: new GraphQLNonNull(GraphQLString) },
        birthday: { type: new GraphQLNonNull(GraphQLString) },
        crossingDate: { type: new GraphQLNonNull(GraphQLString) },
        tasks: { type: new GraphQLNonNull(GraphQLList(taskType)) },
        tasksCompleted: { type: new GraphQLNonNull(GraphQLInt) },
        tasksFailed: { type: new GraphQLNonNull(GraphQLInt) },
        currentTasksNum: { type: new GraphQLNonNull(GraphQLInt) },
        totalTasks: { type: new GraphQLNonNull(GraphQLInt) },
        addedAt: { type: new GraphQLNonNull(GraphQLString) },
    }
});

const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'Query',
        fields: {
            listBrothers: {
                type: new GraphQLList(brotherType),
                resolve: (parent, args) => listBrothers()
            },
            viewBrother: {
                args: {
                    id: { type: new GraphQLNonNull(GraphQLString) }
                },
                type: brotherType,
                resolve: (parent, args) => viewBrother(args.id)
            }
        }
    }),

    mutation: new GraphQLObjectType({
        name: 'Mutation',
        fields: {
            createBrother: {
                args: {
                    firstName: { type: new GraphQLNonNull(GraphQLString) },
                    lastName: { type: new GraphQLNonNull(GraphQLString) },
                    sirName: { type: new GraphQLNonNull(GraphQLString) },
                    birthday: { type: new GraphQLNonNull(GraphQLString) },
                    crossingDate: { type: new GraphQLNonNull(GraphQLString) }
                },
                type: brotherType,
                resolve: (parent, args) => addBrother(args)
            },
            removeBrother: {
                args: {
                    id: { type: new GraphQLNonNull(GraphQLString) }
                },
                type: GraphQLBoolean,
                resolve: (parent, args) => removeBrother(args.id)
            },
            addTask: {
                args: {
                    id: { type: new GraphQLNonNull(GraphQLString) },
                    description: { type: new GraphQLNonNull(GraphQLString) },
                    dueDate: { type: new GraphQLNonNull(GraphQLString) },
                    partners: { type: new GraphQLNonNull(GraphQLString) },
                    notes: { type: new GraphQLNonNull(GraphQLString) }
                },
                type: taskType,
                resolve: (parent, args) => addTask(args)
            },
            removeTask: {
                args: {
                    id: { type: new GraphQLNonNull(GraphQLString) },
                    index: { type: new GraphQLNonNull(GraphQLInt) }
                },
                type: GraphQLBoolean,
                resolve: (parent, args) => removeTask(args)
            },
            failTask: {
                args: {
                    id: { type: new GraphQLNonNull(GraphQLString) },
                    index: { type: new GraphQLNonNull(GraphQLInt) }
                },
                type: GraphQLBoolean,
                resolve: (parent, args) => failTask(args)
            },
            completeTask: {
                args: {
                    id: { type: new GraphQLNonNull(GraphQLString) },
                    index: { type: new GraphQLNonNull(GraphQLInt) }
                },
                type: GraphQLBoolean,
                resolve: (parent, args) => completeTask(args)
            }
        }
    })
});

module.exports = schema;