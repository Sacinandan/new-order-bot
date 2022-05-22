const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')

const { getTimeOfRespawn, HOUR } = require('../utils/timeUtil.js')
const { getDropInfo } = require('../utils/dropUtil.js')
const { getColor } = require('../utils/colorUtil.js')
const { setRaidBossesOption } = require('../utils/optionUtil')
const config = require('../config.json')
const raidBosses = require('../data/rb.json')

module.exports = {
  data: new SlashCommandBuilder()
    .setName(config.timeOfDeathTitle)
    .setDescription(config.timeOfDeathDescription)
    .addStringOption(option => setRaidBossesOption(
      option,
      config.raidBossNameOptionTitle,
      config.raidBossNameOptionDescription,
      true))
    .addStringOption(option =>
      option.setName(config.timeOfDeathAllianceOptionTitle)
            .setDescription(config.timeOfDeathAllianceOptionDescription)
            .setRequired(true)
            .addChoices({ name: 'new order', value: 'New Order' })
            .addChoices({ name: 'insane', value: 'Insane' })
            .addChoices({ name: 'other', value: 'other' }))
    .addIntegerOption(option =>
      option.setName(config.timeOfDeathMinutesOptionTitle)
            .setDescription(config.timeOfDeathMinutesOptionDescription)
            .setRequired(false))
    .addBooleanOption(option =>
      option.setName(config.timeOfDeathDropOptionTitle)
            .setDescription(config.timeOfDeathDropOptionDescription)
            .setRequired(false)),
  async execute (interaction) {
    try {
      await interaction.deferReply({ ephemeral: true })
      const name = interaction.options.getString(config.raidBossNameOptionTitle)
      const boss = raidBosses.find(b => b.name === name)
      const { chance } = boss
      const alliance = interaction.options.getString(config.timeOfDeathAllianceOptionTitle)
      const minutes = interaction.options.getInteger(config.timeOfDeathMinutesOptionTitle) || 0
      const isDrop = chance === 100 || interaction.options.getBoolean(config.timeOfDeathDropOptionTitle)
      const user = await interaction.member.fetch()
      const respawn = await getTimeOfRespawn(minutes, boss)

      const result = `
DEATH: ${name} [${alliance}] ${respawn.tod} ${getDropInfo(isDrop, chance)}
RESPAWN: ${respawn.text}`

      const embedMessage = new MessageEmbed()
        .setColor(getColor(alliance, isDrop, chance))
        .setTitle(result)
        .setAuthor({
          name: user.displayName,
          url: `https://discordapp.com/users/${user.id}`,
          iconURL: `https://cdn.discordapp.com/avatars/${user.id}/${interaction.user.avatar}.png`
        })
        .setTimestamp()
      const bossChannel = await interaction.guild.channels.cache.find(ch => ch.name === boss.channel)
      const bossChannelService = await interaction.guild.channels.fetch(bossChannel.id)
      await bossChannelService.send({ embeds: [embedMessage] })

      const eventsList = await interaction.guild.scheduledEvents.fetch()
      const prevEvent = eventsList.find(event => event.name === name)

      if (prevEvent?.isActive()) {
        await prevEvent.setStatus('COMPLETED')
      } else if (prevEvent?.isScheduled()) {
        await interaction.guild.scheduledEvents.delete(prevEvent.id)
      }

      const event = {
        name,
        description: `
Start gathering a Command Channel for ${name}.
Respawn: ${respawn.text}`,
        scheduledStartTime: respawn.start - HOUR,
        scheduledEndTime: respawn.end,
        privacyLevel: 'GUILD_ONLY',
        entityType: 'EXTERNAL',
        entityMetadata: { location: 'L2 Reborn x1' }
        // image: imageURI 800x400 px
      }

      const channel = await interaction.guild.channels.cache.find(ch => ch.name === config.mainChannel)
      const mainChannelService = await interaction.guild.channels.fetch(channel.id)
      const scheduledEvent = await interaction.guild.scheduledEvents.create(event)
      const url = await scheduledEvent.createInviteURL({ channel })
      await mainChannelService.send(url)

      await interaction.editReply(result)
    }
    catch (error) {
      console.error(error)
    }
  }
}
