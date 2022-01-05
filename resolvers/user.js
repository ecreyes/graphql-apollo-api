const { users, tasks } = require('../constants/index')
const User = require('../database/models/user')
const bcrypt = require('bcryptjs')

module.exports = {
    Query: {
        users: () => users,
        user: (_, { id }) => users.find(user => user.id === id),
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
    },
    User: {
        tasks: parent => {
            const { id } = parent

            return tasks.filter(task => task.userId === id)
        },
    },
}
