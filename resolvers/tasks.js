const { users, tasks } = require('../constants/index')
const { combineResolvers } = require('graphql-resolvers')
const { isAuthenticated } = require('./middleware/index')
const User = require('../database/models/user')
const Task = require('../database/models/task')

module.exports = {
    Query: {
        tasks: () => tasks,
        // (parent,args)
        task: (_,{ id }) => tasks.find(task => task.id === id),
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
        user: parent => {
            const { userId } = parent

            return users.find(user => user.id === userId)
        },
    },
}
