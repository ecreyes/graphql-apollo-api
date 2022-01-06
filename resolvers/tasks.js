const { combineResolvers } = require('graphql-resolvers')
const { isAuthenticated, isTaskOwner } = require('./middleware/index')
const User = require('../database/models/user')
const Task = require('../database/models/task')
const { stringToBase64, Base64ToString } = require('../helper/index')

module.exports = {
    Query: {
        tasks: combineResolvers(isAuthenticated ,async (_, { cursor, limit },{ loggedInUserId }) => {
            try{
                const query = { user: loggedInUserId }

                if(cursor)
                    query._id = {
                        '$lt': Base64ToString(cursor),
                    }


                let tasks = await Task.find(query).sort({ _id: -1 }).limit(limit + 1)
                const hasNextPage = tasks.length > limit

                tasks = hasNextPage ? tasks.slice(0, -1) : tasks

                return {
                    taskFeed: tasks,
                    pageInfo: {
                        nextPageCursor: hasNextPage? stringToBase64(tasks[tasks.length -1].id) : null,
                        hasNextPage,
                    },
                }
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
        updateTask: combineResolvers(isAuthenticated,isTaskOwner, async (_, { id , input }) => {
            try {
                const task = await Task.findByIdAndUpdate(id, { ...input } , { new: true })

                return task
            }catch(error) {
                console.log(error)

                throw error
            }
        }),
        deleteTask: combineResolvers(isAuthenticated,isTaskOwner, async (_, { id }, { loggedInUserId }) => {
            try {
                const task = await Task.findByIdAndDelete(id)

                await User.updateOne({ _id: loggedInUserId }, { $pull : { tasks : task.id } })

                return task
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
