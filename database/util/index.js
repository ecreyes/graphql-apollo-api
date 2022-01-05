const mongoose = require('mongoose')

module.exports.connection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB_URL)
        console.log('Database connected successfully')
    }catch(error) {
        console.log(error)

        throw error
    }
}

module.exports.isValidObjectId = id => {
    return mongoose.Types.ObjectId.isValid(id)
}
