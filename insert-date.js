require('dotenv').config()

const insertDate = ({
	title,
	address,
	description,
	start,
	startTime,
	end,
	endTime,
	color,
	token
}) => {
	const { google } = require('googleapis')

	const { OAuth2 } = google.auth

	const oAuth2Client = new OAuth2(
		process.env.API_CLIENT_KEY,
		process.env.API_SECRET)

	const scopes = [
		'https://www.googleapis.com/auth/calendar',
		'https://www.googleapis.com/auth/calendar.events'
	];

	const url = oAuth2Client.generateAuthUrl({
		access_type: 'offline',
		scope: scopes
	})

	oAuth2Client.setCredentials({
		access_token: token
	})

	const calendar = google.calendar({
		version: 'v3',
		auth: oAuth2Client
	})

	const eventStartTime = new Date(Date.parse(start + " " + startTime))
	const eventEndTime = new Date(Date.parse(end + " " + endTime))

	const event = {
		summary: title,
		location: address,
		description: description,
		start: {
			dateTime: eventStartTime,
			timeZone: 'Asia/Tokyo'
		},
		end: {
			dateTime: eventEndTime,
			timeZone: 'Asia/Tokyo'
		},
		ColorId: color
	}

	calendar.freebusy.query({
		resource: {
			timeMin: eventStartTime,
			timeMax: eventEndTime,
			timeZone: 'Asia/Tokyo',
			items: [
				{
					id: 'primary'
				}
			],
		}
	}, (err, res) => {
		if (err) return console.error('エラーが発生しました。', err)
		const eventsArr = res.data.calendars.primary.busy

		if (eventsArr.length === 0) {
			return calendar.events.insert({
				calendarId: 'primary',
				resource: event
			}, (err) => {
				if (err) {
					console.error('エラーが発生しました。', err)
				}

				return console.log('登録成功')
			})
		}
		return console.log('既にスケジュールが有ります。')
	})
}

module.exports = insertDate