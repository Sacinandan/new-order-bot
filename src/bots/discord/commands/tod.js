const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')

const { getTimeOfDeath, getTimeOfRespawn } = require('../utils/timeUtil.js')
const { getDropInfo } = require('../utils/dropUtil.js')
const { getColor } = require('../utils/colorUtil.js')
const { setRaidBossesOption } = require('../utils/optionUtil')
const { toUTC } = require('../utils/timeUtil')
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
            .addChoice('new order', 'New Order')
            .addChoice('insane', 'Insane')
            .addChoice('other', 'other'))
    .addIntegerOption(option =>
      option.setName(config.timeOfDeathMinutesOptionTitle)
            .setDescription(config.timeOfDeathMinutesOptionDescription)
            .setRequired(false))
    .addBooleanOption(option =>
      option.setName(config.timeOfDeathDropOptionTitle)
            .setDescription(config.timeOfDeathDropOptionDescription)
            .setRequired(false)),
  async execute(interaction) {
    try {
      await interaction.deferReply({ ephemeral: true })
      const name = interaction.options.getString(config.raidBossNameOptionTitle)
      const boss = raidBosses.find(b => b.name === name)
      const alliance = interaction.options.getString(config.timeOfDeathAllianceOptionTitle)
      const minutes = interaction.options.getInteger(config.timeOfDeathMinutesOptionTitle) || 0
      const isDrop = boss.chance === 100
                     || interaction.options.getBoolean(config.timeOfDeathDropOptionTitle)
      const user = await interaction.member.fetch()

      const result = `
DEATH: ${ name } [${ alliance }] ${ toUTC(getTimeOfDeath(minutes)) } ${ getDropInfo(isDrop, boss.chance) }
RESPAWN: ${ getTimeOfRespawn(minutes, boss) }`

      const embedMessage = new MessageEmbed()
        .setColor(getColor(alliance, isDrop, boss.chance))
        .setTitle(result)
        .setAuthor({
          name: user.displayName,
          url: `https://discordapp.com/users/${ user.id }`,
          iconURL: `https://cdn.discordapp.com/avatars/${ user.id }/${ interaction.user.avatar }.png`
        })
        .setTimestamp()

      await interaction.editReply(result)
      const chn = interaction.guild.channels.cache.find(ch => ch.name === boss.channel)
      const channel = await interaction.guild.channels.fetch(chn.id)
      await channel.send({ embeds: [ embedMessage ] })
    } catch (error) {
      console.error(error)
    }
  }
}
