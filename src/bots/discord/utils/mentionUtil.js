const { getTelegramUsersList } = require('../../../database')

exports.getTelegramMentions = async (telegramChannelId) => {
    const users = await getTelegramUsersList(telegramChannelId)

    return users.length
           ? users.reduce((acc, user) => acc + `@${user.telegramUsername} `, '')
           : 'Subscribers were not found. Use command /subscribe'
}
