const jwt = require('jsonwebtoken')
const User = require('./UserWithCrypto')


const checkAuthorization = function (req, res, next) {

    //See if there is a token on the request...if not, reject immediately
    //
    const userJWT = req.cookies.twitterAccessJwt
    if (!userJWT) {
        res.send(401, 'Invalid or missing authorization token')
    }
    //There's a token; see if it is a valid one and retrieve the payload
    //
    else {
        const userJWTPayload = jwt.verify(userJWT, 'rffinqafneaof4mIONIRQNFawlnuievresuilfrs38429u3r9q')
        if (!userJWTPayload) {
            //Kill the token since it is invalid
            //
            res.clearCookie('twitterAccessJwt')
            res.send(401, 'Invalid or missing authorization token')
        }
        else {
            //There's a valid token...see if it is one we have in the db as a logged-in user
            //
            User.findOne({'twitterAccessToken': userJWTPayload.twitterAccessToken})
                .then(function (user) {
                    if (!user) {
                        res.send(401, 'User not currently logged in')
                    }
                    else {
                        console.log('Valid user:', user.name)
                        req.user = user;
                        next()
                    }

                })
        }
    }
}

module.exports = checkAuthorization