const userResolver = require('./user')
const taskResolver = require('./tasks')

module.exports = [
    userResolver,
    taskResolver,
]
