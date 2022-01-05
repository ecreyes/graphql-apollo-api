const { combineResolvers } = require('graphql-resolvers')
const { isAuthenticated, isTaskOwner } = require('./middleware/index')
const User = require('../database/models/user')
const Task = require('../database/models/task')

module.exports = {
    Query: {
        tasks: combineResolvers(isAuthenticated ,async (_,__, { loggedInUserId }) => {
            try{
                const tasks = await Task.find({ user: loggedInUserId })

                return tasks
            }catch(error) {
                console.log(error)

                throw error
            }
        }),
        task: combineResolvers(isAuthenticated, isTaskOwner, async (_,{ id }) => {
            try {
                const task = await Task.findById(id)

                return task
            }catch(error) {
                console.log(error)

                throw error
            }
        }),
    },
    Mutation: {
        createTask: combineResolvers(isAuthenticated, async (_,{ input }, { email }) => {
            try {
                const { name, completed } = input
                const user = await User.findOne({ email })
                const task = new Task({ name,completed,user: user.id })

                const result = await task.save()

                user.tasks.push(result.id)
                await user.save()

                return result
            }catch(error) {
                console.log(error)

                throw error
            }
        }),
    },
    Task: {
        user: combineResolvers(isAuthenticated, async parent => {
            try {
                const user = await User.findById(parent.user)

                return user
            }catch(error) {
                console.log(error)

                throw error
            }
        }),
    },
}
