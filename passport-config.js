var LocalStrat = require('passport-local').Strategy
var bcrypt = require('bcrypt')

function initialize(passport, User) {
    const authenticate = (username, password, done) => {
        User.findOne({ 'username': username }, async function (err, user) {
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, { message: 'Incorrect username or password' })
            }
            try {
                if (await bcrypt.compare(password, user.password)) {
                    return done(null, user) 
                } else {
                    return done(null, false, { message: 'Incorrect username or password' })
                }
            } catch(e) {
                return done(e)
            }
        })
    }
    passport.use(new LocalStrat({usernameField: 'username', passwordField: 'password'}, authenticate))
    passport.serializeUser(function(user, done) {
        done(null, user.id)
    })
    passport.deserializeUser(function(id, done) { 
        User.findById(id, function(err, user) {
            done(err, user)
        })
    })
}

module.exports = initialize