const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')

const config = require('../config.json')
const welcome = require('../data/welcome.json')

module.exports = {
  data: new SlashCommandBuilder()
    .setName(config.welcomeTitle)
    .setDescription(config.welcomeDescription),
  async execute (interaction) {
    const user = await interaction.member.fetch()

    if (!user.permissions.has('ADMINISTRATOR')) {
      try {
        await interaction.deferReply()
        await interaction.editReply({ content: 'You don\'t have permissions!', ephemeral: true })
      }
      catch (error) {
        console.error(error)
      }
    } else {
      const embedMessage = new MessageEmbed()
        .setColor(welcome.color)
        .setTitle(welcome.title)
        .setDescription(welcome.description)
        .setAuthor({
          name: user.displayName,
          url: `https://discordapp.com/users/${user.id}`,
          iconURL: `https://cdn.discordapp.com/avatars/${user.id}/${interaction.user.avatar}.png`
        })

      try {
        await interaction.deferReply()
        await interaction.editReply({ embeds: [embedMessage] })
      }
      catch (error) {
        console.error(error)
      }
    }
  }
}
