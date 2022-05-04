const { setRaidBossRespawn } = require('../../../database')
const { setCalendarICS } = require('./calendar')

const HOUR = 3600000

const OPTIONS = {
    weekday: 'short',
    day: 'numeric',
    month: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
}

const getTimeOfDeath = (minutes) => {
    const now = new Date()

    return now.getTime() - minutes * 60000
}

const getTimeOfRespawn = (minutes, rb) => {
    const tod = getTimeOfDeath(minutes)
    const start = tod + rb.respawn * HOUR

    if (rb.window === 0) {
        setRaidBossRespawn(rb.id, rb.name, new Date(start), new Date(0)).then(() => {})
        setCalendarICS(rb.name, new Date(start), new Date(start + 18000000))

        return toUTC(start)
    } else {
        const end = start + rb.window * HOUR
        setRaidBossRespawn(rb.id, rb.name, new Date(start), new Date(end)).then(() => {})
        setCalendarICS(rb.name, new Date(start), new Date(end))

        return `${ toUTC(start) } - ${ toUTC(end) }`
    }
}

const toUTC = (ms) => {
    const date = new Date(ms)

    return `${ new Date(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        date.getUTCHours(),
        date.getUTCMinutes(),
        date.getUTCSeconds()
    ).toLocaleDateString('en-GB', OPTIONS) } UTC`
}

module.exports = {
    getTimeOfDeath,
    getTimeOfRespawn,
    toUTC
}
