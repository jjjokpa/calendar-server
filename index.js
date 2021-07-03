const express = require('express')
const app = express()
const cors = require('cors')
const passport = require('passport')
const cookieSession = require('cookie-session')
const PORT = process.env.PORT || 3001

require('dotenv').config()

const insertDate = require('./insert-date')
require('./passport-setup')

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieSession({
	name: 'tuto-session',
	keys: ['key1', 'key2']
}))

const isLoggedIn = (req, res, next) => {
	if (req.user) {
		next()
	} else {
		res.sendStatus(401)
	}
}

app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => res.send('Hello World'))
app.get('/failed', (req, res) => res.send('Failed'))
app.get('/good', isLoggedIn, (req, res) => res.send(`Welcome`))

app.get('/google', passport.authenticate('google', {
	scope: [
		'profile',
		'https://www.googleapis.com/auth/calendar',
		'https://www.googleapis.com/auth/calendar.events'
	]
}));

app.get('/google/callback', passport.authenticate('google', { failureRedirect: '/failed' }),
	function (req, res) {
		// Successful authentication, redirect home.
		res.redirect(`${process.env.CLIENT_URL}/?accessToken=` + req.user.accessToken);
	});

app.get('/logout', (req, res) => {
	req.session = null
	req.logout()
	res.redirect('/')
})

app.post('/send-event', (req, res) => {

	const data = req.body
	console.log(data)
	insertDate(data)

})



app.listen(PORT || 3001, () => console.log(`listen on port ${PORT}`))