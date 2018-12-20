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
const addBrother = require('./resolvers/createBrother');
const removeBrother = require('./resolvers/removeBrother');
const viewBrother = require('./resolvers/viewBrother');
const listBrothers = require('./resolvers/listBrothers');
const updateBrother = require('./resolvers/updateBrother');
const addTask = require('./resolvers/addTask');
const removeTask = require('./resolvers/removeTask');
const failTask = require('./resolvers/failTask');
const completeTask = require('./resolvers/completeTask');
const updateTask = require('./resolvers/updateTask');
const addPhrase = require('./resolvers/addPhrase');
const removePhrase = require('./resolvers/removePhrase');

const taskType = new GraphQLObjectType({
    name: 'Task',
    fields: {
        description: { type: new GraphQLNonNull(GraphQLString) },
        originalDueDate: { type: new GraphQLNonNull(GraphQLString) },
        dueDate: { type: new GraphQLNonNull(GraphQLString) },
        dateAssigned: { type: new GraphQLNonNull(GraphQLString) },
        partners: { type: GraphQLString },
        notes: { type: GraphQLString }
    }
});

const brotherType = new GraphQLObjectType({
    name: 'Brother',
    fields: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        firstName: { type: new GraphQLNonNull(GraphQLString) },
        lastName: { type: new GraphQLNonNull(GraphQLString) },
        sirName: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        birthday: { type: new GraphQLNonNull(GraphQLString) },
        crossingDate: { type: new GraphQLNonNull(GraphQLString) },
        tasks: { type: new GraphQLList(taskType) },
        phrases: { type: new GraphQLNonNull(GraphQLList(GraphQLString)) },
        tasksCompleted: { type: new GraphQLNonNull(GraphQLInt) },
        tasksFailed: { type: new GraphQLNonNull(GraphQLInt) },
        currentTasksNum: { type: new GraphQLNonNull(GraphQLInt) },
        totalTasks: { type: new GraphQLNonNull(GraphQLInt) },
        status: { type: new GraphQLNonNull(GraphQLString) },
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
                    id: { type: GraphQLString },
                    firstName: { type: GraphQLString },
                    sirName: { type: GraphQLString }
                },
                type: brotherType,
                resolve: (parent, args) => viewBrother(args)
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
                    email: { type: new GraphQLNonNull(GraphQLString) },
                    birthday: { type: new GraphQLNonNull(GraphQLString) },
                    crossingDate: { type: new GraphQLNonNull(GraphQLString) },
                    status: { type: new GraphQLNonNull(GraphQLString) }
                },
                type: brotherType,
                resolve: (parent, args) => addBrother(args)
            },
            removeBrother: {
                args: {
                    id: { type: new GraphQLNonNull(GraphQLString) }
                },
                type: brotherType,
                resolve: (parent, args) => removeBrother(args)
            },
            updateBrother: {
                args: {
                    id: { type: new GraphQLNonNull(GraphQLString) },
                    status: { type: GraphQLString },
                    firstName: { type: GraphQLString },
                    lastName: { type: GraphQLString },
                    sirName: { type: GraphQLString },
                    email: { type: GraphQLString },
                    birthday: { type: GraphQLString },
                    crossingDate: { type: GraphQLString },
                },
                type: brotherType,
                resolve: (parent, args) => updateBrother(args)
            },
            addTask: {
                args: {
                    id: { type: new GraphQLNonNull(GraphQLString) },
                    description: { type: new GraphQLNonNull(GraphQLString) },
                    dueDate: { type: new GraphQLNonNull(GraphQLString) },
                    partners: { type: GraphQLString },
                    notes: { type: GraphQLString }
                },
                type: brotherType,
                resolve: (parent, args) => addTask(args)
            },
            removeTask: {
                args: {
                    id: { type: new GraphQLNonNull(GraphQLString) },
                    index: { type: new GraphQLNonNull(GraphQLInt) }
                },
                type: brotherType,
                resolve: (parent, args) => removeTask(args)
            },
            failTask: {
                args: {
                    id: { type: new GraphQLNonNull(GraphQLString) },
                    index: { type: new GraphQLNonNull(GraphQLInt) }
                },
                type: brotherType,
                resolve: (parent, args) => failTask(args)
            },
            completeTask: {
                args: {
                    id: { type: new GraphQLNonNull(GraphQLString) },
                    index: { type: new GraphQLNonNull(GraphQLInt) }
                },
                type: brotherType,
                resolve: (parent, args) => completeTask(args)
            },
            updateTask: {
                args: {
                    id: { type: new GraphQLNonNull(GraphQLString) },
                    index: { type: new GraphQLNonNull(GraphQLInt) },
                    dueDate: { type: GraphQLString },
                    description: { type: GraphQLString },
                    originalDueDate: { type: GraphQLString },
                    partners: { type: GraphQLString },
                    notes: { type: GraphQLString }
                },
                type: brotherType,
                resolve: (parent, args) => updateTask(args)
            },
            addPhrase: {
                args: {
                    id: { type: new GraphQLNonNull(GraphQLString) },
                    phrase: { type: new GraphQLNonNull(GraphQLString) }
                },
                type: brotherType,
                resolve: (parent, args) => addPhrase(args)
            },
            removePhrase: {
                args: {
                    id: { type: new GraphQLNonNull(GraphQLString) },
                    index: { type: new GraphQLNonNull(GraphQLInt) }
                },
                type: brotherType,
                resolve: (parent, args) => removePhrase(args)
            }
        }
    })
});

// For everything but remove brother we could just return the new brother after the change

// Still need to figure out weird thing with Booleans. Not quite sure how to return it in the resolvers
// Maybe in each resolver we can just automatically return True once the promise is resolved (so maybe on then)
// Need to look into what that promise returns though. 
// Ideally we don't have an error message for every graphQL req that is supposed to return a boolean.
// removeBrother, removeTask, failTask, completeTask

module.exports = schema;