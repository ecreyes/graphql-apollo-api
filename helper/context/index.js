const jwt = require('jsonwebtoken')

module.exports.verifyUser = async req => {
    try{
        req.email = null

        const bearerHeader = req.headers.authorization

        if(bearerHeader) {
            const token = bearerHeader.split(' ')[1]
            const secret = process.env.JWT_SECRET_KEY || 'secret'
            const payload = jwt.verify(token,secret)

            req.email = payload.email
        }
    }catch(error) {
        console.log(error)

        throw error
    }

}
