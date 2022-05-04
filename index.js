const API = require('./src/server/app')
const DISCORD = require('./src/bots/discord/discord')
const TELEGRAM = require('./src/bots/telegram/telegram')
const { CALENDAR } = require('./src/bots/discord/utils/calendar')

//  Server API
API()

//  Discord Bot
DISCORD()

//  Telegram Bot
TELEGRAM()

//  Initialization
CALENDAR()
