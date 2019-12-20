var LocalStrat = require('passport-local').Strategy
var bcrypt = require('bcrypt')

function initialize(passport, User) {
    const authenticate = (username, password, done) => {
        var warning_user = "<div id=\"username warning\"><div class=\"ui red negative message\">"+
        "<div class=\"header\">Username does not exist</div></div>"
        var warning_pass = "<div id=\"password warning\"><div class=\"ui red negative message\">"+
        "<div class=\"header\">Password for username incorrect</div></div>"
        User.findOne({ 'username': username }, async function (err, user) {
            if (err) { return done(err); }
            if (!user) {
                document.getElementById("warning").innerHTML = warning_user
                return done(null, false)
            }
            try {
                if (await bcrypt.compare(password, user.password)) {
                    return done(null, user) 
                } else {
                    document.getElementById("warning").innerHTML = warning_pass
                    return done(null, false)
                }
            } catch(e) {
                done(e)
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