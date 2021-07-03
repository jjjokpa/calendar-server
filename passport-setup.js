const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config()

passport.serializeUser(function (user, done) {
	done(null, user);
});

passport.deserializeUser(function (user, done) {
	done(null, user);
});

passport.use(new GoogleStrategy({
	clientID: process.env.API_CLIENT_KEY,
	clientSecret: process.env.API_SECRET,
	callbackURL: "http://localhost:3001/google/callback",
},
	function (accessToken, refreshToken, profile, done) {
		// use the profile info
		return done(null, { profile, accessToken });
	}
));

