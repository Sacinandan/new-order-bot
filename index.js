const API = require('./src/server/app')
const Discord = require('./src/bots/discord/discord')
const Telegram = require('./src/bots/telegram/telegram')
const { Calendar } = require('./src/bots/discord/utils/calendar')

//  Server API
API()

//  Discord Bot
Discord()

//  Telegram Bot
Telegram()

//  Calendar Initialization
Calendar()
