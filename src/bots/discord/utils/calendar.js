const fs = require('fs')
const { google, outlook, office365, yahoo, ics } = require('calendar-link')
const { getRaidBossesList } = require('../../../database')

const createEvent = (title, start, end) => ({
  title,
  description: `${title} respawn on L2Reborn`,
  start,
  end: end.getTime()
       ? end
       : new Date(start.getTime() + 18000000)
})

const getCalendarLinks = (title, start, end) => {
  const event = createEvent(title, start, end)
  const icsUrl = `${process.env.URL}/api/v1/calendar?name=${encodeURI(title)}`

  return {
    google: google(event),
    outlook: outlook(event),
    office365: office365(event),
    yahoo: yahoo(event),
    apple: icsUrl
  }
}

const setCalendarICS = (title, start, end) => {
  const event = createEvent(title, start, end)
  const data = decodeURI(ics(event).replace('data:text/calendar;charset=utf8,', ''))

  fs.writeFile(
    `${__dirname.replace('utils', 'calendar/')}${title}.ics`,
    data,
    err => {
      if (err) {
        throw err
      }
    })
}

const Calendar = () => {
  ;(async () => {
    const bosses = await getRaidBossesList()

    bosses.length && bosses.forEach(boss => setCalendarICS(
      boss.name,
      boss.respawnStart,
      boss.respawnEnd.getTime()
      ? boss.respawnEnd
      : new Date(boss.respawnStart.getTime() + 18000000)))
  })()

  console.log('Calendar initialization has been completed')
}

module.exports = {
  getCalendarLinks,
  setCalendarICS,
  Calendar
}
