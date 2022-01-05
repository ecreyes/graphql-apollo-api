const { skip } = require('graphql-resolvers')

// parent,arguments,context -> parameters in resolver function
module.exports.isAuthenticated = (_,__, { email }) => {
    if(!email) throw new Error('access denied, please provide a jwt')

    // skip call the next resolver
    return skip
}
