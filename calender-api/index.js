const { google } = require('googleapis')
const { OAuth2 } = google.auth

const {cred} = require('./credentials');

const oAuth2Client = new OAuth2(
  cred.session1,
  cred.session2
)

oAuth2Client.setCredentials({
  refresh_token: cred.refresh_token
})

const calendar = google.calendar({ version: 'v3', auth: oAuth2Client })

async function calenderBooker( meetDate, startTime, endTime, roomName, userEmail){

    let customStartTime = meetDate + 'T' + startTime + ':00+05:30';
    let customEndTime = meetDate + 'T' + endTime + ':00+05:30';

    const eventCustom = {
        summary: `Meeting made by MeetBot`,
        location: roomName,
        colorId: 1,
        start: {
        dateTime: customStartTime,
        timeZone: 'America/Denver',
        },
        end: {
        dateTime: customEndTime,
        timeZone: 'America/Denver',
        },
        "attendees": [
        {
            "email": userEmail
        }
        ]
    }

    await calendar.events.insert(
        { sendNotifications: true, calendarId: 'primary', resource: eventCustom },
        err => {
        // Check for errors and log them if they exist.
        if (err) return console.error('Error Creating Calender Event:', err)
        // Else log that the event was created.
        return console.log('Calendar event successfully created.')
        }
    );
}

//calenderBooker("2021-3-15", "13:00", "14:00", "Alpha", "rsehwag@ex2india.com");

module.exports = {calenderBooker};