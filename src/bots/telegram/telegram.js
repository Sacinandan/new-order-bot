const TelegramBot = require('node-telegram-bot-api')
const config = require('../discord/config.json')
const { getTelegramMentions } = require('../discord/utils/mentionUtil')
const raidBosses = require('../discord/data/rb.json')
const { getRespawnList, getRespawn } = require('../discord/utils/respawnUtil')
const { getRaidBossRespawn, setTelegramUser, deleteTelegramUser } = require('../../database')
const { getCalendarLinks } = require('../discord/utils/calendar')

const title = process.env.TELEGRAM_BOT_TITLE
const telegram = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true })

telegram.setMyCommands([
  {
    command: '/help',
    description: 'Information about bot functionality'
  },
  {
    command: config.respawnTitle,
    description: config.respawnDescription
  },
  {
    command: '/subscribe',
    description: 'Subscribe for @everyone mentioning'
  },
  {
    command: '/unsubscribe',
    description: 'Unsubscribe from @everyone mentioning'
  }
])
        .then(() => telegram.getMe()
                            .then(res => console.log(`Telegram bot ${res.username} is running!`)))
        .catch(err => { throw err})

const TELEGRAM = () => {
  telegram.on('message', async (msg) => {
    try {
      if (msg && msg.text && !msg.from.is_bot && msg.chat) {
        if (/@everyone/.test(msg.text)) {
          await telegram.sendMessage(msg.chat.id, await getTelegramMentions(msg.chat.id))
        } else if (msg.text === `/${config.respawnTitle}${title}` || msg.text === `/${config.respawnTitle}`) {
          const buttons = raidBosses.map(rb => ({
            text: rb.name
          }))

          const rows = []
          let row = []

          buttons.forEach((button, idx) => {
            if (idx === 0) {
              row.push({ text: 'All' })
            }

            row.push(button)

            if (idx % 3 === 0) {
              rows.push(row)
              row = []
            }
          })

          await telegram.sendMessage(msg.chat.id, 'Select Raid Boss', {
            reply_markup: {
              keyboard: [
                ...rows
              ],
              resize_keyboard: true,
              one_time_keyboard: true,
              force_reply: true
            }
          })
        } else if (msg.text === `All${title}` || msg.text === 'All') {

          await telegram.sendMessage(msg.chat.id, await getRespawnList())
        } else if (raidBosses.find(rb => rb.name === msg.text)) {
          const result = await getRespawn(msg.text)
          const data = await getRaidBossRespawn(msg.text)

          const calendar = getCalendarLinks(
            msg.text,
            data.respawnStart,
            data.respawnEnd)

          await telegram.sendMessage(msg.chat.id, result, {
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: 'GCal',
                    url: calendar.google
                  },
                  {
                    text: 'iCal (.ics)',
                    url: calendar.apple
                  },
                  {
                    text: 'Office 365',
                    url: calendar.office365
                  },
                  {
                    text: 'Outlook',
                    url: calendar.outlook
                  },
                  {
                    text: 'Yahoo',
                    url: calendar.yahoo
                  }
                ]
              ]
            }
          })
        } else if (msg.text === `/subscribe${title}` || msg.text === '/subscribe') {
          setTelegramUser(msg.from.id, msg.from.username, msg.chat.id, true)
            .then(async () => await telegram.sendMessage(msg.chat.id,
              `@${msg.from.username} has been subscribed successfully!`))
            .catch(async () => await telegram.sendMessage(msg.chat.id,
              `Error! @${msg.from.username} has not been subscribed!`))
        } else if (msg.text === `/unsubscribe${title}` || msg.text === '/unsubscribe') {
          setTelegramUser(msg.from.id, msg.from.username, msg.chat.id, false)
            .then(async () => await telegram.sendMessage(msg.chat.id,
              `@${msg.from.username} has been unsubscribed successfully!`))
            .catch(async () => await telegram.sendMessage(msg.chat.id,
              `Error! @${msg.from.username} has not been unsubscribed!`))
        } else if (msg.text === `/start${title}` || msg.text === '/start') {

          await telegram.sendMessage(msg.chat.id, `Hi @${msg.from.username}! Use /help for details`)
        } else if (msg.text === `/help${title}` || msg.text === '/help') {

          await telegram.sendMessage(msg.chat.id,
            `Hi @${msg.from.username}, let's check the commands list!
/${config.respawnTitle} - displays dates and time of next Raid Bosses respawn
/subscribe - subscribes you for mentioning
/unsubscribe - unsubscribes you from mentioning
@everyone - mentions subscribed users`)
        } else if (msg.text.startsWith('/')) {
          await telegram.sendMessage(msg.chat.id, 'Command was not found. Use /help for more information')
        }
      } else if (msg.left_chat_participant && !msg.left_chat_participant.is_bot && msg.chat) {
        deleteTelegramUser(msg.left_chat_participant.id)
          .then(async (res) => await telegram.sendMessage(msg.chat.id, res))
      }
    }
    catch (err) {
      console.log(err)
    }
  })
}

module.exports = TELEGRAM
