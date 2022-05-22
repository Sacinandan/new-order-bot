const { setRaidBossRespawn } = require('../../../database')
const { setCalendarICS } = require('./calendar')

const HOUR = 3600000
const MINUTE = 60000
const NO_END_RESPAWN_TIME_SHIFT = 5 * HOUR

const OPTIONS = {
    weekday: 'short',
    day: 'numeric',
    month: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
}

const getTimeOfDeath = (minutes) => {
    const now = new Date()

    return now.getTime() - minutes * MINUTE
}

const getTimeOfRespawn = async (minutes, rb) => {
    const tod = getTimeOfDeath(minutes)
    const start = tod + rb.respawn * HOUR

    if (rb.window === 0) {
        await setRaidBossRespawn(rb.id, rb.name, new Date(start), new Date(0))
        setCalendarICS(rb.name, new Date(start), new Date(start + NO_END_RESPAWN_TIME_SHIFT))

        return {
            start,
            end: start + NO_END_RESPAWN_TIME_SHIFT,
            tod: toUTC(tod),
            text: toUTC(start)
        }
    } else {
        const end = start + rb.window * HOUR
        await setRaidBossRespawn(rb.id, rb.name, new Date(start), new Date(end))
        setCalendarICS(rb.name, new Date(start), new Date(end))

        return {
            start,
            end,
            tod: toUTC(tod),
            text: `${toUTC(start)} - ${toUTC(end)}`
        }
    }
}

const toUTC = (ms) => {
    const date = new Date(ms)

    return `${new Date(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      date.getUTCHours(),
      date.getUTCMinutes(),
      date.getUTCSeconds()
    ).toLocaleDateString('en-GB', OPTIONS)} UTC`
}

module.exports = {
    getTimeOfDeath,
    getTimeOfRespawn,
    toUTC,
    HOUR,
    NO_END_RESPAWN_TIME_SHIFT
}
