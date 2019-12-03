var LocalStrat = require('passport-local').Strategy
var bcrypt = require('bcrypt')

async function authenticate(username, password, done) {
    var user = getUserByUsername(username)
    if (user = null) {
        return done(null,false, {message: "no user with that username"})
    }

    try {
        if (await bcrypt.compare(password, user.password)){
            done(null,user)
        } else {
            done(null,false, {message: "Password incorrect"})
        }
    } catch {
        done(e)
    }
}

function initPassport(passport, User) {
    passport.use(new LocalStrat({usernameField: 'username', passwordField: 'password'}, 
    authenticate))
    passport.serializeUser(function(user, done) {done(null, user.id)})
    passport.deserializeUser(function(id, done) { 
        User.findById(id, function(err, user) {done(err, user)})
    })
}

module.exports = initPassport