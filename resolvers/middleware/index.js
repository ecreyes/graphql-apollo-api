const { skip } = require('graphql-resolvers')
const Task = require('../../database/models/task')
const { isValidObjectId } = require('../../database/util/index')

// parent,arguments,context -> parameters in resolver function
module.exports.isAuthenticated = (_,__, { email }) => {
    if(!email) throw new Error('access denied, please provide a jwt')

    // skip call the next resolver
    return skip
}


module.exports.isTaskOwner = async (_, { id }, { loggedInUserId }) => {
    try {
        if(!isValidObjectId(id)) throw new Error('id is not valid')

        const task = await Task.findById(id)

        if(!task)
            throw new Error('Task not found')
         else if (task.user.toString() !== loggedInUserId)
            throw new Error('not authorized')


        return skip
    }catch(error) {
        console.log(error)

        throw error
    }
}
