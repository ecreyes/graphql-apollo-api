const { users, tasks } = require('../constants/index')
const uuid = require('uuid')

module.exports = {
    Query: {
        tasks: () => tasks,
        // (parent,args)
        task: (_,{ id }) => tasks.find(task => task.id === id),
    },
    Mutation: {
        createTask: (_,{ input }) => {
            const { name, completed, userId } = input
            const task = { id: uuid.v4() , name, completed, userId }

            tasks.push(task)

            return task
        },
    },
    Task: {
        user: parent => {
            const { userId } = parent

            return users.find(user => user.id === userId)
        },
    },
}
