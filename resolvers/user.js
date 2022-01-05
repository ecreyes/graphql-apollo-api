const User = require('../database/models/user')
const Task = require('../database/models/task')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { combineResolvers } = require('graphql-resolvers')
const { isAuthenticated } = require('./middleware/index')

module.exports = {
    Query: {
        user: combineResolvers(isAuthenticated, async (_, __, { email }) => {
            try {
                const user = await User.findOne({ email })

                if(!user) throw new Error('user not found')

                return user
            }catch(error) {
                console.log(error)

                throw error
            }
        }),
    },
    Mutation: {
        signup: async (_, { input }) => {
            try{
                const { name, email, password } = input
                const user = await User.findOne({ email })

                if(user) throw new Error('email already in use')

                const hashedPassword = await bcrypt.hash(password, 12)
                const newUser = new User({ name,email,password: hashedPassword })
                const result = await newUser.save()

                return result
            }catch(error) {
                console.log(error)

                throw error
            }

        },
        login: async (_, { input }) => {
            try{
                const { email, password } = input

                const user = await User.findOne({ email })

                if(!user) throw new Error('user not found')

                const isValidPassword = await bcrypt.compare(password,user.password)

                if(!isValidPassword) throw new Error('incorrect password')

                const secret = process.env.JWT_SECRET_KEY || 'secret'
                const token = jwt.sign({ email }, secret, { expiresIn: '1h' })

                return { token }
            }catch(error) {
                console.log(error)

                throw error
            }
        },
    },
    User: {
        tasks: async ({ id }) => {
            try {
                const tasks = await Task.find({ user: id })

                return tasks
            }catch(error) {
                console.log(error)

                throw error
            }
        },
    },
}
