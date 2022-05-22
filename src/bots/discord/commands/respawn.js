const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js')

const { getRespawnList, getRespawn } = require('../utils/respawnUtil')
const { getCalendarLinks } = require('../utils/calendar')
const { setRaidBossesOption } = require('../utils/optionUtil')
const { getRaidBossRespawn } = require('../../../database')
const config = require('../config.json')

module.exports = {
  data: new SlashCommandBuilder()
    .setName(config.respawnTitle)
    .setDescription(config.respawnDescription)
    .addStringOption(option => setRaidBossesOption(
      option,
      config.raidBossNameOptionTitle,
      config.raidBossNameOptionDescription,
      false)),
  async execute (interaction, client) {
    try {
      await interaction.deferReply({ ephemeral: true })
      const name = interaction.options.getString(config.raidBossNameOptionTitle)
      //const user = await interaction.member.fetch()
      //console.log(user)

      if (name) {
        const result = await getRespawn(name)
        const data = await getRaidBossRespawn(name)

        const embedMessage = new MessageEmbed()
          .setColor('GREEN')
          .setTitle(result)
          .setAuthor({
            name: 'NO Ally Organizer',
            url: `https://discordapp.com/users/860406221550518282`,
            iconURL: `https://cdn.discordapp.com/icons/846849850480918608/95379abcde5bbe85a8269cc9a92d6036.png`
          })
          .setTimestamp()

        const calendar = getCalendarLinks(
          name,
          data.respawnStart,
          data.respawnEnd
        )

        const row = new MessageActionRow()
          .addComponents(
            new MessageButton()
              .setURL(calendar.google)
              .setLabel('GCal')
              .setStyle('LINK'),
            new MessageButton()
              .setURL(calendar.apple)
              .setLabel('iCal (.ics)')
              .setStyle('LINK'),
            new MessageButton()
              .setURL(calendar.office365)
              .setLabel('Office 365')
              .setStyle('LINK'),
            new MessageButton()
              .setURL(calendar.outlook)
              .setLabel('Outlook')
              .setStyle('LINK'),
            new MessageButton()
              .setURL(calendar.yahoo)
              .setLabel('Yahoo')
              .setStyle('LINK')
          )

        await client.users.cache
                    .get(interaction.user.id)
                    .send({
                      embeds: [embedMessage],
                      components: [row]
                    })

        await interaction.editReply('Check your private messages')
      } else {
        const result = await getRespawnList()
        await interaction.editReply(result)
      }
    }
    catch (error) {
      console.error(error)
    }
  }
}
