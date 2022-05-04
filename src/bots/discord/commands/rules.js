const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js')

const config = require('../config.json')
const rules = require('../data/rules.json')

module.exports = {
  data: new SlashCommandBuilder()
    .setName(config.rulesTitle)
    .setDescription(config.rulesDescription),
  async execute(interaction) {
    const user = await interaction.member.fetch()

    if (!user.permissions.has('ADMINISTRATOR')) {
      try {
        await interaction.deferReply()
        await interaction.editReply({ content: 'You don\'t have permissions!', ephemeral: true })
      } catch (error) {
        console.error(error)
      }
    } else {
      const row = new MessageActionRow()
        .addComponents(
          new MessageButton()
            .setCustomId('confirm')
            .setLabel('CONFIRM')
            .setStyle('SUCCESS'),
          new MessageButton()
            .setCustomId('deny')
            .setLabel('DENY')
            .setStyle('DANGER')
        )

      const embedMessage = new MessageEmbed()
        .setColor(rules.color)
        .setTitle(rules.title)
        .setDescription(rules.description)
        .setAuthor({
          name: user.displayName,
          url: `https://discordapp.com/users/${ user.id }`,
          iconURL: `https://cdn.discordapp.com/avatars/${ user.id }/${ interaction.user.avatar }.png`
        })
        .setThumbnail(rules.thumbnail)
        .addFields(rules.fields)
        .addField(rules.field.name, rules.field.value, rules.field.inline)
        .setImage(rules.image)
        .setFooter({
          text: rules.footer.text,
          iconURL: rules.footer.image
        })

      try {
        await interaction.deferReply()
        await interaction.editReply({ embeds: [ embedMessage ], components: [ row ] })
      } catch (error) {
        console.error(error)
      }
    }
  }
}
