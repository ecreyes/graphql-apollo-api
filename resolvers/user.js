const { users, tasks } = require('../constants/index')

module.exports = {
    Query: {
        users: () => users,
        user: (_, { id }) => users.find(user => user.id === id),
    },
    Mutation: {
    },
    User: {
        tasks: parent => {
            const { id } = parent

            return tasks.filter(task => task.userId === id)
        },
    },
}
