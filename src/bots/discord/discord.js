const fs = require('fs')
const path = require('path')
const { Client, Intents, Collection } = require('discord.js')
const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9')

const discord = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_MEMBERS
  ],
  partials: [ 'MESSAGE', 'CHANNEL', 'REACTION' ]
})

discord.commands = new Collection()

const eventFiles = fs
  .readdirSync(path.resolve(__dirname, './events'))
  .filter(file => file.endsWith('.js'))

for (const file of eventFiles) {
  const event = require(`./events/${file}`)
  event.once
  ? discord.once(event.name, (...args) => event.execute(...args, discord))
  : discord.on(event.name, (...args) => event.execute(...args, discord))
}

const commands = []
const commandFiles = fs
  .readdirSync(path.resolve(__dirname, './commands'))
  .filter(file => file.endsWith('.js'))

for (const file of commandFiles) {
  const command = require(`./commands/${file}`)
  commands.push(command.data.toJSON())
  discord.commands.set(command.data.name, command)
}
// es-lint-ignore
const rest = new REST({ version: '9' }).setToken(process.env.TOKEN)

;(async () => {
  try {
    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      { body: commands }
    )
  } catch (error) {
    console.error(error)
  }
})()

const DISCORD = () => {
  discord
    .login(process.env.TOKEN)
    .catch(error => { throw error })
}

module.exports = DISCORD
