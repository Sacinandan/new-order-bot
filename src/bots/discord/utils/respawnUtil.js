const { getRaidBossesRespawnList, getRaidBossRespawn  } = require('../../../database')
const { toUTC } = require('./timeUtil')

exports.getRespawnList = async () => {
    const data = await getRaidBossesRespawnList()
    let result = 'Respawn schedule:'

    data.length && data.forEach(res => result += `
${ res.name }: ${ toUTC(res.respawnStart.getTime()) }${ res.respawnEnd.getTime()
    ? ' - ' + toUTC(res.respawnEnd.getTime())
    : ''}`)
    return result
}

exports.getRespawn = async (name) => {
    const data = await getRaidBossRespawn(name)
    let result = `${ name } respawn was not found`

    data && (result = `${ data.name } respawn:
${ toUTC(data.respawnStart.getTime()) }${ data.respawnEnd.getTime()
        ? ' - ' + toUTC(data.respawnEnd.getTime())
        : ''}`)
    return result
}
